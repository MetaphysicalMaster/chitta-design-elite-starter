"use client";

/**
 * Financing — a quiet, reassuring callout. Insurance for medical dermatology,
 * transparent financing for elective cosmetic care. Restrained, no hard sell —
 * the academic voice. Reduced-motion safe; AA contrast on the paper wash.
 */

import { Reveal, ctaGhost } from "./primitives";
import Link from "next/link";

const POINTS = [
  {
    t: "Most insurance accepted",
    d: "Medical and surgical dermatology — screenings, biopsies, treatment of skin disease — billed to your plan.",
  },
  {
    t: "Transparent cosmetic pricing",
    d: "Elective cosmetic, laser and injectable care is quoted up front, with no surprise add-ons.",
  },
  {
    t: "Flexible financing",
    d: "Pay-over-time options available for qualifying elective treatments, explained plainly at consult.",
  },
];

export function Financing() {
  return (
    <section
      aria-labelledby="financing-title"
      className="bg-[var(--color-bg-wash)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow rule-accent text-[var(--color-accent-deep)]">
              Access & cost
            </p>
            <h2
              id="financing-title"
              className="font-display mt-5 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.08 }}
            >
              Expert care, made straightforward to access.
            </h2>
            <p className="mt-5 max-w-[44ch] text-pretty font-light text-[var(--color-fg-muted)]">
              Medical dermatology is healthcare, not a luxury. We keep coverage
              and cost clear so the only thing to weigh is getting seen.
            </p>
            <Link href="#book" className={`mt-7 ${ctaGhost}`}>
              Ask about coverage
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="grid gap-3 sm:grid-cols-1">
              {POINTS.map((p) => (
                <li
                  key={p.t}
                  className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                      <path
                        d="M5 12.5l4 4 10-10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>
                    <span className="font-display text-lg text-[var(--color-fg)]">
                      {p.t}
                    </span>
                    <span className="mt-1 block text-[0.92rem] leading-relaxed text-[var(--color-fg-muted)]">
                      {p.d}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
