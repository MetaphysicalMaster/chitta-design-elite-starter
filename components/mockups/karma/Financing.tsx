"use client";

/**
 * Financing — the "care now, pay over time" callout. A calm, reassuring band on
 * the warm sand surface with sample provider chips and an honest disclaimer.
 * Reduced-motion safe.
 */

import Link from "next/link";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const PROVIDERS = ["Cherry", "PatientFi", "CareCredit"];

export function Financing() {
  return (
    <section
      id="financing"
      className="scroll-mt-20 bg-[var(--color-bg)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[linear-gradient(150deg,var(--sand),var(--color-bg-elevated))] p-8 sm:p-12">
            {/* soft orbit glow accents */}
            <span
              aria-hidden
              className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[var(--color-accent)]/15 blur-3xl"
            />
            <span
              aria-hidden
              className="absolute -bottom-12 left-10 h-40 w-40 rounded-full bg-[var(--terra)]/15 blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="eyebrow rule-orbit inline-block text-[var(--color-accent-deep)]">
                  Financing
                </p>
                <h2
                  className="mt-5 font-display font-medium text-[var(--color-fg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.1 }}
                >
                  Balance your care{" "}
                  <span className="font-display-em balance-text">
                    over time.
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-pretty font-light text-[var(--color-fg-muted)]" style={{ fontSize: "var(--fluid-lead)" }}>
                  Beauty and wellness should feel grounded, not stressful.
                  Flexible monthly plans let you start your treatment today and
                  pay at a pace that fits — often with no impact to check your
                  rate.
                </p>

                <ul className="mt-7 flex flex-wrap items-center gap-3">
                  {PROVIDERS.map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)]"
                    >
                      {p}
                    </li>
                  ))}
                  <li className="text-xs text-[var(--color-fg-subtle)]">
                    Sample providers — final partners shown at launch.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
                <p className="text-sm text-[var(--color-fg-muted)]">
                  Estimated from
                </p>
                <p className="mt-1 font-display text-4xl font-semibold text-[var(--color-fg)] tnum">
                  $59<span className="text-lg font-normal text-[var(--color-fg-muted)]">/mo</span>
                </p>
                <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">
                  Illustrative example. Subject to approval; terms vary by
                  provider.
                </p>
                <Link
                  href="#book"
                  className={cn(
                    "group mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold",
                    "earth-pill text-[var(--color-accent-fg)]",
                    "transition-transform duration-300 hover:-translate-y-0.5",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
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
