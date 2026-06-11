"use client";

/**
 * Shared Hanami primitives — Reveal, SectionHeading, BrandPhoto (REAL client
 * photography via next/image, framed), BrandImage (gradient placeholder "plate"
 * for any still-unsourced imagery, marked "sample"), and shared CTA styles.
 * Keeps section files lean and the black + gold + sakura brand system consistent.
 */

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---- Reveal: in-view fade/rise, reduced-motion safe ---- */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 22,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: prefersReduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      // Trigger a touch earlier (-8%) and resolve faster (0.6s) so copy is fully
      // opaque by the time it reaches a comfortable reading position under Lenis
      // smooth-scroll — no content caught translucent mid-fade. Reduced-motion
      // hard-cuts to visible (no transform, no opacity ramp).
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: prefersReduced ? 0 : 0.6, ease: EASE, delay: prefersReduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---- SectionHeading: eyebrow + literary display title + lead ---- */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  invert = false,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  invert?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      )}
    >
      <p
        className={cn(
          "rule-fine eyebrow inline-block",
          align === "center" && "[&::after]:mx-auto",
          invert ? "text-[var(--color-accent-bright)]" : "text-accent-deep",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display mt-5 text-balance",
          invert ? "text-[var(--color-bg)]" : "text-[var(--color-fg)]",
        )}
        style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-5 text-pretty font-light",
            invert ? "text-[var(--color-bg)]/80" : "text-[var(--color-fg-muted)]",
          )}
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.64 }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ---- BrandImage: self-contained botanical placeholder plate ----
   No network assets; a cohesive washi/sakura/sumi-ink gradient with an optional
   "sample" tag and overlaid content. aspect-ratio → zero CLS. */
export function BrandImage({
  aspect = "4 / 5",
  variant = "default",
  radius = "2xl",
  sample = true,
  label,
  className,
  children,
}: {
  aspect?: string;
  variant?: "default" | "ink" | "sakura";
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full";
  sample?: boolean;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const RADIUS: Record<string, string> = {
    lg: "rounded-2xl",
    xl: "rounded-[1.25rem]",
    "2xl": "rounded-[1.5rem]",
    "3xl": "rounded-[1.75rem]",
    full: "rounded-full",
  };
  const PLATE: Record<string, string> = {
    default: "hn-plate",
    ink: "hn-plate hn-plate--ink",
    sakura: "hn-plate hn-plate--sakura",
  };
  const ink = variant === "ink";
  return (
    <div
      role="img"
      aria-label={label ? `${label} (sample image)` : "Sample brand image"}
      className={cn(
        "relative isolate overflow-hidden border border-[var(--color-border)]",
        PLATE[variant],
        RADIUS[radius],
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      {label && (
        <span
          className={cn(
            "absolute left-3 top-3 z-[2] rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em]",
            ink
              ? "bg-white/14 text-white/90"
              : "bg-[var(--color-fg)]/8 text-[var(--color-fg)]/80",
          )}
        >
          {label}
        </span>
      )}
      {sample && (
        <span className="pointer-events-none absolute bottom-3 right-3 z-[2] rounded-full bg-black/28 px-2.5 py-1 text-[0.54rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Sample
        </span>
      )}
      {children}
    </div>
  );
}

/* ---- BrandPhoto: a REAL client photograph (next/image), framed ----
   For the genuine assets in /public/clients/hanami. Uses next/image so it stays
   static-export + basePath safe (the export config sets images.unoptimized and a
   per-repo basePath, both of which next/image honors). aspect-ratio → zero CLS.
   `fill` + a sized wrapper keeps the crop consistent; `priority` for above-fold.
   `sample` marks stock-style ambiance imagery honestly; brand/real photos omit it. */
export function BrandPhoto({
  src,
  alt,
  aspect = "4 / 5",
  radius = "2xl",
  position = "center",
  sample = false,
  priority = false,
  sizes = "(min-width: 1024px) 36rem, 100vw",
  frame = false,
  scrim = "none",
  className,
  children,
}: {
  src: string;
  alt: string;
  aspect?: string;
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full";
  /** object-position for the crop, e.g. "center", "top", "50% 30%". */
  position?: string;
  sample?: boolean;
  priority?: boolean;
  sizes?: string;
  /** add a thin inset gold rule (the luxe plate frame). */
  frame?: boolean;
  scrim?: "none" | "soft" | "strong";
  className?: string;
  children?: ReactNode;
}) {
  const RADIUS: Record<string, string> = {
    lg: "rounded-2xl",
    xl: "rounded-[1.25rem]",
    "2xl": "rounded-[1.5rem]",
    "3xl": "rounded-[1.75rem]",
    full: "rounded-full",
  };
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-[var(--color-bg-warm)]",
        "border border-[var(--color-border)]",
        RADIUS[radius],
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: position }}
      />

      {/* legibility scrim for overlaid copy */}
      {scrim !== "none" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            scrim === "soft"
              ? "bg-gradient-to-t from-[oklch(16%_0.003_60_/_0.55)] via-[oklch(16%_0.003_60_/_0.1)] to-transparent"
              : "bg-gradient-to-t from-[oklch(14%_0.003_60_/_0.82)] via-[oklch(16%_0.003_60_/_0.32)] to-[oklch(20%_0.004_60_/_0.06)]",
          )}
        />
      )}

      {/* thin inset gold rule — the trophy/plate frame */}
      {frame && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[0.6rem] rounded-[inherit] border border-[oklch(82%_0.09_88_/_0.4)]"
        />
      )}

      {sample && (
        <span className="pointer-events-none absolute bottom-3 right-3 z-[2] rounded-full bg-black/35 px-2.5 py-1 text-[0.54rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Sample
        </span>
      )}

      {children}
    </div>
  );
}

