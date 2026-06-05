"use client";

/**
 * TheCloser — the conversion centerpiece, placed high so the upgrade story lands
 * before the menu. It pairs the 221-review proof wall stat with the single
 * biggest win of the rebuild: REAL online booking that ends the phone-only era.
 *
 * The pitch made literal: today the only way to book Eternity is to call during
 * business hours (the legacy WordPress site has no scheduler). This section shows
 * the before → after — a struck-through "Call (314) 469-2946 during hours"
 * against a live "Book online, 24/7" — so the prospect sees exactly what they
 * gain. Reduced-motion safe; sits on the deepest night so it reads as the hinge
 * of the page.
 */

import Link from "next/link";
import { Reveal, RevealGroup, RevealItem, Magnetic } from "./primitives";
import { BRAND } from "./nap";
import { cn } from "@/lib/utils";

const UPGRADES = [
  {
    label: "Booking",
    before: "Phone only, during business hours",
    after: "Online, 24/7 — book in 30 seconds",
  },
  {
    label: "The website",
    before: `Blog theme on ${BRAND.legacyDomain}`,
    after: `A flagship at ${BRAND.domain}`,
  },
  {
    label: "After-hours leads",
    before: "Voicemail, then phone tag",
    after: "Self-serve scheduling that never sleeps",
  },
];

export function TheCloser() {
  return (
    <section
      id="online-booking"
      className="scroll-mt-20 bg-[var(--night-0)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left — the proof + the argument */}
          <div>
            <Reveal>
              <p className="eyebrow rule-infinity inline-block text-[var(--color-accent-bright)]">
                The upgrade
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="mt-5 font-display text-balance text-[var(--color-fg)]"
                style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
              >
                <span className="silver-text tnum">221</span> reasons to trust us
                — and finally a way to{" "}
                <span className="font-display-em silver-text">book online.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p
                className="mt-5 max-w-xl text-pretty font-light text-[var(--color-fg-muted)]"
                style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.62 }}
              >
                Eighteen years of mastery earned {BRAND.reviews} reviews at{" "}
                {BRAND.rating}★. The one thing missing was a way to reserve a
                visit without calling. That ends here — a native scheduler, open
                around the clock, so the phone-tag era is over.
              </p>
            </Reveal>

            {/* Before / after upgrade ledger */}
            <RevealGroup className="mt-9 flex flex-col gap-3.5" stagger={0.08}>
              {UPGRADES.map((u) => (
                <RevealItem
                  as="div"
                  key={u.label}
                  className="grid grid-cols-1 gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--night-2)] p-5 sm:grid-cols-[7rem_1fr]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-bright)]">
                    {u.label}
                  </span>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <span className="flex items-center gap-2 text-[var(--color-fg-subtle)] line-through decoration-[var(--color-error)]/70">
                      <span aria-hidden className="text-[var(--color-error)]">
                        ✕
                      </span>
                      {u.before}
                    </span>
                    <span className="flex items-center gap-2 font-medium text-[var(--color-fg)]">
                      <span aria-hidden className="text-[var(--color-success)]">
                        ✓
                      </span>
                      {u.after}
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* Right — the before/after booking panel */}
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[1.75rem] border border-[var(--glass-border)] bg-[var(--night-2)] shadow-[var(--glass-shadow)]">
              {/* OLD WAY */}
              <div className="border-b border-[var(--color-border)] bg-[var(--night-1)] p-6 sm:p-7">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]">
                  Today · the only way to book
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-fg-subtle)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                      <path
                        d="M6.5 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A15 15 0 014.5 6a2 2 0 012-2z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-display text-xl text-[var(--color-fg-muted)] line-through decoration-[var(--color-fg-subtle)]/60 tnum">
                      {BRAND.phone}
                    </p>
                    <p className="text-xs text-[var(--color-fg-subtle)]">
                      Calls only · during business hours
                    </p>
                  </div>
                </div>
              </div>

              {/* NEW WAY */}
              <div className="relative p-6 sm:p-7">
                <span
                  aria-hidden
                  className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--color-accent)]/20 blur-3xl"
                />
                <p className="relative text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-bright)]">
                  After launch · book in 30 seconds
                </p>
                <div className="relative mt-3 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full silver-pill text-[var(--color-accent-fg)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M9 14.5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-display text-xl text-[var(--color-fg)]">
                      Reserve online, anytime
                    </p>
                    <p className="text-xs text-[var(--color-fg-muted)]">
                      Open 24/7 · instant confirmation
                    </p>
                  </div>
                </div>

                <Magnetic className="relative mt-6 block">
                  <Link
                    href="#book"
                    className={cn(
                      "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-semibold",
                      "silver-pill text-[var(--color-accent-fg)]",
                      "shadow-[0_18px_46px_-18px_oklch(72%_0.04_300_/_0.6)]",
                      "transition-transform duration-300 hover:-translate-y-0.5",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                    )}
                  >
                    Book online now
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </Magnetic>
                <p className="relative mt-3 text-center text-xs text-[var(--color-fg-subtle)]">
                  Prefer to talk? The line stays open at{" "}
                  <a
                    href={`tel:${BRAND.tel}`}
                    className="font-medium text-[var(--color-accent-bright)] underline-offset-2 hover:underline tnum"
                  >
                    {BRAND.phone}
                  </a>
                  .
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
