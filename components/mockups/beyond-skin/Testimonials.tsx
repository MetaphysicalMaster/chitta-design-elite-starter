"use client";

/**
 * Testimonials — editorial quote cards. Reflects the 4.9★ / 281-review
 * reputation. Sample copy clearly attributed as illustrative.
 */

import { RevealGroup, RevealItem, SectionHeading } from "./primitives";

const QUOTES = [
  {
    quote:
      "The most natural results I've ever had — Dr. Mulumba has a real artist's eye. The new space feels like a luxury retreat.",
    name: "Renee K.",
    meta: "Member · Injectables",
  },
  {
    quote:
      "Booking, shopping my skincare, and my membership credit all in one place now. It finally feels like one seamless brand.",
    name: "Alyssa T.",
    meta: "Member · 2 years",
  },
  {
    quote:
      "Walked in nervous, walked out glowing. The team educates you instead of upselling. Worth every mile of the drive.",
    name: "Marcus D.",
    meta: "RF Microneedling",
  },
];

export function Testimonials() {
  return (
    <section
      aria-label="Client testimonials"
      className="relative bg-[var(--color-bg)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="In Their Words"
          title={
            <>
              4.9★ across 281 reviews —{" "}
              <span className="text-molten italic">and counting.</span>
            </>
          }
        />

        <RevealGroup
          stagger={0.09}
          className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {QUOTES.map((q) => (
            <RevealItem key={q.name}>
              <figure className="flex h-full flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7 shadow-[var(--glass-shadow)]">
                <div aria-hidden className="mb-4 text-[var(--gold)]">
                  {"★★★★★"}
                </div>
                <blockquote className="flex-1 text-pretty text-[1.02rem] leading-relaxed text-[var(--color-fg)]">
                  <span className="font-display text-3xl leading-none text-[var(--gold-deep)]">
                    &ldquo;
                  </span>
                  {q.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-[var(--color-border-subtle)] pt-4">
                  <span className="font-semibold text-[var(--color-fg)]">{q.name}</span>
                  <span className="ml-2 text-sm text-[var(--color-fg-subtle)]">
                    {q.meta}
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-8 text-center text-xs text-[var(--color-fg-subtle)]">
          Sample testimonials · illustrative of public 4.9★ Google reputation.
        </p>
      </div>
    </section>
  );
}
