"use client";

/**
 * SplitFlapBoard — the "Solari" split-flap review board. A row of SIX panels
 * styled like an old mechanical departure board / manual scoreboard. Each panel
 * has a horizontal center SEAM; on refresh its TOP LEAF mechanically drops
 * (CSS 3D `rotateX` on a bottom hinge) to reveal a NEW patient review beneath.
 *
 * Timing: one flip fires every ~2.4s, round-robin across the 6 panels — so each
 * individual panel rests ~14s between flips. Composed + tasteful (slower than
 * the original 1.5s so it never strobes), styled in the brand's warm brown + teal.
 *
 * Accessibility / reduced motion:
 *  - prefers-reduced-motion → no 3D flip; the new review CROSSFADES in instead.
 *  - the board exposes an aria-live="polite" region announcing the freshly
 *    flipped review so AT users hear updates without the visual mechanics.
 *  - panels are decorative dials; each carries its review text as real content.
 *
 * Reviews are realistic SAMPLE content (marked sample beneath the board).
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { FigureTag, Reveal, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Review = { body: string; name: string; context: string };

/* A deeper pool than the 6 panels so flips keep revealing fresh quotes. */
const POOL: Review[] = [
  {
    body:
      "Dr. Darst caught a melanoma my previous dermatologist had watched for two years. He read the biopsy himself.",
    name: "R. M.",
    context: "Skin cancer screening",
  },
  {
    body:
      "He explained exactly what the pathology showed and why it mattered. I finally understood my own diagnosis.",
    name: "J. T.",
    context: "Complex rash",
  },
  {
    body:
      "Twenty years with the same physician. That continuity is rare now — and it shows in how well he knows my skin.",
    name: "P. K.",
    context: "Long-term patient",
  },
  {
    body:
      "Came in for a cosmetic consult and appreciated that he treated my skin health first. No upsell, just honesty.",
    name: "S. L.",
    context: "Cosmetic consult",
  },
  {
    body:
      "A spot three other clinics dismissed turned out to be a basal cell. He found it and removed it cleanly.",
    name: "D. W.",
    context: "Mohs referral",
  },
  {
    body:
      "Same-week answers because the doctor reads his own slides. No mailing it to a lab and waiting two weeks.",
    name: "A. C.",
    context: "Biopsy result",
  },
  {
    body:
      "Calm, precise, and unhurried. The first dermatologist who actually listened to my history before treating.",
    name: "M. H.",
    context: "Eczema",
  },
  {
    body:
      "My fillers look like me, not like work. He talked me out of the things I didn't need. I trust him completely.",
    name: "T. B.",
    context: "Injectables",
  },
  {
    body:
      "He treated my psoriasis as a medical condition, not a cosmetic one. Years of frustration finally addressed.",
    name: "G. P.",
    context: "Psoriasis",
  },
  {
    body:
      "Vein treatment with the same rigor as the rest of the practice. Clear plan, clear pricing, real result.",
    name: "L. F.",
    context: "Vein treatment",
  },
  {
    body:
      "Board-certified in dermatopathology — I didn't know that mattered until he caught what a lab might've missed.",
    name: "N. R.",
    context: "Lesion diagnosis",
  },
  {
    body:
      "Front desk to follow-up, everything is straightforward. The expertise is the headline; the care is the proof.",
    name: "E. V.",
    context: "Annual skin check",
  },
  {
    body:
      "My skin looks years calmer after the laser series — even tone, never overdone. He matched the plan to my skin, not a menu.",
    name: "C. A.",
    context: "Laser resurfacing",
  },
  {
    body:
      "I left the peel consult genuinely confident, not sold to. The result was subtle and exactly what I hoped for.",
    name: "K. D.",
    context: "Chemical peel",
  },
];

const PANELS = 6;
// One flip every ~2.4s, round-robin → each panel rests ~14.4s before its next
// flip. Slower than the old 1.5s so the board reads composed and mechanical,
// never strobing/busy.
const FLIP_INTERVAL_MS = 2400;

function initials(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
}

/* A single split-flap panel. `review` is the CURRENT review; when it changes we
   animate the old top leaf dropping (or crossfade under reduced motion). */
