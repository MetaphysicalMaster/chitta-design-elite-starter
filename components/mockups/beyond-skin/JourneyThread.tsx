"use client";

/**
 * JourneyThread — the SIGNATURE motion of the site. A single luminous mauve
 * thread traces the "Journey to Wellness" down the page spine as you scroll:
 * the line draws itself (stroke-dashoffset) in lock-step with overall page
 * progress, and a glowing light "bead" rides the head of the thread — a guided
 * path from concern → revealed best self.
 *
 * Implementation: a FIXED, full-viewport SVG overlay (pointer-events: none) with
 * a gently winding vertical path. GSAP ScrollTrigger (synced to Lenis in
 * SmoothScroll) scrubs the dashoffset against the whole document height, and
 * moves the bead along the path with getPointAtLength. Pure transform/opacity +
 * a single attribute write per frame → 60fps, zero layout.
 *
 * Reduced-motion / no-JS: the thread renders fully drawn and static (still a
 * beautiful brand spine, just not animated). Static-export safe (no network).
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* A winding vertical path through a 100×1000 viewBox (preserveAspectRatio none
   stretches it to the viewport). It drifts left↔right like a silk ribbon — the
   "journey" weaving past each section. */
const PATH_D =
  "M50 -20 C 22 80, 78 170, 50 260 S 14 430, 50 540 S 86 700, 50 820 S 20 960, 52 1080";

export function JourneyThread() {
  const prefersReduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const bead = beadRef.current;
    const wrap = wrapRef.current;
    if (!path) return;

    /* Fade the thread overlay out as the page reaches the footer so the
       luminous thread + bead never sweep across the MetaMarketer attribution
       row at the very bottom (QA: ribbon over the wordmark). 1 above the
       footer zone → 0 by the end of the page. Pure opacity write, 60fps. */
    const footerFade = (p: number) =>
      wrap ? (wrap.style.opacity = `${Math.min(1, Math.max(0, (0.92 - p) / 0.07))}`) : undefined;

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;

    if (prefersReduced) {
      // Fully drawn, bead parked at the end. Keep the thread clear of the
      // footer attribution by fading the overlay out over the footer band.
      path.style.strokeDashoffset = "0";
      if (bead) {
        const p = path.getPointAtLength(len);
        bead.setAttribute("cx", `${p.x}`);
        bead.setAttribute("cy", `${p.y}`);
        bead.style.opacity = "0";
      }
      let rafR = 0;
      const applyR = () => {
        rafR = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        footerFade(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      };
      const onScrollR = () => {
        if (!rafR) rafR = requestAnimationFrame(applyR);
      };
      window.addEventListener("scroll", onScrollR, { passive: true });
      window.addEventListener("resize", onScrollR, { passive: true });
      applyR();
      return () => {
        if (rafR) cancelAnimationFrame(rafR);
        window.removeEventListener("scroll", onScrollR);
        window.removeEventListener("resize", onScrollR);
      };
    }

    // Start hidden (dashoffset = full length), then draw to 0 across the page.
    // Driven directly off native scroll progress (Lenis updates window.scrollY),
    // so it stays in lock-step with the smooth scroll without ScrollTrigger
    // refresh-timing fragility. A single rAF coalesces scroll bursts.
    path.style.strokeDashoffset = `${len}`;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      if (bead) {
        const pt = path.getPointAtLength(len * p);
        bead.setAttribute("cx", `${pt.x}`);
        bead.setAttribute("cy", `${pt.y}`);
        bead.style.opacity = p > 0.002 && p < 0.998 ? "1" : "0";
      }
      footerFade(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    apply();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [prefersReduced]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      style={{ willChange: "opacity" }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="bs-thread-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--glow-rose)" stopOpacity="0.0" />
            <stop offset="12%" stopColor="var(--glow-rose)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--glow-mauve)" />
            <stop offset="88%" stopColor="var(--thread)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--thread)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* The thread itself — drawn via stroke-dashoffset as you scroll. */}
        <path ref={pathRef} className="bs-thread-path" d={PATH_D} />
        {/* The traveling light bead riding the head of the thread. */}
        <circle ref={beadRef} className="bs-thread-bead" r="3.2" cx="50" cy="0" />
      </svg>
    </div>
  );
}
