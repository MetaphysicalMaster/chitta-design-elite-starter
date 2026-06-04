"use client";

/**
 * SiteFooter — real NAP (name/address/phone) + hours, the trust signals the
 * real split-domain site scatters or omits. Uses semantic address + contact links.
 */

import Link from "next/link";
import { Reveal } from "./Reveal";

const HOURS = [
  { d: "Monday – Thursday", h: "9:00 AM – 6:00 PM" },
  { d: "Friday", h: "9:00 AM – 4:00 PM" },
  { d: "Saturday", h: "10:00 AM – 2:00 PM" },
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
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            {/* Brand + address */}
            <div>
              <div className="flex items-center gap-2.5">
                <span aria-hidden className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white/12 ring-1 ring-white/20">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <circle cx="12" cy="10.5" r="3.6" fill="var(--gold)" />
                    <circle cx="12" cy="10.5" r="5.4" stroke="var(--gold)" strokeWidth="0.9" opacity="0.45" />
                    <path d="M3.5 16.5c2.4-1.5 4.2-1.9 6.1-1.9 2 0 3.9.7 6 2 1.4-.9 2.7-1.2 4.4-1.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M5.5 19.5c2-1.1 3.6-1.4 5.3-1.4 1.8 0 3.4.6 5.2 1.6" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
                  </svg>
                </span>
                <span className="font-display text-xl">Blue Sky Med Spa</span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                Physician-led, family- and woman-owned aesthetic &amp; wellness
                medicine in the heart of German Village. You are seen &mdash; and
                we&rsquo;re here to help you live your best life.
              </p>
              <address className="mt-6 space-y-2 not-italic text-sm text-white/80">
                <p>
                  <a className="transition-colors hover:text-white" href="https://maps.google.com/?q=480+S+3rd+St+Columbus+OH+43215" target="_blank" rel="noreferrer">
                    480 S 3rd St, Columbus, OH 43215
                  </a>
                </p>
                <p>
                  <a className="transition-colors hover:text-white" href="tel:+16145129665">
                    (614) 512-9665
                  </a>
                </p>
              </address>
              <Link
                href="#book"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--color-fg)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
      </div>
    </footer>
  );
}
