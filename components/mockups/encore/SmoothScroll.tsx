"use client";

/**
 * SmoothScroll — Lenis smooth scroll, disabled under prefers-reduced-motion.
 * Wires anchor (#hash) clicks to glide instead of jump (offset for the sticky
 * nav), and publishes scroll velocity to the shared windBus so the signature
 * tree's leaves drift on the reader's own motion.
 *
 * CRITICAL integration: the page's signature experience is GSAP-ScrollTrigger
 * choreography (the self-drawing / leafing tree scrub). Lenis + ScrollTrigger
 * MUST share one clock or every trigger fires at a stale scroll position:
 *   1. lenis.on("scroll") → ScrollTrigger.update (+ publish velocity to windBus),
 *   2. gsap.ticker drives lenis.raf (ONE rAF loop owns both libraries),
 *   3. gsap.ticker.lagSmoothing(0) so Lenis never gets doctored timestamps.
 *
 * Under prefers-reduced-motion Lenis never mounts and the page scrolls
 * natively; ScrollTrigger still tracks native scroll on its own.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { windBus } from "./wind";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    // Skip Lenis on touch / small screens: native touch scroll is already
    // smooth, and Lenis only adds jank + an always-on rAF loop on phones.
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 1024
    )
      return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Keep ScrollTrigger in lockstep with the smoothed scroll position, and
    // publish the signed velocity for the tree's leaf-breeze.
    lenis.on("scroll", (e: { velocity: number }) => {
      ScrollTrigger.update();
      windBus.velocity = e.velocity;
    });

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
