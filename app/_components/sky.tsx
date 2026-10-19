"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { HeroBackdrop } from "./hero-backdrop";

/**
 * The hero backdrop: a soft cream gradient over a dotted world map. Content drifts a little slower
 * than the page as you scroll away, so the hero settles rather than snaps.
 */
export function Sky({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.35]);

  return (
    <section ref={ref} className={`hero-screen bg-sky relative isolate overflow-hidden ${className}`}>
      <HeroBackdrop target={ref} />
      <motion.div style={{ y, opacity }} className="relative z-10 lg:flex lg:h-full lg:flex-col">
        {children}
      </motion.div>
    </section>
  );
}
