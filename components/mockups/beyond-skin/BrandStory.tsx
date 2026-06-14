"use client";

/**
 * BrandStory — the editorial "we've grown" moment. Leans into the 2023
 * 4× expansion: "you've outgrown your website." Split layout — oversized
 * editorial type + a stylized growth visual built from CSS (no asset deps).
 */

import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading } from "./primitives";

export function BrandStory() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="experience"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      {/* warm aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 40% at 90% 8%, var(--color-accent-subtle), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* Copy */}
        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow="Our Story"
            title={
              <>
                More than a med spa —
                <br />
                <span className="text-molten font-em">a journey to wellness.</span>
              </>
            }
            lead="Since 2017, Beyond Skin has grown into one of Columbus' most-loved homes for aesthetics & wellness — warm, inclusive, and judgment-free. Led by Dr. Matia Mulumba and our team, every visit is built around you: your goals, your comfort, your best self, unveiled at your own pace."
          />

          <Reveal delay={0.16}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[var(--color-border)] pt-8">
              {[
                { v: "2017", k: "Founded" },
                { v: "Judgment-free", k: "Every visit" },
                { v: "Inclusive", k: "By design" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-3xl text-[var(--color-fg)] sm:text-4xl">
                    {s.v}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    {s.k}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Growth visual — stacked editorial frames implying scale */}
        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              {/* Back frame (the "old, smaller" room) */}
              <motion.div
                aria-hidden
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-15%" }}
                variants={{
                  hidden: { opacity: 0, scale: 0.92, rotate: -4 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    rotate: -5,
                    transition: {
                      duration: prefersReduced ? 0 : 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="absolute left-2 top-6 h-[78%] w-[64%] rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] shadow-[var(--glass-shadow)]"
              >
                <span className="absolute left-4 top-4 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  Where you are
                </span>
              </motion.div>

              {/* Front frame (the "new, 4× larger" suite) */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-15%" }}
                variants={{
                  hidden: { opacity: 0, scale: 0.96, rotate: 4 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    rotate: 3,
                    transition: {
                      duration: prefersReduced ? 0 : 1,
                      delay: prefersReduced ? 0 : 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                className="absolute bottom-0 right-0 grid h-[88%] w-[80%] place-items-center overflow-hidden rounded-[1.75rem] border border-[var(--glass-border)] shadow-[0_30px_70px_-24px_oklch(40%_0.08_40_/_0.5)]"
                style={{
                  background:
                    "radial-gradient(120% 120% at 20% 0%, var(--glow-gold), transparent 55%), linear-gradient(150deg, var(--glow-bronze), var(--glow-rose) 60%, var(--glow-plum))",
                }}
              >
                <div className="absolute inset-0 grain" aria-hidden />
                <div className="relative px-6 text-center">
                  <p className="font-display text-5xl font-medium italic leading-none text-[oklch(99%_0.008_350)] drop-shadow-[0_2px_18px_oklch(24%_0.06_340_/_0.5)] sm:text-6xl">
                    your best self
                  </p>
                  <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[oklch(98%_0.008_350_/_0.88)]">
                    Unveiled
                  </p>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
