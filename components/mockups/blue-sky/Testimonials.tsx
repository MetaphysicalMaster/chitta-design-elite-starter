"use client";

/**
 * Testimonials — social proof reinforcing the 5.0★ Google reputation.
 * Quotes are representative/sample for the mockup.
 */

import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./Reveal";

const QUOTES = [
  {
    quote:
      "Quite the little hidden gem. Dr. Manning actually listened — I wanted to look refreshed, not done, and that's exactly what I got. The whole place feels calm and genuinely medical.",
    name: "Allison R.",
    meta: "Botox & filler",
  },
  {
    quote:
      "They go above and beyond on both the beauty and the wellness side. Knowing a physician oversees everything made all the difference, and the space is so relaxing I never want to leave.",
    name: "Megan T.",
    meta: "Microneedling + PRP",
  },
  {
    quote:
      "I've been to the bigger chains and nothing compares. It's personal, it's expert, and the membership pays for itself. Five stars truly isn't enough.",
    name: "Priya K.",
    meta: "Next Level Beauty member",
  },
];

function Stars() {
  return (
    <span aria-label="5 out of 5 stars" className="text-[var(--gold)]" role="img">
      ★★★★★
    </span>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="relative scroll-mt-24 bg-[var(--color-bg-subtle)] py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Loved in German Village"
            title={
              <>
                A perfect 5.0,
                <span className="italic"> review after review.</span>
              </>
            }
          />
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4">
            <span className="font-display text-4xl leading-none text-[var(--color-fg)]">5.0</span>
            <span className="flex flex-col">
              <Stars />
              <span className="mt-1 text-xs text-[var(--color-fg-muted)]">Across Google reviews</span>
            </span>
          </div>
        </div>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.08}>
          {QUOTES.map((q) => (
            <RevealItem key={q.name}>
              <figure className="flex h-full flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7">
                <Stars />
                <blockquote className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-[var(--color-fg)]">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-border-subtle)] pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-accent-subtle)] font-display text-sm text-accent-deep">
                    {q.name.charAt(0)}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--color-fg)]">{q.name}</span>
                    <span className="text-xs text-[var(--color-fg-muted)]">{q.meta}</span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-6 text-xs text-[var(--color-fg-subtle)]">Representative reviews shown for mockup purposes.</p>
      </div>
    </section>
  );
}
