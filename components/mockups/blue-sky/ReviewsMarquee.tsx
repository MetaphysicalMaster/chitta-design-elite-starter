"use client";

/**
 * ReviewsMarquee — the reviews surface. A CONTINUOUS HORIZONTAL MARQUEE of FULL
 * 5-star reviews (.bs-marquee in brand.css):
 *
 *  - the track holds the full review set TWICE and translates -50% in one
 *    seamless loop, so the rail scrolls forever with no visible seam,
 *  - PAUSES on hover / focus-within (so a reader can finish a card),
 *  - each card shows the WHOLE review text (no clipping), five champagne stars,
 *    the reviewer's initial avatar + name + treatment,
 *  - prefers-reduced-motion → the loop stops and the rail becomes a normal
 *    horizontally-scrollable, swipeable, snapping strip, and the seamless-loop
 *    duplicate is removed from layout so each review shows once,
 *  - the duplicated half is aria-hidden so assistive tech announces each review
 *    exactly once.
 *
 * Above the rail: the aggregate "5.0 ★ · Google" reputation band. Beneath: the
 * honest representative-sample note. Reviews are realistic SAMPLE content.
 * Brand: airy light field, sky-blue + champagne accents.
 */

import { useEffect, useRef } from "react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { CloudDivider } from "./CloudDivider";

type Review = { body: string; name: string; treatment: string };

const REVIEWS: Review[] = [
  {
    body:
      "Quite the little hidden gem. The provider actually listened — I wanted to look refreshed, not done, and that's exactly what I got. The whole place feels calm and genuinely medical.",
    name: "Allison R.",
    treatment: "Botox & filler",
  },
  {
    body:
      "Knowing a Medical Doctor oversees everything made all the difference. They go above and beyond on both the beauty and the wellness side, and the space is so relaxing I never want to leave.",
    name: "Megan T.",
    treatment: "Microneedling + PRP",
  },
  {
    body:
      "I've been to the bigger chains and nothing compares. It's personal, it's expert, and the membership pays for itself. Five stars truly isn't enough — this is my place now.",
    name: "Priya K.",
    treatment: "Next Level Beauty member",
  },
  {
    body:
      "Thirty years of medical experience really shows. My results look completely natural — balanced and soft, never overdone. People say I look rested, not 'done.' That's the whole point.",
    name: "Sofia L.",
    treatment: "Dermal filler · cheeks",
  },
  {
    body:
      "I came in for the IV therapy and left feeling like a new person. They explained everything, never rushed me, and the German Village studio is the most serene spot in Columbus.",
    name: "Renee M.",
    treatment: "IV therapy",
  },
  {
    body:
      "The BHRT consult changed my year. A real physician-led plan, no pressure, no upsell — just genuine expertise and a team that treats you like family. I send everyone here.",
    name: "Tara B.",
    treatment: "Bioidentical hormone therapy",
  },
  {
    body:
      "My medical weight-loss program is finally working because someone with actual medical training built it for me. I feel seen and supported at every single visit.",
    name: "Grace P.",
    treatment: "Medical weight loss",
  },
  {
    body:
      "Best Botox I've had in the city. Subtle, even, exactly where I wanted movement preserved. Woman-owned, family-run, and you can feel the care in every detail.",
    name: "Hannah W.",
    treatment: "Botox · forehead",
  },
  {
    body:
      "My PDO thread lift gave me a lift I'd lost without changing who I look like at all. Physician-administered start to finish — I felt safe and cared for the entire time.",
    name: "Lauren F.",
    treatment: "PDO thread lift",
  },
  {
    body:
      "From the first call to the follow-up text, everything felt elevated and effortless. The Sculptra results came in gradually and look so natural. Truly five stars.",
    name: "Maya D.",
    treatment: "Sculptra",
  },
];

const AGGREGATE = { rating: "5.0", count: "100+", source: "Google" } as const;

function initials(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase();
}

