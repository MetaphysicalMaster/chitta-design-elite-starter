"use client";

/**
 * SiteFooter — clean NAP, navigation, and fine print. Botanical: hairline
 * rules, the sakura-blossom wordmark, one clear Name/Address/Phone block with a
 * tel: link and tabular numerics — the consistent, correct NAP a broken-title
 * SEO template fails to deliver. Closes the page with the "sample mockup"
 * disclosure.
 */

import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "#philosophy", label: "Philosophy" },
  { href: "#injector", label: "Dr. Phuah" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#awards", label: "Awards" },
  { href: "#book", label: "Book" },
];

const NAP = {
  name: "Hanami Medspa",
  street: "800 8th Ave, Suite 508",
  city: "Fort Worth, TX 76104",
  phoneDisplay: "(817) 808-8938",
  phoneTel: "+18178088938",
  hours: "By appointment · Every face by Dr. Phuah",
};

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand + voice */}
          <div className="lg:col-span-5">
            <Link
              href="#top"
              aria-label="Hanami Medspa — home"
              className="group inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-deep)]"
            >
              <Image
                src="/clients/hanami/logo.png"
                alt="Hanami Medspa"
                width={880}
                height={220}
                sizes="14rem"
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-[40ch] text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
              A botanical med spa in Fort Worth — injectables, laser &amp; IPL,
              every face by Dr. Elaine Phuah. The art of becoming, in bloom.
            </p>
          </div>

          {/* NAP block */}
          <div className="lg:col-span-4">
            <p className="font-display text-base text-[var(--color-fg)]">{NAP.name}</p>
            <address className="mt-3 space-y-0.5 not-italic text-sm text-[var(--color-fg-muted)]">
              <p className="tnum">{NAP.street}</p>
              <p className="tnum">{NAP.city}</p>
              <p>
                <a
                  href={`tel:${NAP.phoneTel}`}
                  className="tnum font-semibold text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
                >
                  {NAP.phoneDisplay}
                </a>
              </p>
              <p className="pt-1 text-xs text-[var(--color-fg-subtle)]">{NAP.hours}</p>
            </address>
            <a
              href="https://instagram.com/hanami.medspa"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
              @hanami.medspa
            </a>
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
                    className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* MetaMarketer credit + the "Book the Audit" close — understated, on a
            quiet hairline strip ABOVE the legal line so it reads as a tasteful
            studio byline, never breaking the client-brand illusion above it. */}
        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--color-border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-[var(--color-fg-subtle)]">
            Site &amp; Growth&nbsp;OS by{" "}
            <span className="font-medium text-[var(--color-fg-muted)]">
              The&nbsp;MetaMarketer
            </span>{" "}
            — the AI concierge, reviews engine &amp; reactivation system behind
            this page.
          </p>
          <a
            href="https://themetamarketer.com/start"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 self-start rounded-full border border-[var(--gold-hairline)] bg-[var(--color-bg-subtle)] px-4 py-2 text-xs font-semibold text-[var(--color-accent-deep)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-accent-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)] sm:self-auto"
          >
            Book a free Reactivation Audit
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--color-fg-subtle)]">
            © {new Date().getFullYear()} Hanami Medspa · Dr. Elaine Phuah, DO MBA. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-fg-subtle)]">
            Pitch mockup — sample copy &amp; imagery for design demonstration only.
          </p>
        </div>
      </div>
    </footer>
  );
}
