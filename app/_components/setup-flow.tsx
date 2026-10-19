"use client";

import { Eyebrow } from "./eyebrow";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { StepsMark } from "./chat-demo";
import { Reveal } from "./motion";

/*
 * "One simple start. Your own path." — a three-step setup preview, after
 * web-design-current's setup story. Pick a goal in the middle column and the
 * workspace preview on the right swaps to match. While it's on screen the
 * goals cycle on their own until someone chooses one.
 */

const GOALS = [
  { id: "messaging", label: "WhatsApp messaging", detail: "Reach your customers" },
  { id: "agent", label: "AI agent", detail: "Answer and assist" },
  { id: "website", label: "Website chat", detail: "Welcome website visitors" },
] as const;
type Goal = (typeof GOALS)[number]["id"];

const NEXT: Record<Goal, { title: string; connect: string; via: string; status: string }> = {
  messaging: {
    title: "Bring customers closer.",
    connect: "Connect your WhatsApp account",
    via: "Continue with Meta",
    status: "Preview a draft message, then connect WhatsApp through Meta.",
  },
  agent: {
    title: "Meet your new agent.",
    connect: "Choose where your agent helps",
    via: "WhatsApp or your website",
    status: "Preview an assistant reply, then choose WhatsApp or your website.",
  },
  website: {
    title: "Be there when they browse.",
    connect: "Add chat to your website",
    via: "Shopify or another website",
    status: "Preview website chat, then add it to Shopify or another website.",
  },
};

const PHOTO = "/ref/photos/homeware-still-life.webp";
const CYCLE_MS = 4200;
const swap = { type: "spring", bounce: 0, duration: 0.45 } as const;

