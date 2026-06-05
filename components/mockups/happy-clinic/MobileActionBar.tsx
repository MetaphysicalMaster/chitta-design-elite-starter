"use client";

/**
 * MobileActionBar — a mobile-only sticky bottom action bar so the conversion
 * path never scrolls away on the device where med-spa traffic actually lives.
 * Two one-tap actions: a pale-yellow "Book in 30s" (the brand's loud hero CTA,
 * navy text — 12.3:1) and a teal-outline "Call". Hidden on lg+, gated for
 * reduced motion (no slide-in), and it reveals only AFTER the hero so it never
 * competes with the hero's own CTA on first paint.
 *
 * Accessibility: real <a>/<Link> targets, focus-visible rings, AA contrast,
 * and a bottom safe-area inset for notched devices.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const PHONE_TEL = "+17207479999";

export function MobileActionBar() {
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Reveal once the user is past the hero (so it doesn't double the hero CTA).
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      aria-label="Quick actions"
      initial={false}
      animate={
        prefersReduced
          ? { opacity: show ? 1 : 0 }
          : { y: show ? 0 : 120, opacity: show ? 1 : 0 }
      }
      transition={{ duration: prefersReduced ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 lg:hidden",
        "glass-strong border-t border-[var(--color-border)] px-4 pt-3",
        !show && "pointer-events-none",
      )}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <Link
          href="#book"
          className={cn(
            "group flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-bold tracking-tight",
            "bg-[var(--color-gold)] text-[var(--color-fg)] shadow-[0_12px_32px_-14px_oklch(86%_0.15_96_/_0.9)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          )}
        >
          Book in 30s
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
        <a
          href={`tel:${PHONE_TEL}`}
          aria-label="Call Happy Clinic Denver"
          className={cn(
            "flex shrink-0 items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold",
            "border border-[var(--color-accent)] text-[var(--color-accent-deep)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          )}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path
              d="M6.6 10.8a13 13 0 0 0 5.6 5.6l1.9-1.9a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.2a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.24 1z"
              fill="currentColor"
            />
          </svg>
          Call
        </a>
      </div>
    </motion.div>
  );
}
