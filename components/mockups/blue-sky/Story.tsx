"use client";

/**
 * Story — the practice's authentic origin, the single biggest brand
 * differentiator their current site buries: Dr. Maura Manning, MD left
 * emergency medicine because she wanted to reach people before a crisis —
 * with preventive care and wellness, not after. Family/woman-owned, German
 * Village, 30 years of expertise. All facts are real; the portrait is a
 * clearly-marked sample placeholder (no copyrighted assets used).
 */

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Story() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="story"
      aria-label="Our story"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
    >
      {/* faint sky wash to tie back to the hero palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 88% 12%, var(--color-accent-subtle), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
        {/* Portrait placeholder — clearly sample, no scraped assets */}
        <Reveal>
          <figure className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] shadow-[var(--glass-shadow)]">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(150deg, var(--sky-mid), var(--sky-high) 55%, var(--sky-deep)), radial-gradient(70% 50% at 30% 20%, oklch(95% 0.03 232 / 0.6), transparent 60%)",
                }}
              />
              {/* soft monogram so the placeholder reads as portrait, not empty */}
              <span className="font-display absolute inset-0 grid place-items-center text-[6rem] leading-none text-white/30">
                MM
              </span>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                Sample portrait
              </span>
            </div>
            <figcaption className="mt-4 text-sm text-[var(--color-fg-muted)]">
              <span className="font-semibold text-[var(--color-fg)]">Dr. Maura Manning, MD</span>{" "}
              · Physician &amp; co-owner
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <p className="rule-gold text-xs font-semibold uppercase tracking-[0.22em] text-accent-deep">
              Our Story
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <motion.blockquote
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-display mt-4 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.08, fontWeight: 400 }}
            >
              &ldquo;Emergency care rarely competes with
              <span className="italic"> prevention and wellness.</span>&rdquo;
            </motion.blockquote>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-pretty text-[1.0625rem] leading-relaxed text-[var(--color-fg-muted)]">
              Dr. Manning spent years in the emergency room &mdash; and left
              because she wanted to reach people <em>before</em> a crisis ever
              brought them in. Blue Sky is the result: a family-owned, woman-led
              practice that blends 30 years of medical expertise with a genuinely
              holistic approach to beauty and wellness, in the relaxing calm of
              German Village.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
              {[
                { v: "Preventive", k: "Care philosophy" },
                { v: "Holistic", k: "Beauty + wellness" },
                { v: "Local", k: "German Village" },
              ].map((s) => (
                <div key={s.k} className="flex flex-col border-l border-[var(--color-border)] pl-4">
                  <dt className="font-display text-xl leading-none text-[var(--color-fg)]">{s.v}</dt>
                  <dd className="mt-1.5 text-xs uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                    {s.k}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
