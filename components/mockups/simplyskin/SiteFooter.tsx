"use client";

/**
 * SiteFooter — clean per-location NAP, navigation, and fine print. Understated
 * restraint: hairline rules, the recreated two-tone wordmark, two clearly-
 * separated Name/Address/Phone blocks (Fishers + Carmel · Zionsville) with
 * tel: links and tabular numerics. Closes the page with the "sample mockup"
 * disclosure.
 */

import Link from "next/link";
import { Wordmark } from "./primitives";

const NAV = [
  { href: "#locations", label: "Locations" },
  { href: "#authority", label: "Our Approach" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#proof", label: "Reviews" },
  { href: "#financing", label: "Rewards & Financing" },
  { href: "#book", label: "Book" },
];

const NAP = [
  {
    name: "SimplySkin Fishers",
    street: "9879 E 116th St",
    city: "Fishers, IN 46037",
    phoneDisplay: "(317) 348-1313",
    phoneTel: "+13173481313",
    hours: "By appointment",
  },
  {
    name: "SimplySkin Carmel · Zionsville",
    street: "3965 W 106th St",
    city: "Carmel / Zionsville, IN 46032",
    phoneDisplay: "(317) 348-1313",
    phoneTel: "+13173481313",
    hours: "By appointment",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand + voice */}
          <div className="lg:col-span-4">
            <Link
              href="#top"
              aria-label="SimplySkin MedSpa — home"
              className="group inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            >
              <Wordmark />
            </Link>
            <p className="mt-5 max-w-[34ch] text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
              Body &amp; skincare, guided by medical expertise. Understated,
              medical-grade care for the Indianapolis metro — Fishers and Carmel
              &middot; Zionsville.
            </p>
          </div>

          {/* Two NAP blocks */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-5">
            {NAP.map((n) => (
              <div key={n.name}>
                <p className="font-display text-base text-[var(--color-fg)]">{n.name}</p>
                <address className="mt-3 space-y-0.5 not-italic text-sm text-[var(--color-fg-muted)]">
                  <p className="tnum">{n.street}</p>
                  <p className="tnum">{n.city}</p>
                  <p>
                    <a
                      href={`tel:${n.phoneTel}`}
                      className="tnum font-semibold text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                    >
                      {n.phoneDisplay}
                    </a>
                  </p>
                  <p className="pt-1 text-xs text-[var(--color-fg-subtle)]">{n.hours}</p>
                </address>
              </div>
            ))}
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
            <a
              href="https://instagram.com/simplyskinmedspa"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
              @simplyskinmedspa
            </a>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--color-border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--color-fg-subtle)]">
            © {new Date().getFullYear()} SimplySkin MedSpa · Allergan &amp; Galderma award-winner. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-fg-subtle)]">
            Pitch mockup — sample copy &amp; imagery for design demonstration only.
          </p>
        </div>
      </div>
    </footer>
  );
}
