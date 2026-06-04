"use client";

/**
 * Financing — CareCredit callout. Positions premium pricing as accessible
 * without cheapening the brand: a single elegant gold-framed band.
 */

import Link from "next/link";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

export function Financing() {
  return (
    <section
      aria-label="Financing with CareCredit"
      className="relative overflow-hidden bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--glass-border)] bg-[var(--emerald-deep)] p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(50% 120% at 90% 50%, oklch(46% 0.08 88 / 0.55), transparent 70%)",
              }}
            />
            <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow rule-gold inline-block text-[0.7rem] text-[var(--gold)]">
                  Financing
                </p>
                <h2
                  className="font-display mt-4 text-balance text-[var(--color-fg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
                >
                  Luxury, <span className="gold-leaf italic">on your terms.</span>
                </h2>
                <p className="mt-4 text-pretty font-light text-[var(--color-fg-muted)]">
                  We proudly offer <span className="font-normal text-[var(--color-fg)]">CareCredit</span>{" "}
                  financing — flexible monthly plans, including interest-free
                  options, so you can begin your treatment plan now and pay over
                  time. Ask your concierge to apply in minutes.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="#book"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--color-accent-fg)]",
                    "shadow-[0_16px_44px_-16px_oklch(80%_0.13_86_/_0.6)] transition-transform duration-300 hover:-translate-y-0.5",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
                  )}
                >
                  Apply with CareCredit
                  <span aria-hidden>→</span>
                </Link>
                <span className="text-center text-xs text-[var(--color-fg-subtle)] lg:text-left">
                  Subject to credit approval.
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
