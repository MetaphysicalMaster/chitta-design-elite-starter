"use client";

/**
 * TreatmentMarquee — an intentional, ICONOGRAPHIC ribbon of the practice's
 * treatment range. Each card pairs a line-icon glyph (drawn in the brand teal
 * over a warm-paper plate) with a treatment label, so the row reads as a
 * deliberate capability strip — not nine empty gradient tiles directly after
 * the real credentials band. Trimmed to six marquee cards (the breadth that
 * matters), the medical and aesthetic registers balanced side by side.
 *
 * Mechanics:
 *  - the track holds the cards TWICE and translates -50% in a seamless loop
 *    (CSS animation in brand.css), so there's no visible seam.
 *  - PAUSES on hover / focus-within (CSS `:hover`/`:focus-within`).
 *  - prefers-reduced-motion → animation is disabled and the row becomes a
 *    normal horizontally-scrollable, swipeable strip (CSS, mask removed so the
 *    first/last card is never edge-faded), never auto-moving.
 *  - edges fade via a CSS mask so cards enter/leave gracefully.
 *
 * The duplicated half is aria-hidden so screen readers hear each treatment once.
 */

import { SectionHeading, Reveal } from "./primitives";

type Glyph = "screen" | "scalpel" | "slide" | "drop" | "laser" | "leaf";

type Treatment = {
  label: string;
  blurb: string;
  glyph: Glyph;
  /** aesthetic cards carry the warm coral note; clinical cards stay teal. */
  warm?: boolean;
};

/* Six treatments — the medical core and the aesthetic register, balanced. */
const TREATMENTS: Treatment[] = [
  { label: "Skin cancer screening", blurb: "Full-body exams", glyph: "screen" },
  { label: "Mohs & excision", blurb: "Precise surgery", glyph: "scalpel" },
  { label: "Dermatopathology", blurb: "In-house slide reads", glyph: "slide" },
  { label: "Injectables", blurb: "Natural volume", glyph: "drop", warm: true },
  { label: "Laser resurfacing", blurb: "Tone & texture", glyph: "laser", warm: true },
  { label: "Medical skin care", blurb: "Acne · eczema · peels", glyph: "leaf" },
];

/* Compact line-icon set — single-stroke, inherits currentColor. */
function Icon({ glyph }: { glyph: Glyph }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "h-6 w-6",
  };
  switch (glyph) {
    case "screen": // magnifier over skin — screening
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-3.5-3.5M9 11h4M11 9v4" />
        </svg>
      );
    case "scalpel": // blade — surgery / excision
      return (
        <svg {...common}>
          <path d="M14 4 5 13l3 3 9-9z" />
          <path d="m8 16-4 4M14 4l4-1-1 4" />
        </svg>
      );
    case "slide": // microscope slide + cells — dermatopathology
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <circle cx="10" cy="9" r="1.4" />
          <circle cx="14.5" cy="13.5" r="1.4" />
          <path d="M8 17h6" />
        </svg>
      );
    case "drop": // syringe drop — injectables
      return (
        <svg {...common}>
          <path d="M12 3c2.6 3.2 4 5.7 4 8a4 4 0 1 1-8 0c0-2.3 1.4-4.8 4-8z" />
        </svg>
      );
    case "laser": // converging beams — laser resurfacing
      return (
        <svg {...common}>
          <path d="M12 3v5M5 6l3 3M19 6l-3 3" />
          <path d="M8 13c1.2 1.4 2.5 2 4 2s2.8-.6 4-2" />
          <path d="M7 18c1.6 1.6 3.3 2.4 5 2.4s3.4-.8 5-2.4" />
        </svg>
      );
    case "leaf": // leaf — medical skin care / renewal
      return (
        <svg {...common}>
          <path d="M5 19c0-7 5-12 14-12 0 9-5 13-11 13a5 5 0 0 1-3-1z" />
          <path d="M9 17c2-3 4-5 7-6" />
        </svg>
      );
  }
}

function Card({ t }: { t: Treatment }) {
  return (
    <article className="w-[13.5rem] shrink-0 sm:w-[15rem]">
      <div
        className="flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[1.25rem] border border-[var(--color-border)] p-5"
        style={{
          background: t.warm
            ? "radial-gradient(120% 120% at 22% 12%, var(--color-coral-subtle), transparent 60%), linear-gradient(158deg, var(--color-bg-elevated), var(--color-bg-subtle))"
            : "radial-gradient(120% 120% at 22% 12%, var(--color-accent-subtle), transparent 60%), linear-gradient(158deg, var(--color-bg-elevated), var(--color-bg-subtle))",
        }}
      >
        <span
          aria-hidden
          className={
            t.warm
              ? "grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-bg-elevated)] text-[var(--color-coral-deep)] shadow-[0_8px_22px_-14px_oklch(52%_0.13_31_/_0.7)] ring-1 ring-[var(--color-coral-subtle)]"
              : "grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-bg-elevated)] text-[var(--color-accent-deep)] shadow-[0_8px_22px_-14px_oklch(48%_0.082_197_/_0.7)] ring-1 ring-[var(--color-accent-subtle)]"
          }
        >
          <Icon glyph={t.glyph} />
        </span>
        <div>
          <p className="font-display text-[1.15rem] leading-tight text-[var(--color-fg)]">
            {t.label}
          </p>
          <p
            className={
              t.warm
                ? "mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-coral-deep)]"
                : "mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-deep)]"
            }
          >
            {t.blurb}
          </p>
        </div>
      </div>
    </article>
  );
}

export function TreatmentMarquee() {
  return (
    <section
      id="treatments"
      aria-labelledby="treatments-title"
      className="overflow-hidden bg-[var(--color-bg-subtle)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The full range"
          title={
            <>
              Medical and aesthetic care, one continuous{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">
                record of care.
              </span>
            </>
          }
          lead="Screenings, surgery and in-house pathology alongside injectables, lasers and skin renewal — the full range, every line of it kept in one chart under one physician who reads your skin as an organ first."
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
          A capability overview for this mockup; real procedure photography and
          the full treatment menu would be slotted in here.
        </p>
      </div>
    </section>
  );
}
