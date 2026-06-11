"use client";

/**
 * SmoothScroll — Lenis smooth scroll + the GSAP ScrollTrigger sync spine.
 *
 * Lenis owns scrolling (disabled under prefers-reduced-motion); GSAP's ticker
 * drives `lenis.raf` and every Lenis scroll event re-syncs ScrollTrigger, so
 * every trigger on the page (hero bokeh depth-rack, the pinned "your visit"
 * journey, the booking-warmth scrub) fires at the TRUE smoothed scroll
 * position — never the raw wheel position. Without this wiring every
 * ScrollTrigger on a Lenis page measures wrong; it lives here, once.
 *
 * Anchor (#hash) clicks glide instead of jump, offset for the sticky nav.
 * Under reduced motion: native scroll, and ScrollTrigger still measures
 * correctly against it (all consumers degrade to static states themselves).
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // THE Lenis↔GSAP handshake: ScrollTrigger re-measures on every smoothed
    // scroll frame, and GSAP's ticker is the single rAF driving Lenis (no
    // second rAF loop, no lag-smoothing fighting the scrub).
    lenis.on("scroll", () => ScrollTrigger.update());
    const drive = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(drive);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -88 });
    };
    document.addEventListener("click", onClick);

    return () => {
      gsap.ticker.remove(drive);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
