"use client";

/**
 * SocialGallery — Instagram-style social-proof grid. They have a large IG
 * following, so this makes it shine: an editorial mosaic of REAL brand photos
 * with a hover caption scrim + a follow CTA, structured like a live IG embed.
 * The big 2x2 lead tile carries the studio shot; the rest mix glow, event,
 * results, facial, injectable and product photography. Links point at the real
 * Instagram handle.
 */

import { RevealGroup, RevealItem, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const IG_URL = "https://www.instagram.com/beyondskinaesthetics/";

type Tile = {
  id: number;
  src: string;
  caption: string;
  span?: string;
};

const TILES: Tile[] = [
  {
    id: 1,
    src: "/clients/beyond-skin/gen/mauve-studio.webp",
    caption: "The journey to wellness",
    span: "sm:col-span-2 sm:row-span-2",
  },
  { id: 2, src: "/clients/beyond-skin/gen/mauve-glow.webp", caption: "Signature facial glow" },
  { id: 3, src: "/clients/beyond-skin/gen/mauve-event.webp", caption: "Member event night" },
  { id: 4, src: "/clients/beyond-skin/gen/mauve-results.webp", caption: "Behind the results" },
  { id: 5, src: "/clients/beyond-skin/gen/facial.webp", caption: "Inside the studio" },
  { id: 6, src: "/clients/beyond-skin/gen/tox.webp", caption: "Naturally refreshed" },
  { id: 7, src: "/clients/beyond-skin/real/asset18.webp", caption: "Skincare shelf picks" },
];

export function SocialGallery() {
  return (
    <section
      aria-label="Beyond Skin on Instagram"
      className="relative bg-[var(--color-bg-subtle)] py-24 sm:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1100px" }}
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
              href={IG_URL}
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
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square h-full w-full overflow-hidden rounded-2xl bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                aria-label={`Instagram post: ${t.caption}`}
              >
                <img
                  src={t.src}
                  alt={t.caption}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
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
          Representative imagery · on launch this embeds the live{" "}
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-fg-muted)] underline-offset-2 hover:underline"
          >
            @beyondskinaesthetics
          </a>{" "}
          grid.
        </p>
      </div>
    </section>
  );
}
