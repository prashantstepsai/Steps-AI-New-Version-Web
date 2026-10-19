"use client";

import ScrambledText from "./react-bits/ScrambledText";

/**
 * Section label. Decodes out of `.:` characters the first time it scrolls in,
 * and scrambles again under the pointer — the same small beat in every section.
 */
export function Eyebrow({ children, className = "" }: { children: string; className?: string }) {
  return (
    <ScrambledText
      className={`!m-0 !max-w-none !text-[0.75rem] leading-normal tracking-[0.14em] text-fg-subtle uppercase ${className}`}
      fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      scrambleChars=".:"
      radius={70}
      duration={0.9}
      speed={0.6}
      clickBurst={false}
    >
      {children}
    </ScrambledText>
  );
}
