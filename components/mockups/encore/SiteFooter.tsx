/**
 * SiteFooter — semantic NAP (name / address / phone), hours and navigation.
 * Server component (no interactivity) using real practice details. Uses
 * microdata-flavored markup and an <address> landmark for SEO + a11y — fixing
 * the real site's weak, keyword-stuffed footprint.
 */

import Link from "next/link";

const HOURS = [
  { d: "Monday – Thursday", h: "8:00a – 5:00p" },
  { d: "Friday", h: "8:00a – 12:00p" },
  { d: "Saturday – Sunday", h: "Closed" },
];

const NAV = [
  { href: "#medical", label: "Medical Dermatology" },
  { href: "#spa", label: "The Spa at Encore" },
  { href: "#results", label: "Before & After" },
  { href: "#doctor", label: "Dr. Londeree" },
  { href: "#book", label: "Book Appointment" },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-deep)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        {/* Brand + NAP */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-[var(--color-fg)]">
              Encore
            </span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-fg-subtle)]">
              Dermatology
            </span>
          </div>
          <p className="mt-4 max-w-[40ch] text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
            Academic-level medical &amp; surgical dermatology and luxury
            aesthetic care — the most trusted skin in Columbus since 2010.
          </p>

          <address className="mt-6 not-italic text-sm text-[var(--color-fg-muted)]">
            <p className="font-medium text-[var(--color-fg)]">
              Encore Dermatology
            </p>
            <p>4900 Gettysburg Rd</p>
            <p>Columbus, OH 43220</p>
            <p className="mt-3">
              <a
                href="tel:+16144421012"
                className="font-semibold text-[var(--color-fg)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              >
                (614) 442-1012
              </a>
            </p>
          </address>
        </div>

        {/* Nav */}
        <nav aria-label="Footer">
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
            Explore
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hours */}
        <div>
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
            Hours
          </h2>
          <dl className="mt-4 flex flex-col gap-2.5 text-sm">
            {HOURS.map((row) => (
              <div key={row.d} className="flex justify-between gap-4">
                <dt className="text-[var(--color-fg-muted)]">{row.d}</dt>
                <dd className="tabular-nums text-[var(--color-fg)]">{row.h}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="hairline mx-auto max-w-6xl" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-7 text-xs text-[var(--color-fg-subtle)] sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} Encore Dermatology. All rights reserved.</p>
        <p className="text-center">
          Design concept mockup · sample content for pitch demonstration.
        </p>
      </div>
    </footer>
  );
}
