"use client";

/**
 * Concierge — The Luxe MedSpa's front-desk concierge, the centerpiece of the
 * pitch demo. A fixed bottom-right launcher that opens a small panel running a
 * FULLY-CANNED, scripted conversation in the brand's warm, elegant voice. It
 * demonstrates the missed-call → book flow end-to-end:
 *
 *   greeting ("so sorry we missed you — may I get you booked?")
 *     → tappable quick-reply chips (Book a consult / a question / pricing)
 *     → concierge offers a sample appointment
 *     → tap it → "you're reserved — we'll text a confirmation"
 *     → warm close.
 *
 * Mirrors the gold reference (beautox-bar/Concierge): PURE local state machine —
 * zero network, zero fetch, zero env, instant. Static-export safe.
 *
 * HARD COMPLIANCE — it ONLY books / qualifies / routes:
 *  - NEVER gives medical advice, NEVER quotes clinical outcomes, NEVER asks for
 *    health info. Pricing only as a vague "consultations are complimentary."
 *    Anything clinical routes to "our team will text/call you."
 *  - Labelled a "Concierge preview" demo so it stays honest.
 *
 * COLLISION: this is the single bottom-right floating element (SiteNav is fixed
 * top). It hugs the corner + iOS safe-area; the open panel is a near-full-width
 * bottom sheet on mobile (capped height, internal scroll, dismiss affordances)
 * and a compact card on desktop.
 *
 * A11y: launcher is a labelled toggle; panel is role="dialog" + aria-modal,
 * traps focus, closes on Esc + backdrop tap + close button, restores focus to
 * launcher. Reduced-motion safe. AA contrast. Tap targets ≥ 44px.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const PHONE_DISPLAY = "(614) 453-2056";

/* ----------------------------------------------------------------------------
 * The script. A small directed graph. Each node is a concierge "say" (one or
 * more bubbles) plus the chips the guest can tap next; terminal nodes are
 * flagged `booked`. Everything is canned copy — nothing is generated.
 * Voice: warm, gracious, refined — The Luxe's white-glove front desk.
 * -------------------------------------------------------------------------- */

type ChipKind = "default" | "book" | "muted";

type Chip = { label: string; to: NodeId; kind?: ChipKind };

type Node = {
  say: string[];
  chips?: Chip[];
  booked?: boolean;
};

type NodeId =
  | "greet"
  | "offerSlot"
  | "booked"
  | "question"
  | "pricing"
  | "humanHandoff";

const SAMPLE_SLOT = "Thursday at 2:00 PM";

const SCRIPT: Record<NodeId, Node> = {
  greet: {
    say: [
      "Hello, lovely — so sorry we missed you! Our team is with a guest at the moment. ✨",
      "I'm The Luxe concierge. May I reserve your complimentary consultation? It takes about 30 seconds.",
    ],
    chips: [
      { label: "Book a free consult", to: "offerSlot", kind: "book" },
      { label: "I have a question", to: "question" },
      { label: "Pricing?", to: "pricing" },
    ],
  },
  offerSlot: {
    say: [
      "Wonderful — let's turn back time. \u{1F90D}",
      `I have a quiet slot ${SAMPLE_SLOT} at our Upper Arlington spa. Shall I hold it for you?`,
    ],
    chips: [
      { label: `Yes — hold ${SAMPLE_SLOT}`, to: "booked", kind: "book" },
      { label: "A different time", to: "humanHandoff", kind: "muted" },
    ],
  },
  booked: {
    say: [
      `You're reserved for ${SAMPLE_SLOT} — we'll text a confirmation shortly. \u{1F49B}`,
      "Your consultation is complimentary and pressure-free. We can't wait to welcome you. See you soon!",
    ],
    booked: true,
  },
  pricing: {
    say: [
      "Of course. Your first consultation is always complimentary — so there's zero pressure to decide anything in advance.",
      "Pricing depends on the treatment plan your provider designs for you in person. Shall I reserve your free consult?",
    ],
    chips: [
      { label: "Book a free consult", to: "offerSlot", kind: "book" },
      { label: "Have your team text me", to: "humanHandoff" },
    ],
  },
  question: {
    say: [
      "Happily — ask away! A gentle note: I keep things to booking and the basics. \u{1F490}",
      "Anything about your skin, what's right for you, or results is best answered by our licensed providers — I can have them reach out, or reserve your complimentary consult.",
    ],
    chips: [
      { label: "Book a free consult", to: "offerSlot", kind: "book" },
      { label: "Have your team text me", to: "humanHandoff" },
    ],
  },
  humanHandoff: {
    say: [
      "Done — I've flagged your number for our team. They'll text you shortly. \u{1F4F2}",
      "Talk soon — we'll take wonderful care of you. ✨",
    ],
    booked: true,
  },
};

