"use client";

/**
 * Reviews — the proof wall. A calm masonry-ish grid of sample patient
 * testimonials with star ratings, plus an aggregate trust strip. Grounded,
 * balanced typography. Sample content, clearly framed. Reduced-motion safe.
 */

import { SectionHeading, RevealGroup, RevealItem } from "./primitives";

type Review = {
  quote: string;
  name: string;
  metro: string;
  service: string;
};

const REVIEWS: Review[] = [
  {
    quote:
      "Lenae and her team actually listened. My results look like me — just rested and balanced. Nothing overdone.",
    name: "Megan R.",
    metro: "Lee's Summit",
    service: "Tox + filler",
  },
  {
    quote:
      "The weight-loss program changed everything. Real medical guidance, real follow-up — not a gimmick.",
    name: "David K.",
    metro: "Overland Park",
    service: "Medical weight-loss",
  },
  {
    quote:
      "Finally one place for beauty and wellness. I book both visits in the same flow now. So easy.",
    name: "Priya S.",
    metro: "Overland Park",
    service: "Wellness + IV",
  },
  {
    quote:
      "RN and NP-owned was the whole reason I trusted them. You feel the clinical care the moment you walk in.",
    name: "Allison T.",
    metro: "Lee's Summit",
    service: "Lip enhancement",
  },
  {
    quote:
      "Calm, grounded, never pushy. They talked me out of more than I expected — and I love the result.",
    name: "Jordan M.",
    metro: "Lee's Summit",
    service: "Skin + tox",
  },
  {
    quote:
      "Two locations, same incredible standard. I've been to both and it feels like one home.",
    name: "Brittany L.",
    metro: "Overland Park",
    service: "Dermal filler",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="var(--terra)" aria-hidden>
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4 6.1 20.4l1.1-6.47L2.5 9.35l6.5-.95L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section
      id="reviews"
      className="scroll-mt-20 bg-[var(--color-bg-subtle)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The proof wall"
            title={
              <>
                Loved across{" "}
                <span className="balance-text">both metros.</span>
              </>
            }
            lead="Real care earns real loyalty. A sample of what patients say across Lee's Summit and Overland Park."
          />
          <div className="flex shrink-0 items-center gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-4">
            <div className="flex flex-col">
              <span className="font-display text-3xl font-semibold text-[var(--color-fg)] tnum">
                4.9
              </span>
              <Stars />
            </div>
            <p className="max-w-[10rem] text-xs text-[var(--color-fg-muted)]">
              Aggregate across both metros. Sample rating for illustration.
            </p>
          </div>
        </div>

        <RevealGroup
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {REVIEWS.map((r) => (
            <RevealItem as="figure" key={r.name}>
              <blockquote className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--glass-shadow)]">
                <Stars />
                <p className="mt-4 flex-1 text-pretty text-[var(--color-fg)]">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <figcaption className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                  <span className="text-sm font-semibold text-[var(--color-fg)]">
                    {r.name}
                  </span>
                  <span className="text-xs text-[var(--color-fg-subtle)]">
                    {r.service} · {r.metro}
                  </span>
                </figcaption>
              </blockquote>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
