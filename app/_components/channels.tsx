"use client";

import { Eyebrow } from "./eyebrow";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Reveal, spring } from "./motion";
import { MiniThread, type ChannelId } from "./phone-skins";

type Channel = {
  name: string;
  body: string;
  icon: ReactNode;
  /** Which part of the dotted world map shows through the card (background-position). */
  map: string;
  /** Resting tilt, degrees. */
  tilt: number;
  /** Mobile chat preview shown inside the card. */
  preview?: ChannelId;
};

// Channels as listed on stepsai.co
const CHANNELS: Channel[] = [
  { name: "Website", body: "A chat widget on every page, answering from your own content.", icon: <IconGlobe />, map: "14% 18%", tilt: -3 },
  { name: "WhatsApp", body: "Answers, order updates and cart nudges where customers already are.", icon: <IconBubble />, map: "31% 88%", tilt: 2.5, preview: "whatsapp" },
  { name: "Instagram", body: "DMs and story replies handled the moment they land.", icon: <IconCamera />, map: "50% 10%", tilt: -2, preview: "instagram" },
  { name: "Slack", body: "Your team asks the same agent, right inside their channels.", icon: <IconHash />, map: "50% 72%", tilt: 3 },
  { name: "Teams", body: "Internal answers for staff, without leaving Microsoft Teams.", icon: <IconTeams />, map: "74% 26%", tilt: -2.5 },
  { name: "Gmail", body: "Support email triaged and answered with the same context.", icon: <IconMail />, map: "92% 86%", tilt: 2 },
];

/*
 * Desktop layout is a snake across two rows: 01 → 02 → 03, loop round the
 * right edge, then 04 → 05 → 06 back to the left. Grid placement + a little
 * vertical stagger per card gives the scattered "pinned to a board" feel.
 */
const PLACE = [
  "lg:col-start-1 lg:row-start-1 lg:mt-24",
  "lg:col-start-2 lg:row-start-1 lg:mt-4",
  "lg:col-start-3 lg:row-start-1 lg:mt-16",
  "lg:col-start-3 lg:row-start-2 lg:mt-20",
  "lg:col-start-2 lg:row-start-2 lg:mt-36",
  "lg:col-start-1 lg:row-start-2 lg:mt-12",
];

