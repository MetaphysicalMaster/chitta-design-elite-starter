"use client";

/**
 * SiteNav — sticky glass navigation. Becomes opaque-glass on scroll.
 * Reserves its own height so there is zero CLS at the top of the page.
 * Includes an accessible mobile drawer.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#story", label: "Our Story" },
  { href: "#membership", label: "Membership" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
];

function Logo({ onDark }: { onDark: boolean }) {
  return (
    <Link
      href="#top"
      className="group flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      aria-label="Blue Sky Med Spa — home"
    >
      <span
        aria-hidden
        className={cn(
          "grid h-9 w-9 place-items-center overflow-hidden rounded-full transition-colors",
          onDark
            ? "bg-white/15 ring-1 ring-white/25 backdrop-blur-md"
            : "bg-[var(--color-accent-subtle)] ring-1 ring-[var(--color-border)]",
        )}
      >
        {/* Brand-faithful mark: champagne sun rising over a clear-sky horizon */}
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <circle cx="12" cy="10.5" r="3.6" fill="var(--gold)" />
          <circle cx="12" cy="10.5" r="5.4" stroke="var(--gold)" strokeWidth="0.9" opacity="0.45" />
          <path
            d="M3.5 16.5c2.4-1.5 4.2-1.9 6.1-1.9 2 0 3.9.7 6 2 1.4-.9 2.7-1.2 4.4-1.2"
            stroke={onDark ? "white" : "var(--color-accent)"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M5.5 19.5c2-1.1 3.6-1.4 5.3-1.4 1.8 0 3.4.6 5.2 1.6"
            stroke={onDark ? "white" : "var(--color-accent)"}
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-lg leading-none tracking-tight transition-colors",
          onDark ? "text-white" : "text-[var(--color-fg)]",
        )}
      >
        Blue&nbsp;Sky
        <span className="ml-1 text-[0.62rem] font-sans font-semibold uppercase tracking-[0.2em] align-middle opacity-70">
          Med Spa
        </span>
      </span>
    </Link>
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onDark = !scrolled && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className={cn(
          "transition-[background,box-shadow,backdrop-filter] duration-500",
          scrolled || open
            ? "glass-strong shadow-[0_1px_0_0_var(--color-border-subtle)]"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
          <Logo onDark={onDark} />

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full",
                    onDark ? "text-white/90 hover:text-white" : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="tel:+16145129665"
              className={cn(
                "hidden text-sm font-medium transition-colors lg:inline",
                onDark ? "text-white/90 hover:text-white" : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
              )}
            >
              (614) 512-9665
            </a>
            <Link
              href="#book"
              className={cn(
                "hidden rounded-full px-5 py-2 text-sm font-semibold transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 sm:inline-flex",
                onDark
                  ? "bg-white text-[var(--color-fg)] hover:shadow-lg"
                  : "bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:shadow-lg",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
              )}
            >
              Book Now
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full md:hidden",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
                onDark ? "text-white" : "text-[var(--color-fg)]",
              )}
            >
              <span className="relative block h-4 w-5" aria-hidden>
                <span className={cn("absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
                <span className={cn("absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300", open ? "opacity-0" : "opacity-100")} />
                <span className={cn("absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong border-t border-[var(--color-border-subtle)] md:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-accent-subtle)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2">
                <Link
                  href="#book"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-center text-sm font-semibold text-[var(--color-accent-fg)]"
                >
                  Book Now
                </Link>
                <a
                  href="tel:+16145129665"
                  className="rounded-full border border-[var(--color-border)] px-5 py-3 text-center text-sm font-medium text-[var(--color-fg)]"
                >
                  Call (614) 512-9665
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
