"use client";

/**
 * Concierge — THE GROWTH-OS DEMO CENTERPIECE.
 *
 * This is the visible face of the "missed-call / front-desk" module: a single
 * floating bottom-right launcher (it REPLACES, never duplicates, the old
 * "Book with us" pill — there is exactly one floating element on this page)
 * that opens a small chat panel running a fully-scripted, canned conversation
 * in Timeless Aesthetics' own warm voice. It demonstrates the
 * missed-call → book flow:
 *
 *   assistant: "Sorry we missed you — we're with a patient right now…"
 *   → tappable quick-reply chips (Book signature treatment / Question / Pricing)
 *   → the concierge offers a sample appointment slot
 *   → user taps the slot → "You're booked — we'll text a confirmation."
 *   → warm close, with a hand-off into the real guided-booking flow.
 *
 * Pure local state machine. NO backend, NO fetch, NO env, NO server actions —
 * static-export-safe for GitHub Pages. Everything below is in-file data.
 *
 * COMPLIANCE (hard rules, enforced by the script itself):
 *   · The concierge ONLY books / qualifies / routes.
 *   · It NEVER gives medical advice, NEVER quotes clinical outcomes, NEVER asks
 *     for health information. Pricing appears only as a vague "starting at".
 *   · Any clinical question routes to "our team will call you" — never an answer.
 *   · A subtle "Concierge preview · demo" tag keeps it honest; the booking is
 *     explicitly a demonstration ("nothing is actually submitted").
 *
 * A11y: role="dialog" aria-modal, labelled title, Esc closes, focus trapped via
 * the shared useFocusTrap, focus returns to the launcher on close, a polite live
 * region narrates each assistant turn, and every quick-reply is a real <button>
 * with a visible focus ring + >=40px tap target. Reduced-motion safe.
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { GuidedFlow, useFocusTrap } from "./GuidedBooking";

/* Same event bus the nav "Book" buttons dispatch — opening the concierge from
   anywhere lands the visitor straight on the guided booking step. */
const OPEN_EVENT = "tl:open-booking";

/* ------------------------------------------------------------------ *
 * The canned script — a tiny branching state machine.                *
 * Each "node" is one assistant turn + the quick replies it offers.   *
 * ------------------------------------------------------------------ */
const SIGNATURE = "Secret RF micro-needling";
const SLOT = "Thursday at 2:30 PM";

type ChipAction =
  | { kind: "go"; to: NodeKey }
  | { kind: "book" } // offer → confirm the sample slot
  | { kind: "handoff" } // open the full guided-booking flow
  | { kind: "restart" };

type Chip = { label: string; action: ChipAction };

type NodeKey =
  | "welcome"
  | "treatments"
  | "offer"
  | "question"
  | "pricing"
  | "clinical"
  | "booked";

type ChatNode = {
  /** assistant lines (each becomes its own bubble). */
  say: string[];
  chips: Chip[];
};

const SCRIPT: Record<NodeKey, ChatNode> = {
  welcome: {
    say: [
      "Hi there! Sorry we missed you — our front desk is with a patient right now. 🍊",
      "I'm the Timeless concierge, and I can get you booked in under a minute. What can I help you with?",
    ],
    chips: [
      { label: `Book ${SIGNATURE}`, action: { kind: "go", to: "offer" } },
      { label: "Explore treatments", action: { kind: "go", to: "treatments" } },
      { label: "I have a question", action: { kind: "go", to: "question" } },
      { label: "Pricing", action: { kind: "go", to: "pricing" } },
    ],
  },
  treatments: {
    say: [
      "Lovely. We're a physician-run medspa — Drs. Heuker & McCarren place every treatment personally.",
      "Most-loved are Secret RF micro-needling, Botox & Xeomin, filler, and laser. Want me to hold a spot, or would a quick consult help you choose?",
    ],
    chips: [
      { label: `Book ${SIGNATURE}`, action: { kind: "go", to: "offer" } },
      { label: "Start a guided booking", action: { kind: "handoff" } },
      { label: "What's the pricing?", action: { kind: "go", to: "pricing" } },
    ],
  },
  offer: {
    say: [
      `Wonderful choice. I have a few openings with Dr. Heuker this week for ${SIGNATURE}.`,
      `The soonest is ${SLOT} at our Westbourne Dr location. Want me to hold it for you?`,
    ],
    chips: [
      { label: `Hold ${SLOT}`, action: { kind: "book" } },
      { label: "See other times", action: { kind: "handoff" } },
      { label: "Actually, I have a question", action: { kind: "go", to: "question" } },
    ],
  },
  question: {
    say: [
      "Happy to help! I can answer anything about booking, locations, hours, or what to expect at your visit.",
      "For anything about your skin or a treatment plan, our team is the right hands — they'll call you so a real physician can weigh in. What would you like to do?",
    ],
    chips: [
      { label: "Have the team call me", action: { kind: "go", to: "clinical" } },
      { label: `Book ${SIGNATURE} instead`, action: { kind: "go", to: "offer" } },
      { label: "Pricing", action: { kind: "go", to: "pricing" } },
    ],
  },
  pricing: {
    say: [
      "Of course. Treatments are tailored to you, so the final plan is set with your physician at consult.",
      "As a rough guide, visits start at a friendly entry price, and we offer monthly plans with 0% options. The easiest next step is to hold a time — no obligation.",
    ],
    chips: [
      { label: `Hold a ${SIGNATURE} time`, action: { kind: "go", to: "offer" } },
      { label: "Start a guided booking", action: { kind: "handoff" } },
      { label: "Have the team call me", action: { kind: "go", to: "clinical" } },
    ],
  },
  clinical: {
    say: [
      "Perfect — I'll have a member of our care team reach out by phone.",
      "Tap below and the guided booking will grab your name and best number; a real person follows up. (Demo — nothing is actually sent.)",
    ],
    chips: [
      { label: "Leave my details", action: { kind: "handoff" } },
      { label: "Back to the start", action: { kind: "restart" } },
    ],
  },
  booked: {
    say: [
      `You're all set — ${SLOT} with Dr. Heuker at Westbourne Dr. 🎉`,
      "We'll text a confirmation and a friendly reminder. Anything else I can help with?",
    ],
    chips: [
      { label: "Add it to a full booking", action: { kind: "handoff" } },
      { label: "Start over", action: { kind: "restart" } },
    ],
  },
};

