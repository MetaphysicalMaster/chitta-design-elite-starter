"use client";

/**
 * InkStroke — the sumi-e brush moment. A single hand-drawn calligraphy swash
 * that DRAWS ITSELF under key headlines as they enter the viewport.
 *
 * Craft notes:
 *  · The visible mark is a FILLED, tapered brush shape (thin entry, a swelling
 *    belly, a lifting flick at the exit — real brush pressure), not a flat
 *    stroked line. It is revealed by an animated thick spine stroke inside an
 *    SVG <mask> (pathLength=1 → strokeDashoffset 1→0), so the taper and dry
 *    edges appear progressively, exactly like ink being pulled across paper.
 *  · A small detached ink fleck pops in at the end of the draw — the brush
 *    lifting off the page.
 *  · ScrollTrigger drives the draw (synced to Lenis via SmoothScroll). The
 *    hero's stroke uses draw="mount" instead — it is always above the fold.
 *  · FAIL-SAFE BY DEFAULT: the SSR markup is the FULLY-DRAWN stroke; the
 *    hidden dash state is only applied by JS when motion is allowed. No-JS,
 *    reduced-motion and any GSAP failure all land on the elegant static mark.
 *  · Decorative only (aria-hidden) — meaning never depends on it.
 */

import { useId, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const TONES = {
  /** sumi ink on rice-paper sections */
  ink: "var(--ink)",
  /** brand gold for light surfaces */
  gold: "var(--color-accent)",
  /** champagne glint for the sumi-black night sections */
  champagne: "var(--color-accent-bright)",
  /** the logo's coral-blossom red */
  blush: "var(--petal-deep)",
} as const;

export function InkStroke({
  tone = "ink",
  draw = "scroll",
  delay = 0,
  className,
}: {
  tone?: keyof typeof TONES;
  /** "scroll" = draw when it enters the viewport; "mount" = above-the-fold. */
  draw?: "scroll" | "mount";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const rawId = useId();
  const maskId = `hn-ink-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const spine = svg.querySelector<SVGPathElement>("[data-spine]");
      const fleck = svg.querySelector<SVGCircleElement>("[data-fleck]");
      if (!spine) return;

      // Hide ONLY now that JS + motion are confirmed (SSR ships fully drawn).
      gsap.set(spine, { strokeDasharray: 1, strokeDashoffset: 1 });
      if (fleck) {
        gsap.set(fleck, { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" });
      }

      const tl = gsap.timeline({
        delay,
        ...(draw === "scroll"
          ? {
              scrollTrigger: {
                trigger: svg,
                start: "top 88%",
                once: true,
              },
            }
          : {}),
      });
      // the pull of the brush: a swift attack that settles as the arm slows
      tl.to(spine, {
        strokeDashoffset: 0,
        duration: 1.05,
        ease: "power2.inOut",
      });
      if (fleck) {
        // the lift-off fleck lands just before the stroke fully resolves
        tl.to(
          fleck,
          { opacity: 1, scale: 1, duration: 0.32, ease: "back.out(2.6)" },
          "-=0.16",
        );
      }
    }, svg);

    return () => ctx.revert();
  }, [draw, delay]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 260 26"
      fill="none"
      aria-hidden="true"
      className={cn("block h-auto", className)}
      style={{ color: TONES[tone] }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {/* The reveal spine — a thick stroke pulled along the brush's path. */}
          <path
            data-spine
            d="M8 15 C 48 9, 104 9.5, 148 12 S 226 13.5, 252 9.5"
            stroke="#fff"
            strokeWidth="22"
            strokeLinecap="round"
            pathLength={1}
          />
        </mask>
      </defs>
      {/* The brush body — tapered: a thin entry, a swelling belly, a rising
          flick at the exit. Filled shape, so the silhouette carries real
          brush-pressure variation that a stroked line cannot. */}
      <g mask={`url(#${maskId})`}>
        <path
          d="M8 14.6
             C 44 9.0, 92 7.6, 142 9.6
             C 184 11.2, 222 10.6, 252 8.2
             C 253.6 8.1, 254.1 9.0, 252.8 9.6
             C 226 12.6, 196 14.6, 150 14.8
             C 104 15.0, 56 14.4, 10 17.6
             C 8.2 17.7, 7.4 15.4, 8 14.6 Z"
          fill="currentColor"
        />
        {/* a faint dry-brush fiber riding above the main body */}
        <path
          d="M30 11.2 C 70 6.8, 120 6.2, 160 7.8 C 150 8.4, 90 8.6, 32 12.2 Z"
          fill="currentColor"
          opacity={0.35}
        />
      </g>
      {/* the lift-off ink fleck */}
      <circle data-fleck cx="256.4" cy="6.6" r="1.6" fill="currentColor" />
    </svg>
  );
}
