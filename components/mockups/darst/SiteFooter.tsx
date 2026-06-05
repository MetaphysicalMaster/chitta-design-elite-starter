"use client";

/**
 * SiteFooter — the clean NAP block. ONE authoritative Name-Address-Phone,
 * pulled from the single source, with no SEO-spam, no location-suffixed slugs,
 * no keyword-stuffed link farm — the structural opposite of the live site.
 * Plain navigation, honest disclaimer, contained landmark.
 */

import Link from "next/link";
import { NAP } from "./nap";
import { DarstLogo } from "./DarstLogo";

const NAV = [
  { href: "#credentials", label: "Credentials" },
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#book", label: "Book" },
];

export function SiteFooter() {
  return (
    <footer
      id="visit"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          {/* identity + NAP */}
          <div>
            <Link
              href="#top"
              aria-label="Darst Dermatology — home"
              className="group inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-deep)]"
            >
              <DarstLogo tone="light" size="md" />
            </Link>

            <p className="mt-4 max-w-[40ch] text-[0.92rem] leading-relaxed text-[var(--color-fg-muted)]">
              {NAP.doctor} — board-certified in dermatology and dermatopathology.
              Medical, surgical and cosmetic dermatology for Charlotte, for over
              two decades.
            </p>

            <address className="mt-6 not-italic">
              <p className="text-[0.95rem] font-medium text-[var(--color-fg)] tnum">
                {NAP.street}
              </p>
              <p className="text-[0.95rem] text-[var(--color-fg-muted)] tnum">
                {NAP.city}, {NAP.state} {NAP.zip}
              </p>
              <a
                href={`tel:${NAP.phoneTel}`}
                className="mt-2 inline-block text-[0.95rem] font-semibold text-[var(--color-accent-deep)] underline-offset-4 hover:underline tnum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
              >
                {NAP.phoneDisplay}
              </a>
              <p className="mt-1 text-[0.9rem] text-[var(--color-fg-subtle)]">
                {NAP.hours}
              </p>
            </address>
          </div>

          {/* nav */}
          <nav aria-label="Footer">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              Explore
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.95rem] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* visit / map */}
          <div>
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              Visit
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--color-fg-muted)]">
              We welcome new patients across the Charlotte area. Most insurance
              accepted for medical dermatology.
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(NAP.mapsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-[var(--color-accent-deep)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
            >
              Get directions
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--color-border)] pt-7 text-[0.8rem] text-[var(--color-fg-subtle)] sm:flex-row sm:items-center sm:justify-between">
          <p className="tnum">
            © {new Date().getFullYear()} Darst Dermatology. All rights reserved.
          </p>
          <p className="max-w-[60ch]">
            Design mockup — sample imagery and representative content. Not the
            practice&rsquo;s live site.
          </p>
        </div>
      </div>
    </footer>
  );
}
