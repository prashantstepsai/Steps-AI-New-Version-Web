// Types for the vendored TrueFocus.jsx (React Bits)
import type { JSX } from "react";

export type TrueFocusProps = {
  sentence?: string;
  separator?: string;
  focusStyle?: "brackets" | "box" | "underline" | "highlight";
  borderColor?: string;
  highlightColor?: string;
  glowColor?: string;
  focusScale?: number;
  blurAmount?: number;
  unfocusedOpacity?: number;
  easing?: "smooth" | "spring";
  order?: "sequential" | "random";
  manualMode?: boolean;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  cornerSize?: number;
  borderWidth?: number;
};

declare function TrueFocus(props: TrueFocusProps): JSX.Element;
export default TrueFocus;
