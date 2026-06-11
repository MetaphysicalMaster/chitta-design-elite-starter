"use client";

/**
 * Aesthetics — the WARM dual-track beat. The page leads with medical/dermato-
 * pathology authority (the gold-standard differentiator), and this section is
 * its equal-weight counterpart for the female-luxury aesthetics buyer: a warm
 * coral / warm-paper register that mirrors HER language (you, your skin, how you
 * want to look) while keeping the credential spine intact.
 *
 * The wedge — the seed thought that makes Darst's aesthetics MORE credible than
 * a chain med-spa — is said explicitly: the physician who reads your slide under
 * the microscope is the same one who treats your face.
 *
 * The right column is built for the MIRROR EFFECT: it LEADS with a luminous
 * warm "her outcome" portrait (a clearly sample-tagged radiant-skin plate) so
 * the female-luxury buyer sees HERSELF, then seats Dr. Darst's REAL headshot
 * beneath it as the "meet your physician" credential — warm-integrated via the
 * FRAME (a warm-paper mat + a brown edge-vignette over the cool-navy backdrop
 * EDGES only, never the face), the same frame-not-pixels discipline RealProof
 * uses on the magazine lockup. So she sees her glow first, his credentials
 * second — not only the (male) doctor.
 *
 * Reduced-motion safe; AA contrast on the warm-paper surface. The headshot is a
 * real <img> seated by object-position (durable to any asset re-export).
 */

import Link from "next/link";
import { FigureTag, Reveal } from "./primitives";
import { BrandImage } from "./BrandImage";
import { selectBookingIntent } from "./bookingIntent";

const PROMISES = [
  {
    t: "Results that look like you",
    d: "Injectables and lasers chosen for your face, not a menu — refined enough to read as rest, not as work.",
  },
  {
    t: "Read by the physician who treats you",
    d: "The same doctor who examines a slide under the microscope plans your aesthetic care — skin understood as an organ first, then refined.",
  },
  {
    t: "Honest, never upsold",
    d: "A plan matched to your skin and talked through plainly — including the treatments you don't need.",
  },
];

/* Named SIGNATURE aesthetic treatments — high-ticket cosmetic buyers convert on
   the hero offerings they recognize, each with a one-line outcome in HER
   language. Surfaced above the generic chip list so the aesthetic path leads
   with treatments she's searching for, not a flat menu. */
const SIGNATURE = [
  {
    t: "Wrinkle relaxers",
    d: "Softened lines that still move — expression kept, not frozen.",
  },
  {
    t: "Dermal fillers",
    d: "Restored volume that reads as rested, never overdone.",
  },
  {
    t: "Laser resurfacing",
    d: "Even tone and texture — a calmer, clearer complexion.",
  },
];

