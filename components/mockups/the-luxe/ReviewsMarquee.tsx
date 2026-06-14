"use client";

/**
 * ReviewsMarquee — the reviews surface: a CONTINUOUS HORIZONTAL MARQUEE of FULL
 * 5-star reviews (modeled on the gold reference happy-clinic/ReviewsMarquee):
 *
 *  - the track holds the full review set TWICE and translates -50% in one
 *    seamless loop (CSS `.luxe-marquee` in brand.css), so the rail scrolls
 *    forever with no visible seam,
 *  - PAUSES on hover / focus-within so a reader can finish a card,
 *  - each card shows the WHOLE review text (no clipping), five gold stars, the
 *    reviewer's initial avatar + name + treatment,
 *  - prefers-reduced-motion → the loop stops and the rail becomes a normal
 *    horizontally-scrollable, swipeable strip (CSS), and the duplicate is
 *    removed from layout so each review shows once,
 *  - the duplicated half is aria-hidden so assistive tech announces each review
 *    exactly once.
 *
 * Above the rail: the aggregate "4.9 ★ · Google" reputation band. Beneath: the
 * honest representative-sample note.
 *
 * Reviews are realistic SAMPLE content, clearly marked. Brand: warm cream field,
 * gold accents, espresso ink.
 */

import { Reveal, SectionHeading } from "./primitives";

type Review = { body: string; name: string; treatment: string };

/* A dozen FULL reviews — each shown complete, never clamped. Representative
   samples in The Luxe's warm, gracious voice (no specific clinical claims). */
const REVIEWS: Review[] = [
  {
    body:
      "From the moment I walked in, it felt like a true escape — warm, beautiful, calming. My provider listened, never rushed, and I left looking like a rested version of myself. Exactly what I hoped for.",
    name: "Allison R.",
    treatment: "Botox · Consultation",
  },
  {
    body:
      "I was nervous about my first treatment, but the team made me feel completely at ease. They explained everything, answered every question, and the results are so natural my friends just say I look 'refreshed.'",
    name: "Megan T.",
    treatment: "Dysport",
  },
  {
    body:
      "The Luxe is the only place I trust now. The space is gorgeous, the staff is genuinely kind, and they never push anything on you. I always leave feeling cared for — and looking like myself, only better.",
    name: "Priya N.",
    treatment: "Dermal Filler",
  },
  {
    body:
      "Hands down the best medical spa in Columbus. Everything is thoughtful and individualized — they actually design a plan around your face and your goals, not a one-size-fits-all menu. Five stars isn't enough.",
    name: "Jessica M.",
    treatment: "Morpheus8",
  },
  {
    body:
      "My skin has never looked this good. The whole experience feels elevated — from the front desk to the treatment room. They turned back the clock without ever making me look 'done.' I'm a client for life.",
    name: "Dana K.",
    treatment: "Custom Luxe Facial",
  },
  {
    body:
      "I've been to a few medspas in the area and none compare. It's luxurious without being intimidating, and the providers are clearly experts. I drive across town just to come here — worth every minute.",
    name: "Rachel S.",
    treatment: "BBL HERO",
  },
  {
    body:
      "Honestly the most relaxing, beautiful spa I've found in Upper Arlington. They take the time to understand what you want and the results speak for themselves. I always recommend them to my friends.",
    name: "Lauren B.",
    treatment: "Lip Flip",
  },
  {
    body:
      "Professional, warm, and so welcoming. I felt safe and informed the entire time, and the result is subtle and natural — exactly the 'turn back time' feeling without looking overdone. I couldn't be happier.",
    name: "Sofia C.",
    treatment: "Daxxify",
  },
  {
    body:
      "The medical weight loss program changed everything for me — supportive, science-backed, and never judgmental. The whole team genuinely roots for you. This place treats you like a person, not a number.",
    name: "Hannah W.",
    treatment: "Medical Weight Loss",
  },
  {
    body:
      "Every detail is considered, from the calming interiors to the way they walk you through your options. I never feel pressured, only cared for. My results look effortless — which is the whole point.",
    name: "Olivia P.",
    treatment: "MOXI Laser",
  },
];

