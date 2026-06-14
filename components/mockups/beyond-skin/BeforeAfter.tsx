"use client";

/**
 * BeforeAfter — "Real Results." An INTERACTIVE before/after drag-reveal slider
 * built on the practice's aligned photo pair (ba-after.jpg as the base layer,
 * ba-before.jpg as the clipped overlay) so dragging the handle sweeps from
 * BEFORE → AFTER seamlessly. The pair is pixel-registered (same woman, identical
 * pose / lighting / backdrop — refreshed vs tired) so the reveal never "jumps".
 *
 * Accessibility:
 *  - a real ARIA slider (role="slider", valuemin/now/max, aria-valuetext) with
 *    pointer + full keyboard support (arrows / Home / End);
 *  - the track is static (no transform animation) → reduced-motion safe by
 *    construction;
 *  - an honest "Illustrative · representative result" tag stays on the image.
 *
 * Plain <img> (basePath handled by the build) → static-export safe.
 */

import { useCallback, useRef, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";

/* Both source photos are intrinsic ~928 × 1152 (≈ 4 / 5 portrait). Locking the
   aspect-ratio to the real pixels keeps the reveal pixel-perfect + zero CLS. */
const BA = {
  before: "/clients/beyond-skin/ba-before.jpg",
  after: "/clients/beyond-skin/ba-after.jpg",
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
      <div
        ref={ref}
        className="bs-ba relative w-full overflow-hidden rounded-3xl border border-[var(--glass-dark-border)] bg-[var(--plum-deep)] shadow-[0_36px_90px_-44px_oklch(18%_0.05_340_/_0.95)]"
        style={{ aspectRatio: `${BA.w} / ${BA.h}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* BASE LAYER — AFTER (refreshed, even, glowing). Plain <img>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BA.after}
          alt="After — refreshed, more even and naturally glowing skin."
          width={BA.w}
          height={BA.h}
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-[2] rounded-full bg-[var(--color-accent)]/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-fg)] backdrop-blur-sm"
        >
          After
        </span>

        {/* OVERLAY — BEFORE, clipped from the left so dragging right reveals the
            after beneath. */}
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
            className="absolute inset-0 h-full w-full select-none object-cover"
          />
          <span className="pointer-events-none absolute left-3 top-3 z-[2] rounded-full bg-[var(--plum-deep)]/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
            Before
          </span>
        </div>

        {/* Honest tag — illustrative / representative result. */}
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-[0.54rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Illustrative · representative result
        </span>

        {/* Divider line + the ARIA slider handle. */}
        <span className="bs-ba-line" style={{ left: `${pos}%` }} aria-hidden />
        <button
          type="button"
          role="slider"
          aria-label="Drag to reveal before and after. Use arrow keys to compare."
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shown}
          aria-valuetext={`Showing ${shown}% before, ${100 - shown}% after`}
          onKeyDown={onKeyDown}
          className="bs-ba-handle"
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

      <p className="mt-4 text-center text-xs text-[var(--color-bg)]/65">
        Drag the handle — or use your arrow keys — to reveal the difference. Skin
        texture &amp; tone, naturally refreshed.
      </p>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      className="grain relative scroll-mt-24 overflow-hidden bg-[var(--plum-deep)] py-24 text-[var(--color-bg)] sm:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1100px" }}
    >
      {/* mauve aura echoing the hero on the dark plum field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          background:
            "radial-gradient(55% 50% at 85% 0%, var(--glow-mauve), transparent 70%), radial-gradient(50% 50% at 0% 100%, var(--glow-plum), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          invert
          align="center"
          eyebrow="Real results"
          title={
            <>
              See the difference.{" "}
              <span className="font-em text-[var(--glow-blush)]">Drag to reveal.</span>
            </>
          }
          lead="The before/after comparison their current site doesn't have. Drag the slider and look closely — refreshed, even, and unmistakably you."
        />

        {/* THE CENTERPIECE — interactive drag-reveal on the real aligned pair. */}
        <Reveal className="mt-12">
          <RevealSlider />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[var(--color-bg)]/55">
            Representative result shown for this mockup — an illustrative aligned
            pair. Individual results vary; live galleries would feature real,
            consented patient photos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
