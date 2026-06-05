"use client";

/**
 * Reviews — a candy proof wall of regulars' quotes across the bars, plus an
 * aggregate badge. Witty, warm voice that matches the brand. Masonry-ish grid,
 * staggered in. Reduced-motion safe. Sample testimonials, clearly noted.
 */

import { RevealGroup, RevealItem, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Review = {
  quote: string;
  name: string;
  loc: string;
  feature?: boolean;
};

const REVIEWS: Review[] = [
  {
    quote:
      "Finally a place that makes Botox feel fun instead of clinical. I leave looking refreshed and like nobody can tell — which is the whole point.",
    name: "Jenna R.",
    loc: "Maple Grove",
    feature: true,
  },
  {
    quote: "Nurse Liz is an absolute artist. Natural, never overdone.",
    name: "Maria T.",
    loc: "Champlin",
  },
  {
    quote: "The vibe is so welcoming. Booked my mom and sister too.",
    name: "Ashley K.",
    loc: "Maple Grove",
  },
  {
    quote:
      "Tox + Glow Happy Hour is my monthly treat. Easy booking, zero pressure, great results every time.",
    name: "Brooke L.",
    loc: "Champlin",
    feature: true,
  },
  {
    quote: "They explain everything. I never feel upsold — just cared for.",
    name: "Dani P.",
    loc: "Maple Grove",
  },
  {
    quote: "Counting down to the White Bear bar. Already on the waitlist!",
    name: "Sam V.",
    loc: "East Metro",
  },
];

function Stars() {
  return (
    <span aria-hidden className="inline-flex gap-0.5 text-[var(--candy-tangerine)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M10 1.6l2.4 5 5.5.6-4.1 3.7 1.2 5.4L10 13.9 4.9 16.3l1.2-5.4L2 7.2l5.5-.6L10 1.6Z" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section
      id="reviews"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg-subtle)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The regulars"
            title={
              <>
                Loved across <span className="candy-text">all three bars.</span>
              </>
            }
            lead="Real-feeling words from the people who keep rebooking. Sample testimonials for illustration."
          />
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-4 shadow-[var(--glass-shadow)]">
            <span className="font-display text-4xl text-[var(--color-accent-deep)] tnum">5.0</span>
            <div>
              <Stars />
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-fg-muted)]">
                Across 600+ reviews
              </p>
            </div>
          </div>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <RevealItem key={r.name} as="figure">
              <figure
                className={cn(
                  "flex h-full flex-col rounded-[1.4rem] border bg-[var(--color-bg-elevated)] p-6 shadow-[var(--glass-shadow)]",
                  r.feature
                    ? "border-[var(--color-accent)]/30"
                    : "border-[var(--color-border)]",
                )}
              >
                <Stars />
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-[var(--color-fg)]">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-border-subtle)] pt-4">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-sm font-bold text-[var(--color-accent-deep)]"
                  >
                    {r.name.charAt(0)}
                  </span>
                  <span className="text-sm">
                    <span className="font-semibold text-[var(--color-fg)]">{r.name}</span>
                    <span className="block text-xs text-[var(--color-fg-muted)]">{r.loc}</span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
