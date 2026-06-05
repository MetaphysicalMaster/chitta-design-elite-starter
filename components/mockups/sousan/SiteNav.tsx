"use client";

/**
 * SiteNav — sticky glass navigation. Over the DARK emerald caustics hero it's a
 * near-transparent bar with champagne text; once scrolled it frosts to a cream
 * marble glass with emerald-ink text. A gold "S" monogram wordmark + native
 * "Book" CTA. Mobile: accessible disclosure menu with focus-visible rings + Esc.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const PHONE_DISPLAY = "(713) 527-9878";
const PHONE_TEL = "+17135279878";

const LINKS = [
  { href: "#legacy", label: "Since 1995" },
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

  // Text/icon color flips with the surface: champagne over the dark hero,
  // emerald-ink once the marble glass is frosted in.
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
        {/* Wordmark — a gold "S" monogram beside the Playfair name. */}
        <Link
          href="#top"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-deep)]"
        >
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full shadow-[0_6px_18px_-10px_oklch(40%_0.1_164_/_0.6)]"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 25%, oklch(46% 0.12 163), oklch(28% 0.06 166))",
              border: "1px solid oklch(80% 0.1 86 / 0.5)",
            }}
          >
            <span
              className="font-display text-[1.05rem] leading-none"
              style={{ color: "var(--gold-bright)" }}
            >
              S
            </span>
          </span>
          <span
            className={cn(
              "font-display text-lg tracking-tight transition-colors",
              overHero ? "text-[var(--color-bg)]" : "text-[var(--color-fg)]",
            )}
          >
            Sousan
            <span
              className={cn(
                "ml-1.5 align-middle text-[0.62rem] font-sans uppercase tracking-[0.28em]",
                overHero
                  ? "text-[var(--gold)]"
                  : "text-[var(--gold-ink)]",
              )}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Med Spa
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
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                overHero
                  ? "text-[oklch(90%_0.02_110_/_0.86)] hover:text-[var(--color-bg)]"
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
            href={`tel:${PHONE_TEL}`}
            className={cn(
              "hidden rounded-full px-3.5 py-2 text-sm font-semibold tnum transition-colors sm:inline-flex",
              overHero
                ? "text-[var(--color-bg)] hover:text-[var(--gold)]"
                : "text-[var(--color-fg)] hover:text-[var(--color-accent-deep)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
            )}
          >
            {PHONE_DISPLAY}
          </a>
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-deep)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-fg)]",
              "shadow-[0_10px_30px_-14px_oklch(40%_0.1_164_/_0.9)] transition-transform duration-300 hover:-translate-y-0.5",
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
              href={`tel:${PHONE_TEL}`}
              className="mt-1 rounded-xl px-3 py-3 text-base font-semibold tnum text-[var(--color-accent-deep)]"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
