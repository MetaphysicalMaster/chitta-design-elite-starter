"use client";

/**
 * SiteNav — sticky glass navigation with a native "Book" CTA.
 *
 * Transparent over the dark earth-night hero, then frosts to a warm-oat glass
 * once scrolled. The Book CTA is a native in-page anchor to the branded
 * scheduler (NOT a bare Square redirect). Mobile menu is a real disclosure with
 * focus-visible affordances. Reduced-motion safe.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BRAND } from "./nap";

const LINKS = [
  { href: "#locations", label: "Locations" },
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#financing", label: "Financing" },
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
        scrolled
          ? "glass-strong shadow-[var(--glass-shadow)]"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 sm:px-8"
      >
        {/* Wordmark — a small orbit seed + the serif name */}
        <Link
          href="#top"
          className="group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
          aria-label={`${BRAND.name} — home`}
        >
          <span
            aria-hidden
            className={cn(
              "relative grid h-8 w-8 place-items-center rounded-full",
              scrolled ? "earth-pill" : "bg-[oklch(98%_0.01_110_/_0.16)] backdrop-blur-md",
            )}
          >
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                scrolled ? "bg-[var(--color-accent-fg)]" : "bg-[var(--color-accent-bright)]",
              )}
            />
            <span
              className={cn(
                "absolute h-1.5 w-1.5 rounded-full",
                scrolled ? "bg-[var(--terra-bright)]" : "bg-[var(--terra-bright)]",
              )}
              style={{ top: 2, right: 4 }}
            />
          </span>
          <span
            className={cn(
              "font-display text-lg font-semibold tracking-tight",
              scrolled ? "text-[var(--color-fg)]" : "text-[oklch(98%_0.01_110)]",
            )}
          >
            Karma
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
                    ? "text-[var(--color-fg-muted)] hover:text-[var(--color-accent-deep)]"
                    : "text-[oklch(94%_0.012_120_/_0.9)] hover:text-white",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]",
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
              "group hidden items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold sm:inline-flex",
              "earth-pill text-[var(--color-accent-fg)]",
              "shadow-[0_12px_32px_-14px_oklch(43%_0.066_147_/_0.6)]",
              "transition-transform duration-300 hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
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
            aria-controls="km-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
              scrolled
                ? "text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)]"
                : "text-[oklch(96%_0.01_120)] hover:bg-[oklch(98%_0.01_110_/_0.12)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
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
          id="km-mobile-menu"
          className="glass-strong border-t border-[var(--color-border)] lg:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 sm:px-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="#book"
                onClick={() => setOpen(false)}
                className="block rounded-full earth-pill px-5 py-3 text-center text-base font-semibold text-[var(--color-accent-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
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
