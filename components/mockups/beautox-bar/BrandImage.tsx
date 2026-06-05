"use client";

/**
 * BrandImage — a consistent on-brand PLATE for slots without a real photo (the
 * before/after sample pair, location interiors). Each renders a cohesive
 * hot-pink / blush / gold / black gradient plate plus an explicit "sample" chip
 * so the prospect understands these are placeholders for their real imagery.
 * (Real assets — logo, happy-hour, peptides, specials — are wired via next/image
 * directly in their sections.)
 *
 * Craft baked in:
 *  - CSS `aspect-ratio` → zero CLS, no width/height race
 *  - rounded corners + blush hairline border consistent with the system
 *  - optional gentle scroll parallax on the plate (reduced-motion safe)
 *  - optional scrim so overlaid copy holds WCAG-AA contrast
 */

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Convert an aspect like "16:9" into a CSS aspect-ratio value. */
function aspectToCss(aspect: string): string {
  const [w, h] = aspect.split(":");
  return w && h ? `${w} / ${h}` : "16 / 9";
}

export type BrandImageProps = {
  /** alt text describing the intended photograph (for the sample caption). */
  alt: string;
  aspect: string;
  /** plate tone — the cohesive candy grade. */
  tone?: "cream" | "magenta" | "lilac" | "night";
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full";
  /** bottom scrim strength for legibility of overlaid copy. */
  scrim?: "none" | "soft" | "strong";
  /** gentle scroll parallax on the plate layer. */
  parallax?: boolean;
  /** show the "sample" chip (default true). */
  sample?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const RADIUS: Record<NonNullable<BrandImageProps["radius"]>, string> = {
  lg: "rounded-2xl",
  xl: "rounded-[1.25rem]",
  "2xl": "rounded-[1.5rem]",
  "3xl": "rounded-[1.75rem]",
  full: "rounded-full",
};

const TONE: Record<NonNullable<BrandImageProps["tone"]>, string> = {
  cream: "bx-plate",
  magenta: "bx-plate bx-plate--magenta",
  lilac: "bx-plate bx-plate--lilac",
  night: "bx-plate bx-plate--night",
};

export function BrandImage({
  alt,
  aspect,
  tone = "cream",
  radius = "3xl",
  scrim = "none",
  parallax = false,
  sample = true,
  className,
  children,
}: BrandImageProps) {
  const prefersReduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallax && !prefersReduced ? ["-5%", "5%"] : ["0%", "0%"],
  );

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={`${alt} (sample placeholder)`}
      className={cn(
        "relative isolate overflow-hidden",
        RADIUS[radius],
        "border border-[var(--color-border)]",
        className,
      )}
      style={{ aspectRatio: aspectToCss(aspect) }}
    >
      <motion.span
        aria-hidden
        style={{
          y,
          /* position MUST be inline: the `.bx-plate` brand.css rule declares
             `position: relative` (it owns the ::after glint layer), and that
             scoped `[data-brand]` selector out-specifies the Tailwind `absolute`
             utility — leaving this fill span `position: relative` + `display:
             inline`, which collapses it to 0×0 so the gradient paints nothing and
             the plate reads as an empty (white) box. Forcing position here (inline
             styles beat the selector) makes the plate actually fill the slot. */
          position: "absolute",
          left: 0,
          right: 0,
          ...(parallax && !prefersReduced
            ? { height: "110%", top: "-5%" }
            : { height: "100%", top: 0 }),
        }}
        className={cn("absolute inset-0 w-full", TONE[tone])}
      />

      {/* legibility scrim for overlaid copy */}
      {scrim !== "none" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            scrim === "soft"
              ? "bg-gradient-to-t from-[oklch(16%_0.01_350_/_0.6)] via-[oklch(16%_0.01_350_/_0.12)] to-transparent"
              : "bg-gradient-to-t from-[oklch(14%_0.01_350_/_0.84)] via-[oklch(16%_0.01_350_/_0.36)] to-[oklch(18%_0.01_350_/_0.08)]",
          )}
        />
      )}

      {/* "sample" chip — honest placeholder marker */}
      {sample && (
        <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-[oklch(100%_0_0_/_0.4)] bg-[oklch(16%_0.01_350_/_0.55)] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[oklch(98%_0.01_350)] backdrop-blur-sm">
          Sample
        </span>
      )}

      {children}
    </div>
  );
}
