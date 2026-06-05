"use client";

/**
 * BookingCTA — the native "book in 30 seconds" scheduler. A self-contained,
 * accessible mini-flow (physician → treatment → time) that demonstrates a real
 * booking experience inside the page — the antithesis of an EMR "request
 * appointment" form-dump. No backend; selecting all three reveals a
 * confirmation affordance. Heirloom: an aubergine card with one brass accent,
 * generous spacing, fine type.
 */

import { useState } from "react";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const PHYSICIANS = ["Dr. McCarren", "Dr. Heuker", "First available"];
const TREATMENTS = [
  "Injectables",
  "Dermal Filler",
  "Secret RF",
  "Laser & Energy",
  "Medical Skin",
  "Consultation",
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
      <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--brass-pale)]/70">
        {label}
      </legend>
      <div role="radiogroup" aria-label={label} className="mt-3 flex flex-wrap gap-2">
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
                  ? "border-[var(--color-accent-bright)] bg-[var(--color-accent-bright)]/18 text-[var(--color-bg)]"
                  : "border-white/20 text-[var(--color-bg)]/75 hover:border-white/40 hover:text-[var(--color-bg)]",
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
  const [doc, setDoc] = useState<string | null>(null);
  const [treat, setTreat] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const ready = doc && treat && time;

  return (
    <section
      id="book"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
      style={{ background: "linear-gradient(165deg, var(--ink-1), var(--ink-0))" }}
    >
      {/* brass aura echoing the hero on the aubergine field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          background:
            "radial-gradient(55% 50% at 84% 4%, oklch(64% 0.09 78 / 0.6), transparent 70%), radial-gradient(50% 50% at 6% 100%, oklch(48% 0.1 52 / 0.5), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow text-[var(--color-accent-bright)]">Reserve your visit</p>
          <h2
            className="font-display mx-auto mt-5 max-w-[18ch] text-balance text-[var(--color-bg)]"
            style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.04 }}
          >
            Book in 30 seconds.{" "}
            <span className="font-display-em">No forms, no clutter.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] font-light text-[var(--color-bg)]/78">
            Choose a physician, a treatment, and a time — we&apos;ll confirm with a
            real person. The effortless booking their EMR template never had.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 space-y-7 rounded-[1.75rem] border border-white/12 bg-white/[0.04] p-6 text-left backdrop-blur-md sm:p-8">
            <Choice label="Physician" options={PHYSICIANS} value={doc} onChange={setDoc} name="tl-doc" />
            <Choice label="Treatment" options={TREATMENTS} value={treat} onChange={setTreat} name="tl-treat" />
            <Choice label="When" options={TIMES} value={time} onChange={setTime} name="tl-time" />

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className="text-sm text-[var(--color-bg)]/72">
                {ready ? (
                  <>
                    <span className="text-[var(--color-bg)]">{treat}</span> · {doc} ·{" "}
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
                    ? "bg-[var(--color-bg)] text-[var(--ink-0)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-16px_oklch(64%_0.09_78_/_0.7)]"
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
          <p className="mt-6 text-xs text-[var(--color-bg)]/45">
            Demonstration scheduler · no booking is submitted. Prefer to talk?
            Call{" "}
            <a href="tel:+15134519600" className="tnum text-[var(--brass-pale)]/85 underline-offset-2 hover:underline">
              (513) 451-9600
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
