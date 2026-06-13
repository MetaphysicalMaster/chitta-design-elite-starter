"use client";

/**
 * Concierge — the AI front-desk / missed-call concierge, the visible face of
 * the Growth-OS "never miss a patient" module and the centerpiece of the pitch
 * demo. A fixed bottom-right launcher opens a small chat panel that runs a
 * SCRIPTED, fully-canned conversation in THIS practice's voice — the
 * missed-call → book flow — entirely on local React state.
 *
 * It is honest: a small "Concierge preview" tag marks it as a demo, and the
 * footer reminds nothing is actually booked.
 *
 * Compliance (front-office, NOT clinical):
 *  - It ONLY books / qualifies / routes. It never gives medical advice, never
 *    quotes clinical outcomes, never asks for health information.
 *  - Pricing is only ever a vague "starting at / quoted at your consult".
 *  - Anything clinical ("I have a question") routes to "our team will call you".
 *
 * Collision: this slug has NO other floating bottom-right element (the only
 * fixed element is SiteNav at top, z-50; PrecisionCursor is z-80 but
 * pointer-events:none). The launcher sits at z-[70] — above content, below the
 * reticle, clear of the top nav — so there is exactly ONE floating bubble.
 *
 * Accessibility:
 *  - launcher is a real <button> (≥44px); panel is role="dialog" aria-modal,
 *    Esc closes, focus moves to the panel on open and returns to the launcher
 *    on close; the transcript is an aria-live="polite" log.
 *  - reduced-motion: no slide/scale, instant show; the "typing" beat collapses
 *    to a near-instant tick so the script never stalls a reduced-motion user.
 *  - mobile (<640px): the panel is a bottom sheet that never covers the whole
 *    viewport (max-height caps, the page stays visible above it).
 *
 * Static-export-safe: zero fetch / XHR / env / Node — the entire conversation
 * is the SCRIPT object below.
 */

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ----------------------------- the script ------------------------------ */
/* A small state machine: each NODE is a concierge turn (one or more bubbles)
   plus the quick-reply CHIPS the visitor can tap. A chip either advances to the
   next node or, for the terminal "book" path, flips a flag that swaps the chip
   row for a calm confirmation + reset. The copy is the practice's voice:
   measured, warm, front-desk — never clinical. */

type ChipId =
  | "book_signature"
  | "question"
  | "pricing"
  | "pick_slot"
  | "other_time"
  | "pricing_book"
  | "callback"
  | "restart";

type Node = {
  id: string;
  /** Concierge bubbles for this turn (rendered in order, lightly staggered). */
  bubbles: string[];
  /** Tappable quick-replies shown after the bubbles land. */
  chips: { id: ChipId; label: string; to: string }[];
  /** Terminal nodes show the closing note instead of more chips. */
  terminal?: boolean;
};

/* The signature aesthetic offer this practice leads its concierge with — warm,
   not clinical, and the highest-intent front-office ask. */
const SIGNATURE = "a cosmetic consult";
const SAMPLE_SLOT = "Thursday at 3:00 PM";
const ALT_SLOT = "Tuesday at 11:00 AM";

