"use client";

/**
 * Shared Happy Clinic primitives — SectionHeading, Reveal, BrandImage
 * (self-contained placeholder "plate"), and shared CTA styles. Keeps section
 * files lean and the brand system consistent. Real client photography is wired
 * directly via next/image in the sections; these placeholder plates (navy /
 * pine-teal gradients, each marked "sample") remain only for decorative slots.
 */

import { motion, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
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
      transition={{ duration: 0.7, ease: EASE, delay: prefersReduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---- SectionHeading: eyebrow + display title + lead ---- */
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
          "rule-aurora inline-block text-xs font-semibold uppercase tracking-[0.24em]",
          align === "center" && "[&::after]:mx-auto",
          invert ? "text-[var(--color-accent-bright)]" : "text-accent-deep",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-heading mt-4 text-balance",
          invert ? "text-white" : "text-[var(--color-accent-deep)]",
        )}
        style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.08 }}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-5 text-pretty",
            invert ? "text-white/75" : "text-[var(--color-fg-muted)]",
          )}
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ---- BrandImage: self-contained aurora placeholder plate ----
   No network assets; a cohesive violet/teal gradient with an optional
   "sample" tag and overlaid content. aspect-ratio → zero CLS. */
export function BrandImage({
  aspect = "16 / 9",
  night = false,
  radius = "2xl",
  sample = true,
  label,
  className,
  children,
}: {
  aspect?: string;
  night?: boolean;
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full";
  sample?: boolean;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const RADIUS: Record<string, string> = {
    lg: "rounded-2xl",
    xl: "rounded-[1.25rem]",
    "2xl": "rounded-[1.5rem]",
    "3xl": "rounded-[1.75rem]",
    full: "rounded-full",
  };
  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label ? `${label} (sample image)` : "Sample brand image"}
      className={cn(
        "relative isolate overflow-hidden border border-[var(--color-border)]",
        night ? "hc-plate hc-plate--night" : "hc-plate",
        RADIUS[radius],
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      {label && (
        <span
          className={cn(
            "absolute left-3 top-3 z-[2] rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em]",
            night
              ? "bg-white/12 text-white/85"
              : "bg-[var(--color-fg)]/8 text-[var(--color-fg)]/80",
          )}
        >
          {label}
        </span>
      )}
      {sample && (
        <span className="pointer-events-none absolute bottom-3 right-3 z-[2] rounded-full bg-black/35 px-2.5 py-1 text-[0.55rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Sample
        </span>
      )}
      {children}
    </div>
  );
}

/* ---- Pill button styles, shared across CTAs ----
   All carry .hc-press (brand.css): a unified quick 3% press compress on
   :active, plus a normalized transition-property list that includes the
   native `translate`/`scale` props Tailwind v4 emits — so hover lifts ease
   smoothly instead of snapping. */
export const btnPrimary = cn(
  "hc-press group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold tracking-tight",
  "shadow-[0_16px_44px_-16px_oklch(52%_0.087_178_/_0.6)]",
  "hover:-translate-y-0.5 hover:shadow-[0_22px_56px_-14px_oklch(52%_0.087_178_/_0.78)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
);

export const btnGhost = cn(
  "hc-press inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "border border-[var(--color-border)] bg-[var(--color-bg-elevated)] font-medium text-[var(--color-fg)]",
  "hover:bg-[var(--color-bg-subtle)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
);

export const btnGlass = cn(
  "hc-press inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "glass font-medium text-white backdrop-blur-md",
  "hover:bg-white/15",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
);
