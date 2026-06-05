"use client";

/**
 * SplitFlapBoard — the "Solari" split-flap review board. A row of SIX panels
 * styled like an old mechanical departure board / manual scoreboard. Each panel
 * has a horizontal center SEAM; on refresh its TOP LEAF mechanically drops
 * (CSS 3D `rotateX` on a bottom hinge) to reveal a NEW patient review beneath.
 *
 * Ported from the Darst gold-standard and re-scoped to the Happy Clinic Denver
 * brand — navy panels with pine-teal + pale-yellow accents, medspa reviews.
 *
 * Timing (per brief): one flip fires every 1.5s, round-robin across the 6
 * panels — so each individual panel refreshes every 9s. Continuous + tasteful.
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
      "Dr. Phil's Botox is so natural my friends just kept asking if I'd been on vacation. Nobody could tell I'd had anything done.",
    name: "M. K.",
    context: "Botox · forehead",
  },
  {
    body:
      "I was terrified of looking frozen. He used less than I expected and the result is just… me, refreshed. Exactly the subtle WOW.",
    name: "J. P.",
    context: "Dysport · glabella",
  },
  {
    body:
      "Twenty-five years of experience really shows. My cheek filler looks completely natural — balanced, never overdone.",
    name: "S. L.",
    context: "Juvéderm · cheeks",
  },
  {
    body:
      "Dr. Phil talked me out of filler I didn't need and did a tiny touch of Botox instead. Honest, and the result speaks for itself.",
    name: "D. W.",
    context: "Botox · consult",
  },
  {
    body:
      "Best lip filler I've ever had. Soft, in proportion, not a hint of duck. He has a real artist's eye for what's enough.",
    name: "A. C.",
    context: "Lip filler",
  },
  {
    body:
      "The whole team is warm and the clinic feels like a real medical practice. My Dysport lasted longer here than anywhere else.",
    name: "R. M.",
    context: "Dysport",
  },
  {
    body:
      "I came in for one line and left understanding my whole face. No pressure, no upsell — just expertise and a natural result.",
    name: "T. B.",
    context: "Botox · crow's feet",
  },
  {
    body:
      "Subtle is exactly right. My jawline filler restored a youthfulness I'd lost without changing who I look like at all.",
    name: "G. P.",
    context: "Jawline filler",
  },
  {
    body:
      "Physician-administered start to finish. I felt safe, informed, and genuinely cared for — and the Botox is flawless.",
    name: "H. W.",
    context: "Botox",
  },
  {
    body:
      "I send my own friends to Dr. Phil now. When someone's been injecting for decades, the difference in finesse is obvious.",
    name: "L. F.",
    context: "Filler & Botox",
  },
  {
    body:
      "Natural, never frozen — you can tell the person holding the needle actually understands faces. Worth every minute.",
    name: "N. R.",
    context: "Botox · forehead",
  },
  {
    body:
      "From check-in to follow-up, everything is easy. The results are quietly remarkable. This is the subtle WOW they promise.",
    name: "E. V.",
    context: "Juvéderm",
  },
];

const PANELS = 6;
const FLIP_INTERVAL_MS = 1500; // one flip every 1.5s, round-robin

/* ONE anchored, fully-legible, NAMED testimonial that pairs with the kinetic
   board: the skeptical buyer needs a single quote she can actually finish
   reading (the flipping panels clamp to 6 lines, initials-only, and refresh
   every 1.5s — a spectacle, but a poor reading surface). Copy is drawn from the
   same representative POOL, given a fuller first name + result tag. */
const HERO_QUOTE = {
  body:
    "I was terrified of looking frozen. Dr. Phil used less than I expected and the result is just… me, refreshed. Nobody can tell I’ve had anything done — exactly the subtle WOW.",
  name: "Marisa K.",
  context: "Botox · forehead",
} as const;

function initials(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
}

/* The static hero pull-quote — a larger serif treatment, NOT flipping, so the
   highest-dwell proof surface is the most legible thing in the section. */
function HeroQuote() {
  return (
    <figure className="mx-auto max-w-3xl text-center">
      <span
        aria-hidden
        className="font-display block text-5xl leading-none text-[var(--color-accent-deep)]"
      >
        &ldquo;
      </span>
      <blockquote className="font-display mt-2 text-pretty text-2xl italic leading-snug text-[var(--color-fg)] sm:text-3xl">
        {HERO_QUOTE.body}
      </blockquote>
      <figcaption className="mt-6 flex items-center justify-center gap-3">
        <span
          aria-hidden
          className="flex items-center gap-0.5 text-[var(--color-accent)]"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M12 2.4l2.86 5.8 6.4.93-4.63 4.52 1.1 6.38L12 17.5l-5.73 3.01 1.1-6.38L2.74 9.6l6.4-.93z" />
            </svg>
          ))}
        </span>
        <span className="text-sm font-semibold text-[var(--color-fg)]">
          {HERO_QUOTE.name}
        </span>
        <span aria-hidden className="text-[var(--color-fg-subtle)]">·</span>
        <span className="text-sm text-[var(--color-fg-muted)]">
          {HERO_QUOTE.context}
        </span>
      </figcaption>
    </figure>
  );
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
        "border-[oklch(50%_0.06_252_/_0.6)] bg-[var(--night-1)] text-[oklch(96%_0.01_220)]",
        "shadow-[0_18px_44px_-26px_oklch(12%_0.04_252_/_0.85),inset_0_1px_0_oklch(80%_0.04_220_/_0.12)]",
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
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[oklch(100%_0_0_/_0.06)] to-[oklch(0%_0_0_/_0.2)]" />
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
        className="font-display text-3xl leading-none text-[var(--color-accent-bright)]"
      >
        &ldquo;
      </span>
      <blockquote
        className="mt-1 flex-1 overflow-hidden text-pretty text-[0.82rem] leading-snug text-[oklch(95%_0.01_220)]"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 6,
        }}
      >
        {review.body}
      </blockquote>
      <figcaption className="mt-3 flex items-center gap-2 border-t border-[oklch(70%_0.04_220_/_0.18)] pt-3">
        <span
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[oklch(52%_0.087_178_/_0.6)] text-[0.62rem] font-semibold text-[oklch(98%_0.01_220)] tnum"
        >
          {initials(review.name)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[0.72rem] font-semibold text-[oklch(97%_0.01_220)]">
            {review.name}
          </span>
          <span className="truncate text-[0.62rem] text-[oklch(85%_0.02_220_/_0.7)]">
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
              <span className="font-display-em text-[var(--color-fg)]">
                natural, never overdone.
              </span>
            </>
          }
          lead="One patient in her own words — beside a live wall of voices, curated to lead with what Happy Clinic is known for: subtle, physician-administered results that look like you, only refreshed."
        />

        {/* The anchored, legible quote first — substance — then the kinetic
            board beneath as the "wall of voices" spectacle. */}
        <Reveal className="mt-12 sm:mt-14">
          <HeroQuote />
        </Reveal>

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
            here, curated to lead with natural, subtle results.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
