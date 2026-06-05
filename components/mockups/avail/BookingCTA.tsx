"use client";

/**
 * BookingCTA — native "book in 30 seconds" scheduler. A 3-step inline flow
 * (location → treatment → time) entirely keyboard-accessible, with a live
 * progress meter. Demonstrates the conversion path the current site lacks.
 * It's a front-end mockup: submit shows an on-brand confirmation state.
 */

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const LOCATIONS = ["Cary", "Raleigh", "Wake Forest", "Asheville"];
const TREATMENTS = [
  "Injectables",
  "Lasers & Energy",
  "Body Contouring",
  "Skin & Facials",
  "Wellness",
  "Not sure yet",
];
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
          ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_8px_22px_-10px_oklch(52%_0.2_264_/_0.8)]"
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
  const [loc, setLoc] = useState<string | null>(null);
  const [treat, setTreat] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const steps = [loc, treat, time];
  const completed = steps.filter(Boolean).length;
  const progress = (completed / 3) * 100;
  const ready = completed === 3;

  return (
    <section
      id="book"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
      style={{ background: "linear-gradient(150deg, var(--graphite-0), var(--graphite-2))" }}
    >
      <div className="slipstream-fallback absolute inset-0 opacity-30" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[oklch(16%_0.02_262_/_0.5)] via-transparent to-[oklch(15%_0.02_262_/_0.6)]"
      />
      <div className="relative mx-auto max-w-3xl px-6 sm:px-8">
        <SectionHeading
          invert
          align="center"
          eyebrow="Book in 30 seconds"
          title={<>Three taps to your appointment.</>}
          lead="No phone tag, no forms to print. Pick a location, a treatment area and a time — we'll confirm by text."
        />

        <div className="mx-auto mt-10 rounded-[1.5rem] border border-white/12 bg-white/5 p-6 backdrop-blur-md sm:p-8">
          {/* progress meter */}
          <div className="mb-7" aria-hidden>
            <div className="flex items-center justify-between text-xs font-medium text-white/60">
              <span>Step {Math.min(completed + (ready ? 0 : 1), 3)} of 3</span>
              <span className="tnum">{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/12">
              <motion.div
                className="h-full rounded-full bg-[var(--color-accent)]"
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
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)]">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                  <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="font-display mt-4 text-2xl font-semibold text-white">Request sent.</p>
              <p className="mt-2 max-w-sm text-sm text-white/70">
                We&rsquo;ll text you to confirm your {treat?.toLowerCase()} visit in{" "}
                <span className="font-semibold text-white">{loc}</span> ({time?.toLowerCase()}).
                This is a sample confirmation.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setLoc(null);
                  setTreat(null);
                  setTime(null);
                }}
                className="mt-6 text-sm font-semibold text-[var(--color-accent-bright)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
                <legend id={`${formId}-loc`} className="text-sm font-semibold text-white">
                  1 · Choose a location
                </legend>
                <div className="flex flex-wrap gap-2" aria-labelledby={`${formId}-loc`}>
                  {LOCATIONS.map((l) => (
                    <Chip key={l} active={loc === l} onClick={() => setLoc(l)}>
                      {l}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-3">
                <legend id={`${formId}-treat`} className="text-sm font-semibold text-white">
                  2 · What are you interested in?
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

              <button
                type="submit"
                disabled={!ready}
                className={cn(
                  "mt-1 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-all duration-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  ready
                    ? "bg-white text-[var(--color-fg)] hover:-translate-y-0.5 shadow-[0_18px_50px_-16px_oklch(60%_0.18_264_/_0.7)]"
                    : "cursor-not-allowed bg-white/15 text-white/50",
                )}
              >
                {ready ? "Confirm my appointment" : "Complete all three steps"}
                {ready && <span aria-hidden>→</span>}
              </button>
              <p className="text-center text-xs text-white/45">
                Sample scheduler · or call{" "}
                <a href="tel:+19193225440" className="font-semibold text-white/70 underline">
                  (919) 322-5440
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
