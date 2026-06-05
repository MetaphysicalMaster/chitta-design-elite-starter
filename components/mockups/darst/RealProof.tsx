"use client";

/**
 * RealProof — the practice's REAL third-party credentials, integrated onto the
 * warm-paper system as ONE art-directed "Recognized" plinth (not two stacked
 * white logo-soup cards).
 *
 * Two genuine assets pulled from the live darstdermatology.com:
 *   1. Charlotte Magazine "Top Doctor" — Dermatology, with Dr. Marc Darst's real
 *      headshot. The asset is a LIGHT-GRAY gradient field carrying the RED
 *      "Charlotte" wordmark, a gold tie and the real face — the single
 *      highest-trust element on the page. We render it CLEAN (no blend that would
 *      mutate the pixels) on a near-white elevated card, and integrate it to the
 *      warm system via the FRAME — a warm-paper mat + the hairline + a soft inset
 *      shadow — so the magazine art reads true (red wordmark, gold tie, crisp
 *      headshot) rather than muddying to gray-brown under a multiply blend.
 *   2. The board-certification / membership logo strip (ASDS, AAD, ABD —
 *      Marc A. Darst, MD, Skin Cancer Foundation, Independent Physicians of the
 *      Carolinas, Angie's List). Its mixed logo colors are neutralized with a
 *      rest-state grayscale+sepia that lifts to full color on hover/focus — a
 *      premium pattern that keeps the marks honest and legible without
 *      fragmenting the palette.
 *
 * Both seat on the SAME warm-paper matting + hairline so they read as a matched
 * pair. Plain <img> (lazy, sized to intrinsic dims) — zero CLS, these are real.
 */

import { Reveal, SectionHeading } from "./primitives";

export function RealProof() {
  return (
    <section
      aria-labelledby="recognized-title"
      className="bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Recognized"
          title={
            <>
              The credentials behind the{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">
                care.
              </span>
            </>
          }
          lead="Independently recognized expertise — a Charlotte Magazine Top Doctor in Dermatology, board-certified and active in the field's leading societies."
        />

        <Reveal className="mt-8 sm:mt-9">
          {/* Charlotte Magazine Top Doctor lockup + Dr. Darst's real portrait —
              the page's highest-trust asset. Rendered CLEAN on a near-white card
              (the magazine's light-gray field + red wordmark + gold tie + face
              read true). Integrated to the warm system by the FRAME only: a
              DEEPER warm-paper mat band + the hairline + a warm inner-glow edge
              bleed at the art's perimeter so the cool-gray magazine field reads
              as a framed clipping seated on the sepia system, not a pasted-in
              cool rectangle. The pixels stay true-color (no multiply). Top
              spacing tightened so the lockup sits close to its heading. */}
          <figure className="mx-auto max-w-4xl overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2.5 shadow-[0_30px_80px_-44px_oklch(30%_0.05_58_/_0.34)] sm:p-3">
            <div
              className="relative overflow-hidden rounded-[1.1rem] ring-1 ring-[oklch(86%_0.02_64_/_0.8)]"
              style={{
                /* a deeper warm-paper mat — a visible sepia band around the art,
                   warming the gray clipping without ever multiplying its pixels. */
                background:
                  "linear-gradient(150deg, var(--color-bg-wash), oklch(91% 0.026 64))",
                padding: "clamp(0.75rem, 2.2vw, 1.4rem)",
              }}
            >
              <span
                aria-hidden
                className="relative block overflow-hidden rounded-[0.7rem]"
              >
                <img
                  src="/clients/darst/top-doctor.jpg"
                  alt="Charlotte Magazine Top Doctor — Dermatology. Marc Darst, MD."
                  width={1400}
                  height={324}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-[0.7rem]"
                />
                {/* Warm inner-glow edge bleed — a sepia rim that fades to a clear
                    center, so the gray field's hard edge melts into the warm mat.
                    Transparent core leaves the wordmark/tie/face true-color. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[0.7rem]"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 50% 50%, transparent 62%, oklch(64% 0.07 52 / 0.16) 100%)",
                    boxShadow:
                      "inset 0 0 0 1px oklch(60% 0.05 54 / 0.16), inset 0 1px 5px oklch(30% 0.05 58 / 0.12)",
                  }}
                />
              </span>
            </div>
          </figure>
        </Reveal>

        {/* The board-cert / membership strip — same warm mat + hairline as the
            banner above, so the two artifacts read as one "Recognized" module. */}
        <Reveal delay={0.08} className="mt-6 sm:mt-7">
          <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]">
            Board-certified &amp; member of
          </p>
          <figure className="group mx-auto mt-5 max-w-4xl rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 sm:p-4">
            <div
              className="overflow-hidden rounded-[1.1rem] px-5 py-6 sm:px-9"
              style={{
                background:
                  "linear-gradient(150deg, var(--color-bg-subtle), var(--color-bg-wash))",
              }}
            >
              {/* On a credentials-FORWARD pitch the board-cert marks ARE the
                  conversion argument, so they read credible at REST (light
                  grayscale, no sepia muddying) — not hidden behind a hover that
                  touch users never trigger. Full color stays as a delight on
                  hover/focus, but legibility is no longer gated behind it. */}
              <img
                src="/clients/darst/member-certs.png"
                alt="American Society for Dermatologic Surgery, American Academy of Dermatology, American Board of Dermatology (Marc A. Darst, MD), Skin Cancer Foundation, Independent Physicians of the Carolinas, Angie's List Super Service Award."
                width={1218}
                height={156}
                loading="lazy"
                decoding="async"
                className="mx-auto h-auto w-full max-w-3xl opacity-100 transition-[filter,opacity] duration-500 [filter:grayscale(0.32)] group-hover:[filter:none] group-focus-within:[filter:none]"
              />
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
