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
    quote: "My injector is an absolute artist. Natural, never overdone.",
    name: "Maria T.",
    loc: "White Bear Lake",
  },
  {
    quote: "The vibe is so welcoming. Booked my mom and sister too.",
    name: "Ashley K.",
    loc: "Maple Grove",
  },
  {
    quote:
      "Happy Hour is my monthly treat — tox touch-up and a glow. Easy booking, zero pressure, great results every time.",
    name: "Brooke L.",
    loc: "White Bear Lake",
    feature: true,
  },
  {
    quote: "They explain everything. I never feel upsold — just cared for.",
    name: "Dani P.",
    loc: "Maple Grove",
  },
  {
    quote: "Love that they have the peptide strips too — wellness without the needles.",
    name: "Sam V.",
    loc: "White Bear Lake",
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

/* Recognizable source marks beside the aggregate rating — the "G" and the IG
   camera read instantly as Google + Instagram, the two real sources the client
   wires on launch. Decorative; the adjacent text carries the name. */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.06-1.4-.18-2.05H12v3.88h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.35Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.9a6 6 0 0 1 0-3.8V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.59Z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86A10 10 0 0 0 3.07 7.51l3.34 2.59C7.2 7.74 9.4 5.98 12 5.98Z" />
    </svg>
  );
}
function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[var(--color-accent-deep)]" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </svg>
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
                Loved at <span className="candy-text">both bars.</span>
              </>
            }
            lead="A sample of the kind of words regulars leave — your real Google & Instagram reviews drop straight in on launch."
          />
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-4 shadow-[var(--glass-shadow)]">
            <span className="font-display text-4xl text-[var(--color-accent-deep)] tnum">5.0</span>
            <div>
              <Stars />
              {/* Source-credible scaffolding: a recognizable Google + Instagram
                  mark beside the rating (the top conversion lever for local
                  aesthetics), with the real review count wired in on launch — no
                  invented number, matching the honest "client-to-supply" pattern. */}
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[var(--color-fg-muted)]">
                <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-fg)]">
                  <GoogleGlyph /> Google
                </span>
                <span aria-hidden className="text-[var(--color-border)]">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-fg)]">
                  <InstagramGlyph /> Instagram
                </span>
                <span aria-hidden className="text-[var(--color-border)]">·</span>
                <span className="uppercase tracking-[0.14em]">— reviews · client to confirm</span>
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
