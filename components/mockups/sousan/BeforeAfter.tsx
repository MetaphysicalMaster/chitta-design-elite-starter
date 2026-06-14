"use client";

/**
 * BeforeAfter — an accessible before/after drag-reveal slider over the REAL
 * believable, pixel-aligned comparison pair (same woman, identical pose /
 * lighting / grey studio background; the BEFORE has subtle under-eye shadow +
 * faint fine lines + a slightly duller tone, the AFTER is refreshed / glowing).
 *
 * Mechanic: the AFTER photo is the BASE layer; the BEFORE photo is the CLIPPED
 * OVERLAY, so dragging the divider LEFT→RIGHT reveals before → after. The two
 * frames align pixel-for-pixel so the reveal is seamless. Pointer-drag AND full
 * keyboard control (the divider is a native range input styled as a handle), so
 * it's operable by AT users. Reduced-motion safe (no autoplay). A small honest
 * "Illustrative · representative result" tag stays on the frame.
 *
 * Static-export-safe: plain <img> (basePath handled by the build), no next/image
 * loader, no fetch. Zero CLS via a fixed aspect-ratio box.
 */

import { useState } from "react";
import { Reveal, SectionHeading } from "./primitives";

export function BeforeAfter() {
  const [pos, setPos] = useState(50);

  return (
    <section id="results" className="bg-[var(--color-bg)] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The Proof"
          title={
            <>
              Real skin,{" "}
              <span className="font-display-em">measurably better.</span>
            </>
          }
          lead="A representative HydraFacial MD + IPL series. Drag the divider — or use the arrow keys — to compare before with after."
        />

        <Reveal delay={0.1} className="mt-12">
          <figure className="mx-auto max-w-3xl">
            <div className="relative select-none overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] shadow-[var(--glass-shadow)]">
              {/* Fixed-aspect box → zero CLS while the images decode. The pair
                  is shot 4:3; both layers fill it identically so the clip seam
                  lands on the same pixels. */}
              <div className="relative aspect-[4/3] w-full bg-[var(--color-bg-warm)]">
                {/* AFTER — the BASE layer (revealed as you drag right). */}
                <img
                  src="/clients/sousan/ba-after.jpg"
                  alt="The same client after a HydraFacial MD and IPL series — refreshed, even-toned, glowing skin"
                  width={1200}
                  height={900}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-[oklch(15%_0_0_/_0.6)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[oklch(96%_0_0)] backdrop-blur-sm">
                  After
                </span>

                {/* BEFORE — the CLIPPED OVERLAY (the left portion still shown). */}
                <div
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                  aria-hidden
                >
                  <img
                    src="/clients/sousan/ba-before.jpg"
                    alt=""
                    width={1200}
                    height={900}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-[oklch(15%_0_0_/_0.6)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[oklch(96%_0_0)] backdrop-blur-sm">
                    Before
                  </span>
                </div>

                {/* Honest provenance tag — kept on the frame at all times. */}
                <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-[oklch(100%_0_0_/_0.3)] bg-[oklch(15%_0_0_/_0.55)] px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-[oklch(96%_0_0)] backdrop-blur-sm">
                  Illustrative · representative result
                </span>

                {/* divider line + handle */}
                <div
                  className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[var(--gold-bright)] shadow-[0_0_18px_oklch(66%_0.255_356_/_0.75)]"
                  style={{ left: `${pos}%` }}
                >
                  <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--gold-bright)] bg-[oklch(16%_0_0_/_0.72)] backdrop-blur-sm">
                    <span
                      aria-hidden
                      className="text-sm text-[var(--gold-bright)]"
                    >
                      ⇋
                    </span>
                  </span>
                </div>

                {/* the accessible control overlaying the full image */}
                <label className="sr-only" htmlFor="ba-range">
                  Before / after comparison position
                </label>
                <input
                  id="ba-range"
                  type="range"
                  min={0}
                  max={100}
                  value={pos}
                  onChange={(e) => setPos(Number(e.target.value))}
                  aria-valuetext={`${pos}% revealing the after image`}
                  className="ba-range absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
                />
              </div>
            </div>
            <figcaption className="mt-4 text-center text-sm text-[var(--color-fg-subtle)]">
              Individual results vary. Treatment plans are tailored in
              consultation.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
