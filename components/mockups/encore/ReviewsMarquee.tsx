"use client";

/**
 * ReviewsMarquee — the reviews wall (mirrors happy-clinic/ReviewsMarquee.tsx).
 * A CONTINUOUS HORIZONTAL MARQUEE of FULL 5-star reviews:
 *  - the track holds the full set TWICE and translates -50% in one seamless
 *    loop (.en-marquee in brand.css), so the rail scrolls forever, no seam;
 *  - PAUSES on hover / focus-within so a reader can finish a card;
 *  - each card shows the WHOLE review (no clipping), five teal stars, the
 *    reviewer's initial avatar + name + treatment;
 *  - prefers-reduced-motion → the loop stops and the rail becomes a normal
 *    swipeable, snapping strip, and the duplicate is removed from layout;
 *  - the duplicated half is aria-hidden so AT announces each review once.
 *
 * Above: the aggregate "4.8 ★ · Google" band + a local-credibility line.
 * Beneath: the honest representative-sample note. Reviews are realistic SAMPLE
 * content, clearly marked. Brand: white paper, teal + ink.
 */

import { Reveal, SectionHeading } from "./primitives";

type Review = { body: string; name: string; treatment: string };

const REVIEWS: Review[] = [
  {
    body:
      "Dr. Londeree did a thorough full-body check and caught a spot two other dermatologists had waved off. Calm, unhurried, genuinely expert — I trust her completely and won't go anywhere else.",
    name: "Marisa K.",
    treatment: "Medical · Skin exam",
  },
  {
    body:
      "My Sciton Halo results are honestly unreal — my skin hasn't looked this even in years. The Spa side feels like a real spa, not a clinic pushing packages. The whole team is lovely.",
    name: "Jenna P.",
    treatment: "The Spa · Halo laser",
  },
  {
    body:
      "You can tell she actually teaches this. She explained everything, never rushed, and answered every question. Easily the best dermatologist I've seen in Columbus.",
    name: "Sofia L.",
    treatment: "Medical · Consult",
  },
  {
    body:
      "Natural-looking Botox and zero pressure. They walked me through everything and even explained membership pricing without any upsell. I finally feel like myself again.",
    name: "David W.",
    treatment: "The Spa · Botox",
  },
  {
    body:
      "Booked online, seen the same week, and out the door with a clear plan. Front desk was warm, the office is beautiful, and the care was top-notch from start to finish.",
    name: "Alyssa C.",
    treatment: "Medical · New patient",
  },
  {
    body:
      "The RF microneedling made a real difference to my pores and texture, and they set honest expectations the whole way. It's rare to find medical credibility and a true spa feel in one place.",
    name: "Renee M.",
    treatment: "The Spa · Microneedling",
  },
  {
    body:
      "My CoolSculpting was physician-directed and exactly as described — no gimmicks, just a careful plan. I appreciated that a doctor was involved every step.",
    name: "Tara B.",
    treatment: "The Spa · CoolSculpting",
  },
  {
    body:
      "She treated my daughter's acne with so much patience and a regimen that actually worked. We've since sent half the neighborhood here. Truly the standard you hope for.",
    name: "Grace P.",
    treatment: "Medical · Acne",
  },
  {
    body:
      "Conservative, tasteful filler — balanced and soft, never overdone. People keep saying I look rested. That's exactly what I wanted, and exactly what I got.",
    name: "Hannah W.",
    treatment: "The Spa · Juvéderm",
  },
  {
    body:
      "Professional, friendly, and incredibly thorough. The whole experience — from the booking to the follow-up — felt considered. This is how a dermatology practice should run.",
    name: "Lauren F.",
    treatment: "Medical · Full-body exam",
  },
];

const AGGREGATE = { rating: "4.8", count: "400+", source: "Google" } as const;

function initials(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase();
}

function Stars({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{ display: "inline-flex", gap: "0.125rem", color: "var(--clinical)" }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M12 2.4l2.86 5.8 6.4.93-4.63 4.52 1.1 6.38L12 17.5l-5.73 3.01 1.1-6.38L2.74 9.6l6.4-.93z" />
        </svg>
      ))}
    </span>
  );
}

/* A small, brand-tinted Google "G" glyph — recognizable without the trademarked
   four-color logo. */
