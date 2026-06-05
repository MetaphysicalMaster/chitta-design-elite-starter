"use client";

/**
 * Shared Happy Clinic primitives — SectionHeading, Reveal, BrandImage
 * (self-contained placeholder "plate"), and shared CTA styles. Keeps section
 * files lean and the aurora brand system consistent. No external image assets —
 * placeholder plates are aurora violet/teal gradients, each marked "sample".
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
          "font-display mt-4 text-balance",
          invert ? "text-white" : "text-[var(--color-fg)]",
        )}
        style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05, fontWeight: 600 }}
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

/* ---- Pill button styles, shared across CTAs ---- */
export const btnPrimary = cn(
  "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold tracking-tight",
  "shadow-[0_16px_44px_-16px_oklch(56%_0.2_300_/_0.6)]",
  "transition-[transform,box-shadow] duration-300 ease-out",
  "hover:-translate-y-0.5 hover:shadow-[0_22px_56px_-14px_oklch(56%_0.2_300_/_0.78)]",
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
  "glass font-medium text-white backdrop-blur-md",
  "transition-colors duration-300 hover:bg-white/15",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
);
