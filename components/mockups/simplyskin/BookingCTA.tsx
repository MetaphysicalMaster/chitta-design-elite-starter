"use client";

/**
 * BookingCTA — the native consultation scheduler. A self-contained, accessible
 * mini-flow (location → treatment → time) that lets a client compose their
 * request inside the page. No backend; once all three are chosen the highest-
 * intent moment surfaces a LIVE next action — a real call to confirm — so the
 * funnel never dead-ends. Quiet luxury: an ink card with one teal accent,
 * generous spacing, fine type. Copy speaks only to the future client.
 */

import { useId, useState } from "react";
import { Reveal } from "./primitives";
import { Magnetic, SplitLines } from "./experience";
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
                "rounded-full border px-4 py-2 text-sm",
                "transition-[color,border-color,background-color,transform] duration-200",
                "active:scale-[0.96] active:duration-100",
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
      className="relative scroll-mt-28 overflow-hidden py-24 sm:py-28"
      style={{ background: "linear-gradient(165deg, var(--ink-1), var(--ink-0))" }}
    >
      {/* skin-glow aura echoing the hero on the ink field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(55% 50% at 84% 4%, oklch(70% 0.035 184 / 0.5), transparent 70%), radial-gradient(50% 50% at 6% 100%, oklch(80% 0.022 70 / 0.45), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow text-[var(--color-accent-bright)]">Reserve your visit</p>
        </Reveal>
        {/* Line-masked title on the ink field — the mask reveal carries the
            moment alone (no container fade fighting it). */}
        <SplitLines
          as="h2"
          className="font-display mx-auto mt-5 max-w-[18ch] text-balance text-white"
          style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
        >
          Reserve your{" "}
          <span className="font-display-em">consultation</span>.
        </SplitLines>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-5 max-w-[46ch] font-light text-white/75">
            Choose a location, a treatment, and a time that suits you — a member
            of our team will confirm with you personally.
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
                    <span className="mt-1 block text-white/60">
                      Call to confirm — we&apos;ll secure your time within one
                      business day.
                    </span>
                  </>
                ) : (
                  "Make your three selections to continue."
                )}
              </p>
              {ready ? (
                // Highest-intent moment gets a LIVE next action (a real call),
                // never a dead-end demo button — with the page's restrained
                // magnetic pull on the final commit.
                <Magnetic strength={0.16}>
                  <a
                    href="tel:+13173481313"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 font-medium transition-all duration-300",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                      "bg-white text-[var(--ink-0)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-18px_oklch(70%_0.035_184_/_0.6)]",
                      "active:translate-y-0 active:scale-[0.985] active:duration-150",
                    )}
                  >
                    Call to confirm
                    <span aria-hidden>→</span>
                  </a>
                </Magnetic>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-white/15 px-7 py-3.5 font-medium text-white/45"
                >
                  Select to book
                  <span aria-hidden>→</span>
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 text-xs text-white/45">
            Prefer to talk? Call{" "}
            <a href="tel:+13173481313" className="tnum text-white/75 underline-offset-2 hover:underline">
              (317) 348-1313
            </a>
            {" "}— we&apos;ll find the right time together.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
