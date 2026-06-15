"use client";

/**
 * Doctor — the "Meet Dr. Londeree" credibility section. Leads hard on the
 * brand's crown jewel: academic authority + OSU faculty role. The real,
 * enhanced portrait of Dr. Gwyn Londeree anchors the layout — the founding
 * physician now has a face. Beneath it, a real clinical AMBIANCE photo
 * (explicitly labelled "Inside the practice") adds warmth + credibility.
 */

import { Section, Reveal } from "./primitives";
import { motion, useReducedMotion } from "motion/react";

/* A real clinical-injectable moment — supporting AMBIANCE only, never the
   doctor's likeness. Locked aspect-ratio container = zero CLS. */
const AMBIANCE = {
  src: "/clients/encore/real/en-3.jpg",
  alt: "Inside the practice — a clinician performing a precise injectable treatment at Encore.",
} as const;

const CREDS = [
  { v: "OSU", k: "Associate Professor of Dermatology, College of Medicine" },
  { v: "2001", k: "Board-certified in Dermatology (Internal Medicine, 1998)" },
  { v: "2010", k: "Founded Encore Dermatology in Columbus" },
];

const TRAINING = [
  "B.A., The Ohio State University",
  "M.D., OSU College of Medicine",
  "Internal Medicine — Riverside Methodist",
  "Dermatology residency — OSU Hospitals",
];

export function Doctor() {
  const prefersReduced = useReducedMotion();
  return (
    <Section
      id="doctor"
      labelledBy="doctor-heading"
      // Below the fold: skip off-screen render/paint.
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
    >
      <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1fr]">
        {/* Real portrait of Dr. Londeree + supporting ambiance photo */}
        <Reveal className="order-2 flex flex-col gap-4 md:order-1">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/clients/encore/real/dr-londeree.webp"
              alt="Dr. Gwyn Londeree, MD — founder of Encore Dermatology and OSU Associate Professor of Dermatology."
              loading="lazy"
              decoding="async"
              draggable={false}
              className="en-photo absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 30%" }}
            />
            {/* brand duotone wash for on-brand cohesion */}
            <span aria-hidden className="en-photo-tone" />
            {/* slow concentric rings, layered above the photo as a refined accent
                frame — echoes the clinical/leaf brand marks without obscuring her */}
            <motion.div
              aria-hidden
              animate={prefersReduced ? {} : { rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute left-1/2 top-[38%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--clinical)]/20"
            />
            <motion.div
              aria-hidden
              animate={prefersReduced ? {} : { rotate: -360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute left-1/2 top-[38%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--leaf)]/20"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-[var(--color-border)] bg-[var(--glass-bg-strong)] px-6 py-4 backdrop-blur-md">
              <p className="font-display text-lg text-[var(--color-fg)]">
                Dr. Gwyn Londeree, MD
              </p>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                Founder · OSU Associate Professor of Dermatology
              </p>
            </div>
          </div>

          {/* Supporting ambiance — a real clinical moment, clearly framed as the
              setting (NOT the doctor). The photo fades into the bright theme via
              the shared en-photo-tone + a hairline border. Zero CLS. */}
          <figure className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AMBIANCE.src}
                alt={AMBIANCE.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="en-photo absolute inset-0 h-full w-full object-cover"
              />
              {/* brand duotone wash for on-brand cohesion */}
              <span aria-hidden className="en-photo-tone" />
              {/* gentle bottom scrim so the caption holds contrast */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                style={{ background: "linear-gradient(to top, oklch(24% 0.03 207 / 0.55), transparent)" }}
              />
              <figcaption className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/95">
                  Inside the practice
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/30" />
              </figcaption>
            </div>
          </figure>
        </Reveal>

        {/* Narrative */}
        <div className="order-1 md:order-2">
          <Reveal>
            <span className="rule-gold text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]">
              The crown jewel
            </span>
            <h2
              id="doctor-heading"
              className="mt-4 font-display text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
            >
              Care from a dermatologist who{" "}
              <span className="italic">teaches dermatology.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[54ch] text-pretty font-light leading-relaxed text-[var(--color-fg-muted)]">
              A native of the Columbus area, Dr. Londeree earned her medical
              degree and completed her dermatology residency at{" "}
              <span className="text-[var(--color-fg)]">
                The Ohio State University
              </span>
              . Board-certified in Internal Medicine in 1998 and in Dermatology
              since 2001, she founded Encore in 2010 — and today she is an{" "}
              <span className="font-medium text-[var(--color-fg)]">
                Associate Professor of Dermatology at the OSU College of
                Medicine
              </span>
              , training the next generation of skin specialists. When you sit
              in her chair, you receive the same standard she sets for the
              physicians she teaches.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <dl className="mt-9 grid grid-cols-3 gap-4">
              {CREDS.map((c) => (
                <div
                  key={c.k}
                  className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]/50 p-4"
                >
                  <dt className="font-display text-2xl text-[var(--gold)]">
                    {c.v}
                  </dt>
                  <dd className="mt-1.5 text-[0.7rem] leading-snug text-[var(--color-fg-subtle)]">
                    {c.k}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.16}>
            <ul className="mt-7 flex flex-wrap gap-2">
              {TRAINING.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]/50 px-3.5 py-1.5 text-xs font-medium text-[var(--color-fg-muted)]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
