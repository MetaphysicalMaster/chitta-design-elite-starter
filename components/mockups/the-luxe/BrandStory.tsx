"use client";

/**
 * BrandStory — editorial brand moment. The Luxe philosophy: advanced aesthetic
 * medicine delivered with thoughtful, individualized care. Two-column: warm
 * editorial copy + a layered "warm marble + soft peach light" art panel built
 * from pure CSS (echoes the live spa's marble + soft peach abstract art).
 */

import { Reveal, RevealGroup, RevealItem } from "./primitives";

const PILLARS = [
  {
    n: "01",
    t: "Thoughtful & individualized",
    d: "Your provider designs a plan around your face and your goals — never a one-size-fits-all menu.",
  },
  {
    n: "02",
    t: "Science-backed, with intention",
    d: "Advanced, evidence-based treatments delivered with genuine care — and the patience to do them right.",
  },
  {
    n: "03",
    t: "A true escape",
    d: "Warm marble, soft light, an unhurried welcome. The experience is as elevated as the results.",
  },
];

export function BrandStory() {
  return (
    <section
      id="story"
      className="grain relative scroll-mt-24 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy column */}
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow rule-gold inline-block text-[0.7rem] text-[var(--gold-deep)]">
              The Luxe philosophy
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="font-display mt-5 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.04 }}
            >
              Look like yourself.{" "}
              <span className="gold-leaf italic">Only timeless.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className="mt-6 text-pretty font-light text-[var(--color-fg-muted)]"
              style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
            >
              The Luxe MedSpa was built on a simple belief: advanced aesthetic
              medicine should feel personal. In our calm Upper Arlington spa, we
              pair science-backed treatments with the time to truly listen — so
              every plan is shaped around you. The goal is never &ldquo;done.&rdquo;
              It&rsquo;s you, refreshed, empowered, and timeless.
            </p>
          </Reveal>

          <RevealGroup
            as="ul"
            stagger={0.1}
            className="mt-10 space-y-px overflow-hidden rounded-2xl border border-[var(--color-border)]"
          >
            {PILLARS.map((p) => (
              <RevealItem
                key={p.n}
                as="li"
                className="group flex gap-5 bg-[var(--color-bg-subtle)] p-5 transition-colors duration-300 hover:bg-[var(--color-bg-elevated)]"
              >
                <span className="font-display text-lg text-[var(--gold-deep)]">
                  {p.n}
                </span>
                <div>
                  <h3 className="font-display text-xl text-[var(--color-fg)]">
                    {p.t}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {p.d}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Art panel — warm marble + soft peach light, pure CSS */}
        <Reveal delay={0.1}>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[var(--color-border)] shadow-[0_40px_100px_-50px_oklch(50%_0.04_70_/_0.55)]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(150deg, var(--marble) 0%, var(--cream) 50%, var(--cream-deep) 100%)",
              }}
            />
            {/* soft peach abstract art glow */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 44% at 62% 36%, var(--peach-deep) 0%, var(--peach) 28%, transparent 64%), radial-gradient(40% 38% at 30% 78%, var(--gold-pale) 0%, transparent 60%)",
                opacity: 0.95,
              }}
            />
            {/* fine gold ring framing */}
            <div
              aria-hidden
              className="absolute inset-5 rounded-[1.5rem] border border-[oklch(72%_0.1_80_/_0.35)]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <span className="font-display text-lg text-[var(--color-fg)]">
                A calm, luxurious escape.
              </span>
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--glass-bg)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] backdrop-blur-sm">
                Sample
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
