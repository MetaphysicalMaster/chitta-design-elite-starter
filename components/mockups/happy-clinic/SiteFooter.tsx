"use client";

/**
 * SiteFooter — navy-night footer with ONE clean, semantic NAP (single
 * authoritative domain + the real Denver address + phone). Recreated Happy
 * Clinic spiral logo (white-on-navy), links, hours, legal. Pale-yellow booking
 * CTA, pine-teal directions link — the real brand by night.
 */

import Link from "next/link";
import { HappyLogo } from "./HappyLogo";

const NAP = {
  name: "Happy Clinic Denver",
  street: "1241 S Parker Rd, STE 100",
  city: "Denver",
  state: "CO",
  zip: "80231",
  phoneDisplay: "720-747-9999",
  phoneTel: "+17207479999",
  domain: "happyclinicdenver.com",
};

const SERVICE_LINKS = [
  "Botox & Dysport",
  "Juvéderm & Filler",
  "Skin & Facials",
  "Lasers & Energy",
  "Body Contouring",
];

const HOURS = [
  { d: "Mon – Fri", h: "9:00 – 6:00" },
  { d: "Saturday", h: "9:00 – 3:00" },
  { d: "Sunday", h: "Closed" },
];

export function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden text-white/80"
      style={{ background: "linear-gradient(180deg, var(--night-1), var(--night-0))" }}
    >
      <div className="ruler-ticks h-1.5 w-full opacity-20" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        {/* Top: brand + booking nudge */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="#top" aria-label="Happy Clinic Denver — home" className="inline-flex">
              <HappyLogo tone="dark" size="lg" />
            </Link>
            <p className="mt-5 max-w-md text-sm text-white/60">
              <span className="font-display-em text-white/90">Subtle is The New WOW.</span>{" "}
              Natural, physician-administered cosmetic injections led by Dr. Phil
              Hong Nguyen, MD — one authoritative home at{" "}
              <span className="text-white/80">{NAP.domain}</span>.
            </p>
          </div>
          <Link
            href="#book"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-[var(--color-accent-fg)] shadow-[0_14px_38px_-16px_oklch(52%_0.087_178_/_0.9)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book in 30 seconds
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* NAP grid — single authoritative location */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Treatments
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <Link href="#services" className="text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* The single, canonical NAP */}
          <div className="sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Visit us
            </h3>
            <address className="mt-4 flex flex-col gap-1.5 not-italic text-sm text-white/70">
              <span className="font-semibold text-white/85">{NAP.name}</span>
              <span>{NAP.street}</span>
              <span>
                {NAP.city}, {NAP.state} {NAP.zip}
              </span>
              <a
                href={`tel:${NAP.phoneTel}`}
                className="mt-1 tnum font-semibold text-white/85 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {NAP.phoneDisplay}
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${NAP.name} ${NAP.street} ${NAP.city} ${NAP.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm text-[var(--color-accent-bright)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
                  <dd className="tnum text-white/80">{row.h}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Brand promise note */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              The Happy Clinic promise
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Results that look like you, only refreshed. Every treatment is
              physician-administered by Dr. Phil — subtle by design, natural by
              standard.
            </p>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Happy Clinic Denver. All rights reserved.</p>
          <p className="text-white/35">
            Design mockup — illustrative pitch concept · review copy is sample
            content. BOTOX®, JUVÉDERM® &amp; Dysport® are registered trademarks of
            their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
