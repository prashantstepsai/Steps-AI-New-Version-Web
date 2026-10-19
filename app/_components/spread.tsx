"use client";

import { useRef, type ReactNode } from "react";
import Magnet from "./react-bits/Magnet";
import { gsap, useGSAP } from "./gsap";
import { Kinetic } from "./kinetic";
import dynamic from "next/dynamic";

// Client-only: it shuffles stagger order with Math.random(), which prerendering rejects
const RotatingText = dynamic(() => import("./react-bits/RotatingText"), {
  ssr: false,
  loading: () => <span className="rounded-[0.16em] bg-ice px-[0.28em] py-[0.1em] font-medium text-navy">your website</span>,
});

// Resting spread positions as fractions of the viewport, plus a little tilt.
const SPOTS = [
  { x: -0.33, y: -0.27, r: -6 },
  { x: -0.11, y: -0.37, r: 4 },
  { x: 0.15, y: -0.35, r: -3 },
  { x: 0.34, y: -0.17, r: 5 },
  { x: -0.35, y: 0.19, r: 4 },
  { x: -0.13, y: 0.37, r: -5 },
  { x: 0.14, y: 0.39, r: 3 },
  { x: 0.35, y: 0.25, r: -4 },
];

/**
 * Closing CTA. A tidy deck of product moments sits in the middle; scrolling
 * deals the cards out across the viewport and the message rises in between.
 */
