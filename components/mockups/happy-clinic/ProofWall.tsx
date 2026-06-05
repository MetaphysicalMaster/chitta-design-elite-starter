"use client";

/**
 * ProofWall — review/proof wall. A grid of representative patient reviews plus a
 * credibility band built around the REAL brand: Dr. Phil Hong Nguyen, MD — a
 * single physician with 25 years of cosmetic-injection experience, the "Subtle
 * is The New WOW" philosophy, and honest, transparent $9/unit Botox.
 *
 * NOTE: this component is currently DORMANT (not mounted in page.tsx; the live
 * reviews surface is SplitFlapBoard). It is kept here only as an alternate
 * review layout and is intentionally written to the real, single-physician
 * brand — it must NEVER carry trainer/two-MD/"#1 clinic" claims. Reviews are
 * representative samples (marked beneath the section).
 */

import { SectionHeading, Reveal } from "./primitives";

type Review = {
  quote: string;
  name: string;
  treatment: string;
};

const REVIEWS: Review[] = [
  {
    quote:
      "Dr. Phil's Botox is so natural my friends just kept asking if I'd been on vacation. Nobody could tell I'd had anything done.",
    name: "Marisa K.",
    treatment: "Botox",
  },
  {
    quote:
      "Booked online in under a minute. Dr. Phil is precise and unhurried, and the clinic feels like a real medical practice, not a strip-mall spa.",
    name: "Jordan P.",
    treatment: "Juvéderm cheeks",
  },
  {
    quote:
      "Twenty-five years of experience really shows. Honest pricing, no upsell — and a result that looks like me, only refreshed.",
    name: "Bianca R.",
    treatment: "Botox & lip filler",
  },
  {
    quote:
      "Physician-administered start to finish. I felt safe and informed the whole time, and the result was exactly what we mapped out at consult.",
    name: "Hannah W.",
    treatment: "Filler & skin",
  },
  {
    quote:
      "Natural, never frozen. You can tell the difference when the person holding the needle has been doing this for decades.",
    name: "Devon S.",
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
              Loved across Denver —{" "}
              <span className="text-[var(--color-accent-deep)]">subtle, natural results</span>.
            </>
          }
          lead="Representative patient reviews for the work Happy Clinic is known for: refined, physician-administered results that look like you, only refreshed."
        />

        {/* Physician credibility band — the REAL single-physician brand. */}
        <Reveal className="mt-12">
          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-deep)]">
              Physician-led care
            </p>
            <p className="mt-2 text-pretty text-[var(--color-fg)]">
              Every treatment at Happy Clinic is administered by{" "}
              <span className="font-semibold">Dr. Phil Hong Nguyen, MD</span> —
              25 years of cosmetic-injection experience, the{" "}
              <span className="font-semibold">&ldquo;Subtle is The New WOW&rdquo;</span>{" "}
              philosophy, and honest, transparent{" "}
              <span className="font-semibold tnum">$9/unit</span> Botox.
            </p>
          </div>
        </Reveal>

        {/* Review grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name + r.treatment} delay={i * 0.05}>
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
                    {r.treatment}
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
