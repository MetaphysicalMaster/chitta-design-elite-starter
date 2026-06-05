"use client";

/**
 * TrustBar — a recognition + reassurance band directly under the hero. The hero
 * already owns the four headline numbers (4.9★ / 10+ yrs / two MDs / location),
 * so this strip does NOT repeat them. Instead it carries license-safe trust
 * signals — training affiliations + the practice's no-pressure promise — to
 * shortcut the high-ticket trust curve without a fabricated logo wall.
 * Every specific claim is tagged "sample" and trivially swapped for the
 * client's real credentials.
 */

import { Reveal } from "./primitives";

const POINTS = [
  { v: "Allergan & Galderma", k: "Trained on the brands you know · sample" },
  { v: "Physician-placed", k: "Every treatment, by an MD" },
  { v: "No hard sell", k: "A plan for you, never a quota" },
  { v: "Real reviews", k: "Hundreds across Google · sample" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Recognition and patient promise"
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
                <dt className="font-display text-lg text-[var(--color-fg)] sm:text-xl">
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
