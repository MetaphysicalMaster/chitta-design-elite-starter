"use client";

/**
 * Services — the offering grid across the practice's three pillars: medical &
 * surgical dermatology, cosmetic, and laser / injectables / vein. Clinical
 * cards with a depth-strata accent rail; each lists representative procedures.
 * The featured medical-derm card spans wide to signal the academic core.
 * Reduced-motion safe; full keyboard focus states.
 */

import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./primitives";
import { BrandImage } from "./BrandImage";
import { cn } from "@/lib/utils";

type Service = {
  title: string;
  blurb: string;
  items: string[];
  featured?: boolean;
  /** The cosmetic/aesthetic card — carries the warm coral note + chip. */
  aesthetic?: boolean;
  /** Real graded photo for the card media slot. */
  src: string;
  /** Accessible description of the card photo. */
  imgAlt: string;
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
    src: "/clients/darst/gen/procedure.webp",
    imgAlt: "A dermatologist performing an in-office clinical procedure",
  },
  {
    title: "Cosmetic dermatology",
    blurb:
      "Results that look like you — evidence-led aesthetic care from a physician who reads skin as an organ first, then refines how it looks and feels.",
    items: ["Medical-grade facials", "Chemical peels", "Skin rejuvenation"],
    aesthetic: true,
    src: "/clients/darst/gen/filler.webp",
    imgAlt: "A patient receiving a refined cosmetic dermatology treatment",
  },
  {
    title: "Laser & injectables",
    blurb:
      "Precise, restrained results — lasers and injectables selected for your skin, not a menu.",
    items: ["Laser resurfacing", "Neuromodulators", "Dermal fillers"],
    src: "/clients/darst/gen/laser.webp",
    imgAlt: "A precision laser resurfacing treatment in progress",
  },
  {
    title: "Vein treatment",
    blurb:
      "Spider and varicose vein care with the same diagnostic rigor as the rest of the practice.",
    items: ["Sclerotherapy", "Vascular laser", "Vein evaluation"],
    src: "/clients/darst/gen/body.webp",
    imgAlt: "A clinical vein and vascular evaluation",
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
          lead="Medical, surgical and cosmetic dermatology — held to one physician-led, evidence-first standard, with diagnosis read in-house rather than mailed away."
        />

        <RevealGroup className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <RevealItem
              key={s.title}
              as="article"
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7",
                "transition-[transform,box-shadow,border-color] duration-300",
                "hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_oklch(30%_0.05_58_/_0.4)]",
                // aesthetic card warms to coral on hover; clinical cards to teal.
                s.aesthetic
                  ? "hover:border-[var(--color-coral-deep)]"
                  : "hover:border-[var(--color-accent-deep)]",
                s.featured && "lg:col-span-2",
              )}
            >
              {/* accent rail — the medical/clinical cards carry the depth-strata
                  (corneum → dermis → teal vessel); the aesthetic card carries the
                  warm coral note, the human/cosmetic register. */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1"
                style={{
                  background: s.aesthetic
                    ? "linear-gradient(180deg, var(--color-coral-subtle), var(--color-coral), var(--color-coral-deep))"
                    : "linear-gradient(180deg, var(--strata-corneum), var(--strata-dermis), var(--strata-vessel))",
                }}
              />

              {/* card media — the real graded treatment photo, locked to a wide
                  aspect-ratio (zero CLS); the aesthetic card warms to a coral
                  scrim register, the clinical cards stay neutral. */}
              <BrandImage
                alt={s.imgAlt}
                src={s.src}
                aspect={s.featured ? "16 / 7" : "16 / 9"}
                radius="xl"
                className="mb-6"
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
              {s.aesthetic && (
                <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-coral-subtle)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-coral-deep)]">
                  Natural-looking results
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
