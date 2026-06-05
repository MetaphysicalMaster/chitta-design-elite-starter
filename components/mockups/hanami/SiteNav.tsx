"use client";

/**
 * SiteNav — sticky glass navigation. The hero is SUMI-BLACK, so the bar stays a
 * frosted rice-paper glass in both states (the real black Hanami logo.png + ink
 * text always read); the frost just deepens on scroll. The REAL logo.png (black
 * script "Hanami" + cherry-blossom branch + MEDSPA) is the wordmark — not a
 * hand-built SVG. Display Abel + Open Sans body. Native sumi-black "Book" CTA.
 * Mobile: accessible disclosure menu with focus-visible rings + Esc to close.
 */

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const PHONE_DISPLAY = "(817) 808-8938";
const PHONE_TEL = "+18178088938";

const LINKS = [
  { href: "#philosophy", label: "Philosophy" },
  { href: "#injector", label: "Dr. Phuah" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#awards", label: "Awards" },
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

  return (
    <motion.header
      initial={prefersReduced ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        // The hero is sumi-black, so the bar stays frosted rice-paper in BOTH
        // states (the real black logo + ink text always read); the frost just
        // deepens on scroll.
        scrolled
          ? "glass-strong border-b border-[var(--color-border)]"
          : "glass border-b border-[var(--glass-border)]",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        {/* Wordmark — the REAL Hanami logo (black script + cherry-blossom branch
            + MEDSPA), wired via next/image. Transparent PNG reads cleanly on the
            light glass nav. */}
        <Link
          href="#top"
          aria-label="Hanami Medspa — home"
          className="group flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-deep)]"
        >
          <Image
            src="/clients/hanami/logo.png"
            alt="Hanami Medspa"
            width={880}
            height={220}
            priority
            sizes="(min-width: 640px) 13rem, 10.5rem"
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]",
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
            href={`tel:${PHONE_TEL}`}
            className={cn(
              "hidden rounded-full px-3.5 py-2 text-sm font-semibold tnum text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent-deep)] sm:inline-flex",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            {PHONE_DISPLAY}
          </a>
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-deep)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)]",
              "shadow-[0_10px_30px_-14px_oklch(16%_0.003_60_/_0.9)] ring-1 ring-[oklch(82%_0.09_88_/_0.25)] transition-transform duration-300 hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            Book
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 text-[var(--color-accent-bright)]">→</span>
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full text-[var(--color-fg)] lg:hidden",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
