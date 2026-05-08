"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RestraintTierProps {
  children: ReactNode;
  className?: string;
}

/**
 * Restraint Tier — the wow IS the restraint.
 *
 * Anthropic / Linear-tier minimalism: deliberate emptiness, single perfectly-timed
 * entrance, no decorative motion, generous whitespace, hand-tuned hierarchy.
 *
 * Use when brand archetype is Sage / Innocent / Ruler with strong brand confidence.
 * NOT a component you fill — a discipline you apply.
 *
 * This wrapper provides the canonical entrance (single fade-up, no stagger, no shader)
 * and applies generous-whitespace section padding via tokens.
 *
 * Performance: 0KB shader; ~2KB Framer Motion (already in bundle).
 */
export function RestraintTier({ children, className }: RestraintTierProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "px-6 py-32 sm:py-40 md:py-48 lg:py-64",
        "max-w-3xl mx-auto",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

/**
 * RestraintTier discipline checklist:
 *
 * - Single primary focal point per section (NOT 3-5)
 * - Whitespace ratio ≥ 60% above the fold
 * - One CTA per page (not stacked)
 * - Type scale spread ≥ 5× (h1 vs body)
 * - No decorative motion (functional only)
 * - No shader / particle / gradient backgrounds
 * - Single column ≤ 3xl max-width on text-heavy sections
 * - Section padding ≥ 4× within-section padding
 * - Color palette ≤ 3 brand colors total
 * - Footer minimal (1-line copyright + 1 link max)
 *
 * If your design instinct says "add more" — restraint says don't.
 */
