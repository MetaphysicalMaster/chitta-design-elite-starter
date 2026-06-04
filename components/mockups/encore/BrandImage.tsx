"use client";

/**
 * BrandImage (Encore) — the single, consistent treatment for every piece of
 * brand photography on the Encore page, so all six AI photos read as ONE
 * cinematic, aqua-teal + champagne shoot on the dark clinical-luxe theme.
 *
 * Craft baked in:
 *  - rounded corners consistent with the design system (radius prop)
 *  - CSS `aspect-ratio` from each manifest slot → zero CLS (no width/height race)
 *  - `loading="lazy"` + `decoding="async"` (these photos never sit above the fold;
 *    the WebGL "Renewal Light" crystal hero stays the centerpiece)
 *  - a unified color grade (`.en-photo` / `--graded`) + optional aqua↔champagne
 *    duotone wash (`.en-photo-tone`) for on-brand cohesion across the set
 *  - optional top/bottom cinematic vignette so photos seat into the dark theme
 *  - optional bottom/edge scrim so overlaid copy holds WCAG-AA contrast on dark
 *  - optional gentle scroll parallax on the image layer (reduced-motion safe)
 *
 * Absolute CloudFront URLs from `images.manifest.ts` work in the static export
 * regardless of basePath — they are NOT prefixed. We may use the lighter
 * `_min.webp` sibling for non-hero/card imagery via the `light` prop, with a
 * `.png` `onError` fallback so a card never shows a broken image.
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
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full" | "none";
  /** stronger ambiance grade for wide room/lounge/authority shots */
  graded?: boolean;
  /** aqua-teal ↔ champagne duotone wash for extra brand cohesion */
  tone?: boolean;
  /** cinematic top/bottom vignette so the photo seats into the dark theme */
  vignette?: boolean;
  /** bottom scrim strength for legibility of overlaid copy (0 = none) */
  scrim?: "none" | "soft" | "strong";
  /** gentle scroll parallax on the photo layer */
  parallax?: boolean;
  className?: string;
  /** content rendered over the photo (captions, labels, copy) */
  children?: React.ReactNode;
  /** decorative-only (no meaningful alt) */
  decorative?: boolean;
  /** object-position, e.g. "center 30%" to keep a subject in frame */
  position?: string;
};

const RADIUS: Record<NonNullable<BrandImageProps["radius"]>, string> = {
  none: "rounded-none",
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
  vignette = false,
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
  // Subtle parallax: the image drifts within its clipped frame on scroll.
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
        radius !== "none" && "border border-[var(--color-border)]",
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
          // light variant missing → retry with the full-res source once
          if (useLight) setUseLight(false);
        }}
        style={{
          y,
          objectPosition: position,
          // overscan so the parallax translate never reveals a hard edge
          ...(parallax && !prefersReduced
            ? { height: "112%", top: "-6%" }
            : { height: "100%" }),
        }}
        className={cn(
          "absolute inset-0 w-full object-cover",
          "en-photo",
          graded && "en-photo--graded",
        )}
      />

      {/* aqua-teal ↔ champagne duotone wash for cohesion */}
      {tone && <span aria-hidden className="en-photo-tone" />}

      {/* cinematic vignette so the photo seats into the dark theme */}
      {vignette && <span aria-hidden className="en-photo-vignette" />}

      {/* legibility scrim for overlaid copy (AA on the dark theme) */}
      {scrim !== "none" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            scrim === "soft"
              ? "bg-gradient-to-t from-[oklch(16%_0.02_248_/_0.62)] via-[oklch(16%_0.02_248_/_0.14)] to-transparent"
              : "bg-gradient-to-t from-[oklch(13%_0.02_248_/_0.86)] via-[oklch(16%_0.02_248_/_0.42)] to-[oklch(18%_0.02_248_/_0.1)]",
          )}
        />
      )}

      {children}
    </div>
  );
}