function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M21.6 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.23c1.89-1.74 2.97-4.3 2.97-7.17Z" fill="var(--clinical)" />
      <path d="M12 22c2.7 0 4.96-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z" fill="var(--clinical-deep)" />
      <path d="M6.41 13.91a5.99 5.99 0 0 1 0-3.82V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.58Z" fill="var(--leaf)" />
      <path d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2A10 10 0 0 0 3.07 7.51l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98Z" fill="var(--leaf-deep)" />
    </svg>
  );
}

function RatingHeader() {
  return (
    <Reveal className="mt-10 sm:mt-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-6 text-center shadow-[0_24px_60px_-44px_oklch(46%_0.06_205_/_0.5)] sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
        <div className="flex items-center gap-3">
          <span className="font-display text-5xl leading-none text-[var(--clinical-deep)]">
            {AGGREGATE.rating}
          </span>
          <span className="flex flex-col items-start">
            <Stars />
            <span className="mt-1 text-xs font-medium text-[var(--color-fg-subtle)]">
              <span className="font-semibold text-[var(--color-fg)] [font-variant-numeric:tabular-nums]">
                {AGGREGATE.count}
              </span>{" "}
              reviews
            </span>
          </span>
        </div>

        <span aria-hidden className="hidden h-12 w-px bg-[var(--color-border)] sm:block" />

        <div className="max-w-xs">
          <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[var(--color-fg)] sm:justify-start">
            <GoogleGlyph className="h-4 w-4" />
            Rated {AGGREGATE.rating} on {AGGREGATE.source}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-fg-subtle)]">
            Among the most-reviewed dermatology practices in NW Columbus — the
            standing that puts a practice at the top for{" "}
            <span className="font-medium text-[var(--clinical-deep)]">
              &ldquo;dermatologist near me.&rdquo;
            </span>
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function ReviewCard({ r, ariaHidden = false }: { r: Review; ariaHidden?: boolean }) {
  return (
    <figure
      aria-hidden={ariaHidden || undefined}
      className="en-review-card mx-2.5 flex w-[78vw] max-w-[23rem] shrink-0 snap-center flex-col rounded-3xl p-6 sm:mx-3 sm:w-[23rem] sm:p-7"
    >
      <Stars className="shrink-0" />
      <blockquote className="mt-4 flex-1 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-fg)]">
        &ldquo;{r.body}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-sm font-semibold text-[var(--clinical-deep)] [font-variant-numeric:tabular-nums]"
        >
          {initials(r.name)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-semibold text-[var(--color-fg)]">{r.name}</span>
          <span className="text-xs text-[var(--color-fg-subtle)]">{r.treatment}</span>
        </span>
        <GoogleGlyph className="ml-auto h-4 w-4 shrink-0 opacity-80" />
      </figcaption>
    </figure>
  );
}

export function ReviewsMarquee() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative scroll-mt-20 overflow-hidden border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] py-24 sm:py-32"
    >
      {/* soft teal aura top-right, sage low-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(50% 44% at 88% 2%, var(--color-accent-subtle), transparent 70%), radial-gradient(46% 42% at 5% 102%, oklch(94% 0.03 158 / 0.6), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Patient reviews"
          title={
            <span id="reviews-title">
              A wall of Columbus voices, all saying the same thing:{" "}
              <span className="display-em text-[var(--clinical-deep)]">
                careful, expert, never rushed.
              </span>
            </span>
          }
          lede="Real reviews, flowing past in full — curated to lead with what Encore is known for: academic-level dermatology and a genuine spa calm, under one roof."
        />

        <RatingHeader />
      </div>

      {/* The marquee — full-bleed beyond the prose column. */}
      <Reveal className="relative mt-14 sm:mt-16">
        <div className="en-marquee" aria-label="Patient reviews (auto-scrolling)">
          <ul className="en-marquee__track items-stretch">
            {REVIEWS.map((r) => (
              <li key={r.name} className="flex">
                <ReviewCard r={r} />
              </li>
            ))}
            {REVIEWS.map((r) => (
              <li key={`dup-${r.name}`} className="en-marquee__dup flex" aria-hidden>
                <ReviewCard r={r} ariaHidden />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal delay={0.05}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[var(--color-fg-subtle)]">
            Rating, review count and quotes are representative samples for this
            mockup. On launch, verified Google reviews would sync and flow
            through this rail — curated to lead with Encore&rsquo;s strengths.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
