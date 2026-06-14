"use client";

/**
 * BeforeAfter — "Real Results." An INTERACTIVE before/after drag-reveal slider
 * on the practice's aligned photo pair (ba-after.jpg as the base layer,
 * ba-before.jpg as the clipped overlay) so dragging the handle sweeps from
 * BEFORE → AFTER seamlessly. The pair is pixel-registered (same woman,
 * refreshed vs tired) so the reveal never "jumps."
 *
 * Mirrors happy-clinic/BeforeAfter.tsx:
 *  - a real ARIA slider (role="slider", valuemin/now/max, aria-valuetext) with
 *    pointer + full keyboard support (arrows / Home / End);
 *  - the static track has no transform animation → reduced-motion safe by
 *    construction;
 *  - plain <img> (static-export safe; basePath handled by the build);
 *  - an honest "Illustrative · representative result" tag.
 */

import { useCallback, useRef, useState } from "react";
import { Section, SectionHeading, Reveal } from "./primitives";

/* Both source photos are intrinsic 928 × 1152 (≈ 4/5 portrait). Locking the
   aspect-ratio to the real pixels keeps the reveal pixel-perfect + zero CLS. */
const BA = {
  before: "/clients/encore/ba-before.jpg",
  after: "/clients/encore/ba-after.jpg",
  w: 928,
  h: 1152,
} as const;

function useReveal() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 4));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 4));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  return { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown };
}

function RevealSlider() {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } =
    useReveal();
  const shown = Math.round(pos);

  return (
    <figure className="mx-auto max-w-md">
      <figcaption className="mb-4 flex items-center justify-center gap-2.5 text-center">
        <LeafMark className="h-5 w-5 text-[var(--leaf)]" />
        <span className="font-display display-em text-xl leading-none text-[var(--clinical-deep)] sm:text-2xl">
          A second act for your skin
        </span>
      </figcaption>

      <div
        ref={ref}
        className="relative w-full overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] shadow-[0_36px_90px_-50px_oklch(40%_0.06_205_/_0.7)]"
        style={{ aspectRatio: `${BA.w} / ${BA.h}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* BASE — AFTER (refreshed). Plain <img>, static-export safe. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BA.after}
          alt="After — the same patient with refreshed, more even, naturally glowing skin after care at Encore."
          width={BA.w}
          height={BA.h}
          draggable={false}
          className="en-photo absolute inset-0 h-full w-full select-none object-cover"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-[2] rounded-full bg-[var(--color-accent)]/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-fg)] backdrop-blur-sm"
        >
          After
        </span>

        {/* OVERLAY — BEFORE, clipped from the left. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BA.before}
            alt=""
            width={BA.w}
            height={BA.h}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-cover [filter:saturate(0.92)_brightness(0.97)]"
          />
          <span className="pointer-events-none absolute left-3 top-3 z-[2] rounded-full bg-[var(--color-bg-deep)]/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
            Before
          </span>
        </div>

        {/* Honest tag */}
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 rounded-full bg-[var(--color-bg-deep)]/55 px-3 py-1 text-[0.54rem] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
          Illustrative · representative result
        </span>

        {/* Divider line + ARIA slider handle. */}
        <span className="en-ba-line" style={{ left: `${pos}%` }} aria-hidden />
        <button
          type="button"
          role="slider"
          aria-label="Drag to reveal before and after. Use arrow keys to compare."
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shown}
          aria-valuetext={`Showing ${shown}% before, ${100 - shown}% after`}
          onKeyDown={onKeyDown}
          className="en-ba-handle"
          style={{ left: `${pos}%` }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M9 6 4 12l5 6M15 6l5 6-5 6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">
        Drag the handle — or use your arrow keys — to reveal the difference.
        Skin tone &amp; texture, naturally refreshed.
      </p>
    </figure>
  );
}

/* A tiny leaf mark — echoes the brand tree. */
function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M5 19c0-7 5-12 14-13C18 13 13 19 6 19c0 0-1-3 2-7" opacity="0.9" />
    </svg>
  );
}

export function BeforeAfter() {
  return (
    <Section id="results" labelledBy="results-heading">
      <SectionHeading
        id="results-heading"
        eyebrow="Real results"
        title={<>See the <span className="display-em">difference.</span></>}
        lede="Drag the slider and look closely — the kind of natural, refreshed result Encore is known for. Photography is illustrative and representative; individual results vary."
      />

      <Reveal className="mt-12">
        <RevealSlider />
      </Reveal>
    </Section>
  );
}
