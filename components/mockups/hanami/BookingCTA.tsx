"use client";

/**
 * BookingCTA — the consult-first booking moment. A self-contained,
 * accessible mini-flow (treatment → time → contact) that demonstrates a real
 * booking experience inside the page. No backend; selecting both reveals a
 * confirmation affordance. The decisive friction for a high-ticket buyer is
 * trust + value, so the ready-state resolves the hero's open loop ("the art of
 * becoming begins"), reassures (complimentary first consult, no obligation),
 * carries a sole-injector access cue, and surfaces the real phone line as a
 * first-class secondary action. Botanical: a sumi-black night card with one gold
 * accent, generous spacing, Abel display + Open Sans body.
 *
 * (Single-injector practice → no "choose a provider" step; every booking is with
 * Dr. Phuah, stated plainly.)
 */

import { useState } from "react";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

const TREATMENTS = [
  "Neuromodulators",
  "Dermal Filler",
  "Laser",
  "IPL Photofacial",
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
      <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-bright)]/80">
        {label}
      </legend>
      <div role="radiogroup" aria-label={label} className="mt-3 flex flex-wrap gap-2">
        {options.map((opt, i) => {
          const active = value === opt;
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
                "rounded-full border px-4 py-2 text-sm transition-[border-color,background-color,color,transform] duration-200 active:scale-95",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                active
                  ? "border-[var(--color-accent-bright)] bg-[var(--color-accent-bright)]/22 text-[var(--color-bg)]"
                  : "border-white/22 text-[var(--color-bg)]/75 hover:border-white/45 hover:text-[var(--color-bg)]",
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
  const [treat, setTreat] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const ready = treat && time;

  return (
    <section
      id="book"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
      style={{ background: "linear-gradient(165deg, var(--night-1), var(--night-0))" }}
    >
      {/* This room's OWN aura: a tight GOLD pool centred behind the booking card
          (a warm spotlight on the act-now moment), with a faint coral floor — not
          the corner-pair stamp the other night sections use. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(42% 46% at 50% 52%, oklch(72% 0.11 86 / 0.24), transparent 70%), radial-gradient(60% 40% at 50% 102%, oklch(62% 0.15 9 / 0.22), transparent 74%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow text-[var(--color-accent-bright)]">
            A limited number of new faces each week
          </p>
          <h2
            className="font-display mx-auto mt-5 max-w-[18ch] text-balance text-[var(--color-bg)]"
            style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
          >
            Begin with a conversation.{" "}
            <span className="font-display-em text-[var(--color-accent-bright)]">Every visit, with Dr. Phuah.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] font-light text-[var(--color-bg)]/78">
            Choose a treatment and a time — we&apos;ll confirm with a real person.
            Your first visit is a complimentary consultation, no obligation.{" "}
            <span className="italic text-[var(--color-accent-bright)]">
              The art of becoming begins here.
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 space-y-7 rounded-[1.75rem] border border-white/12 bg-white/[0.05] p-6 text-left backdrop-blur-md sm:p-8">
            <Choice label="Treatment" options={TREATMENTS} value={treat} onChange={setTreat} name="hn-treat" />
            <Choice label="When" options={TIMES} value={time} onChange={setTime} name="hn-time" />

            {/* STACKED, not side-by-side: the status line gets the full row, the
                three pills get their own full-width row beneath. The previous
                row layout made the paragraph and the pills fight over one line
                inside a max-w-3xl card — flex-shrink crushed the gold pill until
                "Call (817) 808-8938" wrapped across four lines and read as a
                broken circle at the PRIMARY conversion moment. Stacking +
                whitespace-nowrap guarantees each label renders on one line at
                every breakpoint. */}
            <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
              <p aria-live="polite" className="text-sm text-[var(--color-bg)]/72">
                {ready ? (
                  <>
                    <span className="text-[var(--color-bg)]">{treat}</span>, with
                    Dr. Phuah · <span className="tnum">{time}</span>.{" "}
                    <span className="italic text-[var(--color-accent-bright)]">
                      Call or text to confirm your slot.
                    </span>
                  </>
                ) : (
                  "Make your two selections — or simply call or text us below."
                )}
              </p>
              {/* Order + weight put REAL conversions first. The phone + text lines
                  are the only working actions (no backend), so the GOLD primary is
                  always the phone call and TEXT is a co-equal always-on path — most
                  women book aesthetics async (a text at 11pm), so phone-only would
                  be the single biggest after-hours leak. The demo "Request this
                  slot" drops to the quiet supporting role. (sm:order keeps the gold
                  pill leftmost.) */}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                {/* The phone line — a REAL working conversion (GOLD primary). */}
                <a
                  href="tel:+18178088938"
                  className={cn(
                    "hn-sheen inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:order-1",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                    "bg-[var(--color-accent)] text-[var(--color-accent-fg)] ring-1 ring-[oklch(88%_0.08_90_/_0.4)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-16px_oklch(78%_0.11_86_/_0.7)]",
                    "active:translate-y-0 active:scale-[0.98]",
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <span className="tnum">{ready ? "Call · (817) 808-8938" : "Call (817) 808-8938"}</span>
                </a>
                {/* The TEXT line — the after-hours path (async > phone for this
                    buyer). Always available; pre-fills the message when a slot is
                    chosen so the buyer's pick travels with the text. */}
                <a
                  href={
                    ready
                      ? `sms:+18178088938?&body=${encodeURIComponent(
                          `Hi Hanami — I'd love to book ${treat} (${time}) with Dr. Phuah.`,
                        )}`
                      : "sms:+18178088938"
                  }
                  className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3.5 font-semibold transition-all duration-300 active:scale-[0.98] sm:order-2",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                    "border border-[var(--color-accent-bright)]/60 text-[var(--color-accent-bright)] hover:border-[var(--color-accent-bright)] hover:bg-[var(--color-accent-bright)]/10",
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                    <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4 3.5V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  Text us
                </a>
                {/* The demo request — supporting affordance (honest, no backend). */}
                <button
                  type="button"
                  disabled={!ready}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3.5 font-medium transition-all duration-300 active:scale-[0.98] sm:order-3",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                    ready
                      ? "border border-white/25 text-[var(--color-bg)] hover:border-white/50 hover:bg-white/10"
                      : "cursor-not-allowed border border-white/12 text-white/40",
                  )}
                >
                  {ready ? "Request this slot" : "Select to request"}
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 text-xs text-[var(--color-bg)]/60">
            Call or text the line above to reserve with Dr. Phuah today — both are
            real. The on-page slot request is a demonstration · no booking is
            submitted online.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
