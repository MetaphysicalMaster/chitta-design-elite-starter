"use client";

/**
 * Concierge — the AI front-desk demo surface. The visible face of the Growth-OS
 * "missed-call / front desk" module: a fixed bottom-right launcher that opens a
 * small chat panel running a SCRIPTED, fully-canned conversation in Sousan Med
 * Spa's voice. It demonstrates the missed-call -> book flow end to end:
 *
 *   greeting -> tappable quick-reply chips -> a sample slot -> "you're booked"
 *   -> warm close.
 *
 * Everything is local React state — NO backend, NO fetch, NO env, NO timers that
 * touch the network. Static-export safe (ships as plain HTML on GitHub Pages).
 *
 * HARD COMPLIANCE (front-desk, not clinician): it ONLY books / qualifies /
 * routes. It NEVER gives medical advice, NEVER quotes clinical outcomes, NEVER
 * asks for health information. Pricing is only ever a vague "starting at". Any
 * clinical question routes to "our team will call you." Each path is hand-written
 * below so this can't drift into advice.
 *
 * Honesty: a small "Demo" tag sits in the header; the panel is clearly a preview.
 *
 * Collision: the slug has NO other bottom-right floating element (SiteNav is a
 * top bar; PinkThread is a pointer-events:none decorative overlay). So this is
 * the SOLE floating affordance — no competing bubble, no duplicate booking pill.
 *
 * A11y: launcher is a labelled button with aria-expanded; the panel is a dialog
 * with focus management, Esc-to-close, focus-visible rings, reduced-motion safe,
 * and >=40px tap targets. On mobile it's a near-full-width bottom sheet that
 * never covers the whole viewport (caps its height, leaves the top breathing).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

/* ---------- the scripted state machine ---------- */

type Sender = "bot" | "user";
type Msg = { id: number; from: Sender; text: string };

/** A quick-reply chip. `next` names the bot turn it triggers. `echo`, when set,
    overrides the user-bubble text (so the bubble can read more naturally than
    the chip label, e.g. chip "Yes — book a consult" -> echo "Yes, book a
    consultation."). */
type Chip = { label: string; next: StepKey; echo?: string };

type Step = {
  /** What the concierge says when this step is reached. */
  bot: string[];
  /** Chips offered after the bot finishes (omitted at terminal close). */
  chips?: Chip[];
};

type StepKey =
  | "greet"
  | "book"
  | "slot"
  | "booked"
  | "question"
  | "clinical"
  | "pricing"
  | "callback";

/* Sousan's signature treatment, used so the flow feels native to THIS clinic. */
const SIGNATURE = "HydraFacial MD";
const SAMPLE_SLOT = "Thursday at 2:30 pm";

const SCRIPT: Record<StepKey, Step> = {
  greet: {
    bot: [
      "Hi, this is the front desk at Sousan Med Spa! Sorry we missed you — we're with a guest right now. Want me to get you booked? ✦",
    ],
    chips: [
      { label: `Book ${SIGNATURE}`, next: "book" },
      { label: "I have a question", next: "question" },
      { label: "Pricing", next: "pricing" },
    ],
  },

  /* Booking the signature treatment -> offer a sample slot. */
  book: {
    bot: [
      `Lovely choice — the ${SIGNATURE} is a guest favorite.`,
      `I have an opening ${SAMPLE_SLOT} here in Houston. Shall I hold it for you?`,
    ],
    chips: [
      {
        label: `Yes — hold ${SAMPLE_SLOT.split(" at")[0]}`,
        next: "slot",
        echo: "Yes, please hold it.",
      },
      { label: "A different time", next: "callback" },
    ],
  },

  /* User accepts the slot -> confirm the booking + warm close. */
  slot: {
    bot: [
      `Wonderful — you're penciled in for ${SIGNATURE}, ${SAMPLE_SLOT}. ✓`,
      "We'll text a confirmation to your mobile and a friendly reminder the day before. We can't wait to see you!",
    ],
    chips: [{ label: "Thank you!", next: "booked" }],
  },

  /* Warm close. Terminal — no further chips. */
  booked: {
    bot: [
      "You're all set. Welcome to your beauty evolution — Sousan and the team are looking forward to it. 🌸",
    ],
  },

  /* General question router. We DON'T answer anything clinical here — we offer
     to route. The chips deliberately keep it to logistics + a callback. */
  question: {
    bot: [
      "Happy to help! I can book a visit, share hours, or pass anything detailed to our team.",
      "What would be most useful?",
    ],
    chips: [
      { label: "Is a treatment right for me?", next: "clinical" },
      { label: `Book ${SIGNATURE}`, next: "book" },
      { label: "Have the team call me", next: "callback" },
    ],
  },

  /* Clinical guard. Any "is this right for my skin / will it work" question is
     routed to a human — the concierge never advises, diagnoses, or promises an
     outcome. This is the compliance backbone of the demo. */
  clinical: {
    bot: [
      "That's a great question for our licensed team — I'm the front desk, so I don't give skin or treatment advice.",
      "The best next step is a complimentary consultation, where they'll tailor everything to you. Want me to set that up?",
    ],
    chips: [
      { label: "Yes — book a consult", next: "book", echo: "Yes, book a consultation." },
      { label: "Have the team call me", next: "callback" },
    ],
  },

  /* Pricing — only ever a vague "starting at", never a quote, then route to a
     consult where real numbers are given. */
  pricing: {
    bot: [
      "Our signature treatments start at a gentle entry point, and we'll always confirm the exact investment with you before anything is booked.",
      "Financing is available too. The clearest picture comes from a quick consult — shall I get one on the calendar?",
    ],
    chips: [
      { label: "Yes — book a consult", next: "book", echo: "Yes, book a consultation." },
      { label: "Have the team call me", next: "callback" },
    ],
  },

  /* Callback capture (still no PHI) -> warm close. */
  callback: {
    bot: [
      "Of course — leave it with me and our team will reach out personally to find your perfect time.",
      "Consider it noted. You'll hear from a real person at Sousan shortly. 🌸",
    ],
    chips: [{ label: "Perfect, thank you!", next: "booked" }],
  },
};

