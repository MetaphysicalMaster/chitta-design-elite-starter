"use client";

/**
 * SiteNav — sticky glass navigation. Over the DARK monochrome hero it's a
 * near-transparent bar with white text; once scrolled it frosts to a clean
 * white glass with near-black ink. The wordmark is the recreated Sousan
 * identity: an elegant black SCRIPT "Sousan" with "MED SPA" in small
 * letter-spaced caps beneath (the live brand mark, CSS/typography only).
 * Mobile: accessible disclosure menu with focus-visible rings + Esc.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { NAP } from "./nap";

const LINKS = [
  { href: "#awards", label: "Awards" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
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

  // Text/icon color flips with the surface: white over the dark hero,
  // near-black ink once the white glass is frosted in.
  const overHero = !scrolled && !open;

  return (
    <motion.header
      initial={prefersReduced ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
        {/* Wordmark — the recreated Sousan mark: elegant script "Sousan" with
            "MED SPA" letter-spaced caps beneath. Tone flips over the dark hero. */}
        <Link
          href="#top"
          aria-label="Sousan Med Spa — home"
          className="group flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-deep)]"
        >
          <span
            className={cn(
              "sn-wordmark",
              overHero && "sn-wordmark--on-dark",
            )}
          >
            <span className="sn-wordmark__script text-[2.1rem] leading-none">
              Sousan
            </span>
            <span className="sn-wordmark__caps text-[0.52rem] leading-none">
              Med&nbsp;Spa
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "sn-navlink rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                overHero
                  ? "text-[oklch(92%_0_0_/_0.88)] hover:text-[var(--color-bg)]"
                  : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
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
              overHero
                ? "text-[var(--color-bg)] hover:text-[var(--gold)]"
                : "text-[var(--color-fg)] hover:text-[var(--color-accent-deep)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
            )}
          >
            {NAP.phoneDisplay}
          </a>
          <Link
            href="#book"
            className={cn(
              "sn-press group inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-deep)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-fg)]",
              "shadow-[0_10px_30px_-14px_oklch(51%_0.22_357_/_0.85)] transition-transform duration-300 hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
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
              overHero ? "text-[var(--color-bg)]" : "text-[var(--color-fg)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
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
                className="rounded-xl px-3 py-3 text-base font-medium text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
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
