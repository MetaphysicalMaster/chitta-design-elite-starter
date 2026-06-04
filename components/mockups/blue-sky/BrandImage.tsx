"use client";

/**
 * BrandImage — the single, consistent treatment for every piece of brand
 * photography on the page, so all six AI photos read as one cohesive shoot.
 *
 * Craft baked in:
 *  - rounded corners consistent with the design system (radius prop)
 *  - CSS `aspect-ratio` from each manifest slot → zero CLS, no width/height race
 *  - `loading="lazy"` + `decoding="async"` (these images never sit above the fold)
 *  - a unified color grade (`.bs-photo` / `--graded`) + optional champagne→sky
 *    soft-light duotone wash (`.bs-photo-tone`) for on-brand cohesion
 *  - optional bottom/edge scrim so overlaid copy holds WCAG-AA contrast
 *  - optional gentle scroll parallax on the image layer (reduced-motion safe)
 *
 * Absolute CloudFront URLs from the manifest work in the static export
 * regardless of basePath — they are NOT prefixed. We may use the lighter
 * `_min.webp` sibling for non-hero/card imagery via the `light` prop.
 */

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Convert a manifest `aspect` like "16:9" into a CSS aspect-ratio value. */
function aspectToCss(aspect: string): string {
  const [w, h] = aspect.split(":");
  return w && h ? `${w} / ${h}` : "16 / 9";
}

/** Swap the full-res `.png` for its lighter `_min.webp` sibling. */
function toLight(url: string): string {
  return url.replace(/\.png(\?.*)?$/i, "_min.webp$1");
}

export type BrandImageProps = {
  src: string;
  alt: string;
  aspect: string;
  /** Use the lighter `_min.webp` sibling (cards / non-hero imagery). */
  light?: boolean;
  /** corner radius token */
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full";
  /** stronger ambiance grade for wide room/lounge shots */
  graded?: boolean;
  /** champagne→sky duotone wash for extra brand cohesion */
  tone?: boolean;
  /** bottom scrim strength for legibility of overlaid copy (0 = none) */
  scrim?: "none" | "soft" | "strong";
  /** gentle scroll parallax on the photo layer */
  parallax?: boolean;
  className?: string;
  /** content rendered over the photo (captions, labels, copy) */
  children?: React.ReactNode;
  /** decorative-only (no meaningful alt) */
  decorative?: boolean;
  /** object-position, e.g. "center 30%" to keep a face in frame */
  position?: string;
};

const RADIUS: Record<NonNullable<BrandImageProps["radius"]>, string> = {
  lg: "rounded-2xl",
  xl: "rounded-[1.25rem]",
  "2xl": "rounded-[1.5rem]",
  "3xl": "rounded-[1.75rem]",
  full: "rounded-full",
};

export function BrandImage({
  src,
  alt,
  aspect,
  light = false,
  radius = "3xl",
  graded = false,
  tone = false,
  scrim = "none",
  parallax = false,
  className,
  children,
  decorative = false,
  position = "center",
}: BrandImageProps) {
  const prefersReduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  // If the lighter `_min.webp` sibling 404s, fall back to the full-res `.png`
  // so a card never shows a broken image.
  const [useLight, setUseLight] = useState(light);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  // Subtle Ken-Burns-free parallax: image drifts within a clipped frame.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallax && !prefersReduced ? ["-6%", "6%"] : ["0%", "0%"],
  );

  const url = useLight ? toLight(src) : src;

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative isolate overflow-hidden",
        RADIUS[radius],
        "border border-[var(--color-border)]",
        className,
      )}
      style={{ aspectRatio: aspectToCss(aspect) }}
    >
      <motion.img
        src={url}
        alt={decorative ? "" : alt}
        aria-hidden={decorative || undefined}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => {
          // light variant missing → retry with full-res source once
          if (useLight) setUseLight(false);
        }}
        style={{
          y,
          objectPosition: position,
          // overscan so the parallax translate never reveals an edge
          ...(parallax && !prefersReduced
            ? { height: "112%", top: "-6%" }
            : { height: "100%" }),
        }}
        className={cn(
          "absolute inset-0 w-full object-cover",
          "bs-photo",
          graded && "bs-photo--graded",
        )}
      />

      {/* champagne→sky duotone wash for cohesion */}
      {tone && <span aria-hidden className="bs-photo-tone" />}

      {/* legibility scrim for overlaid copy */}
      {scrim !== "none" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            scrim === "soft"
              ? "bg-gradient-to-t from-[oklch(22%_0.07_255_/_0.55)] via-[oklch(22%_0.07_255_/_0.12)] to-transparent"
              : "bg-gradient-to-t from-[oklch(20%_0.07_255_/_0.78)] via-[oklch(22%_0.07_255_/_0.34)] to-[oklch(24%_0.07_255_/_0.08)]",
          )}
        />
      )}

      {children}
    </div>
  );
}
