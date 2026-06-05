"use client";

/**
 * Reviews — the proof wall. A masonry-ish set of couture review cards plus a
 * rating summary band. Establishes the "5-star reputation" pillar with real
 * voice. Sample reviews representative of a 29-year River Oaks clientele.
 */

import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./primitives";

type Review = {
  quote: string;
  name: string;
  meta: string;
  span?: boolean;
};

const REVIEWS: Review[] = [
  {
    quote:
      "I have followed Sousan from her first little room. Twenty years later, my skin still answers to no one else. This is River Oaks' best-kept secret — except it isn't a secret.",
    name: "Margaret L.",
    meta: "Client since 2003 · River Oaks",
    span: true,
  },
  {
    quote:
      "The HydraFacial here is in another league. I leave glowing for a week.",
    name: "Priya S.",
    meta: "HydraFacial MD",
  },
  {
    quote:
      "Natural, never overdone. Sousan has an eye you simply cannot teach.",
    name: "Caroline V.",
    meta: "Injectables",
  },
  {
    quote:
      "My IPL results cleared years of Houston sun damage. I finally went makeup-free.",
    name: "Deborah K.",
    meta: "IPL Photofacial",
  },
  {
    quote:
      "Discreet, immaculate, and the only place I trust with my face. Worth every minute of the drive.",
    name: "Anne-Marie T.",
    meta: "Client since 2011",
    span: true,
  },
];

function Stars({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={label ?? "5 out of 5 stars"}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} aria-hidden className="text-[var(--gold-mid)]">
          ★
        </span>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section
      id="reviews"
      className="relative bg-[var(--color-bg-subtle)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title={
            <>
              The corridor{" "}
              <span className="font-display-em">talks.</span>
            </>
          }
          lead="A reputation built one referral at a time — the way River Oaks has always chosen its names."
        />

        {/* rating summary band */}
        <Reveal delay={0.08} className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-5 text-center shadow-[0_1px_0_oklch(100%_0_0/0.6)]">
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl text-[var(--color-fg)] tnum">
                5.0
              </span>
              <Stars />
            </div>
            <span aria-hidden className="hidden h-6 w-px bg-[var(--color-hairline)] sm:block" />
            <p className="text-sm text-[var(--color-fg-muted)]">
              <span className="font-medium text-[var(--color-fg)] tnum">
                400+
              </span>{" "}
              five-star reviews across Google &amp; the corridor
            </p>
            <span aria-hidden className="hidden h-6 w-px bg-[var(--color-hairline)] sm:block" />
            <p className="text-sm text-[var(--color-fg-muted)]">
              Trusted since{" "}
              <span className="font-medium text-[var(--color-fg)] tnum">
                1995
              </span>
            </p>
          </div>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {REVIEWS.map((r) => (
            <RevealItem
              as="li"
              key={r.name}
              className={r.span ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <figure className="flex h-full flex-col rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_1px_0_oklch(100%_0_0/0.6)]">
                <Stars />
                <blockquote className="mt-3 flex-1 text-pretty font-display text-[1.05rem] leading-relaxed text-[var(--color-fg)]">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 border-t border-[var(--color-border)] pt-4">
                  <span className="font-medium text-[var(--color-fg)]">
                    {r.name}
                  </span>
                  <span className="mt-0.5 block text-[0.8rem] text-[var(--color-fg-subtle)]">
                    {r.meta}
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
