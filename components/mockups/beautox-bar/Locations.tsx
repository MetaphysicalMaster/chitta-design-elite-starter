"use client";

/**
 * Locations — THE CLOSER. The "Find your Bar" growth-ready multi-location grid:
 * one brand, every bar. This is the pitch made visual — the flat Weebly builder
 * can't add a page without breaking the theme, but this grid is data-driven
 * (see nap.ts): the new White Bear Township bar is badged "Coming Soon" and is
 * already book-able, and dropping in location 4/5/6 is a one-line edit. Each
 * card carries semantic NAP and an individual booking CTA.
 */

import Link from "next/link";
import { SectionHeading, Reveal } from "./primitives";
import { BrandImage } from "./BrandImage";
import { LOCATIONS, type Location } from "./nap";
import { cn } from "@/lib/utils";

function LocationCard({ loc, index }: { loc: Location; index: number }) {
  const coming = loc.status === "coming-soon";
  return (
    <Reveal delay={index * 0.08}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-[var(--color-bg-elevated)]",
          "transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5",
          coming
            ? "border-[var(--lilac)]/50 shadow-[0_24px_60px_-28px_oklch(56%_0.2_302_/_0.5)]"
            : loc.flagship
              ? "border-[var(--color-accent)]/50 shadow-[0_24px_60px_-28px_oklch(58%_0.24_352_/_0.5)]"
              : "border-[var(--color-border)] shadow-[var(--glass-shadow)]",
        )}
      >
        <BrandImage
          alt={`Beautox Bar ${loc.city} treatment bar interior`}
          aspect="16:10"
          tone={coming ? "lilac" : loc.flagship ? "magenta" : "cream"}
          radius="lg"
          className="rounded-none border-0 border-b border-[var(--color-border)]"
        >
          <div className="absolute inset-0 flex items-end p-5">
            <span className="font-display text-2xl font-bold text-white drop-shadow-[0_2px_12px_oklch(20%_0.08_330_/_0.7)]">
              {loc.city}
            </span>
          </div>
          {/* status badge */}
          <span
            className={cn(
              "pointer-events-none absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm",
              coming
                ? "bg-[var(--lilac-deep)] text-[oklch(98%_0.01_300)]"
                : "bg-[oklch(99%_0.01_60_/_0.85)] text-[var(--color-accent-deep)]",
            )}
          >
            {coming ? "Coming Soon" : "Now Open"}
          </span>
        </BrandImage>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            {loc.region}
          </p>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{loc.blurb}</p>

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
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                coming
                  ? "border-2 border-[var(--lilac)] text-[var(--lilac-deep)] hover:bg-[var(--lilac-subtle)]"
                  : "gloss-pill text-[var(--color-accent-fg)]",
              )}
            >
              {coming ? `Join ${loc.city} waitlist` : `Book ${loc.city}`}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href={`https://maps.google.com/?q=Beautox+Bar+${encodeURIComponent(loc.city)}+MN`}
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
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Find your bar"
            title={
              <>
                Three bars, one vibe.
                <br />
                <span className="candy-text">Pick your neighborhood.</span>
              </>
            }
            lead="Every bar lives under one brand, one design system and one booking flow — so opening number three (hi, White Bear Township) is a launch, not a rebuild. Pick a home below."
          />
          <Reveal className="max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
              Built to scale
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              This grid is data-driven: bar #4, #5 and #6 drop in as one-line
              edits — no new theme, no broken layout, no Weebly duct tape.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.id} loc={loc} index={i} />
          ))}

          {/* "Add your next bar" placeholder — the growth story made literal. */}
          <Reveal delay={LOCATIONS.length * 0.08}>
            <div
              aria-hidden
              className="flex h-full min-h-[18rem] flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)]/40 p-8 text-center sm:col-span-2 xl:col-span-1"
            >
              <span className="css-bubble--lilac css-bubble grid h-12 w-12 place-items-center text-xl font-bold text-white">
                +
              </span>
              <p className="font-display text-lg text-[var(--color-fg)]">
                Bar #4 goes here
              </p>
              <p className="max-w-[26ch] text-sm text-[var(--color-fg-muted)]">
                When you&apos;re ready to grow, your site already is.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
