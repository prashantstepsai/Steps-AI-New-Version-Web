"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import StrokeText from "@/components/StrokeText";

/* ─── "Has the intro finished?" — a tiny shared store ──────────────────
   The hero waits on this so its own entrance plays after the curtain
   opens, not hidden underneath it. */

let revealed = false;
const listeners = new Set<() => void>();
const markRevealed = () => {
  revealed = true;
  listeners.forEach((l) => l());
};
export function useRevealed() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => revealed,
    () => false,
  );
}

// The wordmark: drawn in Sky Blue, then wiped in with Deep Navy
const WORDMARK = {
  trigger: "mount",
  fontFamily: "var(--font-geist-pixel), var(--font-geist-mono), monospace",
  fontSize: 136,
  fontWeight: 400,
  letterSpacing: -1,
  strokeColor: "#2C9CF4",
  fillColor: "#0C3474",
  strokeWidth: 1.4,
  drawDuration: 1.05,
  fillDelay: 0.05,
  stagger: 0.06,
  fillMode: "wipe",
  // Same "Line" pixel shape as the site's display type
  style: { fontVariationSettings: '"ELSH" 75' },
} as const;

// Last scroll position, saved as the page is left. On reload the browser
// restores it; if that lands past the hero we skip the intro (see layout.tsx).
const Y_KEY = "steps:y";

/**
 * Intro: "Steps ▪ AI". Each word is drawn in outline and then filled; the
 * square between the words stretches into a
 * seam, then the screen splits along it — "Steps" slides away left, "AI"
 * right — and the landing page opens up through the gap.
 * Plays whenever the page opens on the hero; skipped when a reload lands
 * further down (or on a #hash link). Reduced motion gets a short fade.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const el = root.current!;
    const page = document.getElementById("page");
    const html = document.documentElement;

    // Decided before first paint by the inline head script in layout.tsx
    const seen = html.classList.contains("intro-skip");

    const saveY = () => {
      try {
        sessionStorage.setItem(Y_KEY, String(Math.round(window.scrollY)));
      } catch {}
    };
    window.addEventListener("pagehide", saveY);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      html.classList.remove("intro-lock");
      // Smooth scroll may have been created after the intro began; look it up now
      (window as Window & { __lenis?: { start(): void } }).__lenis?.start();
      // Pins were measured while the page was scaled under the curtain
      requestAnimationFrame(() => ScrollTrigger.refresh());
      if (page) gsap.set(page, { clearProps: "transform,filter,opacity" });
      markRevealed();
      setDone(true);
    };

    if (seen) {
      finish();
      return () => window.removeEventListener("pagehide", saveY);
    }

    html.classList.add("intro-lock");
    window.scrollTo(0, 0);

    if (reduce) {
      const t = gsap.to(el, { opacity: 0, duration: 0.4, delay: 0.5, ease: "power1.out", onComplete: finish });
      return () => {
        t.kill();
        window.removeEventListener("pagehide", saveY);
      };
    }

    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      // The words draw themselves (StrokeText hides its SVG until measured); the seam starts invisible.
      gsap.set(q("[data-seam]"), { scaleX: 0, scaleY: 0, opacity: 1 });
      if (page) gsap.set(page, { scale: 0.94, filter: "blur(8px)", transformOrigin: "50% 40%" });

      const counter = { v: 0 };
      gsap
        .timeline({ onComplete: finish })
        // 1 · The wordmark draws itself (StrokeText runs on mount); a quiet progress count runs
        .to(q("[data-count]"), { opacity: 1, duration: 0.3 }, 0.2)
        .to(counter, {
          v: 100,
          duration: 1.3,
          ease: "power2.inOut",
          onUpdate: () => {
            const n = q("[data-count]")[0];
            if (n) n.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        }, 0.2)
        // 2 · The square pops in between the words …
        .to(q("[data-seam]"), { scaleX: 1, scaleY: 1, duration: 0.45, ease: "back.out(2)" }, 0.75)
        // … then stretches into a full-height seam
        .to(q("[data-seam]"), { scaleY: 120, duration: 0.7, ease: "power3.inOut" }, 1.45)
        .to(q("[data-count]"), { opacity: 0, duration: 0.25 }, 1.5)
        // 3 · Split along the seam: halves part, the page rises through the gap
        .addLabel("split", 2.05)
        .to(q("[data-half='l']"), { xPercent: -100, duration: 1.1, ease: "power4.inOut" }, "split")
        .to(q("[data-half='r']"), { xPercent: 100, duration: 1.1, ease: "power4.inOut" }, "split")
        .to(q("[data-seam]"), { opacity: 0, duration: 0.3 }, "split+=0.1")
        // Let the hero begin its entrance while the gap is still opening
        .call(markRevealed, [], "split+=0.35")
        .to(page ?? {}, { scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, "split+=0.15");
    }, el);

    return () => {
      ctx.revert();
      window.removeEventListener("pagehide", saveY);
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} aria-hidden data-loader className="fixed inset-0 z-[200] select-none">
      {/* Left half carries "Steps", right half carries "AI"; they meet at the seam */}
      <div data-half="l" className="absolute inset-y-0 left-0 flex w-1/2 items-center justify-end overflow-hidden bg-bg pr-[clamp(0.9rem,1.6vw,1.75rem)]">
        <span className="block w-[min(31vw,26rem)]">
          <StrokeText text="Steps" {...WORDMARK} />
        </span>
      </div>
      <div data-half="r" className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-start overflow-hidden bg-bg pl-[clamp(0.9rem,1.6vw,1.75rem)]">
        <span className="block w-[min(12.4vw,10.4rem)]">
          <StrokeText text="AI" {...WORDMARK} />
        </span>
        <span data-count style={{ opacity: 0 }} className="absolute right-8 bottom-7 font-mono text-[0.75rem] tracking-[0.14em] text-fg-subtle tabular-nums">
          000
        </span>
      </div>
      <span
        data-seam
        style={{ opacity: 0 }}
        className="absolute top-1/2 left-1/2 size-[clamp(0.6rem,1.1vw,1rem)] -translate-x-1/2 -translate-y-1/2 bg-accent-bright"
      />
    </div>
  );
}
