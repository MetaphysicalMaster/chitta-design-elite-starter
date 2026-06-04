"use client";

/**
 * CarePaths — the two-path split. Elegantly merchandises BOTH sides of the
 * practice: Medical/Surgical Dermatology (authority) and The Spa at Encore
 * (the under-marketed growth engine, given equal — gorgeous — weight).
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
      "A physician-supervised med-spa where dermatologic science meets luxury — injectables, Sciton Halo laser resurfacing, body contouring and signature facials.",
    points: [
      "Botox & dermal fillers",
      "Sciton Halo & IPL laser",
      "CoolSculpting & RF microneedling",
      "Medical facials, peels & dermaplaning",
    ],
    href: "#spa",
    cta: "Enter The Spa",
    tone: "spa" as const,
  },
];

export function CarePaths() {
  const prefersReduced = useReducedMotion();

  return (
    <Section id="paths" labelledBy="paths-heading">
      <SectionHeading
        id="paths-heading"
        eyebrow="Two sides, one standard"
        title={
          <>
            Choose your path to <span className="italic">healthier skin.</span>
          </>
        }
        lede="Whether you need a clinical diagnosis or a luxury aesthetic refresh, you're cared for by the same board-certified, faculty-led team — under one roof in Columbus."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {PATHS.map((p, i) => (
          <Reveal as="article" key={p.id} delay={i * 0.08}>
            <motion.div
              whileHover={prefersReduced ? undefined : { y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] p-8 sm:p-10",
                "bg-[var(--color-bg-elevated)]/70 backdrop-blur-sm",
              )}
            >
              {/* Tone wash — clinical teal vs spa rose */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-80",
                  p.tone === "clinical"
                    ? "bg-[var(--clinical-deep)]"
                    : "bg-[var(--spa-deep)]",
                )}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent"
              />

              <p className="relative text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
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
                        p.tone === "clinical"
                          ? "bg-[var(--clinical)]"
                          : "bg-[var(--spa)]",
                      )}
                    />
                    {pt}
                  </li>
                ))}
              </ul>

              <Link
                href={p.href}
                className="relative mt-9 inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-fg)] transition-colors duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] md:mt-auto md:pt-9"
              >
                {p.cta}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
