"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the
 * scroll position never disagree. Skipped entirely under reduced motion.
 */
export function SmoothScroll() {
  // Re-measure every trigger when the page height changes after load —
  // web fonts swapping in, marquees measuring, etc. Ignores the height
  // changes ScrollTrigger itself makes while refreshing (pin spacers).
  useEffect(() => {
    let last = document.documentElement.scrollHeight;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      last = document.documentElement.scrollHeight;
    };
    ScrollTrigger.addEventListener("refresh", settle);
    const ro = new ResizeObserver(() => {
      if (Math.abs(document.documentElement.scrollHeight - last) < 2) return;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);

    // ── Scroll restoration ──────────────────────────────────────────────
    // The browser's own restore runs before pins exist (page ~5000px shorter),
    // so a reload mid-page used to land sections too far down. Restoration is
    // manual (see layout.tsx): once fonts are in and every trigger has been
    // measured, jump to the saved spot — or to the #hash target — then reveal.
    const html = document.documentElement;
    let alive = true;
    const restore = () => {
      if (!alive) return;
      ScrollTrigger.refresh();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!alive) return;
          let y: number | null = null;
          const hash = decodeURIComponent(location.hash.slice(1));
          const target = hash ? document.getElementById(hash) : null;
          if (target) {
            y = target.getBoundingClientRect().top + window.scrollY - 64;
          } else if (html.classList.contains("restoring")) {
            try {
              y = Number(sessionStorage.getItem("steps:y")) || 0;
            } catch {}
          }
          if (y !== null) {
            const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
            if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
            else window.scrollTo(0, y);
            ScrollTrigger.update();
          }
          html.classList.remove("restoring");
        }),
      );
    };
    const fallback = setTimeout(restore, 1500);
    document.fonts?.ready.then(() => {
      clearTimeout(fallback);
      restore();
    });

    return () => {
      alive = false;
      clearTimeout(fallback);
      ro.disconnect();
      clearTimeout(timer);
      ScrollTrigger.removeEventListener("refresh", settle);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      anchors: { offset: -64 },
    });
    lenis.on("scroll", ScrollTrigger.update);
    // Exposed so the intro can pause scrolling while the curtain is down
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    if (document.documentElement.classList.contains("intro-lock")) lenis.stop();
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
