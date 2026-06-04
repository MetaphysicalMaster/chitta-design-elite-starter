"use client";

/**
 * BeforeAfter — interactive drag slider, the asset their real site lacks.
 * Pointer + full keyboard support (arrow keys on the handle, role="slider").
 * Uses brand-tinted placeholder gradient "images" clearly marked "sample".
 */

import { useCallback, useRef, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

type Case = {
  id: string;
  treatment: string;
  detail: string;
  before: string;
  after: string;
};

const CASES: Case[] = [
  {
    id: "tox",
    treatment: "Botox — Forehead & Glabella",
    detail: "34 units · 14 days post",
    before: "linear-gradient(160deg, oklch(58% 0.03 150), oklch(46% 0.04 160))",
    after: "linear-gradient(160deg, oklch(74% 0.09 88), oklch(60% 0.1 80))",
  },
  {
    id: "morpheus",
    treatment: "Morpheus8 — Jawline",
    detail: "3 sessions · firmness & texture",
    before:
      "radial-gradient(130% 100% at 60% 40%, oklch(56% 0.035 158), oklch(44% 0.045 162))",
    after:
      "radial-gradient(130% 100% at 60% 40%, oklch(78% 0.1 86), oklch(64% 0.12 78))",
  },
  {
    id: "bbl",
    treatment: "BBL HERO — Tone & Redness",
    detail: "2 sessions · 6-week follow-up",
    before:
      "radial-gradient(120% 120% at 40% 35%, oklch(58% 0.05 40), oklch(46% 0.05 30))",
    after:
      "radial-gradient(120% 120% at 40% 35%, oklch(80% 0.08 90), oklch(66% 0.11 84))",
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
    <figure className="overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--emerald-deep)] shadow-[0_30px_70px_-34px_oklch(8%_0.02_168_/_0.9)]">
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
          <span className="absolute right-3 top-3 rounded-full bg-[oklch(20%_0.03_165_/_0.85)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-[var(--gold-bright)] backdrop-blur-sm">
            After
          </span>
        </div>

        {/* BEFORE (clipped left of the handle) */}
        <div
          className="absolute inset-0"
          style={{ background: data.before, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          <span className="absolute left-3 top-3 rounded-full bg-[oklch(14%_0.02_168_/_0.85)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
            Before
          </span>
        </div>

        {/* sample watermark */}
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
          Sample · illustrative
        </span>

        {/* Handle line */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="h-full w-0.5 bg-[var(--gold-pale)] shadow-[0_0_0_1px_oklch(20%_0.03_168_/_0.4)]" />
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
            "border border-[var(--gold-bright)] bg-[oklch(20%_0.03_165_/_0.8)] text-[var(--gold)] shadow-lg backdrop-blur",
            "transition-transform duration-200 hover:scale-105",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
          )}
          style={{ left: `${pos}%` }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M9 6 4 12l5 6M15 6l5 6-5 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-5 py-4">
        <span className="font-display text-lg text-[var(--color-fg)]">
          {data.treatment}
        </span>
        <span className="text-xs text-[var(--color-fg-subtle)]">{data.detail}</span>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      className="grain relative scroll-mt-24 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Real Results"
          title={
            <>
              See the difference. <span className="gold-leaf italic">Drag to reveal.</span>
            </>
          }
          lead="The before/after gallery their current template doesn't have. Slide the handle — or use your keyboard — to compare outcomes."
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
