"use client";

/**
 * TrustBar — authority band directly under the hero. #1 volume · reviews ·
 * 2 MDs + multiple injectors · Allergan-trainer-led — set as an altitude metric
 * row over a bright surface. Tabular numerics for crisp alignment.
 */

import { Reveal } from "./primitives";

const METRICS = [
  { v: "#1", k: "Botox & Juvéderm volume", sub: "Colorado's highest-volume injectable clinic" },
  { v: "4.9★", k: "Patient rating", sub: "Aggregated across hundreds of Denver reviews" },
  { v: "2 MDs", k: "+ multiple injectors", sub: "Physician-led, expert-injector team" },
  { v: "Allergan", k: "National trainer-led", sub: "Dr. Nguyen trains injectors nationwide" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Why Happy Clinic Denver"
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
