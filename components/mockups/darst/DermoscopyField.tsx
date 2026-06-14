"use client";

/**
 * DermoscopyField — the NEW hero background ("The Read").
 *
 * Replaces the old dot/particle "dermal lattice" WebGL scene entirely. The
 * brief: restraint over busy particles; signal PRECISION + dermatopathology +
 * warm clinical authority on a LIGHT warm gradient. A physician reading a slide.
 *
 * Composition (all pure CSS + SVG, static-export-safe, no WebGL):
 *   · a soft warm SKIN-STRATA gradient field (cream → sepia → warm taupe) — the
 *     light "tissue" the eye rests on;
 *   · layered translucent HISTOLOGY-STRATA bands with hairline dividers — the
 *     sectioned slide under the lens;
 *   · a single precise teal DEPTH-LINE threading the strata (the brand's lone
 *     teal vessel, restated as one crisp diagnostic rule);
 *   · a slow, elegant teal DERMOSCOPY focus-pull: one circular lens that drifts,
 *     with a fine scan-line traversing it — calm, premium, editorial. Inside the
 *     lens the field is brought into crisp focus (a faint magnified grid + a
 *     sharpened teal reticle); outside it stays softly out of focus.
 *
 * Motion is GSAP-driven on transform/opacity ONLY (60fps), paused via the
 * `paused` prop (the hero's IntersectionObserver / tab-visibility gate). Under
 * reduced motion nothing animates — a single composed frame with the lens at
 * rest. Decorative: aria-hidden; the hero copy carries all accessible meaning.
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";

export function DermoscopyField({ paused = false }: { paused?: boolean }) {
  const prefersReduced = useReducedMotion();
  const lensRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Slow, looping focus-pull. The lens drifts on a gentle Lissajous path; a
  // hairline scan-line sweeps across it; the halo breathes. transform/opacity
  // only — composited, 60fps. Built once; play state follows `paused`.
  useEffect(() => {
    if (prefersReduced) return;
    const lens = lensRef.current;
    const scan = scanRef.current;
    if (!lens) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });

      // The lens drifts slowly across the strata — a physician moving the
      // dermatoscope over the slide. A long, eased back-and-forth (yoyo) so it
      // never reads as a mechanical loop.
      tl.to(
        lens,
        {
          xPercent: 26,
          yPercent: 14,
          duration: 11,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        },
        0,
      );

      // The fine teal scan-line sweeps top→bottom inside the lens — the
      // "focus-pull" read across the tissue depth. A short fade-in at the top
      // and fade-out at the bottom of each pass so it never hard-pops at the
      // disc edge; repeats across the lens drift.
      if (scan) {
        tl.set(scan, { yPercent: -120, opacity: 0 }, 0);
        const pass = gsap.timeline({ repeat: 3 });
        pass
          .to(scan, { opacity: 1, duration: 0.8, ease: "sine.out" }, 0)
          .to(scan, { yPercent: 120, duration: 5.5, ease: "sine.inOut" }, 0)
          .to(scan, { opacity: 0, duration: 0.8, ease: "sine.in" }, 4.7)
          .set(scan, { yPercent: -120 });
        tl.add(pass, 0);
      }

      // The halo gently breathes (subtle scale on the focus ring).
      if (haloRef.current) {
        gsap.to(haloRef.current, {
          attr: { r: 1.04 },
          transformOrigin: "center",
          scale: 1.04,
          duration: 4.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      tlRef.current = tl;
    });

    return () => ctx.revert();
  }, [prefersReduced]);

  // Pause/resume with the hero's visibility gate (off-screen / hidden tab).
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (paused) tl.pause();
    else tl.play();
  }, [paused]);

  return (
    <div className="dermo-field absolute inset-0" aria-hidden="true">
      {/* Layer A — the warm skin-strata gradient field + histology bands. A
          full-bleed SVG so the strata + the lone teal depth-line scale cleanly
          and stay crisp at any size. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Warm light tissue field — cream surface easing into warm sepia
              taupe. Light enough that DARK-INK hero copy reads AA over it. */}
          <linearGradient id="dermo-field" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="oklch(98.6% 0.006 76)" />
            <stop offset="34%" stopColor="oklch(96% 0.012 72)" />
            <stop offset="66%" stopColor="oklch(91% 0.024 64)" />
            <stop offset="100%" stopColor="oklch(85% 0.04 58)" />
          </linearGradient>

          {/* A soft warm bloom anchoring the upper-left copy column so the
              headline always sits over the lightest part of the field. */}
          <radialGradient id="dermo-copy-wash" cx="22%" cy="34%" r="62%">
            <stop offset="0%" stopColor="oklch(99.5% 0.004 78 / 0.9)" />
            <stop offset="100%" stopColor="oklch(99.5% 0.004 78 / 0)" />
          </radialGradient>

          {/* The teal depth-line gradient — a crisp diagnostic rule that fades
              at both ends so it reads as a traced vessel, not a hard line. */}
          <linearGradient id="dermo-vessel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(58% 0.108 196 / 0)" />
            <stop offset="22%" stopColor="oklch(54% 0.105 197 / 0.85)" />
            <stop offset="78%" stopColor="oklch(54% 0.105 197 / 0.85)" />
            <stop offset="100%" stopColor="oklch(58% 0.108 196 / 0)" />
          </linearGradient>

          {/* Fine histology grain — a low-contrast tiled noise giving the field
              the texture of a sectioned slide rather than a flat gradient. */}
          <filter id="dermo-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* base tissue field */}
        <rect x="0" y="0" width="1600" height="900" fill="url(#dermo-field)" />

        {/* layered translucent histology-strata bands — three broad sweeps of
            warm sepia at increasing depth, each capped by a hairline divider.
            Quiet: this is the slide, not the subject. */}
        <g>
          <rect
            x="0"
            y="300"
            width="1600"
            height="220"
            fill="oklch(72% 0.05 60 / 0.1)"
          />
          <rect
            x="0"
            y="520"
            width="1600"
            height="220"
            fill="oklch(60% 0.055 60 / 0.14)"
          />
          <rect
            x="0"
            y="740"
            width="1600"
            height="160"
            fill="oklch(48% 0.05 58 / 0.16)"
          />
          {[300, 520, 740].map((y) => (
            <line
              key={y}
              x1="0"
              x2="1600"
              y1={y}
              y2={y}
              stroke="oklch(40% 0.045 58 / 0.16)"
              strokeWidth="1"
              strokeDasharray="2 9"
            />
          ))}
        </g>

        {/* the lone TEAL depth-line — one crisp diagnostic rule threading the
            strata (the brand's single teal vessel, restated with restraint). */}
        <path
          d="M -20 470 C 360 430, 560 520, 900 486 S 1380 452, 1640 500"
          fill="none"
          stroke="url(#dermo-vessel)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* a fainter parallel rule a hair below — the second vessel wall */}
        <path
          d="M -20 492 C 380 456, 600 544, 940 510 S 1400 480, 1640 524"
          fill="none"
          stroke="oklch(54% 0.09 197 / 0.28)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* warm copy-column wash so the headline always reads on the lightest
            zone (upper-left), independent of the lens position. */}
        <rect x="0" y="0" width="1600" height="900" fill="url(#dermo-copy-wash)" />

        {/* fine slide grain */}
        <rect
          x="0"
          y="0"
          width="1600"
          height="900"
          filter="url(#dermo-grain)"
          opacity="0.05"
        />
      </svg>

      {/* Layer B — the DERMOSCOPY LENS. A circular focus instrument that drifts
          slowly over the field. Inside: the tissue snaps to crisp focus (a
          magnified fine grid + a sharpened teal reticle + a sweeping scan-line);
          the soft warm glass edge + teal ring read as the dermatoscope barrel.
          Positioned right-of-centre where the eye lands after the copy. */}
      <div
        ref={lensRef}
        className="dermo-lens absolute right-[8%] top-[26%] h-[clamp(15rem,30vw,28rem)] w-[clamp(15rem,30vw,28rem)] will-change-transform"
      >
        {/* the in-focus magnified field (clipped to the disc) */}
        <div className="dermo-lens__glass absolute inset-0 overflow-hidden rounded-full">
          {/* magnified fine grid — the sharpened tissue under the lens */}
          <div className="dermo-lens__grid absolute inset-[-20%]" />
          {/* the sweeping scan-line (focus-pull) */}
          <div
            ref={scanRef}
            className="dermo-lens__scan absolute inset-x-0 top-1/2 h-[2px] will-change-transform"
          />
        </div>

        {/* the instrument ring + reticle (crisp teal hairlines) */}
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
        >
          {/* breathing focus halo */}
          <circle
            ref={haloRef}
            cx="50"
            cy="50"
            r="49"
            fill="none"
            stroke="oklch(58% 0.108 196 / 0.22)"
            strokeWidth="0.6"
            style={{ transformOrigin: "center" }}
          />
          {/* the precise instrument ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="oklch(50% 0.105 197 / 0.8)"
            strokeWidth="0.7"
          />
          {/* fine tick collar — the barrel's measure scale */}
          {Array.from({ length: 48 }).map((_, i) => {
            const a = (i / 48) * Math.PI * 2;
            const r0 = 46;
            const r1 = i % 4 === 0 ? 42.5 : 44.3;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * r0}
                y1={50 + Math.sin(a) * r0}
                x2={50 + Math.cos(a) * r1}
                y2={50 + Math.sin(a) * r1}
                stroke="oklch(50% 0.1 197 / 0.45)"
                strokeWidth="0.4"
              />
            );
          })}
          {/* centre reticle crosshair — the read point */}
          <line
            x1="50"
            y1="40"
            x2="50"
            y2="60"
            stroke="oklch(50% 0.105 197 / 0.7)"
            strokeWidth="0.5"
          />
          <line
            x1="40"
            y1="50"
            x2="60"
            y2="50"
            stroke="oklch(50% 0.105 197 / 0.7)"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="3.2"
            fill="none"
            stroke="oklch(50% 0.105 197 / 0.85)"
            strokeWidth="0.5"
          />
        </svg>
      </div>
    </div>
  );
}
