/**
 * SiteFooter — per-metro NAP under ONE canonical domain. This is the closing
 * argument of the consolidation pitch: both Lee's Summit and Overland Park sit
 * side by side, semantically marked up, under a single domain — no testkc.com
 * staging leak, no split Square page. Server Component (no interactivity).
 */

import Link from "next/link";
import { METROS, BRAND } from "./nap";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--night-0)] text-[oklch(92%_0.02_120_/_0.86)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="relative grid h-9 w-9 place-items-center rounded-full earth-pill">
                <span className="h-3 w-3 rounded-full bg-[var(--color-accent-fg)]" />
                <span
                  className="absolute h-1.5 w-1.5 rounded-full bg-[var(--terra-bright)]"
                  style={{ top: 3, right: 5 }}
                />
              </span>
              <span className="font-display text-xl font-semibold text-[var(--color-bg)]">
                {BRAND.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              RN &amp; NP-owned beauty and wellness across the Kansas City metro.
              Injectables, medical weight-loss and holistic wellness — balanced,
              grounded, and led by {BRAND.owner}, {BRAND.ownerCreds}.
            </p>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border-dark)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition-colors hover:border-[var(--color-accent-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
              </svg>
              {BRAND.instagram}
            </a>
          </div>

          {/* Per-metro NAP */}
          {METROS.map((m) => (
            <div key={m.id}>
              <h3 className="font-display text-base font-semibold text-[var(--color-bg)]">
                {m.city}, {m.state}
                {m.flagship && (
                  <span className="ml-2 rounded-full bg-[oklch(98%_0.01_110_/_0.14)] px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-bright)]">
                    Original
                  </span>
                )}
              </h3>
              <address className="mt-3 space-y-1.5 text-sm not-italic">
                <p>{m.street}</p>
                <p>
                  {m.city}, {m.state} {m.zip}
                </p>
                <p className="text-[oklch(86%_0.02_120_/_0.7)]">{m.hours}</p>
                <a
                  href={`tel:${m.tel}`}
                  className="inline-block pt-1 font-semibold tnum text-[var(--color-accent-bright)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                >
                  {m.phone}
                </a>
              </address>
              <Link
                href="#book"
                className="mt-3 inline-block text-sm font-medium text-[var(--color-bg)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
              >
                Book {m.city} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--glass-border-dark)] pt-7 text-xs text-[oklch(84%_0.02_120_/_0.62)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. One home at{" "}
            <span className="font-medium text-[oklch(90%_0.02_120)]">
              {BRAND.domain}
            </span>
            . Mockup for pitch purposes — sample imagery and content.
          </p>
          <p>Beauty, balanced — across two cities.</p>
        </div>
      </div>
    </footer>
  );
}
