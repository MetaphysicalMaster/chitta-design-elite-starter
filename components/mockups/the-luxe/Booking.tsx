"use client";

/**
 * Booking — native "book in 30 seconds" scheduler that REPLACES the Fresha
 * handoff. A self-contained, accessible 3-step mock (Service → Time → Details)
 * with progress, live selection state and a confirmation. No external redirect:
 * the whole booking lives inside the brand.
 */

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const SERVICES = [
  "Injectables Consult",
  "Botox / Dysport",
  "Morpheus8",
  "BBL HERO / Laser",
  "Medical Weight Loss",
  "IV Therapy",
];
const DAYS = ["Tue 10", "Wed 11", "Thu 12", "Fri 13", "Sat 14"];
const TIMES = ["9:30 AM", "11:00 AM", "1:15 PM", "3:00 PM", "4:30 PM"];

const ease = [0.16, 1, 0.3, 1] as const;

function Pill({
  selected,
  children,
  onClick,
  label,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
        selected
          ? "border-[var(--gold)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] hover:border-[var(--gold)] hover:text-[var(--color-fg)]",
      )}
    >
      {children}
    </button>
  );
}

export function Booking() {
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canNext = step === 0 ? !!service : step === 1 ? !!(day && time) : true;
  const stepLabels = ["Service", "Time", "Details"];

  return (
    <section
      id="book"
      className="grain relative scroll-mt-24 overflow-hidden bg-[var(--color-bg-subtle)] py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(46% 40% at 14% 8%, var(--peach), transparent 64%), radial-gradient(48% 44% at 90% 96%, var(--gold-pale), transparent 66%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-start gap-14 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          eyebrow="Book in 30 Seconds"
          title={
            <>
              No phone tag. No waiting.{" "}
              <span className="gold-leaf italic">Just booked.</span>
            </>
          }
          lead="Scheduling at The Luxe is effortless — native, instant and on-brand. Choose your treatment, pick a time, and you're in. Three taps, complimentary consult."
        />

        {/* Scheduler card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_30px_80px_-50px_oklch(50%_0.04_70_/_0.5)] sm:p-8">
          {/* Progress */}
          <ol className="mb-7 flex items-center gap-2" aria-label="Booking progress">
            {stepLabels.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors",
                    i <= step || done
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                      : "bg-[var(--color-bg-elevated)] text-[var(--color-fg-subtle)]",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-[0.14em]",
                    i <= step || done
                      ? "text-[var(--color-fg)]"
                      : "text-[var(--color-fg-subtle)]",
                  )}
                >
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <span className="ml-1 hidden h-px flex-1 bg-[var(--color-border)] sm:block" />
                )}
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.45, ease }}
                className="py-6 text-center"
                role="status"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)]">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-display mt-5 text-2xl text-[var(--color-fg)]">
                  You&rsquo;re on the books.
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--color-fg-muted)]">
                  {service} · {day} at {time}. A concierge confirmation would
                  arrive by text &amp; email. (This is a sample scheduler.)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false);
                    setStep(0);
                    setService(null);
                    setDay(null);
                    setTime(null);
                  }}
                  className="mt-6 rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
                >
                  Start over
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -10 }}
                transition={{ duration: prefersReduced ? 0 : 0.35, ease }}
              >
                {step === 0 && (
                  <fieldset>
                    <legend className="mb-4 text-sm font-medium text-[var(--color-fg)]">
                      What brings you in?
                    </legend>
                    <div className="flex flex-wrap gap-2.5">
                      {SERVICES.map((s) => (
                        <Pill
                          key={s}
                          label={`Select ${s}`}
                          selected={service === s}
                          onClick={() => setService(s)}
                        >
                          {s}
                        </Pill>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <fieldset>
                      <legend className="mb-3 text-sm font-medium text-[var(--color-fg)]">
                        Pick a day
                      </legend>
                      <div className="flex flex-wrap gap-2.5">
                        {DAYS.map((d) => (
                          <Pill
                            key={d}
                            label={`Select ${d}`}
                            selected={day === d}
                            onClick={() => setDay(d)}
                          >
                            {d}
                          </Pill>
                        ))}
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="mb-3 text-sm font-medium text-[var(--color-fg)]">
                        Pick a time
                      </legend>
                      <div className="flex flex-wrap gap-2.5">
                        {TIMES.map((t) => (
                          <Pill
                            key={t}
                            label={`Select ${t}`}
                            selected={time === t}
                            onClick={() => setTime(t)}
                          >
                            {t}
                          </Pill>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm">
                        <span className="mb-1.5 block font-medium text-[var(--color-fg)]">
                          First name
                        </span>
                        <input
                          type="text"
                          autoComplete="given-name"
                          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-fg)] outline-none transition-colors placeholder:text-[var(--color-fg-subtle)] focus-visible:border-[var(--gold)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--gold-deep)]"
                          placeholder="Ava"
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="mb-1.5 block font-medium text-[var(--color-fg)]">
                          Mobile
                        </span>
                        <input
                          type="tel"
                          autoComplete="tel"
                          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-fg)] outline-none transition-colors placeholder:text-[var(--color-fg-subtle)] focus-visible:border-[var(--gold)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--gold-deep)]"
                          placeholder="(614) 555-0143"
                        />
                      </label>
                    </div>
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm text-[var(--color-fg-muted)]">
                      <span className="font-medium text-[var(--color-fg)]">
                        Your reservation:
                      </span>{" "}
                      {service ?? "—"} · {day ?? "—"} {time ?? ""}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          {!done && (
            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] disabled:opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!canNext}
                onClick={() => (step === 2 ? setDone(true) : setStep((s) => s + 1))}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-[transform,opacity] duration-300",
                  "bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
                  "shadow-[0_14px_40px_-16px_oklch(70%_0.12_78_/_0.6)]",
                  "hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
                )}
              >
                {step === 2 ? "Confirm booking" : "Continue"}
                <span aria-hidden>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
