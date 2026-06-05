"use client";

/**
 * SiteFooter — per-location NAP footer (the local-SEO backbone), brand sign-off,
 * and honest sample/mock disclaimers. The recreated martini-syringe mark anchors
 * the brand block. Semantic <address> per bar so each location is independently
 * crawlable. Reduced-motion safe (static).
 */

import Link from "next/link";
import { BRAND, LOCATIONS } from "./nap";
import { BeautoxLogo } from "./BeautoxLogo";

const NAV = [
  { href: "#services", label: "The Menu" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#team", label: "Our Injectors" },
  { href: "#locations", label: "Locations" },
  { href: "#financing", label: "Specials" },
  { href: "#book", label: "Book" },
];

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="border-t border-[var(--glass-border-dark)] bg-[var(--night-0)] text-[oklch(92%_0.008_350_/_0.86)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr]">
          {/* Brand block */}
          <div>
            <Link
              href="#top"
              aria-label="Beautox Bar — home"
              className="group inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-bright)]"
            >
              <BeautoxLogo tone="light" size="md" descriptor />
            </Link>
            <p className="mt-5 max-w-xs text-pretty leading-relaxed text-[oklch(88%_0.008_350_/_0.8)]">
              {BRAND.tagline}{" "}A playful Botox bar &amp; med spa in Maple Grove
              and White Bear Lake — tox, filler, lips, peptides &amp; the glow,
              served with a wink.
            </p>
            <p className="mt-5 text-sm">
              <span className="rounded-full bg-[oklch(28%_0.04_356_/_0.4)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-bright)]">
                Woman-owned · Nurse-led
              </span>
            </p>
            <nav aria-label="Footer" className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-sm text-[oklch(88%_0.008_350_/_0.8)] transition-colors hover:text-[var(--color-accent-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Per-location NAP */}
          <div className="grid gap-8 sm:grid-cols-2">
            {LOCATIONS.map((l) => (
              <div key={l.id}>
                <h3 className="font-display text-base text-[var(--color-bg)]">
                  {l.city}
                </h3>
                <p className="mt-1 text-xs font-semibold tnum text-[var(--color-accent-bright)]">
                  {l.happyHour}
                </p>
                <address className="mt-3 space-y-1 text-sm not-italic text-[oklch(88%_0.008_350_/_0.82)]">
                  <p>{l.street}</p>
                  <p>
                    {l.city}, {l.state} {l.zip}
                  </p>
                  <p className="pt-1">
                    <a
                      href={`tel:${l.tel}`}
                      className="font-semibold tnum text-[var(--color-accent-bright)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                    >
                      {l.phone}
                    </a>
                  </p>
                  <p className="text-xs text-[oklch(80%_0.008_350_/_0.7)]">{l.hours}</p>
                </address>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--glass-border-dark)] pt-7 text-xs text-[oklch(78%_0.008_350_/_0.66)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. Sample pitch mockup — imagery &amp; pricing are
            placeholders for illustration.
          </p>
          <p className="flex flex-wrap gap-x-4">
            <span>Results vary</span>
            <span aria-hidden>·</span>
            <span>Licensed medical providers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