export function SetupFlow() {
  const [goal, setGoal] = useState<Goal>("agent");
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();
  const shell = useRef<HTMLDivElement>(null);
  const inView = useInView(shell, { margin: "0px 0px -20% 0px" });

  // Cycle goals while visible, until someone picks one
  useEffect(() => {
    if (!auto || reduce || !inView) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      setGoal((g) => GOALS[(GOALS.findIndex((x) => x.id === g) + 1) % GOALS.length].id);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, [auto, reduce, inView]);

  const pick = (id: Goal) => {
    setAuto(false);
    setGoal(id);
  };

  const next = NEXT[goal];

  return (
    <section id="setup" className="scroll-mt-16 px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl lg:max-w-none">
          <Eyebrow>Get started</Eyebrow>
          <h2 className="text-title mt-4 lg:whitespace-nowrap">Set it up for the way your business works.</h2>
          <p className="text-lede mt-5 text-fg-muted">A little about your business. A clear next step.</p>
        </Reveal>

        <Reveal index={1} className="mt-14">
          <div ref={shell} className="overflow-hidden rounded-[36px] bg-surface shadow-lg">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 sm:px-8">
              <span className="flex items-center gap-2.5 text-[1.0625rem] font-semibold tracking-[-0.01em]">
                <span className="grid size-8 place-items-center rounded-[9px] bg-primary text-white">
                  <StepsMark className="size-4" />
                </span>
                Steps AI
              </span>
              <span className="hidden text-[0.9375rem] text-fg-muted sm:inline">One simple start. Your own path.</span>
            </div>

            <div className="grid gap-6 bg-surface-2 p-5 sm:p-8 lg:grid-cols-[1fr_auto_1fr_auto_1.12fr] lg:gap-4 [&>*]:min-w-0">
              {/* 1 · Your business */}
              <Column n={1} title="Your business" index={0}>
                <div className="flex flex-col rounded-[20px] bg-surface p-5 shadow-sm">
                  <Field label="Business name">North &amp; Pine</Field>
                  <Field label="Website">
                    <span className="flex items-center gap-2">
                      <IconGlobe className="size-4 text-fg-subtle" />
                      northandpine.example
                    </span>
                  </Field>
                  <div className="relative mt-4 overflow-hidden rounded-[14px] outline outline-1 -outline-offset-1 outline-[var(--image-outline)]">
                    <Image src={PHOTO} alt="Sample homeware website with an ivory vase, blue bowl and linen" width={768} height={512} className="aspect-[16/11] w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-[oklch(0.975_0.011_232/0.92)] px-4 py-3 backdrop-blur-sm">
                      <span className="block text-[1.125rem] leading-tight font-medium tracking-[-0.01em]">North &amp; Pine</span>
                      <span className="mt-0.5 block text-[0.8125rem] text-fg-muted">Made for everyday living.</span>
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ice text-navy">
                      <IconCheck className="size-4" />
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] font-semibold">Home &amp; living</span>
                      <span className="block text-[0.8125rem] text-fg-muted">Industry from your website</span>
                    </span>
                  </div>
                </div>
              </Column>

              <Connector index={1} />

              {/* 2 · Your goal */}
              <Column n={2} title="Your goal" index={2}>
                <div role="group" aria-label="Choose an example setup goal" className="flex flex-col gap-3 lg:pt-6">
                  {GOALS.map((g) => {
                    const on = goal === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        aria-pressed={on}
                        aria-controls="setup-next-step"
                        onClick={() => pick(g.id)}
                        className={`relative flex items-center gap-3.5 rounded-[18px] p-4 text-left transition-colors duration-300 ${on ? "text-white" : "bg-surface shadow-sm hover:shadow-md"}`}
                      >
                        {on && (
                          <motion.span
                            layoutId="setup-goal"
                            transition={swap}
                            className="absolute inset-0 rounded-[18px] bg-primary shadow-md"
                          />
                        )}
                        <span className="relative grid size-11 shrink-0 place-items-center rounded-[12px] bg-surface text-fg shadow-sm">
                          {g.id === "messaging" ? (
                            <Image src="/ref/brands/whatsapp.png" alt="" width={24} height={24} className="size-6" />
                          ) : g.id === "agent" ? (
                            <IconSparkle className="size-5" />
                          ) : (
                            <IconGlobe className="size-5" />
                          )}
                        </span>
                        <span className="relative min-w-0 flex-1">
                          <span className="block text-[0.9375rem] font-semibold">{g.label}</span>
                          <span className={`block text-[0.8125rem] ${on ? "text-white/70" : "text-fg-muted"}`}>{g.detail}</span>
                        </span>
                        <IconChevron className={`relative size-4 ${on ? "text-white/80" : "text-fg-subtle"}`} />
                      </button>
                    );
                  })}
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-[0.8125rem] text-fg-muted">
                    Choose a goal to explore <IconArrow className="size-3.5" />
                  </p>
                </div>
              </Column>

              <Connector index={3} />

              {/* 3 · Your next step */}
              <Column n={3} title="Your next step" index={4}>
                <div id="setup-next-step" className="flex h-full flex-col overflow-hidden rounded-[20px] bg-surface shadow-sm">
                  <div className="flex items-center gap-2.5 border-b border-line px-4 py-3 text-[0.875rem] text-fg-muted">
                    <IconGrid className="size-4" />
                    North &amp; Pine
                    <span className="ml-auto rounded-[6px] bg-surface-2 px-2 py-1 text-[0.75rem]">Preview</span>
                  </div>

                  <div className="relative flex flex-1 flex-col p-5">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={goal}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={swap}
                        className="flex flex-1 flex-col"
                      >
                        <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-fg-subtle uppercase">Your workspace</p>
                        <h4 className="mt-2 text-[1.5rem] leading-tight font-semibold tracking-[-0.025em]">{next.title}</h4>
                        <div className="mt-5 min-h-[13.5rem]">
                          {goal === "messaging" ? <MessagingScene /> : goal === "agent" ? <AgentScene /> : <WebsiteScene />}
                        </div>
                        <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-surface-2">
                            {goal === "website" ? (
                              <IconGlobe className="size-5" />
                            ) : (
                              <Image src="/ref/brands/whatsapp.png" alt="" width={24} height={24} className="size-6" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[0.9375rem] font-semibold">{next.connect}</span>
                            <span className="block text-[0.8125rem] text-fg-muted">{next.via}</span>
                          </span>
                          <IconArrow className="size-4 text-fg-subtle" />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </Column>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4 sm:px-8">
              <span className="flex items-center gap-2 text-[0.9375rem] text-fg-muted">
                <IconCheck className="size-4 text-success" />
                Guided from the start
              </span>
              <a href="https://stepsai.co/contact/" className="group flex items-center gap-1.5 text-[0.9375rem] font-semibold">
                See your setup in a demo
                <IconArrow className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </Reveal>

        <p className="mt-4 px-2 text-[0.8125rem] text-fg-subtle">Connections and any required approvals come next.</p>
        <p role="status" className="sr-only">
          {GOALS.find((g) => g.id === goal)!.label} example selected. {next.status}
        </p>
      </div>
    </section>
  );
}

/* ─── Layout pieces ───────────────────────────────────────────────── */

function Column({ n, title, index, children }: { n: number; title: string; index: number; children: ReactNode }) {
  return (
    <Reveal index={index} className="flex flex-col">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full border border-line bg-surface font-mono text-[0.8125rem]">{n}</span>
        <h3 className="text-[1.125rem] font-medium tracking-[-0.01em]">{title}</h3>
      </div>
      <div className="flex-1">{children}</div>
    </Reveal>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-line py-3 first:pt-0">
      <span className="block text-[0.8125rem] text-fg-muted">{label}</span>
      <span className="mt-1.5 block text-[0.9375rem] font-medium">{children}</span>
    </div>
  );
}

// Dashed lead-in plus arrowhead; draws itself in once the shell is on screen
function Connector({ index }: { index: number }) {
  return (
    <div aria-hidden className="flex items-center justify-center lg:pt-14">
      <svg viewBox="0 0 44 16" className="h-4 w-11 rotate-90 text-accent-bright lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <motion.path
          d="M2 8h30"
          strokeDasharray="3 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.3 + index * 0.12 }}
        />
        <motion.path
          d="m34 3 6 5-6 5"
          initial={{ opacity: 0, x: -4 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.9 + index * 0.12 }}
        />
      </svg>
    </div>
  );
}

/* ─── Step-3 scenes ──────────────────────────────────────────────── */

function MessagingScene() {
  return (
    <div className="overflow-hidden rounded-[16px] bg-surface-2 outline outline-1 -outline-offset-1 outline-line">
      <div className="flex items-center gap-2 px-3.5 py-2.5 text-[0.8125rem] font-semibold">
        <Image src="/ref/brands/whatsapp.png" alt="" width={20} height={20} className="size-5" />
        WhatsApp
        <span className="ml-auto rounded-full bg-ice px-2 py-0.5 text-[0.6875rem] font-medium text-fg-muted">Draft</span>
      </div>
      <Image src={PHOTO} alt="Sample homeware collection message" width={768} height={512} className="aspect-[2/1] w-full object-cover" />
      <div className="px-3.5 py-3 text-[0.9375rem] font-medium">
        A little something for your home.
        <span className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-accent">
          Explore the collection <IconArrow className="size-3.5" />
        </span>
      </div>
    </div>
  );
}

function AgentScene() {
  return (
    <div className="rounded-[16px] bg-surface-2 p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-primary text-white">
          <StepsMark className="size-4" />
        </span>
        <span>
          <span className="block text-[0.875rem] font-semibold">North &amp; Pine assistant</span>
          <span className="block text-[0.75rem] text-fg-muted">Customer support</span>
        </span>
      </div>
      <p className="mt-4 ml-auto w-fit max-w-[85%] rounded-[16px] rounded-br-md bg-primary px-3.5 py-2 text-[0.875rem] text-white">
        How do I care for my linen?
      </p>
      <div className="mt-2.5 w-fit max-w-[85%] rounded-[16px] rounded-bl-md bg-surface px-3.5 py-2.5 text-[0.875rem] shadow-sm">
        A gentle, cool wash works best.
        <span className="mt-1.5 flex items-center gap-1.5 text-[0.75rem] text-fg-muted">
          <IconDoc className="size-3.5" />
          Product care guide · sample
        </span>
      </div>
    </div>
  );
}

function WebsiteScene() {
  return (
    <div className="relative overflow-hidden rounded-[16px] outline outline-1 -outline-offset-1 outline-line">
      <div className="flex items-center gap-1.5 bg-surface-2 px-3 py-2">
        <i className="size-2 rounded-full bg-fg/15" />
        <i className="size-2 rounded-full bg-fg/15" />
        <i className="size-2 rounded-full bg-fg/15" />
        <span className="ml-2 flex-1 truncate rounded-full bg-surface px-3 py-0.5 text-[0.6875rem] text-fg-muted">northandpine.example</span>
      </div>
      <Image src={PHOTO} alt="Sample website with a chat widget" width={768} height={512} className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]" />
      <div className="absolute right-3 bottom-14 w-[62%] rounded-[14px] bg-surface p-3 shadow-md">
        <span className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-fg-muted">
          <IconBubble className="size-3.5" />
          North &amp; Pine
        </span>
        <span className="mt-1.5 block text-[0.875rem] font-semibold">Make yourself at home.</span>
        <span className="block text-[0.75rem] text-fg-muted">What can we help you find?</span>
      </div>
      <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-primary text-white shadow-md">
        <IconBubble className="size-4" />
      </span>
    </div>
  );
}

