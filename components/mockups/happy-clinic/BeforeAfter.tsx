"use client";

/**
 * BeforeAfter — "Real Results." The centerpiece is now an INTERACTIVE
 * before/after drag-reveal slider built on the practice's REAL aligned photo
 * pair (ba-after.jpg as the base layer, ba-before.jpg as the clipped overlay)
 * so dragging the handle sweeps from BEFORE → AFTER seamlessly. The pair is
 * pixel-registered (same patient, identical pose / lighting / grey backdrop) so
 * the reveal never "jumps".
 *
 * The signature "Subtle is The New WOW!™" brand lockup survives as an elegant
 * eyebrow/caption around the slider (with a small butterfly mark) — the brand
 * moment is preserved, but the WORKING slider is the hero.
 *
 * Below the slider, the practice's genuine composited before/after pairs remain
 * as a supporting gallery (a featured female result + an accessible carousel of
 * the real men's-aesthetics pairs) — real client results.
 *
 * Accessibility:
 *  - the slider is a real ARIA slider (role="slider", valuemin/now/max,
 *    aria-valuetext) with pointer + full keyboard support (arrows/Home/End);
 *  - the static track has no transform animation, so it is reduced-motion safe
 *    by construction;
 *  - the supporting carousel is a labelled region with prev/next, a live status,
 *    arrow-key support, and honest alt text. No autoplay.
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

/* ============================================================
   The interactive drag-reveal slider (lead comparison).
   Real aligned photos: AFTER base + BEFORE clipped overlay.
   ============================================================ */

/* Both source photos are intrinsic 928 × 1152 (≈ 4 / 5 portrait). Locking the
   aspect-ratio to the real pixels keeps the reveal pixel-perfect + zero CLS. */
const BA = {
  before: "/clients/happy-clinic/ba-before.jpg",
  after: "/clients/happy-clinic/ba-after.jpg",
  w: 928,
  h: 1152,
} as const;

