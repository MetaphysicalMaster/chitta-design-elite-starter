"use client";

/**
 * Booking — the native "book your glow in 30 seconds" scheduler. A friendly,
 * 3-step mock flow: pick your bar → pick a service → pick a time. Fully keyboard
 * operable (real radio groups + buttons), with a clear confirmation state. This
 * is a front-end mock: real scheduling wires in at launch (noted honestly). Sits
 * on the candy-night so the glossy form pops. Reduced-motion safe.
 */

import { useId, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";
import { LOCATIONS } from "./nap";
import { cn } from "@/lib/utils";

const SERVICES = [
  "The Classic Tox",
  "Filler Flight",
  "Lip Service",
  "The Glow Pour",
  "Tox + Glow Happy Hour",
];

const TIMES = ["9:30", "11:00", "1:15", "2:45", "4:30", "5:45"];

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
          <div className="rounded-[1.75rem] border border-[var(--glass-border-dark)] bg-[var(--night-0)] p-6 shadow-[0_30px_80px_-40px_oklch(20%_0.1_330_/_0.8)] sm:p-9">
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
                <p className="max-w-md text-[oklch(92%_0.03_330_/_0.86)]">
                  {service} at Beautox Bar {activeLoc.city}
                  {time ? ` · today at ${time}` : ""}. This is a sample confirmation
                  — real scheduling connects on launch.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false);
                    setTime(null);
                  }}
                  className="mt-2 rounded-full border-2 border-[var(--candy-pink)] px-6 py-2.5 text-sm font-semibold text-[var(--candy-pink)] transition-colors hover:bg-[oklch(30%_0.1_328_/_0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--candy-pink)]"
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
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                              ? "border-[var(--candy-pink)] bg-[oklch(30%_0.1_328_/_0.45)]"
                              : "border-[var(--glass-border-dark)] hover:border-[var(--lilac-bright)]",
                            "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--candy-pink)]",
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
                          <span className="text-xs text-[oklch(86%_0.03_330_/_0.78)]">
                            {l.status === "coming-soon" ? "Waitlist · opening 2026" : l.hours}
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
                              : "border-[var(--glass-border-dark)] text-[oklch(92%_0.03_330_/_0.86)] hover:border-[var(--lilac-bright)]",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--candy-pink)]",
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
                    <Step n={3} /> Pick a time <span className="font-normal text-[oklch(80%_0.03_330_/_0.7)]">(today, sample slots)</span>
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
                              ? "border-[var(--candy-pink)] bg-[oklch(30%_0.1_328_/_0.5)] text-[var(--color-bg)]"
                              : "border-[var(--glass-border-dark)] text-[oklch(92%_0.03_330_/_0.86)] hover:border-[var(--lilac-bright)]",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--candy-pink)]",
                          )}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="flex flex-col items-center gap-3 border-t border-[var(--glass-border-dark)] pt-7 sm:flex-row sm:justify-between">
                  <p className="text-sm text-[oklch(90%_0.03_330_/_0.82)]">
                    {service} · {activeLoc.city}
                    {time ? <span className="font-semibold text-[var(--color-bg)]"> · {time}</span> : ""}
                  </p>
                  <button
                    type="submit"
                    disabled={!time}
                    className={cn(
                      "group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-[transform,box-shadow,opacity] duration-300 sm:w-auto",
                      "gloss-pill text-[var(--color-accent-fg)] shadow-[0_18px_48px_-16px_oklch(60%_0.24_352_/_0.6)]",
                      time
                        ? "hover:-translate-y-0.5"
                        : "cursor-not-allowed opacity-50",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--candy-pink)]",
                    )}
                  >
                    Confirm my glow
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </button>
                </div>
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