function FlapPanel({
  review,
  reduced,
}: {
  review: Review;
  reduced: boolean;
}) {
  const [prev, setPrev] = useState(review);
  const [flipKey, setFlipKey] = useState(0);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      setPrev(review);
      return;
    }
    // Trigger a flip: keep `prev` as the dropping leaf, bump the animation key.
    setFlipKey((k) => k + 1);
    const old = review;
    const t = setTimeout(() => setPrev(old), reduced ? 520 : 440);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review.body]);

  return (
    <figure
      className={cn(
        // aspect-[3/4] (relaxed from the tall-narrow 4:5) + a min-height floor
        // so the longest quotes seat above the 3-line caption without clipping
        // the seam/bottom under overflow-hidden — at 375px and the lg 6-col width.
        "flap-panel relative aspect-[3/4] min-h-[15rem] overflow-hidden rounded-xl border",
        "border-[oklch(40%_0.05_60_/_0.6)] bg-[var(--night-1)] text-[oklch(95%_0.014_72)]",
      )}
    >
      {/* The resolved (new) face — split into top + bottom by the seam. */}
      <PanelFace review={review} />

      {/* The dropping OLD top leaf overlay (flip) — covers the top half, then
          rotates down off its bottom hinge to reveal the new top beneath. */}
      {!reduced && flipKey > 0 && (
        <div
          key={flipKey}
          aria-hidden
          className="flap-leaf flap-top-anim absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-xl bg-[var(--night-1)]"
          style={{ zIndex: 6 }}
        >
          <div className="absolute inset-x-0 top-0 h-[200%]">
            <PanelText review={prev} />
          </div>
          {/* subtle gradient on the leaf for a mechanical sheen */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[oklch(100%_0_0_/_0.06)] to-[oklch(0%_0_0_/_0.18)]" />
        </div>
      )}

      {/* Reduced-motion: crossfade the new face in. */}
      {reduced && flipKey > 0 && (
        <div
          key={flipKey}
          className="flap-crossfade absolute inset-0"
          aria-hidden
        >
          <PanelFace review={review} />
        </div>
      )}

      {/* The mechanical center seam. */}
      <span aria-hidden className="flap-seam" />
    </figure>
  );
}

/* The full panel content laid out so the top and bottom halves meet at the
   seam — text sits across the whole panel, the caption pinned to the bottom. */
function PanelFace({ review }: { review: Review }) {
  return (
    <div className="absolute inset-0">
      <PanelText review={review} />
    </div>
  );
}

