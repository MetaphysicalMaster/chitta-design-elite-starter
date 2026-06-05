"use client";

/**
 * Reviews — the proof wall, framed PROACTIVELY. Rather than parade a star
 * average (the live site's 3.5★ liability), this section leads with the
 * credential context and curates patient quotes that speak to diagnostic
 * expertise, early catches and being heard. An honest framing line sets
 * expectations. Sample quotes, clearly labelled. Reduced-motion safe.
 */

import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./primitives";

type Quote = {
  body: string;
  name: string;
  context: string;
};

const QUOTES: Quote[] = [
  {
    body:
      "Dr. Darst caught a melanoma my previous dermatologist had watched for two years. He read the biopsy himself and called me the same week.",
    name: "R. M.",
    context: "Skin cancer screening",
  },
  {
    body:
      "He explained exactly what the pathology showed and why it mattered. I never felt rushed, and I finally understood my own diagnosis.",
    name: "J. T.",
    context: "Complex rash",
  },
  {
    body:
      "Twenty years of seeing the same physician. That continuity is rare now — and it shows in how well he knows my skin.",
    name: "P. K.",
    context: "Long-term patient",
  },
  {
    body:
      "I came for a cosmetic consult and appreciated that he treated my skin health first. Restrained, honest, no upsell.",
    name: "S. L.",
    context: "Cosmetic consultation",
  },
];

export function Reviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="bg-[var(--color-bg)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="In patients' words"
          title={
            <>
              The reviews that matter speak to{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">
                diagnoses, not décor.
              </span>
            </>
          }
          lead="We surface the feedback that reflects the work: catches made early, conditions finally explained, and decades of continuity."
        />

        <RevealGroup className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2">
          {QUOTES.map((q) => (
            <RevealItem
              key={q.name}
              as="figure"
              className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7"
            >
              <span
                aria-hidden
                className="font-display text-4xl leading-none text-[var(--color-accent-deep)]"
              >
                &ldquo;
              </span>
              <blockquote className="mt-1 text-pretty text-[1.05rem] leading-relaxed text-[var(--color-fg)]">
                {q.body}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                <span
                  aria-hidden
                  className="grid h-9 w-9 place-items-center rounded-full bg-[var(--navy)] text-[0.8rem] font-semibold text-[oklch(96%_0.012_72)]"
                >
                  {q.name.replace(/\s/g, "")}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-[var(--color-fg)]">
                    {q.name}
                  </span>
                  <span className="text-xs text-[var(--color-fg-subtle)]">
                    {q.context}
                  </span>
                </span>
              </figcaption>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.05}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--color-fg-subtle)]">
            Quotes are representative samples for this mockup. Verified patient
            reviews would be displayed here, curated to lead with clinical
            outcomes rather than a single aggregate score.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
