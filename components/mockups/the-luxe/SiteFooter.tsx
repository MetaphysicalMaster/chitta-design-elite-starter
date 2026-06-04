"use client";

/**
 * SiteFooter — semantic NAP (name/address/phone), real hours, nav and a final
 * CTA. Uses microdata-friendly markup (address, tel: link, schema-like dl) and
 * a closing gold-leaf wordmark. All facts are the prospect's real details.
 */

import Link from "next/link";

const HOURS = [
  { d: "Monday – Thursday", h: "9:00 AM – 6:00 PM" },
  { d: "Friday", h: "9:00 AM – 5:00 PM" },
  { d: "Saturday", h: "By appointment" },
  { d: "Sunday", h: "Closed" },
];

const NAV = [
  { href: "#story", label: "The House" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#team", label: "Dr. Sanchez" },
  { href: "#book", label: "Book Now" },
];

export function SiteFooter() {
  return (
    <footer className="grain relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--emerald-abyss)] pt-20 pb-10">
      <div className="hairline-gold absolute inset-x-0 top-0" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Final CTA */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-[var(--color-border-subtle)] pb-14 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="font-display text-[clamp(2rem,1.2rem+3vw,3.25rem)] leading-[1.04] text-[var(--color-fg)]">
              Your most radiant self is{" "}
              <span className="gold-leaf italic">one reservation away.</span>
            </p>
          </div>
          <Link
            href="#book"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--color-accent-fg)] shadow-[0_16px_44px_-16px_oklch(80%_0.13_86_/_0.6)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
          >
            Book in 30 seconds
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + NAP */}
          <div className="lg:col-span-2">
            <Link
              href="#top"
              className="font-display text-2xl tracking-wide text-[var(--color-fg)]"
              aria-label="The Luxe MedSpa — home"
            >
              The <span className="gold-leaf">Luxe</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Aesthetics &amp; Bodycare — physician-led luxury in Upper Arlington.
            </p>
            <address className="mt-6 not-italic text-sm leading-relaxed text-[var(--color-fg-muted)]">
              <span className="block text-[var(--color-fg)]">
                The Luxe MedSpa Aesthetics &amp; Bodycare
              </span>
              3025 Northwest Blvd
              <br />
              Upper Arlington, OH 43221
              <br />
              <a
                href="tel:+16144532056"
                className="mt-2 inline-block text-[var(--gold)] underline-offset-4 transition-colors hover:text-[var(--gold-bright)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              >
                (614) 453-2056
              </a>
            </address>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--gold)]">
              Hours
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              {HOURS.map((row) => (
                <div key={row.d} className="flex justify-between gap-4">
                  <dt className="text-[var(--color-fg-muted)]">{row.d}</dt>
                  <dd className="text-right text-[var(--color-fg)]">{row.h}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h3 className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--gold)]">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Legal */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-8 text-xs text-[var(--color-fg-subtle)] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} The Luxe MedSpa Aesthetics &amp; Bodycare. All rights reserved.</p>
          <p className="opacity-80">
            Design concept mockup · not the live site. Sample imagery &amp; pricing.
          </p>
        </div>
      </div>
    </footer>
  );
}
