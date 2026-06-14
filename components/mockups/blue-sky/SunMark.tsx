"use client";

/**
 * SunMark — the Blue Sky Med Spa brand mark, recreated in SVG: a champagne SUN
 * rising over a clear-sky horizon line, with radiating rays. Echoes the live
 * site's rising-sun-over-a-hill/circle logo. Tones:
 *   - "onDark"  : white horizon + champagne sun (for ink/navy surfaces)
 *   - "onLight" : sky-accent horizon + champagne sun (for airy surfaces)
 *   - "mono"    : currentColor everywhere (inherits text color)
 */

import { cn } from "@/lib/utils";

type Tone = "onDark" | "onLight" | "mono";

export function SunMark({
  className,
  tone = "onLight",
}: {
  className?: string;
  tone?: Tone;
}) {
  const sun = tone === "mono" ? "currentColor" : "var(--gold)";
  const ray = tone === "mono" ? "currentColor" : "var(--gold)";
  const horizon =
    tone === "mono"
      ? "currentColor"
      : tone === "onDark"
        ? "white"
        : "var(--color-accent)";

  return (
    <svg viewBox="0 0 24 24" className={cn(className)} fill="none" aria-hidden>
      {/* radiating rays — the "rising" energy of the mark */}
      <g stroke={ray} strokeWidth="1.1" strokeLinecap="round" opacity="0.85">
        <path d="M12 1.6v2.1" />
        <path d="M5.6 3.7l1.3 1.6" />
        <path d="M18.4 3.7l-1.3 1.6" />
        <path d="M2.4 8.4l1.9.8" />
        <path d="M21.6 8.4l-1.9.8" />
      </g>
      {/* the sun disc */}
      <circle cx="12" cy="11" r="3.5" fill={sun} />
      <circle cx="12" cy="11" r="5.3" stroke={sun} strokeWidth="0.85" opacity="0.4" />
      {/* the clear-sky horizon (gentle rolling hill line) */}
      <path
        d="M2.6 16.8c2.5-1.6 4.4-2 6.4-2 2.1 0 4 .7 6.3 2.1 1.5-1 2.8-1.3 4.1-1.3"
        stroke={horizon}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4.6 19.8c2.1-1.1 3.8-1.5 5.5-1.5 1.9 0 3.6.6 5.4 1.7"
        stroke={horizon}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
