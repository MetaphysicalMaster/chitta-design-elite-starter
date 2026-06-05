"use client";

/**
 * Financing — the "care now, pay over time" callout. A refined, reassuring band
 * on the elevated night surface with sample provider chips and an honest
 * disclaimer. Reduced-motion safe.
 */

import Link from "next/link";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const PROVIDERS = ["Cherry", "PatientFi", "CareCredit"];

export function Financing() {
  return (
    <section
      id="financing"
      className="scroll-mt-20 bg-[var(--night-0)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[linear-gradient(150deg,var(--night-3),var(--night-1))] p-8 sm:p-12">
            {/* soft chrome + amethyst glow accents */}
            <span
              aria-hidden
              className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[var(--color-accent)]/18 blur-3xl"
            />
            <span
              aria-hidden
              className="absolute -bottom-12 left-10 h-40 w-40 rounded-full bg-[var(--silver)]/12 blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="eyebrow rule-infinity inline-block text-[var(--color-accent-bright)]">
                  Financing
                </p>
                <h2
                  className="mt-5 font-display text-[var(--color-fg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.08 }}
                >
                  Timeless care,{" "}
                  <span className="font-display-em silver-text">
                    paid your way.
                  </span>
                </h2>
                <p
                  className="mt-5 max-w-xl text-pretty font-light text-[var(--color-fg-muted)]"
                  style={{ fontSize: "var(--fluid-lead)" }}
                >
                  Results that last shouldn&rsquo;t mean paying all at once.
                  Flexible monthly plans let you begin your treatment today and
                  pay at a pace that fits — often with no impact to check your
                  rate.
                </p>

                <ul className="mt-7 flex flex-wrap items-center gap-3">
                  {PROVIDERS.map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--night-2)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)]"
                    >
                      {p}
                    </li>
                  ))}
                  <li className="text-xs text-[var(--color-fg-subtle)]">
                    Sample providers — final partners shown at launch.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--night-2)] p-6">
                <p className="text-sm text-[var(--color-fg-muted)]">Estimated from</p>
                <p className="mt-1 font-display text-4xl font-semibold text-[var(--color-fg)] tnum">
                  $69
                  <span className="text-lg font-normal text-[var(--color-fg-muted)]">
                    /mo
                  </span>
                </p>
                <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">
                  Illustrative example. Subject to approval; terms vary by
                  provider.
                </p>
                <Link
                  href="#book"
                  className={cn(
                    "group relative mt-5 inline-flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold",
                    "silver-pill text-[var(--color-accent-fg)]",
                    "transition-transform duration-300 hover:-translate-y-0.5",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                  )}
                >
                  Start your plan
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
