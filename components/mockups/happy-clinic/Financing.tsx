"use client";

/**
 * Financing — CareCredit / Cherry financing callout. Removes the price
 * objection with a confident aurora band: pay-over-time, transparent, on every
 * treatment.
 */

import Link from "next/link";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const POINTS = [
  "0% promotional financing available on qualifying treatments",
  "Apply in minutes — a decision before your appointment",
  "Member pricing & loyalty rewards on Botox & Juvéderm",
];

export function Financing() {
  return (
    <section
      id="financing"
      className="relative scroll-mt-20 overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-accent)]/30 bg-[var(--color-bg-elevated)] p-8 shadow-[var(--glass-shadow)] sm:p-10 lg:p-12">
            {/* aurora accent corner */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-2xl"
              style={{ background: "radial-gradient(circle, var(--color-accent-bright), var(--color-teal) 70%, transparent 72%)" }}
            />
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="rule-aurora inline-block text-xs font-semibold uppercase tracking-[0.24em] text-accent-deep">
                  Financing & rewards
                </p>
                <h2
                  className="font-display mt-4 text-balance text-[var(--color-fg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05, fontWeight: 600 }}
                >
                  Premium care, on your timeline.
                </h2>
                <p className="mt-4 max-w-lg text-pretty text-[var(--color-fg-muted)]" style={{ fontSize: "var(--fluid-lead)" }}>
                  Flexible financing through{" "}
                  <span className="font-semibold text-[var(--color-fg)]">CareCredit</span> and
                  Cherry, plus Allergan&rsquo;s{" "}
                  <span className="font-semibold text-[var(--color-fg)]">Allē rewards</span> on
                  every Botox &amp; Juvéderm visit — so the right plan is never out of reach.
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {POINTS.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-[var(--color-fg)]">
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[var(--color-accent-fg)]"
                        style={{ background: "linear-gradient(135deg, var(--color-accent), var(--color-teal))" }}
                      >
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
                          <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
                <p className="text-sm text-[var(--color-fg-muted)]">Estimate a sample plan</p>
                <p className="font-display text-3xl font-semibold tnum text-[var(--color-fg)]">
                  $79<span className="text-base font-medium text-[var(--color-fg-muted)]">/mo</span>
                </p>
                <p className="text-xs text-[var(--color-fg-subtle)]">
                  e.g. $948 plan · 12 months · subject to credit approval. Sample figure.
                </p>
                <Link
                  href="#book"
                  className={cn(
                    "mt-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-[var(--color-accent-fg)]",
                    "transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                  )}
                  style={{ background: "linear-gradient(120deg, var(--color-accent), var(--color-teal-deep))" }}
                >
                  Pre-qualify &amp; book
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
