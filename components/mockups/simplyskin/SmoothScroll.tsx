"use client";

/**
 * SmoothScroll — Lenis smooth scroll, disabled under prefers-reduced-motion,
 * now in LOCKSTEP with GSAP ScrollTrigger (the EDITORIAL LIGHT-ON-SKIN layer
 * in experience.tsx depends on this):
 *
 *   · gsap.ticker drives lenis.raf (one rAF loop for the whole page),
 *   · lenis.on('scroll', ScrollTrigger.update) keeps every trigger sampled
 *     at the smoothed scroll position — without this, every ScrollTrigger
 *     fires at the wrong moment,
 *   · lagSmoothing(0) so Lenis never fights GSAP's catch-up behaviour,
 *   · ScrollTrigger.refresh() once webfonts settle (Libre Baskerville swap
 *     reflows headline heights → trigger positions drift otherwise).
 *
 * Anchor (#hash) clicks glide instead of jump, offset for the sticky nav.
 * Under reduced motion: native scroll, no Lenis — the GSAP effects are
 * independently gated and render static.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

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

    // CRITICAL sync: ScrollTrigger samples Lenis' smoothed position, and
    // GSAP's ticker is the single rAF driving Lenis.
    lenis.on("scroll", ScrollTrigger.update);
    const drive = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(drive);
    gsap.ticker.lagSmoothing(0);

    // Libre Baskerville swaps in late → headline metrics change → re-measure
    // every trigger once fonts are ready (zero-cost if already loaded).
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

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
      cancelled = true;
      gsap.ticker.remove(drive);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
