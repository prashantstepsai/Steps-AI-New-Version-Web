"use client";

import { useEffect } from "react";
import { gsap } from "./gsap";

/**
 * Kinetic button label. Each character is a little window holding two
 * copies: the resting one rolls up and out, its twin rolls up into place.
 * Rendered as markup (not injected after load), so React owns the DOM and
 * screen readers get the plain label from the sr-only copy.
 */
export function Kinetic({ children }: { children: string }) {
  return (
    <>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="k-wrap">
        {[...children].map((ch, i) =>
          ch === " " ? (
            <span key={i} className="k-space" />
          ) : (
            <span key={i} className="k-char">
              <span className="k-p">{ch}</span>
              <span className="k-s">{ch}</span>
            </span>
          ),
        )}
      </span>
    </>
  );
}

const STAGGER = 0.02;
const DURATION = 0.45;
const LEAD = 0.08; // fill leads the letters

/**
 * One delegated listener drives every `.btn` on the page — no per-button
 * setup. Mouse only: touch has no hover, and keyboard focus stays instant.
 */
export function KineticButtons() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const parts = (btn: Element) => ({
      p: btn.querySelectorAll(".k-p"),
      s: btn.querySelectorAll(".k-s"),
    });

    const enter = (btn: Element) => {
      const { p, s } = parts(btn);
      if (!p.length) return;
      gsap.killTweensOf([p, s]);
      // Letters stay fully opaque — each character's clipped window does the
      // hiding — so the label is always readable on top of the fill. The roll
      // starts a beat after the fill so incoming letters land on it.
      gsap.to(p, { yPercent: -100, rotation: -8, stagger: STAGGER, duration: DURATION, delay: LEAD, ease: "power2.out" });
      gsap.fromTo(
        s,
        { yPercent: 100, rotation: 8, opacity: 1 },
        { yPercent: 0, rotation: 0, stagger: STAGGER, duration: DURATION, delay: LEAD, ease: "power2.out" },
      );
    };

    const leave = (btn: Element) => {
      const { p, s } = parts(btn);
      if (!p.length) return;
      gsap.killTweensOf([p, s]);
      gsap.to(p, { yPercent: 0, rotation: 0, stagger: STAGGER, duration: DURATION, ease: "power2.out" });
      gsap.to(s, { yPercent: 100, rotation: 8, stagger: STAGGER, duration: DURATION, ease: "power2.out" });
    };

    // pointerover/out bubble; only react when crossing the button's own edge
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const btn = (e.target as Element).closest?.(".btn");
      if (btn && !btn.contains(e.relatedTarget as Node)) enter(btn);
    };
    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const btn = (e.target as Element).closest?.(".btn");
      if (btn && !btn.contains(e.relatedTarget as Node)) leave(btn);
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return null;
}
