"use client";

/**
 * ConciergeWidget — the visible face of the Growth-OS "missed-call / front-desk"
 * module, and the centerpiece of the Happy Clinic pitch demo.
 *
 * A fixed bottom-right launcher opens a small chat panel (a near-full-width
 * bottom SHEET on mobile, a tidy card on desktop) that runs a SCRIPTED, fully
 * canned conversation in THIS clinic's voice — demonstrating the
 * missed-call → book flow end to end:
 *   greeting → tappable quick-reply chips → a sample appointment slot →
 *   tap to book → "you're booked, we'll text a confirmation" → warm close.
 *
 * COLLISION: the slug's only other floating element is the mobile-only
 * MobileActionBar (fixed inset-x-0 bottom-0, lg:hidden). There is NO existing
 * bottom-right booking pill to extend, so this is the single bottom-right
 * floater. On mobile the launcher is lifted ABOVE the action bar
 * (bottom offset clears its ~64px height + safe-area) so the two never overlap;
 * on lg+ the action bar is hidden and the launcher owns the corner alone.
 *
 * COMPLIANCE (hard): this concierge ONLY books / qualifies / routes. It NEVER
 * gives medical advice, NEVER quotes clinical outcomes, NEVER asks for health
 * info. Pricing surfaces only as a vague "starting at". Anything clinical is
 * deflected to "our team will call you." A small "Concierge preview · demo" tag
 * keeps it honest.
 *
 * STATIC-EXPORT-SAFE: zero network, zero env, zero server actions. Every line
 * of dialogue and the entire flow is local React state / in-file data. Ships as
 * static HTML on GitHub Pages.
 *
 * A11y: focus moves into the panel on open and returns to the launcher on
 * close; Escape closes; the transcript is an aria-live log; reduced-motion is
 * honored; all tap targets are >= 40px.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
   The canned script. A tiny state machine: each "node" is a concierge turn
   (one or more bubbles) plus the quick-reply chips the patient can tap. Picking
   a chip echoes the patient's bubble, then advances to the next node. Pure
   data — no clinical claims anywhere.
---------------------------------------------------------------------------- */

type ChipId =
  | "book_botox"
  | "question"
  | "pricing"
  | "slot_thu"
  | "slot_sat"
  | "other_time"
  | "confirm_book"
  | "restart";

type Chip = { id: ChipId; label: string; echo: string };

type Node = {
  /** Concierge bubbles shown when this node becomes active. */
  bubbles: string[];
  /** Quick-reply chips the patient can tap from here. */
  chips: Chip[];
};

const FIRST_NAME = "there";

