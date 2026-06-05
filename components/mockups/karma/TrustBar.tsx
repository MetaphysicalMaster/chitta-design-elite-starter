"use client";

/**
 * TrustBar — the grounding credibility strip directly under the hero.
 * RN/NP-owned · 15+ years · two metros · injectables + wellness. A calm,
 * marquee-free band of proof points with the orbit motif as separators.
 */

import { RevealGroup, RevealItem } from "./primitives";

const POINTS = [
  { v: "RN & NP-owned", k: "Board-certified leadership" },
  { v: "15+ years", k: "Trusted across the KC metro" },
  { v: "Two metros", k: "Lee's Summit · Overland Park" },
  { v: "Beauty + wellness", k: "Injectables meets whole-body care" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Why patients trust Karma"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
    >
      <RevealGroup
        as="ul"
        className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-6 py-10 sm:px-8 lg:grid-cols-4 lg:py-12"
      >
        {POINTS.map((p) => (
          <RevealItem as="li" key={p.v} className="flex flex-col items-start">
            <span className="font-display text-xl font-semibold text-[var(--color-fg)] sm:text-2xl">
              {p.v}
            </span>
            <span className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
              {p.k}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
