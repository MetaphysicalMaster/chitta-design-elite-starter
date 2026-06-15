"use client";

/**
 * BrandImage — the single, consistent treatment for every piece of brand
 * "photography" on the page (apart from the real hero.jpg). With no `src` it
 * renders an on-brand gradient PLATE in the GREYSCALE-with-hot-pink system
 * (tone keys marble / emerald / gold are kept for compatibility but now map to
 * light-grey / dark-grey / hot-pink plates), so all placeholders read as one
 * cohesive monochrome-with-pink shoot, plus an explicit "sample" chip. Given a
 * real `src`, it renders that photograph under the SAME editorial grade — full
 * monochrome (the canonical `sn-grayscale` lift) plus a faint hot-pink raking
 * glow — so real shots join the strict greyscale-with-pink system cleanly.
 *
 * Craft baked in:
 *  - CSS `aspect-ratio` → zero CLS, no width/height race
 *  - real photos: <img loading="lazy" decoding="async" object-cover>
 *  - rounded corners + neutral hairline border consistent with the system
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
  /** real photograph src (root-absolute, e.g. "/clients/sousan/gen/x.webp").
      When set, a graded <img> replaces the gradient plate + sample chip. */
  src?: string;
  aspect: string;
  /** plate tone (names kept): marble = light grey, emerald = dark grey,
      gold = hot-pink. The cohesive monochrome-with-pink grade. */
  tone?: "marble" | "emerald" | "gold";
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
  marble: "sn-plate",
  emerald: "sn-plate sn-plate--emerald",
  gold: "sn-plate sn-plate--gold",
};

export function BrandImage({
  alt,
  src,
  aspect,
  tone = "marble",
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

  const hasPhoto = Boolean(src);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={hasPhoto || !sample ? alt : `${alt} (sample placeholder)`}
      className={cn(
        "sn-plate-host relative isolate overflow-hidden",
        RADIUS[radius],
        "border border-[var(--color-border)]",
        className,
      )}
      style={{ aspectRatio: aspectToCss(aspect) }}
    >
      {hasPhoto ? (
        <>
          {/* Real photograph, graded into the strict monochrome system (the
              canonical sn-grayscale lift), filling the locked aspect box. */}
          <motion.img
            src={src}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            style={{
              y,
              ...(parallax && !prefersReduced
                ? { height: "110%", top: "-5%" }
                : { height: "100%" }),
            }}
            className="sn-grayscale absolute inset-0 w-full object-cover"
          />
          {/* Faint hot-pink raking glow from the lower-right — keeps real
              photos in the monochrome-WITH-pink editorial system. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-screen [background:radial-gradient(120%_130%_at_88%_92%,oklch(62%_0.25_357_/_0.18),transparent_60%)]"
          />
        </>
      ) : (
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
      )}

      {/* legibility scrim for overlaid copy */}
      {scrim !== "none" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            scrim === "soft"
              ? "bg-gradient-to-t from-[oklch(15%_0_0_/_0.6)] via-[oklch(15%_0_0_/_0.12)] to-transparent"
              : "bg-gradient-to-t from-[oklch(12%_0_0_/_0.82)] via-[oklch(15%_0_0_/_0.36)] to-[oklch(18%_0_0_/_0.08)]",
          )}
        />
      )}

      {/* "sample" chip — honest placeholder marker (only on gradient plates) */}
      {sample && !hasPhoto && (
        <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-[oklch(100%_0_0_/_0.35)] bg-[oklch(15%_0_0_/_0.5)] px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-[oklch(96%_0_0)] backdrop-blur-sm">
          Sample
        </span>
      )}

      {children}
    </div>
  );
}
