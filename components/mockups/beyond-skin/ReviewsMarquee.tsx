"use client";

/**
 * ReviewsMarquee — a CONTINUOUS HORIZONTAL MARQUEE of FULL 5-star reviews
 * (mirrors the happy-clinic gold pattern via .bs-marquee in brand.css):
 *
 *  - the track holds the full review set TWICE and translates -50% in one
 *    seamless loop, so the rail scrolls forever with no visible seam,
 *  - PAUSES on hover / focus-within (so a reader can finish a card),
 *  - each card shows the WHOLE review text (no clipping), five mauve stars,
 *    the reviewer's initial avatar + name + treatment,
 *  - prefers-reduced-motion → the loop stops and the rail becomes a normal
 *    horizontally-scrollable, swipeable, snapping strip; the duplicate half is
 *    removed from layout (so each review shows once),
 *  - the duplicated half is aria-hidden so assistive tech announces each review
 *    exactly once.
 *
 * Above the rail: the aggregate "4.9 ★ · Google" reputation band. Beneath: the
 * honest representative-sample note. Reviews are realistic SAMPLE content.
 * Brand: warm cream field, dusty-mauve accents.
 */

import { useEffect, useRef } from "react";
import { Reveal, SectionHeading } from "./primitives";

type Review = { body: string; name: string; treatment: string };

const REVIEWS: Review[] = [
  {
    body:
      "From the moment I walked in I felt completely at ease — no judgment, no pressure, just genuine warmth. They listened to what I actually wanted and the result is so natural. I finally found my place.",
    name: "Renee K.",
    treatment: "Injectables · Consult",
  },
  {
    body:
      "I was nervous about my first visit, and they made the whole thing feel like self-care, not a procedure. The team explains everything and never upsells. I left glowing and already booked my next.",
    name: "Jenna P.",
    treatment: "Glo2Facial",
  },
  {
    body:
      "Beautiful, calming space and a team that truly cares. My skin looks refreshed and like me — only better. It feels less like a med spa and more like a wellness journey I actually look forward to.",
    name: "Sofia L.",
    treatment: "RF Microneedling",
  },
  {
    body:
      "They talked me out of something I didn't need and toward what actually suited me. Who does that? Honest, skilled, and so kind. I trust them completely and recommend them to all my friends.",
    name: "Alyssa T.",
    treatment: "Filler · Consult",
  },
  {
    body:
      "The most welcoming aesthetics practice I've been to. Diverse, inclusive, judgment-free — exactly as they promise. My results are subtle and gorgeous, and the whole experience felt healing.",
    name: "Marcus D.",
    treatment: "Laser & Devices",
  },
  {
    body:
      "I've been coming for over a year now and every visit is consistent: warm, professional, and unhurried. They remember me, they remember my goals, and my skin has never looked healthier.",
    name: "Grace P.",
    treatment: "Member · 1 year",
  },
  {
    body:
      "Everything in one place — my treatments, my skincare, my membership credit. It finally feels like one seamless brand instead of three different logins. And the care is second to none.",
    name: "Hannah W.",
    treatment: "Membership",
  },
  {
    body:
      "Walked in tired, walked out radiant. The providers are true artists with a gentle touch, and the front desk treats you like family. This is what beauty and wellness should feel like.",
    name: "Lauren F.",
    treatment: "Esthetician Services",
  },
];

const AGGREGATE = { rating: "4.9", count: "280+", source: "Google" } as const;

function initials(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase();
}

function Stars({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "inline-flex",
        gap: "0.125rem",
        color: "var(--color-accent-bright)",
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M12 2.4l2.86 5.8 6.4.93-4.63 4.52 1.1 6.38L12 17.5l-5.73 3.01 1.1-6.38L2.74 9.6l6.4-.93z" />
        </svg>
      ))}
    </span>
  );
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M21.6 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.23c1.89-1.74 2.97-4.3 2.97-7.17Z"
        fill="var(--color-accent-bright)"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
        fill="var(--color-accent)"
      />
      <path
        d="M6.41 13.91a5.99 5.99 0 0 1 0-3.82V7.51H3.07a10 10 0 0 0 0 8.98l3.34-2.58Z"
        fill="var(--glow-mauve)"
      />
      <path
        d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2A10 10 0 0 0 3.07 7.51l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98Z"
        fill="var(--gold-deep)"
      />
    </svg>
  );
}

function RatingHeader() {
  return (
    <Reveal className="mt-10 sm:mt-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-6 text-center shadow-[var(--glass-shadow)] sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
        <div className="flex items-center gap-3">
          <span className="font-display text-5xl font-medium leading-none text-[var(--color-accent-deep)]">
            {AGGREGATE.rating}
          </span>
          <span className="flex flex-col items-start">
            <Stars />
            <span className="mt-1 text-xs font-medium text-[var(--color-fg-muted)]">
              <span className="font-semibold text-[var(--color-fg)]">
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
            Among Columbus&rsquo; most-loved aesthetics &amp; wellness studios —
            the warm, judgment-free home people keep coming back to.
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
      className="bs-review-card flex w-[78vw] max-w-[24rem] shrink-0 flex-col rounded-3xl p-6 sm:w-[24rem] sm:p-7"
    >
      <Stars className="shrink-0" />
      <blockquote className="mt-4 flex-1 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-fg)]">
        &ldquo;{r.body}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-border-subtle)] pt-5">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-accent)] text-sm font-semibold text-[var(--color-accent-fg)]"
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
  // Pause the CSS marquee whenever the rail is scrolled off-screen so the GPU
  // sits idle instead of compositing an unseen, always-animating transform.
  const marqueeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = marqueeRef.current;
    if (!root) return;
    const track = root.querySelector<HTMLElement>(".bs-marquee__track");
    if (!track) return;
    const io = new IntersectionObserver(
      ([e]) => {
        track.style.animationPlayState = e.isIntersecting ? "running" : "paused";
      },
      { threshold: 0 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg-subtle)] py-24 sm:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(55% 46% at 88% 4%, var(--color-accent-subtle), transparent 70%), radial-gradient(50% 46% at 6% 102%, var(--glow-blush), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="In their words"
          title={
            <span id="reviews-title">
              A wall of voices, all saying the same thing:{" "}
              <span className="font-em text-[var(--color-accent-deep)]">
                warm, honest, and judgment-free.
              </span>
            </span>
          }
          lead="Real Google reviews, flowing past in full — the kind of welcome that turns a first visit into a lasting wellness journey."
        />

        <RatingHeader />
      </div>

      {/* The marquee — full-bleed beyond the prose column. Masked edges; pauses
          on hover/focus. */}
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
            mockup. On launch, verified Google reviews would sync and flow through
            this rail automatically.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
