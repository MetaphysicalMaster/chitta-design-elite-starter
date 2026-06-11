"use client";

/**
 * SmoothScroll — Lenis smooth scroll, disabled under prefers-reduced-motion.
 * Wires anchor (#hash) clicks to glide instead of jump, offset for the sticky
 * nav.
 *
 * GSAP INTEGRATION (the critical sync): every ScrollTrigger on this page (the
 * sumi-e ink strokes, the awards gold-leaf glint) must observe LENIS's scroll,
 * not a stale native value — so Lenis is driven FROM gsap's ticker (one shared
 * rAF for the whole motion system) and every Lenis scroll event calls
 * ScrollTrigger.update(). Skipping either half makes every trigger fire at the
 * wrong position under smooth scroll.
 *
 * It also feeds the WIND BUS: Lenis's signed scroll velocity is published to
 * `windBus.velocity` each scroll event, which the WebGL petal field turns into
 * a gust — the page's signature "wind through the blossoms" response.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { windBus } from "./wind";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Lenis → ScrollTrigger: keep every trigger honest under smooth scroll,
    // and publish the scroll velocity as the petal field's wind source.
    const onScroll = () => {
      ScrollTrigger.update();
      windBus.velocity = lenis.velocity;
    };
    lenis.on("scroll", onScroll);

    // gsap.ticker → Lenis: ONE shared rAF drives both Lenis and every GSAP
    // tween (ticker time is seconds; Lenis wants ms). lagSmoothing(0) per the
    // Lenis guidance so a long frame never desyncs scroll from triggers.
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
      gsap.ticker.remove(tick);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      windBus.velocity = 0;
      windBus.gust = 0;
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
