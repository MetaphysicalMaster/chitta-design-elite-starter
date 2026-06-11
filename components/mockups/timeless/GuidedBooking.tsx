"use client";

/**
 * GuidedBooking — THE SIGNATURE ELEMENT.
 *
 * The program owner's directive: "Keep + elevate their FAQ chat-bot into a
 * guided booking walkthrough." The live site has a bottom-right "CHAT LIVE NOW"
 * bot; this replaces it with a polished, on-brand (orange) GUIDED BOOKING widget
 * — a friendly, conversational, multi-step walkthrough that takes a visitor from
 * "I'm curious" to "I'm booked" without a form-dump or a phone tag.
 *
 * Shape:
 *   · A floating bottom-right LAUNCHER (a warm orange chat pill with a soft
 *     bokeh pulse) — the natural home of the old chat bot.
 *   · It opens a focus-trapped DIALOG panel with a 4-step flow:
 *       1 · What can we help with?  (treatment)
 *       2 · Who would you like to see?  (Dr. Heuker / Dr. McCarren / either)
 *       3 · Which location?  (Westbourne / surrounding)
 *       4 · When works — and how do we reach you?  (time + name + mobile)
 *     then a warm confirmation summarizing the whole plan.
 *   · An assistant "message" leads each step in plain, friendly copy, so it
 *     reads as a guided conversation, not a wizard.
 *
 * The same panel is reachable from anywhere via the exported `openBooking()` —
 * the nav "Book" buttons and any in-page CTA dispatch it, so there is ONE
 * booking experience. Embedded callers can also drop <GuidedBookingInline /> as
 * a section.
 *
 * Accessibility (held to a high bar):
 *   · role="dialog" aria-modal, labelled by the panel title; Esc closes.
 *   · Focus moves into the panel on open, is TRAPPED while open, and returns to
 *     the invoking element on close.
 *   · Each step is a labelled radiogroup with roving arrow-key selection; the
 *     contact step uses real <label>/<input> pairs with autoComplete.
 *   · A polite live region announces step changes + the running summary.
 *   · Fully reduced-motion safe (Framer respects useReducedMotion; the launcher
 *     pulse + panel transition collapse to instant).
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Tiny event bus so any component (nav, CTAs) can open the one panel  *
 * without context plumbing. SSR-safe (guards `window`).              *
 * ------------------------------------------------------------------ */
const OPEN_EVENT = "tl:open-booking";

export function openBooking() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/* ------------------------------------------------------------------ *
 * Flow data                                                          *
 * ------------------------------------------------------------------ */
const PHONE_DISPLAY = "(513) 451-9600";
const PHONE_TEL = "+15134519600";

type Option = { value: string; hint?: string };

const TREATMENTS: Option[] = [
  { value: "Botox & Xeomin", hint: "Smooth lines, keep expression" },
  { value: "Dermal Filler", hint: "Restore volume & balance" },
  { value: "Secret RF Micro-needling", hint: "Tighten & refine texture" },
  { value: "Laser Hair Removal", hint: "Smooth, lasting results" },
  { value: "Laser & Skin Concerns", hint: "Sunspots, rosacea, tone" },
  { value: "Medical Skin Care", hint: "Facials, peels, products" },
  { value: "Not sure yet — help me choose", hint: "A friendly consult first" },
];

const PROVIDERS: Option[] = [
  { value: "Dr. Sonja Heuker, MD", hint: "Skin care specialist · laser & Secret RF" },
  { value: "Dr. Timothy McCarren, MD", hint: "Injectables & facial balance" },
  { value: "Either physician", hint: "Whoever's first available" },
];

const LOCATIONS: Option[] = [
  { value: "Westbourne Dr, Cincinnati", hint: "3260 Westbourne Dr · 45248" },
  { value: "Surrounding Cincinnati", hint: "We'll find your nearest option" },
];

const TIMES: Option[] = [
  { value: "Weekday mornings" },
  { value: "Weekday afternoons" },
  { value: "Evenings" },
  { value: "Weekends" },
  { value: "First available" },
];

type StepKey = "treatment" | "provider" | "location" | "when";

