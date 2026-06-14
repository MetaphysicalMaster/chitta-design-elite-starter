"use client";

/**
 * SiteFooter — the deep teal-ink footer well. Recreated brand TREE wordmark
 * (white-on-ink), a single semantic NAP (real practice details), service links,
 * hours, the Spa promise, and the MetaMarketer attribution + "Book a free
 * Reactivation Audit" CTA — mirroring the national-7 reference. Uses an
 * <address> landmark for SEO + a11y.
 */

import Link from "next/link";
import { EncoreMark } from "./primitives";
import { PRACTICE } from "./nap";

const SERVICE_LINKS = [
  { label: "Medical Dermatology", href: "#medical" },
  { label: "The Spa at Encore", href: "#spa" },
  { label: "Sciton Halo & lasers", href: "#spa" },
  { label: "Before & after", href: "#results" },
  { label: "Dr. Londeree", href: "#doctor" },
];

const HOURS = [
  { d: "Mon – Thu", h: "8:00a – 5:00p" },
  { d: "Friday", h: "8:30a – 12:00p" },
  { d: "Sat – Sun", h: "Closed" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-bg-deep)] text-white/80">
      {/* faint canopy dapple top-edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--leaf-bright)]/40 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        {/* Top: brand + booking nudge. lg:pr-40 reserves a gutter so the CTA
            never slides under the fixed concierge launcher. */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between lg:pr-40">
          <div>
            <Link href="#top" aria-label="Encore Dermatology — home" className="inline-flex items-center gap-3">
              <EncoreMark className="h-10 w-10 flex-none" leafTone="var(--leaf-bright)" inkTone="oklch(96% 0.01 200)" />
              <span className="flex items-baseline gap-2">
                <span className="font-display text-2xl text-white">Encore</span>
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-white/55">
                  Dermatology
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm text-white/60">
              <span className="font-display display-em text-white/90">
                The science of dermatology, the environment of a spa.
              </span>{" "}
              Established medical &amp; surgical care and The Spa at Encore — one
              roof in {PRACTICE.area}, led by Dr. Gwyn Londeree, MD.
            </p>
          </div>
          <Link
            href="#book"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-[var(--color-accent-fg)] shadow-[0_14px_38px_-16px_oklch(58%_0.094_197_/_0.9)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book an appointment
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* NAP grid */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Care
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SERVICE_LINKS.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Visit us
            </h3>
            <address className="mt-4 flex flex-col gap-1.5 not-italic text-sm text-white/70">
              <span className="font-semibold text-white/85">{PRACTICE.name}</span>
              <span>{PRACTICE.street}</span>
              <span>
                {PRACTICE.city}, {PRACTICE.region} {PRACTICE.postal}
              </span>
              <a
                href={PRACTICE.phoneHref}
                className="mt-1 font-semibold text-white/85 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [font-variant-numeric:tabular-nums]"
              >
                {PRACTICE.phoneDisplay}
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${PRACTICE.name} ${PRACTICE.street} ${PRACTICE.city} ${PRACTICE.region}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm text-[var(--leaf-bright)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get directions
                <span aria-hidden>→</span>
              </a>
            </address>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Hours
            </h3>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              {HOURS.map((row) => (
                <div key={row.d} className="flex items-center justify-between gap-4">
                  <dt className="text-white/55">{row.d}</dt>
                  <dd className="text-white/80 [font-variant-numeric:tabular-nums]">{row.h}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              The Encore promise
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Academic-level dermatology and a true spa calm, from a team led by
              an OSU faculty dermatologist. Careful, unhurried, and never
              upsold — simply the standard.
            </p>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Encore Dermatology. All rights reserved.</p>
          <p className="text-white/35">
            Design concept mockup — illustrative pitch · sample review &amp;
            result content. BOTOX®, JUVÉDERM®, CoolSculpting® &amp; Sciton® are
            trademarks of their respective owners.
          </p>
        </div>

        {/* MetaMarketer attribution + audit CTA — the demo close. The quietest
            line on the page: a hairline-separated editorial credit beneath the
            client's own legal row, so it never competes with the brand above. */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/[0.06] pt-7 text-center sm:flex-row sm:justify-between sm:text-left lg:pr-40">
          <p className="text-[0.7rem] leading-relaxed text-white/40">
            Site &amp; Growth&nbsp;OS by{" "}
            <span className="font-semibold tracking-tight text-white/65">
              The MetaMarketer
            </span>{" "}
            — the front-office engine behind the concierge, reviews &amp; booking
            you just used.
          </p>
          <a
            href="https://themetamarketer.com/start"
            target="_blank"
            rel="noopener"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[0.72rem] font-semibold text-white/75 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
    </footer>
  );
}
