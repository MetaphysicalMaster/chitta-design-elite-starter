"use client";

/**
 * TrustBar — a slim candy band of proof points directly under the hero: three
 * locations, the reviews, the years, woman-owned. Quick credibility before the
 * scroll deepens. Reduced-motion safe via the shared Reveal.
 */

import { Reveal } from "./primitives";

const ITEMS = [
  { v: "3", k: "Twin Cities bars" },
  { v: "5.0★", k: "Regulars who rebook" },
  { v: "2018", k: "Pouring tox since" },
  { v: "100%", k: "Woman-owned" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Beautox Bar at a glance"
      className="relative z-10 border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-2 sm:px-8 md:grid-cols-4">
        {ITEMS.map((it, i) => (
          <Reveal
            key={it.k}
            delay={i * 0.06}
            className="flex flex-col items-center gap-0.5 px-3 py-5 text-center"
          >
            <span className="font-display text-2xl leading-none text-[var(--color-accent-deep)] tnum sm:text-3xl">
              {it.v}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-fg-muted)]">
              {it.k}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
