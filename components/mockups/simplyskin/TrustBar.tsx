"use client";

/**
 * TrustBar — a quiet hairline band of proof points directly under the hero.
 * No logos to license; refined type + fine vertical rules. Reads as a calm
 * statement of standing, not a busy badge wall (quiet-luxury restraint).
 */

import { Reveal } from "./primitives";

const POINTS = [
  { v: "Top 1%", k: "US Allergan" },
  { v: "Top 10", k: "Injector in Indiana" },
  { v: "20 years", k: "Of injectable artistry" },
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
