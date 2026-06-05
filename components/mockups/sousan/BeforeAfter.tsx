"use client";

/**
 * BeforeAfter — an accessible before/after reveal slider over two on-brand
 * sample plates. Pointer-drag AND full keyboard control (the divider is a
 * native range input styled as a handle), so it's operable by AT users. The
 * "after" image is clipped by the slider position. Reduced-motion safe (no
 * autoplay). Sample imagery, clearly marked.
 */

import { useState } from "react";
import { Reveal, SectionHeading } from "./primitives";
import { BrandImage } from "./BrandImage";

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
          lead="A representative HydraFacial MD + IPL series. Drag the divider — or use the arrow keys — to compare. Sample imagery for illustration."
        />

        <Reveal delay={0.1} className="mt-12">
          <figure className="mx-auto max-w-3xl">
            <div className="relative select-none overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] shadow-[var(--glass-shadow)]">
              {/* AFTER (base layer) */}
              <BrandImage
                alt="Skin after a HydraFacial MD and IPL series — clearer, even tone"
                aspect="4:3"
                tone="gold"
                radius="lg"
                sample={false}
                className="rounded-none border-0"
              >
                <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-[oklch(15%_0_0_/_0.6)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[oklch(96%_0_0)] backdrop-blur-sm">
                  After
                </span>
              </BrandImage>

              {/* BEFORE (clipped overlay) */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                aria-hidden
              >
                <BrandImage
                  alt=""
                  aspect="4:3"
                  tone="emerald"
                  radius="lg"
                  sample={false}
                  className="rounded-none border-0"
                >
                  <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-[oklch(15%_0_0_/_0.6)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[oklch(96%_0_0)] backdrop-blur-sm">
                    Before
                  </span>
                </BrandImage>
              </div>

              {/* divider line + handle */}
              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[var(--gold-bright)] shadow-[0_0_18px_oklch(66%_0.255_356_/_0.75)]"
                style={{ left: `${pos}%` }}
              >
                <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--gold-bright)] bg-[oklch(16%_0_0_/_0.72)] backdrop-blur-sm">
                  <span aria-hidden className="text-sm text-[var(--gold-bright)]">
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
            <figcaption className="mt-4 text-center text-sm text-[var(--color-fg-subtle)]">
              Individual results vary. Treatment plans are tailored in
              consultation. Sample imagery.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
