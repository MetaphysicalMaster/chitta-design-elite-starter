"use client";

/**
 * Booking — the native "book your glow in 30 seconds" scheduler. A friendly,
 * 3-step mock flow: pick your bar → pick a service → pick a time. Fully keyboard
 * operable (real radio groups + buttons), with a clear confirmation state. This
 * is a front-end mock: real scheduling wires in at launch (noted honestly). Sits
 * on the brand black so the glossy hot-pink form pops. Reduced-motion safe.
 */

import { useId, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";
import { LOCATIONS, PRIMARY_PHONE_DISPLAY, PRIMARY_PHONE_TEL } from "./nap";
import { cn } from "@/lib/utils";

const SERVICES = [
  "The Classic Pour",
  "Filler Flight",
  "Lip Service",
  "The Glow Pour",
  "Peptide Bar",
];

/* AM/PM-tagged so a med-spa booking across morning + afternoon is unambiguous. */
const TIMES = ["9:30 AM", "11:00 AM", "1:15 PM", "2:45 PM", "4:30 PM", "5:45 PM"];

export function Booking() {
  const groupId = useId();
  const [loc, setLoc] = useState(LOCATIONS[0].id);
  const [service, setService] = useState(SERVICES[0]);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const activeLoc = LOCATIONS.find((l) => l.id === loc) ?? LOCATIONS[0];

  return (
    <section id="book" className="scroll-mt-20 bg-[var(--night-1)] py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          tone="dark"
          eyebrow="Book in 30 seconds"
          title={
            <>
              Grab your seat at the <span className="candy-text--bright">bar.</span>
            </>
          }
          lead="Pick a bar, pick your pour, pick a time. That's it. No phone tag, no forms from 2009."
        />

        <Reveal delay={0.1} className="mt-12">
          <div className="rounded-[1.75rem] border border-[var(--glass-border-dark)] bg-[var(--night-0)] p-6 shadow-[0_30px_80px_-40px_oklch(14%_0.02_350_/_0.8)] sm:p-9">
            {done ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <span
                  aria-hidden
                  className="grid h-16 w-16 place-items-center rounded-full gloss-pill text-2xl text-[var(--color-accent-fg)]"
                >
                  ✓
                </span>
                <h3 className="font-display text-2xl text-[var(--color-bg)]">
                  You&apos;re on the books!
                </h3>
                <p className="max-w-md text-[oklch(92%_0.008_350_/_0.86)]">
                  {service} at Beautox Bar {activeLoc.city}
                  {time ? ` · your requested ${time} slot` : ""}. This is a sample
                  confirmation — real scheduling connects on launch.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false);
                    setTime(null);
                  }}
                  className="mt-2 rounded-full border-2 border-[var(--color-accent-bright)] px-6 py-2.5 text-sm font-semibold text-[var(--color-accent-bright)] transition-colors hover:bg-[oklch(28%_0.04_356_/_0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                >
                  Start over
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
                className="flex flex-col gap-8"
              >
                {/* Step 1 — bar */}
                <fieldset>
                  <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-bg)]">
                    <Step n={1} /> Pick your bar
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {LOCATIONS.map((l) => {
                      const id = `${groupId}-loc-${l.id}`;
                      const checked = loc === l.id;
                      return (
                        <label
                          key={l.id}
                          htmlFor={id}
                          className={cn(
                            "flex cursor-pointer flex-col gap-0.5 rounded-2xl border-2 p-4 transition-colors",
                            checked
                              ? "border-[var(--color-accent-bright)] bg-[oklch(28%_0.04_356_/_0.45)]"
                              : "border-[var(--glass-border-dark)] hover:border-[var(--lilac-bright)]",
                            "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--color-accent-bright)]",
                          )}
                        >
                          <input
                            id={id}
                            type="radio"
                            name="bx-loc"
                            value={l.id}
                            checked={checked}
                            onChange={() => setLoc(l.id)}
                            className="sr-only"
                          />
                          <span className="font-display text-base text-[var(--color-bg)]">
                            {l.city}
                          </span>
                          <span className="text-xs text-[oklch(86%_0.008_350_/_0.78)]">
                            {l.happyHour}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Step 2 — service */}
                <fieldset>
                  <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-bg)]">
                    <Step n={2} /> Pick your pour
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {SERVICES.map((s) => {
                      const checked = service === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={checked}
                          onClick={() => setService(s)}
                          className={cn(
                            "rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors",
                            checked
                              ? "border-transparent gloss-pill text-[var(--color-accent-fg)]"
                              : "border-[var(--glass-border-dark)] text-[oklch(92%_0.008_350_/_0.86)] hover:border-[var(--lilac-bright)]",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Step 3 — time */}
                <fieldset>
                  <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-bg)]">
                    <Step n={3} /> Pick a time <span className="font-normal text-[oklch(80%_0.008_350_/_0.7)]">(sample slots)</span>
                  </legend>
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                    {TIMES.map((t) => {
                      const checked = time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={checked}
                          onClick={() => setTime(t)}
                          className={cn(
                            "rounded-xl border-2 py-2.5 text-sm font-semibold tnum transition-colors",
                            checked
                              ? "border-[var(--color-accent-bright)] bg-[oklch(28%_0.04_356_/_0.5)] text-[var(--color-bg)]"
                              : "border-[var(--glass-border-dark)] text-[oklch(92%_0.008_350_/_0.86)] hover:border-[var(--lilac-bright)]",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                          )}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="flex flex-col items-center gap-3 border-t border-[var(--glass-border-dark)] pt-7 sm:flex-row sm:justify-between">
                  <p className="text-sm text-[oklch(90%_0.008_350_/_0.82)]">
                    {service} · {activeLoc.city}
                    {time ? <span className="font-semibold text-[var(--color-bg)]"> · {time}</span> : ""}
                  </p>
                  <button
                    type="submit"
                    disabled={!time}
                    className={cn(
                      "group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-[transform,box-shadow,opacity] duration-300 sm:w-auto",
                      "gloss-pill text-[var(--color-accent-fg)] shadow-[0_18px_48px_-16px_oklch(60%_0.16_356_/_0.6)]",
                      time
                        ? "hover:-translate-y-0.5"
                        : "cursor-not-allowed opacity-50",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                    )}
                  >
                    Confirm my glow
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </button>
                </div>

                {/* Risk-reversal at the commit moment — the genuine free,
                    no-pressure consult (true offer, also in Meet) removes the
                    first-injectable fear right where the decision happens. */}
                <p className="-mt-3 flex items-center justify-center gap-2 text-center text-sm text-[oklch(90%_0.008_350_/_0.82)]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--color-accent-bright)]" fill="none" aria-hidden>
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Your first visit is a free, no-pressure consult — first-timers welcome.
                </p>

                {/* This audience books by text — give them the real fast lane
                    alongside the form. Honest: connects to the live scheduler on launch. */}
                <p className="-mt-2 text-center text-sm text-[oklch(86%_0.008_350_/_0.78)]">
                  Prefer to text?{" "}
                  <a
                    href={`sms:${PRIMARY_PHONE_TEL}`}
                    className="font-semibold tnum text-[var(--color-accent-bright)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                  >
                    {PRIMARY_PHONE_DISPLAY}
                  </a>{" "}
                  · we&apos;ll save your stool. <span className="text-[oklch(78%_0.008_350_/_0.6)]">(Sample — connects to the live scheduler on launch.)</span>
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-[var(--color-accent-fg)]"
    >
      {n}
    </span>
  );
}
