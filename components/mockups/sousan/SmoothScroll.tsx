"use client";

/**
 * SmoothScroll — Lenis smooth scroll, disabled under prefers-reduced-motion.
 * Wires anchor (#hash) clicks to glide instead of jump, offset for the sticky
 * nav. The caustics WebGL has its own internal frameloop; Lenis simply makes the
 * page's scroll feel unhurried and considered — an editorial, never-rushed
 * cadence that suits the brand.
 *
 * CRITICAL integration (the Pink Thread depends on it): GSAP's ScrollTrigger is
 * synced to Lenis here — Lenis is driven by gsap.ticker (single rAF, correct
 * ordering) and every Lenis scroll frame calls ScrollTrigger.update, so all
 * scroll choreography fires at the TRUE smoothed scroll position. Without this,
 * every ScrollTrigger on the page would read stale positions.
 * Under prefers-reduced-motion Lenis is never created and ScrollTrigger falls
 * back to native scroll events on its own.
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
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Lenis ↔ ScrollTrigger handshake: lenis announces every smoothed scroll
    // frame; gsap.ticker is the single clock driving lenis (time in ms).
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
      lenis.scrollTo(el as HTMLElement, { offset: -88 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP default on unmount
      lenis.destroy();
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
