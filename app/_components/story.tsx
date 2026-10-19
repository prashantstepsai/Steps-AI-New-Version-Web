"use client";

import { Eyebrow } from "./eyebrow";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

const STEPS = [
  {
    key: "Connect",
    title: "Connect your website.",
    body: "Paste your URL. We crawl your pages, docs and FAQs and turn them into a knowledge base.",
    detail: "Sources · website pages, documents, Google Drive, Notion",
    fig: "1,240 chunks embedded · knowledge ready",
  },
  {
    key: "Make it yours",
    title: "Make it yours.",
    body: "Pick a persona, match your brand colors, and connect your tools — Shopify, HubSpot, Calendly — so the agent can take action.",
    detail: "Actions · orders, bookings, messages, records",
    fig: "3 tools connected",
  },
  {
    key: "Go live",
    title: "Go live everywhere.",
    body: "One click deploys to your website, WhatsApp, Instagram and more. Your agent could be live before your next meeting.",
    detail: "Channels · website, WhatsApp, Instagram, Slack, Teams, Gmail",
    fig: "6 channels live",
  },
];

// Figure geometry (viewBox 480 × 340, agent orb at the centre).
// Every state uses the same two columns either side of the agent, so pills
// never crowd each other or the connectors.
const CX = 240;
const CY = 170;
const LX = 80; // left column centre
const RX = 400; // right column centre
const PW = 124; // pill width
const ROWS3 = [106, 170, 234];
const SOURCES = ["Website", "Documents", "Google Drive", "Notion"].map((label, i) => ({ label, x: LX, y: 74 + i * 64 }));
const TOOLS = ["Shopify", "HubSpot", "Calendly"].map((label, i) => ({ label, x: RX, y: ROWS3[i] }));
const CHANNELS = [
  ...["Website", "WhatsApp", "Instagram"].map((label, i) => ({ label, x: LX, y: ROWS3[i] })),
  ...["Slack", "Teams", "Gmail"].map((label, i) => ({ label, x: RX, y: ROWS3[i] })),
];

// Connector from a pill's inner edge to the orb's edge
const toOrb = (x: number, y: number) =>
  x < CX
    ? `M ${x + PW / 2} ${y} C ${x + PW / 2 + 46} ${y}, ${CX - 86} ${CY}, ${CX - 42} ${CY}`
    : `M ${CX + 42} ${CY} C ${CX + 86} ${CY}, ${x - PW / 2 - 46} ${y}, ${x - PW / 2} ${y}`;

