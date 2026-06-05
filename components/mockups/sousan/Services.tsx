"use client";

/**
 * Services — the treatment menu, presented as a couture card set. Four pillars
 * the brief names: HydraFacial MD, IPL Photofacial, Body Contouring,
 * Injectables. Marble cards with gold hairlines, a representative price-from,
 * and a hover lift. Prices are sample "from" figures for the mockup.
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
    name: "HydraFacial MD",
    tag: "Signature",
    from: "$199",
    body: "Cleanse, extract and hydrate in one River Oaks ritual — the resurfacing facial the corridor returns for monthly.",
    points: ["Vortex extraction", "Booster serums", "Zero downtime"],
    tone: "marble",
  },
  {
    name: "IPL Photofacial",
    tag: "Brightening",
    from: "$299",
    body: "Intense pulsed light to clear sun damage, redness and uneven tone — Houston sun, undone.",
    points: ["Sunspot clearing", "Rosacea calming", "Collagen lift"],
    tone: "gold",
  },
  {
    name: "Body Contouring",
    tag: "Sculpt",
    from: "$349",
    body: "Non-invasive sculpting and skin tightening to refine the silhouette — results without the recovery.",
    points: ["Fat reduction", "Skin tightening", "Series plans"],
    tone: "emerald",
  },
  {
    name: "Injectables",
    tag: "Refresh",
    from: "$12 / unit",
    body: "Tox and dermal filler placed with a 29-year eye for proportion — refreshed, never overdone.",
    points: ["Neuromodulators", "Dermal filler", "Lip & cheek"],
    tone: "marble",
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
              Medical-grade care,{" "}
              <span className="font-display-em">couture delivery.</span>
            </>
          }
          lead="Four disciplines, one trusted hand. Every treatment is performed in-house under the standard River Oaks has trusted since 1995."
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
