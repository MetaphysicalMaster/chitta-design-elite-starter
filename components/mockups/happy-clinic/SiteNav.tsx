"use client";

/**
 * SiteNav — sticky glass navigation. Transparent over the dark navy hero
 * (white logo), frosts to a light glass bar once scrolled (pine-teal logo).
 * Pale-yellow native Book CTA with dark text (the live site's button color).
 * Mobile: accessible disclosure menu with focus-visible rings + Esc to close.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { HappyLogo } from "./HappyLogo";

const PHONE_DISPLAY = "720-747-9999";
const PHONE_TEL = "+17207479999";

const LINKS = [
  { href: "#authority", label: "Dr. Phil" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Real Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#financing", label: "Financing" },
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
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
        {/* Wordmark — the real spiral mark + two-line Happy Clinic Denver */}
        <Link
          href="#top"
          aria-label="Happy Clinic Denver — home"
          className="group flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
        >
          <HappyLogo tone={scrolled ? "light" : "dark"} size="sm" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              // hc-navlink: underline grows from the left on enter, exits to
              // the right on leave — directional, not a flat fade (brand.css).
              className={cn(
                "hc-navlink rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                scrolled
                  ? "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                  : "text-white/85 hover:text-white",
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
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
              scrolled ? "text-[var(--color-accent-deep)]" : "text-white",
            )}
          >
            {PHONE_DISPLAY}
          </a>
          <Link
            href="#book"
            className={cn(
              "hc-press group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight",
              "hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              // At the TOP (over the navy hero) keep exactly ONE filled CTA — the
              // yellow hero button — by demoting this to a glass/outline pill so
              // the eye isn't split between two competing primaries ~50px apart.
              // Once scrolled, restore the solid pine-teal pill where it becomes
              // the persistent primary.
              scrolled
                ? "border border-transparent bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_10px_30px_-12px_oklch(52%_0.087_178_/_0.9)] hover:bg-[var(--color-accent-deep)]"
                : "border border-white/35 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
            )}
          >
            Book Now
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
              "grid h-10 w-10 place-items-center rounded-full lg:hidden",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
              scrolled ? "text-[var(--color-fg)]" : "text-white",
            )}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
