"use client";

import { Eyebrow } from "./eyebrow";
import { Reveal } from "./motion";
import "./connect-tools.css";

// Official logos only.
const APPS = [
  { slug: "shopify", name: "Shopify" },
  { slug: "woocommerce", name: "WooCommerce" },
  { slug: "google-calendar", name: "Google Calendar" },
  { slug: "calendly", name: "Calendly" },
  { slug: "hubspot", name: "HubSpot" },
  { slug: "zendesk", name: "Zendesk" },
  { slug: "google-drive", name: "Google Drive" },
  { slug: "notion", name: "Notion" },
  { slug: "google-sheets", name: "Google Sheets" },
  { slug: "airtable", name: "Airtable" },
  { slug: "slack", name: "Slack" },
  { slug: "cal-com", name: "Cal.com" },
  { slug: "square-appointments", name: "Square Appointments" },
];
// Every app appears once across the two rows
const ROWS = [
  [0, 2, 4, 6, 8, 10, 12],
  [1, 3, 5, 7, 9, 11],
];

/**
 * "Connect the tools you already use" — two ribbons of logo tiles drifting in
 * opposite directions. Each track is three copies of its set, so the CSS loop
 * (−33.333%) is seamless; hovering stops it.
 */
export function ConnectTools() {
  return (
    <section id="integrations-hub" className="scroll-mt-16 overflow-hidden py-16 lg:py-20">
      <Reveal className="mx-auto max-w-2xl px-5 text-center sm:px-8 lg:max-w-none">
        <Eyebrow>Integrations</Eyebrow>
        <h2 className="text-title mt-4 lg:whitespace-nowrap">Connect the tools you already use</h2>
        <p className="text-lede mx-auto mt-5 max-w-[34rem] text-fg-muted">
          Connect your store, calendar, CRM and knowledge sources to help your agent do the job.
        </p>
        <a
          href="https://stepsai.co/integrations/"
          className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-fg underline decoration-fg/25 underline-offset-[6px] transition-colors hover:decoration-accent"
        >
          View all integrations
          <svg viewBox="0 0 16 16" className="size-4 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
      </Reveal>

      <Reveal index={1} className="mx-auto mt-12 max-w-[72rem]">
        <div className="ct-ribbons" role="list" aria-label="Supported integrations">
          {ROWS.map((row, r) => (
            <div key={r} className={`ct-ribbon ct-ribbon-${r}`}>
              <div className="ct-track">
                {[0, 1, 2].map((copy) => (
                  <div key={copy} className="ct-set" aria-hidden={copy > 0 ? true : undefined}>
                    {row.map((i) => {
                      const app = APPS[i];
                      return (
                        <div
                          key={app.slug}
                          role={copy === 0 ? "listitem" : undefined}
                          className="ct-tile"
                          title={app.name}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG logos */}
                          <img src={`/ref/integrations/${app.slug}.svg`} alt={copy === 0 ? app.name : ""} width={64} height={64} loading="lazy" />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

    </section>
  );
}
