"use client";

/**
 * ProofWall — review/proof wall. A grid of Denver patient reviews plus a
 * leadership credibility band (Dr. Phil Nguyen + the two-MD, multi-injector
 * team) reinforcing the trainer-led authority story.
 */

import { SectionHeading, Reveal, BrandImage } from "./primitives";

type Review = {
  quote: string;
  name: string;
  area: string;
  treatment: string;
};

const REVIEWS: Review[] = [
  {
    quote:
      "I drove past three closer clinics for Dr. Nguyen. If he's the one teaching everyone else, why would I go anywhere else? My results are flawless and natural.",
    name: "Marisa K.",
    area: "Cherry Creek",
    treatment: "Botox & lip filler",
  },
  {
    quote:
      "Booked online in under a minute. The team is genuinely the best in Denver — precise, unhurried, and the building feels like a real medical practice, not a strip-mall spa.",
    name: "Jordan P.",
    area: "Aurora",
    treatment: "Juvéderm cheeks",
  },
  {
    quote:
      "I'm an esthetician and I send my own clients here. The fact that Allergan trusts him to train injectors says everything you need to know.",
    name: "Bianca R.",
    area: "DTC",
    treatment: "Botox",
  },
  {
    quote:
      "Two MDs on site meant I felt safe the whole time. The laser results on my skin tone were exactly what they mapped out at consult.",
    name: "Hannah W.",
    area: "Centennial",
    treatment: "Laser & skin",
  },
  {
    quote:
      "Natural, never frozen. You can tell the difference when the person holding the needle is the one who wrote the technique.",
    name: "Devon S.",
    area: "Lakewood",
    treatment: "Botox & Juvéderm",
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
              4.9★ across Denver —{" "}
              <span className="text-[var(--color-accent-deep)]">and the pros agree</span>.
            </>
          }
          lead="Aggregated patient reviews — including the injectors and estheticians who send us their own clients."
        />

        {/* Leadership credibility band */}
        <Reveal className="mt-12">
          <div className="grid grid-cols-1 gap-6 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
            <div className="flex items-center gap-4">
              <BrandImage aspect="1 / 1" radius="full" sample={false} night className="h-20 w-20 shrink-0" />
              <BrandImage aspect="1 / 1" radius="full" sample={false} className="-ml-8 h-20 w-20 shrink-0" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-deep)]">
                Physician leadership
              </p>
              <p className="mt-2 text-pretty text-[var(--color-fg)]">
                <span className="font-semibold">Dr. Phil Hong Nguyen, MD</span>,
                owner & Allergan national trainer, leads a{" "}
                <span className="font-semibold">two-MD</span> practice with multiple
                expert injectors — building Colorado&rsquo;s #1 injectable clinic
                on a single, physician-supervised standard.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Review grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name + r.area} delay={i * 0.05}>
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
                    {r.area} · {r.treatment}
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
