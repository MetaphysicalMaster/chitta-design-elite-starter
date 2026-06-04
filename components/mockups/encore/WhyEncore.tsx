"use client";

/**
 * WhyEncore — a concise differentiators band that merchandises the practice's
 * real edge: academic authority, two practices under one roof, and an honest,
 * unhurried standard of care. Sits between the two-path split and the service
 * grids to give the pitch its "why us" spine. All claims are brand-faithful.
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
    tone: "gold" as const,
  },
  {
    k: "Honest & unhurried",
    t: "Thorough, never rushed",
    d: "The reputation behind 404 reviews and a 4.81★ rating: careful exams, clear explanations, and recommendations made for you — not upsold.",
    tone: "spa" as const,
  },
];

function dot(tone: "clinical" | "gold" | "spa") {
  if (tone === "clinical") return "var(--clinical)";
  if (tone === "spa") return "var(--spa)";
  return "var(--gold)";
}

export function WhyEncore() {
  return (
    <Section labelledBy="why-heading" className="py-20 md:py-24">
      <SectionHeading
        id="why-heading"
        eyebrow="Why Encore"
        title={<>A standard you can <span className="italic">feel.</span></>}
        lede="Sixteen years of academic-level dermatology in Columbus — built on credentials, not gimmicks."
      />
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal as="li" key={p.k} delay={i * 0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]/55 p-7">
              <span
                aria-hidden
                className="mb-5 inline-block h-2 w-10 rounded-full"
                style={{ background: dot(p.tone) }}
              />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
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