const SCRIPT: Record<string, Node> = {
  greeting: {
    bubbles: [
      `Hi! Sorry we missed you — Dr. Phil's team is with a patient right now. I'm the Happy Clinic concierge and I can get you booked in about 30 seconds. 💛`,
      "What can I help you with?",
    ],
    chips: [
      { id: "book_botox", label: "Book a Botox visit", echo: "I'd like to book a Botox visit." },
      { id: "pricing", label: "Pricing", echo: "What does it cost?" },
      { id: "question", label: "I have a question", echo: "I have a question." },
    ],
  },

  // "Book the signature treatment" → offer a sample slot.
  offer_slot: {
    bubbles: [
      "Lovely — a Botox visit with Dr. Phil it is. Every treatment is physician-administered, so you're in expert hands.",
      "I have a couple of openings this week. Which works better?",
    ],
    chips: [
      { id: "slot_thu", label: "Thu · 2:30 PM", echo: "Thursday at 2:30 PM, please." },
      { id: "slot_sat", label: "Sat · 10:00 AM", echo: "Saturday at 10:00 AM, please." },
      { id: "other_time", label: "Another time", echo: "Do you have another time?" },
    ],
  },

  // Pricing — vague "starting at" ONLY, then route to booking. No clinical claims.
  pricing: {
    bubbles: [
      "Happy to point you in the right direction. Botox starts at $9 per unit, and your first consult is complimentary — Dr. Phil will recommend only what's right for you.",
      "Exact pricing depends on your visit, so the consult is the best place to start. Want me to grab you a slot?",
    ],
    chips: [
      { id: "book_botox", label: "Yes, book my consult", echo: "Yes, let's book the consult." },
      { id: "question", label: "One more question", echo: "I have one more question." },
    ],
  },

  // Generic question → route to a human, NEVER answer anything clinical.
  question: {
    bubbles: [
      "Of course. For anything about your skin, treatments, or what's right for you, our team will call you back personally — I keep the medical questions with the experts.",
      "I can take it from here on the booking side. Shall I reserve a time and have the team follow up with you?",
    ],
    chips: [
      { id: "book_botox", label: "Yes, reserve a time", echo: "Yes, reserve a time for me." },
      { id: "pricing", label: "Tell me about pricing", echo: "Tell me about pricing first." },
    ],
  },

  // "Another time" → keep it human, still demo-safe.
  other_time: {
    bubbles: [
      "No problem at all — we have morning, midday and evening openings most days.",
      "Here's the soonest I can hold for you:",
    ],
    chips: [
      { id: "slot_thu", label: "Thu · 2:30 PM", echo: "Thursday at 2:30 PM works." },
      { id: "slot_sat", label: "Sat · 10:00 AM", echo: "Saturday at 10:00 AM works." },
    ],
  },

  // Slot chosen → confirm intent.
  confirm: {
    bubbles: [
      "Perfect. I'll hold that for you under a no-pressure consult — no consult fee, and you can reschedule anytime.",
      "Shall I lock it in?",
    ],
    chips: [
      { id: "confirm_book", label: "Yes — book it", echo: "Yes, book it." },
      { id: "other_time", label: "Pick a different time", echo: "Actually, a different time." },
    ],
  },

  // Booked → warm close. Terminal node (handled specially: no further chips).
  booked: {
    bubbles: [],
    chips: [],
  },
};

/* Distinct "I'm typing" pacing per turn — feels human without being slow. */
const TYPING_MS = 650;

type Msg =
  | { from: "bot"; text: string; key: string }
  | { from: "user"; text: string; key: string };

