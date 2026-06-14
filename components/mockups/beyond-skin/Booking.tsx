"use client";

/**
 * Booking — native "book in 30 seconds" scheduler replacing the clunky
 * WellnessLiving redirect + $25 deposit handoff. A real, working 3-step
 * client-side flow (treatment → date/time → confirm) demonstrating that
 * booking can live inside the brand. No external redirect.
 */

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const TREATMENTS = [
  "Complimentary consult",
  "Injectables",
  "Laser & Devices",
  "Signature facial",
  "Membership tour",
];

const TIMES = ["9:30", "11:00", "1:15", "2:45", "4:00", "5:30"];

function nextDays(n: number) {
  const out: { label: string; sub: string; key: string }[] = [];
  const d = new Date(2026, 5, 8); // stable demo week (Mon Jun 8 2026)
  const fmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const fmtD = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  for (let i = 0; i < n; i++) {
    const cur = new Date(d);
    cur.setDate(d.getDate() + i);
    out.push({ label: fmt.format(cur), sub: fmtD.format(cur), key: cur.toISOString() });
  }
  return out;
}

export function Booking() {
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [treatment, setTreatment] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const days = useMemo(() => nextDays(5), []);

  const dayLabel = days.find((d) => d.key === day);
  const canConfirm = treatment && day && time;

  const stepVariants = {
    enter: { opacity: 0, x: prefersReduced ? 0 : 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: prefersReduced ? 0 : -24 },
  };

  return (
    <section
      id="book"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(45% 40% at 100% 0%, var(--color-accent-subtle), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* Pitch copy */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="rule-bronze inline-block text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--gold-deep)]">
              Book Direct
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="font-display mt-5 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.04 }}
            >
              Book in 30 seconds.{" "}
              <span className="text-molten font-em">Right here.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-md text-pretty font-light text-[var(--color-fg-muted)]">
              Begin your journey without leaving the page — native, branded and
              instant. Choose your treatment, pick a time, and you&rsquo;re set.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <ul className="mt-8 space-y-3 text-sm text-[var(--color-fg-muted)]">
              {[
                "Stays on your domain — no jarring third-party page",
                "Real-time availability, instant confirmation",
                "Warm, judgment-free welcome from the first tap",
              ].map((li) => (
                <li key={li} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-[0.7rem] font-bold text-[var(--gold-deep)]"
                  >
                    ✓
                  </span>
                  {li}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* The scheduler */}
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--glass-shadow)] sm:p-8">
              {/* Progress */}
              <div className="mb-7 flex items-center gap-2">
                {["Treatment", "Date & time", "Confirm"].map((label, i) => (
                  <div key={label} className="flex flex-1 items-center gap-2">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                        i <= step
                          ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                          : "bg-[var(--color-bg-subtle)] text-[var(--color-fg-subtle)]",
                      )}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={cn(
                        "hidden text-xs font-medium sm:inline",
                        i <= step ? "text-[var(--color-fg)]" : "text-[var(--color-fg-subtle)]",
                      )}
                    >
                      {label}
                    </span>
                    {i < 2 && (
                      <span className="hidden h-px flex-1 bg-[var(--color-border)] sm:block" />
                    )}
                  </div>
                ))}
              </div>

              <div className="relative min-h-[290px]">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div
                      key="s0"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: prefersReduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="mb-4 text-sm font-medium text-[var(--color-fg)]">
                        What are we booking?
                      </p>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {TREATMENTS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setTreatment(t);
                              setStep(1);
                            }}
                            className={cn(
                              "rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200",
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                              treatment === t
                                ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-fg)]"
                                : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-fg)]",
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div
                      key="s1"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: prefersReduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="mb-4 text-sm font-medium text-[var(--color-fg)]">
                        Pick a day
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {days.map((d) => (
                          <button
                            key={d.key}
                            type="button"
                            onClick={() => setDay(d.key)}
                            className={cn(
                              "flex flex-col items-center rounded-2xl border px-2 py-3 transition-all duration-200",
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                              day === d.key
                                ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]"
                                : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50",
                            )}
                          >
                            <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
                              {d.label}
                            </span>
                            <span className="mt-0.5 text-sm font-bold text-[var(--color-fg)]">
                              {d.sub}
                            </span>
                          </button>
                        ))}
                      </div>

                      <p className="mb-3 mt-6 text-sm font-medium text-[var(--color-fg)]">
                        Available times
                      </p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {TIMES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            disabled={!day}
                            onClick={() => {
                              setTime(t);
                              setStep(2);
                            }}
                            className={cn(
                              "rounded-xl border px-2 py-2.5 text-sm font-medium transition-all duration-200",
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                              "disabled:cursor-not-allowed disabled:opacity-40",
                              time === t
                                ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-fg)]"
                                : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-fg)]",
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="mt-6 text-sm font-medium text-[var(--color-fg-subtle)] underline-offset-4 hover:text-[var(--color-fg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                      >
                        ← Back
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="s2"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: prefersReduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--gold-deep)]">
                          Your appointment
                        </p>
                        <dl className="mt-4 space-y-2.5 text-sm">
                          <div className="flex justify-between gap-4">
                            <dt className="text-[var(--color-fg-muted)]">Treatment</dt>
                            <dd className="font-medium text-[var(--color-fg)]">{treatment}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-[var(--color-fg-muted)]">When</dt>
                            <dd className="font-medium text-[var(--color-fg)]">
                              {dayLabel ? `${dayLabel.label} ${dayLabel.sub}` : "—"} · {time} PM
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-[var(--color-fg-muted)]">Location</dt>
                            <dd className="font-medium text-[var(--color-fg)]">540 Officenter Pl, Gahanna</dd>
                          </div>
                        </dl>
                      </div>

                      <button
                        type="button"
                        disabled={!canConfirm}
                        className={cn(
                          "mt-5 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition-transform duration-300",
                          "bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
                          "hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-fg)]",
                        )}
                      >
                        Confirm booking →
                      </button>
                      <p className="mt-3 text-center text-xs text-[var(--color-fg-subtle)]">
                        Demo flow · illustrative availability
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mt-4 block w-full text-center text-sm font-medium text-[var(--color-fg-subtle)] underline-offset-4 hover:text-[var(--color-fg)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                      >
                        ← Change time
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