const FIRST: NodeKey = "welcome";

/* A rendered chat turn (assistant message or the user's tapped reply). */
type Turn =
  | { id: number; who: "bot"; text: string }
  | { id: number; who: "user"; text: string };

/* ------------------------------------------------------------------ *
 * The concierge chat body.                                           *
 * ------------------------------------------------------------------ */
function ConciergeChat({
  onClose,
  onHandoff,
  titleId,
}: {
  onClose: () => void;
  onHandoff: (prefillTreatment: boolean) => void;
  titleId: string;
}) {
  const prefersReduced = useReducedMotion();
  const [node, setNode] = useState<NodeKey>(FIRST);
  const [turns, setTurns] = useState<Turn[]>(() =>
    SCRIPT[FIRST].say.map((text, i) => ({ id: i, who: "bot" as const, text })),
  );
  const [booked, setBooked] = useState(false);
  const idRef = useRef(SCRIPT[FIRST].say.length);
  const liveId = useId();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);

  const nextId = () => {
    const v = idRef.current;
    idRef.current += 1;
    return v;
  };

  // Keep the latest turn in view; move focus to the first new quick-reply so the
  // conversation is fully keyboard-drivable.
  useEffect(() => {
    const t = window.setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: prefersReduced ? "auto" : "smooth",
      });
      (chipsRef.current?.querySelector("button") as HTMLElement | null)?.focus();
    }, 40);
    return () => window.clearTimeout(t);
  }, [node, booked, prefersReduced]);

  const goTo = useCallback((to: NodeKey, userLabel: string) => {
    setTurns((prev) => [
      ...prev,
      { id: nextId(), who: "user", text: userLabel },
      ...SCRIPT[to].say.map((text) => ({ id: nextId(), who: "bot" as const, text })),
    ]);
    setNode(to);
  }, []);

  const onChip = (chip: Chip) => {
    switch (chip.action.kind) {
      case "go":
        goTo(chip.action.to, chip.label);
        break;
      case "book":
        setBooked(true);
        goTo("booked", chip.label);
        break;
      case "handoff":
        // hand to the real guided flow; prefill the treatment if they came via
        // the signature-treatment branch.
        onHandoff(node === "offer" || node === "booked");
        break;
      case "restart":
        idRef.current = SCRIPT[FIRST].say.length;
        setBooked(false);
        setNode(FIRST);
        setTurns(SCRIPT[FIRST].say.map((text, i) => ({ id: i, who: "bot" as const, text })));
        break;
    }
  };

  const chips = SCRIPT[node].chips;
  const lastBot = [...turns].reverse().find((t) => t.who === "bot");

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header — the concierge's own chrome (the GuidedFlow header is hidden
          on hand-off so the two never stack). */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="relative grid h-9 w-9 place-items-center">
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
                <circle cx="9.5" cy="10" r="1" fill="currentColor" />
                <circle cx="12.5" cy="10" r="1" fill="currentColor" />
                <circle cx="15.5" cy="10" r="1" fill="currentColor" />
              </svg>
            </span>
            {/* a quiet "online" dot */}
            <span
              aria-hidden
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg-elevated)] bg-[var(--color-success)]"
            />
          </span>
          <div className="leading-tight">
            <p id={titleId} className="flex items-center gap-2 text-sm font-semibold text-[var(--color-fg)]">
              Timeless concierge
              <span className="rounded-full bg-[var(--color-accent-subtle)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-deep)]">
                Demo
              </span>
            </p>
            <p className="text-[0.7rem] text-[var(--color-fg-subtle)]">
              Concierge preview · a real person confirms
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close concierge"
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Polite live region — announces the latest assistant turn for AT. */}
      <p id={liveId} aria-live="polite" className="sr-only">
        {lastBot?.text ?? ""}
      </p>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6"
      >
        <ul className="flex flex-col gap-3">
          {turns.map((t) => (
            <li
              key={t.id}
              className={cn("flex items-end gap-2.5", t.who === "user" && "flex-row-reverse")}
            >
              {t.who === "bot" && (
                <span
                  aria-hidden
                  className="mb-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <circle cx="12" cy="12" r="9" opacity="0.25" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
              )}
              <p
                className={cn(
                  "max-w-[82%] px-4 py-2.5 text-sm leading-relaxed",
                  t.who === "bot"
                    ? "rounded-2xl rounded-bl-sm bg-[var(--color-bg-subtle)] text-[var(--color-fg)]"
                    : "rounded-2xl rounded-br-sm bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
                )}
              >
                {t.text}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick replies */}
      <div className="border-t border-[var(--color-border)] px-5 py-4 sm:px-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={node + (booked ? "-booked" : "")}
            ref={chipsRef}
            role="group"
            aria-label="Quick replies"
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: prefersReduced ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2"
          >
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => onChip(chip)}
                className={cn(
                  "inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                  "active:scale-[0.97] motion-reduce:active:scale-100",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                  chip.action.kind === "book"
                    ? "border-transparent bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_10px_28px_-16px_oklch(60%_0.15_52_/_0.85)] hover:-translate-y-0.5"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]",
                )}
              >
                {chip.action.kind === "handoff" && (
                  <span aria-hidden className="text-[var(--color-accent-deep)]">→</span>
                )}
                {chip.label}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 text-center text-[0.7rem] text-[var(--color-fg-subtle)]">
          Concierge preview — a demonstration of our front desk. Nothing is
          actually booked or sent.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The single floating launcher + dialog panel. Mount ONCE at the root *
 * (replaces the old GuidedBooking launcher). Opens the concierge chat *
 * first, then swaps to the shared <GuidedFlow /> on hand-off so there *
 * is one booking experience and one floating element.                *
 * ------------------------------------------------------------------ */
