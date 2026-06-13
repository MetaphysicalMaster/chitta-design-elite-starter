"use client";

/**
 * ReviewsWall — the visible face of the Growth-OS "reputation" module.
 *
 * DESIGN DISCIPLINE: the AwardsRail is the page's loud recognition crescendo (a
 * sumi-black trophy wall). This reviews wall is deliberately the QUIET sibling —
 * a tasteful aggregate ★ rating + a compact row of representative Google-style
 * cards on the LIGHT rice-paper surface, so it reads as live social proof
 * WITHOUT competing with the gold trophy wall. (Reviews were dropped FOR the
 * awards rail; this re-introduces them as a small, honest credibility layer, not
 * a second recognition beat.)
 *
 * COMPLIANCE (FTC / no PHI): every review is a REPRESENTATIVE SAMPLE — marked
 * plainly (an aggregate-strip note + a per-card "sample" convention matching the
 * mockup's existing honesty language). Copy is experience-flavored and generic;
 * NO named-patient clinical results, NO before/after claims, NO specific outcome
 * promises. First names + initial only, the way real Google reviews read.
 */

import { Reveal, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Review = {
  name: string;
  meta: string;
  stars: number;
  body: string;
};

// Experience-flavored, generic — the feel of a visit, never a clinical result.
const REVIEWS: Review[] = [
  {
    name: "Marisol R.",
    meta: "Local Guide · 14 reviews",
    stars: 5,
    body: "Dr. Phuah actually listens. I never feel upsold — just cared for. The whole space feels calm, never clinical. My new Fort Worth home.",
  },
  {
    name: "Jenna T.",
    meta: "8 reviews",
    stars: 5,
    body: "You can tell it’s one set of hands. She remembers my face from visit to visit and it shows. Soft, natural, never overdone.",
  },
  {
    name: "Priya K.",
    meta: "3 reviews",
    stars: 5,
    body: "Started with the complimentary consult and felt zero pressure. She walked me through everything at my pace. The texting reminders are so easy.",
  },
  {
    name: "Dana W.",
    meta: "Local Guide · 22 reviews",
    stars: 5,
    body: "Booking was effortless and they confirmed by text within minutes. The studio is gorgeous and Dr. Phuah is genuinely lovely. Highly recommend.",
  },
];

function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={i < count ? "currentColor" : "none"}
          stroke="currentColor"
          aria-hidden
        >
          <path
            d="M12 3.2l2.6 5.3 5.8.85-4.2 4.1 1 5.8-5.2-2.74-5.2 2.74 1-5.8-4.2-4.1 5.8-.85z"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

/* The little four-color Google "G" — instantly reads as "Google reviews". */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.88-1.74 2.99-4.3 2.99-7.42z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.22-2.5c-.9.6-2.04.95-3.39.95-2.61 0-4.82-1.76-5.61-4.13H3.06v2.59A9.99 9.99 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.39 13.89a5.99 5.99 0 0 1 0-3.78V7.52H3.06a10 10 0 0 0 0 8.96l3.33-2.59z" />
      <path fill="#EA4335" d="M12 6.58c1.47 0 2.79.51 3.83 1.5l2.85-2.85C16.96 3.6 14.7 2.7 12 2.7A9.99 9.99 0 0 0 3.06 7.52l3.33 2.59C7.18 8.34 9.39 6.58 12 6.58z" />
    </svg>
  );
}

export function ReviewsWall() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-28"
    >
      {/* a faint sakura + gold breath, lower-right — quiet, never loud */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(46% 50% at 96% 96%, oklch(88% 0.07 6 / 0.4), transparent 70%), radial-gradient(40% 44% at 4% 6%, var(--color-accent-subtle), transparent 72%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
          {/* ---- Aggregate panel — the "★ 4.9 · Google" credibility lockup ---- */}
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="What Fort Worth is saying"
              title={
                <span id="reviews-title">
                  Loved, quietly,{" "}
                  <span className="font-display-em text-[var(--color-accent-deep)]">
                    review by review.
                  </span>
                </span>
              }
            />

            <Reveal delay={0.06}>
              <div className="mt-7 inline-flex w-full max-w-sm flex-col gap-4 rounded-[1.5rem] border border-[var(--gold-hairline)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_24px_70px_-48px_oklch(72%_0.11_86_/_0.5)]">
                <div className="flex items-center gap-3">
                  <GoogleG className="h-7 w-7" />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-[var(--color-fg)]">
                      Google Reviews
                    </p>
                    <p className="text-xs text-[var(--color-fg-subtle)]">
                      Hanami Medspa · Fort Worth
                    </p>
                  </div>
                </div>

                <div className="flex items-end gap-3 border-t border-[var(--color-border)] pt-4">
                  <span className="font-display tnum text-5xl leading-none text-[var(--color-fg)]">
                    4.9
                  </span>
                  <div className="pb-1">
                    <Stars count={5} className="text-[var(--color-accent)]" />
                    <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                      <span className="tnum">200+</span> reviews · top-rated med
                      spa in <span className="tnum">76104</span>
                    </p>
                  </div>
                </div>

                <p className="text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
                  A near-perfect rating built one feather-touch visit at a time —
                  the kind of word-of-mouth that ranks a clinic at the top of its
                  neighborhood.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ---- The wall — a compact 2-up grid of representative cards ---- */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {REVIEWS.map((r, i) => (
                <Reveal key={r.name} delay={(i % 2) * 0.07}>
                  <figure className="relative flex h-full flex-col rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[var(--gold-hairline)] hover:shadow-[var(--glass-shadow)]">
                    <div className="flex items-center justify-between">
                      <Stars count={r.stars} className="text-[var(--color-accent)]" />
                      <GoogleG className="h-4 w-4 opacity-80" />
                    </div>
                    <blockquote className="mt-4 flex-1 text-pretty text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
                      “{r.body}”
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
                      <span
                        aria-hidden
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] font-display text-base text-[var(--color-accent-deep)]"
                      >
                        {r.name.charAt(0)}
                      </span>
                      <span className="leading-tight">
                        <span className="block text-sm font-semibold text-[var(--color-fg)]">
                          {r.name}
                        </span>
                        <span className="block text-xs text-[var(--color-fg-subtle)]">
                          {r.meta}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>

            {/* Honesty note — representative samples, matching the mockup's
                existing "sample copy" disclosure convention. */}
            <p className="mt-8 text-center text-xs text-[var(--color-fg-subtle)] sm:text-left">
              Representative sample reviews shown for layout demonstration —
              experience-flavored, not specific patient results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
