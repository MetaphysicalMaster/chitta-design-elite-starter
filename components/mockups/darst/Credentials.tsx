"use client";

/**
 * Credentials — THE CLOSER. "Why a dermatopathologist sees what others miss."
 *
 * A credentials-forward trust module that reframes the slipping 3.5★ narrative
 * around rare senior expertise: most dermatologists outsource the microscope;
 * Dr. Darst is board-certified to read it himself. A diagnosis-loop diagram
 * (see → biopsy → read → treat, all under one physician) makes the abstract
 * credential concrete and reassuring. This is the section that converts skeptics
 * — it answers "is this practice good?" with "this is a rare academic expert",
 * not with a star average.
 */

import { Reveal, RevealGroup, RevealItem } from "./primitives";

const LOOP = [
  {
    n: "01",
    t: "He sees you",
    d: "A board-certified dermatologist examines your skin directly — no mid-level handoff.",
  },
  {
    n: "02",
    t: "He takes the biopsy",
    d: "When tissue is needed, the same physician performs the procedure.",
  },
  {
    n: "03",
    t: "He reads the slide",
    d: "Board-certified in dermatopathology, Dr. Darst examines your tissue under the microscope himself — the step most practices outsource to a lab they never meet.",
  },
  {
    n: "04",
    t: "He treats the result",
    d: "Diagnosis and treatment stay with one expert — fewer translations, fewer misses, faster answers.",
  },
];

export function Credentials() {
  return (
    <section
      id="credentials"
      aria-labelledby="credentials-title"
      className="relative overflow-hidden bg-[var(--night-1)] py-24 sm:py-32"
    >
      {/* depth wash so the dark room is lit, never a flat block */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(56% 80% at 16% 22%, oklch(46% 0.07 250 / 0.22), transparent 60%), radial-gradient(60% 90% at 88% 80%, oklch(45% 0.15 22 / 0.16), transparent 62%)",
        }}
      />
      {/* faint strata hairlines — the anatomy-plate motif */}
      <div
        aria-hidden
        className="strata-ticks pointer-events-none absolute inset-y-0 right-0 w-px opacity-[0.12]"
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow rule-accent text-[var(--color-accent-bright)]">
              The difference
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="credentials-title"
              className="font-display mt-5 text-balance text-[var(--color-bg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.07 }}
            >
              Why a{" "}
              <span className="font-display-em text-[oklch(80%_0.07_250)]">
                dermatopathologist
              </span>{" "}
              sees what others miss.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className="mt-6 max-w-[58ch] text-pretty font-light text-[oklch(88%_0.02_250_/_0.88)]"
              style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.62 }}
            >
              When a spot is biopsied, the diagnosis is made not in the exam room
              but under a microscope. At most practices, that slide is mailed to
              an outside lab and read by a pathologist who never met you. Dr.
              Darst is{" "}
              <span className="font-medium text-[var(--color-bg)]">
                board-certified in both dermatology and dermatopathology
              </span>{" "}
              — a rare pairing that lets one physician carry your case from skin
              to slide to treatment.
            </p>
          </Reveal>
        </div>

        {/* The diagnosis loop — four steps, one physician. */}
        <RevealGroup
          as="ul"
          className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {LOOP.map((s, i) => (
            <RevealItem
              as="li"
              key={s.n}
              className="relative flex flex-col rounded-2xl border border-[var(--glass-border-dark)] bg-[oklch(27%_0.048_252_/_0.5)] p-6 backdrop-blur-sm"
            >
              <span
                aria-hidden
                className="font-display text-sm text-[var(--color-accent-bright)] tnum"
              >
                {s.n}
              </span>
              <h3 className="font-display mt-3 text-xl text-[var(--color-bg)]">
                {s.t}
              </h3>
              <p className="mt-2.5 text-[0.92rem] leading-relaxed text-[oklch(86%_0.02_250_/_0.82)]">
                {s.d}
              </p>
              {i < LOOP.length - 1 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-[var(--color-accent-bright)] lg:block"
                >
                  →
                </span>
              )}
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Reputation reframe — addresses the 3.5★ narrative head-on, with
            credentials, not defensiveness. */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-[var(--glass-border-dark)] bg-[oklch(22%_0.042_253_/_0.6)] p-7 sm:flex-row sm:items-center sm:gap-8 sm:p-9">
            <p className="font-display text-2xl leading-snug text-[var(--color-bg)] sm:max-w-[20ch]">
              Choose your dermatologist on credentials, not just star counts.
            </p>
            <p className="text-[0.95rem] leading-relaxed text-[oklch(86%_0.02_250_/_0.84)] sm:border-l sm:border-[var(--glass-border-dark)] sm:pl-8">
              Online reviews capture wait times and front-desk moods. They
              can&rsquo;t capture a margin read correctly the first time, or a
              melanoma caught early because one physician saw both the skin and
              the slide. That is the standard Dr. Darst is built on — and the one
              worth measuring him by.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
