"use client";

/**
 * SiteFooter — warm editorial footer with semantic NAP (name/address/phone),
 * hours, nav and a closing gold CTA. Recreated GOLD SCRIPT wordmark. All facts
 * are the prospect's real details. Closes with the MetaMarketer attribution +
 * "Book a free Reactivation Audit" CTA (mirrors the national-7 SiteFooter
 * pattern) — the quietest line on the page so it never breaks the illusion.
 */

import Link from "next/link";
import { Wordmark } from "./Wordmark";

const NAP = {
  name: "The Luxe MedSpa",
  street: "3025 Northwest Blvd",
  city: "Upper Arlington",
  state: "OH",
  zip: "43221",
  phoneDisplay: "(614) 453-2056",
  phoneTel: "+16144532056",
};

const HOURS = [
  { d: "Monday – Thursday", h: "9:00 AM – 6:00 PM" },
  { d: "Friday", h: "9:00 AM – 5:00 PM" },
  { d: "Saturday", h: "By appointment" },
  { d: "Sunday", h: "Closed" },
];

const NAV = [
  { href: "#story", label: "The Spa" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#team", label: "Our Team" },
  { href: "#book", label: "Book Now" },
];

export function SiteFooter() {
  return (
    <footer className="grain relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--cream-deep)] pt-20 pb-10">
      <div className="hairline-gold absolute inset-x-0 top-0" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Final CTA. lg:pr-44 reserves a right gutter so the CTA never slides
            under the fixed concierge launcher (bottom-right). */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-[var(--color-border-subtle)] pb-14 lg:flex-row lg:items-end lg:pr-44">
          <div className="max-w-xl">
            <p className="font-display text-[clamp(2rem,1.2rem+3vw,3.25rem)] leading-[1.04] text-[var(--color-fg)]">
              It&rsquo;s time to{" "}
              <span className="gold-leaf italic">turn back time.</span>
            </p>
          </div>
          <Link
            href="#book"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--color-accent-fg)] shadow-[0_16px_44px_-16px_oklch(70%_0.12_78_/_0.6)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
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
              className="inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-deep)]"
              aria-label="The Luxe MedSpa — home"
            >
              <Wordmark className="h-12 w-auto" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-fg-muted)]">
              A top-rated medical spa in Upper Arlington, proudly serving
              Columbus, Ohio. Live beautifully, feel empowered.
            </p>
            <address className="mt-6 not-italic text-sm leading-relaxed text-[var(--color-fg-muted)]">
              <span className="block font-medium text-[var(--color-fg)]">
                {NAP.name}
              </span>
              {NAP.street}
              <br />
              {NAP.city}, {NAP.state} {NAP.zip}
              <br />
              <a
                href={`tel:${NAP.phoneTel}`}
                className="mt-2 inline-block tnum text-[var(--gold-deep)] underline-offset-4 transition-colors hover:text-[var(--gold)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
              >
                {NAP.phoneDisplay}
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${NAP.name} ${NAP.street} ${NAP.city} ${NAP.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block w-fit text-[var(--gold-deep)] underline-offset-4 transition-colors hover:text-[var(--gold)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
              >
                Get directions →
              </a>
            </address>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--gold-deep)]">
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
            <h3 className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--gold-deep)]">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
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
          <p>
            © {new Date().getFullYear()} The Luxe MedSpa. All rights reserved.
          </p>
          <p className="opacity-90">
            Design concept mockup · not the live site. Sample imagery, reviews
            &amp; pricing.
          </p>
        </div>

        {/* MetaMarketer attribution + audit CTA — the demo site's closing for US.
            The quietest line on the page: a hairline-separated editorial credit
            beneath the client's own legal row, so it never competes with the
            brand illusion above it. */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-[var(--color-border-subtle)] pt-7 text-center sm:flex-row sm:justify-between sm:text-left lg:pr-44">
          <p className="text-[0.7rem] leading-relaxed text-[var(--color-fg-subtle)]">
            Site &amp; Growth&nbsp;OS by{" "}
            <span className="font-semibold tracking-tight text-[var(--color-fg-muted)]">
              The MetaMarketer
            </span>{" "}
            — the front-office engine behind the concierge, reviews &amp; booking
            you just used.
          </p>
          <a
            href="https://themetamarketer.com/start"
            target="_blank"
            rel="noopener"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-[0.72rem] font-semibold text-[var(--color-fg-muted)] transition-colors hover:border-[var(--gold)] hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
          >
            Book a free Reactivation Audit
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