export function Aesthetics() {
  return (
    <section
      id="aesthetics"
      aria-labelledby="aesthetics-title"
      className="relative overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      {/* warm coral wash — the human / aesthetic register, distinct from the
          clinical dark rooms. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 84% 12%, var(--color-coral-subtle), transparent 58%), radial-gradient(50% 60% at 8% 92%, var(--color-accent-subtle), transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* left: the warm invitation, in her language */}
        <div>
          <FigureTag
            n="04"
            label="The aesthetic register"
            className="mb-6 !text-[var(--color-coral-deep)]"
          />
          <Reveal>
            <p className="eyebrow rule-accent text-[var(--color-coral-deep)]">
              The aesthetic side
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="aesthetics-title"
              className="font-display mt-5 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.08 }}
            >
              Care for how you want to{" "}
              <span className="font-display-em text-[var(--color-coral-deep)]">
                look
              </span>{" "}
              — from the physician who knows your skin.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className="mt-6 max-w-[52ch] text-pretty font-light text-[var(--color-fg-muted)]"
              style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.62 }}
            >
              A chain med-spa sees a face. Dr. Darst sees an organ he is
              board-certified to read under a microscope —{" "}
              <span className="font-medium text-[var(--color-fg)]">
                then refines how it looks
              </span>
              . That is what makes a result feel like you: a glow built on skin
              health, planned by the doctor who treats you, not handed off.
            </p>
          </Reveal>

          <ul className="mt-9 flex flex-col gap-4">
            {PROMISES.map((p, i) => (
              <Reveal as="li" key={p.t} delay={0.16 + i * 0.06}>
                <div className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-coral-subtle)] text-[var(--color-coral-deep)]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M5 12.5l4 4 10-10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>
                    <span className="font-display text-lg text-[var(--color-fg)]">
                      {p.t}
                    </span>
                    <span className="mt-1 block text-[0.95rem] leading-relaxed text-[var(--color-fg-muted)]">
                      {p.d}
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>

          {/* Signature treatments — the named hero offerings the high-ticket
              buyer recognizes, each with a one-line outcome. A quiet 3-up rail
              with a coral keyline so the aesthetic path leads with treatments
              she's looking for, above the generic service chips elsewhere. */}
          <Reveal delay={0.34}>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {SIGNATURE.map((s) => (
                <div
                  key={s.t}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 pl-[1.1rem] shadow-[0_18px_44px_-34px_oklch(52%_0.13_31_/_0.4)]"
                  style={{
                    borderLeft: "2px solid var(--color-coral-deep)",
                  }}
                >
                  <p className="font-display text-[1.02rem] leading-tight text-[var(--color-fg)]">
                    {s.t}
                  </p>
                  <p className="mt-1.5 text-[0.85rem] leading-snug text-[var(--color-fg-muted)]">
                    {s.d}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            {/* Clean #book href (so the generic smooth-scroll still resolves the
                target), but records the ELECTIVE intent via sessionStorage +
                a custom event so the scheduler pre-selects HER reason on land,
                not the default medical one — the funnel feels "built for me".
                Works identically under reduced-motion (no hash semantics). */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Link
                href="#book"
                onClick={() => selectBookingIntent("cosmetic")}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-coral-deep)] px-7 py-3.5 font-medium text-[oklch(99%_0.004_60)] shadow-[0_16px_40px_-16px_oklch(52%_0.13_31_/_0.6)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_54px_-14px_oklch(52%_0.13_31_/_0.7)] active:translate-y-0 active:scale-[0.98] active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-coral-deep)]"
              >
                Book an aesthetic consult
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              {/* Cost-confidence cue at the aesthetic decision point — high-ticket
                  cosmetic buyers convert when the experience is unhurried and the
                  price is known before they commit. Mirrors the elective
                  reassurance Booking promises, surfaced here at the CTA. */}
              <p className="max-w-[24ch] text-[0.82rem] leading-snug text-[var(--color-fg-subtle)]">
                <span className="font-medium text-[var(--color-coral-deep)]">
                  Unhurried, quoted up front.
                </span>{" "}
                A consult, not a sales table.
              </p>
            </div>
          </Reveal>
        </div>

        {/* right: the MIRROR EFFECT column. Leads with a luminous "her outcome"
            radiant-skin sample portrait (she sees herself), then seats Dr.
            Darst's REAL headshot beneath as the warm-integrated "meet your
            physician" credential. */}
        <Reveal delay={0.1}>
          <div className="mx-auto max-w-sm">
            {/* HER outcome — a radiant warm-skin portrait evocation, equal-weight
                to the credentials closer. Honest "sample" tag stays; the warm
                editorial caption names what the real shot would show so the
                placeholder still communicates a luxury aesthetic result. */}
            <figure className="overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 shadow-[0_40px_90px_-50px_oklch(30%_0.05_58_/_0.42)] sm:p-3.5">
              <BrandImage
                alt="A patient with calm, radiant, natural-looking skin after treatment"
                aspect="4 / 5"
                variant="skin"
                radius="3xl"
                scrim="soft"
                className="!rounded-[1.35rem]"
              >
                {/* soft editorial caption riding the lower scrim — speaks HER
                    register (rested, lit-from-within), not a procedure list.
                    Decorative (the role="img" carries the real alt; the default
                    top-right "Sample" tag keeps it honest), so aria-hidden. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5"
                >
                  <p className="font-display text-[1.05rem] leading-snug text-[oklch(98%_0.012_72)] drop-shadow-[0_1px_10px_oklch(20%_0.04_40_/_0.6)]">
                    Skin that looks rested, even, lit from within.
                  </p>
                  <p className="mt-1 text-[0.7rem] font-medium tracking-tight text-[oklch(94%_0.014_72_/_0.82)]">
                    Your result — representative sample
                  </p>
                </div>
              </BrandImage>
            </figure>

            {/* HIS credential — the real headshot, warm-integrated by the FRAME:
                a warm-paper mat band + a brown-to-transparent edge vignette over
                the cool-navy backdrop EDGES (radial transparent center → the
                face stays untouched), so the portrait seats into the brown+teal
                brand instead of reading as a pasted-in cool rectangle. */}
            <figure className="mt-4 flex items-center gap-4 rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 shadow-[0_24px_60px_-44px_oklch(30%_0.05_58_/_0.4)] sm:gap-5 sm:p-3.5">
              <div
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.05rem] ring-1 ring-[oklch(88%_0.014_68_/_0.7)] sm:h-[5.5rem] sm:w-[5.5rem]"
                style={{
                  /* warm-paper mat behind the navy backdrop edges */
                  background:
                    "linear-gradient(150deg, var(--color-bg-subtle), var(--color-bg-wash))",
                }}
              >
                {/* The headshot lives in the right ~14% of the wide Top Doctor
                    lockup. We render the whole lockup at a known scale and
                    translate so the face (source ~68%/38%) seats in the square.
                    All values are % of the rendered art, so a same-composition
                    re-export still frames him correctly — no brittle px. */}
                <img
                  src="/clients/darst/top-doctor.jpg"
                  alt="Dr. Marc A. Darst, MD — board-certified dermatologist and dermatopathologist"
                  width={1400}
                  height={324}
                  loading="lazy"
                  decoding="async"
                  className="absolute left-1/2 top-1/2 max-w-none"
                  style={{ width: "640%", transform: "translate(-68%, -38%)" }}
                />
                {/* warm edge-vignette: brown rim → transparent center, so only
                    the cool-navy BACKDROP edges warm, never his face. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[1.05rem]"
                  style={{
                    background:
                      "radial-gradient(72% 72% at 50% 42%, transparent 56%, oklch(40% 0.055 52 / 0.5) 100%)",
                    boxShadow:
                      "inset 0 0 0 1px oklch(40% 0.04 52 / 0.18), inset 0 1px 6px oklch(30% 0.05 58 / 0.16)",
                  }}
                />
              </div>
              <figcaption>
                {/* Aesthetic-specific quote (distinct from the Credentials
                    "reads the slide" beat) so his second appearance earns its
                    place in the warm column — the restraint promise the
                    high-ticket buyer wants to hear. */}
                <p className="font-display text-[1.02rem] leading-snug text-[var(--color-fg)]">
                  &ldquo;The best aesthetic work is the kind no one can point
                  to — you simply look like a rested version of yourself.&rdquo;
                </p>
                <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-deep)]">
                  Dr. Marc A. Darst, MD
                </p>
              </figcaption>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