/* ---- Pill button styles, shared across CTAs ----
   Primary is a black-tie SUMI-BLACK pill with a gold hairline ring — the brand's
   black + gold luxury, consistent with the nav Book button. */
export const btnPrimary = cn(
  "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "bg-[var(--ink-deep)] text-[var(--color-bg)] font-medium tracking-tight",
  "ring-1 ring-[oklch(82%_0.09_88_/_0.28)]",
  "shadow-[0_16px_44px_-18px_oklch(16%_0.003_60_/_0.7)]",
  "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "hover:-translate-y-0.5 hover:shadow-[0_22px_56px_-16px_oklch(16%_0.003_60_/_0.85)]",
  "active:translate-y-0 active:scale-[0.98]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
);

/* The GOLD pill — the single, unmistakable "act now" affordance, mirroring the
   hero + booking CTA. Use it for the primary BOOK action site-wide so the money
   action is visually singular; keep btnPrimary's sumi-black for secondary
   "explore" actions (never two dark pills where one is the booking action). */
export const btnGold = cn(
  "hn-sheen group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold tracking-tight",
  "ring-1 ring-[oklch(88%_0.08_90_/_0.4)]",
  "shadow-[0_18px_50px_-18px_oklch(72%_0.11_86_/_0.6)]",
  "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_oklch(78%_0.11_86_/_0.78)]",
  "active:translate-y-0 active:scale-[0.98]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
);

export const btnGhost = cn(
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "border border-[var(--gold-hairline)] bg-[var(--color-bg-elevated)] font-medium text-[var(--color-fg)]",
  "transition-[background-color,transform] duration-300 hover:bg-[var(--color-bg-subtle)]",
  "active:scale-[0.98]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
);

export const btnGlass = cn(
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "glass font-medium text-[var(--color-fg)] backdrop-blur-md",
  "transition-[background-color,transform] duration-300 hover:bg-[var(--glass-bg-strong)]",
  "active:scale-[0.98]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
);

/* ---- A small decorative sakura petal mark (CSS clip-path) ---- */
export function PetalMark({ className }: { className?: string }) {
  return <span aria-hidden className={cn("petal-mark inline-block", className)} />;
}
