"use client";

/**
 * Legacy — THE CLOSER. Two movements:
 *
 *  1. "Since 1995, River Oaks" — a vertical legacy timeline that turns 29 years
 *     of tenure into the brand's core asset (the thing the DIY WordPress site
 *     buries). Couture serif milestones on a gold-filet rail.
 *
 *  2. The single, clean NAP & branded-contact block — explicitly the fix for
 *     the trust gap: the live presence has a gmail business email and
 *     conflicting addresses scattered across directories. Here it's ONE
 *     authoritative address, ONE phone, ONE branded inbox. The "before/after"
 *     of the data itself, shown plainly so the prospect sees the problem solved.
 */

import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./primitives";
import { NAP } from "./nap";

const MILESTONES = [
  {
    year: "1995",
    title: "Sousan opens her doors",
    body: "A single esthetician's chair in River Oaks, built on one belief: results, delivered personally.",
  },
  {
    year: "2004",
    title: "A neighborhood standard",
    body: "Word travels the corridor. Sousan becomes the name River Oaks passes between friends — never advertised, always referred.",
  },
  {
    year: "2014",
    title: "Medical-grade, on Montrose",
    body: "HydraFacial MD, IPL and advanced devices join the menu — clinical results under the same trusted hand.",
  },
  {
    year: "2025",
    title: "Twenty-nine years, one address",
    body: "Three decades of skin, refined into a destination. Same owner. Same standard. Same River Oaks.",
  },
];

export function Legacy() {
  return (
    <section
      id="legacy"
      className="relative overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      {/* faint marble inlay rhythm */}
      <div
        aria-hidden
        className="ruler-ticks pointer-events-none absolute inset-x-0 top-0 h-px opacity-50"
      />

      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Since 1995 · River Oaks"
          title={
            <>
              A legacy you can&apos;t{" "}
              <span className="font-display-em">start tomorrow.</span>
            </>
          }
          lead="Twenty-nine years in one of America's most discerning zip codes is not a tagline — it is the entire proposition. Here is the timeline that earns it."
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ---- Movement 1: the timeline ---- */}
          <RevealGroup as="ul" className="relative" stagger={0.12}>
            {/* the gold rail */}
            <span
              aria-hidden
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
                One name · One address · One standard
              </p>
              <h3 className="font-display mt-5 text-2xl text-[var(--color-fg)]">
                The record, set straight.
              </h3>
              <p className="mt-3 max-w-[42ch] text-[0.95rem] leading-relaxed text-[var(--color-fg-muted)]">
                Across the web today, Sousan&apos;s details conflict — a personal
                gmail inbox, three different street addresses, an outdated suite.
                For a 29-year institution, inconsistency reads as risk. So we
                fixed it. Below is the single authoritative listing — the one
                your clients, Google, and the directories should all see.
              </p>

              {/* before → after of the data */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                    Before
                  </p>
                  <ul className="mt-2 space-y-1.5 text-[0.82rem] text-[var(--color-fg-muted)]">
                    <li className="line-through decoration-[var(--color-error)]/70">
                      sousanspa1995@gmail.com
                    </li>
                    <li className="line-through decoration-[var(--color-error)]/70">
                      3 conflicting addresses online
                    </li>
                    <li className="line-through decoration-[var(--color-error)]/70">
                      DIY WordPress, no booking
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-[var(--color-accent)]/35 bg-[var(--color-accent-subtle)]/60 p-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-deep)]">
                    After
                  </p>
                  <ul className="mt-2 space-y-1.5 text-[0.82rem] font-medium text-[var(--color-fg)]">
                    <li>hello@sousanmedspa.com</li>
                    <li>One verified River Oaks address</li>
                    <li>Native online booking</li>
                  </ul>
                </div>
              </div>

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
