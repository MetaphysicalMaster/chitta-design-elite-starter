"use client";

/**
 * Services — the menu, injectables-led. Injectables sits first as a featured,
 * spanning card (it's their #1 volume product), followed by lasers, skin,
 * body and wellness. Each card is book-able. Hover lifts + aurora edge tick.
 */

import Link from "next/link";
import { SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  blurb: string;
  treatments: string[];
  icon: React.ReactNode;
  featured?: boolean;
};

const I = (d: string) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
    <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CATEGORIES: Category[] = [
  {
    id: "injectables",
    name: "Injectables",
    blurb: "Our #1 specialty — Botox & Juvéderm, placed by a national trainer's team.",
    treatments: [
      "BOTOX® Cosmetic",
      "JUVÉDERM® filler collection",
      "Lip enhancement & cheek volume",
      "Jawline & chin contouring",
      "Sculptra & Kybella",
    ],
    icon: I("M14 4 4 14m0 0v4h4l10-10-4-4Zm6 2-2-2"),
    featured: true,
  },
  {
    id: "lasers",
    name: "Lasers & Energy",
    blurb: "Resurfacing, tightening & hair removal.",
    treatments: ["Laser hair removal", "IPL photofacial", "RF microneedling", "Laser resurfacing"],
    icon: I("M12 3v3m0 12v3m9-9h-3M6 12H3m13.5-6.5-2 2m-7 7-2 2m11 0-2-2m-7-7-2-2"),
  },
  {
    id: "skin",
    name: "Skin & Facials",
    blurb: "Medical-grade glow, texture & tone.",
    treatments: ["HydraFacial", "Chemical peels", "Microneedling + PRP", "Medical-grade skincare"],
    icon: I("M12 3a9 9 0 1 0 9 9 4 4 0 0 1-4-4 4 4 0 0 1-4-4 1 1 0 0 0-1-1Z"),
  },
  {
    id: "body",
    name: "Body Contouring",
    blurb: "Non-surgical fat reduction & sculpting.",
    treatments: ["CoolSculpting", "Body skin tightening", "Cellulite reduction", "Muscle toning"],
    icon: I("M8 3h8M9 3v4a3 3 0 0 1-1 2l-2 2a4 4 0 0 0 0 6l2 2M15 3v4a3 3 0 0 0 1 2l2 2a4 4 0 0 1 0 6l-2 2"),
  },
  {
    id: "wellness",
    name: "Wellness",
    blurb: "Feel as good as you look, at altitude.",
    treatments: ["IV vitamin therapy", "Medical weight loss", "B12 & NAD+", "Hormone optimization"],
    icon: I("M12 21s-7-4.4-9-9a5 5 0 0 1 9-2 5 5 0 0 1 9 2c-2 4.6-9 9-9 9Z"),
  },
];

function Card({ c, index }: { c: Category; index: number }) {
  return (
    <Reveal
      delay={index * 0.06}
      className={c.featured ? "sm:col-span-2 xl:col-span-1 xl:row-span-2" : ""}
    >
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border p-6",
          "transition-[transform,box-shadow] duration-300 hover:-translate-y-1",
          c.featured
            ? "border-[var(--color-accent)]/40 bg-[var(--color-bg-elevated)] shadow-[0_24px_64px_-30px_oklch(56%_0.2_300_/_0.5)]"
            : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)] hover:border-[var(--color-accent)]/40",
        )}
      >
        {c.featured && (
          <span
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-30 blur-2xl"
            style={{ background: "radial-gradient(circle, var(--color-accent-bright), transparent 70%)" }}
          />
        )}
        {/* aurora edge tick that appears on hover */}
        <span
          aria-hidden
          className="absolute left-0 top-6 h-8 w-1 origin-top rounded-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "linear-gradient(var(--color-accent), var(--color-teal))" }}
        />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]">
            {c.icon}
          </span>
          {c.featured && (
            <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-fg)]">
              #1 Specialty
            </span>
          )}
        </div>
        <h3 className="font-display mt-5 text-xl font-semibold text-[var(--color-fg)]">
          {c.name}
        </h3>
        <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">{c.blurb}</p>
        <ul className="mt-4 flex flex-1 flex-col gap-2">
          {c.treatments.map((t) => (
            <li key={t} className="flex items-center gap-2 text-sm text-[var(--color-fg)]">
              <span aria-hidden className="text-[var(--color-accent)]">›</span>
              {t}
            </li>
          ))}
        </ul>
        <Link
          href="#book"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          Book {c.name.toLowerCase()}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </article>
    </Reveal>
  );
}

export function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-20 overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The full menu"
          title={
            <>
              Injectables first.{" "}
              <span className="text-[var(--color-accent-deep)]">Everything else</span>, expertly.
            </>
          }
          lead="We built our name on Botox & Juvéderm — the highest volume in Colorado — and surround it with lasers, advanced skin, body contouring and wellness. One trainer-led standard across the entire menu."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Card key={c.id} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
