"use client";

/**
 * Locations — THE CLOSER. The multi-location brand-system grid: one brand,
 * four homes. This is the SEO-consolidation story made visual — every location
 * lives under one domain, one design system, one booking flow (replacing the
 * indexed Elementor staging domain cannibalizing their search footprint).
 * Each card is individually book-able with semantic NAP.
 */

import Link from "next/link";
import { SectionHeading, Reveal, BrandImage } from "./primitives";
import { cn } from "@/lib/utils";

type Loc = {
  id: string;
  city: string;
  state: string;
  street: string;
  zip: string;
  phone: string;
  tel: string;
  hours: string;
  tagline: string;
  flagship?: boolean;
};

const LOCATIONS: Loc[] = [
  {
    id: "cary",
    city: "Cary",
    state: "NC",
    street: "Crossroads Blvd",
    zip: "27518",
    phone: "(919) 322-5440",
    tel: "+19193225440",
    hours: "Mon–Fri 9–6 · Sat 9–2",
    tagline: "The flagship — full med-spa & wellness menu.",
    flagship: true,
  },
  {
    id: "raleigh",
    city: "Raleigh",
    state: "NC",
    street: "Glenwood Ave",
    zip: "27612",
    phone: "(919) 322-5440",
    tel: "+19193225440",
    hours: "Mon–Fri 9–6",
    tagline: "Injectables, lasers & skin in the heart of the city.",
  },
  {
    id: "wake-forest",
    city: "Wake Forest",
    state: "NC",
    street: "Capital Blvd",
    zip: "27587",
    phone: "(919) 322-5440",
    tel: "+19193225440",
    hours: "Mon–Fri 9–6 · Sat 9–2",
    tagline: "Body contouring, wellness & advanced facials.",
  },
  {
    id: "asheville",
    city: "Asheville",
    state: "NC",
    street: "Merrimon Ave",
    zip: "28804",
    phone: "(828) 555-0140",
    tel: "+18285550140",
    hours: "Tue–Sat 9–5",
    tagline: "The mountain studio — the standard, in the Blue Ridge.",
  },
];

function LocationCard({ loc, index }: { loc: Loc; index: number }) {
  return (
    <Reveal delay={index * 0.08}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-[var(--color-bg-elevated)]",
          "transition-[transform,box-shadow] duration-300 hover:-translate-y-1",
          loc.flagship
            ? "border-[var(--color-accent)]/40 shadow-[0_24px_60px_-28px_oklch(52%_0.2_264_/_0.5)]"
            : "border-[var(--color-border)] shadow-[var(--glass-shadow)]",
        )}
      >
        <BrandImage
          aspect="16 / 10"
          radius="lg"
          cool={loc.flagship}
          sample
          className="rounded-none border-0 border-b border-[var(--color-border)]"
        >
          <div className="absolute inset-0 flex items-end p-5">
            <span className="font-display text-2xl font-semibold text-white drop-shadow-[0_2px_12px_oklch(20%_0.02_262_/_0.7)]">
              {loc.city}
              {loc.flagship && (
                <span className="ml-2 align-middle rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-fg)]">
                  Flagship
                </span>
              )}
            </span>
          </div>
        </BrandImage>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-sm text-[var(--color-fg-muted)]">{loc.tagline}</p>

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
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-fg)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              Book {loc.city}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href={`https://maps.google.com/?q=Avail+Aesthetics+${loc.city}+NC`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              aria-label={`Directions to Avail Aesthetics ${loc.city}`}
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
            eyebrow="One brand · Four homes"
            title={
              <>
                One brand. Four homes.
                <br />
                <span className="text-[var(--color-accent-deep)]">Zero confusion.</span>
              </>
            }
            lead="Every location lives under one domain, one design system and one booking flow — so your search footprint compounds instead of competing with itself. Pick a home below."
          />
          <Reveal className="max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
              The consolidation
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Four locations, one authoritative domain — replacing the indexed
              staging site that was cannibalizing rankings. One brand platform
              that scales as you open the fifth.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.id} loc={loc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
