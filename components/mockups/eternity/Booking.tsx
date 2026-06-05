"use client";

/**
 * Booking — the native "book in 30 seconds" scheduler. A refined, branded
 * 3-step mock flow: pick a category → pick a service → pick a time. This is the
 * AFTER for phone-only booking: a native-feeling flow that never leaves the
 * brand and never requires a call. Fully keyboard operable (real radio group +
 * buttons), with a clear confirmation state. Front-end mock; real scheduling
 * wires in at launch (noted honestly). Sits on the deepest night so the chrome
 * form settles. Reduced-motion safe.
 */

import { useId, useState } from "react";
import { SectionHeading, Reveal } from "./primitives";
import { BRAND } from "./nap";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "injectables", label: "Injectables", hint: "Tox · filler · lips" },
  { id: "skin", label: "Skin", hint: "Facials · laser · microneedling" },
  { id: "body", label: "Body", hint: "Contouring · tightening" },
] as const;

const SERVICES: Record<string, string[]> = {
  injectables: ["Neurotoxin (tox)", "Dermal filler", "Lip enhancement", "Cheek & jaw contour"],
  skin: ["Medical facial", "Laser resurfacing", "Microneedling", "Skincare consult"],
  body: ["Body contouring", "Skin tightening", "Cellulite therapy", "Wellness consult"],
};

const TIMES = ["9:30", "11:00", "1:15", "2:45", "4:30", "5:45"];

export function Booking() {
  const groupId = useId();
  const [category, setCategory] = useState<string>(CATEGORIES[0].id);
  const [service, setService] = useState(SERVICES[CATEGORIES[0].id][0]);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const services = SERVICES[category];
  const activeCategory = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];

  const pickCategory = (id: string) => {
    setCategory(id);
    setService(SERVICES[id][0]);
    setTime(null);
  };

  return (
    <section id="book" className="scroll-mt-20 bg-[var(--night-1)] py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Book in 30 seconds"
          title={
            <>
              Reserve your visit —{" "}
              <span className="silver-text">no phone tag.</span>
            </>
          }
          lead="Pick a category, pick your service, pick a time. That's it — a native online booking flow, open 24/7, no calling during business hours."
        />

        <Reveal delay={0.1} className="mt-12">
          <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--night-0)] p-6 shadow-[0_36px_90px_-44px_oklch(6%_0.02_300_/_0.85)] sm:p-9">
            {done ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <span
                  aria-hidden
                  className="grid h-16 w-16 place-items-center rounded-full silver-pill text-2xl text-[var(--color-accent-fg)]"
                >
                  ✓
                </span>
                <h3 className="font-display text-2xl text-[var(--color-fg)]">
                  You&apos;re on the books.
                </h3>
                <p className="max-w-md text-[var(--color-fg-muted)]">
                  {service} at {BRAND.name}
                  {time ? ` · today at ${time}` : ""}. This is a sample
                  confirmation — real scheduling connects on launch.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false);
                    setTime(null);
                  }}
                  className="mt-2 rounded-full border-2 border-[var(--color-accent-bright)] px-6 py-2.5 text-sm font-semibold text-[var(--color-accent-bright)] transition-colors hover:bg-[oklch(34%_0.06_300_/_0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
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
                {/* Step 1 — category */}
                <fieldset>
                  <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-fg)]">
                    <Step n={1} /> Choose a category
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {CATEGORIES.map((c) => {
                      const id = `${groupId}-cat-${c.id}`;
                      const checked = category === c.id;
                      return (
                        <label
                          key={c.id}
                          htmlFor={id}
                          className={cn(
                            "flex cursor-pointer flex-col gap-0.5 rounded-2xl border-2 p-4 transition-colors",
                            checked
                              ? "border-[var(--color-accent-bright)] bg-[oklch(30%_0.05_300_/_0.45)]"
                              : "border-[var(--color-border)] hover:border-[var(--silver-mid)]",
                            "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--color-accent-bright)]",
                          )}
                        >
                          <input
                            id={id}
                            type="radio"
                            name="et-category"
                            value={c.id}
                            checked={checked}
                            onChange={() => pickCategory(c.id)}
                            className="sr-only"
                          />
                          <span className="font-display text-base font-medium text-[var(--color-fg)]">
                            {c.label}
                          </span>
                          <span className="text-xs text-[var(--color-fg-subtle)]">
                            {c.hint}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Step 2 — service */}
                <fieldset>
                  <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-fg)]">
                    <Step n={2} /> Pick your service
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {services.map((s) => {
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
                              ? "border-transparent silver-pill text-[var(--color-accent-fg)]"
                              : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--silver-mid)]",
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
                  <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-fg)]">
                    <Step n={3} /> Pick a time{" "}
                    <span className="font-normal text-[var(--color-fg-subtle)]">
                      (today, sample slots)
                    </span>
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
                              ? "border-[var(--color-accent-bright)] bg-[oklch(30%_0.05_300_/_0.5)] text-[var(--color-fg)]"
                              : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--silver-mid)]",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                          )}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="flex flex-col items-center gap-3 border-t border-[var(--color-border)] pt-7 sm:flex-row sm:justify-between">
                  <p className="text-sm text-[var(--color-fg-muted)]">
                    {service} · {activeCategory.label}
                    {time ? (
                      <span className="font-semibold text-[var(--color-fg)]">
                        {" "}
                        · {time}
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                  <button
                    type="submit"
                    disabled={!time}
                    className={cn(
                      "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition-[transform,box-shadow,opacity] duration-300 sm:w-auto",
                      "silver-pill text-[var(--color-accent-fg)] shadow-[0_18px_48px_-16px_oklch(72%_0.04_300_/_0.6)]",
                      time ? "hover:-translate-y-0.5" : "cursor-not-allowed opacity-50",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                    )}
                  >
                    Confirm my visit
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
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
      className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-[var(--color-accent-fg)] tnum"
    >
      {n}
    </span>
  );
}
