"use client";

/**
 * MobileBookingBar — a thumb-reachable, mobile-only sticky booking bar. This
 * audience (women, mobile-first, impulse + considered aesthetics buying) books
 * on a tap, so every scroll-depth without a reachable Book button leaks intent.
 *
 * Behaviour:
 *  - Mobile only (hidden ≥ lg, where the sticky nav CTA is always in reach).
 *  - Appears once the hero (#top) scrolls out of view, so it never competes with
 *    the hero's own "Book a pour" CTA.
 *  - Hides again once the booking module (#book) is in view — no redundant bar
 *    sitting over the very thing it points at.
 *  - Split action: a glossy "Book a pour" pill (→ #book) + a "Text us" button
 *    (the real sms: fast lane this audience actually uses).
 *  - Respects safe-area-inset-bottom (iOS home indicator) + reduced-motion.
 *
 * Pure-additive: it observes existing #top / #book anchors and renders nothing
 * until the hero has passed, so there is zero layout/CLS impact up top.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PRIMARY_PHONE_TEL } from "./nap";

export function MobileBookingBar() {
  const prefersReduced = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [atBooking, setAtBooking] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const book = document.getElementById("book");
    if (!hero) return;

    const heroObs = new IntersectionObserver(
      ([e]) => setPastHero(!e.isIntersecting),
      { rootMargin: "-40% 0px 0px 0px" },
    );
    heroObs.observe(hero);

    let bookObs: IntersectionObserver | undefined;
    if (book) {
      bookObs = new IntersectionObserver(
        ([e]) => setAtBooking(e.isIntersecting),
        { rootMargin: "0px 0px -20% 0px" },
      );
      bookObs.observe(book);
    }

    return () => {
      heroObs.disconnect();
      bookObs?.disconnect();
    };
  }, []);

  const show = pastHero && !atBooking;

  return (
    <motion.div
      aria-hidden={!show}
      initial={false}
      animate={
        prefersReduced
          ? { opacity: show ? 1 : 0 }
          : { y: show ? 0 : 120, opacity: show ? 1 : 0 }
      }
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <div
        className="glass-strong border-t border-[var(--color-border)] px-4 pt-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-xl items-center gap-2.5">
          <Link
            href="#book"
            tabIndex={show ? 0 : -1}
            className="group inline-flex flex-1 items-center justify-center gap-1.5 rounded-full gloss-pill px-5 py-3 text-sm font-semibold text-[var(--color-accent-fg)] shadow-[0_10px_30px_-14px_oklch(60%_0.16_356_/_0.9)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Book a pour
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
          <a
            href={`sms:${PRIMARY_PHONE_TEL}`}
            tabIndex={show ? 0 : -1}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-deep)] transition-colors hover:bg-[var(--color-accent-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            Text us
          </a>
        </div>
      </div>
    </motion.div>
  );
}
