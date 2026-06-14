"use client";

/**
 * ReviewsMarquee — the reviews surface, rebuilt. SCRAPS the SplitFlapBoard
 * (whose clamped panels cut every quote off mid-sentence) and replaces it with
 * a CONTINUOUS HORIZONTAL MARQUEE of FULL 5-star reviews — modeled on hanami's
 * AwardsRail mechanic (.hc-marquee in brand.css):
 *
 *  - the track holds the full review set TWICE and translates -50% in one
 *    seamless loop, so the rail scrolls forever with no visible seam,
 *  - PAUSES on hover / focus-within (so a reader can actually finish a card),
 *  - each card shows the WHOLE review text (no clipping), five gold/teal stars,
 *    the reviewer's initial avatar + name + treatment,
 *  - prefers-reduced-motion → the loop stops and the rail becomes a normal
 *    horizontally-scrollable, swipeable, snapping strip (CSS in brand.css), and
 *    the seamless-loop duplicate is removed from layout so each review shows once,
 *  - the duplicated half is aria-hidden so assistive tech announces each review
 *    exactly once.
 *
 * Above the rail: the aggregate "4.9 ★ · Google" reputation band + a local-rank
 * credibility line. Beneath: the honest representative-sample note.
 *
 * Reviews are realistic SAMPLE content (marked sample beneath the rail).
 * Brand: navy field, pine-teal + pale-yellow accents.
 */

import { Reveal, SectionHeading } from "./primitives";

type Review = { body: string; name: string; treatment: string };

/* A dozen FULL reviews — each shown complete, never clamped. */
const REVIEWS: Review[] = [
  {
    body:
      "Dr. Phil's Botox is so natural my friends just kept asking if I'd been on vacation. Nobody could tell I'd had anything done — it's exactly the subtle refresh I wanted, and I'll never go anywhere else.",
    name: "Marisa K.",
    treatment: "Botox · Forehead",
  },
  {
    body:
      "I was terrified of looking frozen. He used less than I expected and the result is just… me, refreshed. The whole consult was honest and unhurried — that's the subtle WOW they promise.",
    name: "Jenna P.",
    treatment: "Dysport · Glabella",
  },
  {
    body:
      "Twenty-five years of experience really shows. My cheek filler looks completely natural — balanced and soft, never overdone. People say I look rested, not 'done.' That's the whole point.",
    name: "Sofia L.",
    treatment: "Juvéderm · Cheeks",
  },
  {
    body:
      "Dr. Phil talked me OUT of filler I didn't need and did a tiny touch of Botox instead. Who does that? An honest physician with an artist's eye — and the result speaks for itself.",
    name: "David W.",
    treatment: "Botox · Consult",
  },
  {
    body:
      "Best lip filler I've ever had. Soft, in proportion, not a hint of duck. He understood exactly what 'just a little' meant and delivered. I finally found my injector for life.",
    name: "Alyssa C.",
    treatment: "Lip Filler",
  },
  {
    body:
      "The whole team is warm and the clinic feels like a real medical practice, not a spa pushing packages. My Dysport lasted noticeably longer here than anywhere else I've been.",
    name: "Renee M.",
    treatment: "Dysport",
  },
  {
    body:
      "I came in for one line and left understanding my whole face. No pressure, no upsell — just genuine expertise and a result so natural my own sister couldn't tell what I'd had done.",
    name: "Tara B.",
    treatment: "Botox · Crow's feet",
  },
  {
    body:
      "Subtle is exactly right. My jawline filler restored a youthfulness I'd lost without changing who I look like at all. Physician-administered start to finish — I felt safe the entire time.",
    name: "Grace P.",
    treatment: "Jawline Filler",
  },
  {
    body:
      "Physician-administered, every step. I felt informed and genuinely cared for, and the Botox is flawless — movement where I want it, calm where I don't. Worth every single minute.",
    name: "Hannah W.",
    treatment: "Botox",
  },
  {
    body:
      "I send my own friends to Dr. Phil now. When someone's been injecting for decades, the difference in finesse is obvious the moment you look in the mirror. Natural, never frozen.",
    name: "Lauren F.",
    treatment: "Filler & Botox",
  },
];

/* Aggregate-rating band — the visible face of the "reputation" module. */
const AGGREGATE = { rating: "4.9", count: "300+", source: "Google" } as const;

function initials(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase();
}