function PanelText({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col p-4">
      <span
        aria-hidden
        className="font-display text-2xl leading-none text-[var(--color-accent-bright)]"
      >
        &ldquo;
      </span>
      <blockquote className="flap-clamp mt-1 flex-1 text-pretty text-[0.82rem] leading-snug text-[oklch(94%_0.014_72)]">
        {review.body}
      </blockquote>
      <figcaption className="mt-3 flex items-center gap-2 border-t border-[oklch(70%_0.04_64_/_0.18)] pt-3">
        <span
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[oklch(40%_0.06_196_/_0.55)] text-[0.62rem] font-semibold text-[oklch(96%_0.014_72)] tnum"
        >
          {initials(review.name)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[0.72rem] font-semibold text-[oklch(96%_0.014_72)]">
            {review.name}
          </span>
          <span className="truncate text-[0.62rem] text-[oklch(84%_0.025_70_/_0.7)]">
            {review.context}
          </span>
        </span>
      </figcaption>
    </div>
  );
}

/* Five stars with a fractional fill (4.9 → last star ~90% gold) — the aggregate
   review-rating glyph, in the brand's warm-gold register. Decorative; the real
   value is announced in adjacent text + the aria-label here. */
function Stars({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className="relative inline-block leading-none"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {/* empty track */}
      <span aria-hidden className="flex text-[1.05rem] text-[var(--color-border)]">
        {"★★★★★"}
      </span>
      {/* gold fill clipped to the percentage */}
      <span
        aria-hidden
        className="absolute inset-0 flex overflow-hidden text-[1.05rem] text-[var(--color-warning)]"
        style={{ width: `${pct}%` }}
      >
        {"★★★★★"}
      </span>
    </span>
  );
}

/* A small Google "G" mark (brand colors), so the aggregate reads as a Google
   rating at a glance. Inline SVG — no external asset, static-export-safe. */
function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.26-2.09 3.56-5.17 3.56-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.3v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.21 7.21 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.38l3.97-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.3 6.62l3.97 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function SplitFlapBoard() {
  const prefersReduced = useReducedMotion();
  const reduced = !!prefersReduced;

  // Each panel's current index into POOL. Start staggered so the board reads
  // full and varied from the first paint.
  const [indices, setIndices] = useState<number[]>(() =>
    Array.from({ length: PANELS }, (_, i) => i % POOL.length),
  );
  const tick = useRef(0);
  const [live, setLive] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      const panel = tick.current % PANELS;
      tick.current += 1;
      setIndices((prev) => {
        const next = prev.slice();
        // Advance this panel past every value currently shown to avoid a
        // visible duplicate on the board.
        let candidate = (prev[panel] + PANELS) % POOL.length;
        let guard = 0;
        while (
          next.some((v, i) => i !== panel && v === candidate) &&
          guard < POOL.length
        ) {
          candidate = (candidate + 1) % POOL.length;
          guard += 1;
        }
        next[panel] = candidate;
        const r = POOL[candidate];
        setLive(`New review: ${r.body} — ${r.name}, ${r.context}`);
        return next;
      });
    }, FLIP_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="bg-[var(--color-bg)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <FigureTag
          n="06"
          label="Patient record, rotating"
          className="mb-6 justify-end"
        />
        <SectionHeading
          eyebrow="In patients' words"
          title={
            <>
              The reviews that matter speak to{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">
                diagnoses, not décor.
              </span>
            </>
          }
          lead="Not a star average — the proof behind the credential: patient voices curated to the outcomes that matter, catches made early, conditions finally explained, decades of continuity."
        />

        {/* Live-reviews aggregate — the visible face of the Growth-OS reputation
            module. A Google-flavored rating bar ties the board to real local
            credibility, then the rotating board IS the live wall beneath it.
            Aggregate figures are representative samples (marked below). */}
        <Reveal className="mt-10 sm:mt-12">
          <div className="flex flex-col items-start gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-5 shadow-[0_18px_50px_-34px_oklch(30%_0.05_58_/_0.4)] sm:flex-row sm:items-center sm:gap-7 sm:px-7 sm:py-6">
            {/* the rating lockup */}
            <div className="flex items-center gap-4">
              <span className="font-display text-5xl leading-none text-[var(--color-fg)] tnum">
                4.9
              </span>
              <span className="flex flex-col">
                <Stars value={4.9} />
                <span className="mt-1.5 flex items-center gap-1.5 text-[0.82rem] text-[var(--color-fg-muted)]">
                  <GoogleG />
                  <span>
                    <span className="font-semibold text-[var(--color-fg)] tnum">
                      210+
                    </span>{" "}
                    Google reviews
                  </span>
                </span>
              </span>
            </div>

            {/* a quiet divider on wider viewports */}
            <span
              aria-hidden
              className="hidden h-12 w-px bg-[var(--color-border)] sm:block"
            />

            {/* the credibility line */}
            <p className="max-w-[40ch] text-[0.92rem] leading-relaxed text-[var(--color-fg-muted)]">
              Among the{" "}
              <span className="font-medium text-[var(--color-fg)]">
                top-rated dermatology practices in the Charlotte &amp; Monroe
                area
              </span>{" "}
              — a reputation earned one careful diagnosis at a time. New patient
              voices flow onto the board below as they arrive.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-7 sm:mt-9">
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
            role="group"
            aria-label="Rotating patient reviews"
          >
            {indices.map((idx, i) => (
              <FlapPanel key={i} review={POOL[idx]} reduced={reduced} />
            ))}
          </div>

          {/* Announce flips for assistive tech without the visual mechanics. */}
          <p className="sr-only" aria-live="polite">
            {live}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--color-fg-subtle)]">
            Rating and reviews are representative samples for this mockup. In a
            live build the aggregate and the rotating quotes sync from the
            practice&rsquo;s verified Google profile — curated to lead with
            clinical outcomes rather than a single score.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
