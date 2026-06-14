"use client";

/**
 * SiteFooter — final CTA band + semantic real NAP (name, address, phone),
 * hours, and providers. Uses microdata-friendly semantics + address element.
 */

import Link from "next/link";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const HOURS = [
  { d: "Tuesday", h: "9:00 AM – 4:00 PM" },
  { d: "Wednesday", h: "9:00 AM – 6:00 PM" },
  { d: "Thu – Fri", h: "9:00 AM – 5:00 PM" },
  { d: "Weekends", h: "By appointment" },
];

const NAV = [
  { href: "#experience", label: "Experience" },
  { href: "#services", label: "Treatments" },
  { href: "#membership", label: "Membership" },
  { href: "#results", label: "Results" },
  { href: "#book", label: "Book" },
];

export function SiteFooter() {
  return (
    <footer className="grain relative overflow-hidden bg-[var(--ink-deep)] text-[var(--color-bg)]">
      {/* Final CTA band */}
      <div className="relative border-b border-[var(--glass-dark-border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 0%, var(--glow-mauve), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 sm:py-28">
          <Reveal>
            <h2
              className="font-display text-balance"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
            >
              Ready to begin your{" "}
              <span className="text-molten font-em">journey to wellness?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-xl text-[var(--color-bg)]/75">
              Book your first visit in 30 seconds — or call the studio and
              we&rsquo;ll take care of the rest.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="#book"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold",
                  "bg-[oklch(98%_0.01_80)] text-[var(--ink-deep)]",
                  "transition-transform duration-300 hover:-translate-y-0.5",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-gold)]",
                )}
              >
                Book in 30 seconds →
              </Link>
              <a
                href="tel:+16145326423"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-medium",
                  "border border-[var(--glass-dark-border)] bg-[var(--glass-dark)] text-[var(--color-bg)] backdrop-blur",
                  "transition-colors duration-300 hover:bg-[oklch(40%_0.04_40_/_0.4)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-gold)]",
                )}
              >
                Call (614) 532-6423
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* NAP + columns */}
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-bg)] text-[0.65rem] font-bold text-[var(--ink-deep)]"
            >
              BS
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">
              Beyond Skin Aesthetics
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-bg)]/65">
            The joy of beauty &amp; wellness in Gahanna, Ohio — a warm,
            judgment-free home for aesthetics &amp; wellness since 2017.
          </p>
          <address className="mt-6 space-y-1 text-sm not-italic text-[var(--color-bg)]/75">
            <p>540 Officenter Pl, Ste 120</p>
            <p>Gahanna, OH 43230</p>
            <p>
              <a
                href="tel:+16145326423"
                className="underline-offset-4 transition-colors hover:text-[var(--glow-blush)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-blush)]"
              >
                Call (614) 532-6423
              </a>
            </p>
            <p>
              <a
                href="sms:+16147454177"
                className="underline-offset-4 transition-colors hover:text-[var(--glow-blush)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-blush)]"
              >
                Text (614) 745-4177
              </a>
            </p>
          </address>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--glow-blush)]">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[var(--color-bg)]/70 underline-offset-4 transition-colors hover:text-[var(--color-bg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-blush)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--glow-blush)]">
            Hours
          </h3>
          <dl className="mt-4 space-y-2 text-sm">
            {HOURS.map((row) => (
              <div key={row.d} className="flex justify-between gap-4">
                <dt className="text-[var(--color-bg)]/70">{row.d}</dt>
                <dd className="text-[var(--color-bg)]/90">{row.h}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs text-[var(--color-bg)]/45">
            Led by Dr. Matia Mulumba &amp; the Beyond Skin team — warm,
            inclusive, and judgment-free.
          </p>
        </div>
      </div>

      <div className="relative border-t border-[var(--glass-dark-border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-[var(--color-bg)]/45 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Beyond Skin Aesthetics. All rights reserved.</p>
          <p>Concept mockup · design pitch · not the live site.</p>
        </div>
      </div>

      {/* MetaMarketer attribution + audit CTA — the demo site closing for US.
          Deliberately the quietest line on the page: a hairline-separated
          editorial credit beneath the client's own legal row, so it never
          competes with the Beyond Skin illusion above it. */}
      <div className="relative border-t border-[oklch(100%_0_0_/_0.06)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-7 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <p className="text-[0.7rem] leading-relaxed text-[var(--color-bg)]/40">
            Site &amp; Growth&nbsp;OS by{" "}
            <span className="font-semibold tracking-tight text-[var(--color-bg)]/65">
              The MetaMarketer
            </span>{" "}
            — the front-office engine behind the concierge, reviews &amp; booking
            you just used.
          </p>
          <a
            href="https://themetamarketer.com/start"
            target="_blank"
            rel="noopener"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[oklch(100%_0_0_/_0.15)] px-4 py-2 text-[0.72rem] font-semibold text-[var(--color-bg)]/75 transition-colors hover:border-[oklch(100%_0_0_/_0.3)] hover:text-[var(--color-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-blush)]"
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
