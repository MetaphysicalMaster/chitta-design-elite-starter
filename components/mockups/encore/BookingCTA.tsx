"use client";

/**
 * BookingCTA — native "book in 30 seconds" scheduler, replacing the real
 * site's Zocdoc handoff. A lightweight 3-step picker (care path → provider →
 * time) that demonstrates an owned booking experience. Fully keyboard
 * operable; it's a mock that confirms a selection rather than submitting.
 */

import { useState } from "react";
import { Section, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const PATHS = ["Medical Dermatology", "The Spa at Encore"] as const;
const TIMES = ["Tomorrow · 9:00a", "Tomorrow · 1:30p", "Thu · 11:00a", "Fri · 3:45p"];

export function BookingCTA() {
  const [path, setPath] = useState<(typeof PATHS)[number] | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const ready = path && time;

  return (
    <Section
      id="book"
      labelledBy="book-heading"
      // Below the fold: skip off-screen render/paint.
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-bg-deep)] p-8 text-white sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--clinical)] opacity-25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[var(--leaf-deep)] opacity-20 blur-3xl"
          />
          <div className="relative grid gap-10 md:grid-cols-[1fr_1.15fr] md:items-center">
            <div>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--leaf-bright)]">
                Book directly — no detour
              </span>
              <h2
                id="book-heading"
                className="mt-4 font-display text-balance text-white"
                style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
              >
                Reserve in <span className="display-em text-[var(--leaf-bright)]">30 seconds.</span>
              </h2>
              <p className="mt-5 max-w-[40ch] font-light leading-relaxed text-white/75">
                Reserve directly with us — no third-party redirect. Pick a path
                and a time; we&rsquo;ll confirm by text within the hour.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {["Same-week availability", "New patients welcome", "Complimentary aesthetic consults"].map(
                  (t) => (
                    <li
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-white/80"
                    >
                      <span aria-hidden className="text-[var(--leaf-bright)]">✦</span>
                      {t}
                    </li>
                  ),
                )}
              </ul>
              <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
                <span aria-hidden>☎</span>
                Prefer to talk?{" "}
                <a
                  href="tel:+16144421012"
                  className="font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--leaf-bright)]"
                >
                  (614) 442-1012
                </a>
              </p>
            </div>

            {/* Mock scheduler — a bright card seated on the deep panel */}
            <div className="rounded-3xl border border-white/15 bg-white/[0.96] p-6 shadow-[0_30px_70px_-30px_oklch(10%_0.03_210_/_0.7)] sm:p-7">
              <fieldset>
                <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                  1 · Choose your care
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {PATHS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={path === p}
                      onClick={() => setPath(p)}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]",
                        path === p
                          ? "border-[var(--gold)] bg-[var(--color-accent-subtle)] text-[var(--color-fg)]"
                          : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg-subtle)]",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5">
                <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                  2 · Pick a time
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={time === t}
                      onClick={() => setTime(t)}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm font-medium tabular-nums transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]",
                        time === t
                          ? "border-[var(--gold)] bg-[var(--color-accent-subtle)] text-[var(--color-fg)]"
                          : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg-subtle)]",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button
                type="button"
                disabled={!ready}
                className={cn(
                  "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]",
                  ready
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_16px_40px_-14px_oklch(58%_0.094_197_/_0.7)] hover:-translate-y-0.5"
                    : "cursor-not-allowed bg-[var(--color-bg-subtle)] text-[var(--color-fg-subtle)]",
                )}
              >
                {ready ? `Confirm — ${time}` : "Select a path and time"}
              </button>
              <p
                role="status"
                aria-live="polite"
                className="mt-3 min-h-[1.25rem] text-center text-xs text-[var(--color-fg-subtle)]"
              >
                {ready
                  ? `${path} · ${time} — we'd text your confirmation here. (Demo only.)`
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
