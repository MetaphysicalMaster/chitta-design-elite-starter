"use client";

/**
 * TrustBar — the authority strip directly under the hero. Surfaces the
 * proof points the real site buries: rating, review volume, OSU faculty
 * status, tenure, board certification.
 */

import { motion, useReducedMotion } from "motion/react";

const ITEMS: { v: string; k: string; sr?: string }[] = [
  { v: "4.81★", k: "Zocdoc rating", sr: "4.81 out of 5 stars" },
  { v: "404", k: "Patient reviews" },
  { v: "OSU", k: "Associate Professor of Dermatology" },
  { v: "2010", k: "Serving Columbus since" },
  { v: "ABD", k: "Board-certified dermatology" },
];

export function TrustBar() {
  const prefersReduced = useReducedMotion();
  return (
    <section
      aria-label="Credentials and reputation"
      className="relative border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]/60"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 sm:px-8 md:grid-cols-5">
        {ITEMS.map((it, i) => (
          <motion.div
            key={it.k}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
              delay: prefersReduced ? 0 : i * 0.07,
            }}
            className="flex flex-col items-center gap-1.5 py-7 text-center md:py-9"
          >
            <span className="font-display text-3xl leading-none text-[var(--color-fg)]">
              <span className="sr-only">{it.sr ?? it.v}</span>
              <span aria-hidden>{it.v}</span>
            </span>
            <span className="max-w-[18ch] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              {it.k}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
