"use client";

/**
 * Team — "Meet Dr. Sanchez" founder-credibility section + provider roster.
 * Establishes physician authority (the prospect's real differentiator) with a
 * couture portrait panel (CSS placeholder) and the real care team.
 */

import { Reveal, RevealGroup, RevealItem } from "./primitives";

const PROVIDERS = [
  { name: "Anne Wood, FNP-C", role: "Nurse Practitioner · Injector" },
  { name: "Dawn Haque, NP", role: "Nurse Practitioner · Wellness" },
  { name: "Aesthetics Team", role: "Licensed Medical Aesthetician" },
  { name: "Nikki", role: "Practice Manager · Concierge" },
];

export function Team() {
  return (
    <section
      id="team"
      className="grain relative scroll-mt-24 overflow-hidden bg-[var(--emerald-abyss)] py-24 sm:py-32"
    >
      <div className="hairline-gold absolute inset-x-0 top-0" aria-hidden />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Portrait panel */}
        <Reveal>
          <figure className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-[var(--glass-border)] shadow-[0_40px_100px_-44px_oklch(8%_0.02_168_/_0.9)]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 100% at 30% 18%, var(--emerald-mid), var(--emerald-abyss) 74%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(42% 36% at 64% 70%, var(--gold-bright) 0%, var(--gold-molten) 30%, var(--gold-deep) 52%, transparent 76%)",
                mixBlendMode: "screen",
                opacity: 0.7,
              }}
            />
            <div
              aria-hidden
              className="absolute inset-5 rounded-[1.5rem] border border-[oklch(82%_0.1_88_/_0.28)]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <span className="block font-display text-xl text-[var(--color-fg)]">
                  Dr. Carlos Sanchez
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
                  Owner · Medical Director
                </span>
              </div>
              <span className="rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] backdrop-blur-sm">
                Sample
              </span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Copy */}
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow rule-gold inline-block text-[0.7rem] text-[var(--gold)]">
              Meet the Director
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="font-display mt-5 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.04 }}
            >
              Led by a board-certified{" "}
              <span className="gold-leaf italic">physician.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className="mt-6 text-pretty font-light text-[var(--color-fg-muted)]"
              style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
            >
              Dr. Carlos Sanchez is a board-certified interventional cardiologist
              who brings a physician&rsquo;s rigor to aesthetic medicine. His
              founding vision — featured in <span className="italic">Voyage Ohio</span> —
              was a med spa where clinical safety and genuine luxury are never a
              trade-off. Every plan at The Luxe carries that standard.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-9 text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]">
              The Care Team
            </p>
          </Reveal>
          <RevealGroup
            as="ul"
            stagger={0.08}
            className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] sm:grid-cols-2"
          >
            {PROVIDERS.map((p) => (
              <RevealItem
                key={p.name}
                as="li"
                className="bg-[oklch(20%_0.03_166_/_0.5)] p-5 transition-colors duration-300 hover:bg-[oklch(25%_0.04_162_/_0.6)]"
              >
                <span className="block font-display text-lg text-[var(--color-fg)]">
                  {p.name}
                </span>
                <span className="mt-1 block text-sm text-[var(--color-fg-muted)]">
                  {p.role}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
