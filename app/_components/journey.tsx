"use client";

import { Eyebrow } from "./eyebrow";
import Image from "next/image";
import { useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "./motion";
import { PhoneFrame } from "./phone-frame";

// Stage copy as written for stepsai.co's next homepage (web-design-current copy.json)
const STAGES = [
  {
    label: "Engage",
    lead: "Start conversations with the right customers.",
    body: "Send an offer on WhatsApp, reply to an Instagram comment or run an ad that opens a chat. Your AI agent can answer when people respond.",
    items: ["Send personalised WhatsApp campaigns", "Turn Instagram comments into DMs", "Run ads that open a WhatsApp chat", "Manage Instagram comments"],
    tint: "radial-gradient(ellipse at 50% 115%, oklch(0.92 0.047 224 / 0.95), transparent 70%), linear-gradient(var(--surface), var(--surface-2))",
  },
  {
    label: "Convert",
    lead: "Help interested customers buy or book.",
    body: "Answer what they want to know, find out what they need and help them take action in the chat.",
    items: ["Help shoppers choose and order", "Collect useful lead details", "Book appointments and demos", "Send important enquiries to your team"],
    tint: "radial-gradient(ellipse at 50% 115%, oklch(0.88 0.06 245 / 0.8), transparent 70%), linear-gradient(var(--surface), var(--surface-2))",
  },
  {
    label: "Support",
    lead: "Keep helping customers when they need you.",
    body: "Answer everyday questions, share order updates and pass conversations to your team when a person is needed.",
    items: ["Answer from your own information", "Share order and delivery updates", "Create tickets for requests", "Reply when you miss a WhatsApp call"],
    tint: "radial-gradient(ellipse at 50% 115%, oklch(0.86 0.07 258 / 0.7), transparent 70%), linear-gradient(var(--surface), var(--surface-2))",
  },
  {
    label: "Bring customers back",
    lead: "Follow up after the conversation ends.",
    body: "Set up messages for unfinished purchases, customer updates and repeat orders. Choose the timing and what happens when someone replies.",
    items: ["Recover abandoned Shopify checkouts", "Confirm cash-on-delivery orders", "Welcome customers and ask for reviews", "Give customers a reason to return"],
    tint: "radial-gradient(ellipse at 50% 115%, oklch(0.92 0.05 210 / 0.95), transparent 70%), linear-gradient(var(--surface), var(--surface-2))",
  },
];

const SCENES = [<ShoppingMock key="shop" />, <InstagramMock key="ig" />, <CallingMock key="call" />, <WhatsAppMock key="wa" />];

// Stack only on large screens with motion allowed; elsewhere it's a plain list
const STACK_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
function useStacked() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(STACK_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(STACK_QUERY).matches,
    () => false,
  );
}

/**
 * "Engage. Convert. Support. Bring customers back." — a sticky scroll stack.
 * Every card sticks at the same spot, so each new one slides up and covers
 * the previous edge to edge; the covered card shrinks and dims underneath
 * as it's buried, following the scroll exactly.
 */
export function Journey() {
  const stacked = useStacked();
  const r0 = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const refs = [r0, r1, r2, r3];

  return (
    <section id="journey" className="scroll-mt-16 px-5 py-16 sm:px-8 lg:pt-8 lg:pb-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center lg:max-w-none">
          <Eyebrow>The customer journey</Eyebrow>
          <h2 className="text-title mt-4 xl:whitespace-nowrap">
            Engage. Convert. Support. <span className="text-fg-subtle">Bring customers back.</span>
          </h2>
          <p className="text-lede mx-auto mt-5 max-w-[34rem] text-fg-muted">
            From the first message to the next purchase, give customers help and keep your team in control.
          </p>
        </Reveal>

        <div className="relative mt-12 flex flex-col gap-6 lg:mt-14 lg:gap-0">
          {STAGES.map((s, i) => (
            <div key={s.label} className="contents">
              {/* Scroll distance between cards lives on spacers, not card margins: a sticky card's margin shortens how long it stays stuck */}
              {i > 0 && <div aria-hidden className="hidden h-[18vh] lg:block" />}
              <StackCard
                index={i}
                stage={s}
                cardRef={refs[i]}
                next={refs[i + 1]}
                stacked={stacked}
              />
            </div>
          ))}
          <div aria-hidden className="hidden h-[4vh] lg:block" />
        </div>
      </div>
    </section>
  );
}