export function ConciergeWidget() {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [node, setNode] = useState<string>("greeting");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [chosenSlot, setChosenSlot] = useState<string>("");
  const [hasOpened, setHasOpened] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const nextKey = () => `m${seq.current++}`;

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  /* Push a node's concierge bubbles, one at a time, with a typing beat between
     them. Reduced-motion collapses the typing delay to near-instant. */
  const playNode = useCallback(
    (id: string) => {
      const n = SCRIPT[id];
      if (!n) return;
      const beat = prefersReduced ? 90 : TYPING_MS;
      let delay = 0;
      n.bubbles.forEach((text, i) => {
        // Show typing indicator before each bubble.
        timers.current.push(
          setTimeout(() => setTyping(true), delay),
        );
        delay += beat;
        timers.current.push(
          setTimeout(() => {
            setTyping(false);
            setMessages((m) => [...m, { from: "bot", text, key: nextKey() }]);
          }, delay),
        );
        // tiny gap between consecutive bot bubbles
        if (i < n.bubbles.length - 1) delay += prefersReduced ? 60 : 240;
      });
    },
    [prefersReduced],
  );

  /* First open → kick off the greeting once. */
  const startConversation = useCallback(() => {
    if (hasOpened) return;
    setHasOpened(true);
    playNode("greeting");
  }, [hasOpened, playNode]);

  const handleOpen = () => {
    setOpen(true);
    startConversation();
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    // Return focus to the launcher for keyboard users.
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  /* Reset the whole demo to the top. */
  const restart = () => {
    clearTimers();
    setTyping(false);
    setMessages([]);
    setChosenSlot("");
    setNode("greeting");
    seq.current = 0;
    // Replay greeting on the next frame so the cleared log paints first.
    requestAnimationFrame(() => playNode("greeting"));
  };

  /* Handle a quick-reply chip tap: echo the patient bubble, then advance. */
  const onChip = (chip: Chip) => {
    if (chip.id === "restart") {
      restart();
      return;
    }
    // Echo the patient's choice.
    setMessages((m) => [...m, { from: "user", text: chip.echo, key: nextKey() }]);

    // Map the chip to the next node + side effects.
    let next = "greeting";
    switch (chip.id) {
      case "book_botox":
        next = "offer_slot";
        break;
      case "pricing":
        next = "pricing";
        break;
      case "question":
        next = "question";
        break;
      case "slot_thu":
        setChosenSlot("Thursday at 2:30 PM");
        next = "confirm";
        break;
      case "slot_sat":
        setChosenSlot("Saturday at 10:00 AM");
        next = "confirm";
        break;
      case "other_time":
        next = "other_time";
        break;
      case "confirm_book":
        next = "booked";
        break;
    }

    setNode(next);

    if (next === "booked") {
      // Terminal: build the confirmation copy from the chosen slot.
      const slot = chosenSlot || "your selected time";
      const beat = prefersReduced ? 90 : TYPING_MS;
      timers.current.push(setTimeout(() => setTyping(true), 0));
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          setMessages((m) => [
            ...m,
            {
              from: "bot",
              text: `You're booked for ${slot} — we'll text a confirmation to the number on file. 🎉`,
              key: nextKey(),
            },
          ]);
        }, beat),
      );
      timers.current.push(
        setTimeout(
          () => {
            setMessages((m) => [
              ...m,
              {
                from: "bot",
                text: "Can't wait to see you. Drive safe, and welcome to the subtle WOW. — The Happy Clinic team 💛",
                key: nextKey(),
              },
            ]);
          },
          beat + (prefersReduced ? 120 : 700),
        ),
      );
    } else {
      playNode(next);
    }
  };

  /* Escape closes; focus the panel on open. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the panel.
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  /* Keep the transcript scrolled to the newest message. */
  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, typing]);

  /* Cleanup all pending timers on unmount. */
  useEffect(() => () => clearTimers(), []);

  const booked = node === "booked";
  const currentChips = useMemo<Chip[]>(() => {
    if (booked) return [{ id: "restart", label: "Replay the demo", echo: "" }];
    return SCRIPT[node]?.chips ?? [];
  }, [node, booked]);

  // Chips only become tappable once the bot has finished its current turn.
  const chipsLive = !typing && hasOpened;

  return (
    <>
      {/* ---- Launcher (fixed bottom-right) ----
          On mobile it sits ABOVE the MobileActionBar (which owns bottom:0,
          ~64px tall) so the two floating elements never collide; the safe-area
          inset keeps it clear of the home indicator. On lg+ the action bar is
          hidden, so it drops to a normal bottom-right offset. */}
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={handleOpen}
            aria-label="Open the Happy Clinic concierge — demo booking chat"
            initial={prefersReduced ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            whileHover={prefersReduced ? undefined : { y: -2 }}
            style={{
              right: "max(1rem, env(safe-area-inset-right))",
              // Clear the mobile action bar (~64px + its safe-area pad) on small
              // screens; the lg override below tightens it once the bar is gone.
              bottom:
                "calc(max(1rem, env(safe-area-inset-bottom)) + var(--hc-concierge-lift, 5.25rem))",
            }}
            className={cn(
              "hc-press fixed z-50 flex items-center gap-2.5 rounded-full lg:[--hc-concierge-lift:1.25rem]",
              "bg-[var(--color-accent)] py-3 pl-3 pr-4 text-[var(--color-accent-fg)]",
              "shadow-[0_18px_44px_-14px_oklch(52%_0.087_178_/_0.85)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15">
              <ChatIcon className="h-5 w-5" />
              {/* gentle "unread" ping — pure decoration, reduced-motion safe */}
              <span
                aria-hidden
                className={cn(
                  "absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-gold)]",
                  !prefersReduced && "hc-concierge-ping",
                )}
              />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Chat with us
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ---- Panel ----
          Mobile: a bottom sheet pinned to the bottom edge, near-full-width but
          NEVER full-viewport (top inset keeps the page peeking behind it).
          Desktop: a tidy floating card in the bottom-right corner. */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile-only scrim so the sheet reads as a layer, not a takeover.
                Tapping it closes. Hidden on lg+ (desktop card needs no scrim). */}
            <motion.button
              type="button"
              aria-label="Close concierge"
              tabIndex={-1}
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-[oklch(20%_0.06_252_/_0.42)] backdrop-blur-[2px] lg:hidden"
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="false"
              aria-label="Happy Clinic concierge — demo booking chat"
              tabIndex={-1}
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 28, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 20, scale: 0.98 }
              }
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "glass-strong fixed z-50 flex flex-col overflow-hidden border border-[var(--color-border)] shadow-[0_30px_80px_-30px_oklch(20%_0.06_252_/_0.7)] focus:outline-none",
                // Mobile: bottom sheet, near-full width, capped height so the
                // page is never fully trapped behind it.
                "inset-x-2 bottom-2 rounded-[1.5rem]",
                "max-h-[min(82vh,40rem)]",
                // Desktop: floating card bottom-right.
                "lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[24rem] lg:max-h-[34rem]",
              )}
              style={{
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-accent)] px-4 py-3 text-[var(--color-accent-fg)]">
                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
                  <SpiralIcon className="h-5 w-5" />
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-success)]"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold leading-tight">
                    Happy Clinic concierge
                  </p>
                  <p className="truncate text-[0.7rem] leading-tight text-white/80">
                    Typically replies in seconds · Denver
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white/15 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/90">
                  Demo
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close concierge"
                  className="hc-press grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/90 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Transcript */}
              <div
                ref={logRef}
                role="log"
                aria-live="polite"
                aria-label="Conversation"
                className="flex-1 space-y-3 overflow-y-auto bg-[var(--color-bg)] px-4 py-4"
              >
                {messages.map((m) =>
                  m.from === "bot" ? (
                    <Bubble key={m.key} from="bot" reduced={!!prefersReduced}>
                      {m.text}
                    </Bubble>
                  ) : (
                    <Bubble key={m.key} from="user" reduced={!!prefersReduced}>
                      {m.text}
                    </Bubble>
                  ),
                )}

                {typing && <TypingBubble reduced={!!prefersReduced} />}
              </div>

              {/* Quick-reply chips / actions */}
              <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 pb-3 pt-3">
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    {chipsLive &&
                      currentChips.map((chip) => (
                        <motion.button
                          key={chip.id}
                          type="button"
                          onClick={() => onChip(chip)}
                          layout={!prefersReduced}
                          initial={
                            prefersReduced
                              ? { opacity: 0 }
                              : { opacity: 0, y: 8 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }
                          }
                          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                          className={cn(
                            "hc-press min-h-[40px] rounded-full px-4 py-2 text-sm font-semibold",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                            chip.id === "confirm_book" || chip.id === "restart"
                              ? "bg-[var(--color-gold)] text-[var(--color-gold-ink)] shadow-[0_10px_26px_-12px_oklch(86%_0.15_96_/_0.9)]"
                              : "border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-deep)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)]",
                          )}
                        >
                          {chip.label}
                        </motion.button>
                      ))}
                  </AnimatePresence>
                </div>

                {/* Honesty + compliance footer line */}
                <p className="mt-3 px-1 text-center text-[0.62rem] leading-snug text-[var(--color-fg-subtle)]">
                  Concierge preview — a scripted demo of the booking assistant.
                  It books &amp; routes only; medical questions go to our team.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---- A single chat bubble ---- */
function Bubble({
  from,
  reduced,
  children,
}: {
  from: "bot" | "user";
  reduced: boolean;
  children: React.ReactNode;
}) {
  const isBot = from === "bot";
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex", isBot ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[86%] text-pretty rounded-2xl px-3.5 py-2.5 text-[0.83rem] leading-relaxed",
          isBot
            ? "rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)]"
            : "rounded-br-md bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ---- "Concierge is typing" indicator ---- */
function TypingBubble({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-start"
      aria-hidden
    >
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]",
              !reduced && "hc-concierge-dot",
            )}
            style={!reduced ? { animationDelay: `${i * 0.16}s` } : undefined}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11.5h7M8.5 14.5h4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* The clinic's spiral mark, simplified for the chat header avatar. */
function SpiralIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 12a3 3 0 1 1 3-3 5 5 0 1 1-5 5 7 7 0 1 1 7-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
