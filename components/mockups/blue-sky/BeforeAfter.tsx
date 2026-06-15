"use client";

/**
 * BeforeAfter — "Real Results." The centerpiece is an INTERACTIVE before/after
 * drag-reveal slider built on the practice's REAL aligned photo pair
 * (ba-after.jpg as the base layer, ba-before.jpg as the clipped overlay) so
 * dragging the handle sweeps from BEFORE → AFTER seamlessly. The pair is
 * pixel-registered (same woman, identical pose / lighting / grey backdrop) so
 * the reveal never "jumps" — refreshed/glowing vs tired.
 *
 * Below the slider, treatment-specific comparison demos remain as a supporting
 * grid (labeled illustrative samples) so several outcomes are represented.
 *
 * Accessibility:
 *  - each slider is a real ARIA slider (role="slider", valuemin/now/max,
 *    aria-valuetext) with pointer + full keyboard support (arrows/Home/End);
 *  - the static track has no transform animation, so it is reduced-motion safe
 *    by construction. Plain <img> for the real pair — static-export safe.
 */

import { useCallback, useRef, useState } from "react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { CloudDivider } from "./CloudDivider";
import { cn } from "@/lib/utils";

/* Both source photos are intrinsic 928 × 1152 (4:5 portrait). Locking the
   aspect-ratio to the real pixels keeps the reveal pixel-perfect + zero CLS. */
const BA = {
  before: "/clients/blue-sky/ba-before.jpg",
  after: "/clients/blue-sky/ba-after.jpg",
  w: 928,
  h: 1152,
} as const;

/* ---------- shared slider engine (pointer + full keyboard) ---------- */
function useSlider() {
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

/* ---------- the real aligned-photo centerpiece ---------- */
function RealRevealSlider() {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } = useSlider();
  const shown = Math.round(pos);

  return (
    <figure className="mx-auto max-w-md">
      <div
        ref={ref}
        className="bs-ba relative w-full overflow-hidden rounded-3xl border border-white/12 bg-[var(--color-fg)] shadow-[0_36px_90px_-44px_oklch(20%_0.06_252_/_0.95)]"
        style={{ aspectRatio: `${BA.w} / ${BA.h}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* BASE — AFTER (refreshed / glowing). Plain <img>, static-export safe. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BA.after}
          alt="After — the same Blue Sky Med Spa client with refreshed, more even, naturally glowing skin."
          width={BA.w}
          height={BA.h}
          draggable={false}
          className="bs-photo absolute inset-0 h-full w-full select-none object-cover"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-[2] rounded-full bg-[var(--color-accent)]/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-fg)] backdrop-blur-sm"
        >
          After
        </span>

        {/* OVERLAY — BEFORE, clipped from the left so dragging right reveals after. */}
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
          <span className="pointer-events-none absolute left-3 top-3 z-[2] rounded-full bg-[var(--color-fg)]/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
            Before
          </span>
        </div>

        {/* Honest tag */}
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
            <path d="M9 6 4 12l5 6M15 6l5 6-5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <figcaption className="mt-4 text-center">
        <span className="font-display text-lg text-white">Skin radiance &amp; tone</span>
        <p className="mt-1 text-center text-xs text-white/60">
          Drag the handle — or use your arrow keys — to reveal the difference.
        </p>
      </figcaption>
    </figure>
  );
}

/* ---------- supporting treatment-specific demos ---------- */
type Case = {
  id: string;
  treatment: string;
  detail: string;
  before: string; // css background
  after: string;
};

const CASES: Case[] = [
  {
    id: "lips",
    treatment: "Lip Filler",
    detail: "0.7ml · 2-week follow-up",
    before: "url('/clients/blue-sky/ba/lips-before.webp') center/cover",
    after: "url('/clients/blue-sky/ba/lips-after.webp') center/cover",
  },
  {
    id: "tox",
    treatment: "Botox — Forehead & Glabella",
    detail: "34 units · 14 days post",
    before: "url('/clients/blue-sky/ba/tox-before.webp') center/cover",
    after: "url('/clients/blue-sky/ba/tox-after.webp') center/cover",
  },
  {
    id: "micro",
    treatment: "Microneedling + PRP",
    detail: "3 sessions · texture & tone",
    before: "url('/clients/blue-sky/ba/micro-before.webp') center/cover",
    after: "url('/clients/blue-sky/ba/micro-after.webp') center/cover",
  },
];

function CaseSlider({ data }: { data: Case }) {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } = useSlider();
  const shown = Math.round(pos);

  return (
    <figure className="overflow-hidden rounded-3xl border border-white/12 bg-[var(--color-fg)] shadow-[0_30px_80px_-40px_oklch(20%_0.06_252_/_0.9)]">
      <div
        ref={ref}
        className="bs-ba relative aspect-[4/5] w-full"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* AFTER (full) */}
        <div className="absolute inset-0" style={{ background: data.after }} aria-hidden>
          <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-fg)]">
            After
          </span>
        </div>

        {/* BEFORE (clipped to the left of the handle) */}
        <div
          className="absolute inset-0"
          style={{ background: data.before, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-fg)]/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white">
            Before
          </span>
        </div>

        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[0.54rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Illustrative · representative result
        </span>

        <span className="bs-ba-line" style={{ left: `${pos}%` }} aria-hidden />
        <button
          type="button"
          role="slider"
          aria-label={`Reveal ${data.treatment} before and after. Use arrow keys to compare.`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shown}
          aria-valuetext={`Showing ${shown}% before, ${100 - shown}% after`}
          onKeyDown={onKeyDown}
          className="bs-ba-handle"
          style={{ left: `${pos}%` }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path d="M9 6 4 12l5 6M15 6l5 6-5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-5 py-4">
        <span className="font-display text-lg text-white">{data.treatment}</span>
        <span className="text-right text-xs text-white/60">{data.detail}</span>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      className={cn(
        "relative scroll-mt-24 overflow-hidden bg-[var(--color-fg)] py-24 sm:py-28",
      )}
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
    >
      {/* soft sky aura on the dark field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, var(--sky-high), transparent 70%), radial-gradient(50% 50% at 0% 100%, var(--sky-deep), transparent 70%)",
        }}
      />
      <CloudDivider variant="top" fill="var(--color-bg)" tint="var(--color-bg-subtle)" heightClass="h-12 sm:h-20 opacity-[0.10]" />
      <CloudDivider variant="bottom" fill="var(--color-bg)" tint="var(--color-bg-subtle)" heightClass="h-12 sm:h-20 opacity-[0.10]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--color-bg)] to-transparent opacity-[0.10]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-bg)] to-transparent opacity-[0.10]" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Real Results"
          invert
          title={
            <>
              See the difference.
              <span className="italic"> Drag to reveal.</span>
            </>
          }
          lead="The before/after gallery their current site doesn't have. Slide the handle — or use your keyboard — to compare. Look closely: the difference is obvious, the work never is."
        />

        {/* THE CENTERPIECE — real aligned-photo drag-reveal */}
        <Reveal className="mt-14">
          <RealRevealSlider />
        </Reveal>

        <p className="mt-16 text-sm font-medium uppercase tracking-[0.18em] text-white/55">
          More comparisons
        </p>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <CaseSlider data={c} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.05}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-white/55">
            Photos are an aligned, representative AI pair for this mockup; the
            treatment-specific tiles are illustrative. Individual results vary.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