/* ─── Icons (1.6px stroke, currentColor) ─────────────────────────── */

function Svg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}
function IconGlobe({ className }: { className?: string }) {
  return <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z" /></Svg>;
}
function IconCheck({ className }: { className?: string }) {
  return <Svg className={className}><path d="m5 12.5 4.5 4L19 7" /></Svg>;
}
function IconSparkle({ className }: { className?: string }) {
  return <Svg className={className}><path d="M11 3.5 12.6 9 18 10.5l-5.4 1.6L11 17.5l-1.6-5.4L4 10.5 9.4 9 11 3.5Z" /><path d="M18.5 3v3.5M16.75 4.75h3.5M17 17.5v3M15.5 19h3" /></Svg>;
}
function IconChevron({ className }: { className?: string }) {
  return <Svg className={className}><path d="m9 5 7 7-7 7" /></Svg>;
}
function IconArrow({ className }: { className?: string }) {
  return <Svg className={className}><path d="M4 12h16M14 6l6 6-6 6" /></Svg>;
}
function IconGrid({ className }: { className?: string }) {
  return <Svg className={className}><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></Svg>;
}
function IconDoc({ className }: { className?: string }) {
  return <Svg className={className}><path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V3.5Z" /><path d="M14 3.5V8h4M9 12.5h6M9 16h6" /></Svg>;
}
function IconBubble({ className }: { className?: string }) {
  return <Svg className={className}><path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6L4.5 19.5Z" /></Svg>;
}
