"use client";

/**
 * TrustBar — the grounding credibility strip directly under the hero.
 * 18 years · 221 reviews · 4.6★ · Olive Blvd corridor. A calm, marquee-free
 * band of proof points separated by hairline chrome rules. Reduced-motion safe.
 */

import { RevealGroup, RevealItem } from "./primitives";
import { BRAND } from "./nap";

const POINTS = [
  { v: `${BRAND.years} years`, k: "Enduring St. Louis practice" },
  { v: `${BRAND.reviews} reviews`, k: "Patient-rated reputation" },
  { v: `${BRAND.rating}★`, k: "Average across all reviews" },
  { v: "Creve Coeur", k: "Olive Blvd corridor" },
];

export function TrustBar() {
  return (
    <section
      aria-label={`Why patients trust ${BRAND.name}`}
      className="border-y border-[var(--color-border)] bg-[var(--night-1)]"
    >
      <RevealGroup
        as="ul"
        className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-6 py-10 sm:px-8 lg:grid-cols-4 lg:py-12"
      >
        {POINTS.map((p) => (
          <RevealItem as="li" key={p.v} className="flex flex-col items-start">
            <span className="font-display text-xl font-semibold text-[var(--color-fg)] tnum sm:text-2xl">
              {p.v}
            </span>
            <span className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-fg-muted)]">
              {p.k}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
