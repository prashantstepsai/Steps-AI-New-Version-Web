"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { StepsMark } from "./chat-demo";
import { Kinetic } from "./kinetic";

const LINKS = [
  ["#features", "Product"],
  ["#channels", "Channels"],
  ["#how", "How it works"],
  ["#solutions", "Solutions"],
  ["https://stepsai.co/pricing/", "Pricing"],
] as const;

/**
 * Floats transparent over the sky, then materializes into glass as content
 * scrolls under it — the hairline appears only once something is beneath.
 */
export function Nav() {
  const { scrollY } = useScroll();
  const glass = useTransform(scrollY, [0, 80], [0, 1]);
  const edge = useTransform(scrollY, [40, 100], ["0 1px 0 oklch(0.34 0.119 260 / 0)", "0 1px 0 oklch(0.34 0.119 260 / 0.08)"]);

  return (
    <motion.header style={{ boxShadow: edge }} className="fixed inset-x-0 top-0 z-50">
      <motion.div aria-hidden style={{ opacity: glass }} className="glass absolute inset-0" />
      <nav aria-label="Primary" className="relative mx-auto flex h-14 max-w-6xl items-center gap-8 px-5 sm:px-8">
        <a href="#" className="flex items-center gap-2 text-[0.9375rem] font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-[8px] bg-fg text-white">
            <StepsMark className="size-3.5" />
          </span>
          Steps AI
        </a>
        <ul className="hidden items-center gap-7 text-[0.875rem] text-on-sky-muted md:flex">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="transition-colors duration-200 hover:text-fg">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-2">
          <a href="https://app.stepsai.co/signup" className="hidden px-3 text-[0.875rem] text-on-sky-muted transition-colors duration-200 hover:text-fg sm:inline">
            Sign up
          </a>
          <a href="https://app.stepsai.co/signup" className="btn btn-primary h-9 px-4 text-[0.875rem]">
            <Kinetic>Get Started</Kinetic>
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
