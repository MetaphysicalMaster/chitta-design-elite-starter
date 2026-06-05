"use client";

/**
 * Financing — the rewards + financing callout. Reframes "value" the way a
 * premium, decade-established practice does: loyalty on the brands patients
 * already use, quiet flexible-pay, and member pricing — never a discount-bin
 * product feel. Warm ivory plate with a brass aura.
 */

import Link from "next/link";
import { Reveal, btnPrimary, btnGhost } from "./primitives";
import { cn } from "@/lib/utils";

const PERKS = [
  {
    title: "Loyalty rewards",
    body: "Earn and redeem on the injectable brands you already love — value that compounds with trust.",
  },
  {
    title: "Flexible payment",
    body: "Cherry & CareCredit options at checkout, so your plan fits your timeline, not the reverse.",
  },
  {
    title: "Member pricing",
    body: "Quiet membership tiers for our decade-long regulars — value without the markdown noise.",
  },
];

export function Financing() {
  return (
    <section id="financing" className="relative scroll-mt-20 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] p-8 sm:p-12 lg:p-16">
            {/* warm brass glow plate */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(80% 100% at 12% 10%, oklch(94% 0.05 80), transparent 64%), radial-gradient(70% 90% at 92% 96%, var(--color-accent-subtle), transparent 66%), linear-gradient(160deg, oklch(97% 0.014 78), oklch(93% 0.026 70))",
              }}
            />
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <p className="rule-fine eyebrow inline-block text-accent-deep">
                  Value, the premium way
                </p>
                <h2
                  className="font-display mt-5 text-balance text-[var(--color-fg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.04 }}
                >
                  Rewards on the brands you already trust.
                </h2>
                <p className="mt-5 max-w-[44ch] font-light leading-relaxed text-[var(--color-fg-muted)]">
                  A decade of premium care, kept within reach — loyalty rewards
                  earn automatically, and flexible-pay keeps your plan unhurried.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="#book" className={btnPrimary}>
                    Start your plan
                  </Link>
                  <Link href="#services" className={btnGhost}>
                    View the menu
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <ul className="grid grid-cols-1 gap-4">
                  {PERKS.map((p) => (
                    <li
                      key={p.title}
                      className={cn(
                        "flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 p-5 backdrop-blur-sm",
                      )}
                    >
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--color-accent-subtle)] text-[var(--color-accent)]"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                          <path d="M5 12.5 10 17 19 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-[var(--color-fg)]">{p.title}</p>
                        <p className="mt-1 text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
                          {p.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
