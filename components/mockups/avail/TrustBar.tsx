"use client";

/**
 * TrustBar — authority band directly under the hero. 4 locations · reviews ·
 * since-founded · the SEO-consolidation promise, set as an engineered metric
 * row over a light surface. Tabular numerics for crisp alignment.
 */

import { Reveal } from "./primitives";

const METRICS = [
  { v: "4", k: "Locations across NC", sub: "Cary · Raleigh · Wake Forest · Asheville" },
  { v: "4.9★", k: "Average patient rating", sub: "Aggregated across every location" },
  { v: "1", k: "Unified brand standard", sub: "One site. One booking. One SEO footprint." },
  { v: "100+", k: "Medical aesthetic services", sub: "Injectables · lasers · body · skin · wellness" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Why Avail Aesthetics"
      className="relative border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
    >
      <div className="ruler-ticks h-1.5 w-full opacity-60" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-14">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.k} delay={i * 0.07}>
              <div className="flex flex-col">
                <dt className="font-display text-4xl font-semibold leading-none tnum text-[var(--color-fg)] sm:text-5xl">
                  {m.v}
                </dt>
                <dd className="mt-3">
                  <span className="block text-sm font-semibold text-[var(--color-fg)]">
                    {m.k}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[var(--color-fg-muted)]">
                    {m.sub}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
