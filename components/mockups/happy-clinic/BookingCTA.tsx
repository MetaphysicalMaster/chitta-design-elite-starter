"use client";

/**
 * BookingCTA — native "book in 30 seconds" scheduler. A 3-step inline flow
 * (treatment → provider → time) entirely keyboard-accessible, with a live
 * progress meter. Demonstrates the conversion path the current Wix site lacks.
 * Front-end mockup: submit shows an on-brand confirmation state.
 */

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const TREATMENTS = [
  "Botox",
  "Dysport",
  "Juvéderm / filler",
  "Skin & facials",
  "Lasers & energy",
  "Not sure yet",
];
const PROVIDERS = ["Dr. Phil Nguyen", "First available", "No preference"];
const TIMES = ["Morning", "Midday", "Afternoon", "Evening"];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
        active
          ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_8px_22px_-10px_oklch(52%_0.087_178_/_0.85)]"
          : "border border-white/20 bg-white/5 text-white/85 hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}

export function BookingCTA() {
  const prefersReduced = useReducedMotion();
  const formId = useId();
  const [treat, setTreat] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  // The 3 chip selections unlock the final contact step.
  const steps = [treat, provider, time];
  const chipsDone = steps.filter(Boolean).length;
  const picksReady = chipsDone === 3;

  // Progress now spans all 4 steps (3 picks + contact) so the meter reaches
  // 100% only when the demo can actually "text to confirm".
  const contactDone = name.trim().length > 1 && phone.trim().length >= 7;
  const completed = chipsDone + (contactDone ? 1 : 0);
  const progress = (completed / 4) * 100;
  const ready = picksReady && contactDone;

  return (
    <section
      id="book"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
      style={{ background: "linear-gradient(150deg, var(--night-0), var(--night-2))" }}
    >
      <div className="aurora-fallback absolute inset-0 opacity-25" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[oklch(16%_0.05_252_/_0.5)] via-transparent to-[oklch(14%_0.045_252_/_0.6)]"
      />
      <div className="relative mx-auto max-w-3xl px-6 sm:px-8">
        <SectionHeading
          invert
          align="center"
          eyebrow="Book in 30 seconds"
          title={<>Three taps to your naturally younger you.</>}
          lead="No phone tag, no forms to print. Pick a treatment, a provider and a time — we'll confirm by text."
        />

        <div className="mx-auto mt-10 rounded-[1.5rem] border border-white/12 bg-white/5 p-6 backdrop-blur-md sm:p-8">
          {/* progress meter */}
          <div className="mb-7" aria-hidden>
            <div className="flex items-center justify-between text-xs font-medium text-white/60">
              <span>Step {Math.min(completed + (ready ? 0 : 1), 4)} of 4</span>
              <span className="tnum">{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/12">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--color-accent), var(--color-gold))" }}
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: prefersReduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {done ? (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-8 text-center"
              role="status"
            >
              <span
                className="grid h-14 w-14 place-items-center rounded-full text-[var(--color-accent-fg)]"
                style={{ background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-deep))" }}
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                  <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="font-display mt-4 text-2xl font-semibold text-white">
                Thanks{name.trim() ? `, ${name.trim()}` : ""}.
              </p>
              <p className="mt-2 max-w-sm text-sm text-white/70">
                We&rsquo;ll text{" "}
                <span className="tnum font-semibold text-white">{phone.trim()}</span>{" "}
                to confirm your {treat?.toLowerCase()} visit with{" "}
                <span className="font-semibold text-white">{provider}</span> ({time?.toLowerCase()}).
                This is a sample confirmation.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setTreat(null);
                  setProvider(null);
                  setTime(null);
                  setName("");
                  setPhone("");
                }}
                className="mt-6 text-sm font-semibold text-[var(--color-teal-bright)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start over
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (ready) setDone(true);
              }}
              className="flex flex-col gap-7"
            >
              <fieldset className="flex flex-col gap-3">
                <legend id={`${formId}-treat`} className="text-sm font-semibold text-white">
                  1 · What are you interested in?
                </legend>
                <div className="flex flex-wrap gap-2" aria-labelledby={`${formId}-treat`}>
                  {TREATMENTS.map((t) => (
                    <Chip key={t} active={treat === t} onClick={() => setTreat(t)}>
                      {t}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-3">
                <legend id={`${formId}-provider`} className="text-sm font-semibold text-white">
                  2 · Choose your provider
                </legend>
                <div className="flex flex-wrap gap-2" aria-labelledby={`${formId}-provider`}>
                  {PROVIDERS.map((p) => (
                    <Chip key={p} active={provider === p} onClick={() => setProvider(p)}>
                      {p}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-3">
                <legend id={`${formId}-time`} className="text-sm font-semibold text-white">
                  3 · Preferred time
                </legend>
                <div className="flex flex-wrap gap-2" aria-labelledby={`${formId}-time`}>
                  {TIMES.map((t) => (
                    <Chip key={t} active={time === t} onClick={() => setTime(t)}>
                      {t}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              {/* Step 4 — the real lead capture. Gated behind the 3 picks so the
                  flow stays "30-second" but the demo scheduler can actually
                  reach the patient (the whole point of the funnel). */}
              <fieldset
                className={cn(
                  "flex flex-col gap-3 transition-opacity duration-300",
                  picksReady ? "opacity-100" : "opacity-45",
                )}
              >
                <legend className="text-sm font-semibold text-white">
                  4 · Where should we text your confirmation?
                </legend>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label htmlFor={`${formId}-name`} className="sr-only">
                      Your first name
                    </label>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      autoComplete="given-name"
                      required
                      disabled={!picksReady}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="First name"
                      className="rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/45 transition-colors focus:border-[var(--color-accent-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label htmlFor={`${formId}-phone`} className="sr-only">
                      Your mobile number
                    </label>
                    <input
                      id={`${formId}-phone`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      disabled={!picksReady}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile number"
                      className="tnum rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/45 transition-colors focus:border-[var(--color-accent-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={!ready}
                className={cn(
                  "mt-1 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-all duration-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  ready
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:-translate-y-0.5 shadow-[0_18px_50px_-16px_oklch(52%_0.087_178_/_0.9)]"
                    : "cursor-not-allowed bg-white/15 text-white/50",
                )}
              >
                {ready
                  ? "Confirm my appointment"
                  : picksReady
                    ? "Add your name & number to confirm"
                    : "Pick a treatment to continue"}
                {ready && <span aria-hidden>→</span>}
              </button>
              <p className="text-center text-sm text-white/70">
                <span className="font-semibold text-white">No consult fee</span>,
                no phone tag. We text to confirm — usually within the hour.
              </p>
              <p className="text-center text-xs text-white/45">
                Sample scheduler · or call{" "}
                <a href="tel:+17207479999" className="font-semibold text-white/70 underline">
                  (720) 747-9999
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
