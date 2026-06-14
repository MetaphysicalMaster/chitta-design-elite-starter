"use client";

/**
 * SiteNav — sticky glass navigation with the recreated brand TREE wordmark and
 * a prominent NATIVE "Book Appointment" CTA (replaces the real site's external
 * scheduling handoff). Condenses on scroll, opens a full-screen menu on mobile,
 * fully keyboard-accessible. Light theme, teal accent.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { EncoreMark } from "./primitives";
import { PRACTICE } from "./nap";
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
      className="group flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--clinical)]"
      aria-label="Encore Dermatology — home"
    >
      <EncoreMark className="h-8 w-8 flex-none" leafTone="var(--leaf)" inkTone="var(--bark)" />
      <span className="flex items-baseline gap-2">
        <span className="font-display text-xl tracking-tight text-[var(--color-fg)]">
          Encore
        </span>
        <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--clinical)] sm:inline">
          Dermatology
        </span>
      </span>
    </Link>
  );
}

export function SiteNav() {
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Coalesce scroll work into one rAF and only setState when the boolean
    // actually flips — avoids a React re-render on every scroll frame.
    let raf = 0;
    let ticking = false;
    const measure = () => {
      ticking = false;
      const next = window.scrollY > 24;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

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
      {/* Reading-progress hairline */}
      <motion.div
        aria-hidden
        style={{ scaleX: prefersReduced ? 1 : progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-[var(--clinical-deep)] via-[var(--clinical)] to-[var(--leaf)]"
      />
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
              className="rounded-full px-3.5 py-2 text-sm font-medium text-[var(--color-fg-muted)] transition-colors duration-200 hover:text-[var(--clinical-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={PRACTICE.phoneHref}
            className="hidden items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-[var(--color-fg-muted)] transition-colors hover:text-[var(--clinical-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)] md:inline-flex"
          >
            <span aria-hidden>☎</span>
            <span className="[font-variant-numeric:tabular-nums]">{PRACTICE.phoneDisplay}</span>
          </a>
          <Link
            href="#book"
            className={cn(
              "hidden items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-fg)] sm:inline-flex",
              "shadow-[0_12px_28px_-12px_oklch(58%_0.094_197_/_0.7)] transition-[transform,box-shadow] duration-300",
              "hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-12px_oklch(58%_0.094_197_/_0.85)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)]",
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--color-fg)] backdrop-blur-md transition-colors hover:bg-[var(--glass-bg-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)] lg:hidden"
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
                className="rounded-2xl px-4 py-3 text-base font-medium text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-accent-subtle)] hover:text-[var(--clinical-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)]"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={PRACTICE.phoneHref}
              className="mt-1 rounded-2xl px-4 py-3 text-base font-medium text-[var(--color-fg-muted)]"
            >
              ☎ {PRACTICE.phoneDisplay}
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