export function Concierge() {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "booking">("chat");
  const [prefillTreatment, setPrefillTreatment] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const invokerRef = useRef<HTMLElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  // Open from anywhere via the shared event bus (nav "Book" buttons). Those
  // callers want the booking flow, so they land directly on it.
  useEffect(() => {
    const onOpen = () => {
      invokerRef.current = (document.activeElement as HTMLElement) ?? null;
      setMode("booking");
      setPrefillTreatment(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen as EventListener);
    return () => window.removeEventListener(OPEN_EVENT, onOpen as EventListener);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(open, panelRef, close);

  // Lock body scroll while open; reset to chat + return focus on close.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    const target = invokerRef.current ?? launcherRef.current;
    target?.focus?.();
    // when fully closed, return to the concierge chat for next open
    const t = window.setTimeout(() => setMode("chat"), 250);
    return () => window.clearTimeout(t);
  }, [open]);

  const openSelf = () => {
    invokerRef.current = launcherRef.current;
    setMode("chat");
    setPrefillTreatment(false);
    setOpen(true);
  };

  const handoff = (withTreatment: boolean) => {
    setPrefillTreatment(withTreatment);
    setMode("booking");
  };

  return (
    <>
      {/* THE single floating launcher (replaces the old "Book with us" pill). */}
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
        <span className="text-sm">Chat &amp; book</span>
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
                "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-h-[min(42rem,86svh)] sm:w-[26rem] sm:rounded-[1.5rem]",
                "shadow-[0_40px_90px_-30px_oklch(40%_0.1_50_/_0.5)]",
              )}
            >
              {mode === "chat" ? (
                <ConciergeChat onClose={close} onHandoff={handoff} titleId={titleId} />
              ) : (
                <GuidedFlow
                  onClose={close}
                  titleId={titleId}
                  prefill={
                    prefillTreatment ? { treatment: "Secret RF Micro-needling" } : undefined
                  }
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
