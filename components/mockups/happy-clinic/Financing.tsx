"use client";

/**
 * Financing — CareCredit / Cherry financing + the live site's "$25 refer a
 * friend" reward. Removes the price objection with a confident band: pay over
 * time, transparent, on every treatment. Recolored to the real navy/teal/gold
 * brand; the refer-a-friend chip uses the pale-yellow accent (dark text).
 */

import Link from "next/link";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const POINTS = [
  "0% promotional financing available on qualifying treatments",
  "Apply in minutes — a decision before your appointment",
  "Give $25, get $25 when you refer a friend to Happy Clinic",
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
            {/* teal→gold accent corner */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-2xl"
              style={{ background: "radial-gradient(circle, var(--color-gold), var(--color-accent) 70%, transparent 72%)" }}
            />
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="rule-aurora inline-block text-xs font-semibold uppercase tracking-[0.24em] text-accent-deep">
                  Transparent pricing &amp; financing
                </p>
                <h2
                  className="font-heading mt-4 text-balance text-[var(--color-fg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
                >
                  Premium care, never{" "}
                  <span className="font-display-em text-[var(--color-accent-deep)]">out of reach.</span>
                </h2>
                <p className="mt-4 max-w-lg text-pretty text-[var(--color-fg-muted)]" style={{ fontSize: "var(--fluid-lead)" }}>
                  Honest, transparent Botox at{" "}
                  <span className="font-semibold text-[var(--color-fg)] tnum">$9 per unit</span> —
                  no membership, no gimmicks. For larger plans, flexible financing
                  through{" "}
                  <span className="font-semibold text-[var(--color-fg)]">CareCredit</span> and
                  Cherry keeps physician-led care within reach.
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {POINTS.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-[var(--color-fg)]">
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[var(--color-accent-fg)]"
                        style={{ background: "var(--color-accent)" }}
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
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
                  Estimate a sample plan
                </p>
                <p className="font-heading text-4xl font-bold tnum text-[var(--color-fg)]">
                  From $79<span className="text-base font-medium text-[var(--color-fg-muted)]">/mo</span>
                </p>
                <p className="text-xs text-[var(--color-fg-subtle)]">
                  e.g. $948 plan · 12 months · subject to credit approval. Sample figure.
                </p>
                <span className="mt-1 w-fit rounded-full border border-[var(--color-gold-deep)]/45 bg-[var(--color-gold)]/15 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-deep)]">
                  + Refer &amp; save $25
                </span>
                <Link
                  href="#book"
                  className={cn(
                    "hc-press mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-[var(--color-accent-fg)]",
                    "shadow-[0_14px_38px_-16px_oklch(52%_0.087_178_/_0.85)]",
                    "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                  )}
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
