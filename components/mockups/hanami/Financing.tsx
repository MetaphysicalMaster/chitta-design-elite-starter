"use client";

/**
 * Financing — the rewards + financing callout. Reframes "value" the way a
 * premium, physician-led practice does: loyalty on the brands patients already
 * use, quiet flexible-pay, and member pricing — never a discount-bin feel. A
 * rice-paper plate with a soft sakura aura.
 */

import Link from "next/link";
import { Reveal, btnPrimary, btnGhost } from "./primitives";

const PERKS = [
  {
    title: "Loyalty rewards",
    body: "Earn and redeem on the injectable brands you already love — value that compounds with trust, season after season.",
  },
  {
    title: "Flexible payment",
    body: "Cherry & CareCredit options at checkout, so your plan unfolds on your timeline, never the reverse.",
  },
  {
    title: "Member pricing",
    body: "Quiet membership tiers for our regulars — value without the markdown noise of a template promo.",
  },
];

export function Financing() {
  return (
    <section id="financing" className="relative scroll-mt-20 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] p-8 sm:p-12 lg:p-16">
            {/* soft sakura glow plate */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(80% 100% at 12% 10%, oklch(96% 0.03 352), transparent 64%), radial-gradient(70% 90% at 92% 96%, var(--color-accent-subtle), transparent 66%), linear-gradient(160deg, oklch(98% 0.01 350), oklch(94% 0.04 354))",
              }}
            />
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <p className="rule-fine eyebrow inline-block text-accent-deep">
                  Value, the gentle way
                </p>
                <h2
                  className="font-display mt-5 text-balance text-[var(--color-fg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
                >
                  Rewards on the brands you already trust.
                </h2>
                <p className="mt-5 max-w-[44ch] font-light leading-relaxed text-[var(--color-fg-muted)]">
                  Premium, physician-placed care kept within reach — loyalty
                  rewards earn automatically, and flexible-pay keeps your plan
                  unhurried.
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
                      className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 p-5 backdrop-blur-sm"
                    >
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]"
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