export function Channels() {
  const board = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [route, setRoute] = useState<{ d: string; w: number; h: number } | null>(null);
  const reduce = useReducedMotion();

  // Draw the dashed route once, as the board comes into view.
  const inView = useInView(board, { once: true, margin: "0px 0px -25% 0px" });

  useLayoutEffect(() => {
    const el = board.current;
    if (!el) return;
    const measure = () => {
      if (window.innerWidth < 1024) return setRoute(null);
      // offsetLeft/Top ignore transforms, so tilts and entrance motion don't skew the route
      const pts = cards.current.map((c) => (c ? { x: c.offsetLeft + c.offsetWidth / 2, y: c.offsetTop + c.offsetHeight / 2, w: c.offsetWidth } : null));
      if (pts.some((p) => !p)) return;
      const p = pts as { x: number; y: number; w: number }[];
      const W = el.clientWidth;
      const loop = (p[2].w / 2) + 70; // how far the bend swings past the right column
      let d = `M ${-40} ${p[0].y - 120} C ${p[0].x - 160} ${p[0].y - 120}, ${p[0].x - 200} ${p[0].y}, ${p[0].x} ${p[0].y}`;
      d += ` C ${p[0].x + 160} ${p[0].y}, ${p[1].x - 160} ${p[1].y}, ${p[1].x} ${p[1].y}`;
      d += ` C ${p[1].x + 160} ${p[1].y}, ${p[2].x - 160} ${p[2].y}, ${p[2].x} ${p[2].y}`;
      d += ` C ${p[2].x + loop * 1.4} ${p[2].y}, ${p[3].x + loop * 1.4} ${p[3].y}, ${p[3].x} ${p[3].y}`;
      d += ` C ${p[3].x - 160} ${p[3].y}, ${p[4].x + 160} ${p[4].y}, ${p[4].x} ${p[4].y}`;
      d += ` C ${p[4].x - 160} ${p[4].y}, ${p[5].x + 160} ${p[5].y}, ${p[5].x} ${p[5].y}`;
      d += ` C ${p[5].x - 200} ${p[5].y}, ${p[5].x - 160} ${p[5].y + 140}, ${-40} ${p[5].y + 150}`;
      setRoute({ d, w: W, h: el.clientHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section id="channels" className="relative scroll-mt-16 overflow-hidden px-5 pt-12 pb-16 sm:px-8 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-xl lg:max-w-none">
            <Eyebrow>Deploy everywhere</Eyebrow>
            <h2 className="text-title mt-4 lg:whitespace-nowrap">One agent. Every channel.</h2>
            <p className="text-lede mt-5 max-w-[34rem] text-fg-muted">
              Build your knowledge base once and deploy it to every touchpoint — the
              same brain, so context carries across channels.
            </p>
          </Reveal>
          <Reveal index={1} className="flex gap-10 font-mono text-[0.8125rem] text-fg-muted">
            <span><span className="font-pixel text-[1.75rem] text-fg">&lt;5s</span> response time</span>
            <span><span className="font-pixel text-[1.75rem] text-fg">24/7</span> always on</span>
          </Reveal>
        </div>

        <div ref={board} className="relative mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-10">
          {route && (
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={route.w}
              height={route.h}
              viewBox={`0 0 ${route.w} ${route.h}`}
              fill="none"
            >
              <defs>
                <linearGradient id="route-ink" x1="0" y1="0" x2={route.w} y2={route.h} gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#2C9CF4" stopOpacity="0.9" />
                  <stop offset="0.55" stopColor="#2C9CF4" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#0C3474" stopOpacity="0.3" />
                </linearGradient>
                <mask id="route-draw" maskUnits="userSpaceOnUse" x="-200" y="-200" width={route.w + 400} height={route.h + 400}>
                  <motion.path
                    d={route.d}
                    stroke="white"
                    strokeWidth="6"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: inView || reduce ? 1 : 0 }}
                    transition={{ duration: 2.6, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
                  />
                </mask>
              </defs>
              <path d={route.d} stroke="url(#route-ink)" strokeWidth="1.75" strokeDasharray="7 7" strokeLinecap="round" mask="url(#route-draw)" />
            </svg>
          )}

          {CHANNELS.map((c, i) => (
            <PinnedCard
              key={c.name}
              ref={(n) => { cards.current[i] = n; }}
              channel={c}
              index={i}
              className={PLACE[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PinnedCard({
  channel: c,
  index,
  className,
  ref,
}: {
  channel: Channel;
  index: number;
  className: string;
  ref: (n: HTMLElement | null) => void;
}) {
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40, rotate: c.tilt * 2.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: c.tilt }}
      whileHover={{ rotate: 0, y: -6, transition: spring }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ ...spring, delay: (index % 3) * 0.1 }}
      className={`pin-card relative mx-auto aspect-[4/5] w-full max-w-[17rem] ${className}`}
    >
      {/* Pin */}
      <span aria-hidden className="absolute -top-5 left-[62%] z-10 flex flex-col items-center">
        <span className="pin-head grid size-10 place-items-center rounded-full text-white">{c.icon}</span>
        <span className="-mt-1 h-3 w-[2px] rounded-full bg-fg/35" />
      </span>

      <div className="flex h-full flex-col overflow-hidden rounded-[10px] border border-dashed border-fg/15 bg-surface p-6">
        <div aria-hidden className="pin-map absolute inset-0 rounded-[10px]" style={{ backgroundPosition: c.map }} />
        <p className="relative font-pixel text-[1.75rem] leading-none text-fg">
          <span className="text-fg-subtle">{"//"}</span>{String(index + 1).padStart(2, "0")}
        </p>
        {c.preview && (
          <div className="relative mt-5">
            <MiniThread channel={c.preview} />
          </div>
        )}
        <div className="relative mt-auto pt-4">
          <h3 className="text-headline">{c.name}</h3>
          <p className="mt-1.5 text-[0.875rem] text-pretty text-fg-muted">{c.body}</p>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Icons (1.5px stroke, currentColor) ─────────────────────────────── */

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

function IconGlobe() {
  return <Icon><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z" /></Icon>;
}
function IconBubble() {
  return <Icon><path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6L4.5 19.5Z" /></Icon>;
}
function IconCamera() {
  return <Icon><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.75" /><circle cx="16.9" cy="7.1" r=".6" fill="currentColor" /></Icon>;
}
function IconHash() {
  return <Icon><path d="M9 4 7.5 20M16.5 4 15 20M4.5 9h15.5M4 15h15.5" /></Icon>;
}
function IconTeams() {
  return <Icon><rect x="3.5" y="6" width="11" height="12" rx="2.5" /><path d="M6.5 9.5h5M9 9.5v5.5" /><circle cx="18" cy="8" r="2" /><path d="M16.5 12h3a1.5 1.5 0 0 1 1.5 1.5V16a3 3 0 0 1-4.5 2.6" /></Icon>;
}
function IconMail() {
  return <Icon><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></Icon>;
}
