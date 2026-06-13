"use client";

/**
 * Concierge — the visible face of the Growth-OS "missed-call / front desk"
 * module, and the centerpiece of the SimplySkin pitch demo.
 *
 * A fixed bottom-right launcher opens a small chat panel (a near-full-width
 * bottom sheet on mobile) that runs a SCRIPTED, fully canned conversation in
 * THIS clinic's quiet-editorial voice — demonstrating the missed-call → book
 * flow end to end. Pure local state machine: no backend, no fetch, no env,
 * no timers that touch the network. Instant, deterministic, static-export safe.
 *
 * Honesty: the panel wears a small "Concierge preview" tag so a visitor knows
 * it is a demonstration, matching the "sample" disclosure convention used
 * across these mockups.
 *
 * COMPLIANCE (hard): this assistant ONLY books / qualifies / routes. It never
 * gives medical advice, never quotes clinical outcomes, never asks for health
 * information; pricing is only ever a vague "starting at". Anything clinical
 * routes to "our team will call you". The scripted tree below cannot leave
 * these rails — there is no free-text input that could elicit PHI.
 *
 * COLLISION: the slug has no pre-existing bottom-right floating pill or mobile
 * action bar — the only fixed chrome is SiteNav (top, z-50) and the decorative
 * LightSweep (z-3, pointer-events:none). This launcher sits at z-40 (below the
 * nav, above content) so there is exactly one bottom-right bubble on the page.
 *
 * Brand: warm-paper glass panel, deep-charcoal ink, one whisper of the
 * desaturated teal accent — restrained, never a saturated SaaS chat widget.
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

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* The scripted conversation tree.                                     */
/* Every reply is canned and on-rails: book / qualify / route only.    */
/* ------------------------------------------------------------------ */

type Chip = { label: string; next: NodeId };
type NodeId =
  | "open"
  | "book-tox"
  | "book-consult"
  | "question"
  | "pricing"
  | "slot-pick"
  | "booked"
  | "routed";

type Node = {
  /** Concierge lines shown when this node becomes active. */
  lines: string[];
  /** Tappable quick-reply chips the visitor can choose. */
  chips?: Chip[];
  /** Terminal node — shows the warm close, no further chips. */
  terminal?: boolean;
};

/* The signature treatment for this clinic's demo path. Kept generic + on the
   booking rail — never a clinical claim. */
const SIGNATURE = "Facial balancing";

const TREE: Record<NodeId, Node> = {
  open: {
    lines: [
      "Hi! Sorry we missed you — we’re with a patient right now.",
      "I can get you booked in under a minute. What brings you in today?",
    ],
    chips: [
      { label: `Book ${SIGNATURE}`, next: "book-tox" },
      { label: "New-client consultation", next: "book-consult" },
      { label: "I have a question", next: "question" },
      { label: "Pricing", next: "pricing" },
    ],
  },

  "book-tox": {
    lines: [
      `Lovely — ${SIGNATURE.toLowerCase()} with one of our medical providers.`,
      "We have a couple of openings at our Fishers studio this week. Which suits you?",
    ],
    chips: [
      { label: "Thursday · 10:30 AM", next: "slot-pick" },
      { label: "Friday · 2:00 PM", next: "slot-pick" },
      { label: "Next available", next: "slot-pick" },
    ],
  },

  "book-consult": {
    lines: [
      "A new-client consultation is the perfect place to start — a calm, no-pressure conversation about what you’d like.",
      "Here are the next openings. Pick whatever fits.",
    ],
    chips: [
      { label: "Thursday · 11:15 AM", next: "slot-pick" },
      { label: "Saturday · 9:30 AM", next: "slot-pick" },
      { label: "Next available", next: "slot-pick" },
    ],
  },

  question: {
    lines: [
      "Happy to help. For anything about your skin or a treatment plan, our medical team will want to speak with you directly — they’ll give you a proper answer.",
      "Want me to have them give you a quick call, or shall I book you a consultation?",
    ],
    chips: [
      { label: "Have the team call me", next: "routed" },
      { label: "Book a consultation", next: "book-consult" },
    ],
  },

  pricing: {
    lines: [
      "Of course. Treatments here start at a range we’ll confirm in person, because every plan is tailored to you.",
      "The easiest first step is a consultation — your provider will walk you through options and pricing with no obligation.",
    ],
    chips: [
      { label: "Book a consultation", next: "book-consult" },
      { label: "Have the team call me", next: "routed" },
    ],
  },

  "slot-pick": {
    // Reached after a slot chip; the chosen time is rendered dynamically by the
    // machine (see handleChip), so this node only needs the confirm chip.
    lines: ["Perfect choice. Shall I lock that in for you?"],
    chips: [{ label: "Yes, book it", next: "booked" }],
  },

  booked: {
    lines: [
      "You’re booked — we’ll text a confirmation and a reminder the day before.",
      "We can’t wait to take care of you. See you soon. ✦",
    ],
    terminal: true,
  },

  routed: {
    lines: [
      "Done — our team will call you shortly, usually the same day.",
      "Thank you for reaching out to SimplySkin. We’ll be in touch very soon. ✦",
    ],
    terminal: true,
  },
};