const AGGREGATE = { rating: "4.9", count: "122+", source: "Google" } as const;

function initials(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase();
}

function Stars({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{ display: "inline-flex", gap: "0.125rem", color: "var(--gold)" }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M12 2.4l2.86 5.8 6.4.93-4.63 4.52 1.1 6.38L12 17.5l-5.73 3.01 1.1-6.38L2.74 9.6l6.4-.93z" />
        </svg>
      ))}
    </span>
  );
}

/* A tiny, brand-tinted Google "G" glyph — recognizable without the trademarked
   four-color logo. */
function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M21.6 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.23c1.89-1.74 2.97-4.3 2.97-7.17Z" fill="var(--gold-deep)" />
      <path d="M12 22c2.7 0 4.96-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z" fill="var(--gold)" />
      <path d="M6.41 13.91a5.99 5.99 0 0 1 0-3.82V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.58Z" fill="var(--greige-deep)" />
      <path d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2A10 10 0 0 0 3.07 7.51l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98Z" fill="var(--gold-bright)" />
    </svg>
  );
}

function RatingHeader() {
  return (
    <Reveal className="mt-10 sm:mt-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-6 text-center shadow-[0_24px_60px_-44px_oklch(50%_0.04_70_/_0.5)] sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
        <div className="flex items-center gap-3">
          <span className="font-display text-5xl leading-none text-[var(--gold-deep)]">
            {AGGREGATE.rating}
          </span>
          <span className="flex flex-col items-start">
            <Stars />
            <span className="mt-1 text-xs font-medium text-[var(--color-fg-muted)]">
              <span className="tnum font-semibold text-[var(--color-fg)]">
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
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-fg-muted)]">
            Among Upper Arlington&rsquo;s most-loved medical spas — the kind of
            reputation that earns a top spot for{" "}
            <span className="font-medium text-[var(--gold-deep)]">
              &ldquo;medspa near me.&rdquo;
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
      className="mx-3 flex w-[80vw] max-w-[23rem] shrink-0 flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_18px_50px_-40px_oklch(50%_0.04_70_/_0.6)] sm:w-[23rem] sm:p-7"
    >
      <Stars className="shrink-0" />
      <blockquote className="mt-4 flex-1 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-fg)]">
        &ldquo;{r.body}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-border-subtle)] pt-5">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-sm font-semibold text-[var(--gold-deep)]"
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
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      {/* soft peach + gold aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(50% 44% at 90% 2%, var(--peach), transparent 70%), radial-gradient(46% 44% at 4% 100%, var(--gold-pale), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Patient reviews"
          title={
            <span id="reviews-title">
              A wall of voices, all saying the same thing:{" "}
              <span className="gold-leaf italic">you, only refreshed.</span>
            </span>
          }
          lead="Real Google reviews, flowing past in full — leading with what The Luxe is known for: warm, individualized care and results that look effortlessly natural."
        />

        <RatingHeader />
      </div>

      {/* The marquee — full-bleed beyond the prose column. Masked edges; pauses
          on hover / focus. */}
      <Reveal className="relative mt-14 sm:mt-16">
        <div className="luxe-marquee" aria-label="Patient reviews (auto-scrolling)">
          <ul className="luxe-marquee__track items-stretch">
            {REVIEWS.map((r) => (
              <li key={r.name} className="flex">
                <ReviewCard r={r} />
              </li>
            ))}
            {/* Seamless-loop duplicate — aria-hidden, removed under reduced
                motion so the swipe strip shows each review once. */}
            {REVIEWS.map((r) => (
              <li key={`dup-${r.name}`} className="luxe-marquee__dup flex" aria-hidden>
                <ReviewCard r={r} ariaHidden />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="relative mx-auto max-w-3xl px-6 sm:px-8">
        <Reveal delay={0.05}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[var(--color-fg-subtle)]">
            Rating, review count and quotes are representative samples for this
            mockup. On launch, verified Google reviews would sync and flow
            through this rail.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
