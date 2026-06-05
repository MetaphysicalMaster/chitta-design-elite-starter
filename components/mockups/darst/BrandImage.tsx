"use client";

/**
 * BrandImage — the single, consistent treatment for every piece of brand
 * "photography" on the page. This mockup ships NO external photo assets: each
 * slot renders an on-brand gradient PLATE (warm-paper / warm-brown / teal, plus
 * the warm radiant-skin AFTER + skin-portrait variants) via the scoped
 * `.dt-plate*` classes, so all imagery reads as one cohesive clinical shoot.
 * Every plate is explicitly marked "sample".
 *
 * Craft baked in:
 *  - CSS `aspect-ratio` per slot → zero CLS, no width/height race
 *  - consistent radius + clinical hairline border
 *  - optional bottom scrim so overlaid copy holds WCAG-AA contrast
 *  - a small "sample" tag so the prospect never mistakes it for final art
 *  - decorative plates are aria-hidden; labelled ones expose `aria-label`
 */

import { cn } from "@/lib/utils";

// (var names kept for compat; values are warm brown + teal — not literal navy.)
type Variant = "paper" | "navy" | "accent" | "warm" | "muted" | "skin";

const VARIANT: Record<Variant, string> = {
  paper: "dt-plate",
  navy: "dt-plate dt-plate--navy", // the warm-brown dark plate
  accent: "dt-plate dt-plate--accent", // the teal plate
  // warm = radiant AFTER; muted = duller BEFORE (the aesthetic transformation).
  warm: "dt-plate dt-plate--warm",
  muted: "dt-plate dt-plate--muted",
  // skin = a luminous warm-portrait evocation (the female buyer's "her glow").
  skin: "dt-plate dt-plate--skin",
};

const RADIUS = {
  lg: "rounded-2xl",
  xl: "rounded-[1.25rem]",
  "2xl": "rounded-[1.5rem]",
  "3xl": "rounded-[1.75rem]",
} as const;

export function BrandImage({
  alt,
  aspect = "4 / 3",
  variant = "paper",
  radius = "2xl",
  scrim = "none",
  label,
  showSample = true,
  className,
  children,
}: {
  /** Accessible description of what the final photo would show. */
  alt: string;
  /** CSS aspect-ratio, e.g. "4 / 3", "1 / 1", "16 / 10". */
  aspect?: string;
  variant?: Variant;
  radius?: keyof typeof RADIUS;
  scrim?: "none" | "soft" | "strong";
  /** Caption rendered over the plate (e.g. a procedure name). */
  label?: string;
  showSample?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={`${alt} (sample image)`}
      className={cn(
        "relative isolate overflow-hidden border border-[var(--color-border)]",
        RADIUS[radius],
        VARIANT[variant],
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      {/* legibility scrim for overlaid copy */}
      {scrim !== "none" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            scrim === "soft"
              ? "bg-gradient-to-t from-[oklch(20%_0.035_56_/_0.55)] via-[oklch(20%_0.035_56_/_0.12)] to-transparent"
              : "bg-gradient-to-t from-[oklch(18%_0.03_54_/_0.8)] via-[oklch(20%_0.035_56_/_0.34)] to-[oklch(24%_0.04_57_/_0.08)]",
          )}
        />
      )}

      {/* "sample" tag — honest about the placeholder */}
      {showSample && (
        <span className="pointer-events-none absolute right-2.5 top-2.5 z-10 rounded-full bg-[oklch(20%_0.035_56_/_0.62)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[oklch(96%_0.012_72)] backdrop-blur-sm">
          Sample
        </span>
      )}

      {label && (
        // Backed pill so the label reads on ANY plate — light warm/muted/skin
        // or the dark brown/teal plates — keeping WCAG-AA contrast either way.
        <span className="absolute bottom-3 left-3.5 z-10 rounded-full bg-[oklch(20%_0.035_56_/_0.55)] px-2.5 py-0.5 text-[0.8rem] font-medium tracking-tight text-[oklch(97%_0.012_72)] backdrop-blur-sm">
          {label}
        </span>
      )}

      {children}
    </div>
  );
}
