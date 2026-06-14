"use client";

/**
 * SiteFooter — real NAP (name/address/phone) + hours, the trust signals the
 * real split-domain site scatters or omits. Recreated rising-sun mark + "BlueSky
 * Med Spa" wordmark, white-on-ink. Closes with the MetaMarketer attribution +
 * "Book a free Reactivation Audit" CTA — the quietest, hairline-separated line
 * on the page so it never competes with the Blue Sky illusion above it.
 */

import Link from "next/link";
import { Reveal } from "./Reveal";
import { SunMark } from "./SunMark";

const HOURS = [
  { d: "Monday – Saturday", h: "8:00 AM – 5:00 PM" },
  { d: "Sunday", h: "Closed" },
];

const NAV = [
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#membership", label: "Membership" },
  { href: "#reviews", label: "Reviews" },
  { href: "#book", label: "Book Now" },
];

export function SiteFooter() {
  return (
    <footer id="visit" className="scroll-mt-24 bg-[var(--color-fg)] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <Reveal>
          {/* lg:pr-40 reserves a right gutter so the CTA never slides under the
              fixed concierge launcher (bottom-right) at any width. */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            {/* Brand + address */}
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white/12 ring-1 ring-white/20"
                >
                  <SunMark className="h-6 w-6" tone="onDark" />
                </span>
                <span className="font-display text-xl leading-none">
                  BlueSky
                  <span className="ml-1.5 align-middle text-[0.62rem] font-sans font-semibold uppercase tracking-[0.22em] opacity-70">
                    Med Spa
                  </span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                Family- &amp; woman-owned medical aesthetics &amp; wellness in the
                heart of German Village &mdash; a Medical Doctor on staff and over
                30 years of medical experience. Elevate your wellness.
              </p>
              <address className="mt-6 space-y-2 not-italic text-sm text-white/80">
                <p>
                  <a
                    className="transition-colors hover:text-white"
                    href="https://maps.google.com/?q=480+S+3rd+St+Columbus+OH+43215"
                    target="_blank"
                    rel="noreferrer"
                  >
                    480 S 3rd St, Columbus, OH 43215
                  </a>
                </p>
                <p>
                  <a className="transition-colors hover:text-white" href="tel:+17043745285">
                    (704) 374-5285
                  </a>
                </p>
              </address>
              <Link
                href="#book"
                className="bs-press mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--color-fg)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Book Now →
              </Link>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Hours</h3>
              <dl className="mt-5 space-y-2.5 text-sm">
                {HOURS.map((row) => (
                  <div key={row.d} className="flex justify-between gap-4">
                    <dt className="text-white/70">{row.d}</dt>
                    <dd className="text-white/90">{row.h}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Nav */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Explore</h3>
              <ul className="mt-5 space-y-2.5 text-sm">
                {NAV.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/12 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Blue Sky Med Spa. All rights reserved.</p>
          <p className="text-white/40">
            Concept redesign mockup · not the live website · sample content &amp; pricing throughout.
          </p>
        </div>

        {/* MetaMarketer attribution + Reactivation Audit CTA — deliberately the
            quietest line on the page: a hairline-separated editorial credit
            beneath the client's own legal row. */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/[0.06] pt-7 text-center sm:flex-row sm:justify-between sm:text-left lg:pr-40">
          <p className="text-[0.72rem] leading-relaxed text-white/40">
            Site &amp; Growth&nbsp;OS by{" "}
            <span className="font-semibold tracking-tight text-white/65">The MetaMarketer</span>{" "}
            — the front-office engine behind the concierge, reviews &amp; booking
            you just used.
          </p>
          <a
            href="https://themetamarketer.com/start"
            target="_blank"
            rel="noopener"
            className="bs-press group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[0.74rem] font-semibold text-white/75 hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book a free Reactivation Audit
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
