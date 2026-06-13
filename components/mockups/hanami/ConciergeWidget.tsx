"use client";

/**
 * ConciergeWidget — the visible face of the Growth-OS "missed-call / front desk"
 * module, and the centerpiece of the pitch demo. A fixed bottom-right chat
 * launcher that opens a small panel running a SCRIPTED, fully-canned conversation
 * in Hanami's voice: it demonstrates the missed-call → book flow without any
 * backend. Pure local state machine; instant; static-export safe.
 *
 * COLLISION NOTE: the hanami slug has NO pre-existing bottom-right floating
 * element (the nav "Book" is sticky-TOP; BookingCTA + the phone/text lines are
 * in-flow sections). So this is the page's single floating affordance — there is
 * no second bubble to merge with. The launcher hides itself while the panel is
 * open so the two never stack in the same corner. It also yields the bottom-right
 * corner once the in-flow #book booking section is on screen, so the floating
 * bubble never sits ON TOP of the real booking card (no two competing "book"
 * surfaces fighting at the same moment).
 *
 * COMPLIANCE (HARD): the concierge ONLY books / qualifies / routes. It NEVER
 * gives medical advice, NEVER quotes clinical outcomes, NEVER asks for health
 * information. Pricing is only a vague "starting at" framing. Anything clinical
 * is routed to "our team will call you." A persistent "Concierge preview · demo"
 * tag keeps it honest, and a footnote states no real booking is submitted.
 *
 * A11y: dialog role + labelled; ESC closes; focus moves into the panel on open
 * and returns to the launcher on close; focus is trapped within the panel while
 * open; quick-reply chips are real buttons (>=40px tall); aria-live announces new
 * concierge messages. Reduced-motion: no slide/scale, instant show; typing dwell
 * collapses to ~0. Mobile (<=520px): the panel becomes a bottom sheet that never
 * covers the whole viewport (caps at 82svh, leaves the top breathing).
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Scripted conversation graph — fully canned, in Dr. Phuah's voice.   */
/* Each NODE is a concierge turn (one or more bubbles) + the tappable   */
/* quick replies it offers. Picking a reply appends the user bubble and */
/* advances to the next node. No free-text input — there is nothing to  */
/* send and no PHI to collect (compliance).                             */
/* ------------------------------------------------------------------ */

type NodeId =
  | "open"
  | "treatment"
  | "question"
  | "pricing"
  | "slot"
  | "booked"
  | "clinical";

type ChipKind = "default" | "gold";

type Chip = {
  /** the label shown on the tappable reply */
  label: string;
  /** the node to advance to */
  to: NodeId;
  /** the user-bubble text recorded when tapped (defaults to label) */
  said?: string;
  kind?: ChipKind;
};

type ConvoNode = {
  /** the concierge's bubble(s) for this turn */
  lines: string[];
  /** the quick-reply chips offered after the lines finish */
  chips: Chip[];
  /** a closing turn — no chips, shows the restart affordance instead */
  terminal?: boolean;
};

// THE SIGNATURE TREATMENT — neuromodulators ("tox") is Hanami's "most requested"
// per the Services menu, placed by Dr. Phuah. We name it warmly, not clinically.
const SIGNATURE = "Tox with Dr. Phuah";

