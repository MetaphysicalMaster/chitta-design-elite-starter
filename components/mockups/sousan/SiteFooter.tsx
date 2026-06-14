"use client";

/**
 * SiteFooter — dark charcoal close with ONE authoritative NAP (pulled from the
 * shared nap module, so it is byte-identical to the booking + story blocks).
 * A single source of truth on the page. Hot-pink hairline, the script wordmark,
 * quick links, and a final reservation CTA. Monochrome with the one pink pop.
 */

import Link from "next/link";
import { NAP } from "./nap";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#awards", label: "Awards" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#book", label: "Book" },
];

export function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden bg-[var(--night-0)] text-[oklch(88%_0_0_/_0.86)]"
    >
      {/* pink hairline top — a confident accent rule framing the footer */}
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
          <span className="sn-wordmark sn-wordmark--on-dark">
            <span className="sn-wordmark__script text-[2.3rem] leading-none">
              Sousan
            </span>
            <span className="sn-wordmark__caps text-[0.55rem] leading-none">
              Med&nbsp;Spa
            </span>
          </span>

          <address className="mt-6 not-italic">
            <p className="text-[0.95rem] text-[oklch(86%_0_0_/_0.82)] tnum">
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
                className="w-fit text-[oklch(86%_0_0_/_0.82)] underline-offset-4 hover:text-[var(--color-bg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
              >
                {NAP.email}
              </a>
            </div>
            <p className="mt-3 text-[0.82rem] text-[oklch(80%_0_0_/_0.7)]">
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
                  className="text-[0.95rem] text-[oklch(86%_0_0_/_0.82)] underline-offset-4 transition-colors hover:text-[var(--color-bg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
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
            Visit Houston
          </p>
          <p className="mt-4 max-w-[28ch] text-[0.95rem] text-[oklch(86%_0_0_/_0.82)]">
            Award-winning aesthetics. Begin your beauty evolution today.
          </p>
          <Link
            href="#book"
            className={cn(
              "sn-press mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3",
              "bg-[var(--gold)] font-semibold text-[oklch(100%_0_0)]",
              "shadow-[0_16px_44px_-16px_oklch(58%_0.245_358_/_0.5)] transition-transform duration-300 hover:-translate-y-0.5",
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
            className="mt-3 block w-fit text-[0.85rem] text-[oklch(84%_0_0_/_0.76)] underline-offset-4 hover:text-[var(--color-bg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
          >
            Get directions →
          </a>
        </div>
      </div>

      <div className="border-t border-[oklch(100%_0_0_/_0.12)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-[0.78rem] text-[oklch(78%_0_0_/_0.66)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {NAP.name}. Houston, TX. All rights
            reserved.
          </p>
          <p className="text-[oklch(76%_0_0_/_0.58)]">
            Design mockup · sample imagery &amp; copy for pitch purposes.
          </p>
        </div>
      </div>

      {/* MetaMarketer attribution — the demo site quietly closes for US. Kept
          editorial + understated, on its own faint sub-rail BELOW the client
          footer so it never competes with the client-brand illusion above. */}
      <AuditCredit />
    </footer>
  );
}

/**
 * AuditCredit — "Site + Growth OS by The MetaMarketer" + a free Reactivation
 * Audit CTA. The pitch-site's own quiet close: a faint sub-rail beneath the
 * client footer, editorial and small, so the client-brand illusion stays
 * intact. External link opens in a new tab with rel="noopener". The href is a
 * static placeholder (no env, no fetch) — static-export safe.
 */
function AuditCredit() {
  return (
    <div className="border-t border-[oklch(100%_0_0_/_0.08)] bg-[var(--night-0)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-5 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
        <p className="text-[0.76rem] leading-relaxed text-[oklch(74%_0_0_/_0.6)]">
          Site &amp; Growth&nbsp;OS by{" "}
          <span className="font-medium text-[oklch(90%_0_0_/_0.82)]">
            The&nbsp;MetaMarketer
          </span>{" "}
          — the AI front office for modern med spas.
        </p>
        <a
          href="https://themetamarketer.com/start"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-full border border-[oklch(100%_0_0_/_0.18)] px-4 py-2 text-[0.78rem] font-medium text-[oklch(92%_0_0_/_0.86)]",
            "transition-colors hover:border-[var(--gold-bright)] hover:text-[var(--gold-bright)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
          )}
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
  );
}
