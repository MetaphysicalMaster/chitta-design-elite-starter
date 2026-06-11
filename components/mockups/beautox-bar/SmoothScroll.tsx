"use client";

/**
 * SmoothScroll — Lenis smooth scroll, disabled under prefers-reduced-motion.
 * Wires anchor (#hash) clicks to glide instead of jump, offset for the sticky
 * nav. Slightly springier easing than the couture siblings to read playful.
 *
 * CRITICAL integration (the Lenis gotcha): every GSAP ScrollTrigger on the page
 * relies on this file. Lenis is driven from gsap.ticker (single rAF owner) and
 * ScrollTrigger.update is pumped on every Lenis scroll event, so triggers fire
 * at the smoothed position, not the raw one. lagSmoothing(0) keeps the two
 * clocks honest. The live Lenis velocity is also published to fizz-bus each
 * tick — that's what makes the hero champagne fizz surge when you scroll.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fizzBus } from "./fizz-bus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Lenis ↔ ScrollTrigger handshake: triggers re-measure on the SMOOTHED
    // scroll, and GSAP's ticker is the one true rAF driving Lenis.
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
      // Publish velocity for the champagne-fizz physics (decays to 0 at rest).
      fizzBus.velocity = lenis.velocity;
    };
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
      gsap.ticker.remove(tick);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      fizzBus.velocity = 0;
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
