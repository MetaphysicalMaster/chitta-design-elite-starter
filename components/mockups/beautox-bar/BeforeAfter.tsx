"use client";

/**
 * BeforeAfter — a premium, accessible before/after reveal slider wired to the
 * REAL aligned comparison pair. Pointer-drag AND full keyboard control (the
 * divider is a native range input styled as a handle), so it's operable by AT
 * users. Reduced-motion safe (no autoplay; a one-time in-view nudge only).
 *
 * THE PAIR: Beautox Bar's real before/after photos live only on Instagram, with
 * no gallery/media page to capture a clean pair from. So this ships an aligned,
 * ILLUSTRATIVE pair (same subject, identical pose / lighting / grey backdrop —
 * the BEFORE carries subtle under-eye shadow, faint fine lines and a slightly
 * duller tone; the AFTER is refreshed and glowing). They are pixel-for-pixel
 * registered (both 928×1152), so the divider reveal is seamless.
 *
 * LAYERING: the AFTER is the base layer; the BEFORE is the clipped overlay
 * (clipPath insets from the right by `100 - pos`%), so dragging left→right
 * sweeps BEFORE → AFTER — the satisfying "watch it refresh" direction.
 *
 * Static-export-safe: plain <img> (basePath is applied by the build), fixed
 * intrinsic width/height + an exact aspect-ratio bed → zero CLS. An honest
 * "Illustrative · representative result" tag stays on the frame, and the
 * caption keeps the playful brand framing while telling the owner their real
 * Instagram pair drops straight in at launch.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Reveal, SectionHeading } from "./primitives";

/* The aligned pair, shipped per-slug under /public. Both 928×1152 — declaring
   the intrinsic size + a matching aspect bed guarantees zero layout shift. */
const BA_AFTER = "/clients/beautox-bar/ba-after.jpg";
const BA_BEFORE = "/clients/beautox-bar/ba-before.jpg";
const IMG_W = 928;
const IMG_H = 1152;

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
          lead="Drag the divider — or use the arrow keys — to watch a tailored tox + filler pour refresh the face. Results vary; every plan is personalized at your consult."
        />

        <Reveal delay={0.1} className="mt-12">
          {/* Portrait pair → a snug max-width so a single face reads intimate,
              not billboard-sized; centered in the section. */}
          <figure ref={figRef} className="mx-auto max-w-[26rem]">
            <div
              className="relative select-none overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] shadow-[var(--glass-shadow)]"
              style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
            >
              {/* AFTER (base layer) — the refreshed, glowing result */}
              <img
                src={BA_AFTER}
                alt="Beautox Bar before/after — the same client after a tailored tox and filler refresh: skin looks smoother, brighter and rested"
                width={IMG_W}
                height={IMG_H}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_78%_at_50%_38%,transparent_52%,oklch(16%_0.02_350_/_0.22))]"
              />
              <span className="pointer-events-none absolute bottom-3 right-3 z-[12] rounded-full bg-[oklch(16%_0.01_350_/_0.62)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[oklch(98%_0.01_350)] backdrop-blur-sm transition-opacity duration-200" style={{ opacity: pos > 88 ? 0 : 1 }}>
                After
              </span>

              {/* BEFORE (clipped overlay) — revealed on the left of the divider */}
              <div
                className="absolute inset-0 z-[8]"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                aria-hidden
              >
                <img
                  src={BA_BEFORE}
                  alt=""
                  width={IMG_W}
                  height={IMG_H}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_78%_at_50%_38%,transparent_52%,oklch(16%_0.02_350_/_0.22))]"
                />
                <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[oklch(16%_0.01_350_/_0.62)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[oklch(98%_0.01_350)] backdrop-blur-sm transition-opacity duration-200" style={{ opacity: pos < 12 ? 0 : 1 }}>
                  Before
                </span>
              </div>

              {/* honest illustrative tag — stays on the frame at all times */}
              <span className="pointer-events-none absolute left-3 top-3 z-[12] inline-flex items-center gap-1.5 rounded-full border border-[oklch(100%_0_0_/_0.34)] bg-[oklch(16%_0.01_350_/_0.55)] px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[oklch(98%_0.01_350)] backdrop-blur-sm">
                <span aria-hidden className="text-[var(--color-accent-bright)]">✦</span>
                Illustrative · representative result
              </span>

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

            {/* HONEST framing — the pair is an aligned ILLUSTRATIVE comparison;
                pitches the owner that their real Instagram B&A drops in cleanly
                at launch (it's their strongest closer). */}
            <figcaption className="mt-5 space-y-2 text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent-subtle)] px-4 py-1.5 text-xs font-semibold text-[var(--color-accent-deep)]">
                {/* Instagram glyph — signals exactly where the real pair comes from */}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
                </svg>
                Swaps for your real pair from{" "}
                <span className="tnum">@beautoxbar</span> — slider ready.
              </p>
              <p className="mx-auto max-w-xl text-sm text-[var(--color-fg-subtle)]">
                The comparison above is an aligned{" "}
                <strong>illustrative</strong> pair — client to supply real
                before/after at launch. Hand us one real pour from your Instagram
                and it drops straight into this slider with no rebuild, becoming
                your strongest closer. Individual results vary.
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
