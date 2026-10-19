import { Eyebrow } from "./_components/eyebrow";
import type { ReactNode } from "react";
import { Sky } from "./_components/sky";
import { HoverLift, MotionProvider, Reveal } from "./_components/motion";
import { Nav } from "./_components/nav";
import { SmoothScroll } from "./_components/gsap";
import { Lifecycle } from "./_components/lifecycle";
import { Showcase } from "./_components/showcase";
import { Spread } from "./_components/spread";
import { Story } from "./_components/story";
import { Footer } from "./_components/footer";
import Magnet from "./_components/react-bits/Magnet";
import { Compare } from "./_components/compare";
import { Faq } from "./_components/faq";
import { Founder } from "./_components/founder";
import { HeroHeadline } from "./_components/hero-headline";
import { Integrations } from "./_components/integrations";
import { Loader } from "./_components/loader";
import { Numbers } from "./_components/numbers";
import { HeroCarousel } from "./_components/hero-carousel";
import { Kinetic, KineticButtons } from "./_components/kinetic";
import { Channels } from "./_components/channels";
import { Journey } from "./_components/journey";
import { SetupFlow } from "./_components/setup-flow";
import { ConnectTools } from "./_components/connect-tools";

// Data below is as listed on stepsai.co
const SOURCES = [
  ["Website pages", "Auto-crawled"],
  ["Documents", "PDF, DOCX"],
  ["Google Drive", "Synced"],
  ["Notion", "Synced"],
  ["FAQs & help docs", "Imported"],
];
const TOOLS = ["Shopify", "WooCommerce", "Gmail", "Calendly", "HubSpot", "Zendesk"];
const SECURITY = [
  ["In transit", "TLS 1.2+"],
  ["At rest", "AES-256"],
  ["Shared models", "Never trained on your data"],
  ["Compliance", "GDPR-ready"],
];

export default function Home() {
  return (
    <MotionProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:shadow-md"
      >
        Skip to content
      </a>

      <Loader />
      <SmoothScroll />
      <KineticButtons />

      {/* #page is what the intro curtain reveals (scaled + blurred underneath) */}
      <div id="page" className="flex min-h-full flex-1 flex-col">
        <Nav />

        <main id="main" className="flex-1">
          <Hero />
          <Integrations />
          <Channels />
          <Lifecycle />
          <Journey />
          <Features />
          <Story />
          <SetupFlow />
          <ConnectTools />
          <Showcase />
          <Numbers />
          <Founder />
          <Compare />
          <Faq />
          <Spread />
        </main>

        <Footer />
      </div>
    </MotionProvider>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <Sky>
      <div className="hero-grid mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pt-32 pb-20 sm:px-8 md:pt-40 lg:flex-1 lg:grid-cols-[1.1fr_1fr] lg:gap-10 [&>*]:min-w-0">
        <div className="max-w-xl">
          <HeroHeadline className="text-display" />
          <Reveal immediate index={2}>
            <p className="text-lede mt-6 text-on-sky-muted">
              Never miss another customer. Visitors get instant answers on your
              website, WhatsApp and Instagram — and your team steps in the moment a
              person is needed.
            </p>
          </Reveal>
          <Reveal immediate index={3} className="mt-9 flex flex-wrap gap-3">
            <Magnet padding={50} magnetStrength={5} maxOffset={8}>
              <a href="https://app.stepsai.co/signup" className="btn btn-primary">
                <Kinetic>Get Started</Kinetic>
              </a>
            </Magnet>
            <a href="https://stepsai.co/contact/" className="btn btn-secondary">
              <Kinetic>Book a Demo</Kinetic>
              <Chevron />
            </a>
          </Reveal>
          <Reveal immediate index={4}>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-on-sky-muted">
              <span>Cancel anytime</span>
              <span aria-hidden className="size-1 rounded-full bg-fg/25" />
              <span className="flex items-center gap-1.5"><span aria-hidden className="size-1.5 bg-accent-bright" />Meta Business Partner</span>
              <span className="flex items-center gap-1.5"><span aria-hidden className="size-1.5 bg-accent-bright" />Shopify Partner</span>
            </div>
          </Reveal>
        </div>

        <Reveal immediate index={3} transition={{ duration: 1.1 }}>
          <HeroCarousel />
        </Reveal>
      </div>
    </Sky>
  );
}

