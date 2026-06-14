"use client";

/**
 * Concierge — the AI booking concierge (mirrors beautox-bar/Concierge.tsx). A
 * fixed bottom-right launcher that opens a small panel running a FULLY-CANNED,
 * scripted conversation in Encore's warm, credible voice. It demonstrates the
 * missed-call → book flow end to end, leading with the strategic wedge: The Spa
 * at Encore.
 *
 * PURE local state machine: zero network, zero fetch, zero env, instant —
 * static-export safe (ships as static HTML on GitHub Pages).
 *
 * HARD COMPLIANCE — books / qualifies / routes ONLY:
 *  - NEVER medical advice, NEVER clinical outcomes, NEVER asks for health info.
 *    Pricing only as a vague "starting at / consult." Anything clinical routes
 *    to "our team will text/call you."
 *  - Labelled a "Concierge preview" so it stays honest.
 *
 * COLLISION: this is the single bottom-right floating element. On mobile it
 * lifts above the sticky booking area once the hero scrolls out and the #book
 * anchor isn't in view. The open panel is a near-full-width bottom sheet on
 * mobile (capped height, internal scroll) and a compact card on desktop.
 *
 * A11y: labelled toggle; role="dialog" + aria-modal panel, focus trap, Esc +
 * backdrop + close button, restores focus to the launcher. Reduced-motion safe.
 * AA contrast. Tap targets ≥ 44px.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { PRIMARY_PHONE_DISPLAY } from "./nap";

type ChipKind = "default" | "book" | "muted";
type Chip = { label: string; to: NodeId; kind?: ChipKind };
type Node = { say: string[]; chips?: Chip[]; booked?: boolean };
type NodeId =
  | "greet"
  | "spaPath"
  | "medicalPath"
  | "offerSlot"
  | "booked"
  | "pricing"
  | "humanHandoff";

const SAMPLE_SLOT = "Thursday at 2:00 PM";

const SCRIPT: Record<NodeId, Node> = {
  greet: {
    say: [
      "Hello, and welcome to Encore Dermatology. \u{1F33F} Sorry we missed you — our front desk is with a patient.",
      "I'm the Encore concierge. I can get you booked in about 30 seconds. What brings you in today?",
    ],
    chips: [
      { label: "The Spa at Encore", to: "spaPath", kind: "book" },
      { label: "Medical / skin check", to: "medicalPath" },
      { label: "Pricing?", to: "pricing", kind: "muted" },
    ],
  },
  spaPath: {
    say: [
      "Wonderful — The Spa at Encore is where dermatologic science meets a true spa calm. \u{2728}",
      "Botox & Juvéderm, Sciton Halo, RF microneedling, CoolSculpting, facials & peels — all physician-supervised. Every aesthetic visit begins with a complimentary consult. Shall I find you a time?",
    ],
    chips: [
      { label: "Yes — book a Spa consult", to: "offerSlot", kind: "book" },
      { label: "Have your team text me", to: "humanHandoff", kind: "muted" },
    ],
  },
  medicalPath: {
    say: [
      "Of course. Encore offers full medical & surgical dermatology — skin-cancer checks, acne, eczema, psoriasis, rosacea and more, led by Dr. Londeree. \u{1FA7A}",
      "For anything about your skin specifically, our clinical team is the right voice — I'll keep to booking. Want me to find you an appointment?",
    ],
    chips: [
      { label: "Book a skin exam", to: "offerSlot", kind: "book" },
      { label: "Have your team call me", to: "humanHandoff", kind: "muted" },
    ],
  },
  offerSlot: {
    say: [
      "Great. \u{1F33F}",
      `I have an opening ${SAMPLE_SLOT} at our Gettysburg Rd office in NW Columbus. Want me to hold it for you?`,
    ],
    chips: [
      { label: `Yes — hold ${SAMPLE_SLOT}`, to: "booked", kind: "book" },
      { label: "A different time", to: "humanHandoff", kind: "muted" },
    ],
  },
  booked: {
    say: [
      `You're set for ${SAMPLE_SLOT} — we'll text a confirmation shortly. \u{1F49A}`,
      "New to Encore? Bring a list of any current products and we'll take it from there. We look forward to seeing you.",
    ],
    booked: true,
  },
  pricing: {
    say: [
      "Happy to point you the right way. Aesthetic treatments start with a complimentary consult, and ask about Spa membership for members-only pricing.",
      "Your provider confirms exact pricing in person once they see your goals. Want me to get you in?",
    ],
    chips: [
      { label: "Book a free consult", to: "offerSlot", kind: "book" },
      { label: "Have your team text me", to: "humanHandoff" },
    ],
  },
  humanHandoff: {
    say: [
      "Done — I've flagged your number for our team. They'll reach out shortly. \u{1F4F2}",
      "Talk soon. \u{1F33F}",
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
  const [liftAboveBar, setLiftAboveBar] = useState(false);

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
        setTurns((t) => [...t, ...n.say.map((text) => ({ who: "bot" as const, text }))]);
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

  const openPanel = () => {
    setOpen(true);
    if (turns.length === 0) {
      timers.current.push(setTimeout(() => playNode("greet"), prefersReduced ? 0 : 260));
    }
  };

  const closePanel = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  // Esc + focus trap while open.
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

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, typing, chipsReady]);

  useEffect(() => () => clearTimers(), []);

  // Lift above the mobile sticky zone: visible after the hero scrolls out,
  // hidden once #book is in view (so the launcher never sits over the booking
  // section CTA on small screens).
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
      {/* Launcher */}
      <div
        className={cn(
          "fixed right-4 z-50 transition-[bottom] duration-300 sm:right-6",
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
          aria-label="Open the Encore concierge — book in a tap"
          initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
          animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={prefersReduced ? undefined : { y: -2 }}
          className={cn(
            "group flex items-center gap-2.5 rounded-full bg-[var(--color-accent)] py-3 pl-3 pr-5 text-[var(--color-accent-fg)]",
            "shadow-[0_18px_46px_-16px_oklch(46%_0.09_200_/_0.7)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)]",
            open && "pointer-events-none",
          )}
          style={{ minHeight: 52 }}
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(100%_0_0_/_0.2)]"
          >
            <LeafChatGlyph />
          </span>
          <span className="text-sm font-semibold tracking-tight">Chat &amp; book</span>
          <span aria-hidden className="relative ml-0.5 flex h-2.5 w-2.5">
            {!prefersReduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--leaf-bright)] opacity-70" />
            )}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--leaf-bright)] ring-2 ring-[oklch(100%_0_0_/_0.7)]" />
          </span>
        </motion.button>
      </div>

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
              className="fixed inset-0 z-[55] bg-[oklch(24%_0.03_207_/_0.36)] backdrop-blur-[2px] sm:bg-[oklch(24%_0.03_207_/_0.18)]"
              aria-hidden
            />

            <motion.div
              key="cc-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "fixed z-[60] flex flex-col overflow-hidden bg-[var(--color-bg-elevated)] text-[var(--color-fg)]",
                "inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] max-h-[82svh] rounded-[1.5rem]",
                "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-h-[min(34rem,82svh)] sm:w-[24rem]",
                "border border-[var(--color-border)] shadow-[0_40px_90px_-30px_oklch(40%_0.06_205_/_0.45)]",
              )}
            >
              {/* Header */}
              <div className="relative flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-deep)] px-4 py-3.5 text-[var(--color-bg)]">
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[oklch(100%_0_0_/_0.14)] text-[var(--leaf-bright)]"
                >
                  <LeafGlyph />
                </span>
                <div className="min-w-0 flex-1">
                  <p id={titleId} className="font-display text-[1rem] leading-tight text-white">
                    Encore Concierge
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-[oklch(92%_0.01_200_/_0.8)]">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--leaf-bright)]" aria-hidden />
                    Online now · replies in seconds
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-[oklch(80%_0.04_200_/_0.4)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--leaf-bright)]">
                  Preview
                </span>
                <button
                  type="button"
                  data-concierge-close
                  onClick={closePanel}
                  aria-label="Close the concierge"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[oklch(94%_0.01_200_/_0.86)] transition-colors hover:bg-[oklch(100%_0_0_/_0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--leaf-bright)]"
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
                    <p className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent-subtle)] px-4 py-3 text-center text-sm font-semibold text-[var(--clinical-deep)]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {node === "humanHandoff" ? "Our team will reach out" : "Time held — confirmation incoming"}
                    </p>
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex items-center justify-center gap-1.5 self-center rounded-full border-2 border-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--clinical-deep)] transition-colors hover:bg-[var(--color-accent-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)]"
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
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)]",
                              chip.kind === "book"
                                ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_10px_24px_-14px_oklch(46%_0.09_200_/_0.9)] hover:-translate-y-0.5"
                                : chip.kind === "muted"
                                  ? "border-2 border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--clinical-deep)]"
                                  : "border-2 border-[var(--color-accent)] text-[var(--clinical-deep)] hover:bg-[var(--color-accent-subtle)]",
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

                <p className="mt-3 text-center text-[0.68rem] leading-snug text-[var(--color-fg-subtle)]">
                  Concierge preview · sample conversation. Booking &amp; routing
                  only — no medical advice. Real bookings &amp; texts wire in on
                  launch. Or call{" "}
                  <span className="font-semibold text-[var(--color-fg-muted)] [font-variant-numeric:tabular-nums]">
                    {PRIMARY_PHONE_DISPLAY}
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

/* ---------- presentational helpers ---------- */

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
            : "rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)] shadow-[0_8px_22px_-18px_oklch(40%_0.06_205_/_0.5)]",
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
            className="en-cc-dot h-1.5 w-1.5 rounded-full bg-[var(--clinical)]"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </span>
    </div>
  );
}

function LeafChatGlyph() {
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

/* A small leaf — the tree motif in miniature. */
function LeafGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M5 19c0-7 5-12 14-13C18 13 13 19 6 19c0 0-1-3 2-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
