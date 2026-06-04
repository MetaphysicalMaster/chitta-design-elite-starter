"use client";

/**
 * BeforeAfter — interactive drag slider, the asset their real site lacks.
 * Pointer + full keyboard support (arrow keys on the handle role="slider").
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
    detail: "32 units · 14 days post",
    before: "linear-gradient(160deg, oklch(80% 0.025 50), oklch(72% 0.035 45))",
    after: "linear-gradient(160deg, oklch(89% 0.03 60), oklch(82% 0.045 55))",
  },
  {
    id: "rf",
    treatment: "RF Microneedling",
    detail: "3 sessions · texture & firmness",
    before: "radial-gradient(130% 100% at 60% 40%, oklch(80% 0.03 40), oklch(70% 0.05 35))",
    after: "radial-gradient(130% 100% at 60% 40%, oklch(90% 0.035 55), oklch(83% 0.05 50))",
  },
  {
    id: "lips",
    treatment: "Lip Filler",
    detail: "0.7ml · 2-week follow-up",
    before: "radial-gradient(120% 120% at 40% 35%, oklch(84% 0.04 30), oklch(74% 0.06 22))",
    after: "radial-gradient(120% 120% at 40% 35%, oklch(86% 0.07 18), oklch(78% 0.1 14))",
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
    <figure className="overflow-hidden rounded-3xl border border-[var(--glass-dark-border)] bg-[var(--ink-warm)] shadow-[0_24px_60px_-30px_oklch(10%_0.02_30_/_0.7)]">
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
          <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--ink-deep)]">
            After
          </span>
        </div>

        {/* BEFORE (clipped left of the handle) */}
        <div
          className="absolute inset-0"
          style={{ background: data.before, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          <span className="absolute left-3 top-3 rounded-full bg-[var(--ink-deep)]/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
            Before
          </span>
        </div>

        {/* sample watermark */}
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
          Sample · illustrative
        </span>

        {/* Handle line */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="h-full w-0.5 bg-white/90 shadow-[0_0_0_1px_oklch(40%_0.06_30_/_0.3)]" />
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
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
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
        <span className="font-display text-lg text-[var(--color-bg)]">
          {data.treatment}
        </span>
        <span className="text-xs text-[var(--color-bg)]/60">{data.detail}</span>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      className="grain relative scroll-mt-24 overflow-hidden bg-[var(--ink-deep)] py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(55% 45% at 85% 0%, var(--glow-rose), transparent 70%), radial-gradient(50% 50% at 0% 100%, var(--glow-bronze), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          invert
          eyebrow="Real Results"
          title={
            <>
              See the difference. <span className="italic">Drag to reveal.</span>
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
