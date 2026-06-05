"use client";

/**
 * Services — the treatment menu, presented as a bold editorial card set. The
 * three services the live site names lead (IPL, HydraFacial MD, Deluxe Facial),
 * plus one complementary pillar. Clean white cards, hot-pink hairline accents,
 * a representative price-from, and a hover lift. Card imagery is greyscale
 * sample plates with the lone pink pop. Prices are sample "from" figures.
 */

import { BrandImage } from "./BrandImage";
import { RevealGroup, RevealItem, SectionHeading, Magnetic } from "./primitives";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Service = {
  name: string;
  tag: string;
  from: string;
  body: string;
  points: string[];
  tone: "marble" | "emerald" | "gold";
};

const SERVICES: Service[] = [
  {
    name: "IPL Photofacial",
    tag: "Brightening",
    from: "$299",
    body: "Intense pulsed light to clear sun damage, redness and uneven tone — Houston sun, undone.",
    points: ["Sunspot clearing", "Rosacea calming", "Collagen lift"],
    tone: "gold",
  },
  {
    name: "HydraFacial MD",
    tag: "Signature",
    from: "$199",
    body: "Cleanse, extract and hydrate in one ritual — the resurfacing facial clients return for, month after month.",
    points: ["Vortex extraction", "Booster serums", "Zero downtime"],
    tone: "marble",
  },
  {
    name: "Deluxe Facial",
    tag: "Restorative",
    from: "$149",
    body: "A bespoke, deeply restorative facial tailored to your skin — the full Sousan glow, start to finish.",
    points: ["Custom analysis", "Deep hydration", "Lasting radiance"],
    tone: "marble",
  },
  {
    name: "Injectables & Skin",
    tag: "Refresh",
    from: "$12 / unit",
    body: "Tox, filler and medical-grade skin treatments placed with an artist's eye — refreshed, never overdone.",
    points: ["Neuromodulators", "Dermal filler", "Medical-grade"],
    tone: "emerald",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="relative bg-[var(--color-bg-subtle)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The Menu"
          title={
            <>
              Transformative care,{" "}
              <span className="font-display-em">an artist&rsquo;s eye.</span>
            </>
          }
          lead="The treatments Houston comes to Sousan for. Every service is performed in-house, tailored to your skin and your goals."
        />

        <RevealGroup
          as="ul"
          className="mt-14 grid gap-6 sm:grid-cols-2"
          stagger={0.08}
        >
          {SERVICES.map((s) => (
            <RevealItem as="li" key={s.name}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_1px_0_oklch(100%_0_0/0.6)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--glass-shadow)]">
                <BrandImage
                  alt={`${s.name} treatment at Sousan Med Spa`}
                  aspect="16:9"
                  tone={s.tone}
                  radius="lg"
                  className="rounded-none border-0 border-b border-[var(--color-border)]"
                />
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl text-[var(--color-fg)]">
                      {s.name}
                    </h3>
                    <span className="rounded-full border border-[var(--gold-deep)]/40 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--gold-ink)]">
                      {s.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-fg-muted)]">
                    {s.body}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-1.5 text-[0.82rem] text-[var(--color-fg-subtle)]"
                      >
                        <span
                          aria-hidden
                          className="text-[var(--color-accent)]"
                        >
                          ✦
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-5">
                    <p className="text-sm text-[var(--color-fg-muted)]">
                      From{" "}
                      <span className="font-display text-lg text-[var(--color-fg)] tnum">
                        {s.from}
                      </span>
                    </p>
                    <Link
                      href="#book"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent-deep)] underline-offset-4 transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
                    >
                      Book
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-12 flex justify-center">
          <Magnetic>
            <Link
              href="#book"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-7 py-3.5",
                "font-medium text-[var(--color-fg)] shadow-[var(--glass-shadow)]",
                "transition-transform duration-300 hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
              )}
            >
              See the full menu &amp; reserve
              <span aria-hidden>→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
