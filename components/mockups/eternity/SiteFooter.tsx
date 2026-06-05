/**
 * SiteFooter — clean NAP under ONE branded domain. This is the closing argument
 * of the consolidation pitch: a single Creve Coeur location, semantically marked
 * up, under one branded domain — retiring the leftover free
 * `eternitymedspa.wordpress.com` subdomain for a real flagship home. Server
 * Component (no interactivity). Anchored #visit for the nav "Visit" link.
 */

import Link from "next/link";
import { BRAND } from "./nap";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="visit"
      className="scroll-mt-20 border-t border-[var(--color-border)] bg-[var(--night-0)] text-[var(--color-fg-muted)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full silver-pill text-lg text-[var(--color-accent-fg)]"
              >
                ∞
              </span>
              <span className="font-display text-xl font-semibold text-[var(--color-fg)]">
                {BRAND.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              St. Louis&rsquo; enduring med spa on the Olive Blvd corridor in
              Creve Coeur. Injectables, skin and body — led by {BRAND.owner} for{" "}
              {BRAND.years} years. Results that last.
            </p>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
              </svg>
              {BRAND.instagram}
            </a>
          </div>

          {/* NAP */}
          <div>
            <h3 className="font-display text-base font-semibold text-[var(--color-fg)]">
              Visit us
            </h3>
            <address className="mt-3 space-y-1.5 text-sm not-italic">
              <p>{BRAND.street}</p>
              <p>
                {BRAND.city}, {BRAND.state} {BRAND.zip}
              </p>
              <p className="text-[var(--color-fg-subtle)]">{BRAND.hours}</p>
              <a
                href={`tel:${BRAND.tel}`}
                className="inline-block pt-1 font-semibold tnum text-[var(--color-accent-bright)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
              >
                {BRAND.phone}
              </a>
            </address>
            <a
              href={`https://maps.google.com/?q=${BRAND.mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-[var(--color-fg)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
            >
              Get directions →
            </a>
          </div>

          {/* Book */}
          <div>
            <h3 className="font-display text-base font-semibold text-[var(--color-fg)]">
              Book online
            </h3>
            <p className="mt-3 text-sm">
              No more phone tag. Reserve any service, any time — 24/7.
            </p>
            <Link
              href="#book"
              className="group mt-4 inline-flex items-center gap-1.5 rounded-full silver-pill px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
            >
              Book in 30 seconds
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        <hr className="chrome-rule mt-14" />

        <div className="mt-7 flex flex-col gap-3 text-xs text-[var(--color-fg-subtle)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. One home at{" "}
            <span className="font-medium text-[var(--color-fg-muted)]">
              {BRAND.domain}
            </span>
            {" — "}retiring{" "}
            <span className="line-through decoration-[var(--color-fg-subtle)]/60">
              {BRAND.legacyDomain}
            </span>
            . Mockup for pitch purposes — sample imagery and content.
          </p>
          <p>Results that last.</p>
        </div>
      </div>
    </footer>
  );
}
