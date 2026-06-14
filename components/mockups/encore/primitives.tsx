"use client";

/**
 * Shared motion + layout primitives for the Encore mockup.
 * Centralizes easing, scroll-reveal choreography, the eyebrow/heading rhythm,
 * and the recreated brand TREE logo so every section shares one refined cadence.
 */

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * EncoreMark — a brand-faithful RECREATION of the practice's logo: a stylized
 * tree (a single rising trunk that forks into a small branch family, crowned
 * with a cluster of rounded leaves). "Encore" = renewal / a second act / growth
 * — the tree IS the brand idea. The trunk/branches default to ink (currentColor)
 * and the leaves catch the brand teal. Pure inline SVG, crisp at any size.
 *
 * `leafTone` lets the wordmark tint the canopy (e.g. teal in the nav, white on
 * the deep CTA wells).
 */
export function EncoreMark({
  className,
  leafTone = "var(--leaf)",
  inkTone = "currentColor",
  title = "Encore Dermatology tree mark",
}: {
  className?: string;
  leafTone?: string;
  inkTone?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
    >
      {/* Trunk + branch family — a clean rising stem that forks, drawn as
          tapered ink strokes (the logo's branch). */}
      <g
        stroke={inkTone}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* trunk */}
        <path d="M24 44 V26" />
        {/* main fork */}
        <path d="M24 27 C 24 22, 19.5 19.5, 16 17.5" />
        <path d="M24 24 C 24 19, 28.5 16.5, 32 14.5" />
        {/* upper reach */}
        <path d="M24 20 C 24 15.5, 23 12, 24 8" />
        {/* small side twigs */}
        <path d="M20.6 20 C 18.4 19, 16.8 17.5, 15.4 15.6" />
        <path d="M27.4 18.2 C 29.4 17.4, 31 16, 32.4 14" />
      </g>

      {/* Canopy — a cluster of rounded leaves catching the teal light. Each is
          a soft teardrop; sizes vary so the crown reads organic, not stamped. */}
      <g fill={leafTone}>
        <ellipse cx="24" cy="7" rx="3.1" ry="4.2" transform="rotate(-4 24 7)" />
        <ellipse cx="16" cy="14.5" rx="2.7" ry="3.7" transform="rotate(-42 16 14.5)" />
        <ellipse cx="32.6" cy="12.6" rx="2.7" ry="3.7" transform="rotate(40 32.6 12.6)" />
        <ellipse cx="19.4" cy="19.6" rx="2.3" ry="3.2" transform="rotate(-30 19.4 19.6)" />
        <ellipse cx="28.8" cy="17.8" rx="2.3" ry="3.2" transform="rotate(28 28.8 17.8)" />
        <circle cx="24" cy="13.2" r="2.5" />
      </g>
    </svg>
  );
}

/** Back-compat alias — older imports referenced EncoreCrest. */
export const EncoreCrest = EncoreMark;

/** Staggered container — children use `revealItem`. */
export function useStagger(stagger = 0.08, delay = 0.04): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** A single scroll-revealed block. Honors reduced motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: prefersReduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: prefersReduced ? 0 : delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Eyebrow + heading + optional lede — the consistent section header. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span
        className={cn(
          "rule-gold text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--clinical-deep)]",
          align === "center" && "[&::after]:mx-auto",
        )}
      >
        {eyebrow}
      </span>
      <h2
        id={id}
        className="font-display text-balance text-[var(--color-fg)]"
        style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "max-w-[58ch] text-pretty font-light text-[var(--color-fg-muted)]",
            align === "center" && "mx-auto",
          )}
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}

/** A consistently-padded full-width section shell with optional id. */
export function Section({
  id,
  children,
  className,
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32",
        className,
      )}
    >
      {children}
    </section>
  );
}
