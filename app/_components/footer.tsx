import { StepsMark } from "./chat-demo";
import SplitText from "./react-bits/SplitText";
import { Kinetic } from "./kinetic";

// Link targets mirror stepsai.co
const SITE = "https://stepsai.co";
const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["AI Agents", `${SITE}/product/ai-agents/`],
      ["Copilot", `${SITE}/product/copilot/`],
      ["Features", `${SITE}/features/`],
      ["Integrations", `${SITE}/integrations/`],
      ["Pricing", `${SITE}/pricing/`],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["E-Commerce", `${SITE}/solutions/ecommerce/`],
      ["SaaS", `${SITE}/solutions/saas/`],
      ["Healthcare", `${SITE}/solutions/healthcare/`],
      ["Real Estate", `${SITE}/solutions/real-estate/`],
      ["Education", `${SITE}/solutions/education/`],
    ],
  },
  {
    title: "Channels",
    links: [
      ["Website", `${SITE}/channels/website/`],
      ["WhatsApp", `${SITE}/channels/whatsapp/`],
      ["Instagram", `${SITE}/channels/instagram/`],
      ["Standalone page", `${SITE}/channels/standalone-page/`],
      ["All channels", `${SITE}/channels/`],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", `${SITE}/about/`],
      ["Founder’s note", `${SITE}/note/`],
      ["Partners", `${SITE}/partners/`],
      ["Careers", `${SITE}/careers/`],
      ["Blog", `${SITE}/blog/`],
      ["Contact", `${SITE}/contact/`],
    ],
  },
];

const SOCIAL: [string, string][] = [
  ["LinkedIn", "https://www.linkedin.com/company/stepsai-aide/"],
  ["Instagram", "https://www.instagram.com/stepsai_co"],
  ["X", "https://x.com/stepsai_aide"],
];

// Static so the page stays fully prerendered under Cache Components.
const YEAR = 2026;

/** Signature mark: the orange square. */
function Square({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`inline-block size-2 shrink-0 bg-accent-bright ${className}`} />;
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <a href="#" className="inline-flex items-center gap-2.5 text-[1.0625rem] font-semibold tracking-tight">
              {/* Same mark as the nav, so the brand reads as one */}
              <span className="grid size-7 place-items-center rounded-[8px] bg-fg text-white">
                <StepsMark className="size-3.5" />
              </span>
              Steps AI
            </a>
            <p className="mt-5 text-[0.9375rem] text-pretty text-fg-muted">
              Your AI agent layer for every business.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="https://app.stepsai.co/signup" className="btn btn-primary">
                <Kinetic>Get Started</Kinetic>
              </a>
              <a href="https://stepsai.co/contact/" className="btn btn-secondary">
                <Kinetic>Book a Demo</Kinetic>
              </a>
            </div>
            <ul className="mt-10 flex gap-5 text-[0.875rem] text-fg-muted">
              {SOCIAL.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="transition-colors duration-200 hover:text-fg">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="font-mono text-[0.6875rem] tracking-[0.14em] text-fg-subtle uppercase">{col.title}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="group relative inline-flex items-center text-[0.9375rem] text-fg-muted transition-colors duration-200 hover:text-fg">
                        {/* The square pops in and the label steps aside — transforms only, no layout shift */}
                        <span
                          aria-hidden
                          className="absolute left-0 size-1.5 scale-50 bg-accent-bright opacity-0 transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                        />
                        <span className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-3 group-focus-visible:translate-x-3">
                          {label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line py-6 font-mono text-[0.75rem] text-fg-subtle sm:flex-row sm:items-center">
          <span className="flex items-center gap-2">
            <Square className="size-1.5" />© {YEAR} Steps AI
          </span>
          <span className="flex gap-6 sm:ml-8">
            <a href="https://stepsai.co/privacy-policy/" className="transition-colors duration-200 hover:text-fg">Privacy</a>
            <a href="https://stepsai.co/terms-of-service/" className="transition-colors duration-200 hover:text-fg">Terms</a>
          </span>
          <span className="flex items-center gap-2 sm:ml-8">
            <span aria-hidden className="size-1.5 rounded-full bg-success" /> Operational
          </span>
          <a href="#main" className="transition-colors duration-200 hover:text-fg sm:ml-auto">
            Back to top ↑
          </a>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the page edge, rising in letter by letter */}
      <div aria-hidden className="relative -mb-[0.2em] px-3 select-none">
        <SplitText
          tag="p"
          text="Steps AI"
          className="font-pixel block w-full text-[clamp(4.5rem,17vw,17rem)] leading-[0.85] tracking-[-0.02em] text-fg"
          textAlign="center"
          splitType="chars"
          effect="rise"
          mask
          delay={45}
          duration={1.2}
          threshold={0.05}
          rootMargin="0px"
        />
        <Square className="absolute top-[18%] right-[4.5%] size-[clamp(0.75rem,2vw,1.75rem)]" />
      </div>
    </footer>
  );
}
