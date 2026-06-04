"use client";

/**
 * SiteNav — sticky glass navigation with a prominent NATIVE "Book Appointment"
 * CTA (replaces the real site's Zocdoc handoff). Condenses on scroll, opens a
 * full-screen menu on mobile, and is fully keyboard-accessible.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#paths", label: "Care Paths" },
  { href: "#medical", label: "Medical" },
  { href: "#spa", label: "The Spa" },
  { href: "#results", label: "Results" },
  { href: "#doctor", label: "Dr. Londeree" },
  { href: "#book", label: "Book" },
];

function Wordmark() {
  return (
    <Link
      href="#top"
      className="group flex items-baseline gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]"
      aria-label="Encore Dermatology — home"
    >
      <span className="font-display text-xl tracking-tight text-[var(--color-fg)]">
        Encore
      </span>
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--gold)]">
        Dermatology
      </span>
    </Link>
  );
}

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

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: prefersReduced ? 0 : -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-7",
          scrolled
            ? "my-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] py-2.5 shadow-[var(--glass-shadow)] backdrop-blur-xl"
            : "my-4 py-3",
        )}
      >
        <Wordmark />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {LINKS.slice(0, 5).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-[var(--color-fg-muted)] transition-colors duration-200 hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="tel:+16144421012"
            className="hidden items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] md:inline-flex"
          >
            <span aria-hidden>☎</span>
            <span className="tabular-nums">(614) 442-1012</span>
          </a>
          <Link
            href="#book"
            className={cn(
              "hidden items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-fg)] sm:inline-flex",
              "shadow-[0_12px_30px_-12px_oklch(82%_0.1_84_/_0.6)] transition-[transform,box-shadow] duration-300",
              "hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_oklch(82%_0.1_84_/_0.75)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]",
            )}
          >
            Book Appointment
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--color-fg)] backdrop-blur-md transition-colors hover:bg-[var(--glass-bg-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] lg:hidden"
          >
            <span aria-hidden className="text-lg leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" },
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="lg:hidden"
      >
        <div className="mx-3 mt-2 overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] p-4 shadow-[var(--glass-shadow)] backdrop-blur-xl">
          <nav aria-label="Mobile" className="flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--glass-bg)] hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+16144421012"
              className="mt-1 rounded-2xl px-4 py-3 text-base font-medium text-[var(--color-fg-muted)]"
            >
              ☎ (614) 442-1012
            </a>
            <Link
              href="#book"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-base font-semibold text-[var(--color-accent-fg)]"
            >
              Book Appointment
            </Link>
          </nav>
        </div>
      </motion.div>
    </motion.header>
  );
}
