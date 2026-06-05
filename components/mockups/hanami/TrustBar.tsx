"use client";

/**
 * TrustBar — a quiet hairline band directly under the hero, now anchored by the
 * FACE. The signature petal hero is deliberately faceless (the falling-sakura
 * brand moment), which defers the single strongest conversion surface for a
 * female high-ticket aesthetics buyer — seeing the trusted, aspirational woman
 * who will treat her — all the way to the 4th section. So the Mirror Effect is
 * pulled forward to the SECOND screen here: a small gold-ringed portrait of
 * Dr. Phuah leads the band, paired with at-a-glance credential facts that don't
 * echo the hero stats (board affiliation, the every-face continuity, the
 * address, how to be seen). Warm human cue + institutional proof, in one breath.
 */

import { BrandPhoto, Reveal } from "./primitives";

const POINTS = [
  { v: "DO · MBA · FACOI", k: "Board-affiliated physician" },
  { v: "Every face", k: "Placed by Dr. Phuah" },
  { v: "8th Ave", k: "Suite 508 · Fort Worth" },
  { v: "By appointment", k: "Consult-first, in person" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Your physician and practice standing"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 py-7 sm:py-8 lg:flex-row lg:items-center lg:gap-10">
            {/* The face — pulled to the second screen so a female buyer meets the
                woman who will treat her before scrolling philosophy + the menu.
                A circular gold-ringed portrait chip + her name and the ownable
                sole-injector line. Hidden-decorative ring; real alt on the photo. */}
            <div className="flex shrink-0 items-center gap-4 lg:border-r lg:border-[var(--color-border)] lg:pr-10">
              <div className="relative">
                <BrandPhoto
                  src="/clients/hanami/dr-phuah-candidate.jpg"
                  alt="Dr. Elaine Phuah, DO MBA — founder and sole injector at Hanami Medspa"
                  aspect="1 / 1"
                  radius="full"
                  position="50% 24%"
                  sizes="(min-width: 1024px) 4.5rem, 4rem"
                  className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-[var(--gold-hairline)] ring-offset-2 ring-offset-[var(--color-bg-elevated)]"
                />
              </div>
              <div className="leading-tight">
                <p className="font-display text-lg text-[var(--color-fg)] sm:text-xl">
                  Dr. Elaine Phuah
                </p>
                <p className="mt-1 text-[0.66rem] uppercase tracking-[0.2em] text-[var(--color-accent-deep)]">
                  Founder · sole injector
                </p>
              </div>
            </div>

            {/* Credential facts — distinct beat from the hero stats + AwardsRail. */}
            <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-6 text-center md:grid-cols-4">
              {POINTS.map((p) => (
                <div key={p.k} className="flex flex-col items-center">
                  <dt className="font-display text-xl tnum text-[var(--color-fg)] sm:text-2xl">
                    {p.v}
                  </dt>
                  <dd className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                    {p.k}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
