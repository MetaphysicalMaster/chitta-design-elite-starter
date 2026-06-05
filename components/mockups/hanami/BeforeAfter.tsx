"use client";

/**
 * BeforeAfter — results section on a rice-paper field. Opens with an honest
 * "As featured in Fort Worth Magazine" press strip (photo-a / photo-b are the
 * real Fort Worth Magazine editorial features — a FOCUS / "Women Who Forward
 * Fort Worth" bio of Dr. Phuah and the 2022 "Faces of Fort Worth" Laser &
 * Noninvasive feature — third-party recognition, NOT client before/afters, so
 * they are framed as press, never captioned as a client result). Below, an
 * interactive drag slider trio carries the compare MECHANIC — pointer + full
 * keyboard support (arrows/Home/End) — with brand-toned plates (rice-paper →
 * soft sakura) honestly marked "sample · illustrative" until paired before/
 * afters are sourced. The "drag to reveal" promise refers only to those tagged
 * sliders. Botanical: a light, airy frame rather than a dark gallery.
 */

import { useCallback, useRef, useState } from "react";
import { SectionHeading, Reveal, BrandPhoto } from "./primitives";
import { cn } from "@/lib/utils";

type Case = {
  id: string;
  treatment: string;
  detail: string;
  before: string;
  after: string;
};

// Illustrative plates lean into the BRAND — a warm rice-paper "before" easing to
// a soft sakura "after" (hue ~6–9, the petal range), not a generic gray→pink
// cliché. Honestly tagged "sample" until paired before/afters are wired.
const CASES: Case[] = [
  {
    id: "tox",
    treatment: "Neuromodulator — Forehead & Glabella",
    detail: "Placed by Dr. Phuah · 14 days post",
    before: "linear-gradient(155deg, oklch(95% 0.008 86), oklch(90% 0.012 84))",
    after: "linear-gradient(155deg, oklch(93% 0.04 8), oklch(86% 0.07 6))",
  },
  {
    id: "ipl",
    treatment: "IPL Photofacial — Pigment & Tone",
    detail: "Three-session plan · 8 weeks",
    before: "radial-gradient(120% 120% at 40% 30%, oklch(95% 0.008 86), oklch(89% 0.012 82))",
    after: "radial-gradient(120% 120% at 40% 30%, oklch(92% 0.045 8), oklch(85% 0.075 6))",
  },
  {
    id: "filler",
    treatment: "Liquid Facial Balancing",
    detail: "Full-face plan · proportion-led",
    before: "radial-gradient(130% 100% at 60% 40%, oklch(94% 0.008 86), oklch(88% 0.012 82))",
    after: "radial-gradient(130% 100% at 60% 40%, oklch(91% 0.055 8), oklch(84% 0.085 6))",
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
        <div className="relative h-full w-px bg-white/95 shadow-[0_0_0_1px_oklch(72%_0.11_86_/_0.35)]" />
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
          "border border-white bg-white text-[var(--color-accent-deep)] shadow-lg backdrop-blur",
          "transition-transform duration-200 hover:scale-105",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
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
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-fg)]">
            After
          </span>
        </div>
        <div
          className="absolute inset-0"
          style={{ background: data.before, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          <span className="absolute left-3 top-3 rounded-full bg-[var(--night-0)]/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
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
      {/* soft sakura aura echoing the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(50% 46% at 86% 0%, oklch(92% 0.05 8 / 0.7), transparent 70%), radial-gradient(46% 50% at 0% 100%, var(--color-accent-subtle), transparent 72%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="As featured in Fort Worth Magazine"
          title={
            <>
              The work, in the{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">public eye.</span>
            </>
          }
          lead="Dr. Phuah and the practice, featured in Fort Worth Magazine — and a look at the feather touch in motion. Slide the illustrative handles below, or use your keyboard, to see how a soft, never-overworked result reads."
        />

        {/* PRESS, framed honestly — photo-a / photo-b are Fort Worth Magazine
            editorial features (a FOCUS bio of Dr. Phuah and the 2022 "Faces of
            Fort Worth" feature), NOT client before/afters. They reinforce the
            awards/credibility narrative — the brand's proudest theme — so they
            sit as a recognition strip captioned as press, never as a client
            result. The illustrative drag-sliders below carry the honest "sample"
            mark for the compare mechanic. */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          <Reveal>
            <figure>
              <BrandPhoto
                src="/clients/hanami/photo-a.png"
                alt="Fort Worth Magazine FOCUS feature — Dr. Elaine Phuah, DO, MBA, FACOI, of Hanami Medspa in the 'Women Who Forward Fort Worth' editorial"
                aspect="4 / 5"
                radius="2xl"
                position="50% 30%"
                frame
                sizes="(min-width: 1024px) 32rem, (min-width: 640px) 45vw, 100vw"
                className="shadow-[var(--glass-shadow)]"
              />
              <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-fg-subtle)]">
                <span className="font-medium text-[var(--color-accent-deep)]">As featured in Fort Worth Magazine</span>
                <span aria-hidden className="text-[var(--color-fg-subtle)]/60">·</span>
                <span>Women Who Forward Fort Worth</span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.08}>
            <figure>
              <BrandPhoto
                src="/clients/hanami/photo-b.jpeg"
                alt="Fort Worth Magazine feature — 'The Face of Laser & Noninvasive Skin Rejuvenation,' Hanami Medspa's Dr. Phuah and team"
                aspect="4 / 5"
                radius="2xl"
                position="50% 30%"
                frame
                sizes="(min-width: 1024px) 32rem, (min-width: 640px) 45vw, 100vw"
                className="shadow-[var(--glass-shadow)]"
              />
              <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-fg-subtle)]">
                <span className="font-medium text-[var(--color-accent-deep)]">As featured in Fort Worth Magazine</span>
                <span aria-hidden className="text-[var(--color-fg-subtle)]/60">·</span>
                <span>Faces of Fort Worth · 2022</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* The compare mechanic — clearly framed as an illustrative demo so the
            honestly-tagged sample sliders never read as faux before/afters. */}
        <div className="mt-16">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-deep)]">
            See the difference · drag to reveal
          </p>
          <p className="mt-2 max-w-[56ch] text-sm font-light text-[var(--color-fg-muted)]">
            An illustrative look at the feather touch — soft, balanced, never
            frozen.{" "}
            <span className="text-[var(--color-fg)]">
              Real, consented before &amp; afters are shared privately at your
              consultation
            </span>{" "}
            — your face is never paraded online.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
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
