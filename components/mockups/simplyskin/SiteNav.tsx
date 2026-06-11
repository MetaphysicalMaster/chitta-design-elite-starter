"use client";

/**
 * SiteNav — sticky glass navigation. Over the warm photo-led hero it's a
 * near-transparent hairline bar; once scrolled it frosts to airy warm glass.
 * The wordmark is the recreated SimplySkin identity: a thin, light, two-tone
 * "SimplySkin" with a smaller, quieter "MedSpa" — elegant and understated, no
 * heavy chrome. Mobile: accessible disclosure menu with focus-visible rings +
 * Esc to close. Dark warm-charcoal text throughout (the hero is light).
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Wordmark } from "./primitives";
import { Magnetic } from "./experience";

const PHONE_DISPLAY = "(317) 348-1313";
const PHONE_TEL = "+13173481313";

const LINKS = [
  { href: "#locations", label: "Locations" },
  { href: "#authority", label: "Our Approach" },
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
        {/* Wordmark — the recreated thin two-tone SimplySkin identity. */}
        <Link
          href="#top"
          aria-label="SimplySkin MedSpa — home"
          className="group flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
        >
          <Wordmark />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                // ss-navlink: a quiet hairline grows from the left on hover —
                // the editorial micro-signature, not a pill fill.
                "ss-navlink rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
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
            href={`tel:${PHONE_TEL}`}
            className={cn(
              "hidden rounded-full px-3.5 py-2 text-sm font-semibold tnum transition-colors text-[var(--color-fg)] sm:inline-flex",
              "hover:text-[var(--color-accent-deep)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            {PHONE_DISPLAY}
          </a>
          <Magnetic strength={0.14}>
            <Link
              href="#book"
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-fg)]",
                "shadow-[0_10px_30px_-16px_oklch(58%_0.04_184_/_0.7)] transition-transform duration-300 hover:-translate-y-0.5",
                "active:translate-y-0 active:scale-[0.97] active:duration-150",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
              )}
            >
              Book
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          </Magnetic>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full text-[var(--color-fg)] lg:hidden",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
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
                className="rounded-xl px-3 py-3 text-base font-medium text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
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