const SCRIPT: Record<NodeId, ConvoNode> = {
  open: {
    lines: [
      "Hi, lovely — so sorry we missed you just now. We’re with a patient at the moment 🌸",
      "I’m the Hanami concierge. Want me to get you on Dr. Phuah’s book before her week fills up?",
    ],
    chips: [
      { label: `Book — ${SIGNATURE}`, to: "treatment", kind: "gold" },
      { label: "I have a question", to: "question" },
      { label: "What’s the pricing like?", to: "pricing" },
    ],
  },
  treatment: {
    lines: [
      "Wonderful choice — every face here is by Dr. Phuah herself, never handed off.",
      "Your first visit is a complimentary consultation, no obligation. Here’s her next opening:",
    ],
    chips: [
      { label: "Thursday · 11:30 AM", to: "slot", said: "Thursday at 11:30 works", kind: "gold" },
      { label: "Show me another time", to: "slot", said: "Could I see another time?" },
    ],
  },
  question: {
    lines: [
      "Of course — ask away. For anything about your skin or a specific result, Dr. Phuah will go through it with you in person; I’ll just get you in front of her.",
      "Most women start with a complimentary consultation so she can learn your face first. Shall I hold a spot?",
    ],
    chips: [
      { label: "Yes — hold a consult", to: "treatment", said: "Yes, please hold a consult", kind: "gold" },
      { label: "It’s about a treatment concern", to: "clinical", said: "It’s about a specific concern" },
    ],
  },
  pricing: {
    lines: [
      "Happy to set expectations — Hanami is physician-placed work, so treatments are quoted to your plan, not off a menu.",
      "Consults are complimentary, and treatments start in the everyday-aesthetic range. Dr. Phuah confirms the exact plan in person. Want me to book your complimentary consult?",
    ],
    chips: [
      { label: "Yes — book my consult", to: "treatment", said: "Yes, book my consult", kind: "gold" },
      { label: "Just the question, thanks", to: "question", said: "Actually, I had a question" },
    ],
  },
  slot: {
    lines: [
      "Perfect. I’ll pencil you in with Dr. Phuah and we’ll text a confirmation to the number you called from.",
      "One last thing — tap to confirm and you’re set 🌸",
    ],
    chips: [
      { label: "Confirm my spot", to: "booked", said: "Confirm my spot", kind: "gold" },
    ],
  },
  booked: {
    lines: [
      "You’re booked for Thursday at 11:30 AM with Dr. Phuah — we’ll text a confirmation shortly.",
      "We can’t wait to meet you. The art of becoming begins here — see you soon 🌸",
    ],
    chips: [],
    terminal: true,
  },
  clinical: {
    // COMPLIANCE: anything that veers clinical is routed to a human, with NO
    // advice, NO outcome claims, and NO request for health information.
    lines: [
      "That’s exactly the kind of thing Dr. Phuah likes to look at herself — I’m not able to advise on anything clinical here.",
      "Let me have our team give you a quick call so she can answer it properly. Want me to set that up?",
    ],
    chips: [
      { label: "Yes — have the team call me", to: "booked", said: "Yes, please have the team call", kind: "gold" },
      { label: "I’d rather just book a consult", to: "treatment", said: "I’ll book a consult instead" },
    ],
  },
};

/* A rendered transcript entry. */
type Turn =
  | { who: "bot"; text: string; key: string }
  | { who: "user"; text: string; key: string };

/* ------------------------------------------------------------------ */

