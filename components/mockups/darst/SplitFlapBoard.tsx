"use client";

/**
 * SplitFlapBoard — the "Solari" split-flap review board. A row of SIX panels
 * styled like an old mechanical departure board / manual scoreboard. Each panel
 * has a horizontal center SEAM; on refresh its TOP LEAF mechanically drops
 * (CSS 3D `rotateX` on a bottom hinge) to reveal a NEW patient review beneath.
 *
 * Timing (per brief): one flip fires every 1.5s, round-robin across the 6
 * panels — so each individual panel refreshes every 9s. Continuous + tasteful,
 * styled in the brand's warm brown + teal.
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
import { Reveal, SectionHeading } from "./primitives";
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
];

const PANELS = 6;
const FLIP_INTERVAL_MS = 1500; // one flip every 1.5s, round-robin

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
        "flap-panel relative aspect-[4/5] overflow-hidden rounded-xl border",
        "border-[oklch(40%_0.05_60_/_0.6)] bg-[var(--night-1)] text-[oklch(95%_0.014_72)]",
        "shadow-[0_18px_44px_-26px_oklch(15%_0.03_54_/_0.8),inset_0_1px_0_oklch(80%_0.04_64_/_0.12)]",
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
      <blockquote className="mt-1 flex-1 text-pretty text-[0.82rem] leading-snug text-[oklch(94%_0.014_72)]">
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
          lead="A live board of patient voices — curated to lead with clinical outcomes: catches made early, conditions finally explained, decades of continuity."
        />

        <Reveal className="mt-14 sm:mt-16">
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
            Reviews are representative samples for this mockup. The board flips a
            new quote every 1.5 seconds; verified patient reviews would rotate
            here, curated to lead with clinical outcomes rather than a single
            aggregate score.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
