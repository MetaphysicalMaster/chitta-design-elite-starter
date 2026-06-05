"use client";

/**
 * Booking — the native "book in 30 seconds" scheduler. A real, accessible
 * 3-field flow (treatment · day · time) with a live summary and a final CTA,
 * sitting on the emerald-night surface as the page's conversion anchor. No
 * backend (mockup): submit shows an on-brand confirmation. Fully keyboard
 * operable, labelled fieldsets, reduced-motion safe. NAP pulled from the single
 * source so the address here can never conflict with the footer.
 */

import { useMemo, useState } from "react";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";
import { NAP } from "./nap";

const TREATMENTS = [
  "HydraFacial MD",
  "IPL Photofacial",
  "Body Contouring",
  "Injectables",
  "Consultation",
];

const DAYS = ["Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMES = ["10:00", "11:30", "1:00", "2:30", "4:00", "5:00"];

export function Booking() {
  const [treatment, setTreatment] = useState(TREATMENTS[0]);
  const [day, setDay] = useState(DAYS[0]);
  const [time, setTime] = useState(TIMES[0]);
  const [done, setDone] = useState(false);

  const summary = useMemo(
    () => `${treatment} · ${day} at ${time}`,
    [treatment, day, time],
  );

  return (
    <section
      id="book"
      className="relative overflow-hidden bg-[var(--night-1)] py-24 sm:py-32"
    >
      {/* jewel-light wash so the booking room is lit, never a flat block */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(54% 80% at 18% 24%, oklch(80% 0.1 86 / 0.16), transparent 60%), radial-gradient(60% 90% at 86% 78%, oklch(52% 0.13 162 / 0.24), transparent 62%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        {/* left: the invitation */}
        <Reveal>
          <p className="eyebrow rule-gold text-[var(--gold)]">Reserve</p>
          <h2
            className="font-display mt-5 text-balance text-[var(--color-bg)]"
            style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
          >
            Book in{" "}
            <span className="gold-leaf--bright gold-leaf-anim font-display-em">
              thirty seconds.
            </span>
          </h2>
          <p className="mt-5 max-w-[44ch] text-pretty font-light text-[oklch(90%_0.02_120_/_0.88)]">
            No phone tag, no forms in triplicate. Choose a treatment, pick a day,
            and we&apos;ll confirm your River Oaks appointment by text.
          </p>

          <address className="mt-8 not-italic">
            <p className="font-display text-lg text-[var(--color-bg)]">
              {NAP.name}
            </p>
            <p className="mt-1 text-[0.95rem] text-[oklch(88%_0.02_120_/_0.82)] tnum">
              {NAP.street} · {NAP.city}, {NAP.state} {NAP.zip}
            </p>
            <a
              href={`tel:${NAP.phoneTel}`}
              className="mt-2 inline-block font-medium text-[var(--gold-bright)] underline-offset-4 hover:underline tnum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
            >
              Prefer to call? {NAP.phoneDisplay}
            </a>
          </address>
        </Reveal>

        {/* right: the scheduler card */}
        <Reveal delay={0.1}>
          <div className="rounded-[1.75rem] border border-[var(--glass-border-dark)] bg-[oklch(99%_0.008_92_/_0.97)] p-6 shadow-[0_30px_80px_-30px_oklch(15%_0.05_166_/_0.7)] sm:p-8">
            {done ? (
              <div
                role="status"
                className="flex flex-col items-center py-10 text-center"
              >
                <span
                  aria-hidden
                  className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-2xl text-[var(--color-accent-deep)]"
                >
                  ✓
                </span>
                <h3 className="font-display mt-5 text-2xl text-[var(--color-fg)]">
                  Request received.
                </h3>
                <p className="mt-2 max-w-[34ch] text-[0.95rem] text-[var(--color-fg-muted)]">
                  We&apos;ll text you to confirm{" "}
                  <span className="font-medium text-[var(--color-fg)]">
                    {summary}
                  </span>{" "}
                  shortly. Welcome to Sousan.
                </p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="mt-6 text-sm font-medium text-[var(--color-accent-deep)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
                >
                  Book another
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
                className="space-y-6"
              >
                {/* treatment */}
                <fieldset>
                  <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                    1 · Treatment
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TREATMENTS.map((t) => (
                      <Chip
                        key={t}
                        active={treatment === t}
                        onClick={() => setTreatment(t)}
                      >
                        {t}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                {/* day */}
                <fieldset>
                  <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                    2 · Day
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {DAYS.map((d) => (
                      <Chip key={d} active={day === d} onClick={() => setDay(d)}>
                        {d}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                {/* time */}
                <fieldset>
                  <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                    3 · Time
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TIMES.map((t) => (
                      <Chip
                        key={t}
                        active={time === t}
                        onClick={() => setTime(t)}
                      >
                        {t}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                {/* contact */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Your name" id="bk-name" autoComplete="name" />
                  <Field
                    label="Mobile"
                    id="bk-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                <div className="rounded-xl bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-fg-muted)]">
                  Reserving:{" "}
                  <span className="font-medium text-[var(--color-fg)]">
                    {summary}
                  </span>
                </div>

                <button
                  type="submit"
                  className={cn(
                    "group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5",
                    "bg-[var(--color-accent-deep)] font-semibold text-[var(--color-accent-fg)]",
                    "shadow-[0_18px_46px_-16px_oklch(40%_0.1_164_/_0.6)] transition-transform duration-300 hover:-translate-y-0.5",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
                  )}
                >
                  Request this appointment
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
                <p className="text-center text-[0.75rem] text-[var(--color-fg-subtle)]">
                  Demo scheduler — no appointment is actually booked.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors tnum",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
        active
          ? "border-[var(--color-accent-deep)] bg-[var(--color-accent-deep)] text-[var(--color-accent-fg)]"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] hover:border-[var(--gold-deep)] hover:text-[var(--color-fg)]",
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  id,
  type = "text",
  ...rest
}: {
  label: string;
  id: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      <input
        id={id}
        type={type}
        className={cn(
          "mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[0.95rem] text-[var(--color-fg)]",
          "placeholder:text-[var(--color-fg-subtle)] transition-colors",
          "focus:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
        )}
        {...rest}
      />
    </label>
  );
}
