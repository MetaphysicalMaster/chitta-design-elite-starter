"use client";

/**
 * TreatmentMarquee — a horizontal, auto-scrolling bar of treatment cards. Each
 * card pairs an on-brand placeholder image (the BrandImage gradient plate,
 * marked "sample") with a treatment label, giving the practice's breadth a
 * lively, continuous ribbon between the proof board and the closer.
 *
 * Mechanics:
 *  - the track holds the cards TWICE and translates -50% in a seamless loop
 *    (CSS animation in brand.css), so there's no visible seam.
 *  - PAUSES on hover / focus-within (CSS `:hover`/`:focus-within`).
 *  - prefers-reduced-motion → animation is disabled and the row becomes a
 *    normal horizontally-scrollable, swipeable strip (CSS), never auto-moving.
 *  - edges fade via a CSS mask so cards enter/leave gracefully.
 *
 * The duplicated half is aria-hidden so screen readers hear each treatment once.
 */

import { BrandImage } from "./BrandImage";
import { SectionHeading, Reveal } from "./primitives";

type Treatment = {
  label: string;
  blurb: string;
  variant: "paper" | "navy" | "accent";
};

const TREATMENTS: Treatment[] = [
  { label: "Skin cancer screening", blurb: "Full-body exams", variant: "navy" },
  { label: "Mohs surgery", blurb: "Precise excision", variant: "accent" },
  { label: "Dermatopathology", blurb: "In-house slide reads", variant: "paper" },
  { label: "Botox", blurb: "Neuromodulators", variant: "navy" },
  { label: "Dermal fillers", blurb: "Natural volume", variant: "accent" },
  { label: "Laser resurfacing", blurb: "Tone & texture", variant: "paper" },
  { label: "Vein treatment", blurb: "Sclerotherapy", variant: "navy" },
  { label: "Acne & eczema", blurb: "Medical care", variant: "accent" },
  { label: "Chemical peels", blurb: "Skin renewal", variant: "paper" },
];

function Card({ t }: { t: Treatment }) {
  return (
    <article className="w-[15rem] shrink-0 sm:w-[16.5rem]">
      <BrandImage
        alt={`${t.label} — clinical treatment`}
        aspect="4 / 3"
        variant={t.variant}
        radius="xl"
        scrim="soft"
        label={t.label}
      />
      <p className="mt-3 px-1 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[var(--color-accent-deep)]">
        {t.blurb}
      </p>
    </article>
  );
}

export function TreatmentMarquee() {
  return (
    <section
      aria-labelledby="treatments-title"
      className="overflow-hidden bg-[var(--color-bg-subtle)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The full range"
          title={
            <>
              One practice for the whole of{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">
                skin health.
              </span>
            </>
          }
          lead="From a suspicious mole to a refined cosmetic result — medical, surgical and aesthetic care under one physician-led standard."
        />
      </div>

      <Reveal className="mt-12 sm:mt-14">
        {/* The marquee viewport — masked edges; pauses on hover/focus. */}
        <div
          className="dt-marquee"
          aria-label="Treatments offered (auto-scrolling)"
        >
          <ul className="dt-marquee__track gap-4 px-4 sm:gap-5 sm:px-6">
            {TREATMENTS.map((t) => (
              <li key={t.label}>
                <Card t={t} />
              </li>
            ))}
            {/* Seamless-loop duplicate — hidden from assistive tech. */}
            {TREATMENTS.map((t) => (
              <li key={`dup-${t.label}`} aria-hidden>
                <Card t={t} />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="mx-auto mt-7 max-w-6xl px-6 sm:px-8">
        <p className="text-sm text-[var(--color-fg-subtle)]">
          Treatment imagery is on-brand placeholder for this mockup (marked
          sample); real procedure photography would be slotted in here.
        </p>
      </div>
    </section>
  );
}
