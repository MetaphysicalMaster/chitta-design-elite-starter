"use client";

/**
 * SiteFooter — clean NAP, navigation, and fine print. Warm and quiet: peach
 * hairline rules, the lowercase dot-cluster wordmark, one clear
 * Name/Address/Phone block with a tel: link and tabular numerics. Closes the
 * page with the "sample mockup" disclosure.
 */

import Link from "next/link";
import { TimelessLogo } from "./TimelessLogo";

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
              aria-label="Timeless Aesthetics MedSpa — home"
              className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            >
              <TimelessLogo size="md" />
            </Link>
            <p className="mt-5 max-w-[40ch] text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
              A friendly, physician-run medspa for Cincinnati — Botox &amp;
              Xeomin, filler, laser hair removal, Secret RF micro-needling and
              medical skin care. Rejuvenate. Renew. Refresh.
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
              <span className="text-xs font-normal text-[var(--color-fg-subtle)]">· sample</span>
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
            © {new Date().getFullYear()} Timeless Aesthetics MedSpa · Drs. Heuker &amp; McCarren. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-fg-subtle)]">
            Pitch mockup — sample copy &amp; imagery for design demonstration only.
          </p>
        </div>
      </div>
    </footer>
  );
}
