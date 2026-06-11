"use client";

/**
 * PourGlass — the hero's GSAP "pour" intro (signature moment #2).
 *
 * The brand's whole identity is the martini-glass-with-a-syringe pun, so the
 * hero stages it BIG: a thin-line glass drawn in pearl strokes over the black
 * bar, into which a hot-pink liquid line POURS (the surface line widens as it
 * rises — real pour physics, done with a fixed bowl clip + a rising group), the
 * syringe draws in, gives the pour ONE stir, and the olive pops on with a
 * back-ease. Afterwards the glass keeps a lazy 6s float and a few in-liquid
 * fizz motes loop — and the whole thing parallaxes gently against the scroll
 * via ScrollTrigger (synced to Lenis in SmoothScroll).
 *
 * Craft notes:
 * - Stroke draw-in uses the pathLength="1" normalization trick (no Club
 *   plugins, no getTotalLength measurement).
 * - The element is decorative: aria-hidden, pointer-events-none, hidden below
 *   lg so it never crowds the copy or blocks the bubble-pop interaction.
 * - Reduced motion: the SVG's resting markup IS the final poured state; the
 *   CSS that pre-hides it for the intro only applies under
 *   (prefers-reduced-motion: no-preference), so reduced-motion users get an
 *   elegant static glass with zero JS dependency.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Stroke + liquid tones — pearl line-work, hot-pink pour (mirrors brand.css). */
const STROKE = "#fdf2f8";
const PEARL = "#fff1f6";

