"use client";

/**
 * TrustBar — the quiet authority band directly under the hero. Three pillars
 * (29 years · River Oaks · 5-star reputation) on a marble strip with gold
 * hairline dividers. Establishes credibility before any scroll.
 */

import { RevealGroup, RevealItem } from "./primitives";

const PILLARS = [
  {
    v: "29 years",
    k: "A River Oaks institution since 1995",
  },
  {
    v: "River Oaks",
    k: "Houston's premier beauty corridor",
  },
  {
    v: "5-star",
    k: "Reputation earned, not advertised",
  },
];

export function TrustBar() {
  return (
    <section
      aria-label="Why River Oaks trusts Sousan"
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
