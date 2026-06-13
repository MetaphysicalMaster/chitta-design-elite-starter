"use client";

/**
 * Concierge — the visible face of the Growth-OS "missed-call / front desk"
 * module, and the centerpiece of the pitch demo. A fixed bottom-right chat
 * launcher that opens a small panel running a FULLY-CANNED, scripted conversation
 * in Beautox Bar's witty cocktail-bar voice. It demonstrates the missed-call →
 * book flow end-to-end:
 *
 *   greeting ("sorry we missed you — want me to get you booked?")
 *     → tappable quick-reply chips (Book the Classic Pour / a question / pricing)
 *     → concierge offers a sample slot
 *     → tap the slot → "you're booked — we'll text a confirmation"
 *     → warm close.
 *
 * It is a PURE local state machine: zero network, zero fetch, zero env, instant.
 * Static-export safe (ships as static HTML on GitHub Pages).
 *
 * HARD COMPLIANCE — it ONLY books / qualifies / routes:
 *  - NEVER gives medical advice, NEVER quotes clinical outcomes, NEVER asks for
 *    health info. Pricing only as a vague "starting at." Anything clinical routes
 *    to "our team will text/call you."
 *  - Subtly labelled a "Concierge preview" demo so it stays honest.
 *
 * COLLISION: the slug already has SiteNav (fixed top, z-50) and MobileBookingBar
 * (fixed bottom, mobile-only, z-40). There is NO existing bottom-right bubble, so
 * this is the single bottom-right floating element. To avoid sitting ON TOP of the
 * mobile booking bar, the launcher lifts itself (extra bottom offset) on mobile
 * once that bar is showing — it watches the same #top / #book anchors the bar
 * does, so the two never overlap. The open panel is a near-full-width bottom sheet
 * on mobile (never traps the viewport — capped height, internal scroll, dismiss
 * affordances) and a compact card on desktop.
 *
 * A11y: launcher is a labelled toggle; panel is role="dialog" + aria-modal, traps
 * focus, closes on Esc + backdrop tap + close button, restores focus to launcher.
 * Reduced-motion safe. AA contrast. Tap targets ≥ 44px.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { PRIMARY_PHONE_DISPLAY } from "./nap";

/* ----------------------------------------------------------------------------
 * The script. A small directed graph of nodes. Each node is a concierge "say"
 * (one or more bubbles) plus the chips the guest can tap next; terminal nodes are
 * flagged `booked`. Everything here is canned copy — nothing is generated.
 * Voice: party-smart, warm, a little witty — Beautox Bar's bar-tender energy.
 * -------------------------------------------------------------------------- */

type ChipKind = "default" | "book" | "muted";

type Chip = {
  /** what the guest's tapped reply renders as (their own bubble). */
  label: string;
  /** node to advance to. */
  to: NodeId;
  kind?: ChipKind;
};

type Node = {
  /** concierge bubbles, shown in order with a short typing beat between them. */
  say: string[];
  /** quick-reply chips the guest can tap. */
  chips?: Chip[];
  /** marks a terminal confirmation (renders the receipt flourish + restart). */
  booked?: boolean;
};

type NodeId =
  | "greet"
  | "offerSlot"
  | "booked"
  | "question"
  | "pricing"
  | "humanHandoff";

/* The signature treatment the demo books — matches "The Classic Pour" on the
   real Menu (Botox/Dysport). Pricing stays a vague "starting at," per compliance. */
const SIGNATURE = "The Classic Pour";
const SAMPLE_SLOT = "Thursday at 2:00 PM";

const SCRIPT: Record<NodeId, Node> = {
  greet: {
    say: [
      "Hi gorgeous! Sorry we missed you — we're with a guest at the bar right now. \u{1F378}",
      "I'm the Beautox Bar concierge. Want me to grab you a seat? I can get you booked in about 30 seconds.",
    ],
    chips: [
      { label: `Book ${SIGNATURE}`, to: "offerSlot", kind: "book" },
      { label: "I have a question", to: "question" },
      { label: "Pricing?", to: "pricing" },
    ],
  },
  offerSlot: {
    say: [
      `Great pick — ${SIGNATURE} it is. ✨`,
      `I've got a stool open ${SAMPLE_SLOT} at our Maple Grove bar. Want me to hold it?`,
    ],
    chips: [
      { label: `Yes — hold ${SAMPLE_SLOT}`, to: "booked", kind: "book" },
      { label: "A different time", to: "humanHandoff", kind: "muted" },
    ],
  },
  booked: {
    say: [
      `You're booked for ${SAMPLE_SLOT} — we'll text you a confirmation shortly. \u{1F495}`,
      "First visit? It's a free, no-pressure consult — pull up a stool, we'll take great care of you. See you soon!",
    ],
    booked: true,
  },
  pricing: {
    say: [
      `Happy to! ${SIGNATURE} starts at our per-unit Happy-Hour rate — and your first consult is free, so there's zero pressure.`,
      "Your injector walks you through exact pricing in person once they see what you're going for. Want me to get you in?",
    ],
    chips: [
      { label: `Book ${SIGNATURE}`, to: "offerSlot", kind: "book" },
      { label: "Have your team text me", to: "humanHandoff" },
    ],
  },
  question: {
    say: [
      "Of course — ask away! Quick heads-up: I keep it to booking and the basics. \u{1F481}",
      "Anything about your skin, what's right for you, or results is best answered by our licensed injectors — I can have them reach out, or get you in for a free consult.",
    ],
    chips: [
      { label: "Book a free consult", to: "offerSlot", kind: "book" },
      { label: "Have your team text me", to: "humanHandoff" },
    ],
  },
  humanHandoff: {
    say: [
      "Done — I've flagged your number for our team. They'll text you shortly from the bar. \u{1F4F2}",
      "Talk soon! We'll save you a stool. \u{1F378}",
    ],
    booked: true,
  },
};

