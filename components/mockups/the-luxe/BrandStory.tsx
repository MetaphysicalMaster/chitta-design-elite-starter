"use client";

/**
 * BrandStory — editorial brand moment. Physician-founder, white-glove luxury.
 * Two-column: couture copy + a layered "gold-leaf on emerald velvet" art panel
 * built from pure CSS (no external images needed for the mockup).
 */

import { Reveal, RevealGroup, RevealItem } from "./primitives";

const PILLARS = [
  {
    n: "01",
    t: "Physician-directed",
    d: "Every protocol is overseen by a board-certified medical director — not a franchise playbook.",
  },
  {
    n: "02",
    t: "White-glove ritual",
    d: "Champagne service, private suites and an unhurried consult. The experience matches the result.",
  },
  {
    n: "03",
    t: "Results-obsessed",
    d: "Premium injectables, Morpheus8 and laser delivered to a standard worthy of a 4.9★ name.",
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
            <p className="eyebrow rule-gold inline-block text-[0.7rem] text-[var(--gold)]">
              The House of Luxe
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="font-display mt-5 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.04 }}
            >
              A medical spa with the soul of a{" "}
              <span className="gold-leaf italic">jewel house.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className="mt-6 text-pretty font-light text-[var(--color-fg-muted)]"
              style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
            >
              The Luxe was founded in 2023 on a single conviction: aesthetic
              medicine practiced at a physician&rsquo;s standard deserves a
              setting just as refined. Under medical director{" "}
              <span className="font-normal text-[var(--color-fg)]">
                Dr. Carlos Sanchez
              </span>
              , our Upper Arlington suite pairs clinical precision with the kind
              of white-glove hospitality you&rsquo;d expect from a couture
              maison — quiet luxury, made literal.
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
                <span className="font-display text-lg text-[var(--gold)]">
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

        {/* Art panel — gold-leaf-on-emerald velvet, pure CSS */}
        <Reveal delay={0.1}>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[var(--glass-border)] shadow-[0_40px_100px_-40px_oklch(8%_0.02_168_/_0.9)]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 70% 20%, var(--emerald-mid), var(--emerald-abyss) 72%)",
              }}
            />
            {/* molten gold pool */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(46% 40% at 60% 58%, var(--gold-pale) 0%, var(--gold-bright) 16%, var(--gold-molten) 40%, var(--gold-deep) 58%, transparent 78%)",
                mixBlendMode: "screen",
                opacity: 0.92,
              }}
            />
            {/* fine gold ring framing */}
            <div
              aria-hidden
              className="absolute inset-5 rounded-[1.5rem] border border-[oklch(82%_0.1_88_/_0.3)]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <span className="font-display text-lg text-[var(--color-fg)]">
                Quiet luxury, clinical results.
              </span>
              <span className="rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] backdrop-blur-sm">
                Sample
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
