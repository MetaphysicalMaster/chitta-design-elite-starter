"use client";

/**
 * BeforeAfter — interactive drag slider on a soft nude field. Pointer + full
 * keyboard support (arrows/Home/End on the handle). The page's primary proof-
 * of-work, so the LEAD case is grounded in the real hero complexion (one large
 * comparison: a degraded "before" grade revealing the clean "after") — a real
 * face, not a swatch. Two supporting cases stay as soft-lit complexion STUDIES
 * (ss-skin), the "after" the same warm skin only brighter/clearer — a
 * luminosity lift, never a hue jump — so the gallery stays on-palette. Every
 * tile is honestly tagged "sample · illustrative"; real client photos are
 * shared privately at consultation. Quiet-luxury: a light, editorial frame
 * rather than a dark gallery — restraint over spectacle.
 */

import { useCallback, useRef, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";
import { PrintReveal } from "./experience";
import { cn } from "@/lib/utils";

type Case = {
  id: string;
  treatment: string;
  detail: string;
  /** When set, the slider reveals the REAL hero complexion (graded before vs
      clean after) instead of a CSS skin-study plate. */
  photo?: { src: string; position?: string; alt: string };
};

// The LEAD case is grounded in the real hero photograph (one actual complexion,
// graded as a degraded "before" revealing the clean "after") so the gallery's
// primary proof is a real face, not a swatch. The two supporting cases stay as
// soft-lit complexion STUDIES (ss-skin) — the "after" the same warm skin, only
// brighter/clearer (a luminosity lift, never a hue jump) — on-palette and
// honestly tagged "sample · illustrative".
const CASES: Case[] = [
  {
    id: "balance",
    treatment: "Liquid Facial Balancing",
    detail: "Full-face plan · proportion-led",
    photo: {
      src: "/clients/simplyskin/hero.jpg",
      position: "62% 34%",
      alt: "A SimplySkin client's calm, healthy complexion — the natural, rested result of a full-face balancing plan.",
    },
  },
  {
    id: "tox",
    treatment: "BOTOX® — Glabella & Forehead",
    detail: "Conservative placement · 14 days post",
  },
  {
    id: "filler",
    treatment: "JUVÉDERM® — Lip & Chin",
    detail: "1.0ml · two-week follow-up",
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
        <div className="relative h-full w-px bg-white/95 shadow-[0_0_0_1px_oklch(58%_0.04_184_/_0.22)]" />
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

function Slider({ data, ratio = "4/5" }: { data: Case; ratio?: string }) {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } = useSlider();

  return (
    <figure className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)]">
      {/* The comparison plate develops like a print (wipe only — no scale or
          filter so the slider's own before/after grades and pointer math stay
          untouched). */}
      <PrintReveal>
      <div
        ref={ref}
        className="relative w-full cursor-ew-resize touch-none select-none"
        style={{ aspectRatio: ratio }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* AFTER layer (full width) — real clean complexion, or the brighter
            skin-study plate. */}
        <div className="absolute inset-0" aria-hidden>
          {data.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photo.src}
              alt=""
              aria-hidden
              draggable={false}
              loading="lazy"
              className="ss-photo ss-photo--after"
              style={{ objectPosition: data.photo.position ?? "center" }}
            />
          ) : (
            <div className="ss-skin ss-skin--after absolute inset-0" />
          )}
          <span className="absolute right-3 top-3 z-[1] rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-fg)]">
            After
          </span>
        </div>
        {/* BEFORE layer (clipped) — same real frame, degraded grade; or the
            deeper skin-study plate. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden
        >
          {data.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photo.src}
              alt=""
              aria-hidden
              draggable={false}
              loading="lazy"
              className="ss-photo ss-photo--before"
              style={{ objectPosition: data.photo.position ?? "center" }}
            />
          ) : (
            <div className="ss-skin absolute inset-0" />
          )}
          <span className="absolute left-3 top-3 z-[1] rounded-full bg-[var(--ink-0)]/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
            Before
          </span>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 text-[0.56rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Sample · illustrative
        </span>
        <SliderHandle pos={pos} label={data.treatment} onKeyDown={onKeyDown} />
      </div>
      </PrintReveal>
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
      className="relative scroll-mt-28 overflow-hidden py-24 sm:py-28"
    >
      {/* soft nude aura echoing the hero glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(55% 50% at 85% 0%, oklch(95% 0.03 56), transparent 70%), radial-gradient(50% 50% at 0% 100%, var(--color-accent-subtle), transparent 72%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Real results"
          title="See the difference for yourself."
          lead="Natural, undetectable change — never overdone. Drag the handle (or use your keyboard) to compare representative outcomes from our care."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {CASES.map((c, i) => (
            <Reveal
              key={c.id}
              delay={i * 0.08}
              className={cn(c.photo && "lg:col-span-2")}
            >
              <Slider data={c} ratio={c.photo ? "16 / 10" : "4/5"} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[var(--color-fg-subtle)]">
          Representative studies for layout. Real client before/after photos are
          shared privately at your consultation.
        </p>
      </div>
    </section>
  );
}