type Turn = { who: "bot" | "you"; text: string };

const TYPING_MS = 540;

export function Concierge() {
  const prefersReduced = useReducedMotion();
  const titleId = useId();
  const [open, setOpen] = useState(false);

  const [node, setNode] = useState<NodeId>("greet");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [typing, setTyping] = useState(false);
  const [chipsReady, setChipsReady] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const playNode = useCallback(
    (id: NodeId) => {
      clearTimers();
      const n = SCRIPT[id];
      setChipsReady(false);

      if (prefersReduced) {
        setTurns((t) => [
          ...t,
          ...n.say.map((text) => ({ who: "bot" as const, text })),
        ]);
        setChipsReady(true);
        return;
      }

      let delay = 0;
      n.say.forEach((text) => {
        timers.current.push(setTimeout(() => setTyping(true), delay));
        delay += TYPING_MS;
        timers.current.push(
          setTimeout(() => {
            setTyping(false);
            setTurns((t) => [...t, { who: "bot", text }]);
          }, delay),
        );
        delay += 120;
      });
      timers.current.push(setTimeout(() => setChipsReady(true), delay));
    },
    [prefersReduced],
  );

  const pick = (chip: Chip) => {
    setTurns((t) => [...t, { who: "you", text: chip.label }]);
    setNode(chip.to);
    setChipsReady(false);
    timers.current.push(
      setTimeout(() => playNode(chip.to), prefersReduced ? 0 : 260),
    );
  };

  const restart = () => {
    clearTimers();
    setTurns([]);
    setTyping(false);
    setChipsReady(false);
    setNode("greet");
    timers.current.push(
      setTimeout(() => playNode("greet"), prefersReduced ? 0 : 200),
    );
  };

  const openPanel = () => {
    setOpen(true);
    if (turns.length === 0) {
      timers.current.push(
        setTimeout(() => playNode("greet"), prefersReduced ? 0 : 260),
      );
    }
  };

  const closePanel = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  // Esc to close + light focus trap while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closePanel();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, closePanel]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        panelRef.current
          ?.querySelector<HTMLElement>("[data-concierge-close]")
          ?.focus();
      }, 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Keep the transcript scrolled to the newest turn.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, typing, chipsReady]);

  useEffect(() => () => clearTimers(), []);

  const current = SCRIPT[node];

  return (
    <>
      {/* Launcher — the single bottom-right floating element. */}
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 sm:right-6 lg:bottom-6">
        <motion.button
          ref={launcherRef}
          type="button"
          onClick={openPanel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Open The Luxe concierge — reserve in a tap"
          initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
          animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={prefersReduced ? undefined : { y: -2 }}
          className={cn(
            "group flex items-center gap-2.5 rounded-full py-3 pl-3 pr-5 text-[var(--color-accent-fg)]",
            "bg-gradient-to-br from-[var(--gold-bright)] via-[var(--gold)] to-[var(--gold-deep)]",
            "shadow-[0_18px_44px_-16px_oklch(60%_0.12_72_/_0.7)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
            open && "pointer-events-none",
          )}
          style={{ minHeight: 52 }}
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(100%_0_0_/_0.28)]"
          >
            <ChatGlyph />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Chat &amp; reserve
          </span>
          <span aria-hidden className="relative ml-0.5 flex h-2.5 w-2.5">
            {!prefersReduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-70" />
            )}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)] ring-2 ring-[oklch(100%_0_0_/_0.7)]" />
          </span>
        </motion.button>
      </div>

      {/* Panel + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="cc-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closePanel}
              className="fixed inset-0 z-[55] bg-[oklch(30%_0.02_60_/_0.28)] backdrop-blur-[2px] sm:bg-[oklch(30%_0.02_60_/_0.14)]"
              aria-hidden
            />

            <motion.div
              key="cc-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 28, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 22, scale: 0.98 }
              }
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "fixed z-[60] flex flex-col overflow-hidden bg-[var(--color-bg-elevated)] text-[var(--color-fg)]",
                "inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] max-h-[82svh] rounded-[1.5rem]",
                "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-h-[min(34rem,82svh)] sm:w-[24rem]",
                "border border-[var(--color-border)] shadow-[0_40px_90px_-30px_oklch(50%_0.05_70_/_0.45)]",
              )}
            >
              {/* Header */}
              <div className="relative flex items-center gap-3 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--gold-deep)] to-[var(--gold)] px-4 py-3.5 text-[var(--color-accent-fg)]">
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[oklch(100%_0_0_/_0.3)]"
                >
                  <SparkGlyph />
                </span>
                <div className="min-w-0 flex-1">
                  <p id={titleId} className="font-display text-[1.05rem] leading-tight">
                    The Luxe Concierge
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-[oklch(28%_0.02_60_/_0.8)]">
                    <span
                      className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
                      aria-hidden
                    />
                    Online now &middot; replies in seconds
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-[oklch(28%_0.02_60_/_0.4)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em]">
                  Preview
                </span>
                <button
                  type="button"
                  data-concierge-close
                  onClick={closePanel}
                  aria-label="Close the concierge"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--color-accent-fg)] transition-colors hover:bg-[oklch(100%_0_0_/_0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-fg)]"
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
              </div>

              {/* Transcript */}
              <div
                ref={logRef}
                className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[var(--color-bg-subtle)] px-4 py-4"
                aria-live="polite"
                aria-atomic="false"
              >
                {turns.map((t, i) => (
                  <Bubble key={i} who={t.who} prefersReduced={!!prefersReduced}>
                    {t.text}
                  </Bubble>
                ))}
                {typing && <TypingBubble />}
              </div>

              {/* Quick replies / footer */}
              <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 pb-4 pt-3">
                {current.booked ? (
                  <div className="flex flex-col gap-3">
                    <p className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent-subtle)] px-4 py-3 text-center text-sm font-semibold text-[var(--gold-deep)]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {node === "humanHandoff"
                        ? "Our team will text you"
                        : "Reserved — confirmation incoming"}
                    </p>
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex items-center justify-center gap-1.5 self-center rounded-full border-2 border-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[var(--gold-deep)] transition-colors hover:bg-[var(--color-accent-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]"
                      style={{ minHeight: 44 }}
                    >
                      Run it again
                    </button>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {chipsReady && current.chips && (
                      <motion.div
                        key={node}
                        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-wrap gap-2"
                      >
                        {current.chips.map((chip) => (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => pick(chip)}
                            className={cn(
                              "rounded-full px-4 py-2.5 text-sm font-semibold transition-[transform,background-color,box-shadow] duration-200",
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
                              chip.kind === "book"
                                ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_10px_24px_-14px_oklch(60%_0.12_72_/_0.9)] hover:-translate-y-0.5"
                                : chip.kind === "muted"
                                  ? "border-2 border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--gold)] hover:text-[var(--gold-deep)]"
                                  : "border-2 border-[var(--gold)] text-[var(--gold-deep)] hover:bg-[var(--color-accent-subtle)]",
                            )}
                            style={{ minHeight: 44 }}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Honest, compliance-forward footnote. */}
                <p className="mt-3 text-center text-[0.68rem] leading-snug text-[var(--color-fg-subtle)]">
                  Concierge preview &middot; sample conversation. Booking &amp;
                  routing only &mdash; no medical advice. Real bookings &amp;
                  texts wire in on launch. Or call{" "}
                  <span className="font-semibold tnum text-[var(--color-fg-muted)]">
                    {PHONE_DISPLAY}
                  </span>
                  .
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- small presentational helpers ---------- */

function Bubble({
  who,
  children,
  prefersReduced,
}: {
  who: "bot" | "you";
  children: React.ReactNode;
  prefersReduced: boolean;
}) {
  const isYou = who === "you";
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex", isYou ? "justify-end" : "justify-start")}
    >
      <p
        className={cn(
          "max-w-[82%] text-pretty rounded-2xl px-3.5 py-2.5 text-[0.86rem] leading-relaxed",
          isYou
            ? "rounded-br-md bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
            : "rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)] shadow-[0_8px_22px_-18px_oklch(50%_0.04_70_/_0.5)]",
        )}
      >
        {children}
      </p>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start" aria-hidden>
      <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="luxe-cc-dot h-1.5 w-1.5 rounded-full bg-[var(--gold)]"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </span>
    </div>
  );
}

function ChatGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-4 3.5V15H7.5A2.5 2.5 0 0 1 5 12.5v-6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* A four-point sparkle — the brand's "turn back time" shimmer, in miniature. */
function SparkGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
    </svg>
  );
}