function Stars({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{ display: "inline-flex", gap: "0.125rem", color: "var(--gold-deep)" }}
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
      <path d="M21.6 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.23c1.89-1.74 2.97-4.3 2.97-7.17Z" fill="var(--color-accent)" />
      <path d="M12 22c2.7 0 4.96-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z" fill="var(--color-accent-deep)" />
      <path d="M6.41 13.91a5.99 5.99 0 0 1 0-3.82V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.58Z" fill="var(--color-accent)" opacity="0.7" />
      <path d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2A10 10 0 0 0 3.07 7.51l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98Z" fill="var(--gold-deep)" />
    </svg>
  );
}

function RatingHeader() {
  return (
    <Reveal className="mt-10 sm:mt-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-6 text-center shadow-[var(--glass-shadow)] sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
        <div className="flex items-center gap-3">
          <span className="font-display text-5xl leading-none text-gold-ink">{AGGREGATE.rating}</span>
          <span className="flex flex-col items-start">
            <Stars />
            <span className="mt-1 text-xs font-medium text-[var(--color-fg-muted)]">
              <span className="tnum font-semibold text-[var(--color-fg)]">{AGGREGATE.count}</span> reviews
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
            Among German Village&rsquo;s most-loved med spas — the kind of standing
            that puts a practice at the top of the map for{" "}
            <span className="font-medium text-accent-deep">&ldquo;med spa near me.&rdquo;</span>
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
      className="bs-review-card flex w-[78vw] max-w-[24rem] shrink-0 snap-center flex-col rounded-3xl p-6 sm:w-[24rem] sm:p-7"
    >
      <Stars className="shrink-0" />
      <blockquote className="mt-4 flex-1 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-fg)]">
        &ldquo;{r.body}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-border-subtle)] pt-5">
        <span
          aria-hidden
          className="tnum grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] font-display text-sm text-accent-deep"
        >
          {initials(r.name)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-semibold text-[var(--color-fg)]">{r.name}</span>
          <span className="text-xs text-[var(--color-fg-muted)]">{r.treatment}</span>
        </span>
        <GoogleGlyph className="ml-auto h-4 w-4 shrink-0 opacity-80" />
      </figcaption>
    </figure>
  );
}

export function ReviewsMarquee() {
  // Pause the (always-running) CSS marquee while the rail is scrolled off-screen
  // so the GPU stays idle — the track only animates when it's actually visible.
  const marqueeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const track = el.querySelector<HTMLElement>(".bs-marquee__track");
    if (!track) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Off-screen → force paused; on-screen → clear the inline override so the
        // CSS hover/focus-pause + reduced-motion rules stay authoritative.
        track.style.animationPlayState = entry.isIntersecting ? "" : "paused";
      },
      { rootMargin: "0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--color-bg-subtle)] py-24 sm:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
    >
      {/* sky-blue cloud melt from the (transparent) membership band above */}
      <CloudDivider
        variant="top"
        fill="var(--color-bg-subtle)"
        tint="var(--color-accent-subtle)"
        heightClass="h-14 sm:h-20"
      />

      {/* soft sky aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(55% 46% at 88% 4%, var(--color-accent-subtle), transparent 70%), radial-gradient(50% 46% at 6% 102%, oklch(94% 0.04 82), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Loved in German Village"
          title={
            <span id="reviews-title">
              A wall of voices, all saying the same thing:{" "}
              <span className="italic text-accent-deep">seen, cared for, elevated.</span>
            </span>
          }
          lead="Real Google reviews, flowing past in full — leading with what Blue Sky is known for: a Medical Doctor on staff, a holistic eye, and results that look like you, only refreshed."
        />

        <RatingHeader />
      </div>

      {/* The marquee — full-bleed beyond the prose column so the rail reads as a
          continuous river of reviews. Masked edges; pauses on hover/focus. */}
      <Reveal className="relative mt-14 sm:mt-16">
        <div ref={marqueeRef} className="bs-marquee" aria-label="Patient reviews (auto-scrolling)">
          <ul className="bs-marquee__track items-stretch gap-5 px-5 sm:gap-6 sm:px-6">
            {REVIEWS.map((r) => (
              <li key={r.name} className="flex">
                <ReviewCard r={r} />
              </li>
            ))}
            {REVIEWS.map((r) => (
              <li key={`dup-${r.name}`} className="bs-marquee__dup flex" aria-hidden>
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
            mockup. In the live Growth&nbsp;OS, verified Google reviews would sync
            and flow through this rail — curated to lead with natural, physician-led
            results.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
