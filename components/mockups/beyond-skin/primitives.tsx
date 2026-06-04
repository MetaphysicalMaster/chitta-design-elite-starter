"use client";

/**
 * Shared editorial primitives for the Beyond Skin mockup:
 * - Reveal / RevealGroup / RevealItem  (scroll choreography, reduced-motion safe)
 * - SectionHeading                     (eyebrow + display title + lead)
 * - Magnetic                           (cursor-magnetic wrapper for CTAs)
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

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
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
        duration: 0.75,
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
  y = 24,
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
        show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
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
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      <Reveal>
        <p
          className={cn(
            "rule-bronze inline-block text-[0.72rem] font-semibold uppercase tracking-[0.28em]",
            invert ? "text-[var(--gold)]" : "text-[var(--gold-deep)]",
            align === "center" && "rule-bronze-center",
          )}
        >
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          className={cn(
            "font-display mt-5 text-balance",
            invert ? "text-[var(--color-bg)]" : "text-[var(--color-fg)]",
          )}
          style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-5 text-pretty font-light",
              invert ? "text-[var(--color-bg)]/75" : "text-[var(--color-fg-muted)]",
            )}
            style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
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
  strength = 0.32,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

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
