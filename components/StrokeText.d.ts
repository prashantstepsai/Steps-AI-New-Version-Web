// Types for the React Bits StrokeText.jsx (installed via the shadcn registry)
import type { CSSProperties, JSX } from "react";

export type StrokeTextProps = {
  text?: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: "mount" | "scroll" | "hover" | "loop";
  fillMode?: "wipe" | "fade" | "none";
  wipeFrom?: "left" | "right" | "top" | "bottom";
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: number;
  reverse?: boolean;
  strokeStyle?: "solid" | "dashed" | "dotted";
  dashLength?: number;
  marching?: boolean;
  hoverRedraw?: boolean;
  shadow?: boolean;
  shadowColor?: string;
  className?: string;
  style?: CSSProperties;
};

declare function StrokeText(props: StrokeTextProps): JSX.Element;
export default StrokeText;
