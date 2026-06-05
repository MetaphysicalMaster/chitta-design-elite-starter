"use client";

/**
 * Booking — the native "book in 30 seconds" scheduler. A real, accessible
 * 3-step flow (reason · day · time) with a live summary and a final CTA, on
 * the navy-night surface as the page's conversion anchor. No backend (mockup):
 * submit shows an on-brand confirmation. Fully keyboard operable, labelled
 * fieldsets, reduced-motion safe. NAP pulled from the single source so the
 * address here can never conflict with the footer — closing the trust gap the
 * live site's scattered, keyword-stuffed listings created.
 */

import { useEffect, useMemo, useState } from "react";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";
import { NAP } from "./nap";
import {
  BOOKING_INTENT_EVENT,
  consumeBookingReason,
  reasonForIntent,
  type BookingIntent,
} from "./bookingIntent";

// Both paths granular: the medical buyer AND the high-ticket aesthetics buyer
// each see their specific want, so the funnel reads as "the place for me",
// not a medical-only intake.
const REASONS = [
  "Skin check / screening",
  "Spot or lesion",
  "Acne / eczema / rash",
  "Injectables (Botox / filler)",
  "Laser & skin rejuvenation",
  "Cosmetic consult",
  "Vein evaluation",
];

// The elective/cosmetic reasons get a quiet reassurance line in the scheduler.
const ELECTIVE = new Set([
  "Injectables (Botox / filler)",
  "Laser & skin rejuvenation",
  "Cosmetic consult",
]);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["8:30", "9:30", "11:00", "1:30", "3:00", "4:00"];

