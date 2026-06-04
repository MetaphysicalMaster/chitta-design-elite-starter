"use client";

/**
 * LightShaftDivider + RenewalSeam — Encore's "Renewal Light" atmosphere motif,
 * the dark-theme analog to Blue Sky's cloud motif. Instead of soft clouds, the
 * page is stitched together with tasteful champagne-on-aqua light shafts and
 * refined gradient seams that melt one dark band into the next. Restrained and
 * premium — never cheesy. Purely decorative (aria-hidden) and reduced-motion
 * safe (the drift freezes via the `.en-lightshaft` CSS guard).
 */

import { cn } from "@/lib/utils";

/**
 * RenewalSeam — a tall, soft atmospheric strip placed between two sections so
 * the page reads as one continuous, light-raked descent. A faint warm champagne
 * god-ray glow falls from above and a cool clinical underglow rises from below,
 * with no hard edges. Carries the hero's "renewal light" down the page.
 */
export function RenewalSeam({
  className,
  from = "var(--color-bg)",
  to = "var(--color-bg)",
  /** warm champagne glow from above */
  glow = "oklch(93% 0.058 90 / 0.14)",
  /** cool clinical underglow from below */
  underglow = "oklch(72% 0.09 210 / 0.08)",
  heightClass = "h-24 sm:h-32",
}: {
  className?: string;
  from?: string;
  to?: string;
  glow?: string;
  underglow?: string;
  heightClass?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative w-full overflow-hidden", heightClass, className)}
      style={{ background: `linear-gradient(180deg, ${from}, ${to})` }}
    >
      {/* warm champagne god-ray falling from above */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(58% 130% at 50% -30%, ${glow}, transparent 62%)`,
        }}
      />
      {/* cool clinical light rising from below — the renewal counterpart */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(54% 120% at 50% 130%, ${underglow}, transparent 60%)`,
        }}
      />
      {/* a single fine gold hairline at the optical center for refined craft */}
      <div className="absolute inset-x-0 top-1/2 hairline" />
    </div>
  );
}

/**
 * LightShaftDivider — an absolutely-positioned overlay of raked god-rays that
 * can be dropped at the top or bottom edge of a dark section to suggest the
 * "renewal light" breaking into the band. Use sparingly as a section accent;
 * the slow breathing drift lives in `.en-lightshaft` (reduced-motion safe).
 */
export function LightShaftDivider({
  variant = "top",
  className,
  heightClass = "h-40 sm:h-56",
}: {
  variant?: "top" | "bottom";
  className?: string;
  heightClass?: string;
}) {
  const flip = variant === "bottom";
  return (
    <div
      aria-hidden
      className={cn(
        "en-lightshaft pointer-events-none absolute inset-x-0 z-0 w-full",
        flip ? "bottom-0 rotate-180" : "top-0",
        heightClass,
        className,
      )}
    />
  );
}
