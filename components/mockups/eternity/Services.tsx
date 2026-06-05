"use client";

/**
 * Services — the menu, grouped into the three pillars: injectables, skin, and
 * body. Each card is an on-brand noir-luxe plate with a calm chrome hover lift.
 * Refined, enduring, never salesy. Reduced-motion safe.
 */

import Link from "next/link";
import { SectionHeading, RevealGroup, RevealItem } from "./primitives";
import { BrandImage } from "./BrandImage";
import { cn } from "@/lib/utils";

type Service = {
  group: string;
  tone: "night" | "silver" | "amethyst";
  title: string;
  blurb: string;
  items: string[];
};

const SERVICES: Service[] = [
  {
    group: "Injectables",
    tone: "amethyst",
    title: "Refined, never overdone",
    blurb:
      "Tox, dermal filler and lip enhancement placed for a rested, natural result that holds — artistry from eighteen years at the needle.",
    items: ["Neurotoxin (tox)", "Dermal filler", "Lip enhancement", "Cheek & jaw contour"],
  },
  {
    group: "Skin",
    tone: "silver",
    title: "Glass-clear, lasting skin",
    blurb:
      "Medical-grade facials, resurfacing and microneedling tuned to your skin — corrective care that compounds over time.",
    items: ["Medical facials", "Laser resurfacing", "Microneedling", "Medical-grade skincare"],
  },
  {
    group: "Body",
    tone: "night",
    title: "Contour & confidence",
    blurb:
      "Non-invasive body contouring, skin tightening and wellness support — sculpted results designed to endure.",
    items: ["Body contouring", "Skin tightening", "Cellulite therapy", "Wellness & vitality"],
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-20 bg-[var(--night-1)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The menu"
          title={
            <>
              Three pillars,{" "}
              <span className="font-display-em silver-text">one standard.</span>
            </>
          }
          lead="Injectables, skin and body — under one roof on Olive Blvd, led by Michelle and a clinical team St. Louis has trusted for eighteen years."
        />

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.09}>
          {SERVICES.map((s) => (
            <RevealItem as="article" key={s.group}>
              <div className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--night-2)] shadow-[var(--glass-shadow)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-bright)] hover:shadow-[0_30px_70px_-32px_oklch(72%_0.05_300_/_0.4)]">
                <BrandImage
                  alt={`${s.group} at Eternity — ${s.title.toLowerCase()}`}
                  aspect="16:10"
                  tone={s.tone}
                  radius="lg"
                  className="rounded-none border-0 border-b border-[var(--color-border)]"
                >
                  <span className="absolute bottom-3 left-3.5 z-10 rounded-full bg-[oklch(13%_0.024_300_/_0.55)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[oklch(96%_0.01_300)] backdrop-blur-sm">
                    {s.group}
                  </span>
                </BrandImage>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-medium text-[var(--color-fg)]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {s.blurb}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-[var(--color-border)] bg-[var(--night-1)] px-3 py-1 text-xs font-medium text-[var(--color-fg-muted)]"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#book"
                    className={cn(
                      "mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold",
                      "text-[var(--color-accent-bright)] hover:underline",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                    )}
                  >
                    Book {s.group.toLowerCase()}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
