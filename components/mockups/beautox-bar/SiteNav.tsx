"use client";

/**
 * SiteNav — sticky glass navigation. Over the dark black bubble-bar hero it's a
 * near-transparent bar with white text + the white martini-syringe mark; once
 * scrolled it frosts to a blush-cream glass with ink text + the charcoal mark.
 * The recreated Beautox Bar logo (martini glass with a syringe — the brand's
 * whole "shots & beauty mingle" pun) anchors it, plus a native "Book" CTA.
 * Mobile: accessible disclosure menu with focus-visible rings + Esc.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { PRIMARY_PHONE_DISPLAY, PRIMARY_PHONE_TEL } from "./nap";
import { BeautoxLogo } from "./BeautoxLogo";

/* Order mirrors the page flow: menu → proof → people → locations → book. The
   team link reads "Our Injectors" (plain trust for the highest-anxiety
   who-holds-the-needle surface) — the section eyebrow keeps the "Behind the
   bar" charm. */
const LINKS = [
  { href: "#services", label: "The Menu" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#team", label: "Our Injectors" },
  { href: "#locations", label: "Locations" },
  { href: "#book", label: "Book" },
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

  // White over the black hero; ink once the blush-cream glass frosts in.
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
        {/* Wordmark — the recreated martini-syringe mark + BEAUTOX BAR serif
            lockup. Tone flips with the surface: white over the black hero,
            charcoal once the blush glass frosts in. */}
        <Link
          href="#top"
          aria-label="Beautox Bar — home"
          className="group flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
        >
          <BeautoxLogo tone={overHero ? "light" : "ink"} size="sm" />
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
                  ? "text-[oklch(92%_0.01_350_/_0.86)] hover:text-[var(--color-bg)]"
                  : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${PRIMARY_PHONE_TEL}`}
            className={cn(
              "hidden rounded-full px-3.5 py-2 text-sm font-semibold tnum transition-colors sm:inline-flex",
              overHero
                ? "text-[var(--color-bg)] hover:text-[var(--color-accent-bright)]"
                : "text-[var(--color-fg)] hover:text-[var(--color-accent-deep)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            {PRIMARY_PHONE_DISPLAY}
          </a>
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full gloss-pill px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-fg)]",
              "shadow-[0_10px_30px_-14px_oklch(60%_0.16_356_/_0.9)] transition-transform duration-300 hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            Book a pour
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
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
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
                className="rounded-xl px-3 py-3 text-base font-medium text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`tel:${PRIMARY_PHONE_TEL}`}
              className="mt-1 rounded-xl px-3 py-3 text-base font-semibold tnum text-[var(--color-accent-deep)]"
            >
              Call {PRIMARY_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
