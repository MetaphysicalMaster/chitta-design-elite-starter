"use client";

/**
 * BrandImage — the single, consistent treatment for every piece of brand
 * "photography" on the page. There are NO external assets in this mockup, so
 * each slot renders an on-brand noir-luxe gradient PLATE (night / silver /
 * amethyst) that reads as one cohesive, mirror-lit shoot, plus an explicit
 * "sample" chip so the prospect understands these are placeholders for their
 * real imagery.
 *
 * Craft baked in:
 *  - CSS `aspect-ratio` → zero CLS, no width/height race
 *  - rounded corners + liquid-silver hairline border consistent with the system
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
  /** plate tone — the cohesive noir-luxe grade. */
  tone?: "night" | "silver" | "amethyst";
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
  night: "et-plate et-plate--night",
  silver: "et-plate et-plate--silver",
  amethyst: "et-plate et-plate--amethyst",
};

export function BrandImage({
  alt,
  aspect,
  tone = "night",
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
          ...(parallax && !prefersReduced
            ? { height: "110%", top: "-5%" }
            : { height: "100%" }),
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
              ? "bg-gradient-to-t from-[oklch(13%_0.024_300_/_0.66)] via-[oklch(13%_0.024_300_/_0.14)] to-transparent"
              : "bg-gradient-to-t from-[oklch(13%_0.024_300_/_0.86)] via-[oklch(13%_0.024_300_/_0.4)] to-[oklch(13%_0.024_300_/_0.08)]",
          )}
        />
      )}

      {/* "sample" chip — honest placeholder marker */}
      {sample && (
        <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-[oklch(100%_0_0_/_0.32)] bg-[oklch(13%_0.024_300_/_0.55)] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[oklch(95%_0.01_300)] backdrop-blur-sm">
          Sample
        </span>
      )}

      {children}
    </div>
  );
}