const SCRIPT: Record<string, Node> = {
  start: {
    id: "start",
    bubbles: [
      "Hi! Sorry we missed you — Dr. Darst's team is with a patient right now.",
      "I'm the Darst Dermatology front desk. Want me to get you booked, or point you the right way?",
    ],
    chips: [
      { id: "book_signature", label: `Book ${SIGNATURE}`, to: "offerSlot" },
      { id: "question", label: "I have a question", to: "question" },
      { id: "pricing", label: "Pricing", to: "pricing" },
    ],
  },

  offerSlot: {
    id: "offerSlot",
    bubbles: [
      "Wonderful — let's find you a time.",
      `Dr. Darst has an opening this week: ${SAMPLE_SLOT} at our Charlotte office. Shall I hold it for you?`,
    ],
    chips: [
      { id: "pick_slot", label: `Yes — book ${SAMPLE_SLOT.split(" at")[0]}`, to: "booked" },
      { id: "other_time", label: "Another time?", to: "altSlot" },
    ],
  },

  altSlot: {
    id: "altSlot",
    bubbles: [
      "Of course — happy to find what fits.",
      `I can also offer ${ALT_SLOT} in Charlotte. Would that work better?`,
    ],
    chips: [
      { id: "pick_slot", label: `Yes — book ${ALT_SLOT.split(" at")[0]}`, to: "bookedAlt" },
      { id: "callback", label: "Have the team call me", to: "callback" },
    ],
  },

  pricing: {
    id: "pricing",
    bubbles: [
      "Happy to set expectations. Cosmetic consults start at a modest visit fee, and Dr. Darst quotes any treatment plan with you in person — no surprise add-ons.",
      "The honest answer on cost lives in the consult, where he plans the result with you. Want me to hold a consult time?",
    ],
    chips: [
      { id: "pricing_book", label: "Yes, book a consult", to: "offerSlot" },
      { id: "callback", label: "Have the team call me", to: "callback" },
    ],
  },

  question: {
    id: "question",
    bubbles: [
      "Of course. For anything about your skin or a specific concern, I'll have a member of Dr. Darst's clinical team reach out personally — they'll have the right answer.",
      "What's the best number to reach you, and a good window to call? (I'll pass it straight to the team.)",
    ],
    chips: [{ id: "callback", label: "Request a callback", to: "callback" }],
  },

  callback: {
    id: "callback",
    bubbles: [
      "Done — I've flagged this for the team.",
      "They'll call you within one business day, and we'll text a quick confirmation either way. Thank you for reaching out to Darst Dermatology.",
    ],
    chips: [{ id: "restart", label: "Start over", to: "start" }],
    terminal: true,
  },

  booked: {
    id: "booked",
    bubbles: [
      `You're booked for ${SAMPLE_SLOT} at our Charlotte office. ✦`,
      "We'll text a confirmation and a few simple reminders before your visit. We're glad you found us — see you soon.",
    ],
    chips: [{ id: "restart", label: "Book another", to: "start" }],
    terminal: true,
  },

  bookedAlt: {
    id: "bookedAlt",
    bubbles: [
      `You're booked for ${ALT_SLOT} at our Charlotte office. ✦`,
      "We'll text a confirmation and a few simple reminders before your visit. We're glad you found us — see you soon.",
    ],
    chips: [{ id: "restart", label: "Book another", to: "start" }],
    terminal: true,
  },
};

/* ----------------------------- transcript ------------------------------ */

type Msg =
  | { kind: "bot"; text: string }
  | { kind: "user"; text: string }
  | { kind: "typing" };