export function PourGlass({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const stir = { svgOrigin: "92 128" };

        const tl = gsap.timeline({ delay: 0.55 });
        // reveal the (CSS-prehidden) stage, then draw the glass
        tl.set(root, { autoAlpha: 1 })
          .fromTo(
            ".bx-pour-glass",
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 0.85,
              ease: "power2.inOut",
              stagger: 0.09,
            },
          )
          // THE POUR — liquid group rises behind the fixed bowl clip, so the
          // surface line widens as the level climbs.
          .fromTo(
            ".bx-pour-liquid",
            { y: 74 },
            { y: 0, duration: 1.25, ease: "power2.inOut" },
            "-=0.3",
          )
          // syringe draws in while the pour finishes
          .fromTo(
            ".bx-pour-syr",
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.06,
            },
            "-=0.6",
          )
          // the olive pops on
          .fromTo(
            ".bx-pour-olive",
            { scale: 0, transformOrigin: "50% 50%" },
            { scale: 1, duration: 0.5, ease: "back.out(2.6)" },
            "-=0.15",
          )
          // ...and the syringe gives the pour ONE stir
          .to(".bx-pour-stir", { rotation: -7, duration: 0.32, ease: "sine.inOut", ...stir })
          .to(".bx-pour-stir", { rotation: 5, duration: 0.38, ease: "sine.inOut", ...stir })
          .to(".bx-pour-stir", { rotation: 0, duration: 0.5, ease: "sine.out", ...stir });

        // ambient in-liquid fizz — three motes on independent rise loops
        gsap.utils
          .toArray<SVGCircleElement>(".bx-pour-fizz", root)
          .forEach((c, i) => {
            const y0 = Number(c.getAttribute("cy"));
            const loop = gsap.timeline({
              repeat: -1,
              repeatDelay: 0.5 + i * 0.4,
              delay: tl.duration() + i * 0.8,
            });
            loop
              .fromTo(c, { attr: { cy: y0 }, opacity: 0 }, { opacity: 0.85, duration: 0.4, ease: "sine.out" }, 0)
              .to(c, { attr: { cy: y0 - 30 }, duration: 1.7, ease: "sine.in" }, 0)
              .to(c, { opacity: 0, duration: 0.45, ease: "sine.in" }, 1.25);
          });

        // lazy float (inner svg) + scroll parallax (wrapper) — separate layers
        // so the two transforms never fight.
        gsap.to("[data-pour-float]", {
          y: 12,
          duration: 5.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to("[data-pour-parallax]", {
          yPercent: -16,
          ease: "none",
          scrollTrigger: {
            trigger: root.closest("section") ?? root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("bx-pour pointer-events-none select-none", className)}
    >
      <div data-pour-parallax>
        <svg
          data-pour-float
          viewBox="0 0 220 300"
          fill="none"
          className="h-auto w-full"
          style={{
            filter:
              "drop-shadow(0 0 26px oklch(70% 0.17 356 / 0.3)) drop-shadow(0 2px 10px oklch(12% 0.01 350 / 0.5))",
          }}
        >
          <defs>
            <linearGradient id="bx-pour-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f06ba8" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#e0568f" stopOpacity="0.8" />
            </linearGradient>
            {/* fixed bowl clip — the liquid group rises behind it */}
            <clipPath id="bx-pour-bowl">
              <polygon points="42,75 178,75 110,148" />
            </clipPath>
          </defs>

          {/* THE LIQUID — group translates up; clip stays put, so the surface
              line widens as the level rises (drawn under the glass strokes). */}
          <g clipPath="url(#bx-pour-bowl)">
            <g className="bx-pour-liquid">
              <rect x="36" y="88" width="148" height="72" fill="url(#bx-pour-grad)" />
              {/* the pour's surface line — a pearl glint on top of the pink */}
              <rect x="36" y="87.2" width="148" height="2" fill={PEARL} opacity="0.75" />
              {/* in-liquid fizz motes (looped post-pour) */}
              <circle className="bx-pour-fizz" cx="96" cy="138" r="2.6" fill={PEARL} opacity="0" />
              <circle className="bx-pour-fizz" cx="113" cy="142" r="3.4" fill={PEARL} opacity="0" />
              <circle className="bx-pour-fizz" cx="126" cy="136" r="2" fill={PEARL} opacity="0" />
            </g>
          </g>

          {/* THE GLASS — thin pearl line-work, drawn in via pathLength trick */}
          <g
            stroke={STROKE}
            strokeOpacity="0.9"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="bx-pour-glass" pathLength={1} strokeDasharray="1" d="M35 70 H185" />
            <path className="bx-pour-glass" pathLength={1} strokeDasharray="1" d="M35 70 L110 150" />
            <path className="bx-pour-glass" pathLength={1} strokeDasharray="1" d="M185 70 L110 150" />
            <path className="bx-pour-glass" pathLength={1} strokeDasharray="1" d="M110 150 V232" />
            <path className="bx-pour-glass" pathLength={1} strokeDasharray="1" d="M72 240 H148" />
          </g>

          {/* THE SYRINGE — dipped into the pour; .bx-pour-stir is the rotation
              group (pivot at the in-glass tip), strokes draw via the same trick */}
          <g className="bx-pour-stir">
            <g
              stroke={STROKE}
              strokeOpacity="0.95"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* barrel */}
              <path className="bx-pour-syr" pathLength={1} strokeDasharray="1" strokeWidth="5" d="M92 128 L138 82" />
              {/* finger flange */}
              <path className="bx-pour-syr" pathLength={1} strokeDasharray="1" strokeWidth="2.6" d="M84 120 L100 136" />
              {/* plunger rod */}
              <path className="bx-pour-syr" pathLength={1} strokeDasharray="1" strokeWidth="3.4" d="M138 82 L156 64" />
              {/* graduation ticks */}
              <path className="bx-pour-syr" pathLength={1} strokeDasharray="1" strokeWidth="2" d="M112 106 L118 112" />
              <path className="bx-pour-syr" pathLength={1} strokeDasharray="1" strokeWidth="2" d="M104 114 L110 120" />
            </g>
            {/* the olive — the garnish/shot, pops on with a back-ease */}
            <circle className="bx-pour-olive" cx="163" cy="57" r="8" fill="#f0c987" />
            <circle className="bx-pour-olive" cx="160.5" cy="54.5" r="2.4" fill={PEARL} opacity="0.85" />
          </g>
        </svg>
      </div>
    </div>
  );
}
