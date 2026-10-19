"use client";

import { Eyebrow } from "./eyebrow";
import Image from "next/image";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";
import { Kinetic } from "./kinetic";
import { StepsMark } from "./chat-demo";
import "./showcase.css";

// Industries and taglines from stepsai.co; the example exchanges are illustrative.
const CASES = [
  { name: "E-Commerce", hue: 232, href: "https://stepsai.co/solutions/ecommerce/", title: "Browsers → Buyers", ask: "Do you have this in a medium?", does: "Checks the size, holds it in the cart and shares a discount link.", tags: ["Shopify", "WooCommerce", "WhatsApp"] },
  { name: "SaaS", hue: 252, href: "https://stepsai.co/solutions/saas/", title: "Onboard. Support. Scale.", ask: "How do I invite my team?", does: "Walks them through it from your docs and links the right settings page.", tags: ["Docs", "Slack", "Zendesk"] },
  { name: "Healthcare", hue: 205, href: "https://stepsai.co/solutions/healthcare/", title: "Appointments booked. Zero hold music.", ask: "Can I move my appointment to Friday?", does: "Finds an open slot and confirms the new time.", tags: ["Calendly", "WhatsApp", "Website"] },
  { name: "Real Estate", hue: 265, href: "https://stepsai.co/solutions/real-estate/", title: "Every lead, qualified and toured.", ask: "Is the 3-bedroom still available?", does: "Checks live availability and books a tour.", tags: ["WhatsApp", "HubSpot", "Calendly"] },
  { name: "EdTech", hue: 222, href: "https://stepsai.co/solutions/education/", title: "A tutor for every student.", ask: "Can you explain this question again?", does: "Breaks it down step by step from your course material.", tags: ["Website", "Docs", "Teams"] },
  { name: "Financial Services", hue: 245, href: "https://stepsai.co/contact/", title: "Private banking, on every channel.", ask: "What documents do I need to open an account?", does: "Lists them from your policies and books a call with an advisor.", tags: ["Website", "Email", "Teams"] },
];

/**
 * "Built for your business" — a diagonal pass, after Wispr Flow's stories.
 * The section pins; scroll carries the current card up and off to the
 * top-right (shearing as it goes) while the next rises in from the
 * bottom-left. Every card's pose is a pure function of one progress value,
 * so scrubbing backwards is exact.
 */
