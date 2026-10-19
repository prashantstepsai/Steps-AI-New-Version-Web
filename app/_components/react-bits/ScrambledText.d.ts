// Types for the vendored ScrambledText.jsx (React Bits)
import type { CSSProperties, JSX, ReactNode } from "react";

export type ScrambledTextProps = {
  children?: ReactNode;
  effect?: "scramble" | "lift" | "blur" | "magnify";
  radius?: number;
  strength?: number;
  trail?: number;
  duration?: number;
  speed?: number;
  clickBurst?: boolean;
  scrambleChars?: string;
  scrambleColor?: string;
  color?: string;
  fontFamily?: string;
  intro?: boolean;
  className?: string;
  style?: CSSProperties;
};

declare function ScrambledText(props: ScrambledTextProps): JSX.Element;
export default ScrambledText;
