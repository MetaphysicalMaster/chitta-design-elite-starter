"use client";

/**
 * SiteFooter — graphite footer with semantic, clean NAP per location (one
 * authoritative domain, four addresses — the SEO-consolidation story in
 * structured markup). Wordmark, quick links, legal.
 */

import Link from "next/link";

type Loc = {
  city: string;
  street: string;
  zip: string;
  phone: string;
  tel: string;
};

const LOCATIONS: Loc[] = [
  { city: "Cary", street: "Crossroads Blvd", zip: "27518", phone: "(919) 322-5440", tel: "+19193225440" },
  { city: "Raleigh", street: "Glenwood Ave", zip: "27612", phone: "(919) 322-5440", tel: "+19193225440" },
  { city: "Wake Forest", street: "Capital Blvd", zip: "27587", phone: "(919) 322-5440", tel: "+19193225440" },
  { city: "Asheville", street: "Merrimon Ave", zip: "28804", phone: "(828) 555-0140", tel: "+18285550140" },
];

const SERVICE_LINKS = ["Injectables", "Lasers & Energy", "Body Contouring", "Skin & Facials", "Wellness"];

export function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden text-white/80"
      style={{ background: "linear-gradient(180deg, var(--graphite-1), var(--graphite-0))" }}
    >
      <div className="ruler-ticks h-1.5 w-full opacity-20" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        {/* Top: brand + booking nudge */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="#top" className="flex items-center gap-2.5">
              <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-fg)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                  <path d="M4 17 L11 6 L13 6 L20 17 M8 14 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-white">
                Avail Aesthetics
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-white/60">
              Four locations. One standard. Built to scale. North Carolina&rsquo;s
              growth-built medical aesthetics brand — all under one roof,
              <span className="text-white/80"> availaesthetics.com</span>.
            </p>
          </div>
          <Link
            href="#book"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-[var(--color-accent-fg)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book in 30 seconds
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* NAP grid */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
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

          {LOCATIONS.map((l) => (
            <div key={l.city}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                {l.city}, NC
              </h3>
              <address className="mt-4 flex flex-col gap-1.5 not-italic text-sm text-white/70">
                <span>{l.street}</span>
                <span>{l.city}, NC {l.zip}</span>
                <a href={`tel:${l.tel}`} className="tnum font-semibold text-white/85 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  {l.phone}
                </a>
              </address>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Avail Aesthetics. All rights reserved.</p>
          <p className="text-white/35">
            Design mockup — illustrative pitch concept · sample imagery & content.
          </p>
        </div>
      </div>
    </footer>
  );
}
