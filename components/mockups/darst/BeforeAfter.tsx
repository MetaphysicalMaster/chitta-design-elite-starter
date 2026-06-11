"use client";

/**
 * BeforeAfter — an accessible before/after comparison slider (sample). A native
 * range input drives the clip width; the whole track is a drag surface while a
 * styled divider handle reads as the reveal line. Keyboard operable (arrow
 * keys), labelled, reduced-motion safe. Imagery is on-brand placeholder plates
 * explicitly marked "sample" — the real case photos would be slotted in.
 */

import { useState } from "react";
import { FigureTag, Reveal, SectionHeading } from "./primitives";
import { BrandImage } from "./BrandImage";

export function BeforeAfter() {
  const [pos, setPos] = useState(50);

  return (
    <section
      id="results"
      aria-labelledby="results-title"
      className="bg-[var(--color-bg-subtle)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <FigureTag
          n="05"
          label="Representative comparison"
          className="mb-6 justify-end"
        />
        <SectionHeading
          eyebrow="Results"
          title={
            <>
              Real change, documented{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">
                honestly.
              </span>
            </>
          }
          lead="Outcomes vary by patient and condition. We show representative before/after comparisons — never retouched promises."
        />

        <Reveal className="mt-12 sm:mt-14">
          <figure className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] shadow-[0_30px_80px_-40px_oklch(30%_0.05_58_/_0.4)]">
              {/* AFTER (base layer, full) — the warm, radiant register, so the
                  reveal reads as duller skin → glow even as a sample. */}
              <BrandImage
                alt="After treatment — clearer, more radiant skin"
                aspect="16 / 11"
                variant="warm"
                radius="2xl"
                showSample={false}
                className="!rounded-none !border-0"
                label="After"
              />

              {/* BEFORE (clipped overlay). The clip wrapper narrows to `pos%`;
                  the inner plate counter-scales its width to 100/pos% so the
                  revealed BEFORE stays pixel-aligned with the AFTER beneath it
                  (no distortion), regardless of the frame's measured width. */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${pos}%` }}
                aria-hidden
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: pos > 0 ? `${(100 / pos) * 100}%` : "100%" }}
                >
                  <BrandImage
                    alt="Before treatment"
                    aspect="16 / 11"
                    variant="muted"
                    radius="2xl"
                    showSample={false}
                    className="!h-full !w-full !rounded-none !border-0"
                    label="Before"
                  />
                </div>
              </div>

              {/* divider handle — given brand craft (most-interacted control):
                  a warm-paper disc with a teal ring + hairline and a teal
                  chevron, so it matches the page's finish (Solari bevels, strata
                  rails, the swoosh) rather than reading as a plain flat circle. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[oklch(98%_0.012_72)]"
                style={{ left: `${pos}%` }}
              >
                <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[oklch(98%_0.012_72)] text-[var(--color-accent-deep)] shadow-[0_6px_20px_-8px_oklch(17%_0.03_54_/_0.7)] ring-1 ring-[var(--color-accent-deep)]/30 ring-offset-1 ring-offset-[oklch(98%_0.012_72)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path
                      d="M9 7l-4 5 4 5M15 7l4 5-4 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              {/* "sample" tag for the whole comparison */}
              <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-[oklch(20%_0.035_56_/_0.62)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[oklch(96%_0.012_72)] backdrop-blur-sm">
                Sample
              </span>

              {/* representative-treatment chip — names what the comparison would
                  show, so the placeholder communicates an aesthetic outcome. */}
              <span className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-full bg-[oklch(20%_0.035_56_/_0.55)] px-2.5 py-0.5 text-[0.62rem] font-medium tracking-tight text-[oklch(96%_0.012_72)] backdrop-blur-sm">
                Laser resurfacing — sample
              </span>

              {/* the accessible control */}
              <input
                type="range"
                min={0}
                max={100}
                value={pos}
                onChange={(e) => setPos(Number(e.target.value))}
                aria-label="Reveal before and after — drag or use arrow keys"
                className="ba-range absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-deep)]"
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-[var(--color-fg-subtle)]">
              Drag the handle (or use arrow keys) to compare. Representative
              sample — individual results vary.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