/* A turn in the rendered transcript: either a concierge bubble or the guest's
   tapped reply. */
type Turn = { who: "bot" | "you"; text: string };

const TYPING_MS = 540; // brief "…" beat between concierge bubbles (motion-gated)

export function Concierge() {
  const prefersReduced = useReducedMotion();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [liftAboveBar, setLiftAboveBar] = useState(false);

  // Conversation state.
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

  /* Play a node: stream its concierge bubbles (with a typing beat), then reveal
     chips. Pure local timers — instant under reduced motion. */
  const playNode = useCallback(
    (id: NodeId) => {
      clearTimers();
      const n = SCRIPT[id];
      setChipsReady(false);

      if (prefersReduced) {
        setTurns((t) => [...t, ...n.say.map((text) => ({ who: "bot" as const, text }))]);
        setChipsReady(true);
        return;
      }

      let delay = 0;
      n.say.forEach((text) => {
        timers.current.push(
          setTimeout(() => setTyping(true), delay),
        );
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

  /* Guest taps a chip: drop their reply, advance the machine. */
  const pick = (chip: Chip) => {
    setTurns((t) => [...t, { who: "you", text: chip.label }]);
    setNode(chip.to);
    setChipsReady(false);
    // play the destination on the next tick so the guest bubble paints first.
    timers.current.push(setTimeout(() => playNode(chip.to), prefersReduced ? 0 : 260));
  };

  const restart = () => {
    clearTimers();
    setTurns([]);
    setTyping(false);
    setChipsReady(false);
    setNode("greet");
    timers.current.push(setTimeout(() => playNode("greet"), prefersReduced ? 0 : 200));
  };

  /* Open: seed the greeting once (only if the transcript is empty so re-opening
     resumes where the guest left off). */
  const openPanel = () => {
    setOpen(true);
    if (turns.length === 0) {
      timers.current.push(setTimeout(() => playNode("greet"), prefersReduced ? 0 : 260));
    }
  };

  const closePanel = useCallback(() => {
    setOpen(false);
    // return focus to the launcher for keyboard users.
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

  // Tidy timers on unmount.
  useEffect(() => () => clearTimers(), []);

  /* Lift the launcher above the mobile booking bar: mirror that bar's logic
     (visible after the hero #top scrolls out, hidden once #book is in view) so on
     mobile the two never stack. Desktop has no bottom bar, so this is inert. */
  useEffect(() => {
    const hero = document.getElementById("top");
    const book = document.getElementById("book");
    if (!hero) return;
    let pastHero = false;
    let atBook = false;
    const update = () => setLiftAboveBar(pastHero && !atBook);

    const heroObs = new IntersectionObserver(
      ([e]) => {
        pastHero = !e.isIntersecting;
        update();
      },
      { rootMargin: "-40% 0px 0px 0px" },
    );
    heroObs.observe(hero);

    let bookObs: IntersectionObserver | undefined;
    if (book) {
      bookObs = new IntersectionObserver(
        ([e]) => {
          atBook = e.isIntersecting;
          update();
        },
        { rootMargin: "0px 0px -20% 0px" },
      );
      bookObs.observe(book);
    }
    return () => {
      heroObs.disconnect();
      bookObs?.disconnect();
    };
  }, []);

  const current = SCRIPT[node];

  return (
    <>
      {/* Launcher — the single bottom-right floating element. On mobile it rides
          up above the sticky booking bar when that bar is showing; on desktop the
          lift is inert (no bottom bar there). Hidden while the panel is open
          (the panel carries its own close affordance on mobile). */}
      <div
        className={cn(
          "fixed right-4 z-50 transition-[bottom] duration-300 sm:right-6",
          // mobile: clear the booking bar (~76px) when it's up, else hug the edge
          // + iOS safe-area; desktop: always hug the corner.
          liftAboveBar
            ? "bottom-[calc(5.25rem+env(safe-area-inset-bottom))]"
            : "bottom-[calc(1rem+env(safe-area-inset-bottom))]",
          "lg:bottom-6",
        )}
      >
        <motion.button
          ref={launcherRef}
          type="button"
          onClick={openPanel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Open the Beautox Bar concierge — book in a tap"
          initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
          animate={
            open
              ? { scale: 0, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={prefersReduced ? undefined : { y: -2 }}
          className={cn(
            "group flex items-center gap-2.5 rounded-full gloss-pill py-3 pl-3 pr-5 text-[var(--color-accent-fg)]",
            "shadow-[0_18px_48px_-16px_oklch(58%_0.16_356_/_0.7)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            open && "pointer-events-none",
          )}
          style={{ minHeight: 52 }}
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(100%_0_0_/_0.18)]"
          >
            <ChatGlyph />
          </span>
          <span className="text-sm font-semibold tracking-tight">Chat &amp; book</span>
          {/* online dot — the "front desk is awake" cue */}
          <span aria-hidden className="relative ml-0.5 flex h-2.5 w-2.5">
            {!prefersReduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-70" />
            )}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)] ring-2 ring-[oklch(100%_0_0_/_0.6)]" />
          </span>
        </motion.button>
      </div>

      {/* Panel + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — tap to dismiss. Subtle on desktop, dims on mobile where
                the sheet is larger. */}
            <motion.div
              key="cc-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closePanel}
              className="fixed inset-0 z-[55] bg-[oklch(16%_0.01_350_/_0.36)] backdrop-blur-[2px] sm:bg-[oklch(16%_0.01_350_/_0.18)]"
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
                // Mobile: a bottom sheet that never covers the whole viewport
                // (capped at 82svh, internal scroll), full-width with side gutters.
                "inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] max-h-[82svh] rounded-[1.5rem]",
                // Desktop: a compact card anchored bottom-right.
                "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-h-[min(34rem,82svh)] sm:w-[24rem]",
                "border border-[var(--color-border)] shadow-[0_40px_90px_-30px_oklch(40%_0.1_356_/_0.45)]",
              )}
            >
              {/* Header — brand bar, concierge identity, honest "preview" tag. */}
              <div className="relative flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--night-0)] px-4 py-3.5 text-[var(--color-bg)]">
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full gloss-pill text-[var(--color-accent-fg)]"
                >
                  <MartiniGlyph />
                </span>
                <div className="min-w-0 flex-1">
                  <p id={titleId} className="font-display text-[0.95rem] leading-tight">
                    Beautox Bar Concierge
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-[oklch(90%_0.008_350_/_0.78)]">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" aria-hidden />
                    Online now &middot; replies in seconds
                  </p>
                </div>
                {/* Honest demo tag */}
                <span className="shrink-0 rounded-full border border-[oklch(80%_0.04_350_/_0.4)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-bright)]">
                  Preview
                </span>
                <button
                  type="button"
                  data-concierge-close
                  onClick={closePanel}
                  aria-label="Close the concierge"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[oklch(92%_0.008_350_/_0.86)] transition-colors hover:bg-[oklch(100%_0_0_/_0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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
                    <p className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent-subtle)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-accent-deep)]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {node === "humanHandoff" ? "Our team will text you" : "Seat held — confirmation incoming"}
                    </p>
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex items-center justify-center gap-1.5 self-center rounded-full border-2 border-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-deep)] transition-colors hover:bg-[var(--color-accent-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
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
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                              chip.kind === "book"
                                ? "gloss-pill text-[var(--color-accent-fg)] shadow-[0_10px_26px_-14px_oklch(60%_0.16_356_/_0.9)] hover:-translate-y-0.5"
                                : chip.kind === "muted"
                                  ? "border-2 border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-deep)]"
                                  : "border-2 border-[var(--color-accent)] text-[var(--color-accent-deep)] hover:bg-[var(--color-accent-subtle)]",
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

                {/* Honest, compliance-forward footnote — books/qualifies/routes
                    only; no medical advice; sample demo. */}
                <p className="mt-3 text-center text-[0.68rem] leading-snug text-[var(--color-fg-subtle)]">
                  Concierge preview &middot; sample conversation. Booking &amp; routing
                  only &mdash; no medical advice. Real bookings &amp; texts wire in on
                  launch. Or call{" "}
                  <span className="font-semibold tnum text-[var(--color-fg-muted)]">{PRIMARY_PHONE_DISPLAY}</span>.
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
            ? "gloss-pill rounded-br-md text-[var(--color-accent-fg)]"
            : "rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)] shadow-[0_8px_22px_-18px_oklch(40%_0.1_356_/_0.5)]",
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
            className="bx-cc-dot h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
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

/* The martini-with-a-syringe brand motif, in miniature. */
function MartiniGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M4 5h16l-8 8-8-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 13v6M9 19h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 3.5l4 4M16.5 5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
