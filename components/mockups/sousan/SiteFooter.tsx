"use client";

/**
 * SiteFooter — emerald-night close with ONE authoritative NAP (pulled from the
 * shared nap module, so it is byte-identical to the booking + legacy blocks).
 * This is the structural fix for the conflicting-address trust gap: there is a
 * single source of truth on the page. Quiet gold hairline, monogram, quick
 * links, and a final reservation CTA.
 */

import Link from "next/link";
import { NAP } from "./nap";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#legacy", label: "Since 1995" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#book", label: "Book" },
];

export function SiteFooter() {
  return (
    <footer
      id="visit"
      className="relative overflow-hidden bg-[var(--night-0)] text-[oklch(90%_0.02_120_/_0.86)]"
    >
      {/* gold hairline top */}
      <div
        aria-hidden
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--gold-deep), var(--gold), var(--gold-deep), transparent)",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        {/* brand + NAP */}
        <div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 25%, oklch(46% 0.12 163), oklch(28% 0.06 166))",
                border: "1px solid oklch(80% 0.1 86 / 0.5)",
              }}
            >
              <span
                className="font-display text-[1.05rem] leading-none"
                style={{ color: "var(--gold-bright)" }}
              >
                S
              </span>
            </span>
            <span className="font-display text-lg tracking-tight text-[var(--color-bg)]">
              Sousan
              <span
                className="ml-1.5 align-middle text-[0.62rem] uppercase tracking-[0.28em] text-[var(--gold)]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Med Spa
              </span>
            </span>
          </div>

          <address className="mt-6 not-italic">
            <p className="text-[0.95rem] text-[oklch(88%_0.02_120_/_0.82)] tnum">
              {NAP.street}
              <br />
              {NAP.city}, {NAP.state} {NAP.zip} · {NAP.neighborhood}
            </p>
            <div className="mt-3 flex flex-col gap-1.5 text-[0.95rem]">
              <a
                href={`tel:${NAP.phoneTel}`}
                className="w-fit font-medium text-[var(--gold-bright)] underline-offset-4 hover:underline tnum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
              >
                {NAP.phoneDisplay}
              </a>
              <a
                href={`mailto:${NAP.email}`}
                className="w-fit text-[oklch(88%_0.02_120_/_0.82)] underline-offset-4 hover:text-[var(--color-bg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
              >
                {NAP.email}
              </a>
            </div>
            <p className="mt-3 text-[0.82rem] text-[oklch(82%_0.02_120_/_0.7)]">
              {NAP.hours}
            </p>
          </address>
        </div>

        {/* quick links */}
        <nav aria-label="Footer">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.95rem] text-[oklch(88%_0.02_120_/_0.82)] underline-offset-4 transition-colors hover:text-[var(--color-bg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Visit River Oaks
          </p>
          <p className="mt-4 max-w-[28ch] text-[0.95rem] text-[oklch(88%_0.02_120_/_0.82)]">
            One address. One standard. Trusted since 1995.
          </p>
          <Link
            href="#book"
            className={cn(
              "mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3",
              "bg-[var(--gold)] font-semibold text-[oklch(28%_0.06_70)]",
              "shadow-[0_16px_44px_-16px_oklch(80%_0.12_86_/_0.5)] transition-transform duration-300 hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
            )}
          >
            Book in 30 seconds
            <span aria-hidden>→</span>
          </Link>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(NAP.mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-fit text-[0.85rem] text-[oklch(86%_0.02_120_/_0.76)] underline-offset-4 hover:text-[var(--color-bg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
          >
            Get directions →
          </a>
        </div>
      </div>

      <div className="border-t border-[oklch(80%_0.1_86_/_0.14)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-[0.78rem] text-[oklch(80%_0.02_120_/_0.66)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {NAP.name}. River Oaks, Houston. All
            rights reserved.
          </p>
          <p className="text-[oklch(78%_0.02_120_/_0.58)]">
            Design mockup · sample imagery &amp; copy for pitch purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