/* ------------------------------------------------------------------ */
/* Transcript model.                                                   */
/* ------------------------------------------------------------------ */

type Turn =
  | { who: "bot"; id: string; text: string }
  | { who: "user"; id: string; text: string };

let _seq = 0;
const nextKey = () => `t${_seq++}`;

function botTurns(lines: string[]): Turn[] {
  return lines.map((text) => ({ who: "bot", id: nextKey(), text }));
}

/* ------------------------------------------------------------------ */
/* Sub-components.                                                     */
/* ------------------------------------------------------------------ */

function ConciergeMark() {
  // A small monogram avatar in the brand — the quiet "front desk" face.
  return (
    <span
      aria-hidden
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-accent)] text-[0.8rem] font-medium text-[var(--color-accent-fg)] shadow-[0_6px_18px_-8px_oklch(54%_0.04_184_/_0.7)]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M5 18.5c1.2-3.2 4-4.8 7-4.8s5.8 1.6 7 4.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

function Bubble({
  who,
  text,
  reduced,
}: {
  who: "bot" | "user";
  text: string;
  reduced: boolean | null;
}) {
  const isBot = who === "bot";
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={cn("flex w-full gap-2.5", isBot ? "justify-start" : "justify-end")}
    >
      {isBot && <ConciergeMark />}
      <p
        className={cn(
          "max-w-[82%] text-pretty rounded-2xl px-3.5 py-2.5 text-[0.92rem] leading-relaxed",
          isBot
            ? "rounded-tl-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)]"
            : "rounded-tr-md bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
        )}
      >
        {text}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Concierge.                                                          */
/* ------------------------------------------------------------------ */

export function Concierge() {
  const reduced = useReducedMotion();
  const panelId = useId();
  const titleId = useId();

  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState<NodeId>("open");
  const [turns, setTurns] = useState<Turn[]>(() => botTurns(TREE.open.lines));

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const node = TREE[nodeId];

  // Keep the transcript pinned to the latest turn / chip row.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, nodeId, open]);

  // Esc closes; return focus to the launcher.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // When the panel opens, move focus into it (first chip or close button).
  useEffect(() => {
    if (!open) {
      launcherRef.current?.focus({ preventScroll: true });
      return;
    }
    const t = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        "[data-chip], [data-close]",
      );
      first?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [open]);

  const handleChip = useCallback((chip: Chip) => {
    setTurns((prev) => [...prev, { who: "user", id: nextKey(), text: chip.label }]);

    // A slot chip threads the chosen time into the confirmation copy so the
    // booked message reads back the real selection — still fully canned.
    if (TREE[chip.next].terminal) {
      setNodeId(chip.next);
      setTurns((prev) => [...prev, ...botTurns(TREE[chip.next].lines)]);
      return;
    }

    if (chip.next === "slot-pick") {
      // Remember the literal slot label for the booked confirmation.
      _lastSlot = chip.label;
    }
    setNodeId(chip.next);
    setTurns((prev) => [...prev, ...botTurns(TREE[chip.next].lines)]);
  }, []);

  const restart = useCallback(() => {
    _lastSlot = null;
    setNodeId("open");
    setTurns(botTurns(TREE.open.lines));
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
  }, []);

  // The booked confirmation reads back the chosen slot when present.
  const bookedReadback = useMemo(() => {
    if (nodeId !== "booked" || !_lastSlot) return null;
    return _lastSlot;
  }, [nodeId]);

  return (
    <>
      {/* ---- Launcher (single bottom-right bubble) ---- */}
      <motion.button
        ref={launcherRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close concierge" : "Open the SimplySkin concierge — book a visit"}
        onClick={() => setOpen((o) => !o)}
        initial={reduced ? false : { opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 1.1 }}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        className={cn(
          // Below the nav (z-50), above content. Safe-area aware on mobile.
          "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40",
          "flex items-center gap-2.5 rounded-full py-3 pl-3 pr-4 sm:pr-5",
          "border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 backdrop-blur-md",
          "shadow-[0_18px_50px_-18px_oklch(40%_0.012_70_/_0.45)]",
          "transition-[transform,box-shadow,opacity] duration-300",
          "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-18px_oklch(40%_0.012_70_/_0.55)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          open && "pointer-events-none opacity-0",
        )}
      >
        <ConciergeMark />
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[0.92rem] font-medium text-[var(--color-fg)]">
            Concierge
          </span>
          <span className="text-[0.66rem] font-normal text-[var(--color-fg-subtle)]">
            Book in under a minute
          </span>
        </span>
      </motion.button>

      {/* ---- Panel ---- */}
      <AnimatePresence>
        {open && (
          <>
            {/* Scrim — mobile only; dismisses on tap. Desktop keeps the page
                fully visible behind the small panel. */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-[oklch(24%_0.01_66_/_0.32)] backdrop-blur-[2px] sm:hidden"
            />

            <motion.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="false"
              aria-labelledby={titleId}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.42, ease: EASE }}
              className={cn(
                "fixed z-40 flex flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_40px_90px_-30px_oklch(40%_0.012_70_/_0.6)]",
                // Mobile: bottom sheet, near-full-width, capped height — never
                // covers the whole viewport (top stays visible/tappable).
                "inset-x-2 bottom-2 max-h-[82svh] rounded-[1.5rem]",
                // Desktop: a compact docked card, bottom-right.
                "sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[27rem] sm:max-h-[34rem]",
              )}
            >
              {/* Header */}
              <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <ConciergeMark />
                  <div className="leading-tight">
                    <p
                      id={titleId}
                      className="font-display text-[1.02rem] text-[var(--color-fg)]"
                    >
                      SimplySkin Concierge
                    </p>
                    <p className="flex items-center gap-1.5 text-[0.68rem] text-[var(--color-fg-subtle)]">
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
                      />
                      Replies instantly
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Honesty tag — this is a demonstration. */}
                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[0.56rem] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    Concierge preview
                  </span>
                  <button
                    type="button"
                    data-close
                    aria-label="Close concierge"
                    onClick={() => setOpen(false)}
                    className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </header>

              {/* Transcript */}
              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
                aria-live="polite"
                aria-atomic="false"
              >
                {turns.map((t) => (
                  <Bubble key={t.id} who={t.who} text={t.text} reduced={reduced} />
                ))}

                {/* Booked slot read-back chip — a quiet confirmation card. */}
                {nodeId === "booked" && bookedReadback && (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
                    className="ml-[2.625rem] flex items-center gap-2.5 rounded-2xl border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)]/30 px-3.5 py-3"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0 text-[var(--color-accent-deep)]"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M5 12.5l4.2 4.2L19 6.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[0.85rem] text-[var(--color-fg)]">
                      Confirmed · <span className="tnum">{bookedReadback}</span> · Fishers
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Action rail — quick-reply chips (the only input surface, so no
                  free-text PHI can be entered). Terminal nodes show a restart. */}
              <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3.5">
                {node.terminal ? (
                  <div className="flex flex-col gap-2.5">
                    <a
                      href="tel:+13173481313"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-fg)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                    >
                      Prefer to talk? Call (317) 348-1313
                    </a>
                    <button
                      type="button"
                      data-chip
                      onClick={restart}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                    >
                      Start over
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {node.chips?.map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        data-chip
                        onClick={() => handleChip(chip)}
                        className={cn(
                          "min-h-[40px] rounded-full border px-3.5 py-2 text-[0.86rem] font-medium",
                          "border-[var(--color-accent-subtle)] bg-[var(--color-bg)] text-[var(--color-fg)]",
                          "transition-[transform,border-color,background-color] duration-200",
                          "hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]/30",
                          "active:scale-[0.97]",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                        )}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quiet compliance footnote — booking only. */}
                <p className="mt-3 text-center text-[0.6rem] leading-snug text-[var(--color-fg-subtle)]">
                  Booking &amp; questions only — our medical team handles anything clinical.
                  Demonstration of the Growth&nbsp;OS front desk.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* Module-scoped scratch for the chosen slot label so the booked read-back can
   echo it. Reset on restart. Lives outside React state intentionally: it never
   needs to trigger a render on its own — the node transition that reads it does.
   Static-safe: plain in-memory value, no storage, no network. */
let _lastSlot: string | null = null;
