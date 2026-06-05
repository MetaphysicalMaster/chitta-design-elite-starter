"use client";

/**
 * SiteFooter — clean per-location NAP, navigation, and fine print. Quiet
 * luxury: hairline rules, the editorial wordmark, two clearly-separated
 * Name/Address/Phone blocks (Fishers + Carmel) with tel: links and tabular
 * numerics. Closes the page with the "sample mockup" disclosure.
 */

import Link from "next/link";

const NAV = [
  { href: "#locations", label: "Locations" },
  { href: "#authority", label: "Why SimplySkin" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#proof", label: "Reviews" },
  { href: "#financing", label: "Allē & Financing" },
  { href: "#book", label: "Book" },
];

const NAP = [
  {
    name: "SimplySkin Fishers",
    street: "11529 Spring Mill Rd, Ste 200",
    city: "Fishers, IN 46038",
    phoneDisplay: "(317) 597-8625",
    phoneTel: "+13175978625",
    hours: "Tue–Sat · By appointment",
  },
  {
    name: "SimplySkin Carmel",
    street: "10485 N Pennsylvania St, Ste 100",
    city: "Carmel · Zionsville, IN 46032",
    phoneDisplay: "(317) 597-8625",
    phoneTel: "+13175978625",
    hours: "Now open · By appointment",
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
              className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            >
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-accent)]"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 25%, oklch(99% 0.006 80), oklch(94% 0.02 56))",
                }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <path
                    d="M12 3.5c3.4 4 5.2 6.6 5.2 9.2a5.2 5.2 0 1 1-10.4 0c0-2.6 1.8-5.2 5.2-9.2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="font-display text-lg tracking-tight text-[var(--color-fg)]">
                SimplySkin <span className="text-[var(--color-fg-subtle)]">MedSpa</span>
              </span>
            </Link>
            <p className="mt-5 max-w-[34ch] text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
              Simple by design, elite by results. Top 1% Allergan injectable
              artistry for the Indianapolis metro — Fishers &amp; Carmel.
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
            © {new Date().getFullYear()} SimplySkin MedSpa · Paquin Partners. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-fg-subtle)]">
            Pitch mockup — sample copy &amp; imagery for design demonstration only.
          </p>
        </div>
      </div>
    </footer>
  );
}
