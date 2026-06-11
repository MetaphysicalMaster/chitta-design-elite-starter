"use client";

/**
 * BeforeAfter — "Real Results." A premium gallery of GENUINE before/after pairs
 * from Happy Clinic Denver. Each source image is already composed side-by-side
 * (BEFORE left | AFTER right, with the clinic's own watermark) on a black
 * backdrop — so there is no drag-reveal slider (that needs separate files).
 * Instead: one featured result + an accessible carousel of the real pairs, each
 * presented on a near-black tile so the image's own black bleeds seamlessly.
 *
 * These are real client results — NO "sample" tags here.
 *
 * Accessibility: the carousel is a labelled region with prev/next buttons, a
 * live status announcing the active slide, full keyboard support (arrow keys),
 * and honest alt text on every image. No autoplay (reduced-motion friendly).
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

type Result = {
  src: string;
  /** intrinsic px — preserves ratio + prevents CLS */
  w: number;
  h: number;
  treatment: string;
  detail: string;
  /** optional small audience tag (e.g. men's aesthetics) so the female-luxury
      buyer is never the visual minority on her own proof wall */
  tag?: string;
  alt: string;
};

/* Featured = the female aspirational outcome the primary 35–60 woman buyer
   should see herself in — the dominant Mirror leads the proof block.
   Caption is HONEST to the pixels: this pair shows a skin texture/tone
   rejuvenation (smoother, more even, refreshed skin), NOT a volume change —
   accurate labels ARE the brand ("Subtle is The New WOW"). */
const FEATURED: Result = {
  src: "/clients/happy-clinic/ba-2.png",
  w: 1444,
  h: 1080,
  treatment: "Skin rejuvenation",
  detail: "Texture & tone · smoother, more even, naturally refreshed",
  alt: "Before and after of a female patient — facial skin texture and tone visibly smoother and more even after rejuvenation at Happy Clinic Denver, shown side by side.",
};

/* The remaining real pairs are men's aesthetics — tagged honestly so they read
   as a SECONDARY proof (men's results), keeping the female result dominant on a
   female-luxury wall. Same 1.337 ratio as the featured tile (even baseline). */
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

/* A single result tile — the composed pair on a near-black plate (object-contain
   keeps the whole BEFORE|AFTER frame + labels visible, never cropped). */
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
        {/* NOTE: every source pair ALREADY bakes in its own BEFORE (bottom-left)
            + AFTER (bottom-right) labels and a "HAPPY CLINIC" watermark
            (top-right). We deliberately add NO Before/After overlay chips here —
            doubling them looked like clashing labels and collided with the
            watermark. The image self-labels; the figcaption + alt carry meaning.
            The only overlay is an optional small audience tag, placed TOP-LEFT
            so it never lands on the baked-in watermark. */}
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

  const go = useCallback(
    (next: number) => setI(((next % n) + n) % n),
    [n],
  );

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

  // Announce the active slide for assistive tech.
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

      {/* Controls */}
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

        {/* Slide picker — APG carousel pattern: plain buttons with aria-current,
            NOT orphaned tabs (there are no tabpanels). */}
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
      // hc-sky--results: opaque navy by default; a translucent navy VEIL when
      // the fixed aurora canvas is live — the night sky descends with you.
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
          lead="Real Happy Clinic patients — actual before-and-after results from Dr. Phil's chair. Look closely: the difference is obvious, the work never is."
        />

        {/* The practice's OWN words — the genuine handwritten "Subtle is the new
            WOW!™" lockup (with the butterfly mark + an inset of Dr. Phil) that
            ships with the client's real before/after set. The single most
            brand-authentic artifact in the asset library — surfaced here as a
            signature brand moment, not a sharp proof tile. */}
        <Reveal className="mt-12">
          <figure className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/12 bg-[var(--night-1)] shadow-[0_30px_80px_-40px_oklch(20%_0.06_252_/_0.9)]">
            <div
              className="relative w-full"
              style={{ aspectRatio: "1024 / 711" }}
            >
              <Image
                src="/clients/happy-clinic/ba-featured.jpg"
                alt="Happy Clinic Denver's own signature lockup — the handwritten tagline “Subtle is the new WOW!™ · Happy Clinic Denver · Phil Hong Nguyen, MD” beside a real patient before-and-after and a portrait of Dr. Phil."
                fill
                sizes="(min-width: 1024px) 48rem, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="flex items-center gap-2.5 bg-[var(--night-1)] px-5 py-3.5 text-xs text-white/65">
              <span aria-hidden className="text-[var(--color-accent-bright)]">✦</span>
              The practice&rsquo;s own words — Dr. Phil Hong Nguyen, MD · Happy
              Clinic Denver.
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Featured result */}
          <Reveal>
            <ResultTile
              r={FEATURED}
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </Reveal>

          {/* Gallery carousel of the real pairs */}
          <Reveal delay={0.08}>
            <ResultsCarousel />
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-white/55">
            Actual patients of Happy Clinic Denver. Individual results vary;
            photos are unretouched before/after pairs shared with patient consent.
            {/* Asset note (for the client, not a public claim): supplying more
                FEMALE before/after pairs would let this wall lead even more
                strongly with the primary 35–60 woman audience. */}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
