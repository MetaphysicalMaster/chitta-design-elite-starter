"use client";

/**
 * RibbonFallback — the on-brand STATIC eternity-ribbon (infinity loop) diagram.
 *
 * Shown whenever the WebGL Möbius ribbon cannot or should not run: SSR, mobile,
 * no-WebGL, save-data, and prefers-reduced-motion. It layers over the
 * `.ribbon-fallback` CSS field (midnight-plum + amethyst bloom) so the hero is
 * NEVER blank and there is zero CLS. A liquid-silver infinity (∞) loop drawn as
 * a chrome stroke with a mirror sheen travelling along its path — the same
 * endless ribbon the live WebGL turns. The sheen drift is reduced-motion gated;
 * static it still reads as a polished chrome lemniscate on the jewel night.
 *
 * Decorative: aria-hidden. The hero copy carries the accessible meaning.
 */

/* A lemniscate (figure-eight) path in a 600x600 viewBox, centered, braided so
   it reads as one continuous endless ribbon. */
const LEMNISCATE =
  "M300 300 C 180 180, 110 200, 110 300 C 110 400, 180 420, 300 300 " +
  "C 420 180, 490 200, 490 300 C 490 400, 420 420, 300 300 Z";

export function RibbonFallback() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="et-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(97% 0.01 290)" />
          <stop offset="38%" stopColor="oklch(84% 0.012 296)" />
          <stop offset="66%" stopColor="oklch(70% 0.13 300)" />
          <stop offset="100%" stopColor="oklch(96% 0.008 290)" />
        </linearGradient>
        <radialGradient id="et-bloom" cx="50%" cy="48%" r="52%">
          <stop offset="0%" stopColor="oklch(72% 0.12 300 / 0.4)" />
          <stop offset="60%" stopColor="oklch(50% 0.1 300 / 0.12)" />
          <stop offset="100%" stopColor="oklch(50% 0.1 300 / 0)" />
        </radialGradient>
        <filter id="et-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* soft amethyst bloom behind the loop */}
      <rect x="0" y="0" width="600" height="600" fill="url(#et-bloom)" />

      {/* a wide blurred under-stroke for the chrome halo */}
      <g className="ribbon-breathe" style={{ transformOrigin: "300px 300px" }}>
        <path
          d={LEMNISCATE}
          fill="none"
          stroke="oklch(72% 0.12 300 / 0.3)"
          strokeWidth="34"
          strokeLinecap="round"
          filter="url(#et-soft)"
        />
        {/* the chrome ribbon body */}
        <path
          d={LEMNISCATE}
          fill="none"
          stroke="url(#et-chrome)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* a thin bright mirror highlight rail along the inner edge */}
        <path
          d={LEMNISCATE}
          fill="none"
          stroke="oklch(99% 0.005 290 / 0.85)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* travelling sheen glint that endlessly chases the loop */}
        <path
          d={LEMNISCATE}
          fill="none"
          stroke="oklch(100% 0 0 / 0.95)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="60 1540"
          className="ribbon-sheen"
        />
      </g>
    </svg>
  );
}
