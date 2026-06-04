"use client";

/**
 * CloudDivider — soft cloud-form SVG section dividers + atmospheric sky-gradient
 * transitions, amplifying the brand's "blue sky" feeling top-to-bottom (not just
 * the hero). Tasteful and premium — layered low-opacity wisps that drift gently
 * (motion-safe), never literal/cheesy. Purely decorative (aria-hidden).
 *
 * Variants:
 *  - "top"    : clouds billow down from the top edge into the section below.
 *  - "bottom" : clouds rise from the section into the next.
 * `fill` is the color the clouds should read as (usually the *adjacent* section
 * surface), so the divider visually melts one band into the next.
 */

import { cn } from "@/lib/utils";

type CloudDividerProps = {
  variant?: "top" | "bottom";
  /** primary cloud fill — typically the neighbouring section's background */
  fill?: string;
  /** subtle secondary tint for depth */
  tint?: string;
  className?: string;
  /** height utility override */
  heightClass?: string;
};

export function CloudDivider({
  variant = "bottom",
  fill = "var(--color-bg)",
  tint = "var(--color-accent-subtle)",
  className,
  heightClass = "h-16 sm:h-24",
}: CloudDividerProps) {
  const flip = variant === "top";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 w-full overflow-hidden",
        flip ? "top-0" : "bottom-0",
        heightClass,
        className,
      )}
    >
      <svg
        className={cn("h-full w-[160%] -translate-x-[15%]", flip && "rotate-180")}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* far depth wisp (tinted, drifts slow + reverse) */}
        <g className="bs-cloud-drift--slow" style={{ opacity: 0.55 }}>
          <path
            d="M0 86c120-28 210 14 330 12s170-40 300-34 210 46 350 40 210-44 330-30c80 9 130 24 180 30v76H0z"
            fill={tint}
          />
        </g>
        {/* main cloud line in the neighbouring surface color */}
        <g className="bs-cloud-drift">
          <path
            d="M0 70c90 16 150-18 250-20s160 30 280 28 180-34 300-30 200 36 330 30 200-30 280-18v90H0z"
            fill={fill}
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * SkyTransition — a tall, soft atmospheric gradient strip placed between two
 * sections to make the page feel like one continuous descending sky. Has no
 * hard edges; the brand's dawn→day drift is carried by `--sky-*` stops.
 */
export function SkyTransition({
  className,
  from = "var(--color-bg)",
  to = "var(--color-bg-subtle)",
  glow = "var(--color-accent-subtle)",
}: {
  className?: string;
  from?: string;
  to?: string;
  glow?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative h-24 w-full sm:h-32", className)}
      style={{ background: `linear-gradient(180deg, ${from}, ${to})` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(70% 120% at 50% -20%, ${glow}, transparent 60%)`,
        }}
      />
    </div>
  );
}
