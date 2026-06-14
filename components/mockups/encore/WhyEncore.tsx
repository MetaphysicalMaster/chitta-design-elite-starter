"use client";

/**
 * WhyEncore — a concise differentiators band that merchandises the practice's
 * real edge: academic authority, two practices under one roof, and an honest,
 * unhurried standard of care. A clean teal-ink "standard" quote panel replaces
 * the old photo band so the bright theme stays cohesive. All claims are
 * brand-faithful.
 */

import { Section, SectionHeading, Reveal } from "./primitives";

const PILLARS = [
  {
    k: "Academic authority",
    t: "Care from a professor",
    d: "Dr. Londeree teaches dermatology as an Associate Professor at the OSU College of Medicine. You get the standard she sets for the physicians she trains.",
    tone: "clinical" as const,
  },
  {
    k: "One roof",
    t: "Medical & aesthetic, together",
    d: "Diagnosis, surgery and The Spa at Encore share the same board-certified team — so your skin's health and its glow are never an afterthought.",
    tone: "leaf" as const,
  },
  {
    k: "Honest & unhurried",
    t: "Thorough, never rushed",
    d: "The reputation behind hundreds of five-star reviews: careful exams, clear explanations, and recommendations made for you — not upsold.",
    tone: "spa" as const,
  },
];

function dot(tone: "clinical" | "leaf" | "spa") {
  if (tone === "clinical") return "var(--clinical)";
  if (tone === "spa") return "var(--spa-deep)";
  return "var(--leaf)";
}

export function WhyEncore() {
  return (
    <Section labelledBy="why-heading" className="py-20 md:py-24">
      <SectionHeading
        id="why-heading"
        eyebrow="Why Encore"
        title={<>A standard you can <span className="display-em">feel.</span></>}
        lede="Over fifteen years of academic-level dermatology in Columbus — built on credentials, not gimmicks."
      />

      {/* "The standard" — a deep teal-ink quote panel with a faint tree canopy
          motif. The brand statement, cleanly typeset, no photography. */}
      <Reveal className="mt-12">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[var(--color-bg-deep)] px-8 py-12 text-white sm:px-12 sm:py-16">
          {/* faint canopy dapple */}
          <svg
            aria-hidden
            viewBox="0 0 600 240"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
            fill="none"
          >
            <path d="M40 240 C 120 180, 180 120, 300 60 C 420 120, 480 180, 560 240" stroke="var(--leaf-bright)" strokeWidth="2" strokeLinecap="round" />
            {Array.from({ length: 14 }).map((_, i) => {
              const x = 60 + i * 38;
              const y = 50 + Math.sin(i * 1.3) * 30 + (i % 3) * 14;
              const r = 9 + (i % 4) * 2;
              return (
                <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 53) % 90})`}>
                  <path
                    d={`M0 ${-r} C ${r * 0.82} ${-r * 0.4}, ${r * 0.82} ${r * 0.7}, 0 ${r} C ${-r * 0.82} ${r * 0.7}, ${-r * 0.82} ${-r * 0.4}, 0 ${-r} Z`}
                    fill="var(--leaf-bright)"
                  />
                </g>
              );
            })}
          </svg>

          <div className="relative">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[var(--leaf-bright)]">
              The standard
            </span>
            <p
              className="mt-4 max-w-2xl text-pretty font-display text-2xl leading-snug text-white sm:text-3xl"
            >
              The calm of an academic practice — where careful, unhurried care is
              simply the standard, and your second act starts the moment you sit
              down.
            </p>
            <p className="mt-5 text-sm text-white/55">
              — Encore Dermatology &amp; The Spa at Encore, NW Columbus
            </p>
          </div>
        </div>
      </Reveal>

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal as="li" key={p.k} delay={i * 0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7 shadow-[0_10px_30px_-28px_oklch(46%_0.06_205_/_0.5)]">
              <span
                aria-hidden
                className="mb-5 inline-block h-2 w-10 rounded-full"
                style={{ background: dot(p.tone) }}
              />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--clinical-deep)]">
                {p.k}
              </p>
              <h3 className="mt-2 font-display text-xl text-[var(--color-fg)]">
                {p.t}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
                {p.d}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
