"use client";

/**
 * SmoothScroll — Lenis smooth scroll, disabled under prefers-reduced-motion and
 * on touch / small screens (native touch scroll is already smooth there, and
 * Lenis only adds jank + an always-on rAF on phones). Lenis updates native
 * window scroll, which the hero's scroll-progress rAF loop reads to ease the
 * aurora-veil signature. Anchor (#hash) clicks glide instead of jump, offset for
 * the sticky glass nav.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    // Skip Lenis on touch / small screens: native touch scroll is already
    // smooth, and Lenis adds jank + an always-on rAF on phones.
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 1024
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

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
      lenis.scrollTo(el as HTMLElement, { offset: -72 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
