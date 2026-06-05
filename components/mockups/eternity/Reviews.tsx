"use client";

/**
 * Reviews — the proof wall. A calm grid of sample patient testimonials with
 * star ratings, plus an aggregate trust strip pinned to the real brand stats
 * (221 reviews · 4.6★). Refined noir-luxe typography. Sample quote content,
 * clearly framed. Reduced-motion safe.
 */

import { SectionHeading, RevealGroup, RevealItem } from "./primitives";
import { BRAND } from "./nap";

type Review = {
  quote: string;
  name: string;
  service: string;
  years: string;
};

const REVIEWS: Review[] = [
  {
    quote:
      "Michelle has done my tox for years and it always looks like me — just rested. Eighteen years of skill shows in every visit.",
    name: "Karen W.",
    service: "Tox + filler",
    years: "Patient · 6 yrs",
  },
  {
    quote:
      "Finally I can book online instead of playing phone tag on my lunch break. The new site is gorgeous and so easy.",
    name: "Danielle P.",
    service: "Medical facial",
    years: "Patient · 2 yrs",
  },
  {
    quote:
      "Natural, never overfilled. They talked me out of more than I asked for, and my lips look perfect. That's trust.",
    name: "Sofia R.",
    service: "Lip enhancement",
    years: "Patient · 3 yrs",
  },
  {
    quote:
      "The body contouring results held far longer than I expected. This is a practice that actually cares about lasting results.",
    name: "Monica L.",
    service: "Body contouring",
    years: "Patient · 4 yrs",
  },
  {
    quote:
      "Creve Coeur's best-kept secret. Calm, clean, expert. I drive across St. Louis for Michelle and it's worth every mile.",
    name: "Jessica T.",
    service: "Microneedling",
    years: "Patient · 5 yrs",
  },
  {
    quote:
      "Eighteen years in business says everything. You feel the experience the moment you sit in the chair.",
    name: "Amanda H.",
    service: "Laser resurfacing",
    years: "Patient · 1 yr",
  },
];

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={i < count ? "var(--color-accent-bright)" : "var(--color-border)"}
          aria-hidden
        >
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
      className="scroll-mt-20 bg-[var(--night-1)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The proof wall"
            title={
              <>
                Loved across{" "}
                <span className="silver-text">St. Louis.</span>
              </>
            }
            lead="Real mastery earns real loyalty. A sample of what patients say across eighteen years on Olive Blvd."
          />
          <div className="flex shrink-0 items-center gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--night-2)] px-6 py-4">
            <div className="flex flex-col">
              <span className="font-display text-3xl font-semibold text-[var(--color-fg)] tnum">
                {BRAND.rating}
              </span>
              <Stars count={5} />
            </div>
            <p className="max-w-[11rem] text-xs text-[var(--color-fg-muted)]">
              Average across{" "}
              <span className="font-semibold text-[var(--color-fg)] tnum">
                {BRAND.reviews}
              </span>{" "}
              patient reviews.
            </p>
          </div>
        </div>

        <RevealGroup
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {REVIEWS.map((r) => (
            <RevealItem as="figure" key={r.name}>
              <blockquote className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--night-2)] p-6 shadow-[var(--glass-shadow)]">
                <Stars count={5} />
                <p className="mt-4 flex-1 text-pretty text-[var(--color-fg)]">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <figcaption className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                  <span className="text-sm font-semibold text-[var(--color-fg)]">
                    {r.name}
                  </span>
                  <span className="text-xs text-[var(--color-fg-subtle)]">
                    {r.service} · {r.years}
                  </span>
                </figcaption>
              </blockquote>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 text-center text-xs text-[var(--color-fg-subtle)]">
          Aggregate rating reflects {BRAND.name}&rsquo;s real {BRAND.reviews}{" "}
          reviews at {BRAND.rating}★. Individual quotes are sample content for
          this mockup.
        </p>
      </div>
    </section>
  );
}
