"use client";

/**
 * Story — the "Your Beauty Evolution" section. Two movements:
 *
 *  1. The evolution journey — a vertical, numbered path that frames every visit
 *     as a step in a personal transformation (the live site's core promise:
 *     "Embark on Your Beauty Evolution"). Bold editorial steps on a hot-pink
 *     rail, monochrome with the one pink pop.
 *
 *  2. The single, clean NAP & branded-contact block — ONE authoritative
 *     address, ONE phone, ONE branded inbox, so the prospect knows exactly
 *     where to find and how to reach the practice. (The address is a
 *     representative Houston placeholder for the mockup.)
 */

import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./primitives";
import { NAP } from "./nap";

const MILESTONES = [
  {
    year: "01",
    title: "Discovery consultation",
    body: "We listen first. A thorough skin analysis and an honest conversation about your goals — no pressure, ever.",
  },
  {
    year: "02",
    title: "Your bespoke plan",
    body: "IPL, HydraFacial MD, the Deluxe Facial or a tailored series — a roadmap built around your skin, not a template.",
  },
  {
    year: "03",
    title: "Transformative treatment",
    body: "Medical-grade results delivered with an artist's eye and an obsession with looking natural, never overdone.",
  },
  {
    year: "04",
    title: "Lasting glow",
    body: "We refine as your skin evolves. The Sousan glow isn't a single visit — it's an evolution you'll keep.",
  },
];

export function Legacy() {
  return (
    <section
      id="visit"
      className="relative overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      {/* faint neutral inlay rhythm */}
      <div
        aria-hidden
        className="ruler-ticks pointer-events-none absolute inset-x-0 top-0 h-px opacity-50"
      />

      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Your Beauty Evolution"
          title={
            <>
              Transformation,{" "}
              <span className="font-display-em" data-thread="underline">
                step by step.
              </span>
            </>
          }
          lead="Beauty isn't a single appointment — it's an evolution. Here's the path we walk with every client, from first consultation to lasting glow."
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ---- Movement 1: the timeline ---- */}
          <RevealGroup as="ul" className="relative" stagger={0.12}>
            {/* the pink rail — the thread literally fuses with it on scroll
                (data-thread="rail" runs the drawn line down this exact spine) */}
            <span
              aria-hidden
              data-thread="rail"
              className="absolute left-[7px] top-2 bottom-2 w-px"
              style={{
                background:
                  "linear-gradient(180deg, var(--gold), var(--gold-deep) 60%, transparent)",
              }}
            />
            {MILESTONES.map((m) => (
              <RevealItem
                as="li"
                key={m.year}
                className="relative mb-10 pl-9 last:mb-0"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border border-[var(--gold)] bg-[var(--color-bg)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-mid)]" />
                </span>
                <p className="font-display text-sm font-semibold tracking-[0.18em] text-[var(--gold-ink)] tnum">
                  {m.year}
                </p>
                <h3 className="font-display mt-1 text-xl text-[var(--color-fg)]">
                  {m.title}
                </h3>
                <p className="mt-2 max-w-[46ch] text-[0.95rem] leading-relaxed text-[var(--color-fg-muted)]">
                  {m.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* ---- Movement 2: the one authoritative NAP / contact block ---- */}
          <Reveal delay={0.1} className="lg:pt-2">
            <div className="filet relative overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 shadow-[var(--glass-shadow)] sm:p-10">
              <p className="eyebrow rule-gold text-[var(--gold-ink)]">
                Visit Sousan Medspa
              </p>
              <h3 className="font-display mt-5 text-2xl text-[var(--color-fg)]">
                Your glow starts here.
              </h3>
              <p className="mt-3 max-w-[42ch] text-[0.95rem] leading-relaxed text-[var(--color-fg-muted)]">
                Conveniently located in Houston, Sousan Medspa is your home for
                transformative, medical-grade aesthetics. Reach out, book a
                consultation, and let&rsquo;s begin your beauty evolution.
              </p>

              {/* what to expect */}
              <ul className="mt-7 grid gap-2.5">
                {[
                  "A personalized skin analysis on your first visit",
                  "Honest guidance — only the treatments you'll benefit from",
                  "Natural-looking, transformative results",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-[0.9rem] text-[var(--color-fg-muted)]"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 text-[var(--color-accent)]"
                    >
                      ✦
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              {/* the authoritative NAP */}
              <address className="mt-7 not-italic">
                <p className="font-display text-lg text-[var(--color-fg)]">
                  {NAP.name}
                </p>
                <p className="mt-1 text-[0.95rem] text-[var(--color-fg-muted)] tnum">
                  {NAP.street}
                  <br />
                  {NAP.city}, {NAP.state} {NAP.zip}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[0.95rem]">
                  <a
                    href={`tel:${NAP.phoneTel}`}
                    className="font-medium text-[var(--color-accent-deep)] underline-offset-4 hover:underline tnum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
                  >
                    {NAP.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${NAP.email}`}
                    className="font-medium text-[var(--color-accent-deep)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
                  >
                    {NAP.email}
                  </a>
                </div>
                <p className="mt-3 text-[0.82rem] text-[var(--color-fg-subtle)]">
                  {NAP.hours}
                </p>
              </address>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
