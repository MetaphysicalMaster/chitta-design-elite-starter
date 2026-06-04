"use client";

/**
 * TrustBar — slim proof band beneath the hero. 4.9★ / reviews / physician-led
 * / location / est. Marquee-free, calm, gold-hairline framed.
 */

import { RevealGroup, RevealItem } from "./primitives";

const STATS = [
  { v: "4.9★", k: "Google rating" },
  { v: "≈122", k: "Five-star reviews" },
  { v: "MD", k: "Physician-led care" },
  { v: "Upper Arlington", k: "3025 Northwest Blvd" },
  { v: "Est. 2023", k: "Columbus, Ohio" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Reputation and credentials"
      className="relative border-y border-[var(--color-border-subtle)] bg-[var(--emerald-abyss)]"
    >
      <div className="hairline-gold absolute inset-x-0 top-0" aria-hidden />
      <RevealGroup
        as="ul"
        stagger={0.07}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-6 py-10 sm:px-8 md:grid-cols-5 md:gap-y-0"
      >
        {STATS.map((s) => (
          <RevealItem
            key={s.k}
            as="li"
            className="flex flex-col items-center text-center md:border-r md:border-[var(--color-border-subtle)] md:last:border-r-0"
          >
            <span className="font-display text-2xl leading-none text-[var(--gold)] sm:text-3xl">
              {s.v}
            </span>
            <span className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              {s.k}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