const EASE = [0.16, 1, 0.3, 1] as const;
let MSG_SEQ = 0;

export function Concierge() {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chips, setChips] = useState<Chip[]>([]);
  const [typing, setTyping] = useState(false);
  const [closed, setClosed] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const firstChipRef = useRef<HTMLButtonElement>(null);
  // Tracks scripted timeouts so we can clear them on close/unmount.
  const timers = useRef<number[]>([]);

  const pushBotStep = useCallback(
    (key: StepKey) => {
      const step = SCRIPT[key];
      // Clear any pending scripted output first.
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];

      // Sequentially reveal each bot line with a short "typing" beat. Reduced
      // motion users get them near-instantly (no long suspense), but still in
      // order so the conversation reads naturally.
      const lineDelay = prefersReduced ? 90 : 560;
      const last = step.bot.length - 1;
      // Show the typing indicator immediately, then reveal lines in order.
      setTyping(true);
      step.bot.forEach((line, i) => {
        const at = i * lineDelay + (i === 0 ? 120 : 0);
        timers.current.push(
          window.setTimeout(() => {
            setMessages((m) => [
              ...m,
              { id: ++MSG_SEQ, from: "bot", text: line },
            ]);
            if (i === last) {
              setTyping(false);
              setChips(step.chips ?? []);
              if (!step.chips || step.chips.length === 0) setClosed(true);
            } else {
              // keep the indicator alive between multi-line turns
              setTyping(true);
            }
          }, at),
        );
      });
    },
    [prefersReduced],
  );

  const onPickChip = useCallback(
    (chip: Chip) => {
      const echo = chip.echo ?? chip.label;
      setChips([]);
      setMessages((m) => [...m, { id: ++MSG_SEQ, from: "user", text: echo }]);
      // Small beat before the bot replies — feels like a real desk picking up.
      timers.current.push(
        window.setTimeout(
          () => pushBotStep(chip.next),
          prefersReduced ? 60 : 240,
        ),
      );
    },
    [pushBotStep, prefersReduced],
  );

  // Open: seed the greeting once (only the first time / after a reset).
  const openPanel = useCallback(() => {
    setOpen(true);
    if (messages.length === 0) {
      pushBotStep("greet");
    }
  }, [messages.length, pushBotStep]);

  const closePanel = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  const resetConversation = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setMessages([]);
    setChips([]);
    setTyping(false);
    setClosed(false);
    // Re-seed on the next tick so state has flushed.
    timers.current.push(window.setTimeout(() => pushBotStep("greet"), 30));
  }, [pushBotStep]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closePanel]);

  // Move focus into the panel when it opens (first chip, else the panel).
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      (firstChipRef.current ?? panelRef.current)?.focus();
    }, 80);
    return () => window.clearTimeout(t);
  }, [open, chips]);

  // Auto-scroll the log to the newest message.
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, [messages, typing, chips, prefersReduced]);

  // Cleanup all timers on unmount.
  useEffect(() => {
    const tref = timers;
    return () => {
      tref.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const panelVariants: Variants = {
    hidden: {
      opacity: 0,
      y: prefersReduced ? 0 : 18,
      scale: prefersReduced ? 1 : 0.98,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.34, ease: EASE },
    },
    exit: {
      opacity: 0,
      y: prefersReduced ? 0 : 12,
      scale: prefersReduced ? 1 : 0.985,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const dotDelays = useMemo(() => [0, 0.16, 0.32], []);

  return (
    <>
      {/* ---------- the chat panel ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sn-concierge-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label="Sousan Med Spa concierge — booking preview"
            tabIndex={-1}
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
              "fixed z-[70] flex flex-col overflow-hidden rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
              "shadow-[0_30px_80px_-24px_oklch(10%_0_0_/_0.5)] outline-none",
              // Mobile: a bottom sheet — near full width, capped height, never
              // covering the whole viewport (top inset leaves the page visible).
              "inset-x-3 bottom-3 max-h-[78dvh]",
              // Desktop: a compact docked panel bottom-right.
              "sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[24rem] sm:max-h-[34rem]",
            )}
          >
            {/* header */}
            <div className="relative flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--night-0)] px-4 py-3.5">
              {/* monogram avatar */}
              <span
                aria-hidden
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-accent-deep)] font-script text-lg leading-none text-[var(--color-accent-fg)]"
                style={{ fontFamily: "var(--font-script)" }}
              >
                S
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[0.95rem] font-semibold leading-tight text-[var(--color-bg)]">
                  Sousan Concierge
                  <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(100%_0_0_/_0.14)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--gold-bright)]">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[var(--gold-bright)]"
                    />
                    Demo
                  </span>
                </p>
                <p className="truncate text-[0.74rem] text-[oklch(86%_0_0_/_0.7)]">
                  Front desk preview · typically replies instantly
                </p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close concierge"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[oklch(90%_0_0_/_0.85)] transition-colors hover:bg-[oklch(100%_0_0_/_0.12)] hover:text-[var(--color-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* message log */}
            <div
              ref={logRef}
              className="flex-1 space-y-3 overflow-y-auto bg-[var(--color-bg-subtle)] px-4 py-4"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.map((m) => (
                <Bubble key={m.id} from={m.from} reduced={!!prefersReduced}>
                  {m.text}
                </Bubble>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <span
                    role="status"
                    aria-label="Concierge is typing"
                    className="inline-flex items-center gap-1.5 rounded-[1.1rem] rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-3"
                  >
                    {dotDelays.map((d, i) => (
                      <motion.span
                        key={i}
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-[var(--color-fg-subtle)]"
                        animate={
                          prefersReduced
                            ? undefined
                            : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }
                        }
                        transition={
                          prefersReduced
                            ? undefined
                            : {
                                duration: 0.9,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: d,
                              }
                        }
                      />
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* quick-reply chips / footer */}
            <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-3">
              {chips.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {chips.map((c, i) => (
                    <button
                      key={c.label}
                      ref={i === 0 ? firstChipRef : undefined}
                      type="button"
                      onClick={() => onPickChip(c)}
                      className={cn(
                        "sn-press min-h-[40px] rounded-full border border-[var(--color-accent-deep)] bg-[var(--color-accent-subtle)] px-4 py-2 text-[0.82rem] font-medium text-[var(--color-accent-deep)]",
                        "transition-colors hover:bg-[var(--color-accent-deep)] hover:text-[var(--color-accent-fg)]",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              ) : closed ? (
                <button
                  type="button"
                  onClick={resetConversation}
                  className="sn-press flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent-deep)] px-4 py-2.5 text-[0.85rem] font-semibold text-[var(--color-accent-fg)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
                >
                  Replay the demo
                  <span aria-hidden>↺</span>
                </button>
              ) : (
                <p className="px-1 py-1.5 text-center text-[0.74rem] text-[var(--color-fg-subtle)]">
                  One moment…
                </p>
              )}

              {/* honesty + compliance microcopy */}
              <p className="mt-2.5 px-1 text-center text-[0.66rem] leading-snug text-[var(--color-fg-subtle)]">
                Concierge preview — a scripted demo, no real appointment is
                booked. Booking &amp; routing only; not medical advice.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- the launcher ---------- */}
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Close concierge" : "Chat with the Sousan concierge"}
        initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: prefersReduced ? 0 : 0.6 }}
        whileTap={prefersReduced ? undefined : { scale: 0.94 }}
        className={cn(
          "fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full sm:bottom-6 sm:right-6",
          "bg-[var(--color-accent-deep)] text-[var(--color-accent-fg)]",
          "shadow-[0_18px_44px_-12px_oklch(51%_0.22_357_/_0.62)]",
          "transition-transform duration-300 hover:-translate-y-0.5",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
        )}
      >
        {/* soft pink halo pulse — reduced-motion safe (only when allowed) */}
        {!open && !prefersReduced && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 1.7 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.svg
                key="x"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                aria-hidden
                initial={prefersReduced ? false : { rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={prefersReduced ? undefined : { rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="chat"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                aria-hidden
                initial={prefersReduced ? false : { rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={prefersReduced ? undefined : { rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  d="M4.5 6.5A2.5 2.5 0 0 1 7 4h10a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 17 15H9l-3.6 3.2a.6.6 0 0 1-1-.45V15A2.5 2.5 0 0 1 4.5 12.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="9.6" r="1" fill="currentColor" />
                <circle cx="12.5" cy="9.6" r="1" fill="currentColor" />
                <circle cx="16" cy="9.6" r="1" fill="currentColor" />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </>
  );
}

/* A single chat bubble. Bot bubbles are light + left; user bubbles are the pink
   pop + right. Both AA-safe (pink fill always pairs with white text). */
function Bubble({
  from,
  reduced,
  children,
}: {
  from: Sender;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const isUser = from === "user";
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <p
        className={cn(
          "max-w-[84%] text-pretty px-3.5 py-2.5 text-[0.86rem] leading-relaxed",
          isUser
            ? "rounded-[1.1rem] rounded-br-md bg-[var(--color-accent-deep)] text-[var(--color-accent-fg)]"
            : "rounded-[1.1rem] rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)]",
        )}
      >
        {children}
      </p>
    </motion.div>
  );
}
