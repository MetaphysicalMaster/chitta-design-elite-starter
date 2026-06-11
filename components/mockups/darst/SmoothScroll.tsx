"use client";

/**
 * SmoothScroll — optional Lenis smooth scroll, disabled under
 * prefers-reduced-motion. Anchor (#hash) clicks glide with an offset for the
 * sticky nav.
 *
 * CRITICAL WIRING (the "descent through the dermis" choreography depends on
 * it): Lenis and GSAP ScrollTrigger must share one clock or every trigger
 * fires at the wrong scroll position. Lenis is driven from gsap.ticker (not
 * its own rAF), `lenis.on("scroll", ScrollTrigger.update)` keeps trigger
 * positions honest, and `lagSmoothing(0)` stops GSAP from re-timing frames
 * Lenis already smoothed. Under reduced motion no Lenis instance is created —
 * native scroll + ScrollTrigger's own listeners take over (and the descent
 * pin never registers anyway).
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // One clock: Lenis raf'd by gsap.ticker; ScrollTrigger updated by Lenis.
    lenis.on("scroll", ScrollTrigger.update);
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
      lenis.scrollTo(el as HTMLElement, { offset: -84 });
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
