"use client";

import { Eyebrow } from "./eyebrow";
import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { Kinetic } from "./kinetic";
import TrueFocus from "./react-bits/TrueFocus";

type Cell = boolean | string | { ok: boolean; note: string };

const COLS = ["Steps AI", "Verifast", "Tidio", "Chatbase"];

// Transcribed from the comparison on stepsai.co
const ROWS: { label: string; cells: Cell[] }[] = [
  {
    label: "Entry price",
    cells: [
      "₹2,499/mo (~$30), nothing gated",
      "~$83/mo",
      "$29/mo base, but real AI needs the Lyro add-on (~$68/mo)",
      "$32–40/mo",
    ],
  },
  { label: "E-commerce automation (cart recovery, order tracking)", cells: [true, true, false, false] },
  { label: "Built-in ticketing", cells: [true, { ok: false, note: "Leads pushed to CRM instead" }, true, false] },
  { label: "Instagram comment & DM automation", cells: [true, false, "Add-on cost", true] },
  { label: "WhatsApp re-engagement workflows", cells: [true, false, false, false] },
  { label: "Human handoff", cells: [true, true, true, { ok: false, note: "No native inbox" }] },
  {
    label: "Hidden costs",
    cells: ["None", "None", "Lyro AI add-on: $39–289/mo extra", "Premium models burn credits 3–5× faster"],
  },
];

/** "They route. We resolve." — rows deal in one after another; the Steps AI column sits on its own raised card. */
export function Compare() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-row]"), {
        opacity: 0,
        y: 14,
        stagger: 0.07,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: q("table")[0], start: "top 75%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="compare" className="scroll-mt-16 px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>How we compare</Eyebrow>
            <h2 className="sr-only">They route. We resolve.</h2>
            {/* Sky-blue brackets hop between the two halves; the other half blurs */}
            <div aria-hidden className="text-title mt-4 [&_.focus-container]:justify-start [&_.focus-container]:gap-x-[0.45em] [&_.focus-word]:!cursor-default [&_.focus-word]:!text-[length:inherit] [&_.focus-word]:!font-[inherit]">
              <TrueFocus
                sentence="They route.|We resolve."
                separator="|"
                focusStyle="brackets"
                borderColor="#2C9CF4"
                blurAmount={3}
                unfocusedOpacity={0.45}
                cornerSize={14}
                borderWidth={2}
                animationDuration={0.6}
                pauseBetweenAnimations={1.6}
              />
            </div>
            <p className="text-lede mt-5 text-fg-muted">Legacy tools deflect to a human queue. Steps AI actually answers.</p>
          </div>
          <a href="https://stepsai.co/pricing/" className="btn btn-secondary shrink-0">
            <Kinetic>See full pricing</Kinetic>
          </a>
        </div>

        <div className="relative mt-14">
          {/* Raised card behind the Steps AI column */}
          <div aria-hidden className="absolute inset-y-0 left-[28%] w-[18%] rounded-[24px] bg-surface shadow-md" />
          <table className="relative w-full table-fixed border-separate border-spacing-0 text-left">
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="pb-5 font-mono text-[0.6875rem] font-normal tracking-[0.14em] text-fg-subtle uppercase">
                  Capability
                </th>
                {COLS.map((c, i) => (
                  <th key={c} scope="col" className="px-5 pt-6 pb-5 align-bottom">
                    {i === 0 && (
                      <span className="mb-2 inline-flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-accent uppercase">
                        <span aria-hidden className="size-1.5 bg-accent-bright" /> Most capable
                      </span>
                    )}
                    <span className={`block ${i === 0 ? "font-pixel text-[1.875rem] leading-none" : "text-[1rem] font-semibold text-fg-muted"}`}>{c}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} data-row>
                  <th scope="row" className="border-t border-line py-5 pr-6 text-[0.9375rem] font-medium">
                    {r.label}
                  </th>
                  {r.cells.map((c, i) => (
                    <td key={i} className={`border-t border-line px-5 py-5 align-top text-[0.875rem] ${i === 0 ? "text-fg" : "text-fg-muted"}`}>
                      <CellView cell={c} strong={i === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function CellView({ cell, strong }: { cell: Cell; strong: boolean }) {
  if (typeof cell === "string") return <span className={strong ? "font-medium" : ""}>{cell}</span>;
  const ok = typeof cell === "boolean" ? cell : cell.ok;
  const note = typeof cell === "object" ? cell.note : null;
  return (
    <span className="flex flex-col gap-1.5">
      {ok ? (
        <span className={`grid size-6 place-items-center rounded-full ${strong ? "bg-primary text-white" : "bg-fg/10 text-fg"}`}>
          <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m2.5 6.5 2.3 2L9.5 3.5" />
          </svg>
          <span className="sr-only">Yes</span>
        </span>
      ) : (
        <span className="grid size-6 place-items-center rounded-full border border-line text-fg-subtle">
          <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M3 3l6 6M9 3 3 9" />
          </svg>
          <span className="sr-only">No</span>
        </span>
      )}
      {note && <span className="text-[0.8125rem] text-fg-subtle">{note}</span>}
    </span>
  );
}
