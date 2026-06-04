"use client";

/**
 * SocialGallery — Instagram-style social-proof grid. They have a large IG
 * following, so this makes it shine: an editorial mosaic of brand-tinted
 * tiles with hover lift + a follow CTA. Tiles are CSS-only placeholders
 * (no asset deps) but structured like a real IG embed.
 */

import { RevealGroup, RevealItem, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

type Tile = {
  id: number;
  bg: string;
  caption: string;
  span?: string;
};

const TILES: Tile[] = [
  {
    id: 1,
    bg: "linear-gradient(150deg, var(--glow-rose), var(--glow-plum))",
    caption: "Lip artistry, our signature",
    span: "sm:col-span-2 sm:row-span-2",
  },
  { id: 2, bg: "linear-gradient(150deg, var(--glow-bronze), var(--glow-rose))", caption: "Glo2Facial glow" },
  { id: 3, bg: "linear-gradient(150deg, var(--glow-gold), var(--glow-bronze))", caption: "The new suite" },
  { id: 4, bg: "linear-gradient(150deg, var(--ink-warm), var(--glow-plum))", caption: "Behind the results" },
  { id: 5, bg: "linear-gradient(150deg, var(--glow-rose), var(--glow-gold))", caption: "Member event night" },
  { id: 6, bg: "linear-gradient(150deg, var(--glow-plum), var(--glow-bronze))", caption: "Tox day, done right" },
  { id: 7, bg: "linear-gradient(150deg, var(--glow-bronze), var(--ink-deep))", caption: "Skincare shelf picks" },
];

export function SocialGallery() {
  return (
    <section
      aria-label="Beyond Skin on Instagram"
      className="relative bg-[var(--color-bg-subtle)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Reveal>
              <p className="rule-bronze inline-block text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--gold-deep)]">
                The Feed
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="font-display mt-5 text-balance text-[var(--color-fg)]"
                style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
              >
                Loved by Columbus —{" "}
                <span className="italic">@beyondskinaesthetics</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-fg)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              Follow on Instagram →
            </a>
          </Reveal>
        </div>

        <RevealGroup
          stagger={0.05}
          className="mt-12 grid auto-rows-[1fr] grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {TILES.map((t) => (
            <RevealItem
              key={t.id}
              className={cn("min-h-0", t.span)}
            >
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square h-full w-full overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                style={{ background: t.bg }}
                aria-label={`Instagram post: ${t.caption}`}
              >
                <div className="grain absolute inset-0" aria-hidden />
                {/* hover scrim + caption */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/55 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm font-medium text-white drop-shadow">
                    {t.caption}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
                >
                  ↗
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-6 text-center text-xs text-[var(--color-fg-subtle)]">
          Sample tiles · live feed embeds the real Instagram grid.
        </p>
      </div>
    </section>
  );
}
