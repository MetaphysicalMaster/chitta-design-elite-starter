"use client";

/**
 * Financing — CareCredit / promotions callout. The real site surfaces no
 * financing or promos; this makes aesthetic care feel attainable and is a
 * direct conversion lever for the under-marketed spa side.
 */

import Link from "next/link";
import { Section, Reveal } from "./primitives";

const PERKS = [
  { v: "0% APR", k: "Promotional financing on qualifying treatments via CareCredit." },
  { v: "Members", k: "Spa membership unlocks priority booking and aesthetic pricing." },
  { v: "Seasonal", k: "Rotating promotions on Botox, laser packages and CoolSculpting." },
];

export function Financing() {
  return (
    <Section labelledBy="financing-heading">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--gold-deep)] opacity-25 blur-3xl"
          />
          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
            <div>
              <span className="rule-gold text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]">
                Flexible & attainable
              </span>
              <h2
                id="financing-heading"
                className="mt-4 font-display text-balance text-[var(--color-fg)]"
                style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.08 }}
              >
                Beautiful skin, on{" "}
                <span className="italic">your terms.</span>
              </h2>
              <p className="mt-5 max-w-[42ch] font-light leading-relaxed text-[var(--color-fg-muted)]">
                Spread the cost of aesthetic care with promotional financing, or
                join The Spa membership for members-only pricing. We&rsquo;ll
                help you find a plan that fits.
              </p>
              <Link
                href="#book"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-fg)] shadow-[0_14px_36px_-14px_oklch(82%_0.1_84_/_0.6)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              >
                Ask about financing
                <span aria-hidden>→</span>
              </Link>
            </div>

            <dl className="grid gap-3">
              {PERKS.map((p) => (
                <div
                  key={p.v}
                  className="flex items-baseline gap-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]/60 p-5"
                >
                  <dt className="font-display text-xl text-[var(--gold)] whitespace-nowrap">
                    {p.v}
                  </dt>
                  <dd className="text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
                    {p.k}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
