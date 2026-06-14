"use client";

/**
 * CarePaths — the two-path split. Elegantly merchandises BOTH sides of the
 * practice with equal weight: Medical/Surgical Dermatology (authority) and The
 * Spa at Encore (the under-marketed growth engine, the strategic wedge). Clean
 * CSS cards in the teal/ink/white system with a tree-motif header band — no
 * photography to muddy the bright theme.
 */

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Section, SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const PATHS = [
  {
    id: "medical",
    kicker: "Medical & Surgical",
    title: "Medical Dermatology",
    blurb:
      "Academic-level diagnosis and treatment of the skin, hair and nails — from skin-cancer screening and Mohs-referral surgery to acne, eczema, psoriasis and rosacea.",
    points: [
      "Skin cancer screening & surgery",
      "Acne, eczema & psoriasis",
      "Rosacea & rashes",
      "Mole & lesion evaluation",
    ],
    href: "#medical",
    cta: "Explore medical care",
    tone: "clinical" as const,
  },
  {
    id: "spa",
    kicker: "The Spa at Encore",
    title: "Aesthetic Medicine",
    blurb:
      "A physician-supervised med-spa where dermatologic science meets luxury — Botox and Juvéderm, Sciton Halo resurfacing, doctor-directed CoolSculpting and signature facials, in a relaxed and peaceful setting.",
    points: [
      "Botox & Juvéderm fillers",
      "Sciton Halo & RF microneedling",
      "Doctor-directed CoolSculpting",
      "Custom facials, peels & dermaplaning",
    ],
    href: "#spa",
    cta: "Enter The Spa",
    tone: "spa" as const,
  },
];

/* A small motif band — a branch with leaves, tinted per tone. The Medical card
   leans cool teal; The Spa card leans warm sage — both within the tree world. */
function PathBand({ tone }: { tone: "clinical" | "spa" }) {
  const leaf = tone === "clinical" ? "var(--leaf)" : "var(--spa)";
  const bark = tone === "clinical" ? "var(--clinical-deep)" : "var(--spa-deep)";
  const wash =
    tone === "clinical"
      ? "radial-gradient(120% 140% at 80% 0%, var(--color-accent-subtle), transparent 70%)"
      : "radial-gradient(120% 140% at 80% 0%, oklch(94% 0.04 158), transparent 70%)";
  return (
    <div className="relative h-28 overflow-hidden rounded-t-3xl" aria-hidden style={{ background: wash }}>
      {/* a single branch arcing across with a few leaves catching light */}
      <svg viewBox="0 0 400 112" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none">
        <path d="M-10 96 C 120 84, 220 40, 410 22" stroke={bark} strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
        <path d="M150 62 C 180 50, 210 48, 250 36" stroke={bark} strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
        {[
          [250, 36, 16],
          [300, 28, 12],
          [205, 48, 11],
          [340, 22, 14],
          [160, 60, 10],
        ].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 47) % 90})`}>
            <path
              d={`M0 ${-r} C ${r * 0.82} ${-r * 0.4}, ${r * 0.82} ${r * 0.7}, 0 ${r} C ${-r * 0.82} ${r * 0.7}, ${-r * 0.82} ${-r * 0.4}, 0 ${-r} Z`}
              fill={leaf}
              opacity="0.85"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function CarePaths() {
  const prefersReduced = useReducedMotion();

  return (
    <Section
      id="paths"
      labelledBy="paths-heading"
      // Below the fold: skip off-screen render/paint.
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
    >
      <SectionHeading
        id="paths-heading"
        eyebrow="Two sides, one standard"
        title={
          <>
            Choose your path to <span className="display-em">healthier skin.</span>
          </>
        }
        lede="Whether you need a clinical diagnosis or a luxury aesthetic refresh, you're cared for by the same board-certified, faculty-led team — under one roof in NW Columbus."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {PATHS.map((p, i) => (
          <Reveal as="article" key={p.id} delay={i * 0.08}>
            <motion.div
              whileHover={prefersReduced ? undefined : { y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
                "shadow-[0_18px_50px_-40px_oklch(46%_0.06_205_/_0.6)] transition-shadow duration-300 hover:shadow-[0_30px_70px_-44px_oklch(46%_0.06_205_/_0.8)]",
              )}
            >
              <PathBand tone={p.tone} />

              <div className="relative flex flex-1 flex-col p-8 sm:p-10">
                <p className="relative text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--clinical-deep)]">
                  {p.kicker}
                </p>
                <h3
                  className="relative mt-3 font-display text-[var(--color-fg)]"
                  style={{ fontSize: "var(--fluid-h3)", lineHeight: 1.1 }}
                >
                  {p.title}
                </h3>
                <p className="relative mt-4 max-w-[42ch] text-[0.975rem] font-light leading-relaxed text-[var(--color-fg-muted)]">
                  {p.blurb}
                </p>

                <ul className="relative mt-7 grid gap-2.5">
                  {p.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-3 text-sm text-[var(--color-fg-muted)]"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "inline-block h-1.5 w-1.5 flex-none rounded-full",
                          p.tone === "clinical" ? "bg-[var(--clinical)]" : "bg-[var(--spa-deep)]",
                        )}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className="relative mt-9 inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-fg)] transition-colors duration-300 hover:border-[var(--clinical)] hover:text-[var(--clinical-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)] md:mt-auto md:pt-9"
                >
                  {p.cta}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
