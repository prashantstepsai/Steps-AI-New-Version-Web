// Types for the vendored RotatingText.jsx (React Bits)
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";

export type RotatingTextHandle = { next: () => void; previous: () => void; jumpTo: (i: number) => void; reset: () => void };

export type RotatingTextProps = Omit<HTMLAttributes<HTMLSpanElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> & {
  texts: string[];
  effect?: "slide" | "flip" | "blur" | "scale" | "drop";
  direction?: "up" | "down";
  highlight?: boolean;
  highlightColor?: string;
  rotationInterval?: number;
  blur?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  splitBy?: "characters" | "words" | "lines" | string;
  loop?: boolean;
  auto?: boolean;
  pauseOnHover?: boolean;
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
  animatePresenceMode?: "wait" | "sync";
  animatePresenceInitial?: boolean;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
};

declare const RotatingText: ForwardRefExoticComponent<RotatingTextProps & RefAttributes<RotatingTextHandle>>;
export default RotatingText;