const STEPS: {
  key: StepKey;
  n: number;
  legend: string;
  assistant: string;
  options: Option[];
}[] = [
  {
    key: "treatment",
    n: 1,
    legend: "What can we help with?",
    assistant:
      "Hi! I'm here to get you booked in about 30 seconds. First — what brings you in?",
    options: TREATMENTS,
  },
  {
    key: "provider",
    n: 2,
    legend: "Who would you like to see?",
    assistant:
      "Lovely choice. Both of our physicians are warm, unhurried, and honest. Anyone in particular?",
    options: PROVIDERS,
  },
  {
    key: "location",
    n: 3,
    legend: "Which location works for you?",
    assistant: "Great. Where would you like to be seen?",
    options: LOCATIONS,
  },
  {
    key: "when",
    n: 4,
    legend: "When works best?",
    assistant:
      "Almost done. Pick a window that suits you and leave your details — a real person confirms every request.",
    options: TIMES,
  },
];

type Answers = Record<StepKey, string | null>;
const EMPTY: Answers = { treatment: null, provider: null, location: null, when: null };

/* ------------------------------------------------------------------ *
 * The guided flow body — shared by the floating panel + inline mode. *
 * ------------------------------------------------------------------ */
function GuidedFlow({
  onClose,
  titleId,
  autoFocusFirst,
}: {
  onClose?: () => void;
  titleId: string;
  autoFocusFirst?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const liveId = useId();
  const firstFieldRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const currentAnswer = answers[step.key];
  const canAdvance = isLast ? Boolean(currentAnswer) : Boolean(currentAnswer);

  const summary = useMemo(() => {
    const parts = [answers.treatment, answers.provider, answers.location, answers.when].filter(
      Boolean,
    );
    return parts.join(" · ");
  }, [answers]);

  // On step change: move focus to the first option + scroll the body to top.
  useEffect(() => {
    if (done) return;
    if (autoFocusFirst === false && stepIdx === 0) return;
    const t = window.setTimeout(() => {
      firstFieldRef.current?.focus();
      scrollRef.current?.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    }, 30);
    return () => window.clearTimeout(t);
  }, [stepIdx, done, autoFocusFirst, prefersReduced]);

  const setAnswer = useCallback(
    (key: StepKey, v: string) => setAnswers((a) => ({ ...a, [key]: v })),
    [],
  );

  const back = () => setStepIdx((i) => Math.max(0, i - 1));
  const next = () => {
    if (!canAdvance) return;
    if (isLast) {
      setDone(true);
      return;
    }
    setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const reset = () => {
    setAnswers(EMPTY);
    setName("");
    setPhone("");
    setStepIdx(0);
    setDone(false);
  };

  const transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--color-accent-fg)]"
            style={{
              background:
                "radial-gradient(130% 130% at 30% 22%, oklch(72% 0.15 58), oklch(58% 0.145 46))",
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M5 5h14v10H9l-4 4V5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="leading-tight">
            <p id={titleId} className="text-sm font-semibold text-[var(--color-fg)]">
              Guided booking
            </p>
            <p className="text-[0.7rem] text-[var(--color-fg-subtle)]">
              Timeless Aesthetics · a real person confirms
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guided booking"
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress */}
      {!done && (
        <div className="flex items-center gap-1.5 px-5 pt-4 sm:px-6">
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              className="tl-step-dot flex-1"
              data-state={i < stepIdx ? "done" : i === stepIdx ? "current" : "todo"}
              style={{ width: i === stepIdx ? "1.6rem" : undefined }}
            />
          ))}
          <span className="ml-2 shrink-0 text-[0.68rem] font-medium tabular-nums text-[var(--color-fg-subtle)]">
            {step.n}/{STEPS.length}
          </span>
        </div>
      )}

      {/* Polite live region for AT */}
      <p id={liveId} aria-live="polite" className="sr-only">
        {done
          ? `Request complete. ${summary}.`
          : `Step ${step.n} of ${STEPS.length}. ${step.legend} ${
              currentAnswer ? `Selected: ${currentAnswer}.` : ""
            }`}
      </p>

      {/* Body */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        {done ? (
          <div role="status" className="flex flex-col items-center py-6 text-center">
            <span
              aria-hidden
              className="grid h-16 w-16 place-items-center rounded-full text-2xl text-[var(--color-accent-fg)] shadow-[0_18px_44px_-16px_oklch(60%_0.15_52_/_0.7)]"
              style={{
                background:
                  "radial-gradient(130% 130% at 30% 22%, oklch(72% 0.15 58), oklch(58% 0.145 46))",
              }}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                <path d="M5 12.5 10 17 19 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="font-display mt-5 text-2xl text-[var(--color-fg)]">
              You&rsquo;re all set{name ? `, ${name.split(" ")[0]}` : ""}!
            </h3>
            <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-[var(--color-fg-muted)]">
              We&rsquo;ll reach out shortly to confirm:
            </p>
            <ul className="mt-4 w-full max-w-sm space-y-2 text-left">
              {[
                ["Treatment", answers.treatment],
                ["Physician", answers.provider],
                ["Location", answers.location],
                ["When", answers.when],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center justify-between gap-4 rounded-xl bg-[var(--color-bg-subtle)] px-4 py-2.5"
                >
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                    {k}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-fg)]">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-[var(--color-fg-subtle)]">
              Demonstration booking — nothing is actually submitted.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 text-sm font-medium text-[var(--color-accent-deep)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              Start over
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.key}
              initial={prefersReduced ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={transition}
            >
              {/* assistant message bubble */}
              <div className="mb-5 flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <circle cx="12" cy="12" r="9" opacity="0.25" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
                <p className="rounded-2xl rounded-tl-sm bg-[var(--color-bg-subtle)] px-4 py-2.5 text-sm leading-relaxed text-[var(--color-fg)]">
                  {step.assistant}
                </p>
              </div>

              <h3 className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                {step.legend}
              </h3>

              <ChipGroupWithRef
                legend={step.legend}
                options={step.options}
                value={currentAnswer}
                onChange={(v) => setAnswer(step.key, v)}
                firstRef={firstFieldRef}
              />

              {/* contact fields on the final step */}
              {isLast && (
                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[var(--color-border)] pt-5 sm:grid-cols-2">
                  <Field
                    label="Your name"
                    id="tl-bk-name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Field
                    label="Mobile"
                    id="tl-bk-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Footer / controls */}
      {!done && (
        <div className="border-t border-[var(--color-border)] px-5 py-4 sm:px-6">
          {summary && (
            <p className="mb-3 line-clamp-1 text-xs text-[var(--color-fg-subtle)]">
              <span className="font-medium text-[var(--color-fg-muted)]">Your plan:</span>{" "}
              {summary}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={back}
              disabled={stepIdx === 0}
              className={cn(
                "rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                stepIdx === 0
                  ? "cursor-not-allowed text-[var(--color-fg-subtle)]/50"
                  : "text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]",
              )}
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              className={cn(
                "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                canAdvance
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_12px_30px_-14px_oklch(60%_0.15_52_/_0.85)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
                  : "cursor-not-allowed bg-[var(--color-bg-subtle)] text-[var(--color-fg-subtle)]/60",
              )}
            >
              {isLast ? "Request my visit" : "Continue"}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
          <p className="mt-3 text-center text-[0.7rem] text-[var(--color-fg-subtle)]">
            Prefer to talk?{" "}
            <a
              href={`tel:${PHONE_TEL}`}
              className="tnum font-medium text-[var(--color-accent-deep)] underline-offset-2 hover:underline"
            >
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

/* A thin wrapper so the FIRST option of each step can receive a ref for focus
   management without ChipGroup needing to know about refs internally. */
function ChipGroupWithRef({
  legend,
  options,
  value,
  onChange,
  firstRef,
}: {
  legend: string;
  options: Option[];
  value: string | null;
  onChange: (v: string) => void;
  firstRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const activeIndex = value ? options.findIndex((o) => o.value === value) : -1;

  const onKeyNav = (e: React.KeyboardEvent, i: number) => {
    const last = options.length - 1;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i >= last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i <= 0 ? last : i - 1;
    if (next === -1) return;
    e.preventDefault();
    onChange(options[next].value);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{legend}</legend>
      <div role="radiogroup" aria-label={legend} className="flex flex-col gap-2.5">
        {options.map((opt, i) => {
          const active = value === opt.value;
          const tabbable = active || (activeIndex === -1 && i === 0);
          return (
            <button
              key={opt.value}
              ref={i === 0 ? firstRef : undefined}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={tabbable ? 0 : -1}
              onClick={() => onChange(opt.value)}
              onKeyDown={(e) => onKeyNav(e, i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                "active:scale-[0.99] motion-reduce:active:scale-100",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                active
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] shadow-[0_10px_28px_-18px_oklch(60%_0.15_52_/_0.7)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-subtle)]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                  active
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                    : "border-[var(--color-hairline)] bg-transparent",
                )}
              >
                {active && (
                  <svg viewBox="0 0 24 24" className="h-3 w-3 text-[var(--color-accent-fg)]" fill="none">
                    <path d="M5 12.5 10 17 19 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-[var(--color-fg)]">
                  {opt.value}
                </span>
                {opt.hint && (
                  <span className="mt-0.5 block text-xs text-[var(--color-fg-subtle)]">
                    {opt.hint}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
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
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      <input
        id={id}
        type={type}
        className={cn(
          "mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm text-[var(--color-fg)]",
          "placeholder:text-[var(--color-fg-subtle)] transition-colors",
          "focus:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
        )}
        {...rest}
      />
    </label>
  );
}

/* ------------------------------------------------------------------ *
 * Focus trap helper — keeps Tab inside the panel while open.         *
 * ------------------------------------------------------------------ */
function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  onEscape: () => void,
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const selector =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(selector),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (activeEl === first || !container.contains(activeEl))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, containerRef, onEscape]);
}

/* ------------------------------------------------------------------ *
 * The floating launcher + dialog panel — mount once near the root.   *
 * ------------------------------------------------------------------ */
export function GuidedBooking() {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const invokerRef = useRef<HTMLElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  // Open from anywhere via the event bus; remember the invoking element.
  useEffect(() => {
    const onOpen = () => {
      invokerRef.current = (document.activeElement as HTMLElement) ?? null;
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen as EventListener);
    return () => window.removeEventListener(OPEN_EVENT, onOpen as EventListener);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(open, panelRef, close);

  // Lock body scroll while open; return focus on close.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    // returning focus to the invoker (or launcher) after close
    const target = invokerRef.current ?? launcherRef.current;
    target?.focus?.();
  }, [open]);

  const openSelf = () => {
    invokerRef.current = launcherRef.current;
    setOpen(true);
  };

  return (
    <>
      {/* Floating launcher — the home of the old "CHAT LIVE NOW" bot. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={openSelf}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full pl-4 pr-5 py-3.5 sm:bottom-6 sm:right-6",
          "bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold",
          "shadow-[0_18px_44px_-14px_oklch(60%_0.15_52_/_0.85)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.96]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
          open && "pointer-events-none opacity-0",
        )}
      >
        <span className="relative grid h-7 w-7 place-items-center">
          {!prefersReduced && <span className="tl-launch-pulse" aria-hidden />}
          <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="none" aria-hidden>
            <path d="M5 5h14v10H9l-4 4V5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <circle cx="9.5" cy="10" r="1" fill="currentColor" />
            <circle cx="12.5" cy="10" r="1" fill="currentColor" />
            <circle cx="15.5" cy="10" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="text-sm">Book with us</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-[oklch(33%_0.03_50_/_0.42)] backdrop-blur-sm"
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.22 }}
              onClick={close}
              aria-hidden
            />
            {/* Panel */}
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={prefersReduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: prefersReduced ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "fixed z-50 flex flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
                // mobile: bottom sheet; sm+: anchored bottom-right card
                "inset-x-0 bottom-0 max-h-[88svh] rounded-t-[1.75rem]",
                "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-h-[min(40rem,86svh)] sm:w-[26rem] sm:rounded-[1.5rem]",
                "shadow-[0_40px_90px_-30px_oklch(40%_0.1_50_/_0.5)]",
              )}
            >
              <GuidedFlow onClose={close} titleId={titleId} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Embedded section variant — the same guided flow as an in-page card *
 * (used by the BookingCTA section so the experience is consistent).  *
 * ------------------------------------------------------------------ */
export function GuidedBookingInline() {
  const titleId = useId();
  return (
    <div className="mx-auto flex max-h-[40rem] min-h-[34rem] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_30px_80px_-34px_oklch(40%_0.1_50_/_0.4)]">
      <GuidedFlow titleId={titleId} autoFocusFirst={false} />
    </div>
  );
}
