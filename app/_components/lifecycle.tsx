"use client";

import { Eyebrow } from "./eyebrow";
import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { Kinetic } from "./kinetic";

const STAGES = [
  { title: "Capture", body: "Website, WhatsApp, Instagram, Slack, Teams and email land in one place" },
  { title: "Understand", body: "Intent, language and order context picked up from the first message" },
  { title: "Answer", body: "Replies grounded in your own knowledge base, never guessed" },
  { title: "Act", body: "Checks orders, books appointments and updates your CRM" },
  { title: "Follow up", body: "Workflows recover carts and chase replies on the right channel" },
  { title: "Hand off", body: "Escalates by your rules — email, Slack or your helpdesk — with full context" },
];

const GAP = 7; // px between wires in the bundle
const R = 16; // corner radius where a wire turns

/**
 * "The lifecycle": a bundle of wires enters from the left and branches into
 * each stage. On desktop the section pins and scroll draws each wire in turn;
 * the stage it reaches lights up.
 */
export function Lifecycle() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          if (!desktop) return;

          const box = stage.current!;
          const rows = gsap.utils.toArray<HTMLElement>("[data-row]", box);
          const bases = gsap.utils.toArray<SVGPathElement>("[data-wire-base]", box);
          const lits = gsap.utils.toArray<SVGPathElement>("[data-wire-lit]", box);
          const pins = gsap.utils.toArray<SVGRectElement>("[data-pin]", box);
          const svg = box.querySelector("svg")!;

          // Route every wire from the measured DOM so it always meets its row
          const layout = () => {
            const b = box.getBoundingClientRect();
            const top = (box.querySelector("[data-bundle]") as HTMLElement).getBoundingClientRect().bottom - b.top + 14;
            const left = rows[0].getBoundingClientRect().left - b.left;
            svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
            rows.forEach((row, i) => {
              const r = row.getBoundingClientRect();
              const ry = r.top - b.top + 34;
              const y = top + i * GAP;
              const x = left - 36 - i * GAP;
              const d = `M 0 ${y} H ${x - R} Q ${x} ${y} ${x} ${y + R} V ${ry - R} Q ${x} ${ry} ${x + R} ${ry} H ${left - 22}`;
              bases[i].setAttribute("d", d);
              lits[i].setAttribute("d", d);
              pins[i].setAttribute("x", `${left - 24}`);
              pins[i].setAttribute("y", `${ry - 3.5}`);
            });
          };
          layout();
          const onResize = () => layout();
          window.addEventListener("resize", onResize);

          gsap.set(lits, { strokeDasharray: 1, strokeDashoffset: reduce ? 0 : 1 });
          if (reduce) return () => window.removeEventListener("resize", onResize);

          gsap.set(rows, { opacity: 0.38 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=160%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
            },
          });

          lits.forEach((lit, i) => {
            tl.to(lit, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" }, i * 0.55)
              .to(rows[i], { opacity: 1, duration: 0.25 }, i * 0.55 + 0.8)
              .to(pins[i], { attr: { fill: "var(--sky)" }, duration: 0.15 }, i * 0.55 + 0.85)
              .fromTo(
                rows[i].querySelector("[data-num]"),
                { color: "var(--fg-subtle)" },
                { color: "var(--accent)", duration: 0.15 },
                i * 0.55 + 0.85,
              );
          });
          tl.to({}, { duration: 0.4 }); // brief hold once everything is lit

          return () => window.removeEventListener("resize", onResize);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative px-5 sm:px-8">
      <div ref={stage} className="relative mx-auto max-w-6xl py-16 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block">
          {STAGES.map((s) => (
            <g key={s.title}>
              <path data-wire-base fill="none" stroke="oklch(0.34 0.119 260 / 0.16)" strokeWidth="1.25" />
              <path data-wire-lit fill="none" stroke="var(--sky)" strokeWidth="1.75" strokeLinecap="round" pathLength={1} />
              <rect data-pin width="16" height="7" rx="3.5" fill="var(--bg)" stroke="var(--sky)" strokeWidth="1.25" />
            </g>
          ))}
        </svg>

        <div data-bundle className="flex justify-between font-mono text-[0.75rem] tracking-[0.12em] text-fg-subtle uppercase">
          <span>Every channel</span>
          <span className="hidden lg:inline">One agent</span>
        </div>

        <div className="relative mt-16 grid gap-14 lg:mt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
          <div className="max-w-xl lg:pr-16">
            <Eyebrow>The lifecycle</Eyebrow>
            <h2 className="text-title mt-4">
              One agent. Six stages. <span className="text-fg-subtle">Nothing dropped.</span>
            </h2>
            <p className="text-lede mt-6 text-fg-muted">
              From the first message to the last follow-up, Steps AI runs each stage
              the moment the previous one finishes — and brings your team in only
              when it matters.
            </p>
            <a href="#how" className="btn btn-primary mt-9">
              <Kinetic>See how it works</Kinetic>
            </a>
          </div>

          <ol className="relative border-b border-line">
            {STAGES.map((s, i) => (
              <li key={s.title} data-row className="flex gap-5 border-t border-line py-5">
                <span data-num className="pt-1 font-mono text-[0.8125rem] text-accent tabular-nums lg:text-fg-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-headline">{s.title}</h3>
                  <p className="mt-1 text-[0.9375rem] text-pretty text-fg-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
