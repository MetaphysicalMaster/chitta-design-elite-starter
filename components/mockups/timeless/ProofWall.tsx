"use client";

/**
 * ProofWall — the GROWTH-OS "reputation" module: a LIVE GOOGLE REVIEWS WALL.
 * Friendly pull-quotes in Open Sans over clean cards, a "★ 4.9 · Google" live
 * aggregate strip (animated "live" dot), a local-ranking credibility line, and
 * an IG handle cue. The voice is warm and confident — real people, real feelings
 * — to match the sunlit orange/peach brand, never couture-cold.
 *
 * COMPLIANCE: reviews are REPRESENTATIVE SAMPLES, marked clearly (the "sample"
 * note + the spec banner). They are experience-flavored and generic — no
 * fabricated named-patient clinical results, no before/after claims, no PHI.
 */

import { Reveal, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  quote: string;
  name: string;
  meta: string;
  /** Relative recency, for the "live feed" feel. */
  when: string;
  span?: boolean;
  /** The emotional-peak quote — feeling-led, foregrounded. */
  feature?: boolean;
};

const REVIEWS: Review[] = [
  // The emotional peak leads — a FEELING, named ("like myself, only brighter").
  {
    id: "r5",
    quote:
      "I walked out feeling like myself — only brighter. Calm, unhurried, never a sales pitch, just real doctors who listen.",
    name: "Beth T.",
    meta: "Medical skin · Westbourne",
    when: "2 weeks ago",
    span: true,
    feature: true,
  },
  {
    id: "r2",
    quote: "Dr. Heuker's Secret RF gave me back skin I thought was gone for good.",
    name: "Lauren P.",
    meta: "Secret RF · Cincinnati",
    when: "1 month ago",
  },
  {
    id: "r3",
    quote: "Dr. McCarren talked me out of more, not into it. That's why I'll never leave.",
    name: "Diane K.",
    meta: "Facial balancing · Westbourne",
    when: "3 weeks ago",
  },
  {
    id: "r1",
    quote:
      "Ten years I've trusted them, and they've never once chased a trend. Just my face, looking rested and like me.",
    name: "Karen M.",
    meta: "Injectables · Westbourne",
    when: "2 months ago",
    span: true,
  },
  {
    id: "r4",
    quote:
      "Real doctors who actually listen — the best physician-led care in Cincinnati. You feel looked-after the moment you walk in.",
    name: "Allison R.",
    meta: "Laser · Cincinnati",
    when: "1 week ago",
  },
];

/* Inline Google "G" glyph — marks each card as a live Google review. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M21.6 12.2c0-.64-.06-1.25-.16-1.84H12v3.49h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.17Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.23-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A9.99 9.99 0 0 0 12 22Z" fill="#34A853" />
      <path d="M6.41 13.91A6 6 0 0 1 6.09 12c0-.66.11-1.31.32-1.91V7.5H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.5l3.33-2.59Z" fill="#FBBC05" />
      <path d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.86-2.86C16.96 2.99 14.7 2 12 2A9.99 9.99 0 0 0 3.08 7.5l3.33 2.59C7.2 7.74 9.4 5.98 12 5.98Z" fill="#EA4335" />
    </svg>
  );
}

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-[var(--color-accent)]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M12 2.5 14.7 8l6 .9-4.3 4.2 1 6L12 16.3 6.6 19.1l1-6L3.3 8.9l6-.9L12 2.5Z" />
        </svg>
      ))}
    </span>
  );
}

export function ProofWall() {
  return (
    <section
      id="proof"
      className="relative scroll-mt-20 bg-[var(--color-bg-subtle)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Live reviews"
            title={
              <>
                Loved by Cincinnati for{" "}
                <span className="font-display-em">over a decade.</span>
              </>
            }
            lead="Hundreds of patients keep coming back — and bringing their friends. Here's what they say about being cared for by Drs. Heuker and McCarren, pulled from our Google profile."
          />
          <Reveal delay={0.08} className="lg:pb-2">
            <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4 shadow-[var(--glass-shadow)]">
              <div>
                <p className="flex items-center gap-2">
                  <span className="font-display text-2xl tnum text-[var(--color-fg)]">4.9</span>
                  <Stars />
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
                  <span className="tl-live-dot" aria-hidden />
                  <span className="font-semibold text-[var(--color-fg)]">Google</span>
                  <span aria-hidden className="text-[var(--color-fg-subtle)]">·</span>
                  <span className="tnum">380+ reviews</span>
                </p>
                <p className="mt-1 text-[0.68rem] text-[var(--color-fg-subtle)]">
                  Top-rated medspa in West Cincinnati · representative sample
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal
              key={r.id}
              delay={(i % 3) * 0.07}
              className={cn(r.span && "sm:col-span-2 lg:col-span-1")}
            >
              <figure
                className={cn(
                  "relative flex h-full flex-col rounded-[1.5rem] border bg-[var(--color-bg-elevated)] p-7 shadow-[var(--glass-shadow)]",
                  r.feature
                    ? "border-[var(--color-accent)]/30"
                    : "border-[var(--color-border)]",
                )}
              >
                {/* Feature quote: a faint peach top-edge glow marks the emotional peak. */}
                {r.feature && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
                  />
                )}
                <Stars />
                {/* Upright Open Sans (no synthetic italic) — differentiated by a
                    large orange opening-quote glyph + weight/leading instead. */}
                <blockquote className="relative mt-4 flex-1">
                  <span
                    aria-hidden
                    className="font-display absolute -left-0.5 -top-5 select-none text-5xl leading-none text-[var(--color-accent)]/35"
                  >
                    &ldquo;
                  </span>
                  <p
                    className={cn(
                      "font-display leading-relaxed text-[var(--color-fg)]",
                      r.feature ? "text-[1.45rem]" : "text-xl",
                    )}
                  >
                    {r.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-5 flex items-end justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-fg)]">{r.name}</p>
                    <p className="truncate text-xs text-[var(--color-fg-subtle)]">{r.meta}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 text-[0.68rem] text-[var(--color-fg-subtle)]">
                    <GoogleMark className="h-3.5 w-3.5" />
                    {r.when}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}

          {/* IG cue card */}
          <Reveal delay={0.14}>
            <a
              href="https://instagram.com/timelessaesthetics"
              className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-[var(--color-accent-subtle)] bg-[var(--color-bg-elevated)] p-7 shadow-[var(--glass-shadow)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <span
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--color-accent-subtle)] text-[var(--color-accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                </svg>
              </span>
              <div className="mt-6">
                <p className="font-display text-xl text-[var(--color-fg)]">
                  @timelessaesthetics
                </p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                  A decade of results, day after day.
                  <span className="ml-1 inline-block text-[var(--color-accent-deep)] transition-transform duration-300 group-hover:translate-x-0.5">
                    Follow →
                  </span>
                </p>
              </div>
            </a>
          </Reveal>
        </div>

        {/* Compliance: these are representative samples, marked clearly — the
            same honesty convention used across the mockup. */}
        <p className="mt-10 text-center text-xs text-[var(--color-fg-subtle)]">
          Representative sample reviews shown for design demonstration — generic
          patient experiences, not specific clinical results.
        </p>
      </div>
    </section>
  );
}
