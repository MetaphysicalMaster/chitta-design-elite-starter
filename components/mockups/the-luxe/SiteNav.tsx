"use client";

/**
 * SiteNav — sticky frosted-ivory nav. Recreated GOLD SCRIPT "The Luxe" + small
 * uppercase "MEDSPA" lockup (the live wordmark), section links + a prominent
 * NATIVE "Book Now" CTA. Condenses on scroll; accessible mobile drawer.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { href: "#story", label: "The Spa" },
  { href: "#services", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#team", label: "Our Team" },
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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        <div
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-full px-4 py-2 transition-all duration-300 sm:px-5",
            scrolled
              ? "glass-strong shadow-[var(--glass-shadow)]"
              : "border border-transparent",
          )}
        >
          {/* Wordmark */}
          <Link
            href="#top"
            className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-deep)]"
            aria-label="The Luxe MedSpa — home"
          >
            <Wordmark className="h-9 w-auto sm:h-10" />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.slice(0, 4).map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-[var(--color-fg-muted)] transition-colors duration-200 hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+16144532056"
              className="hidden rounded-full px-3.5 py-2 text-sm font-medium tnum text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)] sm:inline-flex"
            >
              (614)&nbsp;453-2056
            </a>
            <Link
              href="#book"
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold",
                "bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
                "shadow-[0_10px_26px_-12px_oklch(70%_0.12_78_/_0.65)]",
                "transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-fg)]",
              )}
            >
              Book Now
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="luxe-mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--color-fg)] transition-colors hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)] lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300",
                    open ? "top-1.5 rotate-45" : "top-0.5",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-opacity duration-200",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300",
                    open ? "top-1.5 -rotate-45" : "top-2.5",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="luxe-mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: prefersReduced ? 0 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-4 overflow-hidden rounded-3xl lg:hidden"
          >
            <ul className="glass-strong flex flex-col gap-1 rounded-3xl p-3 shadow-[var(--glass-shadow)]">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-bg-subtle)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="px-1 pt-1">
                <a
                  href="tel:+16144532056"
                  className="block rounded-2xl px-4 py-3 text-sm font-medium tnum text-[var(--color-fg-muted)]"
                >
                  Call (614) 453-2056
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
