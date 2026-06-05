"use client";

/**
 * SiteNav — sticky glass navigation. Over the light dawn hero it's a
 * near-transparent hairline bar with sumi-ink text; once scrolled it frosts to
 * a rice-paper glass. A quiet sakura-petal wordmark mark + native "Book" CTA.
 * Mobile: accessible disclosure menu with focus-visible rings + Esc to close.
 *
 * (The hero is LIGHT, so unlike the dark-hero sibling this nav keeps ink text in
 * BOTH states — only the surface frost changes on scroll.)
 */

import Link from "next/link";
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
  { href: "#proof", label: "Reviews" },
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
        scrolled
          ? "glass-strong border-b border-[var(--color-border)]"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        {/* Wordmark — a soft sakura-petal mark beside the Mincho name. */}
        <Link
          href="#top"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-deep)]"
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--sakura)]/60 shadow-[0_6px_18px_-10px_oklch(64%_0.15_356_/_0.5)]"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 25%, oklch(96% 0.03 352), oklch(86% 0.09 354))",
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" width="18" height="18" fill="none" aria-hidden>
              {/* five-petal blossom */}
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="12"
                  cy="6.6"
                  rx="2.5"
                  ry="4.2"
                  transform={`rotate(${a} 12 12)`}
                  fill="var(--color-accent-deep)"
                  opacity="0.85"
                />
              ))}
              <circle cx="12" cy="12" r="1.5" fill="oklch(95% 0.04 352)" />
            </svg>
          </span>
          <span className="font-display text-lg tracking-tight text-[var(--color-fg)]">
            Hanami
            <span className="text-[var(--color-accent-deep)]"> 花見</span>
          </span>
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
              "group inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-deep)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-fg)]",
              "shadow-[0_10px_30px_-14px_oklch(60%_0.15_356_/_0.85)] transition-transform duration-300 hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            Book
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
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
