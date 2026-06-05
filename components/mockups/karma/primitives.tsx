"use client";

/**
 * Shared grounded-wellness primitives for the Karma mockup:
 * - Reveal / RevealGroup / RevealItem  (scroll choreography, reduced-motion safe)
 * - SectionHeading                     (eyebrow + serif title + lead)
 * - Magnetic                           (subtle cursor-magnetic wrapper for CTAs)
 * - ctaPrimary / ctaGhost              (consistent button system)
 *
 * All motion honors prefers-reduced-motion (no transforms, instant show). The
 * voice is calm and centered — short travel, serene easing that suits a
 * balanced botanical-wellness brand.
 */

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  as?: "div" | "section" | "li" | "article" | "figure";
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.78,
        ease: EASE,
        delay: prefersReduced ? 0 : delay,
      },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: prefersReduced ? 0 : stagger } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  y = 20,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "article" | "figure";
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: prefersReduced ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: 0.64, ease: EASE } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  tone = "light",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** "dark" = sits on the earth-night sections. */
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      <Reveal>
        <p
          className={cn(
            "eyebrow rule-orbit inline-block",
            align === "center" && "rule-orbit-center",
            tone === "dark"
              ? "text-[var(--color-accent-bright)]"
              : "text-[var(--color-accent-deep)]",
          )}
        >
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          className={cn(
            "font-display mt-5 text-balance",
            tone === "dark"
              ? "text-[var(--color-bg)]"
              : "text-[var(--color-fg)]",
          )}
          style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.1 }}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-5 text-pretty font-light",
              tone === "dark"
                ? "text-[oklch(90%_0.02_120_/_0.86)]"
                : "text-[var(--color-fg-muted)]",
            )}
            style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.64 }}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Magnetic — subtle cursor pull for primary CTAs. Disabled on touch + reduced. */
export function Magnetic({
  children,
  className,
  strength = 0.22,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 210, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 210, damping: 22, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (prefersReduced || !ref.current) return;
    if (matchMedia("(hover: none)").matches) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

/** Shared CTA class helpers (consistent button system across sections). */
export const ctaPrimary = cn(
  "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "bg-[var(--color-accent-deep)] font-medium tracking-tight text-[var(--color-accent-fg)]",
  "shadow-[0_16px_40px_-16px_oklch(43%_0.066_147_/_0.55)]",
  "transition-[transform,box-shadow] duration-300 ease-out",
  "hover:-translate-y-0.5 hover:shadow-[0_22px_54px_-14px_oklch(43%_0.066_147_/_0.65)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
);

export const ctaGhost = cn(
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "border border-[var(--color-border)] bg-[var(--color-bg-elevated)] font-medium text-[var(--color-fg)]",
  "transition-colors duration-300 hover:border-[var(--color-accent-deep)] hover:text-[var(--color-accent-deep)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
);
