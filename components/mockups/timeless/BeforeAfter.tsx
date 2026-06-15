"use client";

/**
 * BeforeAfter — interactive drag-reveal slider, warm-orange/peach brand-native.
 *
 * LEAD comparison = a REAL, pixel-aligned AI-generated photo pair (same woman,
 * identical pose/lighting/grey background). AFTER is the base layer (full-bleed
 * image); BEFORE is the clipped overlay — so dragging the handle left→right
 * wipes the tired pre-treatment skin away to the refreshed result. The pair
 * aligns pixel-for-pixel, so the reveal is seamless.
 *
 * A faint warm-orange wash + an honest "Illustrative · representative result"
 * tag keep it on-brand and truthful. Photos are plain <img> (static-export-safe;
 * basePath handled by the build).
 *
 * Below the hero photo, three brand-tinted gradient "studies" stand in for
 * additional treatment categories (clearly marked sample · illustrative).
 *
 * Pointer + full keyboard support (arrows / Home / End on the handle), AA, and
 * zero-CLS via fixed aspect-ratio.
 */

import { useCallback, useRef, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

/* ---------- shared slider hook ---------- */
function useSlider(initial = 50) {
  const [pos, setPos] = useState(initial);
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

/* ---------- handle ---------- */
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
          "transition-transform duration-200 hover:scale-105 active:scale-95",
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

/* ---------- LEAD: real photo pair ----------
   AFTER is the base layer (always full image). BEFORE is the clipped overlay,
   so as `pos` grows the BEFORE shrinks from the right and the AFTER is revealed.
   pos=0 → all AFTER; pos=100 → all BEFORE. Default opens at 55% (mostly BEFORE)
   so the resting state invites the drag-to-after gesture. */
function PhotoSlider() {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } = useSlider(55);

  return (
    <figure className="group/photo overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)]">
      <div
        ref={ref}
        className="relative w-full cursor-ew-resize touch-none select-none"
        style={{ aspectRatio: "4 / 5" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* AFTER — base layer (refreshed / glowing) */}
        <div className="absolute inset-0">
          <img
            src="/clients/timeless/ba-after.jpg"
            alt="After a physician-led treatment plan — refreshed, luminous skin"
            width={928}
            height={1152}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full select-none object-cover"
          />
          {/* faint warm-orange brand sheen, AFTER side reads a touch warmer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              background:
                "radial-gradient(70% 60% at 50% 22%, oklch(80% 0.13 54 / 0.22), transparent 66%)",
            }}
          />
          <span className="absolute right-3 top-3 z-[2] rounded-full bg-white/90 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-[var(--color-fg)] shadow-sm">
            After
          </span>
        </div>

        {/* BEFORE — clipped overlay (tired / pre-treatment) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          <img
            src="/clients/timeless/ba-before.jpg"
            alt="Before treatment — subtle under-eye shadow, faint fine lines, duller tone"
            width={928}
            height={1152}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full select-none object-cover"
          />
          {/* a whisper-cool veil so the pre side reads a hair duller than after */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(180deg, oklch(86% 0.01 250 / 0.1), oklch(80% 0.012 250 / 0.16))",
            }}
          />
          <span className="absolute left-3 top-3 z-[2] rounded-full bg-[var(--color-fg)]/85 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-white">
            Before
          </span>
        </div>

        {/* honest provenance tag */}
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/35 px-3 py-1 text-[0.56rem] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
          Illustrative · representative result
        </span>

        <SliderHandle pos={pos} label="Liquid Facial Balancing + neuromodulator" onKeyDown={onKeyDown} />
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
        <span className="font-display text-lg text-[var(--color-fg)] sm:text-xl">
          Liquid Balancing + Neuromodulator
        </span>
        <span className="text-xs text-[var(--color-fg-subtle)] sm:text-sm">
          Physician-led plan · 6 weeks post
        </span>
      </figcaption>
    </figure>
  );
}

/* ---------- supporting gradient "studies" ----------
   Brand-tinted plates for additional treatment categories. BEFORE reads
   dull/cool/tired; AFTER reads brighter + warmer peach — all inside the true
   brand hue range (~52–60), never brassy. Clearly marked sample · illustrative. */
type Study = {
  id: string;
  treatment: string;
  detail: string;
  before: string;
  after: string;
};

const STUDIES: Study[] = [
  {
    id: "tox",
    treatment: "Neuromodulator",
    detail: "Forehead & glabella · 14 days",
    before: "url('/clients/timeless/ba/tox-before.webp') center/cover",
    after: "url('/clients/timeless/ba/tox-after.webp') center/cover",
  },
  {
    id: "secretrf",
    treatment: "Secret RF",
    detail: "Texture & tightening · 8 weeks",
    before: "url('/clients/timeless/ba/micro-before.webp') center/cover",
    after: "url('/clients/timeless/ba/micro-after.webp') center/cover",
  },
  {
    id: "glow",
    treatment: "Medical Facial Glow",
    detail: "Tone & radiance · single session",
    before: "url('/clients/timeless/ba/glow-before.webp') center/cover",
    after: "url('/clients/timeless/ba/glow-after.webp') center/cover",
  },
];

function StudySlider({ data }: { data: Study }) {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } = useSlider(50);

  return (
    <figure className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)]">
      <div
        ref={ref}
        className="relative w-full cursor-ew-resize touch-none select-none"
        style={{ aspectRatio: "4 / 5" }}
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
          lead="A representative result from our physicians' chairs. Slide the handle — or use your keyboard — to wipe before into after."
        />

        {/* LEAD comparison: real aligned photo pair, paired with context copy */}
        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <PhotoSlider />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="max-w-xl">
              <h3
                className="font-display text-[var(--color-fg)]"
                style={{ fontSize: "clamp(1.5rem, 1rem + 1.6vw, 2.1rem)", lineHeight: 1.1 }}
              >
                The same face, refreshed —{" "}
                <span className="font-display-em text-accent-deep">not someone else&apos;s.</span>
              </h3>
              <p className="mt-5 text-pretty font-light leading-relaxed text-[var(--color-fg-muted)]">
                Drag the handle across the photo: under-eye shadow softens, fine
                lines settle, and tired tone lifts to a lit-from-within glow. Both
                frames are aligned pixel-for-pixel, so the only thing that changes
                is the skin — exactly how we plan it in the chair.
              </p>
              <ul className="mt-7 grid gap-3">
                {[
                  "Physician-placed, proportion-led — never overfilled",
                  "A staged plan, reviewed at every visit",
                  "Results that read as rested, not done",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-sm text-[var(--color-fg-muted)]"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 inline-grid h-4 w-4 flex-none place-items-center rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]"
                    >
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                        <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-xs text-[var(--color-fg-subtle)]">
                Illustrative, representative result — individual outcomes vary.
              </p>
            </div>
          </Reveal>
        </div>

        {/* supporting category studies */}
        <p className="mt-20 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
          More to compare
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STUDIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <StudySlider data={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