function PetalIcon({ className }: { className?: string }) {
  // A small sakura glyph — the brand's flower, drawn as five soft petals.
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      {[0, 72, 144, 216, 288].map((deg) => (
        <path
          key={deg}
          d="M12 12 C 12 7, 14.4 4.4, 12 1.6 C 9.6 4.4, 12 7, 12 12 Z"
          fill="currentColor"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="1.5" fill="var(--color-accent-bright)" />
    </svg>
  );
}

export function ConciergeWidget() {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState<NodeId>("open");
  const [turns, setTurns] = useState<Turn[]>([]);
  // how many of the current node's lines have "arrived" (typing dwell)
  const [revealed, setRevealed] = useState(0);
  // hide the floating launcher once the real #book section is on screen, so the
  // bubble never competes with the in-flow booking card in the same corner.
  const [bookInView, setBookInView] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const titleId = useId();
  const seq = useRef(0);

  const node = SCRIPT[nodeId];
  const chipsVisible = revealed >= node.lines.length;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  // Reveal the active node's lines one at a time (a short "typing" dwell), then
  // expose the quick replies. Reduced-motion collapses dwell to near-zero.
  const playNode = useCallback(
    (id: NodeId) => {
      clearTimers();
      const { lines } = SCRIPT[id];
      setRevealed(0);
      const step = prefersReduced ? 60 : 620;
      lines.forEach((_, i) => {
        timers.current.push(
          setTimeout(() => setRevealed(i + 1), step * (i + 1)),
        );
      });
    },
    [clearTimers, prefersReduced],
  );

  // Append the revealed bot lines into the transcript as they "arrive".
  useEffect(() => {
    setTurns((prev) => {
      const botForNode = prev.filter(
        (t) => t.who === "bot" && t.key.startsWith(`${nodeId}:`),
      ).length;
      if (revealed <= botForNode) return prev;
      const additions: Turn[] = [];
      for (let i = botForNode; i < revealed; i++) {
        additions.push({
          who: "bot",
          text: node.lines[i],
          key: `${nodeId}:${i}`,
        });
      }
      return [...prev, ...additions];
    });
  }, [revealed, nodeId, node.lines]);

  // Keep the transcript scrolled to the latest turn.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, chipsVisible]);

  const handleChip = useCallback(
    (chip: Chip) => {
      seq.current += 1;
      setTurns((prev) => [
        ...prev,
        { who: "user", text: chip.said ?? chip.label, key: `u:${seq.current}` },
      ]);
      setNodeId(chip.to);
      playNode(chip.to);
    },
    [playNode],
  );

  const restart = useCallback(() => {
    clearTimers();
    seq.current = 0;
    setTurns([]);
    setNodeId("open");
    playNode("open");
  }, [clearTimers, playNode]);

  // Open / close. On open, seed the opening turn + move focus inside. On close,
  // return focus to the launcher and reset the conversation for the next demo.
  const openPanel = useCallback(() => {
    setOpen(true);
    seq.current = 0;
    setTurns([]);
    setNodeId("open");
    playNode("open");
  }, [playNode]);

  const closePanel = useCallback(() => {
    setOpen(false);
    clearTimers();
    launcherRef.current?.focus();
  }, [clearTimers]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => panelRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC closes; Tab is trapped within the open panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closePanel();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, closePanel]);

  // Yield the bottom-right corner to the real in-flow booking section so the
  // floating launcher never sits on top of the page's actual booking card.
  useEffect(() => {
    const target = document.getElementById("book");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setBookInView(entry.isIntersecting),
      { threshold: 0.18 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // Clean up timers on unmount.
  useEffect(() => () => clearTimers(), [clearTimers]);

  const transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.34, ease: [0.16, 1, 0.3, 1] as const };

  // The launcher is hidden while the panel is open (no double bubble) AND while
  // the real #book section is on screen (no corner collision with the booking
  // card). It re-appears when the user scrolls away again.
  const launcherHidden = open || bookInView;

  const chips = useMemo(() => node.chips, [node]);

  return (
    <>
      {/* -------- Floating launcher (single bottom-right affordance) -------- */}
      <AnimatePresence>
        {!launcherHidden && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={openPanel}
            aria-haspopup="dialog"
            aria-label="Open the Hanami concierge — booking preview"
            initial={prefersReduced ? false : { opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 12 }}
            transition={transition}
            className={cn(
              "group fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2.5 overflow-hidden rounded-full py-3 pl-3 pr-5 sm:bottom-6 sm:right-6",
              "bg-[var(--ink-deep)] text-[var(--color-bg)]",
              "ring-1 ring-[oklch(82%_0.09_88_/_0.35)] shadow-[0_18px_50px_-18px_oklch(16%_0.003_60_/_0.85)]",
              "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-accent)]">
              <PetalIcon className="h-5 w-5 text-[var(--color-accent-fg)]" />
              {/* live presence dot */}
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--ink-deep)] bg-[var(--color-success)]"
              />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-semibold">Chat &amp; book</span>
              <span className="block text-[0.66rem] text-[var(--color-accent-bright)]">
                We reply in a blossom’s breath
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* -------------------------- Chat panel --------------------------- */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile scrim — dims the page behind the bottom sheet on small
                screens only (so the desktop popover stays unobtrusive). Tapping
                it closes the panel. */}
            <motion.button
              type="button"
              aria-label="Close concierge"
              tabIndex={-1}
              onClick={closePanel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="fixed inset-0 z-[59] bg-[oklch(14%_0.003_60_/_0.42)] backdrop-blur-[2px] sm:hidden"
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="false"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 26, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 20, scale: 0.98 }
              }
              transition={transition}
              className={cn(
                "fixed z-[61] flex flex-col overflow-hidden outline-none",
                // Mobile: bottom sheet, near full-width, capped so it NEVER traps
                // the viewport (top breathing room + safe-area inset).
                "inset-x-0 bottom-0 max-h-[82svh] rounded-t-[1.75rem]",
                // Desktop: a tidy popover anchored bottom-right.
                "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[34rem] sm:max-h-[calc(100svh-3rem)] sm:w-[24rem] sm:rounded-[1.5rem]",
                "border border-[oklch(85%_0.1_88_/_0.22)] bg-[var(--night-1)]",
                "shadow-[0_-20px_60px_-30px_oklch(10%_0_0_/_0.7)] sm:shadow-[0_30px_80px_-30px_oklch(10%_0_0_/_0.7)]",
              )}
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              {/* This room's own gold aura, echoing the booking section. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(80% 36% at 50% 0%, oklch(72% 0.11 86 / 0.18), transparent 70%)",
                }}
              />

              {/* ---- Header ---- */}
              <header className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-accent)]">
                  <PetalIcon className="h-5 w-5 text-[var(--color-accent-fg)]" />
                  <span
                    aria-hidden
                    className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--night-1)] bg-[var(--color-success)]"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    id={titleId}
                    className="font-display text-lg leading-none text-[var(--color-bg)]"
                  >
                    Hanami Concierge
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[0.7rem] text-[var(--color-bg)]/65">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                    Online · every face by Dr. Phuah
                  </p>
                </div>
                {/* Honesty tag — this is a demo, said plainly. */}
                <span className="rounded-full border border-[var(--color-accent-bright)]/35 px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-bright)]">
                  Concierge preview
                </span>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close concierge"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--color-bg)]/70 transition-colors hover:bg-white/10 hover:text-[var(--color-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </button>
              </header>

              {/* ---- Transcript ---- */}
              <div
                ref={logRef}
                className="relative flex-1 space-y-3 overflow-y-auto px-4 py-4"
              >
                <p className="mx-auto w-fit rounded-full bg-white/[0.06] px-3 py-1 text-center text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-bg)]/45">
                  Today
                </p>

                <div aria-live="polite" className="space-y-3">
                  {turns.map((t) =>
                    t.who === "bot" ? (
                      <div key={t.key} className="flex items-end gap-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-accent)]/90">
                          <PetalIcon className="h-3.5 w-3.5 text-[var(--color-accent-fg)]" />
                        </span>
                        <p className="max-w-[80%] text-pretty rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--color-bg)]/90">
                          {t.text}
                        </p>
                      </div>
                    ) : (
                      <div key={t.key} className="flex justify-end">
                        <p className="max-w-[80%] text-pretty rounded-2xl rounded-br-md bg-[var(--color-accent)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--color-accent-fg)]">
                          {t.text}
                        </p>
                      </div>
                    ),
                  )}

                  {/* typing indicator while the next bot line is "arriving" */}
                  {!chipsVisible && (
                    <div className="flex items-end gap-2" aria-hidden>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-accent)]/90">
                        <PetalIcon className="h-3.5 w-3.5 text-[var(--color-accent-fg)]" />
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-3">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="hn-typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-bg)]/55"
                            style={{ animationDelay: `${i * 0.16}s` }}
                          />
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ---- Quick replies / restart ---- */}
              <div className="relative border-t border-white/10 px-4 pb-3 pt-3">
                {node.terminal ? (
                  <div className="flex flex-col gap-2.5">
                    <a
                      href="tel:+18178088938"
                      className="hn-sheen inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-fg)] ring-1 ring-[oklch(88%_0.08_90_/_0.4)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                        <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                      <span className="tnum">Or call us now · (817) 808-8938</span>
                    </a>
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-[var(--color-bg)]/80 transition-colors hover:border-white/45 hover:text-[var(--color-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                    >
                      Replay the demo
                      <span aria-hidden>↺</span>
                    </button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex flex-wrap gap-2 transition-opacity duration-200",
                      chipsVisible ? "opacity-100" : "pointer-events-none opacity-40",
                    )}
                  >
                    {chips.map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        disabled={!chipsVisible}
                        onClick={() => handleChip(chip)}
                        className={cn(
                          "inline-flex min-h-[40px] items-center rounded-full px-4 py-2 text-sm font-medium transition-[transform,background-color,border-color,color] duration-200 active:scale-[0.97]",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
                          chip.kind === "gold"
                            ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] ring-1 ring-[oklch(88%_0.08_90_/_0.4)] hover:-translate-y-0.5"
                            : "border border-white/22 text-[var(--color-bg)]/85 hover:border-white/45 hover:text-[var(--color-bg)]",
                        )}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Persistent honesty footnote — no real booking is submitted. */}
                <p className="mt-3 text-center text-[0.6rem] leading-relaxed text-[var(--color-bg)]/45">
                  Concierge preview · demonstration only — no appointment is
                  submitted online. Books &amp; routes; never medical advice.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
