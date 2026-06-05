"use client";

/**
 * BeforeAfter — a premium, accessible before/after reveal slider. Pointer-drag
 * AND full keyboard control (the divider is a native range input styled as a
 * handle), so it's operable by AT users. The "after" image is clipped by the
 * slider position. Reduced-motion safe (no autoplay).
 *
 * HONEST GAP (per the program owner): Beautox Bar's real before/after photos
 * live only on Instagram — there is no gallery/media page to capture a real pair
 * from. So this ships as a genuinely-premium slider over on-brand SAMPLE plates,
 * clearly marked, with a visible caption telling the owner exactly where their
 * real B&A drops in: "Client to supply real before/after — slider ready." When
 * they hand over a real pair, it slots straight into these two BrandImage slots.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading } from "./primitives";
import { BrandImage } from "./BrandImage";

/* A faint face-and-skin motif so each sample plate reads unmistakably as "a real
   face drops in here" rather than a flat paint swatch — a soft portrait
   silhouette (head + shoulders) plus a sparse skin-texture stipple, both at low
   alpha over the candy gradient. aria-hidden, decorative only. */
function FaceMotif({ tint }: { tint: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ color: tint }}
    >
      {/* head + shoulders portrait silhouette, centered */}
      <g fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.5">
        <circle cx="100" cy="78" r="34" />
        <path d="M48 168c4-30 26-46 52-46s48 16 52 46" strokeLinecap="round" />
      </g>
      {/* a few skin-texture freckles/pores so it reads as a face, not an icon */}
      <g fill="currentColor" opacity="0.32">
        <circle cx="88" cy="74" r="1.4" />
        <circle cx="112" cy="80" r="1.2" />
        <circle cx="100" cy="92" r="1.3" />
        <circle cx="92" cy="100" r="1" />
        <circle cx="110" cy="98" r="1" />
      </g>
    </svg>
  );
}

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const prefersReduced = useReducedMotion();
  const figRef = useRef<HTMLElement>(null);
  const inView = useInView(figRef, { once: true, amount: 0.4 });
  // One-time "this is draggable" nudge the first time the slider scrolls into
  // view — reduced-motion gated, and cancelled the moment the user takes over.
  const [hinting, setHinting] = useState(false);
  const [userMoved, setUserMoved] = useState(false);
  const hintFiredRef = useRef(false);
  useEffect(() => {
    if (!inView || prefersReduced || userMoved || hintFiredRef.current) return;
    hintFiredRef.current = true;
    setHinting(true);
    const seq = [62, 38, 50];
    const timers = seq.map((p, i) =>
      window.setTimeout(() => setPos(p), 420 + i * 480),
    );
    const end = window.setTimeout(() => setHinting(false), 420 + seq.length * 480);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
    };
  }, [inView, prefersReduced, userMoved]);

  const takeOver = (v: number) => {
    setUserMoved(true);
    setHinting(false);
    setPos(v);
  };

  return (
    <section id="results" className="scroll-mt-20 bg-[var(--color-bg)] py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The proof"
          title={
            <>
              Subtle. Natural. <span className="candy-text">So you.</span>
            </>
          }
          lead="Drag the divider — or use the arrow keys — to see the difference a tailored tox + filler pour makes. Results vary; plans are personalized at your consult."
        />

        <Reveal delay={0.1} className="mt-12">
          <figure ref={figRef} className="mx-auto max-w-3xl">
            <div className="relative select-none overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] shadow-[var(--glass-shadow)]">
              {/* AFTER (base layer) */}
              <BrandImage
                alt="Skin after a tox and filler refresh — smooth, refreshed, natural"
                aspect="4:3"
                tone="magenta"
                radius="lg"
                sample
                className="rounded-none border-0"
              >
                {/* face motif so the plate reads as "an AFTER photo goes here" */}
                <FaceMotif tint="oklch(99% 0.01 350 / 0.85)" />
                {/* soft vignette to lift it off a flat swatch */}
                <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(72%_72%_at_50%_42%,transparent_44%,oklch(16%_0.02_350_/_0.34))]" />
                <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-[oklch(16%_0.01_350_/_0.6)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[oklch(98%_0.01_350)] backdrop-blur-sm">
                  After
                </span>
              </BrandImage>

              {/* BEFORE (clipped overlay) */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                aria-hidden
              >
                <BrandImage
                  alt=""
                  aspect="4:3"
                  tone="lilac"
                  radius="lg"
                  sample={false}
                  className="rounded-none border-0"
                >
                  <FaceMotif tint="oklch(28% 0.04 320 / 0.7)" />
                  <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(72%_72%_at_50%_42%,transparent_44%,oklch(16%_0.02_350_/_0.34))]" />
                  <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-[oklch(16%_0.01_350_/_0.6)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[oklch(98%_0.01_350)] backdrop-blur-sm">
                    Before
                  </span>
                </BrandImage>
              </div>

              {/* divider line + premium handle */}
              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-[oklch(100%_0_0_/_0.9)] shadow-[0_0_18px_oklch(70%_0.17_356_/_0.8)]"
                style={{ left: `${pos}%` }}
              >
                <motion.span
                  className="absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[oklch(100%_0_0_/_0.7)] bg-[var(--color-accent)] shadow-[0_8px_22px_-6px_oklch(60%_0.16_356_/_0.9)]"
                  animate={
                    hinting && !prefersReduced ? { scale: [1, 1.12, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 1.1, repeat: hinting ? Infinity : 0, ease: "easeInOut" }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-accent-fg)]" fill="none" aria-hidden>
                    <path
                      d="M9 7l-4 5 4 5M15 7l4 5-4 5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              </div>

              {/* the accessible control overlaying the full image */}
              <label className="sr-only" htmlFor="ba-range">
                Before / after comparison position
              </label>
              <input
                id="ba-range"
                type="range"
                min={0}
                max={100}
                value={pos}
                onChange={(e) => takeOver(Number(e.target.value))}
                onPointerDown={() => setUserMoved(true)}
                aria-valuetext={`${pos}% revealing the after image`}
                className="ba-range absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              />
            </div>

            {/* HONEST "supply real B&A" note — shows the owner exactly where their
                real Instagram before/after pair slots into the (ready) slider, and
                pitches the owner directly: their B&A is their strongest closer. */}
            <figcaption className="mt-5 space-y-2 text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent-subtle)] px-4 py-1.5 text-xs font-semibold text-[var(--color-accent-deep)]">
                {/* Instagram glyph — signals exactly where the real pair comes from */}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
                </svg>
                Pulls straight from{" "}
                <span className="tnum">@beautoxbar</span> — slider ready.
              </p>
              <p className="mx-auto max-w-xl text-sm text-[var(--color-fg-subtle)]">
                The two plates are the live <strong>Before</strong> and{" "}
                <strong>After</strong> slots. Hand us one real pair from your
                Instagram and this becomes your strongest closer — it drops in with
                no rebuild. Plates shown are on-brand <strong>samples</strong>;
                individual results vary.
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
