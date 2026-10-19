"use client";

import { MotionConfig, motion, type HTMLMotionProps, type Transition } from "motion/react";
import { useRevealed } from "./loader";

/** Apple house spring: critically damped, no overshoot. */
export const spring: Transition = { type: "spring", bounce: 0, duration: 0.8 };

/** Respect the OS reduce-motion setting everywhere: transforms drop, opacity stays. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type RevealProps = HTMLMotionProps<"div"> & {
  /** Stagger index — each step adds 80ms. */
  index?: number;
  /** Play on mount instead of when scrolled into view (hero). */
  immediate?: boolean;
};

const hidden = { opacity: 0, y: 18, filter: "blur(6px)" };
const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

/** Fades, lifts and un-blurs its children once. `immediate` ones wait for the intro curtain. */
export function Reveal({ index = 0, immediate, transition, ...props }: RevealProps) {
  const revealed = useRevealed();
  const t = { ...spring, delay: index * 0.08 + (immediate ? 0.08 : 0), ...transition };
  return immediate ? (
    <motion.div initial={hidden} animate={revealed ? shown : hidden} transition={t} {...props} />
  ) : (
    <motion.div
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={t}
      {...props}
    />
  );
}

/** Small spring lift on pointer hover. Motion ignores emulated touch hovers. */
export function HoverLift(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
      {...props}
    />
  );
}
