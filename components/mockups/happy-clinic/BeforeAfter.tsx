"use client";

/**
 * BeforeAfter — interactive drag slider on a dark aurora field so results pop.
 * Pointer + full keyboard support (arrows/Home/End on the handle). Placeholder
 * gradient "plates" clearly marked "sample · illustrative".
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
    treatment: "BOTOX® — Glabella & Forehead",
    detail: "Trainer-placed · 14 days post",
    before: "linear-gradient(155deg, oklch(80% 0.02 300), oklch(72% 0.03 300))",
    after: "linear-gradient(155deg, oklch(90% 0.05 300), oklch(82% 0.07 290))",
  },
  {
    id: "filler",
    treatment: "JUVÉDERM® — Cheek & Lip",
    detail: "2.0ml · 2-week follow-up",
    before: "radial-gradient(120% 120% at 40% 30%, oklch(82% 0.03 40), oklch(73% 0.04 30))",
    after: "radial-gradient(120% 120% at 40% 30%, oklch(88% 0.05 16), oklch(80% 0.07 12))",
  },
  {
    id: "laser",
    treatment: "Laser Resurfacing — Tone & Texture",
    detail: "3 sessions · skin remodeling",
    before: "radial-gradient(130% 100% at 60% 40%, oklch(80% 0.03 60), oklch(70% 0.05 50))",
    after: "radial-gradient(130% 100% at 60% 40%, oklch(89% 0.05 200), oklch(82% 0.08 196))",
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
        <div className="relative h-full w-0.5 bg-white/90 shadow-[0_0_0_1px_oklch(56%_0.2_300_/_0.3)]" />
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
          "border border-white bg-white/90 text-[var(--color-accent)] shadow-lg backdrop-blur",
          "transition-transform duration-200 hover:scale-105",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        )}
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path d="M9 6 4 12l5 6M15 6l5 6-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}

function Slider({ data, ratio = "4/5" }: { data: Case; ratio?: string }) {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } = useSlider();

  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[var(--glass-shadow)]">
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
          <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-[var(--color-fg)]">
            After
          </span>
        </div>
        <div
          className="absolute inset-0"
          style={{ background: data.before, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          <span className="absolute left-3 top-3 rounded-full bg-[var(--night-0)]/85 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-white">
            Before
          </span>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Sample · illustrative
        </span>
        <SliderHandle pos={pos} label={data.treatment} onKeyDown={onKeyDown} />
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-5 py-4">
        <span className="font-display text-lg text-white">{data.treatment}</span>
        <span className="text-xs text-white/55">{data.detail}</span>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
      style={{ background: "linear-gradient(160deg, var(--night-0), var(--night-1))" }}
    >
      {/* aurora aura echoing the hero on the dark field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(55% 50% at 85% 0%, var(--aurora-violet), transparent 70%), radial-gradient(50% 50% at 0% 100%, var(--aurora-teal), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          invert
          eyebrow="Real results"
          title={
            <>
              See the difference. <span className="italic">Drag to reveal.</span>
            </>
          }
          lead="The before/after gallery their current site doesn't have. Slide the handle — or use your keyboard — to compare representative outcomes from our trainer-led team."
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
