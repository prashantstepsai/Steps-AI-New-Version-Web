"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { RefObject } from "react";
import "./hero-backdrop.css";

/** Hero backdrop: a dotted world map drifting behind everything. */
export function HeroBackdrop({ target }: { target: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end start"] });
  // Map drifts slower than the content: depth.
  const mapY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 select-none">
      <motion.div style={{ y: mapY }} className="hero-map absolute top-20 left-1/2 aspect-[2280/1000] w-[min(1560px,140%)] -translate-x-1/2" />
    </div>
  );
}
