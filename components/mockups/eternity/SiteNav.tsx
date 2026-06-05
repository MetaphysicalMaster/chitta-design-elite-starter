"use client";

/**
 * SiteNav — sticky glass navigation with a native "Book" CTA.
 *
 * Transparent over the dark midnight hero, then frosts to a plum-mirror glass
 * once scrolled. The Book CTA is a native in-page anchor to the branded
 * scheduler (NOT the old phone-only line). Mobile menu is a real disclosure with
 * focus-visible affordances. Reduced-motion safe.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BRAND } from "./nap";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#financing", label: "Financing" },
  { href: "#visit", label: "Visit" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300",
        scrolled ? "glass-strong shadow-[var(--glass-shadow)]" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 sm:px-8"
      >
        {/* Wordmark — a chrome infinity bead + the didone name */}
        <Link
          href="#top"
          className="group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-bright)]"
          aria-label={`${BRAND.name} — home`}
        >
          <span
            aria-hidden
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full text-base",
              scrolled
                ? "silver-pill text-[var(--color-accent-fg)]"
                : "bg-[oklch(98%_0.01_300_/_0.14)] text-[var(--color-accent-bright)] backdrop-blur-md",
            )}
          >
            ∞
          </span>
          <span
            className={cn(
              "font-display text-lg font-semibold tracking-tight",
              scrolled ? "text-[var(--color-fg)]" : "text-[oklch(98%_0.006_300)]",
            )}
          >
            Eternity
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  scrolled
                    ? "text-[var(--color-fg-muted)] hover:text-[var(--color-accent-bright)]"
                    : "text-[oklch(92%_0.012_300_/_0.9)] hover:text-white",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-bright)]",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="#book"
            className={cn(
              "group relative hidden items-center gap-1.5 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold sm:inline-flex",
              "silver-pill text-[var(--color-accent-fg)]",
              "shadow-[0_12px_34px_-14px_oklch(72%_0.04_300_/_0.6)]",
              "transition-transform duration-300 hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            Book now
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="et-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
              scrolled
                ? "text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)]"
                : "text-[oklch(96%_0.008_300)] hover:bg-[oklch(98%_0.01_300_/_0.12)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="et-mobile-menu"
          className="glass-strong border-t border-[var(--color-border)] lg:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 sm:px-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="#book"
                onClick={() => setOpen(false)}
                className="block rounded-full silver-pill px-5 py-3 text-center text-base font-semibold text-[var(--color-accent-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
              >
                Book now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
