"use client";

/**
 * SiteNav — sticky glass navigation.
 *
 * LOGO-BUG FIX (operator revision): the hero is now a LIGHT warm dermoscopy
 * field, not the old dark espresso lattice. Over a light hero the real
 * dark-ink Darst wordmark (logo.png, tone="light") is the legible variant — so
 * the nav now uses tone="light" at the TOP OF PAGE too, correct from first
 * paint, instead of the cream/teal on-dark recreation that vanished over a light
 * hero. Both nav states (transparent-over-hero AND frosted-after-scroll) are
 * light surfaces, so the dark-ink mark + dark-ink text read on both; the only
 * thing that changes on scroll is the bar's frost, not the ink color.
 *
 * Mobile: accessible disclosure menu with focus-visible rings + Esc to close.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { NAP } from "./nap";
import { DarstLogo } from "./DarstLogo";

// Each link maps to a REAL in-page anchor (verified against the section ids).
// "Treatments" gives the high-ticket cosmetic buyer a scent trail to the full
// range; "Visit" lands on the booking section (which carries the NAP + address
// block) rather than dumping to the very bottom footer.
const LINKS = [
  { href: "#credentials", label: "Credentials" },
  { href: "#services", label: "Services" },
  { href: "#treatments", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#book", label: "Visit" },
];

export function SiteNav() {
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // The hero is now a LIGHT field, so the bar is over a light surface in BOTH
  // states. Text/icon stay dark-ink throughout; only the bar's frost + border
  // come in on scroll. `overHero` now just selects the transparent (top) vs
  // frosted (scrolled) surface treatment — NOT a light/dark ink flip.
  const overHero = !scrolled && !open;

  return (
    <motion.header
      initial={prefersReduced ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "glass-strong border-b border-[var(--color-border)]"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        {/* Wordmark — the REAL Darst Dermatology mark (warm-brown brush-script +
            teal). The hero is light, so tone="light" (the canonical logo.png,
            dark-on-transparent) reads correctly over BOTH the transparent hero
            bar and the frosted-paper scrolled bar — legible from first paint.
            (The old code used the on-dark cream/teal recreation over the hero,
            which is the bug: it was near-invisible on a light hero.) */}
        <Link
          href="#top"
          aria-label="Darst Dermatology — home"
          className="group flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-deep)]"
        >
          <DarstLogo tone="light" size="sm" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                // Both states sit on a LIGHT surface now → dark-ink links, with
                // a hover wash that's a touch softer over the transparent hero.
                overHero
                  ? "text-[var(--color-fg-muted)] hover:bg-[oklch(96%_0.008_70_/_0.7)] hover:text-[var(--color-fg)]"
                  : "text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${NAP.phoneTel}`}
            className={cn(
              "hidden rounded-full px-3.5 py-2 text-sm font-semibold tnum transition-colors sm:inline-flex",
              // Dark-ink phone number on both light states (the on-dark white
              // would have been invisible over the new light hero).
              "text-[var(--color-fg)] hover:text-[var(--color-accent-deep)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            {NAP.phoneDisplay}
          </a>
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-deep)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-fg)]",
              "shadow-[0_10px_28px_-14px_oklch(48%_0.082_197_/_0.9)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] active:duration-100",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            Book
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full lg:hidden",
              // Dark-ink toggle on the light hero (was white-on-dark before).
              "text-[var(--color-fg)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="glass-strong border-t border-[var(--color-border)] lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`tel:${NAP.phoneTel}`}
              className="mt-1 rounded-xl px-3 py-3 text-base font-semibold tnum text-[var(--color-accent-deep)]"
            >
              Call {NAP.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
