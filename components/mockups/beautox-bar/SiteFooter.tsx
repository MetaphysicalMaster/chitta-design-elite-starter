"use client";

/**
 * SiteFooter — per-location NAP footer (the local-SEO backbone), brand sign-off,
 * the co-founder credit (Nurse Liz + Nicole Langer), and honest sample/mock
 * disclaimers. Semantic <address> per bar so each location is independently
 * crawlable. Reduced-motion safe (static).
 */

import Link from "next/link";
import { BRAND, LOCATIONS } from "./nap";

const NAV = [
  { href: "#locations", label: "Locations" },
  { href: "#services", label: "Menu" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#financing", label: "Financing" },
  { href: "#book", label: "Book" },
];

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="border-t border-[var(--glass-border-dark)] bg-[var(--night-0)] text-[oklch(92%_0.03_330_/_0.86)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          {/* Brand block */}
          <div>
            <Link
              href="#top"
              className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--candy-pink)]"
            >
              <span
                aria-hidden
                className="css-bubble grid h-10 w-10 place-items-center text-lg font-bold text-[var(--color-accent-fg)]"
              >
                B
              </span>
              <span className="font-display text-xl text-[var(--color-bg)]">
                Beautox Bar
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-pretty leading-relaxed text-[oklch(88%_0.03_330_/_0.8)]">
              {BRAND.tagline} The Twin Cities&apos; fun, nurse-founded Botox bar —
              now in three neighborhoods.
            </p>
            <p className="mt-5 text-sm">
              <span className="text-[oklch(82%_0.03_330_/_0.7)]">Founded by</span>{" "}
              <span className="font-semibold text-[var(--color-bg)]">
                Nurse Liz
              </span>{" "}
              &amp;{" "}
              <span className="font-semibold text-[var(--color-bg)]">
                Nicole Langer
              </span>
            </p>
            <nav aria-label="Footer" className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-sm text-[oklch(88%_0.03_330_/_0.8)] transition-colors hover:text-[var(--candy-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--candy-pink)]"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Per-location NAP */}
          <div className="grid gap-8 sm:grid-cols-3">
            {LOCATIONS.map((l) => (
              <div key={l.id}>
                <h3 className="font-display text-base text-[var(--color-bg)]">
                  {l.city}
                  {l.status === "coming-soon" && (
                    <span className="ml-2 align-middle rounded-full bg-[var(--lilac-deep)] px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-[oklch(98%_0.01_300)]">
                      Soon
                    </span>
                  )}
                </h3>
                <address className="mt-3 space-y-1 text-sm not-italic text-[oklch(88%_0.03_330_/_0.82)]">
                  <p>{l.street}</p>
                  <p>
                    {l.city}, {l.state} {l.zip}
                  </p>
                  <p className="pt-1">
                    <a
                      href={`tel:${l.tel}`}
                      className="font-semibold tnum text-[var(--candy-pink)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--candy-pink)]"
                    >
                      {l.phone}
                    </a>
                  </p>
                  <p className="text-xs text-[oklch(80%_0.03_330_/_0.7)]">{l.hours}</p>
                </address>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--glass-border-dark)] pt-7 text-xs text-[oklch(78%_0.03_330_/_0.66)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. Sample pitch mockup — imagery, pricing &amp;
            NAP are placeholders for illustration.
          </p>
          <p className="flex flex-wrap gap-x-4">
            <span>Reach Nicole Langer via LinkedIn</span>
            <span aria-hidden>·</span>
            <span>Results vary · Licensed medical providers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
