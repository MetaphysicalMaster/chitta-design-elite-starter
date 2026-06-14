"use client";

/**
 * TrustBar — a thin marquee-feel band of credibility signals just below the
 * hero. Static, semantic, AA-contrast on the warm ivory surface.
 */

import { RevealGroup, RevealItem } from "./primitives";

const ITEMS = [
  { v: "4.9★", k: "Google rating" },
  { v: "280+", k: "5-star reviews" },
  { v: "Judgment-free", k: "Every visit" },
  { v: "2017", k: "Established" },
  { v: "Inclusive", k: "By design" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Reputation and credentials"
      className="relative border-y border-[var(--color-border)] bg-[var(--color-border-subtle)]"
    >
      <RevealGroup
        as="ul"
        stagger={0.06}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5"
      >
        {ITEMS.map((it) => (
          <RevealItem
            key={it.k}
            as="li"
            className="flex flex-col items-center justify-center gap-1 bg-[var(--color-bg-elevated)] px-4 py-7 text-center"
          >
            <span className="font-display text-3xl leading-none text-[var(--color-fg)] sm:text-4xl">
              {it.v}
            </span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              {it.k}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
