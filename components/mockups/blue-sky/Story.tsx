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
import { BrandImage } from "./BrandImage";
import { blueSkyImages } from "@/app/mockups/blue-sky/images.manifest";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Story() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="story"
      aria-label="Our story"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
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
        {/* Reception / interior — warm German Village space. Brand-faithful AI
            sample (labeled), used as ambiance rather than a fabricated portrait. */}
        <Reveal>
          <figure className="relative">
            <BrandImage
              src={blueSkyImages.interior.primary}
              alt={blueSkyImages.interior.altText}
              aspect="4:5"
              position="center 42%"
              graded
              tone
              parallax
              scrim="soft"
              radius="3xl"
              className="shadow-[var(--glass-shadow)]"
            >
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                Sample · illustrative
              </span>
            </BrandImage>
            {/* Radiant skin-quality accent — overlaps the corner for editorial depth */}
            <div className="absolute -bottom-6 -right-4 hidden w-32 sm:block lg:-right-8 lg:w-36">
              <BrandImage
                src={blueSkyImages.glow.primary}
                alt={blueSkyImages.glow.altText}
                aspect="1:1"
                light
                tone
                radius="2xl"
                position="center 40%"
                className="shadow-[0_18px_40px_-16px_oklch(46%_0.12_255_/_0.5)] ring-4 ring-[var(--color-bg)]"
              />
            </div>
            <figcaption className="mt-4 text-sm text-[var(--color-fg-muted)]">
              <span className="font-semibold text-[var(--color-fg)]">Our German Village home</span>{" "}
              · led by Dr. Maura Manning, MD
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
