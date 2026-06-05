"use client";

/**
 * Shared Timeless primitives — Reveal, SectionHeading, BrandImage
 * (self-contained placeholder "plate"), and shared CTA styles. Keeps section
 * files lean and the warm, friendly brand system consistent. No external image
 * assets — placeholder plates are warm peach / apricot / orange-cream gradients
 * washed with soft bokeh, each clearly marked "sample".
 */

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";
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
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay: prefersReduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---- SectionHeading: eyebrow + editorial display title + lead ---- */
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
        style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.04 }}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-5 text-pretty font-light",
            invert ? "text-[var(--color-bg)]/78" : "text-[var(--color-fg-muted)]",
          )}
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.62 }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ---- BrandImage: self-contained sample placeholder plate ----
   No network assets; a cohesive peach / apricot / orange-cream bokeh gradient
   with an optional "sample" tag and overlaid content. aspect-ratio → zero CLS. */
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
  variant?: "default" | "ink" | "brass";
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
    default: "tl-plate",
    ink: "tl-plate tl-plate--ink",
    brass: "tl-plate tl-plate--brass",
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
              ? "bg-white/12 text-white/85"
              : "bg-[var(--color-fg)]/8 text-[var(--color-fg)]/80",
          )}
        >
          {label}
        </span>
      )}
      {sample && (
        <span className="pointer-events-none absolute bottom-3 right-3 z-[2] rounded-full bg-black/30 px-2.5 py-1 text-[0.54rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Sample
        </span>
      )}
      {children}
    </div>
  );
}

/* ---- Pill button styles, shared across CTAs ---- */
export const btnPrimary = cn(
  "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-medium tracking-tight",
  "shadow-[0_16px_44px_-18px_oklch(60%_0.15_52_/_0.55)]",
  "transition-[transform,box-shadow] duration-300 ease-out",
  "hover:-translate-y-0.5 hover:shadow-[0_22px_56px_-16px_oklch(60%_0.15_52_/_0.72)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
);

export const btnGhost = cn(
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "border border-[var(--color-border)] bg-[var(--color-bg-elevated)] font-medium text-[var(--color-fg)]",
  "transition-colors duration-300 hover:bg-[var(--color-bg-subtle)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
);

export const btnGlass = cn(
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "glass font-medium text-[var(--color-fg)] backdrop-blur-md",
  "transition-colors duration-300 hover:bg-[var(--glass-bg-strong)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
);
