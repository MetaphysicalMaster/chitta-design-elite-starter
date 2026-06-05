"use client";

/**
 * Financing — a candy-night callout band: "glow now, pay monthly". A friendly,
 * low-pressure financing pitch (Cherry / membership-style) that removes the
 * price objection without feeling salesy. Sits on the dark plum night so it
 * pops between the proof wall and the booking module. Reduced-motion safe.
 */

import Link from "next/link";
import { Reveal, ctaPrimary } from "./primitives";
import { cn } from "@/lib/utils";

const PERKS = [
  { v: "0%", k: "intro plans available" },
  { v: "60 sec", k: "soft-check, no impact" },
  { v: "Members", k: "save on every pour" },
];

export function Financing() {
  return (
    <section id="financing" className="scroll-mt-20 bg-[var(--color-bg)] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--glass-border-dark)] bg-[var(--night-0)] px-7 py-10 sm:px-12 sm:py-12">
            {/* candy bubble accents */}
            <span aria-hidden className="css-bubble absolute -right-6 -top-6 h-28 w-28 opacity-70" />
            <span aria-hidden className="css-bubble--lilac css-bubble absolute -bottom-8 left-10 h-20 w-20 opacity-60" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow text-[var(--candy-pink)]">No-stress pricing</p>
                <h2
                  className="font-display mt-4 text-balance text-[var(--color-bg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
                >
                  Glow now, <span className="candy-text--bright">pay monthly.</span>
                </h2>
                <p className="mt-4 max-w-lg text-pretty leading-relaxed text-[oklch(92%_0.03_330_/_0.86)]">
                  Flexible financing &amp; a membership that rewards regulars — so
                  treating yourself never means stressing about the tab. Quick soft
                  check, no impact to your credit.
                </p>

                <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
                  {PERKS.map((p) => (
                    <div key={p.k} className="flex flex-col">
                      <dt className="font-display text-2xl leading-none text-[var(--color-bg)] tnum">
                        {p.v}
                      </dt>
                      <dd className="mt-1.5 text-xs uppercase tracking-[0.14em] text-[oklch(86%_0.03_330_/_0.78)]">
                        {p.k}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex shrink-0 flex-col gap-3">
                <Link href="#book" className={cn(ctaPrimary, "w-full sm:w-auto")}>
                  See my options
                </Link>
                <p className="text-center text-xs text-[oklch(84%_0.03_330_/_0.7)]">
                  Sample offer — real terms shown at checkout.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
