"use client";

/**
 * TrustBar — a quiet hairline band of proof points directly under the hero.
 * No logos to license; refined type + fine vertical rules. Reads as a calm
 * statement of standing, not a busy badge wall (quiet-luxury restraint).
 */

import { Reveal } from "./primitives";

// Proof points are deliberately diversified — the Allergan & Galderma award is
// reserved for ONE hero-grade placement (the Locations badge) so it stays a
// scarce, prestigious signal rather than a repeated one. Here the band leads on
// reviews, volume, tenure and footprint. "sample" tags stay until real figures
// are supplied at handoff.
const POINTS = [
  { v: "4.9 ★", k: "300+ Google reviews · sample" },
  { v: "10,000+", k: "Treatments delivered · sample" },
  { v: "12+ yrs", k: "In aesthetics · sample" },
  { v: "Fishers + Carmel", k: "Two Indy-metro locations" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Credentials and standing"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <dl className="grid grid-cols-2 divide-x divide-[var(--color-border)] md:grid-cols-4">
            {POINTS.map((p) => (
              <div
                key={p.k}
                className="flex flex-col items-center px-4 py-7 text-center sm:py-9"
              >
                <dt className="font-display text-xl tnum text-[var(--color-fg)] sm:text-2xl">
                  {p.v}
                </dt>
                <dd className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                  {p.k}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
