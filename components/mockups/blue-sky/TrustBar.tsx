"use client";

/**
 * TrustBar — the credibility strip directly under the hero.
 * Reinforces the three pillars the real site buries: 5.0★, physician-led, family-owned.
 */

import { Reveal } from "./Reveal";

const PILLARS = [
  {
    title: "5.0 on Google",
    sub: "Every review, five stars",
    icon: (
      <span aria-hidden className="text-[var(--gold)]">
        ★★★★★
      </span>
    ),
  },
  {
    title: "Physician-led",
    sub: "Dr. Maura Manning, MD · ex-ER",
    icon: <Glyph d="M12 3v18M3 12h18" />,
  },
  {
    title: "Family-owned",
    sub: "Independent since 2021",
    icon: <Glyph d="M4 20v-6a8 8 0 0 1 16 0v6M9 20v-3a3 3 0 0 1 6 0v3" />,
  },
  {
    title: "German Village",
    sub: "480 S 3rd St, Columbus",
    icon: <Glyph d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  },
];

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d={d} stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrustBar() {
  return (
    <section aria-label="Why patients trust Blue Sky" className="relative border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 px-6 sm:px-8 md:grid-cols-4">
        {PILLARS.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 0.06}
            className="flex items-center gap-3 py-6 md:justify-center [&:nth-child(odd)]:border-r [&:nth-child(odd)]:border-[var(--color-border-subtle)] md:[&:not(:last-child)]:border-r md:[&:not(:last-child)]:border-[var(--color-border-subtle)]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-sm">
              {p.icon}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-[var(--color-fg)]">{p.title}</span>
              <span className="text-xs text-[var(--color-fg-muted)]">{p.sub}</span>
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
