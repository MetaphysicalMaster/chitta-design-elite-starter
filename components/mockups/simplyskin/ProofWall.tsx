"use client";

/**
 * ProofWall — a quiet wall of reviews/proof. Editorial pull-quotes in the
 * serif over near-white cards, a calm aggregate-rating strip, and an IG handle
 * cue (@simplyskinmedspa). Restrained masonry — no star-spam, no badges; the
 * confidence reads in the typography, not the noise.
 */

import { Reveal, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  quote: string;
  name: string;
  meta: string;
  span?: boolean;
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    quote:
      "No one can tell I've had anything done — I just look like I slept well for a year. Exactly what I wanted.",
    name: "Megan R.",
    meta: "Injectables · Fishers",
    span: true,
  },
  {
    id: "r2",
    quote: "Trusted care, and now five minutes from my house in Carmel.",
    name: "Anita P.",
    meta: "Filler · Carmel · Zionsville",
  },
  {
    id: "r3",
    quote: "They talked me out of more, not into it. That's why I'll never go anywhere else.",
    name: "Dana K.",
    meta: "Facial balancing · Fishers",
  },
  {
    id: "r4",
    quote:
      "The most natural, refined work in Indianapolis. You feel the difference the moment you walk in.",
    name: "Sara L.",
    meta: "Skincare · Fishers",
    span: true,
  },
  {
    id: "r5",
    quote: "Calm, clean, never rushed. It feels exactly as considered as it is.",
    name: "Brooke T.",
    meta: "Microneedling · Carmel · Zionsville",
  },
];

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
      className="relative scroll-mt-28 bg-[var(--color-bg-subtle)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="In their words"
            title={
              <>
                Quietly,{" "}
                <span className="font-display-em">obsessively</span> loved.
              </>
            }
            lead="Word-of-mouth across the Indianapolis metro — the quiet kind of loyalty that medical-grade, understated care earns."
          />
          <Reveal delay={0.08} className="lg:pb-2">
            <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4 shadow-[var(--glass-shadow)]">
              <div>
                <p className="flex items-center gap-2">
                  <span className="font-display text-2xl tnum text-[var(--color-fg)]">4.9</span>
                  <Stars />
                </p>
                <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">
                  <span className="tnum">300+</span> Google reviews · @simplyskinmedspa · sample
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
              <figure className="flex h-full flex-col rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7 shadow-[var(--glass-shadow)]">
                <Stars />
                <blockquote className="mt-4 flex-1">
                  <p className="font-display text-lg italic leading-relaxed text-[var(--color-fg)]">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-5 border-t border-[var(--color-border)] pt-4">
                  <p className="text-sm font-medium text-[var(--color-fg)]">{r.name}</p>
                  <p className="text-xs text-[var(--color-fg-subtle)]">{r.meta}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}

          {/* IG cue card */}
          <Reveal delay={0.14}>
            <a
              href="https://instagram.com/simplyskinmedspa"
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
                  @simplyskinmedspa
                </p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                  See the work, day after day.
                  <span className="ml-1 inline-block text-[var(--color-accent-deep)] transition-transform duration-300 group-hover:translate-x-0.5">
                    Follow →
                  </span>
                </p>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
