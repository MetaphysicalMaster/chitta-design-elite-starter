"use client";

/**
 * SmoothScroll — Lenis smooth scroll, disabled under prefers-reduced-motion.
 * Wires anchor (#hash) clicks to glide instead of jump, offset for the sticky
 * nav.
 *
 * CRITICAL integration: this page's signature experience is GSAP-ScrollTrigger
 * choreography (the night→dawn aurora scrub + the pinned hero). Lenis and
 * ScrollTrigger MUST share one clock or every trigger fires at a stale scroll
 * position. So here:
 *   1. lenis.on("scroll") → ScrollTrigger.update  (triggers track the smoothed
 *      position every Lenis frame),
 *   2. gsap.ticker drives lenis.raf (ONE rAF loop owns both libraries),
 *   3. gsap.ticker.lagSmoothing(0) so Lenis never receives doctored timestamps.
 *
 * Under prefers-reduced-motion Lenis never mounts and the page scrolls
 * natively; ScrollTrigger (where still used) tracks native scroll on its own.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Keep ScrollTrigger in lockstep with the smoothed scroll position.
    lenis.on("scroll", () => ScrollTrigger.update());

    // One clock: gsap's ticker drives Lenis (ticker time is in seconds).
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
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
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