/* ─── Features (bento) ────────────────────────────────────────────────── */

function Features() {
  return (
    <section id="features" className="relative scroll-mt-16 overflow-hidden bg-surface-2 px-5 py-16 sm:px-8 lg:py-20">
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="max-w-2xl lg:max-w-none">
          <Eyebrow>Trained on your data</Eyebrow>
          <h2 className="text-title mt-4 lg:whitespace-nowrap">
            More than answers. <span className="text-fg-subtle">It gets things done.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-6 [&>*]:min-w-0">
          <Card index={0} className="md:col-span-3" title="Knows your business" body="Your site, documents and help content become one knowledge base — plus 100+ app integrations.">
            <ul className="flex flex-col gap-2">
              {SOURCES.map(([name, how]) => (
                <li key={name} className="flex items-center gap-2.5 rounded-[12px] bg-surface px-3 py-2.5 text-[0.875rem]">
                  <span className="grid size-5 place-items-center rounded-full bg-ice text-navy">
                    <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m2.5 6.5 2.3 2L9.5 3.5" /></svg>
                  </span>
                  {name}
                  <span className="ml-auto font-mono text-[0.75rem] text-fg-subtle">{how}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card index={1} className="md:col-span-3" title="Works inside your tools" body="Native integrations, plus custom actions through the API and webhooks.">
            <ul className="grid grid-cols-3 gap-2">
              {TOOLS.map((t) => (
                <li key={t} className="grid h-14 place-items-center rounded-[12px] bg-surface text-[0.8125rem] font-medium text-fg-muted">
                  {t}
                </li>
              ))}
            </ul>
          </Card>

          <Card index={0} className="md:col-span-2" title="Follows up for you" body="Workflows recover carts and re-engage customers on WhatsApp.">
            <ol className="flex flex-col items-start">
              <FlowStep label="Cart abandoned" />
              <FlowLine />
              <FlowStep label="Wait 1 hour" muted />
              <FlowLine />
              <FlowStep label="WhatsApp nudge" accent />
            </ol>
          </Card>

          <Card index={1} className="md:col-span-2" title="Resolves on its own" body="Queries handled without human intervention.">
            <div className="flex h-[8.25rem] flex-col justify-center rounded-[12px] bg-surface px-5">
              <p className="font-pixel text-[3.75rem] leading-none">80%</p>
              <p className="mt-2 flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.08em] text-fg-subtle uppercase"><span aria-hidden className="size-1.5 bg-gold" />Auto-resolved</p>
            </div>
          </Card>

          <Card index={2} className="md:col-span-2" title="Secure by default" body="Configurable retention and role-based access for regulated industries.">
            <dl className="flex flex-col gap-2 text-[0.875rem]">
              {SECURITY.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 rounded-[12px] bg-surface px-3 py-2.5">
                  <dt className="text-fg-muted">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  body,
  children,
  className = "",
  index = 0,
}: {
  title: string;
  body: string;
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <Reveal index={index} className={className}>
      <HoverLift className="flex h-full flex-col gap-6 rounded-[28px] bg-surface p-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="px-3 pt-4">
          <h3 className="text-headline">{title}</h3>
          <p className="mt-1.5 max-w-[32rem] text-[0.9375rem] text-pretty text-fg-muted">{body}</p>
        </div>
        {/* 28px outer radius − 12px padding = 16px inner: concentric corners */}
        <div className="mt-auto rounded-[16px] bg-surface-2 p-3">{children}</div>
      </HoverLift>
    </Reveal>
  );
}

function FlowStep({ label, muted, accent }: { label: string; muted?: boolean; accent?: boolean }) {
  return (
    <li
      className={`rounded-full px-3 py-1.5 text-[0.8125rem] font-medium ${
        accent ? "bg-primary text-white" : muted ? "bg-surface text-fg-muted" : "bg-surface"
      }`}
    >
      {label}
    </li>
  );
}

function FlowLine() {
  return <li aria-hidden className="pulse-line ml-5 h-5 w-0.5 rounded-full bg-line" />;
}

/* ─── Icons (1.5px stroke, currentColor) ─────────────────────────────── */

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" className="-mr-1 size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 3.5 4.5 4.5L6 12.5" />
    </svg>
  );
}
