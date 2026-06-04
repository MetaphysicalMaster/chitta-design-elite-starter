"use client";

/**
 * Testimonials — couture review wall. Three featured quotes that echo the
 * 4.9★ / ~122-review reputation, on smoked-glass cards with gold marks.
 */

import { SectionHeading, RevealGroup, RevealItem } from "./primitives";

const REVIEWS = [
  {
    quote:
      "The most beautiful med spa I've stepped into in Columbus — and the results match. Dr. Sanchez's team is meticulous, warm and never rushed.",
    name: "Marisa K.",
    detail: "Botox & Morpheus8",
  },
  {
    quote:
      "Finally, a place that tells you the price up front and books you in seconds. My jawline after Morpheus8 is unreal. Worth every penny.",
    name: "Danielle R.",
    detail: "Morpheus8 · 3 sessions",
  },
  {
    quote:
      "From the champagne welcome to the follow-up text, it feels like a luxury house. Natural, refreshed, never overdone. My forever spot.",
    name: "Priya S.",
    detail: "Filler & BBL HERO",
  },
];

export function Testimonials() {
  return (
    <section
      aria-label="Patient testimonials"
      className="grain relative overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="In Their Words"
          title={
            <>
              Loved by Columbus.{" "}
              <span className="gold-leaf italic">Rated 4.9★.</span>
            </>
          }
          lead="A snapshot of the ~122 five-star reviews that built The Luxe's reputation."
        />

        <RevealGroup
          as="ul"
          stagger={0.1}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {REVIEWS.map((r) => (
            <RevealItem
              key={r.name}
              as="li"
              className="flex flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-7 transition-colors duration-300 hover:bg-[var(--color-bg-elevated)]"
            >
              <div aria-hidden className="text-[var(--gold)]">
                {"★★★★★"}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty text-[1.02rem] font-light leading-relaxed text-[var(--color-fg)]">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-4">
                <span className="font-display text-base text-[var(--color-fg)]">
                  {r.name}
                </span>
                <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  {r.detail}
                </span>
              </figcaption>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 text-center text-xs text-[var(--color-fg-subtle)]">
          Reviews shown are representative samples for this design mockup.
        </p>
      </div>
    </section>
  );
}
