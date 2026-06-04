"use client";

/**
 * Shared motion + layout primitives for the Encore mockup.
 * Centralizes easing, scroll-reveal choreography and the eyebrow/heading
 * rhythm so every section shares one refined cadence.
 */

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

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
          "rule-gold text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]",
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
