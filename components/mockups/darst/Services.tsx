"use client";

/**
 * Services — the offering grid across the practice's three pillars: medical &
 * surgical dermatology, cosmetic, and laser / injectables / vein. Clinical
 * cards with a depth-strata accent rail; each lists representative procedures.
 * The featured medical-derm card spans wide to signal the academic core.
 * Reduced-motion safe; full keyboard focus states.
 */

import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Service = {
  title: string;
  blurb: string;
  items: string[];
  featured?: boolean;
};

const SERVICES: Service[] = [
  {
    title: "Medical & surgical dermatology",
    blurb:
      "The academic core. Skin cancer screening, biopsy and excision, Mohs-referral surgery, acne, eczema, psoriasis, rashes and complex diagnoses — read in-house by a board-certified dermatopathologist.",
    items: [
      "Skin cancer screening",
      "Biopsy & excision",
      "Dermatopathology (in-house)",
      "Acne · eczema · psoriasis",
      "Rash & lesion diagnosis",
    ],
    featured: true,
  },
  {
    title: "Cosmetic dermatology",
    blurb:
      "Evidence-led aesthetic care from a physician who treats the skin as an organ first.",
    items: ["Medical-grade facials", "Chemical peels", "Skin rejuvenation"],
  },
  {
    title: "Laser & injectables",
    blurb:
      "Precise, restrained results — lasers and injectables selected for your skin, not a menu.",
    items: ["Laser resurfacing", "Neuromodulators", "Dermal fillers"],
  },
  {
    title: "Vein treatment",
    blurb:
      "Spider and varicose vein care with the same diagnostic rigor as the rest of the practice.",
    items: ["Sclerotherapy", "Vascular laser", "Vein evaluation"],
  },
];

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="bg-[var(--color-bg)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="What we treat"
          title={
            <>
              One practice, three disciplines —{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">
                one standard.
              </span>
            </>
          }
          lead="From a suspicious mole to a refined cosmetic result, every service is delivered under the same physician-led, evidence-first standard."
        />

        <RevealGroup className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <RevealItem
              key={s.title}
              as="article"
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7",
                "transition-[transform,box-shadow,border-color] duration-300",
                "hover:-translate-y-1 hover:border-[var(--color-accent-deep)] hover:shadow-[0_24px_60px_-30px_oklch(27%_0.05_253_/_0.4)]",
                s.featured && "lg:col-span-2",
              )}
            >
              {/* depth-strata accent rail */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1"
                style={{
                  background:
                    "linear-gradient(180deg, var(--strata-corneum), var(--strata-dermis), var(--strata-vessel))",
                }}
              />

              <h3 className="font-display text-2xl text-[var(--color-fg)]">
                {s.title}
              </h3>
              <p
                className={cn(
                  "mt-3 text-pretty font-light text-[var(--color-fg-muted)]",
                  s.featured ? "max-w-[52ch] text-[1.02rem]" : "text-[0.95rem]",
                )}
              >
                {s.blurb}
              </p>

              <ul
                className={cn(
                  "mt-6 flex flex-wrap gap-2",
                  s.featured && "max-w-[44ch]",
                )}
              >
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1.5 text-[0.8rem] font-medium text-[var(--color-fg-muted)]"
                  >
                    {it}
                  </li>
                ))}
              </ul>

              {s.featured && (
                <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-accent-subtle)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-deep)]">
                  In-house dermatopathology
                </span>
              )}
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.05}>
          <p className="mt-8 text-sm text-[var(--color-fg-subtle)]">
            Service lists are representative for this mockup. Complex surgical
            cases are coordinated with fellowship-trained Mohs surgeons as
            clinically appropriate.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
