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
    <Section id="book" labelledBy="book-heading">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-deep)] p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--clinical-deep)] opacity-25 blur-3xl"
          />
          <div className="relative grid gap-10 md:grid-cols-[1fr_1.15fr] md:items-center">
            <div>
              <span className="rule-gold text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]">
                No Zocdoc detour
              </span>
              <h2
                id="book-heading"
                className="mt-4 font-display text-balance text-[var(--color-fg)]"
                style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
              >
                Book in <span className="italic">30 seconds.</span>
              </h2>
              <p className="mt-5 max-w-[40ch] font-light leading-relaxed text-[var(--color-fg-muted)]">
                Reserve directly with us — no third-party redirect. Pick a path
                and a time; we&rsquo;ll confirm by text within the hour.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {["Same-week availability", "New patients welcome", "Complimentary aesthetic consults"].map(
                  (t) => (
                    <li
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]/50 px-3 py-1 text-xs text-[var(--color-fg-muted)]"
                    >
                      <span aria-hidden className="text-[var(--gold)]">✦</span>
                      {t}
                    </li>
                  ),
                )}
              </ul>
              <p className="mt-6 flex items-center gap-2 text-sm text-[var(--color-fg-subtle)]">
                <span aria-hidden>☎</span>
                Prefer to talk?{" "}
                <a
                  href="tel:+16144421012"
                  className="font-semibold text-[var(--color-fg)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                >
                  (614) 442-1012
                </a>
              </p>
            </div>

            {/* Mock scheduler */}
            <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] p-6 backdrop-blur-md sm:p-7">
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
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_16px_40px_-14px_oklch(82%_0.1_84_/_0.6)] hover:-translate-y-0.5"
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