function StackCard({
  index,
  stage: s,
  cardRef,
  next,
  stacked,
}: {
  index: number;
  stage: (typeof STAGES)[number];
  cardRef: RefObject<HTMLDivElement | null>;
  next?: RefObject<HTMLDivElement | null>;
  stacked: boolean;
}) {
  // Progress of the NEXT card rising from the bottom of the viewport to its sticky spot
  const { scrollYProgress } = useScroll({ target: next ?? cardRef, offset: ["start end", "start 25%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, next ? 0.92 : 1]);
  const veil = useTransform(scrollYProgress, [0.15, 1], [0, next ? 0.6 : 0]);

  return (
    <motion.article
      ref={cardRef}
      aria-labelledby={`journey-${index}`}
      style={stacked ? { top: "5.5rem", scale, transformOrigin: "50% 50%" } : undefined}
      className="relative rounded-[36px] bg-surface p-3 shadow-lg lg:sticky lg:h-[min(41rem,calc(100svh-7.5rem))] motion-reduce:lg:static motion-reduce:lg:h-auto"
    >
      <div className="grid h-full gap-3 lg:grid-cols-[1fr_1.08fr]">
        <div className="flex flex-col justify-center p-5 lg:p-8">
          <p className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.14em] text-fg-subtle uppercase">
            <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden className="relative h-[2px] w-14 overflow-hidden rounded-full bg-line">
              <span className="absolute inset-y-0 left-0 rounded-full bg-accent-bright" style={{ width: `${((index + 1) / STAGES.length) * 100}%` }} />
            </span>
            <span>{String(STAGES.length).padStart(2, "0")}</span>
          </p>

          {index === 0 && (
            <div className="mt-6">
              <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-fg-subtle uppercase">Built for Shopify and WooCommerce stores</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="flex h-10 items-center gap-2 rounded-[12px] bg-surface-2 px-3 text-[0.9375rem] font-semibold">
                  <Image src="/ref/integrations/shopify.svg" alt="" width={18} height={20} className="h-5 w-auto" />
                  Shopify
                </span>
                <span className="flex h-10 items-center rounded-[12px] bg-surface-2 px-3">
                  <Image src="/ref/integrations/woocommerce-wordmark.svg" alt="WooCommerce" width={98} height={21} className="h-[1.1rem] w-auto" />
                </span>
              </div>
            </div>
          )}

          <h3 id={`journey-${index}`} className="mt-6 font-pixel text-[clamp(2rem,1.4rem+1.8vw,3rem)] leading-[1.02]">
            {s.label}
          </h3>
          <p className="mt-4 max-w-[24rem] text-[clamp(1.125rem,1rem+0.4vw,1.3125rem)] leading-[1.3] font-medium tracking-[-0.015em] text-balance">{s.lead}</p>
          <p className="mt-3 max-w-[30rem] text-[0.9375rem] text-pretty text-fg-muted">{s.body}</p>
          <ul className="mt-6 max-w-[26rem] border-t border-line">
            {s.items.map((item) => (
              <li key={item} className="flex items-center gap-3 border-b border-line py-2.5 text-[0.9375rem] font-medium">
                <span className="grid size-[1.375rem] shrink-0 place-items-center rounded-[7px] bg-accent-soft text-accent">
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m2.5 6.5 2.3 2L9.5 3.5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 36px outer − 12px padding = 24px inner: concentric corners */}
        <div
          className="relative grid min-h-[36rem] place-items-center overflow-hidden rounded-[24px] p-6 lg:min-h-0"
          style={{ background: s.tint }}
        >
          {SCENES[index]}
        </div>
      </div>

      {/* Dims the card as the next one buries it */}
      {stacked && next && (
        <motion.div aria-hidden style={{ opacity: veil }} className="pointer-events-none absolute inset-0 rounded-[36px] bg-bg" />
      )}
    </motion.article>
  );
}

/* ─── Shared bits ──────────────────────────────────────────────────── */

/** Message pop-in, staggered, once the phone scrolls into view. */
function Pop({ i, children, className = "", from = "in" }: { i: number; children: ReactNode; className?: string; from?: "in" | "out" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.25 + i * 0.22 }}
      style={{ originX: from === "out" ? 1 : 0, originY: 1 }}
      className={`shrink-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Icon({ children, className = "size-[1.125rem]", strokeWidth = 1.6 }: { children: ReactNode; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const I = {
  back: <path d="M15 5 8 12l7 7" />,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 19.5c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5" /></>,
  cart: <><path d="M3.5 4.5h2l2.2 10.5h10l2-7.5H7" /><circle cx="9.5" cy="19" r="1.2" /><circle cx="17" cy="19" r="1.2" /></>,
  more: <><circle cx="5.5" cy="12" r=".9" fill="currentColor" /><circle cx="12" cy="12" r=".9" fill="currentColor" /><circle cx="18.5" cy="12" r=".9" fill="currentColor" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  upRight: <path d="M8 16 16 8M9.5 8H16v6.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>,
  send: <path d="M20.5 3.5 10 14M20.5 3.5 14 20.5l-4-6.5-6.5-4 17-6.5Z" />,
  phone: <path d="M5 4h3.5l1.5 4.5-2.2 1.3a11 11 0 0 0 6.4 6.4l1.3-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" />,
  video: <><rect x="3" y="6.5" width="12.5" height="11" rx="2.5" /><path d="m15.5 10.5 5-3v9l-5-3" /></>,
  camera: <><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-8Z" /><circle cx="12" cy="12.5" r="3.5" /></>,
  image: <><rect x="3.5" y="4" width="17" height="16" rx="3" /><circle cx="9" cy="9.5" r="1.5" /><path d="m4 17 5-4.5 4 3.5 2.5-2 4.5 4" /></>,
  smile: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 14c.9 1.2 2 1.8 3.5 1.8s2.6-.6 3.5-1.8M9 9.5h.01M15 9.5h.01" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  cap: <><path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z" /><path d="M6.5 11v4.5c1.5 1.5 3.4 2.3 5.5 2.3s4-.8 5.5-2.3V11M21.5 9v5" /></>,
  micOff: <><path d="M15 9.5V6a3 3 0 0 0-5.8-1M9 9v2a3 3 0 0 0 4.6 2.5M5.5 11a6.5 6.5 0 0 0 10.3 5.3M18.5 11c0 .7-.1 1.4-.3 2M12 17.5V21M3.5 3.5l17 17" /></>,
  grid: <><circle cx="6" cy="6" r="1.3" /><circle cx="12" cy="6" r="1.3" /><circle cx="18" cy="6" r="1.3" /><circle cx="6" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="18" cy="12" r="1.3" /><circle cx="6" cy="18" r="1.3" /><circle cx="12" cy="18" r="1.3" /><circle cx="18" cy="18" r="1.3" /></>,
  volume: <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Z" /><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /></>,
  doc: <><path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8L14 3.5Z" /><path d="M14 3.5V8h4.5M9 13h6M9 16.5h4" /></>,
};

function Ticks() {
  return (
    <svg viewBox="0 0 18 12" className="inline h-2.5 w-3.5 text-[var(--wa-tick)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m1.5 6.5 3 3 6-7M7.5 9.5l.5.5 6-7.5" />
    </svg>
  );
}

const PHONE = "h-[34rem] w-[17rem] shrink-0";
// Older messages fade under the header instead of being cut off
const FEED = "flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_1.75rem)]";

/* ─── 01 Engage: shopping widget ───────────────────────────────────── */

const PRODUCTS = [
  { name: "Silver Floral Set", price: "₹2,790", was: "₹4,649", src: "/ref/products/silver-floral.webp", body: "Silver-tone floral necklace and matching earrings." },
  { name: "Pink Statement Set", price: "₹3,479", was: "₹5,799", src: "/ref/products/pink-statement.webp", body: "Pink gemstones with a delicate silver-tone finish." },
];

function ShoppingMock() {
  return (
    <div aria-hidden className="flex h-[33rem] w-[min(22rem,100%)] flex-col overflow-hidden rounded-[22px] bg-surface text-fg shadow-[0_0_0_7px_oklch(1_0_0/0.55),0_34px_60px_-28px_oklch(0.34_0.119_260/0.35)]">
      <header className="flex items-center gap-2.5 border-b border-line px-3.5 py-3">
        <Icon className="size-4">{I.back}</Icon>
        <span className="relative grid size-8 place-items-center rounded-full bg-surface-2 text-fg-muted">
          <Icon className="size-[1.125rem]">{I.user}</Icon>
          <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-surface bg-success" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <strong className="block text-[0.875rem]">Shopper</strong>
          <small className="text-[0.75rem] text-fg-subtle">Active</small>
        </span>
        <Icon className="size-[1.125rem]">{I.cart}</Icon>
        <Icon className="size-[1.125rem]">{I.more}</Icon>
        <Icon className="size-4">{I.close}</Icon>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3.5 pt-3.5">
        <Pop i={0} from="out" className="ml-auto max-w-[85%] rounded-[16px] rounded-br-md bg-primary px-3 py-2 text-[0.8125rem] text-white">
          Suggest jewellery for a wedding.
        </Pop>
        <Pop i={1} className="w-fit max-w-[85%] rounded-[16px] rounded-bl-md bg-[var(--bubble-agent)] px-3 py-2 text-[0.8125rem]">
          These two sets fit your budget.
        </Pop>
        <Pop i={2} className="mt-1 text-[0.6875rem] text-fg-subtle">Showing 2 products</Pop>
        {PRODUCTS.map((p, k) => (
          <Pop key={p.name} i={3 + k} className="flex gap-3 rounded-[14px] p-2 outline outline-1 -outline-offset-1 outline-line">
            <Image src={p.src} alt="" width={84} height={84} sizes="84px" className="size-[5.25rem] shrink-0 rounded-[10px] object-cover" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[0.8125rem] font-semibold">
                {p.name}
                <Icon className="size-3" strokeWidth={2}>{I.upRight}</Icon>
              </p>
              <p className="mt-0.5 flex items-baseline gap-1.5">
                <b className="text-[0.9375rem] tabular-nums">{p.price}</b>
                <s className="text-[0.6875rem] text-fg-subtle tabular-nums">{p.was}</s>
                <em className="rounded-[4px] bg-accent-soft px-1 py-px text-[0.625rem] font-semibold text-accent not-italic">40% off</em>
              </p>
              <p className="mt-0.5 truncate text-[0.6875rem] text-fg-muted">{p.body}</p>
              <span className="mt-1.5 flex h-7 items-center justify-center gap-1 rounded-[8px] bg-primary text-[0.75rem] font-medium text-white">
                <Icon className="size-3" strokeWidth={2}>{I.plus}</Icon>
                Add to cart
              </span>
            </div>
          </Pop>
        ))}
      </div>

      <footer className="border-t border-line px-3 pt-2.5 pb-2">
        <div className="flex h-10 items-center gap-2.5 rounded-full bg-surface-2 pr-3 pl-4 text-fg-muted">
          <span className="flex-1 text-[0.8125rem] text-fg-subtle">Hop in! I’ll help you</span>
          <Icon className="size-4">{I.mic}</Icon>
          <Icon className="size-4">{I.send}</Icon>
        </div>
        <p className="mt-1.5 text-center text-[0.625rem] text-fg-subtle">
          Powered by <b className="font-semibold text-fg">STEPS AI</b>
        </p>
      </footer>
    </div>
  );
}

/* ─── 02 Convert: Instagram DM ─────────────────────────────────────── */

function InstagramMock() {
  return (
    <div aria-hidden>
      <PhoneFrame className={PHONE}>
        <header className="flex items-center gap-2 border-b border-line px-3 pb-2.5">
          <Icon className="size-5">{I.back}</Icon>
          <span className="rounded-full bg-[image:var(--ig-ring)] p-[2px]">
            <span className="block rounded-full bg-surface p-[2px]">
              <span className="grid size-7 place-items-center rounded-full bg-ice text-[0.625rem] font-bold text-navy">OC</span>
            </span>
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <strong className="block text-[0.8125rem]">Oak Clinic</strong>
            <small className="text-[0.6875rem] text-fg-subtle">oakclinic</small>
          </span>
          <Icon className="size-[1.125rem]">{I.phone}</Icon>
          <Icon className="size-5">{I.video}</Icon>
        </header>

        <div className={`${FEED} px-3 pb-2`}>
          <p className="mb-1 text-center text-[0.625rem] text-fg-subtle">Today 10:24</p>
          <Pop i={0} from="out" className="ml-auto max-w-[82%] rounded-[18px] bg-[image:var(--ig-out)] px-3 py-1.5 text-[0.75rem] leading-snug text-white">
            Do you offer consultations on Saturdays?
          </Pop>
          <Pop i={1} className="max-w-[82%] rounded-[18px] bg-[var(--ig-in)] px-3 py-1.5 text-[0.75rem] leading-snug">
            Yes, 9 AM–2 PM. What would you like help with?
          </Pop>
          <Pop i={2} from="out" className="ml-auto max-w-[82%] rounded-[18px] bg-[image:var(--ig-out)] px-3 py-1.5 text-[0.75rem] leading-snug text-white">
            A general consultation. I’m Maya.
          </Pop>
          <Pop i={3} className="max-w-[82%] rounded-[18px] bg-[var(--ig-in)] px-3 py-1.5 text-[0.75rem] leading-snug">
            Thanks, Maya. I can share the details and help you choose a time.
          </Pop>
          <Pop i={4} className="w-[78%] overflow-hidden rounded-[16px] bg-surface outline outline-1 -outline-offset-1 outline-line">
            <Image src="/ref/photos/healthcare.jpg" alt="" width={240} height={90} sizes="220px" className="h-[4.5rem] w-full object-cover object-[50%_25%]" />
            <div className="px-2.5 py-2">
              <strong className="block text-[0.75rem]">General consultation</strong>
              <span className="mt-0.5 flex items-center gap-1 text-[0.6875rem] font-medium text-[var(--ig-blue)]">
                Services & available times
                <Icon className="size-3" strokeWidth={2}>{I.arrow}</Icon>
              </span>
            </div>
          </Pop>
        </div>

        <div className="mx-2.5 mb-6 flex h-9 items-center gap-2 rounded-full pr-3 pl-1 outline outline-1 -outline-offset-1 outline-line">
          <span className="grid size-7 place-items-center rounded-full bg-[var(--ig-blue)] text-white">
            <Icon className="size-3.5">{I.camera}</Icon>
          </span>
          <span className="flex-1 text-[0.75rem] text-fg-subtle">Message…</span>
          <Icon className="size-4">{I.mic}</Icon>
          <Icon className="size-4">{I.image}</Icon>
        </div>
      </PhoneFrame>
    </div>
  );
}

/* ─── 03 Support: AI calling agent ─────────────────────────────────── */

const WAVE = [9, 17, 26, 14, 32, 22, 12, 30, 18, 26, 12, 8];

function CallingMock() {
  const line = (who: string, text: string, agent: boolean, i: number) => (
    <Pop i={i} className={agent ? "rounded-[14px] bg-white/10 px-3 py-2" : "px-1"}>
      <small className={`block font-mono text-[0.5625rem] tracking-[0.12em] uppercase ${agent ? "text-ice" : "text-white/45"}`}>{who}</small>
      <p className="mt-0.5 text-[0.75rem] leading-snug text-white/90">{text}</p>
    </Pop>
  );

  return (
    <div aria-hidden>
      <PhoneFrame dark className={PHONE} screenClassName="bg-[linear-gradient(180deg,oklch(0.34_0.119_260),oklch(0.2_0.07_262))]">
        <div className="flex flex-col items-center px-4 pt-3 text-center text-white">
          <span className="grid size-12 place-items-center rounded-full bg-white/10">
            <Icon className="size-6">{I.cap}</Icon>
          </span>
          <strong className="mt-2 text-[0.875rem]">Bright College · Admissions</strong>
          <span className="text-[0.6875rem] text-white/55">AI calling agent</span>
          <div className="wave mt-3 flex h-9 items-center gap-[3px]">
            {WAVE.map((h, i) => (
              <span key={i} className="w-[3px] rounded-full bg-sky" style={{ height: h, "--i": i } as React.CSSProperties} />
            ))}
          </div>
          <small className="mt-1 flex items-center gap-1.5 text-[0.6875rem] text-white/60 tabular-nums">
            <span className="size-1.5 rounded-full bg-[oklch(0.72_0.16_150)]" />
            On call · 01:24
          </small>
        </div>

        <div className={`${FEED} mt-1 px-3`}>
          {line("Student", "Are admissions still open for Data Science?", false, 0)}
          {line("AI calling agent", "Yes. The weekend batch is open. I can explain the fees and entry requirements.", true, 1)}
          {line("Student", "Could someone help with my application?", false, 2)}
          {line("AI calling agent", "I’ll share your enquiry with the admissions team.", true, 3)}
          <Pop i={4} className="flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.625rem] text-white/70">
            <Icon className="size-3">{I.doc}</Icon>
            Admissions guide
          </Pop>
        </div>

        <div className="mt-3 mb-7 flex items-center justify-center gap-4 text-white">
          {[I.micOff, I.grid, I.volume].map((g, k) => (
            <span key={k} className="grid size-11 place-items-center rounded-full bg-white/12">
              <Icon className="size-5">{g}</Icon>
            </span>
          ))}
          <span className="grid size-11 place-items-center rounded-full bg-[oklch(0.6_0.21_27)]">
            <Icon className="size-5 rotate-[135deg]">{I.phone}</Icon>
          </span>
        </div>
      </PhoneFrame>
    </div>
  );
}

/* ─── 04 Bring customers back: WhatsApp cart recovery ──────────────── */

function WhatsAppMock() {
  return (
    <div aria-hidden>
      <PhoneFrame className={PHONE}>
        <header className="flex items-center gap-2 border-b border-line px-3 pb-2.5 text-[var(--wa-green)]">
          <Icon className="size-5">{I.back}</Icon>
          <Image src="/ref/photos/homeware-still-life.webp" alt="" width={30} height={30} sizes="30px" className="size-[1.875rem] rounded-full object-cover" />
          <span className="min-w-0 flex-1 leading-tight text-fg">
            <strong className="block text-[0.8125rem]">Your Store</strong>
            <small className="text-[0.6875rem] text-fg-subtle">Business account</small>
          </span>
          <Icon className="size-5">{I.video}</Icon>
          <Icon className="size-[1.125rem]">{I.phone}</Icon>
        </header>

        <div className="wa-wallpaper flex min-h-0 flex-1 flex-col">
          <div className={`${FEED} px-2.5 pb-2`}>
            <p className="mx-auto mb-1 rounded-[6px] bg-surface/90 px-2 py-0.5 text-[0.625rem] text-fg-muted shadow-[0_1px_0.5px_oklch(0_0_0/0.1)]">Today</p>
            <Pop i={0} className="w-[84%] overflow-hidden rounded-[10px] rounded-tl-[3px] bg-[var(--wa-in)] p-1 shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]">
              <Image src="/ref/photos/homeware-still-life.webp" alt="" width={240} height={112} sizes="220px" className="h-[5.5rem] w-full rounded-[7px] object-cover" />
              <p className="px-1.5 pt-1.5 text-[0.75rem] leading-snug font-semibold">Your Sol vase is still in your cart.</p>
              <p className="px-1.5 text-right text-[0.5625rem] text-fg-subtle tabular-nums">10:08</p>
              <p className="mt-1 flex items-center justify-center gap-1 border-t border-line py-1.5 text-[0.75rem] font-medium text-[var(--wa-tick)]">
                <Icon className="size-3.5" strokeWidth={2}>{I.upRight}</Icon>
                Return to checkout
              </p>
            </Pop>
            <Pop i={1} from="out" className="ml-auto max-w-[80%] rounded-[10px] rounded-tr-[3px] bg-[var(--wa-out)] px-2 py-1.5 text-[0.75rem] leading-snug shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]">
              Is delivery available to Bengaluru?
              <span className="float-right mt-1 ml-1.5 translate-y-0.5 text-[0.5625rem] text-fg-subtle tabular-nums">10:12 <Ticks /></span>
            </Pop>
            <Pop i={2} className="max-w-[82%] rounded-[10px] rounded-tl-[3px] bg-[var(--wa-in)] px-2 py-1.5 text-[0.75rem] leading-snug shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]">
              Yes. You can check the delivery estimate at checkout.
              <span className="float-right mt-1 ml-1.5 translate-y-0.5 text-[0.5625rem] text-fg-subtle tabular-nums">10:13</span>
            </Pop>
            <Pop i={3} className="flex w-[84%] items-center gap-2 rounded-[10px] bg-[var(--wa-in)] p-1.5 shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]">
              <Image src="/ref/photos/homeware-still-life.webp" alt="" width={44} height={48} sizes="44px" className="h-12 w-11 rounded-[6px] object-cover" />
              <span className="min-w-0 leading-tight">
                <strong className="block text-[0.6875rem]">Your Store · Checkout</strong>
                <span className="text-[0.6875rem] text-fg-muted">Sol Ceramic Vase · ₹1,890</span>
              </span>
            </Pop>
          </div>
        </div>

        <div className="mb-6 flex h-10 items-center gap-2 px-2.5 pt-1 text-[var(--wa-green)]">
          <Icon className="size-5">{I.plus}</Icon>
          <span className="flex h-8 flex-1 items-center rounded-full bg-surface pr-2 pl-3 outline outline-1 -outline-offset-1 outline-line">
            <span className="flex-1 text-[0.75rem] text-fg-subtle">Message…</span>
            <Icon className="size-4 text-fg-subtle">{I.smile}</Icon>
          </span>
          <Icon className="size-[1.125rem]">{I.camera}</Icon>
          <Icon className="size-[1.125rem]">{I.mic}</Icon>
        </div>
      </PhoneFrame>
    </div>
  );
}
