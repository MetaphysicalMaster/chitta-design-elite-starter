"use client";

/**
 * Reveal — viewport-triggered fade/slide for scroll choreography.
 * Honors prefers-reduced-motion (renders instantly, no transform).
 */

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  as?: "div" | "section" | "li" | "article";
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay: prefersReduced ? 0 : delay },
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

/** Stagger container for groups of Reveal-like children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
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
    </motion.div>
  );
}

const ITEM_EASE = [0.16, 1, 0.3, 1] as const;

/** Child to be used inside RevealGroup. */
export function RevealItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: prefersReduced ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ITEM_EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}