function useReveal() {
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

function RevealSlider() {
  const { pos, ref, onPointerDown, onPointerMove, onPointerUp, onKeyDown } =
    useReveal();
  const shown = Math.round(pos);

  return (
    <figure className="mx-auto max-w-md">
      {/* Brand eyebrow — the signature "Subtle is The New WOW" lockup with a
          small butterfly mark, so the brand moment survives around the slider. */}
      <figcaption className="mb-4 flex items-center justify-center gap-2.5 text-center">
        <Butterfly className="h-5 w-5 text-[var(--color-gold)]" />
        <span className="font-display-em text-xl leading-none text-[var(--color-accent-bright)] sm:text-2xl">
          Subtle is The New WOW!
          <span className="align-super text-[0.55em]">™</span>
        </span>
      </figcaption>

      <div
        ref={ref}
        className="hc-ba relative w-full overflow-hidden rounded-3xl border border-white/12 bg-[var(--night-0)] shadow-[0_36px_90px_-44px_oklch(12%_0.04_252_/_0.95)]"
        style={{ aspectRatio: `${BA.w} / ${BA.h}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* BASE LAYER — AFTER (refreshed/glowing). Plain <img>, static-export
            safe; basePath is handled by the build. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BA.after}
          alt="After — the same Happy Clinic Denver patient with refreshed, more even, naturally glowing skin."
          width={BA.w}
          height={BA.h}
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-[2] rounded-full bg-[var(--color-accent)]/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-fg)] backdrop-blur-sm"
        >
          After
        </span>

        {/* OVERLAY — BEFORE, clipped from the left so dragging right reveals the
            after beneath. */}
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
          <span className="pointer-events-none absolute left-3 top-3 z-[2] rounded-full bg-[var(--night-0)]/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
            Before
          </span>
        </div>

        {/* Honest tag — illustrative / representative result. */}
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-[0.54rem] font-medium uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Illustrative · representative result
        </span>

        {/* Divider line + the ARIA slider handle. */}
        <span className="hc-ba-line" style={{ left: `${pos}%` }} aria-hidden />
        <button
          type="button"
          role="slider"
          aria-label="Drag to reveal before and after. Use arrow keys to compare."
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shown}
          aria-valuetext={`Showing ${shown}% before, ${100 - shown}% after`}
          onKeyDown={onKeyDown}
          className="hc-ba-handle"
          style={{ left: `${pos}%` }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M9 6 4 12l5 6M15 6l5 6-5 6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-white/60">
        Drag the handle — or use your arrow keys — to reveal the difference.
        Skin texture &amp; tone, naturally refreshed.
      </p>
    </figure>
  );
}

/* A tiny brand butterfly mark — echoes the lockup that ships in the client's
   own before/after artwork, kept small so the slider stays the centerpiece. */
function Butterfly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 6.5c-1.3-2.7-3.6-4-5.7-3.6C3.9 3.3 2.6 5.6 3 8c.4 2.3 2.4 3.9 4.7 4.2-2.1.6-3.7 2.2-3.9 4.3-.2 2 1 3.6 2.7 3.7 2 .1 4-1.7 5.5-4.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.5c1.3-2.7 3.6-4 5.7-3.6C20.1 3.3 21.4 5.6 21 8c-.4 2.3-2.4 3.9-4.7 4.2 2.1.6 3.7 2.2 3.9 4.3.2 2-1 3.6-2.7 3.7-2 .1-4-1.7-5.5-4.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.5v13"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================================
   Supporting gallery — the practice's genuine composited pairs.
   ============================================================ */

type Result = {
  src: string;
  /** intrinsic px — preserves ratio + prevents CLS */
  w: number;
  h: number;
  treatment: string;
  detail: string;
  /** optional small audience tag (e.g. men's aesthetics) */
  tag?: string;
  alt: string;
};

/* Featured = the female aspirational outcome. Caption honest to the pixels:
   a skin texture/tone rejuvenation, NOT a volume change. */
const FEATURED: Result = {
  src: "/clients/happy-clinic/ba-2.png",
  w: 1444,
  h: 1080,
  treatment: "Skin rejuvenation",
  detail: "Texture & tone · smoother, more even, naturally refreshed",
  alt: "Before and after of a female patient — facial skin texture and tone visibly smoother and more even after rejuvenation at Happy Clinic Denver, shown side by side.",
};

/* The remaining real pairs are men's aesthetics — tagged honestly. */
const RESULTS: Result[] = [
  {
    src: "/clients/happy-clinic/ba-1.png",
    w: 1444,
    h: 1080,
    treatment: "Botox & Dysport",
    detail: "Forehead & glabella · refreshed, not frozen",
    tag: "Men's aesthetics",
    alt: "Before and after of a male patient — forehead and frown lines softened with Botox and Dysport at Happy Clinic Denver, shown side by side.",
  },
  {
    src: "/clients/happy-clinic/ba-3.png",
    w: 1444,
    h: 1080,
    treatment: "Botox & filler",
    detail: "Full-face balance · a naturally younger look",
    tag: "Men's aesthetics",
    alt: "Before and after of a male patient — overall facial rejuvenation with Botox and filler at Happy Clinic Denver, shown side by side.",
  },
];

/* A single result tile — the composed pair on a near-black plate. */
function ResultTile({
  r,
  priority = false,
  sizes,
  className,
}: {
  r: Result;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_-36px_oklch(20%_0.06_252_/_0.9)]",
        className,
      )}
    >
      <div
        className="hc-plate--result relative w-full"
        style={{ aspectRatio: `${r.w} / ${r.h}` }}
      >
        <Image
          src={r.src}
          alt={r.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain"
        />
        {r.tag && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-3 z-[2] rounded-full bg-black/45 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm"
          >
            {r.tag}
          </span>
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-3 bg-[var(--night-1)] px-5 py-4">
        <span className="font-heading text-base text-white sm:text-lg">
          {r.treatment}
        </span>
        <span className="text-right text-xs text-white/60">{r.detail}</span>
      </figcaption>
    </figure>
  );
}

function ResultsCarousel() {
  const [i, setI] = useState(0);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const n = RESULTS.length;

  const go = useCallback((next: number) => setI(((next % n) + n) % n), [n]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(i + 1);
    }
  };

  const active = RESULTS[i];

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Result ${i + 1} of ${n}: ${active.treatment}, ${active.detail}`;
    }
  }, [i, n, active]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Real before-and-after results"
      onKeyDown={onKeyDown}
      className="relative"
    >
      <ResultTile
        r={active}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="mx-auto max-w-3xl"
      />

      <div className="mx-auto mt-6 flex max-w-3xl items-center justify-between">
        <button
          type="button"
          onClick={() => go(i - 1)}
          aria-label="Previous result"
          className="hc-press grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          {RESULTS.map((r, idx) => (
            <button
              key={r.src}
              type="button"
              aria-current={idx === i}
              aria-label={`Show result ${idx + 1}: ${r.treatment}`}
              onClick={() => go(idx)}
              className={cn(
                "h-2.5 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                idx === i
                  ? "w-7 bg-[var(--color-gold)]"
                  : "w-2.5 bg-white/30 hover:bg-white/50",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(i + 1)}
          aria-label="Next result"
          className="hc-press grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p ref={liveRef} className="sr-only" aria-live="polite" />
    </div>
  );
}

export function BeforeAfter() {
  return (
    <section
      id="results"
      data-sky-window
      className="hc-sky--results relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
    >
      {/* aurora aura echoing the hero on the dark navy field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(55% 50% at 85% 0%, var(--aurora-blue), transparent 70%), radial-gradient(50% 50% at 0% 100%, var(--aurora-teal), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          invert
          eyebrow="Real results"
          title={
            <>
              Subtle, natural,{" "}
              <span className="font-display-em text-[var(--color-accent-bright)]">
                undeniably you.
              </span>
            </>
          }
          lead="Real Happy Clinic patients — actual before-and-after results from Dr. Phil's chair. Drag the slider below and look closely: the difference is obvious, the work never is."
        />

        {/* THE CENTERPIECE — interactive before/after drag-reveal on the real
            aligned photo pair, wrapped in the signature brand lockup. */}
        <Reveal className="mt-12">
          <RevealSlider />
        </Reveal>

        {/* Supporting gallery — the practice's genuine composited pairs. */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal>
            <ResultTile
              r={FEATURED}
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <ResultsCarousel />
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-white/55">
            Actual patients of Happy Clinic Denver. Individual results vary;
            photos are unretouched before/after pairs shared with patient consent.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
