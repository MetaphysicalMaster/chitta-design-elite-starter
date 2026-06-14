"use client";

/**
 * Membership — premium pricing-card treatment for the two real tiers:
 * "Blue Sky" wellness + "Next Level Beauty". The real site offers no pricing
 * clarity; this gives a confident, transparent comparison.
 */

import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Blue Sky Membership",
    price: "$129",
    cadence: "/ month",
    summary: "Whole-body wellness, the holistic way — inside and out.",
    featured: false,
    perks: [
      "Free monthly service of your choice",
      "Quarterly medical-grade facial",
      "10% off all injectables & skin services",
      "BHRT, IV therapy & weight-loss priority",
      "Member pricing on premium skincare",
    ],
  },
  {
    name: "Next Level Beauty",
    price: "$249",
    cadence: "/ month",
    summary: "For patients who treat aesthetics as routine, not occasion.",
    featured: true,
    perks: [
      "Everything in the Blue Sky Membership",
      "Quarterly neurotoxin treatment included",
      "Annual filler or Sculptra credit",
      "15% off all add-on treatments",
      "Priority booking & exclusive member events",
      "Personalized physician aesthetic plan",
    ],
  },
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" fill="none" aria-hidden>
      <path d="m4 10 4 4 8-9" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Membership() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="membership"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
    >
      {/* faint drifting cloud depth behind the heading — atmospheric, not literal */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(60% 70% at 50% -10%, var(--color-accent-subtle), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Membership"
          title={
            <>
              Two ways to make beautiful
              <span className="italic"> a habit.</span>
            </>
          }
          lead="Members save on every visit and lock in priority access. Cancel anytime — no contracts, no pressure."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <motion.div
                whileHover={prefersReduced ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className={cn(
                  "relative flex h-full flex-col rounded-[1.75rem] p-8 sm:p-10",
                  t.featured
                    ? "bg-[var(--color-fg)] text-white shadow-[0_30px_70px_-25px_oklch(46%_0.12_255_/_0.55)] ring-1 ring-[var(--color-fg)]"
                    : "border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)]",
                )}
              >
                {t.featured && (
                  <span className="absolute -top-3 right-8 rounded-full bg-[var(--gold)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[oklch(28%_0.05_75)]">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className={cn("mt-2 text-sm", t.featured ? "text-white/75" : "text-[var(--color-fg-muted)]")}>
                  {t.summary}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl leading-none">{t.price}</span>
                  <span className={cn("text-sm", t.featured ? "text-white/70" : "text-[var(--color-fg-muted)]")}>
                    {t.cadence}
                  </span>
                </div>

                <ul className="mt-8 flex-1 space-y-3.5">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-snug">
                      <span className={t.featured ? "[&_path]:stroke-[var(--gold)]" : ""}>
                        <Check />
                      </span>
                      <span className={t.featured ? "text-white/90" : "text-[var(--color-fg-muted)]"}>{p}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#book"
                  className={cn(
                    "mt-9 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5",
                    t.featured
                      ? "bg-white text-[var(--color-fg)] hover:shadow-lg"
                      : "bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:shadow-lg",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
                  )}
                >
                  Become a member
                </a>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[var(--color-fg-subtle)]">
          Sample membership pricing for mockup purposes.
        </p>
      </div>
    </section>
  );
}