/**
 * Sticky figure on the left, steps scrolling on the right. One scrubbed
 * GSAP timeline reshapes the figure between three states as each step
 * passes the centre of the viewport.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const marks = q("[data-idx]") as HTMLElement[];
      const dots = q("[data-upto]") as HTMLElement[];
      const segs = [0, 1, 2].map((i) => q(`[data-seg="${i}"]`)[0] as HTMLElement);
      const rail = q("[data-rail]")[0] as HTMLElement;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Progress UI follows the figure's own clock (0 → 3, one unit per step),
      // so the bars, labels, dots and rail can never disagree with the drawing.
      let current = -1;
      const sync = (t: number) => {
        segs.forEach((seg, i) => gsap.set(seg, { scaleX: gsap.utils.clamp(0, 1, t - i) }));
        gsap.set(rail, { scaleY: gsap.utils.clamp(0, 1, t / 3) });
        const active = Math.min(2, Math.max(0, Math.floor(t)));
        if (active === current) return;
        current = active;
        for (const el of marks) el.dataset.active = String(Number(el.dataset.idx) === active);
        for (const el of dots) el.dataset.on = String(Number(el.dataset.upto) <= active);
      };
      sync(0);

      // ── The figure morph ───────────────────────────────────────────────
      const src = q("[data-src]");
      const srcLines = q("[data-src-line]");
      const tools = q("[data-tool]");
      const toolLines = q("[data-tool-line]");
      const chans = q("[data-chan]");
      const spokes = q("[data-spoke]");
      const orb = q("[data-orb]");

      gsap.set([...srcLines, ...toolLines, ...spokes], { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(src, { opacity: 0, x: -20 });
      gsap.set(tools, { opacity: 0, x: 20 });
      gsap.set(chans, { opacity: 0, scale: 0.5, x: (i) => CX - CHANNELS[i].x, y: (i) => CY - CHANNELS[i].y, transformOrigin: "50% 50%" });

      const into = (items: { x: number; y: number }[]) => ({
        opacity: 0,
        scale: 0.5,
        x: (i: number) => CX - items[i].x,
        y: (i: number) => CY - items[i].y,
        transformOrigin: "50% 50%",
      });

      // Each state fully leaves before the next arrives, and every build
      // finishes before t = 3 (the end of the scroll range) — no overlap.
      const tl = gsap
        .timeline({ defaults: { ease: "power2.inOut" }, paused: true })
        // Step 1 · sources slide in and feed the agent
        .to(src, { opacity: 1, x: 0, stagger: 0.07, duration: 0.45 }, 0)
        .to(srcLines, { strokeDashoffset: 0, stagger: 0.07, duration: 0.45 }, 0.12)
        // → Step 2 · sources are absorbed …
        .to(srcLines, { strokeDashoffset: -1, duration: 0.25 }, 0.95)
        .to(src, { ...into(SOURCES), stagger: 0.03, duration: 0.35 }, 1.0)
        .to(orb, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }, 1.3)
        // … then tools plug in on the right
        .to(tools, { opacity: 1, x: 0, stagger: 0.06, duration: 0.4 }, 1.35)
        .to(toolLines, { strokeDashoffset: 0, stagger: 0.06, duration: 0.35 }, 1.45)
        // → Step 3 · tools tuck in …
        .to(toolLines, { strokeDashoffset: 1, duration: 0.25 }, 1.95)
        .to(tools, { ...into(TOOLS), stagger: 0.03, duration: 0.35 }, 2.0)
        .to(orb, { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }, 2.22)
        // … and channels deal out into both columns
        .to(chans, { opacity: 1, scale: 1, x: 0, y: 0, stagger: 0.035, duration: 0.35, ease: "power3.out" }, 2.3)
        .to(spokes, { strokeDashoffset: 0, stagger: 0.035, duration: 0.3 }, 2.4)
        // Smooth orbit turn the whole way through; also pins the length to exactly 3
        .fromTo(q("[data-ring]"), { rotation: 0 }, { rotation: 300, ease: "none", duration: 3, svgOrigin: `${CX} ${CY}` }, 0);

      const steps = q("[data-steps]")[0];
      if (reduce) {
        // No morphing: show the finished figure, keep the progress UI honest
        tl.progress(1);
        ScrollTrigger.create({ trigger: steps, start: "top 80%", end: "bottom 80%", onUpdate: (self) => sync(self.progress * 3) });
      } else {
        // A step's build finishes as it reaches the centre of the viewport
        const proxy = { t: 0 };
        gsap.to(proxy, {
          t: 3,
          ease: "none",
          scrollTrigger: { trigger: steps, start: "top 80%", end: "bottom 80%", scrub: 0.8 },
          onUpdate: () => {
            tl.time(proxy.t);
            sync(proxy.t);
          },
        });
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} id="how" className="scroll-mt-16 px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl lg:max-w-none">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="text-title mt-4 lg:whitespace-nowrap">From URL to live agent in 3 steps.</h2>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          {/* ── Sticky figure ─────────────────────────────────────────── */}
          <div className="sticky top-16 z-10 -mx-5 h-fit bg-bg/90 px-5 pt-2 pb-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-24 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.12em] text-fg-subtle uppercase">
              <span>From URL to live agent</span>
              <span className="normal-case tracking-normal">illustrative</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden>
              {STEPS.map((s, i) => (
                <div key={s.key}>
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div data-seg={i} style={{ transform: "scaleX(0)" }} className="h-full origin-left rounded-full bg-sky" />
                  </div>
                  <p
                    data-idx={i}
                    className="mt-2 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-subtle uppercase transition-colors duration-300 data-[active=true]:text-fg"
                  >
                    {s.key}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[28px] bg-surface p-2 shadow-md">
              <div className="relative overflow-hidden rounded-[20px] bg-surface-2 [background-image:radial-gradient(oklch(0.34_0.119_260/0.1)_1px,transparent_1px)] [background-size:18px_18px]">
                <div className="absolute inset-x-4 top-3 flex justify-between font-mono text-[0.6875rem] text-fg-subtle sm:inset-x-5 sm:top-4">
                  <span className="grid">
                    {STEPS.map((_, i) => (
                      <span key={i} data-idx={i} className="col-start-1 row-start-1 opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100">
                        Fig 1.{i + 1}
                      </span>
                    ))}
                  </span>
                  <span className="tracking-[0.12em] uppercase">Agent</span>
                </div>

                <Figure />

                <div className="absolute inset-x-4 bottom-3 flex justify-between font-mono text-[0.6875rem] text-fg-subtle sm:inset-x-5 sm:bottom-4">
                  <span className="tracking-[0.12em] uppercase max-sm:hidden">Scroll to build</span>
                  <span className="grid text-fg-muted sm:text-right">
                    {STEPS.map((s, i) => (
                      <span key={i} data-idx={i} className="col-start-1 row-start-1 opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100">
                        {s.fig}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Scrolling steps ───────────────────────────────────────── */}
          <div data-steps className="relative pl-9">
            <div aria-hidden className="absolute top-0 bottom-0 left-[5px] w-px bg-line">
              <div data-rail style={{ transform: "scaleY(0)" }} className="h-full w-full origin-top bg-sky" />
            </div>
            {STEPS.map((s, i) => (
              <article key={s.key} data-step className="relative flex min-h-[60svh] flex-col justify-center py-10 lg:min-h-[70svh]">
                <span
                  aria-hidden
                  data-upto={i}
                  className="absolute top-1/2 -left-9 size-[11px] -translate-y-1/2 rounded-full border border-fg-subtle bg-bg transition-[background-color,border-color,box-shadow,scale] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] data-[on=true]:scale-125 data-[on=true]:border-sky data-[on=true]:bg-sky data-[on=true]:shadow-[0_0_0_5px_var(--ice)]"
                />
                <p className="font-mono text-[0.8125rem] text-fg-subtle tabular-nums">
                  <span className="text-fg">{String(i + 1).padStart(2, "0")}</span> / 03
                </p>
                <h3 className="font-pixel mt-4 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-[1.1] text-balance">
                  {s.title}
                </h3>
                <p className="text-lede mt-4 max-w-[30rem] text-fg-muted">{s.body}</p>
                <div className="mt-8 max-w-[30rem] border-t border-line pt-5 font-mono text-[0.75rem] tracking-[0.04em] text-fg-subtle">
                  {s.detail}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Figure() {
  return (
    <svg viewBox="0 0 480 340" className="block h-auto w-full" role="img" aria-label="Diagram: knowledge sources feed the Steps AI agent, tools connect to it, and it answers across six channels.">
      <defs>
        <radialGradient id="orb" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="oklch(0.5 0.12 258)" />
          <stop offset="1" stopColor="var(--primary)" />
        </radialGradient>
      </defs>

      {/* Connectors */}
      <g fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round">
        {SOURCES.map((s) => (
          <path key={s.label} data-src-line pathLength={1} d={toOrb(s.x, s.y)} />
        ))}
        {TOOLS.map((t) => (
          <path key={t.label} data-tool-line pathLength={1} d={toOrb(t.x, t.y)} />
        ))}
        {CHANNELS.map((c) => (
          <path key={c.label} data-spoke pathLength={1} d={toOrb(c.x, c.y)} />
        ))}
      </g>

      {/* Agent */}
      <g data-ring>
        <circle cx={CX} cy={CY} r="56" fill="none" stroke="var(--sky)" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
        <circle cx={CX + 56} cy={CY} r="4" fill="var(--sky)" />
      </g>
      <g data-orb>
        <circle cx={CX} cy={CY} r="38" fill="url(#orb)" />
        <circle cx={CX} cy={CY} r="38" fill="none" stroke="oklch(1 0 0 / 0.35)" />
        <g fill="white" transform={`translate(${CX - 12} ${CY - 12}) scale(1.5)`}>
          <rect x="1" y="10" width="4" height="5" rx="1.25" />
          <rect x="6" y="6" width="4" height="9" rx="1.25" />
          <rect x="11" y="1" width="4" height="14" rx="1.25" />
        </g>
      </g>

      <Pills items={SOURCES} attr="data-src" w={PW} />
      <Pills items={TOOLS} attr="data-tool" w={PW} />
      <Pills items={CHANNELS} attr="data-chan" w={PW} accent />
    </svg>
  );
}

function Pills({
  items,
  attr,
  w,
  accent,
}: {
  items: { label: string; x: number; y: number }[];
  attr: string;
  w: number;
  accent?: boolean;
}) {
  return (
    <>
      {items.map((p) => (
        <g key={p.label} {...{ [attr]: "" }}>
          <rect
            x={p.x - w / 2}
            y={p.y - 16}
            width={w}
            height="32"
            rx="16"
            fill="white"
            stroke={accent ? "oklch(0.674 0.162 248 / 0.45)" : "oklch(0.34 0.119 260 / 0.12)"}
          />
          <circle cx={p.x - w / 2 + 16} cy={p.y} r="4" fill={accent ? "var(--sky)" : "var(--navy)"} />
          <text x={p.x - w / 2 + 27} y={p.y + 4.5} fontSize="12.5" fontWeight="500" fill="var(--fg)">
            {p.label}
          </text>
        </g>
      ))}
    </>
  );
}
