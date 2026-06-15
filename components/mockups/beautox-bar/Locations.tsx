"use client";

/**
 * Locations — "Pick your bar". Beautox Bar's two real Twin Cities homes: Maple
 * Grove and White Bear Lake. Each card carries semantic NAP, the bar's Happy
 * Hour window, an individual booking CTA and a directions link. Data-driven from
 * nap.ts so both bars stay in sync everywhere. Reduced-motion safe.
 */

import Link from "next/link";
import { SectionHeading, Reveal } from "./primitives";
import { BrandImage } from "./BrandImage";
import { LOCATIONS, type Location } from "./nap";
import { cn } from "@/lib/utils";

function LocationCard({ loc, index }: { loc: Location; index: number }) {
  return (
    <Reveal delay={index * 0.08}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-[var(--color-bg-elevated)]",
          "transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5",
          loc.flagship
            ? "border-[var(--color-accent)]/50 shadow-[0_24px_60px_-28px_oklch(60%_0.16_356_/_0.5)]"
            : "border-[var(--color-border)] shadow-[var(--glass-shadow)]",
        )}
      >
        <BrandImage
          alt={`Beautox Bar ${loc.city} treatment bar interior`}
          src={loc.interior}
          aspect="16:10"
          tone={loc.flagship ? "magenta" : "lilac"}
          radius="lg"
          /* soft scrim so the white city label clears AA on BOTH plates —
             the lighter gold (lilac) plate needs it as much as the magenta. */
          scrim="soft"
          className="rounded-none border-0 border-b border-[var(--color-border)]"
        >
          <div className="absolute inset-0 flex items-end p-5">
            <span className="font-display text-2xl font-bold text-white drop-shadow-[0_2px_12px_oklch(16%_0.01_350_/_0.8)]">
              {loc.city}
            </span>
          </div>
          {/* Meaningful status badge — walk-ins welcome (matches the Happy Hour
              "walk-ins welcome, regulars rewarded" promise; both bars are open). */}
          <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-[oklch(99%_0.01_350_/_0.9)] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-deep)] backdrop-blur-sm">
            Walk-ins welcome
          </span>
        </BrandImage>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            {loc.region}
          </p>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{loc.blurb}</p>

          {/* Happy Hour line — martini glyph (premium SVG, not an emoji) */}
          <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-accent-subtle)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-deep)]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path d="M4 5h16l-8 8-8-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M12 13v6M8 19h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {loc.happyHour}
          </p>

          {/* Semantic NAP */}
          <address className="mt-4 not-italic">
            <p className="text-sm text-[var(--color-fg)]">
              {loc.street}, {loc.city}, {loc.state} {loc.zip}
            </p>
            <p className="mt-1.5 text-xs text-[var(--color-fg-muted)]">{loc.hours}</p>
            <a
              href={`tel:${loc.tel}`}
              className="mt-1.5 inline-block text-sm font-semibold tnum text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              {loc.phone}
            </a>
          </address>

          <div className="mt-auto flex items-center gap-2 pt-5">
            <Link
              href="#book"
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full gloss-pill px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-fg)] transition-transform duration-300 hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
              )}
            >
              {`Book ${loc.city}`}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href={`https://maps.google.com/?q=Beautox+Bar+${encodeURIComponent(`${loc.street} ${loc.city} MN`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              aria-label={`Directions to Beautox Bar ${loc.city}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                <path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Locations() {
  return (
    <section
      id="locations"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Find your bar"
          title={
            <>
              Two bars, one <span className="candy-text">vibe.</span>
            </>
          }
          lead="Beautox Bar lives in two Twin Cities neighborhoods — Maple Grove and White Bear Lake. Same playful pour, same natural-looking results. Pick the bar nearest you."
        />

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.id} loc={loc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
