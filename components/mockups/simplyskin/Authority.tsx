"use client";

/**
 * Authority — the practitioner story. Holly Sheldon-Paquin, President of
 * Paquin Partners: a Top 1% US Allergan injector with twenty years of artistry.
 * Editorial two-column: a tall portrait plate beside a quiet, confident
 * statement of philosophy + credential chips. "Effortless-expert" voice.
 */

import { Reveal, SectionHeading, BrandImage } from "./primitives";

const CREDS = [
  "Top 1% US Allergan injector",
  "Top 10 injector in Indiana",
  "President · Paquin Partners",
  "20 years of injectable artistry",
  "Allē Allergan rewards partner",
  "Injectables-led, restraint-first",
];

export function Authority() {
  return (
    <section
      id="authority"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* Portrait plate */}
        <Reveal className="lg:col-span-5">
          <div className="relative">
            <BrandImage
              aspect="4 / 5"
              variant="nude"
              radius="3xl"
              label="Holly Sheldon-Paquin"
            />
            {/* floating signature credential card — inset on mobile so it never
                clips the viewport at 375px; floats off-edge from sm up. */}
            <div className="absolute -bottom-6 right-3 max-w-[15rem] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--glass-shadow)] sm:-right-6">
              <p className="font-display text-lg text-[var(--color-fg)]">
                Holly Sheldon-Paquin
              </p>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">
                President, Paquin Partners · Lead Injector
              </p>
              <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-deep)]">
                Top 1% US Allergan
              </p>
            </div>
          </div>
        </Reveal>

        {/* Statement */}
        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading
              eyebrow="Why SimplySkin"
              title={
                <>
                  Twenty years of judgment you can&apos;t fake.{" "}
                  <span className="font-display-em">Restraint is the result.</span>
                </>
              }
              lead="SimplySkin is led, not staffed. Every plan is Holly's — an injector ranked in the top 1% nationally by Allergan, trusted by Indianapolis for two decades. The goal is never &ldquo;done.&rdquo; It's you, rested and yourself."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {CREDS.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 text-sm text-[var(--color-fg-muted)]"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[var(--color-accent-subtle)] text-[var(--color-accent)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
                      <path d="M5 12.5 10 17 19 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.16}>
            <blockquote className="mt-10 border-l-2 border-[var(--color-accent)] pl-5">
              <p className="font-display text-lg italic leading-relaxed text-[var(--color-fg)]">
                &ldquo;The best work is the work no one notices. Just a face that
                looks like a better-rested version of you.&rdquo;
              </p>
              <footer className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                Holly Sheldon-Paquin
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
