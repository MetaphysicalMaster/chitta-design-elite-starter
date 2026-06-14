"use client";

/**
 * BookingCTA — native-feeling "book in 30 seconds" flow. Replaces the real
 * site's third-party Vagaro redirect with an on-brand 3-step inline scheduler
 * mockup (non-functional UI, clearly a prototype). Includes the AuroraGradient
 * effect from the shared library as an ambient backdrop.
 */

import { AuroraGradient } from "@/components/effects/aurora-gradient";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const STEPS = ["Choose a treatment", "Pick a time", "You're booked"];

const TREATMENTS = ["Botox", "Filler", "Microneedling", "IV Therapy", "Facial", "Consult"];
const SLOTS = ["Tue 10:00", "Tue 2:30", "Wed 9:15", "Thu 11:45", "Fri 1:00", "Sat 10:30"];

export function BookingCTA() {
  const [step, setStep] = useState(0);
  const [treatment, setTreatment] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="book"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
    >
      {/* Ambient aurora — shared effect, pure CSS, SSR-safe */}
      <div aria-hidden className="absolute inset-0 opacity-50">
        <AuroraGradient
          colors={["#dcebfb", "#f6e6c8", "#bfd8f1", "#ecdce4", "#cfe4fa"]}
          blur={92}
          className="h-full w-full"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/60 via-[var(--color-bg)]/20 to-[var(--color-bg)]/70" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1fr_minmax(0,32rem)]">
        <Reveal>
          <div>
            <p className="rule-gold text-xs font-semibold uppercase tracking-[0.22em] text-accent-deep">
              Booking, reinvented
            </p>
            <h2
              className="font-display mt-4 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06, fontWeight: 400 }}
            >
              Book your visit in
              <span className="italic"> about 30 seconds.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty text-[1.0625rem] leading-relaxed text-[var(--color-fg-muted)]">
              No redirects, no clunky third-party portals. Choose your treatment,
              pick a time that works, and you&rsquo;re set &mdash; right here.
            </p>
            <ul className="mt-7 space-y-3">
              {["Real-time availability", "Instant confirmation", "Friendly reminders by text"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[var(--color-fg)]">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                    <path d="m4 10 4 4 8-9" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Mock scheduler card */}
        <Reveal delay={0.1}>
          <div className="glass-strong rounded-[1.75rem] p-6 shadow-[var(--glass-shadow)] sm:p-8">
            {/* stepper */}
            <ol className="mb-6 flex items-center gap-2" aria-label="Booking progress">
              {STEPS.map((s, i) => (
                <li key={s} className="flex flex-1 items-center gap-2">
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors",
                      i <= step ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "bg-[var(--color-bg-subtle)] text-[var(--color-fg-subtle)]",
                    )}
                    aria-current={i === step ? "step" : undefined}
                  >
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className={cn("h-px flex-1 transition-colors", i < step ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]")} />
                  )}
                </li>
              ))}
            </ol>

            <p className="mb-4 text-sm font-semibold text-[var(--color-fg)]">{STEPS[step]}</p>

            {step === 0 && (
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
              >
                {TREATMENTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTreatment(t);
                      setStep(1);
                    }}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                      treatment === t
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-fg)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
              >
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSlot(s);
                      setStep(2);
                    }}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-3 text-sm font-medium text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-center"
              >
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-success)]/15">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
                    <path d="m5 13 4 4 10-11" stroke="var(--color-success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="font-display mt-4 text-xl text-[var(--color-fg)]">You&rsquo;re booked!</p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                  {treatment} &middot; {slot}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setTreatment(null);
                    setSlot(null);
                  }}
                  className="mt-5 text-sm font-medium text-accent-deep underline-offset-4 hover:underline"
                >
                  Start over
                </button>
              </motion.div>
            )}

            {step > 0 && step < 2 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="mt-5 text-sm font-medium text-[var(--color-fg-muted)] underline-offset-4 hover:underline"
              >
                ← Back
              </button>
            )}

            <p className="mt-6 text-center text-[0.7rem] text-[var(--color-fg-subtle)]">
              Interactive prototype — illustrates native booking, no real appointment is made.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
