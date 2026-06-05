"use client";

/**
 * PeakCTA — a single mid-page conversion moment, placed at PEAK TRUST: right
 * after the real Charlotte Magazine Top Doctor + board-cert proof. A high-intent
 * buyer sold by the credentials no longer has to scroll the entire clinical
 * narrative to reach the bottom-of-page booking funnel.
 *
 * Tone is deliberately WARM (the coral note + warm paper), not the clinical dark
 * — it carries the human/aesthetic register and the dual promise: the physician
 * who reads the slide is the same one who treats you. Reduced-motion safe; AA.
 */

import Link from "next/link";
import { Reveal } from "./primitives";
import { NAP } from "./nap";

export function PeakCTA() {
  return (
    <section aria-labelledby="peak-cta-title" className="bg-[var(--color-bg)] pb-4">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] px-7 py-8 sm:px-10 sm:py-9"
            style={{
              background:
                "linear-gradient(125deg, var(--color-coral-subtle) 0%, var(--color-bg-elevated) 46%, var(--color-accent-subtle) 100%)",
            }}
          >
            {/* coral warmth rail — the aesthetic/human note */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-coral), var(--color-accent))",
              }}
            />
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              <div className="max-w-[44ch]">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-coral-deep)]">
                  Seen by Dr. Darst
                </p>
                <h2
                  id="peak-cta-title"
                  className="font-display mt-2 text-balance text-[1.55rem] leading-tight text-[var(--color-fg)] sm:text-[1.9rem]"
                >
                  Medical-grade results, read by the physician who treats you.
                </h2>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                <Link
                  href="#book"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent-deep)] px-7 py-3.5 font-medium text-[var(--color-accent-fg)] shadow-[0_16px_40px_-16px_oklch(48%_0.082_197_/_0.6)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_54px_-14px_oklch(48%_0.082_197_/_0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
                >
                  Book your visit
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
                <a
                  href={`tel:${NAP.phoneTel}`}
                  className="text-[0.85rem] font-semibold text-[var(--color-fg-muted)] underline-offset-4 hover:text-[var(--color-fg)] hover:underline tnum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
                >
                  or call {NAP.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
