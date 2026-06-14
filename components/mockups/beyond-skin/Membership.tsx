"use client";

/**
 * Membership — the $149/mo banked-credit model as a hero-tier pricing card.
 * Uses the shared HolographicFoil effect (iridescent, premium) on the marquee
 * card. The banked-credit mechanic is explained as a simple 3-step flow.
 */

import Link from "next/link";
import { HolographicFoil } from "@/components/effects/holographic-foil";
import { Reveal, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const PERKS = [
  "$149 banked into credit every month — it never expires while active",
  "Member pricing on injectables, lasers & devices",
  "Two complimentary signature facials a year",
  "Priority booking windows & event early-access",
  "10% off all medical-grade skincare in-shop",
];

const STEPS = [
  { n: "01", t: "You bank $149", d: "Each month it lands as credit in your account." },
  { n: "02", t: "It stacks", d: "Unused credit rolls forward while you're a member." },
  { n: "03", t: "You spend it", d: "On any treatment or product, whenever you're ready." },
];

export function Membership() {
  return (
    <section
      id="membership"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="The Membership"
          title={
            <>
              $149 a month, <span className="text-molten font-em">banked for you.</span>
            </>
          }
          lead="Not a discount club — a smarter way to invest in yourself. Every dollar becomes credit you control."
        />

        <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* The card */}
          <div className="lg:col-span-5">
            <Reveal>
              <HolographicFoil
                intensity={0.5}
                className="rounded-[1.75rem] shadow-[0_40px_90px_-30px_oklch(40%_0.1_30_/_0.55)]"
              >
                <div
                  className="relative overflow-hidden rounded-[1.75rem] p-8 sm:p-10"
                  style={{
                    background:
                      "radial-gradient(120% 100% at 0% 0%, var(--glow-bronze), transparent 55%), linear-gradient(155deg, var(--ink-warm), var(--ink-deep))",
                  }}
                >
                  <div className="grain absolute inset-0" aria-hidden />
                  <div className="relative">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-[var(--glow-gold)]">
                      Beyond Membership
                    </p>
                    <div className="mt-5 flex items-end gap-2">
                      <span className="font-display text-6xl font-bold leading-none text-[oklch(99%_0.01_80)]">
                        $149
                      </span>
                      <span className="pb-1.5 text-sm text-[oklch(92%_0.02_80_/_0.72)]">
                        / month
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[oklch(94%_0.02_80_/_0.75)]">
                      Banked-credit model · cancel anytime
                    </p>

                    <ul className="mt-7 space-y-3.5">
                      {PERKS.map((perk) => (
                        <li
                          key={perk}
                          className="flex items-start gap-3 text-[0.92rem] leading-snug text-[oklch(95%_0.01_80_/_0.92)]"
                        >
                          <span
                            aria-hidden
                            className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--glow-gold)] text-[0.7rem] font-bold text-[var(--ink-deep)]"
                          >
                            ✓
                          </span>
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="#book"
                      className={cn(
                        "mt-9 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold",
                        "bg-[oklch(98%_0.01_80)] text-[var(--ink-deep)]",
                        "transition-transform duration-300 hover:-translate-y-0.5",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-gold)]",
                      )}
                    >
                      Become a member →
                    </Link>
                  </div>
                </div>
              </HolographicFoil>
            </Reveal>
          </div>

          {/* The mechanic */}
          <div className="lg:col-span-7 lg:pl-6">
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl text-[var(--color-fg)] sm:text-3xl">
                How banked credit works
              </h3>
              <p className="mt-3 max-w-xl text-[var(--color-fg-muted)]">
                Most memberships make you use it or lose it. Ours simply saves
                for you — so your glow-up is always funded and on your terms.
              </p>
            </Reveal>

            <ol className="mt-9 space-y-5">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={0.14 + i * 0.08}>
                  <li className="flex items-start gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                    <span className="font-display text-2xl font-bold text-[var(--gold-deep)]">
                      {s.n}
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--color-fg)]">{s.t}</p>
                      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                        {s.d}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
