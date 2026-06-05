"use client";

/**
 * ProofWall — review/proof wall. A masonry-ish grid of patient reviews with
 * per-location attribution (reinforcing the one-brand-four-homes story) plus a
 * leadership credibility band (Stephen Rhodes + Dr. Nathan Davis).
 */

import { SectionHeading, Reveal, BrandImage } from "./primitives";

type Review = {
  quote: string;
  name: string;
  location: string;
  treatment: string;
};

const REVIEWS: Review[] = [
  {
    quote:
      "Booked online in under a minute, walked into the Cary office, and the result is exactly what we mapped out. This is what a real brand feels like.",
    name: "Megan R.",
    location: "Cary",
    treatment: "Botox & filler",
  },
  {
    quote:
      "I've been to three of their locations and the standard is identical every time. Same team energy, same quality. Rare.",
    name: "Priya S.",
    location: "Raleigh",
    treatment: "Laser & skin",
  },
  {
    quote:
      "The Asheville studio is gorgeous and the staff actually listened. My Morpheus8 results speak for themselves.",
    name: "Dana L.",
    location: "Asheville",
    treatment: "Morpheus8",
  },
  {
    quote:
      "Wake Forest is close to home and the body contouring program got me real, measurable results. Financing made it easy.",
    name: "Chris T.",
    location: "Wake Forest",
    treatment: "EmSculpt NEO",
  },
  {
    quote:
      "Professional, precise, and never pushy. You can tell there's leadership that cares about the patient experience at every level.",
    name: "Alyssa M.",
    location: "Cary",
    treatment: "HydraFacial",
  },
];

function Stars() {
  return (
    <span className="flex gap-0.5 text-[var(--color-accent)]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="m10 1.6 2.5 5.1 5.6.8-4 4 .9 5.6L10 14.5 4.9 17.1l1-5.6-4-4 5.5-.8z" />
        </svg>
      ))}
    </span>
  );
}

export function ProofWall() {
  return (
    <section
      id="proof"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The proof"
          title={
            <>
              4.9★ — and it&rsquo;s the <span className="text-[var(--color-accent-deep)]">same score everywhere</span>.
            </>
          }
          lead="Aggregated patient reviews across all four locations. Consistency is the whole point."
        />

        {/* Leadership credibility band */}
        <Reveal className="mt-12">
          <div className="grid grid-cols-1 gap-6 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
            <div className="flex items-center gap-4">
              <BrandImage aspect="1 / 1" radius="full" sample={false} className="h-20 w-20 shrink-0" cool />
              <BrandImage aspect="1 / 1" radius="full" sample={false} className="-ml-8 h-20 w-20 shrink-0" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-deep)]">
                Leadership
              </p>
              <p className="mt-2 text-pretty text-[var(--color-fg)]">
                <span className="font-semibold">Stephen Rhodes</span>, CEO
                (former NASCAR driver, marketing-minded operator) and{" "}
                <span className="font-semibold">Dr. Nathan Davis</span>,
                co-owner & medical director — building a med-spa brand engineered
                to scale without losing the standard.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Review grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name + r.location} delay={i * 0.05}>
              <figure className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--glass-shadow)]">
                <Stars />
                <blockquote className="mt-3 flex-1 text-pretty text-[var(--color-fg)]">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-4">
                  <span className="text-sm font-semibold text-[var(--color-fg)]">
                    {r.name}
                  </span>
                  <span className="rounded-full bg-[var(--color-accent-subtle)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-[var(--color-accent-deep)]">
                    {r.location} · {r.treatment}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
