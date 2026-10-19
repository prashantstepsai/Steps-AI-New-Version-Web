"use client";

import { Eyebrow } from "./eyebrow";
import { useId, useState } from "react";
import { Reveal } from "./motion";

// Verbatim from stepsai.co
const FAQS = [
  {
    q: "How long does setup actually take?",
    a: "Most teams are live in under 5 minutes. Paste your URL, we auto-crawl your site, you pick a persona and brand colors, then deploy. Deeper customization (custom flows, integrations) takes longer but isn't required to launch.",
  },
  {
    q: "Which channels does Steps AI support?",
    a: "Website widget, standalone page, WhatsApp, Instagram DM, Email, Slack, and Microsoft Teams. All powered by the same AI brain, so context carries across channels.",
  },
  {
    q: "Will it work with my existing tools?",
    a: "Yes. Native integrations with Shopify, WooCommerce, Gmail, Calendly, HubSpot, Zendesk, and more. Custom integrations available via API and webhooks.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Data is encrypted in transit (TLS 1.2+) and at rest (AES-256), and your training data is never used to train shared models. GDPR-ready, with role-based access and configurable data retention for regulated industries.",
  },
  {
    q: "Do I need engineers to build or maintain this?",
    a: "No. Setup, training, and deployment are no-code. Engineers can optionally use our API for custom actions, but the full product works without writing a line of code.",
  },
  {
    q: "What happens when the AI can't answer?",
    a: "You define escalation rules. The agent hands off to a human via email, Slack, or your helpdesk, with full conversation context so nothing gets lost.",
  },
];

/** "Questions, answered." One open at a time; panels open by animating grid rows 0fr → 1fr (no height measuring). */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" className="scroll-mt-16 px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.6fr]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-title mt-4">Questions, answered.</h2>
          <p className="mt-6 text-[0.9375rem] text-fg-muted">
            Something else on your mind?{" "}
            <a href="https://stepsai.co/contact/" className="text-fg underline decoration-line underline-offset-4 hover:decoration-fg">
              Talk to us
            </a>
            .
          </p>
        </Reveal>

        <Reveal index={1}>
          <ul className="border-b border-line">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              const panel = `${base}-p${i}`;
              const button = `${base}-b${i}`;
              return (
                <li key={f.q} className="border-t border-line">
                  <h3>
                    <button
                      id={button}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panel}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center gap-6 py-6 text-left"
                    >
                      <span className="flex-1 text-[1.125rem] font-medium tracking-[-0.01em]">{f.q}</span>
                      <span
                        aria-hidden
                        className={`relative grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-300 ${isOpen ? "bg-primary text-white" : "bg-surface text-fg shadow-sm group-hover:bg-surface-2"}`}
                      >
                        <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
                        <span
                          className={`absolute h-3 w-[1.5px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? "scale-y-0" : ""}`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panel}
                    role="region"
                    aria-labelledby={button}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden" inert={!isOpen}>
                      <p className="max-w-[40rem] pr-14 pb-7 text-[1rem] leading-relaxed text-pretty text-fg-muted">{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
