"use client";

/**
 * BeforeAfter — interactive drag slider, the single biggest asset the real
 * site lacks. Pointer + full keyboard support (arrow keys on the handle).
 * Uses labeled placeholder gradient "images" clearly marked "sample".
 */

import { useCallback, useRef, useState } from "react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

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
    before:
      "radial-gradient(120% 120% at 40% 30%, oklch(86% 0.03 40), oklch(74% 0.04 30))",
    after:
      "radial-gradient(120% 120% at 40% 30%, oklch(88% 0.05 18), oklch(78% 0.07 12))",
  },
  {
    id: "tox",
    treatment: "Botox — Forehead & Glabella",
    detail: "34 units · 14 days post",
    before:
      "linear-gradient(160deg, oklch(85% 0.02 250), oklch(78% 0.03 250))",
    after:
      "linear-gradient(160deg, oklch(90% 0.03 235), oklch(83% 0.04 235))",
  },
  {
    id: "micro",
    treatment: "Microneedling + PRP",
    detail: "3 sessions · texture & tone",
    before:
      "radial-gradient(130% 100% at 60% 40%, oklch(82% 0.03 60), oklch(72% 0.05 50))",
    after:
      "radial-gradient(130% 100% at 60% 40%, oklch(89% 0.03 70), oklch(82% 0.04 65))",
  },
];

function Slider({ data }: { data: Case }) {
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
      setPos(0);
    } else if (e.key === "End") {
      setPos(100);
    }
  };

  return (
    <figure className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)]">
      <div
        ref={ref}
        className="relative aspect-[4/5] w-full cursor-ew-resize touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* AFTER (full) */}
        <div className="absolute inset-0" style={{ background: data.after }} aria-hidden>
          <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-fg)]">
            After
          </span>
        </div>

        {/* BEFORE (clipped to the left of the handle) */}
        <div
          className="absolute inset-0"
          style={{ background: data.before, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-fg)]/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
            Before
          </span>
        </div>

        {/* sample watermark */}
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
          Sample · illustrative
        </span>

        {/* Handle */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="relative h-full w-0.5 bg-white/90 shadow-[0_0_0_1px_oklch(46%_0.12_255_/_0.2)]" />
        </div>
        <button
          type="button"
          role="slider"
          aria-label={`Reveal ${data.treatment} before and after. Use arrow keys to compare.`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% before`}
          onKeyDown={onKeyDown}
          className={cn(
            "absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full",
            "border border-white bg-white/90 text-[var(--color-accent)] shadow-lg backdrop-blur",
            "transition-transform duration-200 hover:scale-105",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          )}
          style={{ left: `${pos}%` }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path d="M9 6 4 12l5 6M15 6l5 6-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-5 py-4">
        <span className="font-display text-lg text-[var(--color-fg)]">{data.treatment}</span>
        <span className="text-xs text-[var(--color-fg-muted)]">{data.detail}</span>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--color-fg)] py-24 sm:py-28"
    >
      {/* soft sky aura on dark field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, var(--sky-high), transparent 70%), radial-gradient(50% 50% at 0% 100%, var(--sky-deep), transparent 70%)",
        }}
      />
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
          lead="The before/after gallery their current site doesn't have. Slide the handle — or use your keyboard — to compare treatment outcomes."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <Slider data={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
