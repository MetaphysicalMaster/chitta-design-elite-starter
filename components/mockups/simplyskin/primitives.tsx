"use client";

/**
 * Shared SimplySkin primitives — Reveal, SectionHeading, Wordmark, BrandImage,
 * and shared CTA styles. Keeps section files lean and the understated brand
 * system consistent. BrandImage now supports a real `src` (e.g. the client's
 * hero photo) and falls back to a soft warm-greige gradient "plate" when no
 * src is given — placeholder plates are clearly marked "sample".
 */

import { motion, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---- Wordmark: the recreated thin two-tone "SimplySkin" identity ----
   A light, hairline wordmark where "Simply" (deep charcoal) and "Skin" (warm
   grey) differ subtly in tone, with a smaller, quieter "MedSpa" beneath —
   elegant and understated, matched to the live site. `onDark` flips the tones
   for the rare dark section; `size` scales the lockup. */
export function Wordmark({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "ss-wordmark inline-flex flex-col leading-none",
        onDark && "ss-wordmark--on-dark",
        className,
      )}
    >
      <span className="text-[1.35rem] tracking-tight sm:text-[1.5rem]">
        <span className="ss-wordmark__simply">Simply</span>
        <span className="ss-wordmark__skin">Skin</span>
      </span>
      <span className="ss-wordmark__medspa mt-1 text-[0.5rem] sm:text-[0.55rem]">
        Med Spa
      </span>
    </span>
  );
}

/* ---- Reveal: in-view fade/rise, reduced-motion safe ---- */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 20,
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
      transition={{ duration: 0.8, ease: EASE, delay: prefersReduced ? 0 : delay }}
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
          invert ? "text-white" : "text-[var(--color-fg)]",
        )}
        style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-5 text-pretty font-light",
            invert ? "text-white/75" : "text-[var(--color-fg-muted)]",
          )}
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ---- BrandImage: real photo OR self-contained placeholder plate ----
   When `src` is given it renders the real photograph (object-cover, with
   optional `position`); otherwise it falls back to a cohesive warm-greige
   gradient plate. The "sample" tag is shown only for placeholder plates by
   default (a real wired photo is not "sample") — override with `sample`.
   aspect-ratio → zero CLS. */
export function BrandImage({
  aspect = "4 / 5",
  variant = "default",
  radius = "2xl",
  sample,
  label,
  src,
  alt,
  position = "center",
  className,
  children,
}: {
  aspect?: string;
  variant?: "default" | "ink" | "nude";
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full";
  sample?: boolean;
  label?: string;
  /** Real photo source. When omitted, a gradient placeholder plate renders. */
  src?: string;
  /** Accessible description of the real photo (required when `src` is set). */
  alt?: string;
  /** CSS object-position for the real photo, e.g. "68% 38%". */
  position?: string;
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
  const PLATE: Record<string, string> = {
    default: "ss-plate",
    ink: "ss-plate ss-plate--ink",
    nude: "ss-plate ss-plate--nude",
  };
  const ink = variant === "ink";
  const hasPhoto = Boolean(src);
  // Placeholder plates default to showing the "sample" tag; real photos don't.
  const showSample = sample ?? !hasPhoto;
  return (
    <div
      ref={wrapRef}
      role={hasPhoto ? undefined : "img"}
      aria-label={hasPhoto ? undefined : label ? `${label} (sample image)` : "Sample brand image"}
      className={cn(
        "relative isolate overflow-hidden border border-[var(--color-border)]",
        hasPhoto ? "bg-[var(--color-bg-warm)]" : PLATE[variant],
        RADIUS[radius],
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      {hasPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? label ?? ""}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: position }}
          draggable={false}
          loading="lazy"
        />
      )}
      {label && (
        <span
          className={cn(
            "absolute left-3 top-3 z-[2] rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em]",
            hasPhoto
              ? "bg-[oklch(24%_0.01_66_/_0.45)] text-white/90 backdrop-blur-sm"
              : ink
                ? "bg-white/12 text-white/85"
                : "bg-[var(--color-fg)]/6 text-[var(--color-fg)]/75",
          )}
        >
          {label}
        </span>
      )}
      {showSample && (
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
  "shadow-[0_16px_44px_-20px_oklch(58%_0.04_184_/_0.5)]",
  "transition-[transform,box-shadow] duration-300 ease-out",
  "hover:-translate-y-0.5 hover:shadow-[0_22px_56px_-18px_oklch(58%_0.04_184_/_0.65)]",
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
  "transition-colors duration-300 hover:bg-white/70",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
);
