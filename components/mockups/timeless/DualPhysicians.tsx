"use client";

/**
 * DualPhysicians — THE CLOSER. "Two physicians, one standard."
 *
 * The single most important correction this page makes: the live EMR template
 * buries the two-MD model behind a generic "Family Medicine Physicians" title.
 * Here we humanize and foreground it — a dual-MD credibility split that reads as
 * a luxury aesthetics institution led by real, named physicians: Dr. Timothy
 * McCarren & Dr. Sonja Heuker. A center brass seam ("one standard") binds the
 * two portraits into a single institution, not two profiles.
 */

import { Reveal, SectionHeading, BrandImage } from "./primitives";
import { cn } from "@/lib/utils";

type Doc = {
  name: string;
  role: string;
  focus: string;
  blurb: string;
  creds: string[];
  variant: "default" | "brass";
};

const DOCS: Doc[] = [
  {
    name: "Dr. Timothy McCarren",
    role: "Founding Physician",
    focus: "Injectables & facial harmony",
    blurb:
      "A decade refining the proportion-first approach Cincinnati now expects — soft, structural, never overfilled. The judgment behind every plan.",
    creds: [
      "10+ years in aesthetic medicine",
      "Advanced injectable artistry",
      "Facial-balancing philosophy",
    ],
    variant: "default",
  },
  {
    name: "Dr. Sonja Heuker",
    role: "Physician · Laser & Skin",
    focus: "Secret RF, laser & medical skin",
    blurb:
      "Energy-based resurfacing and medical-grade skin health, led with the same restraint — results that read as your skin, only rested and renewed.",
    creds: [
      "Secret RF & laser specialist",
      "Medical-grade skin protocols",
      "Devices held to one standard",
    ],
    variant: "brass",
  },
];

function DocCard({ d, side }: { d: Doc; side: "left" | "right" }) {
  return (
    <article className="relative flex flex-col">
      <BrandImage
        aspect="5 / 6"
        variant={d.variant}
        radius="3xl"
        label={d.name}
        className="shadow-[var(--glass-shadow)]"
      />
      <div className="mt-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-deep)]">
          {d.role}
        </p>
        <h3 className="font-display mt-2 text-[1.9rem] leading-tight text-[var(--color-fg)]">
          {d.name}
        </h3>
        <p className="mt-1 text-sm italic text-[var(--color-fg-subtle)]">
          {d.focus}
        </p>
        <p className="mt-4 max-w-[42ch] text-pretty font-light leading-relaxed text-[var(--color-fg-muted)]">
          {d.blurb}
        </p>
        <ul className={cn("mt-5 space-y-2.5", side === "right" && "lg:text-right")}>
          {d.creds.map((c) => (
            <li
              key={c}
              className={cn(
                "flex items-start gap-3 text-sm text-[var(--color-fg-muted)]",
                side === "right" && "lg:flex-row-reverse lg:text-right",
              )}
            >
              <span
                aria-hidden
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[var(--color-accent-subtle)] text-[var(--color-accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
                  <path d="M5 12.5 10 17 19 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function DualPhysicians() {
  return (
    <section
      id="physicians"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg-warm)] py-24 sm:py-28"
    >
      {/* warm brass aura echoing the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(55% 50% at 88% 4%, oklch(88% 0.06 82 / 0.5), transparent 70%), radial-gradient(50% 50% at 4% 100%, var(--color-accent-subtle), transparent 72%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="The closer · Two physicians, one standard"
          title={
            <>
              Not a clinic of faces.{" "}
              <span className="font-display-em">A practice with two.</span>
            </>
          }
          lead="The template called them “Family Medicine Physicians.” The truth is far rarer: a med spa directed, in person, by two physicians who hold every device, every plan, and every result to the same uncompromising standard."
        />

        <div className="relative mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Center brass seam — "one standard" binding the two physicians.
              Decorative; hidden on stacked mobile. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-6 left-1/2 hidden w-px -translate-x-1/2 lg:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--brass) 18%, var(--brass-deep) 50%, var(--brass) 82%, transparent)",
            }}
          />
          {/* center medallion on the seam */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <span
              className="grid h-14 w-14 place-items-center rounded-full border border-[var(--brass)]/60 text-[var(--color-accent-deep)] shadow-[0_10px_30px_-12px_oklch(58%_0.094_76_/_0.5)]"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 25%, oklch(94% 0.05 84), oklch(84% 0.07 74))",
              }}
            >
              <span className="font-display text-sm font-semibold">&amp;</span>
            </span>
          </div>

          <Reveal>
            <DocCard d={DOCS[0]} side="left" />
          </Reveal>
          <Reveal delay={0.1}>
            <DocCard d={DOCS[1]} side="right" />
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-16 max-w-[58ch] text-center font-display text-xl italic leading-relaxed text-[var(--color-fg)] sm:text-2xl">
            “Two physicians. One standard. A decade of results that look like
            nothing happened — except you, at your best.”
          </p>
        </Reveal>
      </div>
    </section>
  );
}
