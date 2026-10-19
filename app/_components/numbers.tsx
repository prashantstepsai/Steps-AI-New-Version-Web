"use client";

import StrokeText from "@/components/StrokeText";
import { Eyebrow } from "./eyebrow";
import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

const STATS = [
  { label: "Query volume", pre: "", value: 3, post: "×", note: "Average query growth in 90 days" },
  { label: "Resolution rate", pre: "", value: 80, post: "%+", note: "Handled without a human" },
  { label: "Response speed", pre: "<", value: 5, post: "s", note: "Average reply time" },
  { label: "Ticket deflection", pre: "", value: 75, post: "%", note: "Support tickets deflected" },
];

const CHANNELS = ["Website", "WhatsApp", "Slack", "Teams", "Instagram", "API"];

/** "The numbers speak." Figures count up once as the row scrolls in. */
export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nums = q("[data-num]") as HTMLElement[];
      if (reduce) return;

      nums.forEach((el, i) => {
        const target = STATS[i].value;
        const box = { v: 0 };
        el.textContent = "0";
        gsap.to(box, {
          v: target,
          duration: 1.6,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(box.v));
          },
        });
      });
      gsap.from(q("[data-col]"), {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <Eyebrow>By the numbers</Eyebrow>
            <h2 className="text-title mt-4 w-[min(34rem,80vw)] [&_.stroke-text\_\_svg]:!ml-0">
              <StrokeText
                text="The numbers speak."
                trigger="scroll"
                fontFamily="var(--font-geist-pixel), var(--font-geist-mono), monospace"
                fontSize={50}
                fontWeight={400}
                letterSpacing={-0.5}
                strokeColor="#2C9CF4"
                fillColor="#0C3474"
                strokeWidth={0.6}
                style={{ fontVariationSettings: '"ELSH" 75' }}
                drawDuration={1.4}
                stagger={0.04}
                fillMode="wipe"
              />
            </h2>
          </div>
          <p className="max-w-[16rem] font-mono sm:text-right text-[0.75rem] leading-relaxed text-fg-subtle">
            Early results. Yours will vary.
          </p>
        </div>

        <dl className="mt-14 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} data-col className="flex flex-col gap-4 border-b border-line py-8 pr-6 lg:border-b-0 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
              <dt className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-fg-subtle uppercase">
                <span aria-hidden className="size-1.5 bg-accent-bright" />
                {s.label}
              </dt>
              <dd className="font-pixel text-[clamp(3.25rem,2rem+4vw,5.5rem)] leading-none tabular-nums">
                {s.pre}
                <span data-num>{s.value}</span>
                {s.post}
              </dd>
              <dd className="text-[0.9375rem] text-fg-muted">{s.note}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-8 flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <li key={c} className="rounded-full bg-surface px-3 py-1.5 font-mono text-[0.75rem] text-fg-muted shadow-sm">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
