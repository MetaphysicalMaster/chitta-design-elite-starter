"use client";

/**
 * TrustBar — the credential band directly under the hero. Four evidence-led
 * facts set in tabular figures on the paper surface, divided by clinical
 * hairlines. Leads with the rare double board-certification; no star count
 * here — the reputation reframe lives one section down. Reduced-motion safe.
 */

import { RevealGroup, RevealItem } from "./primitives";
import { cn } from "@/lib/utils";

const FACTS = [
  {
    v: "2",
    unit: "Board certifications",
    k: "Dermatology + Dermatopathology",
  },
  { v: "20+", unit: "Years", k: "Caring for Charlotte" },
  { v: "1", unit: "Physician-owner", k: "Independent, not a chain" },
  { v: "3", unit: "Disciplines", k: "Medical · Surgical · Cosmetic" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Credentials at a glance"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
    >
      <RevealGroup
        as="ul"
        className="mx-auto grid max-w-6xl grid-cols-2 px-6 sm:px-8 lg:grid-cols-4"
      >
        {FACTS.map((f, i) => (
          <RevealItem
            as="li"
            key={f.k}
            className={cn(
              "flex flex-col gap-1 px-1 py-8 sm:px-6 sm:py-10",
              // 2-col mobile: right cell gets a left rule; 2nd row gets a top rule.
              i % 2 === 1 && "border-l border-[var(--color-border)]",
              i >= 2 && "border-t border-[var(--color-border)]",
              // 4-col desktop: every cell after the first gets a left rule, no top rules.
              "lg:border-t-0",
              i !== 0 && "lg:border-l lg:border-[var(--color-border)]",
            )}
          >
            <span className="flex items-baseline gap-1.5">
              <span className="font-display text-4xl leading-none text-[var(--color-fg)] tnum sm:text-5xl">
                {f.v}
              </span>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-deep)]">
                {f.unit}
              </span>
            </span>
            <span className="mt-1 text-sm text-[var(--color-fg-muted)]">
              {f.k}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
