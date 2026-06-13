"use client";

/**
 * Reviews — ENHANCED into the LIVE GOOGLE REVIEWS WALL (Growth-OS "reputation"
 * module demo surface). This is the slug's single reviews/proof section — it was
 * already the proof wall, so we enhance IN PLACE (no duplicate testimonials
 * block was added anywhere on the page).
 *
 * The enhancement frames the existing editorial review cards as a live Google
 * reviews feed: a Google-branded aggregate badge (★ 4.9 · Google), a local-
 * ranking / credibility line ("Top-rated med spa in the Galleria area"), and a
 * small Google glyph + "Verified Google review" tag on each card.
 *
 * Static-export safe: there is NO fetch to the Google API — the reviews are
 * in-file data. Per FTC + the build's honesty convention, the reviews are
 * REPRESENTATIVE SAMPLES (clearly marked), kept experience-flavored and generic.
 * They do NOT fabricate named-patient clinical results or before/after claims,
 * and contain no real patient PHI.
 */

import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./primitives";

type Review = {
  quote: string;
  name: string;
  meta: string;
  span?: boolean;
};

/* Experience-flavored, generic samples — NO specific clinical outcomes or
   before/after claims. The meta line names the room/treatment, never a result. */
const REVIEWS: Review[] = [
  {
    quote:
      "From the moment you walk in, it feels like a true escape. Sousan and her team are warm, unhurried, and genuinely listen. The most cared-for I've ever felt at a med spa in Houston.",
    name: "Margaret L.",
    meta: "Local Guide · 12 reviews",
    span: true,
  },
  {
    quote:
      "Spotless, serene, and so welcoming. I always leave feeling like myself, only brighter. Booking is effortless too.",
    name: "Priya S.",
    meta: "HydraFacial MD",
  },
  {
    quote:
      "Natural and tasteful — never overdone. The whole experience feels considered, from the consult to the goodbye.",
    name: "Caroline V.",
    meta: "Deluxe Facial",
  },
  {
    quote:
      "Honest guidance and zero pressure. They take the time to explain everything. A rare find.",
    name: "Deborah K.",
    meta: "New client",
  },
  {
    quote:
      "The atmosphere alone is worth it — calm, beautiful, immaculate. The only place in Houston I trust with my skincare. Truly a beauty evolution.",
    name: "Anne-Marie T.",
    meta: "Loyal client · 5 yrs",
    span: true,
  },
];

function Stars({ label }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={label ?? "5 out of 5 stars"}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} aria-hidden className="text-[var(--gold-mid)]">
          ★
        </span>
      ))}
    </span>
  );
}

/* The Google "G" — the four-color glyph is Google's only brand-mandated multi-
   color asset. To respect the STRICT greyscale + single-pink brand here in the
   mockup, we render the wordmark + a monochrome G mark so the wall stays native
   to Sousan's palette (no off-brand four-color logo dropped into a monochrome
   editorial spread). Clearly reads as "Google" without breaking the system. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
        <path
          d="M21.6 12.2c0-.66-.06-1.3-.17-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.24c1.9-1.74 2.96-4.3 2.96-7.2Z"
          fill="currentColor"
          opacity="0.92"
        />
        <path
          d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
          fill="currentColor"
          opacity="0.72"
        />
        <path
          d="M6.42 13.92a6 6 0 0 1 0-3.84V7.5H3.07a10 10 0 0 0 0 9l3.35-2.58Z"
          fill="currentColor"
          opacity="0.55"
        />
        <path
          d="M12 5.94c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.95 2.98 14.7 2 12 2A10 10 0 0 0 3.07 7.5l3.35 2.58C7.2 7.72 9.4 5.94 12 5.94Z"
          fill="currentColor"
          opacity="0.85"
        />
      </svg>
    </span>
  );
}

export function Reviews() {
  return (
    <section
      id="reviews"
      className="relative bg-[var(--color-bg-subtle)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title={
            <>
              Houston is{" "}
              <span className="font-display-em" data-thread="underline">
                glowing.
              </span>
            </>
          }
          lead="A reputation built one transformation at a time — pulled straight from our Google profile, where Houston tells the real story of their beauty evolution."
        />

        {/* LIVE GOOGLE aggregate badge — the reputation module's headline. The
            figures are marked representative so the credibility claim stays
            consistent with the build's honesty discipline (verified ratings
            slot straight in — no API call, static demo). */}
        <Reveal delay={0.08} className="mt-10">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_1px_0_oklch(100%_0_0/0.6)]">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-center">
              {/* score + Google source */}
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl text-[var(--color-fg)] tnum">
                  4.9
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <Stars label="4.9 out of 5 stars" />
                  <span className="mt-0.5 inline-flex items-center gap-1.5 text-[0.72rem] font-medium text-[var(--color-fg-muted)]">
                    <GoogleMark className="text-[var(--color-fg)]" />
                    on Google
                  </span>
                </span>
              </div>

              <span
                aria-hidden
                className="hidden h-8 w-px bg-[var(--color-hairline)] sm:block"
              />

              <p className="text-sm text-[var(--color-fg-muted)]">
                <span className="font-medium text-[var(--color-fg)] tnum">
                  400+
                </span>{" "}
                five-star Google reviews
              </p>

              <span
                aria-hidden
                className="hidden h-8 w-px bg-[var(--color-hairline)] sm:block"
              />

              {/* local-ranking / credibility line */}
              <p className="inline-flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)]">
                <span aria-hidden className="text-[var(--color-accent-deep)]">
                  ✦
                </span>
                Top-rated med spa near the{" "}
                <span className="font-medium text-[var(--color-fg)]">
                  Galleria
                </span>
              </p>
            </div>
            <p className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-6 py-2.5 text-center text-[0.72rem] text-[var(--color-fg-subtle)]">
              Representative reviews for this mockup — the practice&rsquo;s
              live, verified Google ratings sync in here.
            </p>
          </div>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {REVIEWS.map((r) => (
            <RevealItem
              as="li"
              key={r.name}
              className={r.span ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <figure className="sn-quote-card flex h-full flex-col rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_1px_0_oklch(100%_0_0/0.6)]">
                {/* top row: stars + the Google source tag, so each card reads as
                    a verified Google review at a glance. */}
                <div className="flex items-center justify-between">
                  <Stars />
                  <span className="inline-flex items-center gap-1 text-[0.68rem] font-medium text-[var(--color-fg-subtle)]">
                    <GoogleMark className="text-[var(--color-fg-muted)]" />
                    Google review
                  </span>
                </div>
                <blockquote className="mt-3 flex-1 text-pretty font-display text-[1.05rem] leading-relaxed text-[var(--color-fg)]">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
                  {/* monogram avatar — the reviewer initial, on-brand pink */}
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-[0.8rem] font-semibold text-[var(--color-accent-deep)]"
                  >
                    {r.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-[var(--color-fg)]">
                      {r.name}
                    </span>
                    <span className="mt-0.5 block text-[0.8rem] text-[var(--color-fg-subtle)]">
                      {r.meta}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* footer honesty line — these are representative samples, not real
            named-patient results (FTC-safe). */}
        <Reveal delay={0.05}>
          <p className="mt-6 text-center text-[0.74rem] text-[var(--color-fg-subtle)]">
            Reviews shown are representative samples for this mockup. No specific
            treatment results are claimed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
