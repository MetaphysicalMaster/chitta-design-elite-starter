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
 *
 * LIGHT LEADING TO ACTION: a ScrollTrigger-scrubbed warmth layer (deep orange
 * bokeh glow) blooms up as the visitor approaches the widget — the page's
 * ambient light literally intensifies toward the conversion moment. Scrub is
 * transform/opacity-only; reduced-motion users get a calm static warmth via
 * the .tl-book-warmth CSS fallback.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "./primitives";
import { GuidedBookingInline } from "./GuidedBooking";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PHONE_DISPLAY = "(513) 451-9600";
const PHONE_TEL = "+15134519600";

export function BookingCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const warmthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const warmth = warmthRef.current;
    if (!section || !warmth) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Direct progress→style mapping (Lenis already smooths the scroll, so
      // the bloom glides). Pure opacity/transform — compositor-only.
      const apply = (p: number) => {
        warmth.style.opacity = String(p);
        warmth.style.transform = `scale(${0.9 + p * 0.1})`;
      };
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 88%",
        end: "center 55%",
        onUpdate: (self) => apply(self.progress),
      });
      apply(st.progress);
      return () => {
        warmth.style.opacity = "";
        warmth.style.transform = "";
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="book"
      ref={sectionRef}
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
      {/* THE WARMTH: deep-orange bokeh glow that blooms as you near booking —
          scrubbed by ScrollTrigger (transform/opacity only); static warm under
          reduced motion via .tl-book-warmth. */}
      <div
        ref={warmthRef}
        aria-hidden
        className="tl-book-warmth pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(46% 56% at 76% 38%, oklch(76% 0.14 54 / 0.34), transparent 70%), radial-gradient(38% 46% at 16% 78%, oklch(70% 0.15 52 / 0.26), transparent 68%), radial-gradient(circle at 64% 78%, oklch(72% 0.14 54 / 0.2) 0 4%, transparent 6%)",
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
