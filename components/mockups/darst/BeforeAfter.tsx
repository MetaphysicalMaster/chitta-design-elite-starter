"use client";

/**
 * BeforeAfter — an accessible before/after drag-reveal slider.
 *
 * Now wired with the REAL, pixel-aligned case photos (operator revision):
 * /clients/darst/ba-after.jpg (the base layer, refreshed/glowing) and
 * /clients/darst/ba-before.jpg (the clipped overlay, subtle under-eye shadow +
 * faint fine lines + duller tone). The pair is the same woman, identical pose,
 * lighting and grey ground, so dragging the handle wipes BEFORE → AFTER
 * seamlessly. A native range input drives the clip width; the whole track is a
 * drag surface while a styled divider handle reads as the reveal line. Keyboard
 * operable (arrow keys), labelled, reduced-motion safe.
 *
 * Plain <img> (static-export-safe; the build handles basePath). A small honest
 * "Illustrative · representative result" tag stays — these are believable
 * representative images, not a specific patient's clinical record.
 */

import { useState } from "react";
import { FigureTag, Reveal, SectionHeading } from "./primitives";

// The real pair lives per-slug under /public/clients/darst/. They are
// pixel-for-pixel aligned (same crop), so the clipped overlay registers exactly
// over the base layer with no counter-scaling needed beyond the clip wrapper.
const BA_AFTER = "/clients/darst/ba-after.jpg";
const BA_BEFORE = "/clients/darst/ba-before.jpg";

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
          <figure className="mx-auto max-w-md">
            <div
              className="relative overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] shadow-[0_30px_80px_-40px_oklch(30%_0.05_58_/_0.4)]"
              style={{ aspectRatio: "4 / 5" }}
            >
              {/* AFTER (base layer, full) — refreshed, glowing, even-toned. The
                  reveal wipes from this back toward the BEFORE so dragging left→
                  right travels before → after. */}
              <img
                src={BA_AFTER}
                alt="After: refreshed, more even and luminous skin"
                width={930}
                height={1163}
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full select-none object-cover"
              />
              <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-[oklch(20%_0.035_56_/_0.55)] px-2.5 py-0.5 text-[0.72rem] font-medium tracking-tight text-[oklch(97%_0.012_72)] backdrop-blur-sm">
                After
              </span>

              {/* BEFORE (clipped overlay). The clip wrapper narrows to `pos%`;
                  the inner image counter-scales its width to 100/pos% so the
                  revealed BEFORE stays pixel-aligned with the AFTER beneath it
                  (the pair is shot identically), regardless of frame width. */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${pos}%` }}
                aria-hidden
              >
                <div
                  className="absolute inset-y-0 left-0 h-full"
                  style={{ width: pos > 0 ? `${(100 / pos) * 100}%` : "100%" }}
                >
                  <img
                    src={BA_BEFORE}
                    alt=""
                    width={930}
                    height={1163}
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full select-none object-cover"
                  />
                  <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[oklch(20%_0.035_56_/_0.55)] px-2.5 py-0.5 text-[0.72rem] font-medium tracking-tight text-[oklch(97%_0.012_72)] backdrop-blur-sm">
                    Before
                  </span>
                </div>
              </div>

              {/* divider handle — brand craft on the most-interacted control:
                  a warm-paper disc with a teal ring + hairline and a teal
                  chevron, matching the page's finish (Solari bevels, strata
                  rails, the swoosh). */}
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

              {/* honest representative-result tag — these are believable,
                  representative images, not a specific patient's record. */}
              <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-[oklch(20%_0.035_56_/_0.62)] px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[oklch(96%_0.012_72)] backdrop-blur-sm">
                Illustrative · representative result
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
              Drag the handle (or use arrow keys) to compare. Illustrative,
              representative result — individual outcomes vary.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
