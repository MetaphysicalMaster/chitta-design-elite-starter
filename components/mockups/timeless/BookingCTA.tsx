"use client";

/**
 * BookingCTA — the in-page home of the signature GUIDED BOOKING experience.
 *
 * The program owner's directive was to elevate the live site's "CHAT LIVE NOW"
 * bot into a guided booking walkthrough. That walkthrough lives in
 * GuidedBooking.tsx and is reachable two ways: a floating launcher (mounted at
 * the page root) AND embedded here as the page's conversion anchor, so #book
 * always lands on the same friendly, on-brand flow — never a form-dump.
 *
 * This section is LIGHT and warm (sunlit peach), matching the live brand: an
 * invitation on the left, the embedded guided-booking card on the right.
 */

import { Reveal } from "./primitives";
import { GuidedBookingInline } from "./GuidedBooking";

const PHONE_DISPLAY = "(513) 451-9600";
const PHONE_TEL = "+15134519600";

export function BookingCTA() {
  return (
    <section
      id="book"
      aria-labelledby="book-title"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
    >
      {/* warm sunlit field with soft bokeh, echoing the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 14% 8%, oklch(94% 0.05 60), transparent 64%), radial-gradient(60% 70% at 92% 96%, oklch(88% 0.07 56 / 0.8), transparent 66%), linear-gradient(165deg, oklch(98% 0.016 62), oklch(95% 0.03 58))",
        }}
      />
      {/* a couple of large out-of-focus bokeh circles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 22% 70%, oklch(74% 0.13 54 / 0.18) 0 7%, transparent 9%), radial-gradient(circle at 80% 22%, oklch(86% 0.08 60 / 0.3) 0 5%, transparent 7%)",
          filter: "blur(2px)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        {/* left: the invitation */}
        <Reveal>
          <p className="rule-fine eyebrow inline-block text-accent-deep">
            Book in 30 seconds
          </p>
          <h2
            id="book-title"
            className="font-display mt-5 text-balance text-[var(--color-fg)]"
            style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
          >
            A friendlier way to book.{" "}
            <span className="font-display-em text-[var(--color-accent-deep)]">
              Just a few taps.
            </span>
          </h2>
          <p className="mt-5 max-w-[44ch] text-pretty font-light leading-relaxed text-[var(--color-fg-muted)]">
            No phone tag, no portal maze. Our guided booking walks you through it
            in plain language — tell us what you&rsquo;re after, choose your
            physician and a time, and a real person confirms every request.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Choose your treatment & physician",
              "Pick a location and a time that works",
              "We confirm by text — no obligation",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-[var(--color-fg-muted)]">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[var(--color-accent-fg)]"
                  style={{
                    background:
                      "radial-gradient(130% 130% at 30% 22%, oklch(72% 0.15 58), oklch(58% 0.145 46))",
                  }}
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
                    <path d="M5 12.5 10 17 19 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-[var(--color-fg-muted)]">
            Prefer to talk?{" "}
            <a
              href={`tel:${PHONE_TEL}`}
              className="tnum font-semibold text-[var(--color-accent-deep)] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              {PHONE_DISPLAY}
            </a>
          </p>
        </Reveal>

        {/* right: the embedded guided-booking flow */}
        <Reveal delay={0.1}>
          <GuidedBookingInline />
          <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">
            Demonstration scheduler · no booking is submitted.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