export function Booking() {
  const [reason, setReason] = useState(REASONS[0]);
  const [day, setDay] = useState(DAYS[0]);
  const [time, setTime] = useState(TIMES[0]);
  // Which of the two REAL offices (Charlotte / Monroe) — a two-city practice,
  // so the scheduler must let her pick where to be seen. Default = primary.
  const [officeIdx, setOfficeIdx] = useState(0);
  const office = NAP.locations[officeIdx];
  const [done, setDone] = useState(false);

  // Honor an aesthetic CTA's intent: consume any pending sessionStorage handoff
  // on mount, AND listen for same-page clicks via the custom event, so "Book an
  // aesthetic consult" pre-selects HER elective reason instead of the default
  // skin-check. (Decoupled from hash/URL → robust under reduced-motion too.)
  useEffect(() => {
    const pending = consumeBookingReason();
    if (pending) setReason(pending);

    const onIntent = (e: Event) => {
      const detail = (e as CustomEvent<BookingIntent>).detail;
      if (detail) setReason(reasonForIntent(detail));
    };
    window.addEventListener(BOOKING_INTENT_EVENT, onIntent);
    return () => window.removeEventListener(BOOKING_INTENT_EVENT, onIntent);
  }, []);

  const summary = useMemo(
    () => `${reason} · ${office.city} · ${day} at ${time}`,
    [reason, office.city, day, time],
  );

  return (
    <section
      id="book"
      aria-labelledby="book-title"
      className="relative overflow-hidden bg-[var(--night-0)] py-24 sm:py-32"
    >
      {/* depth wash — deliberately a DIFFERENT room from the Credentials closer:
          a warmer brown-weighted floor (origins flipped right→left) so the two
          dark sections read as distinct beats, not the same room twice. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 84% at 82% 18%, oklch(46% 0.06 58 / 0.28), transparent 60%), radial-gradient(54% 80% at 12% 86%, oklch(52% 0.07 196 / 0.14), transparent 62%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        {/* left: the invitation */}
        <Reveal>
          <p className="eyebrow rule-accent text-[var(--color-accent-bright)]">
            Reserve
          </p>
          <h2
            id="book-title"
            className="font-display mt-5 text-balance text-[var(--color-bg)]"
            style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.07 }}
          >
            Book in{" "}
            <span className="font-display-em text-[var(--color-accent-bright)]">
              thirty seconds.
            </span>
          </h2>
          <p className="mt-5 max-w-[44ch] text-pretty font-light text-[oklch(88%_0.025_70_/_0.88)]">
            No phone tag, no portal maze. Tell us why you&rsquo;re coming, choose
            your office, pick a day, and we&rsquo;ll confirm your{" "}
            {office.city} appointment by text.
          </p>

          {/* The address reflects the office she picks on the right — two REAL
              North Carolina locations (Charlotte · Monroe), one clean listing
              each, never a single-city NAP on a two-city practice. */}
          <address className="mt-8 not-italic">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[oklch(80%_0.04_64_/_0.7)]">
              {NAP.name} · {NAP.cities}
            </p>
            <p className="mt-2 font-display text-lg text-[var(--color-bg)]">
              {office.city} office
            </p>
            <p className="mt-1 text-[0.95rem] text-[oklch(86%_0.025_70_/_0.82)] tnum">
              {office.street} · {office.city}, {office.state} {office.zip}
            </p>
            <p className="mt-0.5 text-[0.9rem] text-[oklch(82%_0.025_70_/_0.7)]">
              {NAP.hours}
            </p>
            <a
              href={`tel:${office.phoneTel}`}
              className="mt-2 inline-block font-medium text-[var(--color-accent-bright)] underline-offset-4 hover:underline tnum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
            >
              Prefer to call? {office.phoneDisplay}
            </a>
          </address>
        </Reveal>

        {/* right: the scheduler card */}
        <Reveal delay={0.1}>
          <div className="rounded-[1.5rem] border border-[var(--glass-border-dark)] bg-[oklch(99%_0.004_72_/_0.98)] p-6 shadow-[0_30px_80px_-30px_oklch(17%_0.03_54_/_0.7)] sm:p-8">
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
                  We&rsquo;ll text you to confirm{" "}
                  <span className="font-medium text-[var(--color-fg)]">
                    {summary}
                  </span>{" "}
                  shortly. Welcome to Darst Dermatology.
                </p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="mt-6 text-sm font-medium text-[var(--color-accent-deep)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
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
                <fieldset>
                  <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    1 · Which office?
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {NAP.locations.map((loc, i) => (
                      <Chip
                        key={loc.city}
                        active={officeIdx === i}
                        onClick={() => setOfficeIdx(i)}
                      >
                        {loc.city}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    2 · Reason for visit
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {REASONS.map((r) => (
                      <Chip
                        key={r}
                        active={reason === r}
                        onClick={() => setReason(r)}
                      >
                        {r}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    3 · Day
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {DAYS.map((d) => (
                      <Chip key={d} active={day === d} onClick={() => setDay(d)}>
                        {d}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    4 · Time
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

                {ELECTIVE.has(reason) && (
                  <p className="flex items-start gap-2 rounded-xl border border-[var(--color-coral-subtle)] bg-[var(--color-coral-subtle)] px-4 py-3 text-[0.85rem] leading-relaxed text-[var(--color-fg-muted)]">
                    <span
                      aria-hidden
                      className="mt-0.5 text-[var(--color-coral-deep)]"
                    >
                      ✦
                    </span>
                    <span>
                      Your consult is unhurried and quoted up front — Dr. Darst
                      plans the result with you, with no surprise add-ons.
                    </span>
                  </p>
                )}

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
                    "shadow-[0_16px_44px_-16px_oklch(48%_0.082_197_/_0.6)] transition-transform duration-300 hover:-translate-y-0.5",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
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
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
        active
          ? "border-[var(--color-accent-deep)] bg-[var(--color-accent-deep)] text-[var(--color-accent-fg)]"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent-deep)] hover:text-[var(--color-fg)]",
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
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      <input
        id={id}
        type={type}
        className={cn(
          "mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[0.95rem] text-[var(--color-fg)]",
          "placeholder:text-[var(--color-fg-subtle)] transition-colors",
          "focus:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
        )}
        {...rest}
      />
    </label>
  );
}
