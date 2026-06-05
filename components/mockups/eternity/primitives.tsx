"use client";

/**
 * Shared noir-luxe primitives for the Eternity mockup:
 * - Reveal / RevealGroup / RevealItem  (scroll choreography, reduced-motion safe)
 * - SectionHeading                     (eyebrow + didone title + lead)
 * - Magnetic                           (subtle cursor-magnetic wrapper for CTAs)
 * - ctaPrimary / ctaGhost              (consistent chrome button system)
 *
 * All motion honors prefers-reduced-motion (no transforms, instant show). The
 * voice is refined and devotional — restrained travel, slow couture easing that
 * suits an enduring timeless-luxury brand. Everything sits on the midnight night
 * by default, so the type defaults to liquid-silver foreground.
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
  y = 24,
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
        duration: 0.82,
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
  y = 22,
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
        show: { opacity: 1, y: 0, transition: { duration: 0.68, ease: EASE } },
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
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
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
            "eyebrow rule-infinity inline-block text-[var(--color-accent-bright)]",
            align === "center" && "rule-infinity-center",
          )}
        >
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          className="font-display mt-5 text-balance text-[var(--color-fg)]"
          style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.08 }}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p
            className="mt-5 text-pretty font-light text-[var(--color-fg-muted)]"
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
  strength = 0.2,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 22, mass: 0.4 });

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

/** Shared CTA class helpers — the chrome button system across sections. */
export const ctaPrimary = cn(
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "silver-pill font-semibold tracking-tight text-[var(--color-accent-fg)]",
  "shadow-[0_18px_46px_-18px_oklch(70%_0.04_300_/_0.5)]",
  "transition-[transform,box-shadow] duration-300 ease-out",
  "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_oklch(72%_0.05_300_/_0.6)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
);

export const ctaGhost = cn(
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
  "border border-[var(--glass-border)] bg-[var(--glass-bg)] font-medium text-[var(--color-fg)] backdrop-blur-md",
  "transition-colors duration-300 hover:border-[var(--color-accent-bright)] hover:text-[var(--color-accent-bright)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
);
