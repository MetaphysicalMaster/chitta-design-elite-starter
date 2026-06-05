"use client";

/**
 * BeforeAfter — interactive drag slider on a warm, sunlit field. Pointer + full
 * keyboard support (arrows/Home/End on the handle). Placeholder gradient
 * "plates" clearly marked "sample · illustrative": BEFORE reads dull/cool/tired,
 * AFTER reads brighter + warmer peach, so the drag shows a real lift in tone.
 * Light and clean — true to the orange/peach brand, never a dark gallery.
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

// Before/after "plates". To read as a real transformation (not two near-identical
// rectangles), BEFORE is deliberately lower-L, lower-chroma and cooler-toned (a
// dull, tired skin field), while AFTER is higher-L, warmer and more saturated
// PEACH — all kept inside the true brand hue range (~52–62), never the old
// brassy 70–82. The drag now visibly lifts tone + warmth.
const CASES: Case[] = [
  {
    id: "tox",
    treatment: "Neuromodulator — Forehead & Glabella",
    detail: "Physician-placed · 14 days post",
    before: "linear-gradient(155deg, oklch(72% 0.018 56), oklch(64% 0.022 50))",
    after: "linear-gradient(155deg, oklch(93% 0.035 60), oklch(86% 0.055 58))",
  },
  {
    id: "secretrf",
    treatment: "Secret RF — Texture & Tightening",
    detail: "Three-session plan · 8 weeks",
    before: "radial-gradient(120% 120% at 40% 30%, oklch(70% 0.016 54), oklch(61% 0.02 50))",
    after: "radial-gradient(120% 120% at 40% 30%, oklch(92% 0.04 60), oklch(85% 0.06 56))",
  },
  {
    id: "filler",
    treatment: "Liquid Facial Balancing",
    detail: "Full-face plan · proportion-led",
    before: "radial-gradient(130% 100% at 60% 40%, oklch(71% 0.018 52), oklch(62% 0.022 48))",
    after: "radial-gradient(130% 100% at 60% 40%, oklch(92% 0.05 60), oklch(85% 0.07 56))",
  },
];

function useSlider() {
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

function SliderHandle({
  pos,
  label,
  onKeyDown,
}: {
  pos: number;
  label: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="relative h-full w-px bg-white/95 shadow-[0_0_0_1px_oklch(60%_0.15_52_/_0.3)]" />
      </div>
      <button
        type="button"
        role="slider"
        aria-label={`Reveal ${label} before and after. Use arrow keys to compare.`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`Showing ${Math.round(pos)}% before, ${100 - Math.round(pos)}% after`}
        onKeyDown={onKeyDown}
        className={cn(
          "absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full",
          "border border-white bg-white text-[var(--color-accent)] shadow-lg backdrop-blur",
          "transition-transform duration-200 hover:scale-105",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
        )}
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path d="M9 6 4 12l5 6M15 6l5 6-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}

function Slider({ data, ratio = "4/5" }: { data: Case; ratio?: string }) {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } = useSlider();

  return (
    <figure className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)]">
      <div
        ref={ref}
        className="relative w-full cursor-ew-resize touch-none select-none"
        style={{ aspectRatio: ratio }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="absolute inset-0" style={{ background: data.after }} aria-hidden>
          {/* after: a soft warm sheen — reads smoother / more luminous */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 28%, oklch(99% 0.01 64 / 0.5), transparent 64%)",
            }}
          />
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-fg)]">
            After
          </span>
        </div>
        <div
          className="absolute inset-0"
          style={{ background: data.before, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          {/* before: a faint texture + soft de-focus so it reads tired / pre-treatment */}
          <div
            className="absolute inset-0 opacity-50 mix-blend-soft-light"
            style={{
              backgroundImage:
                "repeating-linear-gradient(48deg, oklch(40% 0.01 50 / 0.5) 0 1px, transparent 1px 3px), repeating-linear-gradient(-42deg, oklch(40% 0.01 50 / 0.4) 0 1px, transparent 1px 4px)",
            }}
          />
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-fg)]/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
            Before
          </span>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 text-[0.56rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Sample · illustrative
        </span>
        <SliderHandle pos={pos} label={data.treatment} onKeyDown={onKeyDown} />
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-5 py-4">
        <span className="font-display text-lg text-[var(--color-fg)]">{data.treatment}</span>
        <span className="text-xs text-[var(--color-fg-subtle)]">{data.detail}</span>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
    >
      {/* soft peach aura echoing the hero (on-brand hue ~58) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(55% 50% at 85% 0%, oklch(90% 0.06 58 / 0.6), transparent 70%), radial-gradient(50% 50% at 0% 100%, var(--color-accent-subtle), transparent 72%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Real results"
          title={
            <>
              See the difference.{" "}
              <span className="font-display-em">Drag to reveal.</span>
            </>
          }
          lead="Representative results from our physicians' chairs. Slide the handle — or use your keyboard — to compare before and after."
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
