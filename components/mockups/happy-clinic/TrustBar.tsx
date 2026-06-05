"use client";

/**
 * TrustBar — authority band directly under the hero, where buyers form first
 * trust. Two layers:
 *  1) an AGGREGATE-RATING strip (5.0 · review count · Google source) — the
 *     single most decisive proof for a "where do I inject my face" decision;
 *  2) a metric row recast as CONCRETE credibility/logistics the hero does NOT
 *     already state (same-week visits, free consult, products, parking) so it
 *     adds new information instead of echoing the hero's stat row.
 * Tabular numerics for crisp alignment. Rating is sample-tagged until real
 * Google figures land (honest-sample convention).
 */

import { Reveal } from "./primitives";

const METRICS = [
  { v: "Same-week", k: "Appointments", sub: "Flexible scheduling — often within days, not weeks" },
  { v: "Free", k: "First consultation", sub: "An honest plan before you commit to anything" },
  { v: "Allergan", k: "& Galderma products", sub: "Genuine BOTOX®, Juvéderm® and Dysport®" },
  { v: "Free", k: "On-site parking", sub: "1241 S Parker Rd · STE 100, Denver" },
];

/* Five-pointed star — decorative; the rating text carries the meaning. */
function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 2.4l2.86 5.8 6.4.93-4.63 4.52 1.1 6.38L12 17.5l-5.73 3.01 1.1-6.38L2.74 9.6l6.4-.93z" />
    </svg>
  );
}

export function TrustBar() {
  return (
    <section
      aria-label="Why Happy Clinic Denver"
      className="relative border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
    >
      <div className="ruler-ticks h-1.5 w-full opacity-60" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-14">
        {/* Aggregate rating — the highest-leverage trust signal */}
        <Reveal>
          <div className="mb-10 flex flex-col items-start gap-x-6 gap-y-3 border-b border-[var(--color-border)] pb-9 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              {/* Star glyphs use pine-teal sitewide (matching the reviews board +
                  hero quote); pale-yellow stays reserved for CTAs/sparks. */}
              <span className="flex items-center gap-0.5 text-[var(--color-accent)]" aria-hidden>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </span>
              <span className="font-heading text-2xl font-bold leading-none tnum text-[var(--color-fg)]">
                5.0
              </span>
            </div>
            <p className="text-sm text-[var(--color-fg-muted)]">
              <span className="font-semibold text-[var(--color-fg)]">
                Rated 5.0
              </span>{" "}
              across{" "}
              <span className="font-semibold text-[var(--color-fg)] tnum">
                300+
              </span>{" "}
              verified patient reviews on Google
              <span className="ml-2 inline-flex translate-y-[-1px] items-center rounded-full bg-[var(--color-fg)]/8 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                Sample
              </span>
            </p>
          </div>
        </Reveal>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.k} delay={i * 0.07}>
              <div className="flex flex-col">
                <dt className="font-heading text-3xl font-bold leading-none tnum text-[var(--color-accent-deep)] sm:text-4xl">
                  {m.v}
                </dt>
                <dd className="mt-3">
                  <span className="block text-sm font-semibold text-[var(--color-fg)]">
                    {m.k}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[var(--color-fg-muted)]">
                    {m.sub}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
