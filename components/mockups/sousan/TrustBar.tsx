"use client";

/**
 * TrustBar — the quiet authority band under the awards strip. Three pillars
 * (Houston · medical-grade · 5-star) on a clean white strip with hot-pink
 * hairline dividers. Establishes credibility before the deeper scroll.
 */

import { RevealGroup, RevealItem } from "./primitives";

const PILLARS = [
  {
    v: "Houston, TX",
    k: "Your neighborhood beauty destination",
  },
  {
    v: "Medical-grade",
    k: "IPL, HydraFacial MD & advanced facials",
  },
  {
    v: "5-star",
    k: "Loved for natural, transformative results",
  },
];

export function TrustBar() {
  return (
    <section
      aria-label="Why Houston trusts Sousan"
      className="relative border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
    >
      <RevealGroup
        as="ul"
        className="mx-auto grid max-w-6xl grid-cols-1 gap-px px-6 py-10 sm:grid-cols-3 sm:px-8"
      >
        {PILLARS.map((p, i) => (
          <RevealItem
            as="li"
            key={p.v}
            className={
              "flex flex-col items-center px-6 text-center " +
              (i < PILLARS.length - 1
                ? "sm:border-r sm:border-[var(--color-hairline)]"
                : "")
            }
          >
            <span className="font-display text-2xl leading-none text-[var(--color-fg)] tnum">
              {p.v}
            </span>
            <span className="mt-2 max-w-[28ch] text-sm text-[var(--color-fg-muted)]">
              {p.k}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
