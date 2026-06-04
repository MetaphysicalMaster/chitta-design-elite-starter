"use client";

/**
 * BeforeAfter — interactive drag-slider gallery, the asset the real site
 * lacks entirely. Placeholder "before/after" panels are rendered with CSS
 * (clearly labeled SAMPLE) so no real patient imagery is implied. Fully
 * keyboard-accessible: the handle is a slider with arrow-key support.
 */

import { useCallback, useRef, useState } from "react";
import { Section, SectionHeading, Reveal } from "./primitives";
import { encoreImages } from "@/app/mockups/encore/images.manifest";
import { cn } from "@/lib/utils";

const CASES = [
  {
    id: "halo",
    label: "Sciton Halo — tone & texture",
    /** object-position keeps a distinct region of the brand photo in frame */
    position: "center 35%",
  },
  {
    id: "filler",
    label: "Filler — midface volume",
    position: "center 50%",
  },
  {
    id: "microneedling",
    label: "RF Microneedling — texture",
    position: "center 65%",
  },
];

/** Lighter `_min.webp` sibling for these card-sized reveal panels. */
const BA_SRC = encoreImages.beforeAfter.primary;
const BA_SRC_LIGHT = BA_SRC.replace(/\.png(\?.*)?$/i, "_min.webp$1");

/**
 * One half of the reveal — the SAME real brand photo on both sides, with the
 * "before" side dimmed/desaturated and the "after" side rendered at full
 * clinical-luxe grade, so dragging the handle reads as a genuine renewal. The
 * source image carries its own baked-in "SAMPLE" label; we keep it labeled.
 */
function RevealPanel({
  variant,
  position,
}: {
  variant: "before" | "after";
  position: string;
}) {
  const [useLight, setUseLight] = useState(true);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--color-bg-subtle)]">
      <img
        src={useLight ? BA_SRC_LIGHT : BA_SRC}
        alt={
          variant === "after"
            ? encoreImages.beforeAfter.altText
            : ""
        }
        aria-hidden={variant === "before" || undefined}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => useLight && setUseLight(false)}
        style={{ objectPosition: position }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover en-photo",
          variant === "after"
            ? "en-photo--graded"
            : "[filter:saturate(0.62)_brightness(0.82)_contrast(0.96)_sepia(0.06)]",
        )}
      />
      {variant === "before" && (
        <span
          aria-hidden
          className="absolute inset-0 bg-[oklch(16%_0.02_248_/_0.18)]"
        />
      )}
      <span className="absolute left-3 top-3 rounded-full bg-[oklch(13%_0.02_248_/_0.62)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-fg)] backdrop-blur-sm">
        {variant}
      </span>
    </div>
  );
}

function Slider({ tone }: { tone: (typeof CASES)[number] }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
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
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
    if (e.key === "Home") setPos(0);
    if (e.key === "End") setPos(100);
  };

  return (
    <div
      ref={ref}
      className="group relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl border border-[var(--color-border)]"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* AFTER (full) */}
      <RevealPanel variant="after" position={tone.position} />
      {/* BEFORE (clipped to handle) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <RevealPanel variant="before" position={tone.position} />
      </div>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 z-10 w-px bg-[var(--gold)] shadow-[0_0_18px_oklch(82%_0.1_84_/_0.7)]"
        style={{ left: `${pos}%` }}
      >
        <button
          type="button"
          role="slider"
          aria-label={`Reveal slider: ${tone.label}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% before`}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-[var(--gold)] bg-[var(--glass-bg-strong)] text-[var(--gold)] backdrop-blur-md transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
        >
          <span aria-hidden className="text-sm leading-none">
            ⇆
          </span>
        </button>
      </div>

      {/* Sample watermark — honest about placeholders */}
      <span className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-full bg-[oklch(15%_0.02_265_/_0.55)] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)] backdrop-blur-sm">
        Sample · for illustration
      </span>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <Section id="results" labelledBy="results-heading">
      <SectionHeading
        id="results-heading"
        eyebrow="Real results"
        title={<>See the <span className="italic">difference.</span></>}
        lede="Drag to reveal. A before-and-after gallery — the proof their old site never showed. Imagery below is sample, illustrative photography for layout demonstration."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {CASES.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08} className="flex flex-col gap-3">
            <Slider tone={c} />
            <p className="text-sm font-medium text-[var(--color-fg-muted)]">
              {c.label}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