export function Showcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const cards = q("[data-card]") as HTMLElement[];
        const names = q("[data-name]") as HTMLElement[];
        const count = q("[data-count]")[0] as HTMLElement;
        const n = cards.length;

        // Pose for a card `d` steps away from centre (d < 0 = already passed)
        const place = (p: number) => {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          cards.forEach((card, i) => {
            const d = i - p;
            const a = Math.abs(d);
            gsap.set(card, {
              x: -d * vw * 0.74,
              y: d * vh * 0.7,
              skewX: gsap.utils.clamp(-16, 16, -d * 11),
              rotation: gsap.utils.clamp(-6, 6, -d * 3),
              scale: 1 - Math.min(a, 1.4) * 0.1,
              opacity: a > 1.6 ? 0 : 1,
              zIndex: Math.round(100 - a * 10),
              visibility: a > 1.8 ? "hidden" : "visible",
            });
          });
          const active = Math.min(n - 1, Math.max(0, Math.round(p)));
          names.forEach((el, i) => (el.dataset.active = String(i === active)));
          // Only the card at rest plays its conversation (see showcase.css)
          cards.forEach((card, i) => (card.dataset.live = String(i === active && Math.abs(i - p) < 0.35)));
          if (count) count.textContent = String(active + 1).padStart(2, "0");
        };

        // Timeline in "card units": hold on the first card as the section locks
        // into place, travel one unit per card, then hold on the last before
        // the page moves on. Snap points sit exactly on each card's rest pose.
        const HOLD = 0.6;
        const units = HOLD + (n - 1) + HOLD;
        const state = { p: 0 };
        place(0);
        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${units * window.innerHeight * 0.8}`,
              pin: true,
              scrub: 0.9,
              snap: {
                snapTo: Array.from({ length: n }, (_, i) => (HOLD + i) / units).concat([0, 1]),
                duration: { min: 0.25, max: 0.6 },
                ease: "power2.inOut",
                delay: 0.08,
                // Settle on the nearest card — never fling past several
                inertia: false,
              },
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
            onUpdate: () => place(state.p),
          })
          .to(state, { p: 0, duration: HOLD, ease: "none" })
          .to(state, { p: n - 1, duration: n - 1, ease: "none" })
          .to(state, { p: n - 1, duration: HOLD, ease: "none" });

        const onResize = () => place(state.p);
        window.addEventListener("resize", onResize);
        return () => {
          tl.kill();
          window.removeEventListener("resize", onResize);
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="solutions" className="relative scroll-mt-16 overflow-hidden lg:h-svh">
      {/* Header + index sit beneath the moving cards */}
      <div className="relative mx-auto flex max-w-6xl flex-col px-5 pt-24 sm:px-8 lg:absolute lg:inset-x-0 lg:top-0 lg:h-full lg:pt-24 lg:pb-10">
        <Eyebrow>Built for your business</Eyebrow>
        {/* Kept to a narrow left column so the resting card never covers it */}
        <h2 className="text-title mt-4 max-w-xl lg:max-w-[19rem]">Works for how you sell, support, and scale.</h2>
        {/* Counter lives under the heading — the incoming card peeks in at the bottom-left */}
        <p className="font-pixel mt-8 hidden text-[2.5rem] leading-none tabular-nums lg:block">
          <span data-count>01</span>
          <span className="text-fg-subtle"> / {String(CASES.length).padStart(2, "0")}</span>
        </p>

        <div className="mt-auto mb-24 hidden lg:flex">
          <ol className="flex flex-col gap-1.5">
            {CASES.map((c, i) => (
              <li
                key={c.name}
                data-name
                data-active={i === 0}
                className="group flex items-center gap-2.5 font-mono text-[0.75rem] tracking-[0.08em] text-fg-subtle uppercase transition-colors duration-300 data-[active=true]:text-fg"
              >
                <span aria-hidden className="size-1.5 scale-0 bg-gold transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[active=true]:scale-100" />
                {c.name}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Cards: stacked list below lg, absolutely centred stage on lg */}
      <ul className="relative mt-12 flex flex-col gap-6 px-5 pb-24 sm:px-8 lg:pointer-events-none lg:absolute lg:inset-0 lg:m-0 lg:block lg:p-0">
        {CASES.map((c) => (
          <li
            key={c.name}
            data-card
            className="will-change-transform lg:pointer-events-auto lg:absolute lg:top-[52%] lg:left-[63%] lg:-mt-[min(18rem,31svh)] lg:-ml-[min(27rem,29vw)] lg:w-[min(54rem,58vw)]"
          >
            <Card c={c} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Card({ c }: { c: (typeof CASES)[number] }) {
  const tint = {
    "--card": `oklch(0.965 0.022 ${c.hue})`,
    "--panel-a": `oklch(0.92 0.047 ${c.hue})`,
    "--panel-b": `oklch(0.8 0.1 ${c.hue})`,
  } as CSSProperties;

  return (
    <article
      style={tint}
      className="grid gap-3 rounded-[36px] bg-[var(--card)] p-3 shadow-lg lg:h-[min(36rem,62svh)] lg:grid-cols-[1fr_1.05fr]"
    >
      {/* Left: the industry, in words */}
      <div className="flex flex-col p-6 lg:p-8">
        <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-fg/60 uppercase">Solution</p>
        <h3 className="font-pixel mt-4 text-[clamp(2rem,1.4rem+2vw,3.25rem)] leading-[1.02]">{c.name}</h3>
        <p className="mt-5 max-w-[22rem] text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-[1.2] font-medium tracking-[-0.02em] text-balance">
          {c.title}
        </p>
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {c.tags.map((t) => (
            <li key={t} className="rounded-full bg-white/55 px-2.5 py-1 font-mono text-[0.6875rem] text-fg/70">
              {t}
            </li>
          ))}
        </ul>
        <a href={c.href} className="btn btn-secondary mt-auto w-fit max-lg:mt-8">
          <Kinetic>See the solution</Kinetic>
        </a>
      </div>

      {/* Right: the moment it handles — the customer's chat, and what your team sees */}
      <div className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(160deg,var(--panel-a),var(--panel-b))] p-4 sm:p-5">
        <span aria-hidden className="absolute top-5 right-5 size-2.5 bg-accent-bright" />
        <Scene c={c} />
      </div>
    </article>
  );
}

/* ─── Right-panel scene: chat + "your team's view" ─────────────────────── */

type Channel = "whatsapp" | "website";
type Line = { from: "customer" | "agent"; text: string };
type SceneData = {
  channel: Channel;
  contact: string;
  /** Header avatar photo; otherwise the Steps mark */
  avatar?: string;
  /** Extra lines after the case's own `ask` (the first agent reply comes first) */
  lines: Line[];
  team: { title: string; pill: string; body: ReactNode };
};

// Illustrative conversations — the first question is each case's `ask`
const SCENES: Record<string, SceneData> = {
  "E-Commerce": {
    channel: "whatsapp",
    contact: "Northwind Supply",
    lines: [
      { from: "agent", text: "Yes — 4 left in Medium. I’ve held one in your cart." },
      { from: "customer", text: "Perfect. Any discount for a first order?" },
      { from: "agent", text: "Here’s 10% off — your checkout link is ready." },
    ],
    team: {
      title: "Added to cart",
      pill: "Shopify",
      body: (
        <>
          <Thumb src="/ref/products/linen-commerce.webp" title="Linen Overshirt · M" sub={<><s className="text-fg-subtle">$68</s> $61.20</>} />
          <Done>Checkout link sent</Done>
        </>
      ),
    },
  },
  SaaS: {
    channel: "website",
    contact: "Relay Help",
    lines: [
      { from: "agent", text: "Open Settings → Team, click Invite and add their emails." },
      { from: "customer", text: "Can they be admins?" },
      { from: "agent", text: "Yes — pick the Admin role when you invite them." },
    ],
    team: {
      title: "Answered from docs",
      pill: "Zendesk",
      body: (
        <>
          <Chips items={["Help centre", "Team settings"]} />
          <Done>Ticket avoided · 0 agents needed</Done>
        </>
      ),
    },
  },
  Healthcare: {
    channel: "whatsapp",
    contact: "Oak Clinic",
    avatar: "/ref/photos/healthcare.jpg",
    lines: [
      { from: "agent", text: "Of course. Friday has 10:30 AM or 2:15 PM free." },
      { from: "customer", text: "10:30 please." },
      { from: "agent", text: "Done — you’re booked Fri 10:30 AM with Dr. Shah." },
    ],
    team: {
      title: "Appointment moved",
      pill: "Calendly",
      body: (
        <>
          <Fields rows={[["Was", "Wed 4:00 PM"], ["Now", "Fri 10:30 AM"]]} />
          <Done>Calendar synced · reminder set</Done>
        </>
      ),
    },
  },
  "Real Estate": {
    channel: "whatsapp",
    contact: "Harbor Homes",
    lines: [
      { from: "agent", text: "Yes — it’s available. What’s your budget, and when could you tour?" },
      { from: "customer", text: "Around $650k. Friday evening?" },
      { from: "agent", text: "You’re booked for Fri 5:00 PM. Confirmation sent." },
    ],
    team: {
      title: "Lead qualified",
      pill: "HubSpot",
      body: (
        <>
          <Thumb src="/ref/photos/realestate.jpg" title="Daniel Reyes" sub="3-bed · Harbor St." />
          <Fields rows={[["Budget", "$650k"], ["Tour", "Fri 5:00 PM"]]} />
        </>
      ),
    },
  },
  EdTech: {
    channel: "website",
    contact: "Bright Learn tutor",
    lines: [
      { from: "agent", text: "Sure — find the slope first: rise over run, so 6 ÷ 3 = 2." },
      { from: "customer", text: "So the answer is y = 2x + 1?" },
      { from: "agent", text: "Exactly. Want a practice question?" },
    ],
    team: {
      title: "Student helped",
      pill: "Course",
      body: (
        <>
          <Thumb src="/ref/photos/education.jpg" title="Priya · Year 11" sub="Algebra · Module 4" />
          <Chips items={["Course module 4"]} />
        </>
      ),
    },
  },
  "Financial Services": {
    channel: "website",
    contact: "Aster Private",
    lines: [
      { from: "agent", text: "Photo ID, proof of address and your tax number. Shall I book an advisor?" },
      { from: "customer", text: "Yes, tomorrow morning." },
      { from: "agent", text: "Booked: tomorrow 9:30 AM with Elena." },
    ],
    team: {
      title: "Advisor call booked",
      pill: "Calendar",
      body: (
        <ul className="flex flex-col gap-1 text-[0.75rem]">
          {[["Photo ID", true], ["Proof of address", true], ["Tax number", false]].map(([doc, ok]) => (
            <li key={doc as string} className="flex items-center gap-2">
              <span className={`grid size-4 place-items-center rounded-full ${ok ? "bg-ice text-navy" : "border border-dashed border-fg/30"}`}>
                {ok && <Tick className="size-2.5" />}
              </span>
              <span className={ok ? "" : "text-fg-muted"}>{doc}</span>
              {!ok && <span className="ml-auto text-fg-subtle">at the call</span>}
            </li>
          ))}
        </ul>
      ),
    },
  },
};

// ms after the card settles: one beat per message, the team card last
const STEP = 1050;
const at = (i: number) => 350 + i * STEP;

function Scene({ c }: { c: (typeof CASES)[number] }) {
  const s = SCENES[c.name];
  const lines: Line[] = [{ from: "customer", text: c.ask }, ...s.lines];
  const wa = s.channel === "whatsapp";

  return (
    <div className="relative flex h-full flex-col max-lg:gap-3 lg:block">
      {/* Customer's side */}
      <div
        role="img"
        aria-label={`Example ${wa ? "WhatsApp" : "website chat"} with ${s.contact}: “${c.ask}” — ${c.does}`}
        className="flex flex-col overflow-hidden rounded-[20px] bg-surface shadow-lg lg:h-[calc(100%-12.5rem)] lg:w-[78%]"
      >
        <div aria-hidden className={`flex shrink-0 items-center gap-2.5 px-3 py-2.5 ${wa ? "border-b border-line" : "bg-primary text-white"}`}>
          {wa && <Chevron className="text-[var(--wa-green)]" />}
          {s.avatar ? (
            <Image src={s.avatar} alt="" width={64} height={64} className="size-8 shrink-0 rounded-full object-cover" />
          ) : (
            <span className={`grid size-8 shrink-0 place-items-center rounded-full ${wa ? "bg-primary text-white" : "bg-white text-fg"}`}>
              <StepsMark className="size-3.5" />
            </span>
          )}
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[0.8125rem] font-semibold">{s.contact}</p>
            <p className={`flex items-center gap-1 text-[0.6875rem] ${wa ? "text-fg-muted" : "text-white/70"}`}>
              {!wa && <span className="size-1.5 rounded-full bg-[var(--wa-green)]" />}
              {wa ? "Business account" : "Typically replies instantly"}
            </p>
          </div>
        </div>

        <div aria-hidden className={`sc-feed flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-3 py-3 ${wa ? "wa-wallpaper" : "bg-surface-2"}`}>
          {lines.map((m, i) => (
            <Bubble key={i} m={m} wa={wa} d={at(i)} time={`10:${String(24 + i).padStart(2, "0")}`} />
          ))}
        </div>

        <div aria-hidden className="flex shrink-0 items-center gap-2 border-t border-line px-3 py-2">
          <span className="flex-1 text-[0.75rem] text-fg-subtle">{wa ? "Message" : "Type your message…"}</span>
          <span className={`grid size-6 place-items-center rounded-full text-white ${wa ? "bg-[var(--wa-green)]" : "bg-primary"}`}>
            <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>
          </span>
        </div>
      </div>

      {/* Your team's side */}
      <div
        style={{ "--d": at(lines.length) - 350 } as CSSProperties}
        className="sc-card rounded-[18px] bg-surface p-3.5 shadow-lg max-lg:ml-auto max-lg:-mt-8 max-lg:w-[88%] lg:absolute lg:right-0 lg:bottom-0 lg:w-[66%]"
      >
        <p className="flex items-center gap-1.5 text-[0.6875rem] text-fg-subtle">
          <span className="grid size-4 place-items-center rounded-[5px] bg-primary text-white"><StepsMark className="size-2.5" /></span>
          Steps AI · your team’s view
        </p>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{s.team.title}</p>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-ice px-2 py-0.5 text-[0.6875rem] font-medium text-navy">
            <Tick className="size-2.5" />
            {s.team.pill}
          </span>
        </div>
        <p className="mt-1 text-[0.75rem] leading-snug text-pretty text-fg-muted">{c.does}</p>
        <div className="mt-2.5 flex flex-col gap-2 border-t border-line pt-2.5">{s.team.body}</div>
      </div>
    </div>
  );
}

function Bubble({ m, wa, d, time }: { m: Line; wa: boolean; d: number; time: string }) {
  const me = m.from === "customer";
  const tone = wa
    ? me
      ? "rounded-[10px] rounded-tr-[3px] bg-[var(--wa-out)] shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]"
      : "rounded-[10px] rounded-tl-[3px] bg-[var(--wa-in)] shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]"
    : me
      ? "rounded-[14px] rounded-br-[4px] bg-primary text-white"
      : "rounded-[14px] rounded-bl-[4px] bg-surface shadow-sm";

  return (
    <div className={`grid max-w-[86%] [&>*]:[grid-area:1/1] ${me ? "ml-auto justify-items-end" : "justify-items-start"}`}>
      {!me && (
        <span style={{ "--d": d } as CSSProperties} className={`sc-dots flex h-fit w-fit gap-1 self-end px-3 py-2.5 ${tone}`}>
          <span className="size-1 rounded-full bg-fg-muted" />
          <span className="size-1 rounded-full bg-fg-muted" />
          <span className="size-1 rounded-full bg-fg-muted" />
        </span>
      )}
      <p
        style={{ "--d": d, transformOrigin: me ? "100% 100%" : "0 100%" } as CSSProperties}
        className={`sc-seq flow-root w-fit px-2.5 py-1.5 text-[0.8125rem] leading-snug ${tone}`}
      >
        {m.text}
        <span className={`float-right mt-1 ml-2 flex translate-y-0.5 items-center gap-0.5 text-[0.625rem] tabular-nums ${!wa && me ? "text-white/60" : "text-fg-subtle"}`}>
          {time}
          {wa && me && (
            <svg viewBox="0 0 18 12" className="h-2 w-3 text-[var(--wa-tick)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m1.5 6.5 3 3 6-7M7.5 9.5l.5.5 6-7.5" /></svg>
          )}
        </span>
      </p>
    </div>
  );
}

function Thumb({ src, title, sub }: { src: string; title: string; sub: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image src={src} alt="" width={80} height={80} className="size-10 shrink-0 rounded-[10px] object-cover outline outline-1 -outline-offset-1 outline-[var(--image-outline)]" />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[0.8125rem] font-semibold">{title}</p>
        <p className="mt-0.5 text-[0.75rem] text-fg-muted tabular-nums">{sub}</p>
      </div>
    </div>
  );
}

function Fields({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="flex flex-col gap-1 text-[0.75rem]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-2 rounded-[8px] bg-surface-2 px-2 py-1">
          <dt className="text-fg-muted">{k}</dt>
          <dd className="font-medium tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className="flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[0.6875rem] font-medium text-accent">
          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden><path d="M4 2.5h5.5L12 5v8.5H4z" /><path d="M9.5 2.5V5H12" /></svg>
          {t}
        </span>
      ))}
    </div>
  );
}

function Done({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[0.75rem] font-medium">
      <span className="grid size-4 place-items-center rounded-full bg-ice text-navy"><Tick className="size-2.5" /></span>
      {children}
    </p>
  );
}

function Tick({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m2.5 6.5 2.3 2L9.5 3.5" />
    </svg>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}
