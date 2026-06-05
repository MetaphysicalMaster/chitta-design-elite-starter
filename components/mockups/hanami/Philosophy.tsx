"use client";

/**
 * Philosophy — the cinematic "Hanami philosophy" intro. THE FIRST HALF OF THE
 * CLOSER.
 *
 * Hanami (花見) means cherry-blossom viewing — the Japanese practice of pausing
 * to notice beauty precisely because it is fleeting (mono no aware). The live
 * SEO template wastes this entirely. Here we give the name meaning: a slow,
 * letter-spaced, scroll-revealed meditation on three movements — Notice →
 * Tend → Bloom — over a sumi-ink night field with a single drifting blossom
 * line. Restraint over spectacle: this is the brand's soul, stated plainly.
 */

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "./primitives";

const MOVEMENTS = [
  {
    kanji: "見",
    romaji: "Miru",
    title: "Notice",
    body: "We begin by looking — really looking. Not at a list of areas to fix, but at the face you already have, and where it is in its season.",
  },
  {
    kanji: "育",
    romaji: "Sodateru",
    title: "Tend",
    body: "Then we tend, never overwork. The smallest considered touch by one set of hands — softening, restoring, never chasing a trend.",
  },
  {
    kanji: "咲",
    romaji: "Saku",
    title: "Bloom",
    body: "And we let you bloom — gradually, naturally, like a tree in spring. Results that look like nothing happened, except you, more yourself.",
  },
];

export function Philosophy() {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // A single blossom line drifts slowly across as you read.
  const driftX = useTransform(scrollYProgress, [0, 1], ["-6%", "10%"]);
  const driftY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      id="philosophy"
      ref={ref}
      aria-label="The Hanami philosophy"
      className="relative scroll-mt-20 overflow-hidden py-28 sm:py-36"
      style={{ background: "linear-gradient(168deg, var(--night-1), var(--night-0))" }}
    >
      {/* This room's OWN aura: a single low CORAL wash rising from the base
          (a quiet sakura dusk under the philosophy), with the faintest gold breath
          at the very top — deliberately NOT the corner-pair stamp the other night
          sections share, so each dark room reads distinct. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(80% 42% at 50% 108%, oklch(62% 0.15 9 / 0.32), transparent 72%), radial-gradient(60% 24% at 50% -6%, oklch(72% 0.11 86 / 0.16), transparent 70%)",
        }}
      />

      {/* a single drifting blossom line — a quiet petal trail (decorative) */}
      <motion.div
        aria-hidden
        style={prefersReduced ? undefined : { x: driftX, y: driftY }}
        className="pointer-events-none absolute right-[8%] top-[12%] hidden sm:block"
      >
        <div className="flex flex-col items-center gap-6 opacity-50">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="petal-mark"
              style={{
                width: `${0.7 + i * 0.18}rem`,
                height: `${0.7 + i * 0.18}rem`,
                opacity: 1 - i * 0.13,
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="relative mx-auto max-w-5xl px-6 sm:px-8">
        <Reveal>
          <p className="eyebrow text-center text-[var(--color-accent-bright)]">
            花見 · The Hanami philosophy
          </p>
          <h2
            className="font-display mx-auto mt-6 max-w-[20ch] text-balance text-center text-[var(--color-bg)]"
            style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.1 }}
          >
            Hanami means to pause —{" "}
            <span className="font-display-em text-[var(--color-accent-bright)]">
              and watch beauty unfold.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-[54ch] text-center text-pretty font-light leading-relaxed text-[var(--color-bg)]/78">
            In Japan, hanami is the practice of gathering beneath the cherry
            trees — to notice the blossom precisely because it will not last.
            That patience is our whole approach to a face. Three movements, one
            quiet philosophy.
          </p>
        </Reveal>

        <ol className="mt-20 space-y-16 sm:space-y-20">
          {MOVEMENTS.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.06}>
              <li className="grid grid-cols-1 items-start gap-6 sm:grid-cols-12 sm:gap-10">
                <div className="flex items-baseline gap-4 sm:col-span-4">
                  <span
                    aria-hidden
                    className="font-display text-5xl leading-none text-[var(--color-accent-bright)] sm:text-6xl"
                  >
                    {m.kanji}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-bg)]/55">
                    {m.romaji}
                  </span>
                </div>
                <div className="sm:col-span-8">
                  <h3 className="font-display text-2xl text-[var(--color-bg)] sm:text-3xl">
                    {String(i + 1).padStart(2, "0")} · {m.title}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-pretty font-light leading-relaxed text-[var(--color-bg)]/72">
                    {m.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