function Stars({
  tone = "gold",
  className,
}: {
  tone?: "gold" | "teal";
  className?: string;
}) {
  const color =
    tone === "gold" ? "var(--color-gold)" : "var(--color-accent-bright)";
  return (
    <span
      aria-hidden
      className={className}
      style={{ display: "inline-flex", gap: "0.125rem", color }}
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
      <path d="M21.6 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.23c1.89-1.74 2.97-4.3 2.97-7.17Z" fill="var(--color-accent-bright)" />
      <path d="M12 22c2.7 0 4.96-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z" fill="var(--color-accent)" />
      <path d="M6.41 13.91a5.99 5.99 0 0 1 0-3.82V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.58Z" fill="var(--aurora-cyan)" />
      <path d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2A10 10 0 0 0 3.07 7.51l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98Z" fill="var(--color-gold-deep)" />
    </svg>
  );
}

function RatingHeader() {
  return (
    <Reveal className="mt-10 sm:mt-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[1.25rem] border border-white/12 bg-white/[0.04] px-6 py-6 text-center shadow-[0_24px_60px_-40px_oklch(10%_0.04_252_/_0.8)] backdrop-blur-sm sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
        {/* Big aggregate score */}
        <div className="flex items-center gap-3">
          <span className="font-display text-5xl leading-none text-[var(--color-gold)]">
            {AGGREGATE.rating}
          </span>
          <span className="flex flex-col items-start">
            <Stars tone="gold" />
            <span className="mt-1 text-xs font-medium text-white/65">
              <span className="tnum font-semibold text-white">
                {AGGREGATE.count}
              </span>{" "}
              reviews
            </span>
          </span>
        </div>

        {/* divider */}
        <span aria-hidden className="hidden h-12 w-px bg-white/15 sm:block" />

        {/* Source + local-ranking credibility line */}
        <div className="max-w-xs">
          <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white sm:justify-start">
            <GoogleGlyph className="h-4 w-4" />
            Rated {AGGREGATE.rating} on {AGGREGATE.source}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/65">
            Among Denver&rsquo;s most-reviewed injectors — the kind of standing
            that puts a practice at the top of the map for{" "}
            <span className="font-medium text-[var(--color-accent-bright)]">
              &ldquo;Botox near me.&rdquo;
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
      className="hc-review-card flex w-[78vw] max-w-[24rem] shrink-0 snap-center flex-col rounded-3xl p-6 sm:w-[24rem] sm:p-7"
    >
      <Stars tone="gold" className="shrink-0" />
      {/* The WHOLE review — no clamp, no clip. */}
      <blockquote className="mt-4 flex-1 text-pretty text-[0.95rem] leading-relaxed text-white/90">
        &ldquo;{r.body}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-white/12 pt-5">
        <span
          aria-hidden
          className="tnum grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-accent)]/70 text-sm font-semibold text-[var(--color-accent-fg)]"
        >
          {initials(r.name)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-semibold text-white">{r.name}</span>
          <span className="text-xs text-white/60">{r.treatment}</span>
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
      data-sky-window
      aria-labelledby="reviews-title"
      // Reuse the same sky-window veil as Results so the rail rides the living
      // navy night sky (translucent when the aurora is live, opaque otherwise).
      className="hc-sky--results relative scroll-mt-20 overflow-hidden py-24 sm:py-32"
    >
      {/* aurora aura — teal high-right, soft pale-yellow low-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(55% 46% at 88% 4%, var(--aurora-teal), transparent 70%), radial-gradient(50% 46% at 6% 102%, var(--aurora-gold), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          invert
          eyebrow="Patient reviews"
          title={
            <span id="reviews-title">
              A wall of voices, all saying the same thing:{" "}
              <span className="font-display-em text-[var(--color-accent-bright)]">
                natural, never overdone.
              </span>
            </span>
          }
          lead="Real Google reviews, flowing past in full — curated to lead with what Happy Clinic is known for: subtle, physician-administered results that look like you, only refreshed."
        />

        <RatingHeader />
      </div>

      {/* The marquee — full-bleed beyond the prose column so the rail reads as a
          continuous river of reviews. Masked edges; pauses on hover/focus. */}
      <Reveal className="relative mt-14 sm:mt-16">
        <div className="hc-marquee" aria-label="Patient reviews (auto-scrolling)">
          <ul className="hc-marquee__track items-stretch gap-5 px-5 sm:gap-6 sm:px-6">
            {REVIEWS.map((r) => (
              <li key={r.name} className="flex">
                <ReviewCard r={r} />
              </li>
            ))}
            {/* Seamless-loop duplicate — aria-hidden, removed from layout under
                reduced-motion so the static swipe strip shows each review once. */}
            {REVIEWS.map((r) => (
              <li key={`dup-${r.name}`} className="hc-marquee__dup flex" aria-hidden>
                <ReviewCard r={r} ariaHidden />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal delay={0.05}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-white/55">
            Rating, review count and quotes are representative samples for this
            mockup. In the live Growth&nbsp;OS, verified Google reviews would
            sync and flow through this rail — curated to lead with natural,
            subtle results.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
