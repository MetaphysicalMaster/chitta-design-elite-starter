"use client";

/**
 * Doctor — the "Meet Dr. Londeree" credibility section. Leads hard on the
 * brand's crown jewel: academic authority + OSU faculty role. A refined
 * portrait placeholder (initials monogram, clearly not a stock photo) keeps
 * the layout honest while reading as premium.
 */

import { Section, Reveal } from "./primitives";
import { motion, useReducedMotion } from "motion/react";

const CREDS = [
  { v: "MD", k: "Doctor of Medicine, board-certified" },
  { v: "OSU", k: "Associate Professor of Dermatology" },
  { v: "2010", k: "Founded Encore Dermatology" },
];

export function Doctor() {
  const prefersReduced = useReducedMotion();
  return (
    <Section id="doctor" labelledBy="doctor-heading">
      <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1fr]">
        {/* Portrait monogram */}
        <Reveal className="order-2 md:order-1">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-deep)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_18%,oklch(82%_0.1_84_/_0.18),transparent_60%)]"
            />
            <motion.div
              aria-hidden
              animate={prefersReduced ? {} : { rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--gold)]/30"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="font-display text-7xl text-[var(--gold)]">GL</span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]">
                Portrait · sample
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 border-t border-[var(--glass-border)] bg-[var(--glass-bg-strong)] px-6 py-4 backdrop-blur-md">
              <p className="font-display text-lg text-[var(--color-fg)]">
                Dr. Gwyn Londeree, MD
              </p>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                Founder · Board-Certified Dermatologist
              </p>
            </div>
          </div>
        </Reveal>

        {/* Narrative */}
        <div className="order-1 md:order-2">
          <Reveal>
            <span className="rule-gold text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]">
              The crown jewel
            </span>
            <h2
              id="doctor-heading"
              className="mt-4 font-display text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
            >
              Care from a dermatologist who{" "}
              <span className="italic">teaches dermatology.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[52ch] text-pretty font-light leading-relaxed text-[var(--color-fg-muted)]">
              Dr. Gwyn Londeree isn&rsquo;t only a board-certified
              dermatologist — she&rsquo;s an{" "}
              <span className="font-medium text-[var(--color-fg)]">
                Associate Professor of Dermatology at the Ohio State University
                College of Medicine
              </span>
              , training the next generation of skin specialists. When you sit in
              her chair, you receive the same standard she sets for the
              physicians she teaches.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <dl className="mt-9 grid grid-cols-3 gap-4">
              {CREDS.map((c) => (
                <div
                  key={c.k}
                  className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]/50 p-4"
                >
                  <dt className="font-display text-2xl text-[var(--gold)]">
                    {c.v}
                  </dt>
                  <dd className="mt-1.5 text-[0.7rem] leading-snug text-[var(--color-fg-subtle)]">
                    {c.k}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