export function Spread() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q("[data-card]");
      const copy = q("[data-copy]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = () => window.innerWidth < 640;

      // Keep every dealt card fully on screen: below the nav, above the fold, inside the sides
      const card = cards[0] as HTMLElement;
      const fit = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
      const spread = {
        x: (i: number) => {
          const room = window.innerWidth / 2 - card.offsetWidth / 2 - 16;
          return fit(SPOTS[i].x * window.innerWidth * (small() ? 1.15 : 1), -room, room);
        },
        y: (i: number) => {
          const half = window.innerHeight / 2 - card.offsetHeight / 2;
          return fit(SPOTS[i].y * window.innerHeight * (small() ? 0.95 : 1), -(half - 72), half - 24);
        },
        rotation: (i: number) => SPOTS[i].r,
        scale: 1,
      };

      if (reduce) {
        gsap.set(cards, spread);
        return;
      }

      // The deck: stacked a few px apart with a little fan
      gsap.set(cards, {
        x: (i) => (i - 3.5) * 7,
        y: (i) => (i - 3.5) * -5,
        rotation: (i) => (i % 2 ? 3 : -3) + (i - 3.5) * 0.6,
        scale: 0.92,
      });
      gsap.set(copy, { opacity: 0, y: 28, filter: "blur(8px)" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.9,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        .to(cards, { ...spread, ease: "power3.inOut", duration: 1, stagger: { each: 0.035, from: "end" } })
        .to(copy, { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.5 }, 0.55)
        .to({}, { duration: 0.25 });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="get-started" className="bg-sky-up relative h-svh min-h-[40rem] overflow-hidden">
      {/* Dashed column guides */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto grid max-w-6xl grid-cols-4">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="border-l border-dashed border-[oklch(0.34_0.119_260/0.08)] last:border-r" />
        ))}
      </div>

      <div aria-hidden className="absolute inset-0 grid place-items-center">
        {CARDS.map((card, i) => (
          <div
            key={i}
            data-card
            className="col-start-1 row-start-1 aspect-[4/5] w-[min(clamp(8.5rem,15vw,13rem),24svh)] overflow-hidden rounded-[22px] bg-surface shadow-lg will-change-transform"
          >
            {card}
          </div>
        ))}
      </div>

      <div data-copy className="relative z-10 grid h-full place-items-center px-5">
        <div className="max-w-xl text-center lg:max-w-none">
          <h2 className="text-title lg:whitespace-nowrap">Ready to deploy your AI agent?</h2>
          <p className="text-lede mx-auto mt-5 flex max-w-none flex-wrap items-center justify-center gap-x-[0.3em] text-on-sky-muted">
            <span>Live on</span>
            <RotatingText
              texts={["your website", "WhatsApp", "Instagram", "Messenger"]}
              effect="slide"
              direction="up"
              highlight
              highlightColor="#C4ECFC"
              staggerFrom="last"
              staggerDuration={0.02}
              rotationInterval={2200}
              mainClassName="!text-navy font-medium"
              splitLevelClassName="overflow-hidden pb-0.5"
            />
            <span>in 5 minutes. Cancel anytime.</span>
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Magnet padding={60} magnetStrength={4} maxOffset={10}>
              <a href="https://app.stepsai.co/signup" className="btn btn-primary"><Kinetic>Get Started</Kinetic></a>
            </Magnet>
            <a href="https://stepsai.co/contact/" className="btn btn-secondary"><Kinetic>Book a Demo</Kinetic></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Card faces: small, real-feeling product moments ───────────────── */

function Face({ label, children, tone = "bg-surface" }: { label: string; children: ReactNode; tone?: string }) {
  return (
    <div className={`flex h-full flex-col p-3.5 ${tone}`}>
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-fg-subtle uppercase">{label}</p>
      <div className="mt-auto flex flex-col gap-1.5 text-[0.75rem] leading-snug sm:text-[0.8125rem]">{children}</div>
    </div>
  );
}

const B = ({ me, children }: { me?: boolean; children: ReactNode }) => (
  <span className={`w-fit max-w-[90%] rounded-[12px] px-2.5 py-1.5 ${me ? "ml-auto rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-[var(--bubble-agent)]"}`}>
    {children}
  </span>
);

const CARDS: ReactNode[] = [
  <div key="hello" className="flex h-full flex-col justify-between bg-primary p-3.5 text-white">
    <p className="font-mono text-[0.625rem] tracking-[0.12em] text-white/60 uppercase">Website chat</p>
    <p className="font-pixel text-[clamp(1.75rem,3.2vw,3rem)] leading-none">Hi! How can I help?</p>
  </div>,
  <Face key="wa" label="WhatsApp">
    <B me>Is this still in stock?</B>
    <B>Yes — 3 left in your size.</B>
  </Face>,
  <Face key="order" label="Order #4821">
    <p className="text-[0.9375rem] font-semibold">Out for delivery</p>
    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
      <div className="h-full w-3/4 rounded-full bg-success" />
    </div>
    <p className="text-fg-muted">Arrives today, 2–4 pm</p>
  </Face>,
  <Face key="voice" label="Slack · #support">
    <div className="flex h-14 items-center justify-center gap-[3px]">
      {[0.35, 0.7, 1, 0.55, 0.9, 0.4, 0.8, 0.5, 1, 0.6, 0.3].map((h, n) => (
        <span key={n} className="w-[3px] rounded-full bg-fg/80" style={{ height: `${h * 100}%` }} />
      ))}
    </div>
    <p className="text-center text-fg-muted">Escalated with full context</p>
  </Face>,
  <Face key="cal" label="Booked" tone="bg-ice">
    <p className="text-[1.75rem] leading-none font-semibold tracking-tight">Thu</p>
    <p className="font-medium">Fitting · 3:00 pm</p>
    <p className="text-fg-muted">Added to your calendar</p>
  </Face>,
  <Face key="ig" label="Instagram">
    <B me>Do you ship to Canada?</B>
    <B>We do — 3–5 business days.</B>
  </Face>,
  <Face key="mail" label="Gmail" tone="bg-surface-2">
    <p className="font-semibold">Re: Return request</p>
    <p className="text-fg-muted">Approved — your prepaid label is attached.</p>
  </Face>,
  <Face key="handoff" label="Handoff" tone="bg-accent-soft">
    <p className="font-semibold text-accent">Maya joined the chat</p>
    <p className="text-fg-muted">Full conversation attached</p>
  </Face>,
];
