"use client";

/**
 * BookingCTA — the native "book in 30 seconds" scheduler. A self-contained,
 * accessible mini-flow (location → treatment → time) that demonstrates a real
 * booking experience inside the page — the antithesis of a Shopify "add to
 * cart". No backend; selecting all three reveals a confirmation affordance.
 * Quiet luxury: an ink card with one teal accent, generous spacing, fine type.
 */

import { useId, useState } from "react";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const LOCATIONS = ["Fishers", "Carmel"];
const TREATMENTS = [
  "Neuromodulators (Tox)",
  "Dermal Filler",
  "Facial Balancing",
  "Skin Rejuvenation",
  "New-client Consultation",
];
const TIMES = ["Tomorrow AM", "Tomorrow PM", "This week", "Next available"];

function Choice({
  label,
  options,
  value,
  onChange,
  name,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
  name: string;
}) {
  const groupId = useId();
  // Roving tabindex: the group is one tab stop; arrows move + select within it.
  const activeIndex = value ? options.indexOf(value) : -1;
  const onKeyNav = (e: React.KeyboardEvent, i: number) => {
    const last = options.length - 1;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i >= last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i <= 0 ? last : i - 1;
    if (next === -1) return;
    e.preventDefault();
    onChange(options[next]);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };
  return (
    <fieldset>
      <legend id={groupId} className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/55">
        {label}
      </legend>
      <div role="radiogroup" aria-labelledby={groupId} className="mt-3 flex flex-wrap gap-2">
        {options.map((opt, i) => {
          const active = value === opt;
          // First option is the fallback tab stop until a choice is made.
          const tabbable = active || (activeIndex === -1 && i === 0);
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={tabbable ? 0 : -1}
              name={name}
              onClick={() => onChange(opt)}
              onKeyDown={(e) => onKeyNav(e, i)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                active
                  ? "border-[var(--color-accent-bright)] bg-[var(--color-accent-bright)]/18 text-white"
                  : "border-white/20 text-white/75 hover:border-white/40 hover:text-white",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function BookingCTA() {
  const [loc, setLoc] = useState<string | null>(null);
  const [treat, setTreat] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const ready = loc && treat && time;

  return (
    <section
      id="book"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
      style={{ background: "linear-gradient(165deg, var(--ink-1), var(--ink-0))" }}
    >
      {/* skin-glow aura echoing the hero on the ink field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(55% 50% at 84% 4%, oklch(70% 0.06 196 / 0.6), transparent 70%), radial-gradient(50% 50% at 6% 100%, oklch(80% 0.04 56 / 0.5), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow text-[var(--color-accent-bright)]">Reserve your visit</p>
          <h2
            className="font-display mx-auto mt-5 max-w-[18ch] text-balance text-white"
            style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
          >
            Book in 30 seconds.{" "}
            <span className="font-display-em">No carts, no clutter.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] font-light text-white/75">
            Choose a studio, a treatment, and a time — we&apos;ll confirm with a
            real person. The effortless booking their old shop template never had.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 space-y-7 rounded-[1.75rem] border border-white/12 bg-white/[0.04] p-6 text-left backdrop-blur-md sm:p-8">
            <Choice label="Location" options={LOCATIONS} value={loc} onChange={setLoc} name="ss-loc" />
            <Choice label="Treatment" options={TREATMENTS} value={treat} onChange={setTreat} name="ss-treat" />
            <Choice label="When" options={TIMES} value={time} onChange={setTime} name="ss-time" />

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className="text-sm text-white/70">
                {ready ? (
                  <>
                    <span className="text-white">{treat}</span> · {loc} ·{" "}
                    <span className="tnum">{time}</span>
                  </>
                ) : (
                  "Make your three selections to continue."
                )}
              </p>
              <button
                type="button"
                disabled={!ready}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-medium transition-all duration-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                  ready
                    ? "bg-white text-[var(--ink-0)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-16px_oklch(70%_0.06_196_/_0.7)]"
                    : "cursor-not-allowed bg-white/15 text-white/45",
                )}
              >
                {ready ? "Confirm request" : "Select to book"}
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 text-xs text-white/45">
            Demonstration scheduler · no booking is submitted. Prefer to talk?
            Call{" "}
            <a href="tel:+13175978625" className="tnum text-white/75 underline-offset-2 hover:underline">
              (317) 597-8625
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
