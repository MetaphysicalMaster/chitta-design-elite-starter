"use client";

/**
 * BeforeAfter — "See the difference." An INTERACTIVE before/after drag-reveal
 * slider on The Luxe's aligned photo pair (ba-after.jpg = refreshed base layer,
 * ba-before.jpg = tired, clipped overlay) so dragging the gold handle sweeps
 * from BEFORE → AFTER seamlessly. The pair is pixel-registered (same woman,
 * identical pose / warm-greige backdrop) so the reveal never "jumps".
 *
 * Mirrors the gold-reference pattern (happy-clinic/BeforeAfter): AFTER base +
 * BEFORE clipped overlay, a real ARIA slider (role="slider", valuemin/now/max,
 * aria-valuetext) with pointer + full keyboard support (arrows / Home / End),
 * static track (reduced-motion safe by construction), plain <img> tags
 * (static-export-safe; basePath handled by the build), and an honest
 * "Illustrative · representative result" tag.
 *
 * Brand: warm marble field, gold handle + rule, espresso ink.
 */

import { useCallback, useRef, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";

/* Both source photos are intrinsic 928 × 1152 (≈ 4 / 5 portrait). Locking the
   aspect-ratio to the real pixels keeps the reveal pixel-perfect + zero CLS. */
const BA = {
  before: "/clients/the-luxe/ba-before.jpg",
  after: "/clients/the-luxe/ba-after.jpg",
  w: 928,
  h: 1152,
} as const;

function useReveal() {
  const [pos, setPos] = useState(50); // % of BEFORE shown from the left edge
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
        className="relative w-full touch-none overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--marble)] shadow-[0_36px_90px_-44px_oklch(50%_0.04_70_/_0.6)]"
        style={{ aspectRatio: `${BA.w} / ${BA.h}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* BASE LAYER — AFTER (refreshed / glowing). Plain <img>, static-export
            safe; basePath is handled by the build. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BA.after}
          alt="After — the same Luxe MedSpa client with refreshed, more even, naturally radiant skin."
          width={BA.w}
          height={BA.h}
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-[2] rounded-full bg-[var(--gold)]/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-fg)] backdrop-blur-sm"
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
          <span className="pointer-events-none absolute left-3 top-3 z-[2] rounded-full bg-[oklch(30%_0.02_60_/_0.6)] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--cream)] backdrop-blur-sm">
            Before
          </span>
        </div>

        {/* Honest tag — illustrative / representative result. */}
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 whitespace-nowrap rounded-full bg-[oklch(28%_0.02_60_/_0.55)] px-3 py-1 text-[0.54rem] font-medium uppercase tracking-[0.2em] text-[var(--cream)] backdrop-blur-sm">
          Illustrative · representative result
        </span>

        {/* Divider line + the ARIA slider handle. */}
        <span className="luxe-ba-line" style={{ left: `${pos}%` }} aria-hidden />
        <button
          type="button"
          role="slider"
          aria-label="Drag to reveal before and after. Use arrow keys to compare."
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shown}
          aria-valuetext={`Showing ${shown}% before, ${100 - shown}% after`}
          onKeyDown={onKeyDown}
          className="luxe-ba-handle"
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

      <figcaption className="mt-4 text-center text-sm text-[var(--color-fg-muted)]">
        Drag the handle — or use your arrow keys — to compare. Skin texture &amp;
        tone, naturally refreshed.
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      aria-labelledby="results-title"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--cream-deep)] py-24 sm:py-28"
    >
      {/* soft peach + gold aura on the warm field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(50% 46% at 88% 4%, var(--peach), transparent 70%), radial-gradient(46% 44% at 6% 100%, var(--gold-pale), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Real results"
          title={
            <span id="results-title">
              The difference is obvious.{" "}
              <span className="gold-leaf italic">The work never is.</span>
            </span>
          }
          lead="Subtle, natural, undeniably you. Drag the slider and look closely — refreshed skin texture and tone, with the same face you've always loved."
        />

        {/* THE CENTERPIECE — interactive before/after drag-reveal on the real
            aligned photo pair. */}
        <Reveal className="mt-12">
          <RevealSlider />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-[var(--color-fg-subtle)]">
            Illustrative before/after pair shown for this concept. Individual
            results vary; The Luxe MedSpa does not guarantee any specific outcome.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