export function Concierge() {
  const prefersReduced = useReducedMotion();
  const reduced = !!prefersReduced;

  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState("start");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [showChips, setShowChips] = useState(false);
  const [unread, setUnread] = useState(true); // a quiet nudge dot pre-open

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const titleId = useId();
  const node = SCRIPT[nodeId];

  // Clear any pending scripted timers (on node change / unmount / close).
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Play a node: append a brief "typing" beat, then each concierge bubble in
  // sequence, then reveal the chips. Fully local + cancellable.
  useEffect(() => {
    if (!open) return;
    clearTimers();
    setShowChips(false);

    const typeMs = reduced ? 90 : 620;
    const gapMs = reduced ? 120 : 460;

    // Insert a typing indicator first.
    setMessages((m) => [...m, { kind: "typing" }]);

    node.bubbles.forEach((text, i) => {
      const at = typeMs + i * gapMs;
      timers.current.push(
        setTimeout(() => {
          setMessages((m) => {
            // Replace the trailing typing bubble (if present) with this line,
            // or just append.
            const next: Msg[] = m.filter((x) => x.kind !== "typing");
            next.push({ kind: "bot", text });
            // Re-add a typing beat before the NEXT bubble (not after the last).
            if (i < node.bubbles.length - 1) next.push({ kind: "typing" });
            return next;
          });
        }, at),
      );
    });

    // Reveal chips after the last bubble settles.
    timers.current.push(
      setTimeout(
        () => setShowChips(true),
        typeMs + (node.bubbles.length - 1) * gapMs + (reduced ? 60 : 240),
      ),
    );

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId, open, reduced]);

  // Auto-scroll the log to the newest message.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, showChips, reduced]);

  // Open: seed the transcript fresh, move focus into the panel, clear nudge.
  const openPanel = () => {
    setUnread(false);
    setMessages([]);
    setNodeId("start");
    setOpen(true);
  };

  const closePanel = () => {
    clearTimers();
    setOpen(false);
    // Return focus to the launcher for keyboard users.
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  // Esc closes; focus the panel when it opens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // A chip tap: echo the visitor's choice, then advance the machine.
  const tapChip = (chip: { id: ChipId; label: string; to: string }) => {
    if (chip.id === "restart") {
      setMessages([]);
      setNodeId(chip.to);
      return;
    }
    setShowChips(false);
    setMessages((m) => [...m, { kind: "user", text: chip.label }]);
    // Small beat so the user's bubble lands before the concierge "reads" it.
    timers.current.push(setTimeout(() => setNodeId(chip.to), reduced ? 60 : 260));
  };

  return (
    <>
      {/* ----------------------------- launcher ----------------------------- */}
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Close the booking concierge" : "Open the booking concierge"}
        initial={reduced ? false : { opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : 0.8 }}
        className={cn(
          "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[70]",
          "group inline-flex items-center gap-2.5 rounded-full py-3 pl-3.5 pr-5",
          "bg-[var(--color-accent-deep)] text-[var(--color-accent-fg)]",
          "shadow-[0_18px_44px_-14px_oklch(48%_0.082_197_/_0.7)]",
          "transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
          // hidden while the panel is open so the bubble + sheet don't stack
          open && "pointer-events-none opacity-0",
        )}
        style={{ visibility: open ? "hidden" : "visible" }}
      >
        <span
          aria-hidden
          className="relative grid h-9 w-9 place-items-center rounded-full bg-[oklch(100%_0_0_/_0.16)]"
        >
          {/* chat-bubble glyph */}
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M4 5.5h16v10H9l-4 3.5v-3.5H4z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 10.5h7M8.5 13h4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          {/* quiet unread nudge dot */}
          {unread && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-coral)] ring-2 ring-[var(--color-accent-deep)]" />
          )}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[0.92rem] font-semibold">Book with us</span>
          <span className="block text-[0.66rem] font-medium tracking-wide text-[oklch(100%_0_0_/_0.78)]">
            Front desk · replies now
          </span>
        </span>
      </motion.button>

      {/* ------------------------------- panel ------------------------------ */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile-only scrim — taps to dismiss; the page stays visible
                above the bottom sheet (never a full-screen takeover). */}
            <motion.button
              type="button"
              aria-label="Close concierge"
              tabIndex={-1}
              onClick={closePanel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[69] bg-[oklch(20%_0.035_56_/_0.32)] backdrop-blur-[1px] sm:hidden"
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "fixed z-[71] flex flex-col overflow-hidden focus:outline-none",
                // mobile: a bottom sheet, full width, capped height — never traps
                "inset-x-0 bottom-0 max-h-[82svh] rounded-t-[1.5rem]",
                // ≥sm: a small docked panel bottom-right
                "sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[24rem] sm:max-h-[min(34rem,80svh)] sm:rounded-[1.4rem]",
                "border border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
                "shadow-[0_-20px_60px_-24px_oklch(20%_0.035_56_/_0.5)] sm:shadow-[0_30px_80px_-30px_oklch(20%_0.035_56_/_0.6)]",
              )}
              style={{
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              {/* header — on the espresso night surface, brand-native */}
              <header className="relative flex items-center gap-3 bg-[var(--night-1)] px-4 py-3.5 sm:px-5">
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[oklch(40%_0.06_196_/_0.5)] text-[var(--color-accent-bright)]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <path
                      d="M4 5.5h16v10H9l-4 3.5v-3.5H4z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    id={titleId}
                    className="font-display text-[1.02rem] leading-tight text-[oklch(96%_0.014_72)]"
                  >
                    Darst Dermatology
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-[oklch(86%_0.025_70_/_0.82)]">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
                    />
                    Front desk concierge · online
                  </p>
                </div>
                {/* honest demo tag */}
                <span className="hidden rounded-full border border-[oklch(74%_0.05_64_/_0.3)] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[oklch(84%_0.04_64_/_0.85)] sm:inline-block">
                  Concierge preview
                </span>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close concierge"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[oklch(90%_0.02_70_/_0.86)] transition-colors hover:bg-[oklch(100%_0_0_/_0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </header>

              {/* transcript */}
              <div
                ref={logRef}
                aria-live="polite"
                aria-atomic="false"
                className="flex-1 space-y-2.5 overflow-y-auto bg-[var(--color-bg-subtle)] px-4 py-4 sm:px-5"
              >
                {/* mobile-only demo tag (header tag is sm+) */}
                <p className="mb-1 text-center text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)] sm:hidden">
                  Concierge preview
                </p>

                {messages.map((m, i) =>
                  m.kind === "typing" ? (
                    <Typing key={`t-${i}`} reduced={reduced} />
                  ) : (
                    <Bubble key={i} kind={m.kind} text={m.text} reduced={reduced} />
                  ),
                )}

                {/* quick-reply chips for the current node */}
                <AnimatePresence>
                  {showChips && !node.terminal && (
                    <motion.div
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="flex flex-wrap gap-2 pt-1.5"
                      role="group"
                      aria-label="Quick replies"
                    >
                      {node.chips.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => tapChip(c)}
                          className={cn(
                            "min-h-[40px] rounded-full border border-[var(--color-accent-deep)] bg-[var(--color-bg-elevated)] px-4 py-2 text-[0.86rem] font-medium text-[var(--color-accent-deep)]",
                            "transition-colors hover:bg-[var(--color-accent-deep)] hover:text-[var(--color-accent-fg)]",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
                          )}
                        >
                          {c.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* terminal close: a calm reset chip (e.g. "Book another") */}
                <AnimatePresence>
                  {showChips && node.terminal && (
                    <motion.div
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="flex flex-wrap gap-2 pt-1.5"
                    >
                      {node.chips.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => tapChip(c)}
                          className={cn(
                            "min-h-[40px] rounded-full bg-[var(--color-accent-deep)] px-4 py-2 text-[0.86rem] font-semibold text-[var(--color-accent-fg)]",
                            "transition-transform hover:-translate-y-0.5 active:translate-y-0",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
                          )}
                        >
                          {c.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* honest footer rail */}
              <p className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-center text-[0.68rem] leading-snug text-[var(--color-fg-subtle)] sm:px-5">
                Demo concierge — books &amp; routes only, no medical advice. No
                real appointment is created.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* A single transcript bubble — concierge (left, warm card) or visitor (right,
   teal). */
function Bubble({
  kind,
  text,
  reduced,
}: {
  kind: "bot" | "user";
  text: string;
  reduced: boolean;
}) {
  const isUser = kind === "user";
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <p
        className={cn(
          "max-w-[84%] text-pretty text-[0.9rem] leading-relaxed",
          isUser
            ? "rounded-2xl rounded-br-md bg-[var(--color-accent-deep)] px-3.5 py-2.5 text-[var(--color-accent-fg)]"
            : "rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2.5 text-[var(--color-fg)]",
        )}
      >
        {text}
      </p>
    </motion.div>
  );
}

/* The "front desk is typing" beat — three dots, reduced-motion safe (static). */
function Typing({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-start"
      aria-hidden
    >
      <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-fg-subtle)]"
            animate={reduced ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={
              reduced
                ? undefined
                : { duration: 1, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }
            }
          />
        ))}
      </span>
    </motion.div>
  );
}
