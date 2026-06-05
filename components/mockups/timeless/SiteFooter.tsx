"use client";

/**
 * SiteFooter — clean NAP, navigation, and fine print. Heirloom: hairline rules,
 * the editorial concentric-ring wordmark, one clear Name/Address/Phone block
 * with a tel: link and tabular numerics. Closes the page with the "sample
 * mockup" disclosure.
 */

import Link from "next/link";

const NAV = [
  { href: "#physicians", label: "The Physicians" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#proof", label: "Reviews" },
  { href: "#financing", label: "Financing" },
  { href: "#book", label: "Book" },
];

const NAP = {
  name: "Timeless Aesthetics MedSpa",
  street: "3260 Westbourne Dr",
  city: "Cincinnati, OH 45248",
  phoneDisplay: "(513) 451-9600",
  phoneTel: "+15134519600",
  hours: "By appointment · Physician-led",
};

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand + voice */}
          <div className="lg:col-span-5">
            <Link
              href="#top"
              className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            >
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-full border border-[var(--brass)]/50 text-[var(--color-accent)]"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 25%, oklch(94% 0.05 84), oklch(82% 0.07 72))",
                }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="12" cy="12" r="1.4" fill="currentColor" />
                </svg>
              </span>
              <span className="font-display text-lg tracking-tight text-[var(--color-fg)]">
                Timeless <span className="text-[var(--color-fg-subtle)]">Aesthetics</span>
              </span>
            </Link>
            <p className="mt-5 max-w-[40ch] text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
              Physician-led aesthetics for Cincinnati — injectables, laser &amp;
              Secret RF, and medical skin. Trusted for a decade, ahead for the
              next.
            </p>
          </div>

          {/* NAP block */}
          <div className="lg:col-span-4">
            <p className="font-display text-base text-[var(--color-fg)]">{NAP.name}</p>
            <address className="mt-3 space-y-0.5 not-italic text-sm text-[var(--color-fg-muted)]">
              <p className="tnum">{NAP.street}</p>
              <p className="tnum">{NAP.city}</p>
              <p>
                <a
                  href={`tel:${NAP.phoneTel}`}
                  className="tnum font-semibold text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  {NAP.phoneDisplay}
                </a>
              </p>
              <p className="pt-1 text-xs text-[var(--color-fg-subtle)]">{NAP.hours}</p>
            </address>
            <a
              href="https://instagram.com/timelessaesthetics"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
              @timelessaesthetics
            </a>
          </div>

          {/* Nav */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              Explore
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--color-border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--color-fg-subtle)]">
            © {new Date().getFullYear()} Timeless Aesthetics MedSpa · Drs. McCarren &amp; Heuker. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-fg-subtle)]">
            Pitch mockup — sample copy &amp; imagery for design demonstration only.
          </p>
        </div>
      </div>
    </footer>
  );
}
