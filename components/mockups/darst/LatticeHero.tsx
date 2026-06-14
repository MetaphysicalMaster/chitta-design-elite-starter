"use client";

/**
 * LatticeHero — the hero section.
 *
 * REBUILD (operator revision): the old dot/particle "dermal lattice" WebGL
 * background (LatticeScene + lattice-shaders) is SCRAPPED. The hero is now a
 * LIGHT, warm, editorial field — DermoscopyField — signalling PRECISION +
 * dermatopathology + warm clinical authority through restraint, not particles:
 * a soft warm skin-strata gradient, layered translucent histology bands, one
 * crisp teal depth-line, and a single slow dermoscopy focus-pull lens with a
 * scan-line ("the physician who reads the slide").
 *
 * Because the field is LIGHT, all hero copy is now DARK-INK (warm chocolate
 * brown + teal), AA over the warm field. The signature scroll choreography is
 * retained but recolored for light: a GSAP-pinned focus-read where the copy
 * lifts, a depth gauge tracks the read, and the closing journal caption
 * surfaces. Desktop + motion-ok only; reduced-motion / mobile flow normally.
 *
 * The DermoscopyField is pure CSS+SVG (static-export-safe, no WebGL) and is
 * paused via IntersectionObserver + tab-visibility so it costs nothing off
 * screen. Zero CLS, full graceful degradation, flawless at 390px.
 */

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";
import { DermoscopyField } from "./DermoscopyField";

gsap.registerPlugin(ScrollTrigger);

/** Pause the field whenever the hero is off-screen OR the tab is hidden. */
function useFieldPaused(ref: React.RefObject<HTMLElement | null>) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = ref.current;
    let onScreen = true;
    let visible = true;
    const apply = () => setPaused(!(onScreen && visible));

    let io: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          apply();
        },
        { rootMargin: "120px", threshold: 0 },
      );
      io.observe(el);
    }
    const onVis = () => {
      visible = !document.hidden;
      apply();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref]);
  return paused;
}

const ease = [0.22, 1, 0.36, 1] as const;

/* The depth gauge's strata — positions are % down the instrument rail; the
   physical depths drive the live µm readout (piecewise across boundaries). */
const STRATA = [
  { label: "Stratum corneum", depth: "0–20 µm", at: 9 },
  { label: "Epidermis", depth: "≈0.1 mm", at: 30 },
  { label: "Dermis", depth: "1–4 mm", at: 58 },
  { label: "Hypodermis", depth: "4 mm +", at: 88 },
];

/** Piecewise scroll-progress → physical depth (µm), matching the gauge bands. */
function depthAt(p: number) {
  const bands = [
    { from: 0, to: 0.16, d0: 0, d1: 20 },
    { from: 0.16, to: 0.42, d0: 20, d1: 120 },
    { from: 0.42, to: 0.75, d0: 120, d1: 2000 },
    { from: 0.75, to: 1, d0: 2000, d1: 4200 },
  ];
  const b =
    bands.find((x) => p >= x.from && p <= x.to) ?? bands[bands.length - 1];
  const t = (p - b.from) / (b.to - b.from);
  return b.d0 + (b.d1 - b.d0) * Math.min(1, Math.max(0, t));
}

function formatDepth(um: number) {
  if (um < 1000) return `${Math.round(um)} µm`;
  return `${(um / 1000).toFixed(1)} mm`;
}

/** Which gauge band is active at a given progress (for label highlighting). */
function strataIndexAt(p: number) {
  if (p < 0.16) return 0;
  if (p < 0.42) return 1;
  if (p < 0.75) return 2;
  return 3;
}

export function LatticeHero() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const fieldPaused = useFieldPaused(sectionRef);

  // The GSAP pin re-parents the section into a .pin-spacer; doing so WHILE the
  // framer-motion hero entrance is mid-flight orphans the descendant tweens and
  // freezes the h1 / lead at opacity 0. So we only build the pin AFTER the
  // entrance has fully settled (container onAnimationComplete → entranceDone).
  // Reduced-motion has no entrance to wait on, so it's marked done immediately.
  const [entranceDone, setEntranceDone] = useState(prefersReduced);

  /* ----- THE READ (the signature scroll experience, recolored for the light
     field) ----- A GSAP ScrollTrigger pins the hero and scrubs progress 0→1
     while the visitor scrolls: the copy lifts away, a micrometer depth gauge
     reads out the live depth as the "read" descends through the strata, and a
     closing journal caption surfaces — the literal "he reads deeper". Desktop +
     motion-ok only; under reduced motion / on mobile nothing pins and the page
     flows exactly as before. */
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const annotRef = useRef<HTMLDivElement>(null);
  const annotRuleRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // Wait until the framer entrance has fully settled (see entranceDone note)
    // before creating the pin, so the .pin-spacer re-parent can't freeze the
    // copy mid-animation.
    if (!entranceDone) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        let railH = railRef.current?.offsetHeight ?? 0;
        let lastDepthText = "";
        let lastIdx = -1;

        if (needleRef.current) gsap.set(needleRef.current, { yPercent: -50 });
        const setNeedleY = needleRef.current
          ? gsap.quickSetter(needleRef.current, "y", "px")
          : null;

        const onUpdate = (self: ScrollTrigger) => {
          const p = self.progress;
          if (setNeedleY) setNeedleY(p * railH);
          if (readoutRef.current) {
            const txt = formatDepth(depthAt(p));
            if (txt !== lastDepthText) {
              lastDepthText = txt;
              readoutRef.current.textContent = txt;
            }
          }
          const idx = strataIndexAt(p);
          if (idx !== lastIdx) {
            lastIdx = idx;
            labelRefs.current.forEach((el, i) => {
              if (!el) return;
              el.style.opacity = i === idx ? "1" : "0.42";
              el.style.color =
                i === idx
                  ? "var(--color-accent-deep)"
                  : "oklch(44% 0.04 62)";
            });
          }
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate,
            onRefresh: () => {
              railH = railRef.current?.offsetHeight ?? 0;
            },
          },
        });

        if (copyRef.current) {
          tl.to(copyRef.current, { opacity: 0, y: -64, duration: 0.45 }, 0);
        }
        if (cueRef.current) {
          tl.to(cueRef.current, { opacity: 0, duration: 0.12 }, 0);
        }
        if (annotRuleRef.current) {
          tl.fromTo(
            annotRuleRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.18, ease: "power1.out" },
            0.58,
          );
        }
        if (annotRef.current) {
          tl.fromTo(
            annotRef.current,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" },
            0.62,
          );
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      },
    );

    // Positions may have shifted while the entrance played — refresh once.
    ScrollTrigger.refresh();

    return () => mm.revert();
  }, [entranceDone]);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.08,
        delayChildren: 0.12,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Darst Dermatology — board-certified dermatology and dermatopathology in Charlotte, NC"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[var(--color-bg)]"
    >
      {/* Layer 0: the NEW light dermoscopy field — always painted (SSR-safe
          CSS+SVG, zero CLS, paused off-screen). */}
      <div className="absolute inset-0 -z-10">
        <DermoscopyField paused={fieldPaused} />
      </div>

      {/* Legibility wash — a soft warm-paper veil on the LEFT copy column only,
          so the dark-ink headline holds WCAG-AA over the warmest (deepest) part
          of the field while the lens + strata breathe on the right. The field is
          already light; this is a gentle lift, not a heavy scrim. On mobile the
          copy spans full width, so a slightly broader veil keeps every line AA. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(99%_0.004_78_/_0.86)] from-0% via-[oklch(98%_0.006_74_/_0.5)] via-44% to-transparent md:via-38%"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 md:hidden bg-[linear-gradient(180deg,oklch(99%_0.004_78_/_0.62)_0%,oklch(98.5%_0.005_76_/_0.78)_46%,oklch(97%_0.008_72_/_0.6)_100%)]"
      />

      <motion.div
        ref={copyRef}
        variants={container}
        initial="hidden"
        animate="show"
        // Fires once the staggered children (eyebrow → h1 → lead → CTAs → chips)
        // have all settled. Only THEN do we let GSAP build the pin, so the
        // .pin-spacer re-parent can't freeze the copy mid-entrance.
        onAnimationComplete={() => setEntranceDone(true)}
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-40"
      >
        <motion.p
          variants={item}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[oklch(99%_0.004_78_/_0.7)] px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-muted)] backdrop-blur-md"
        >
          <span aria-hidden className="text-[var(--color-accent-deep)]">
            ✦
          </span>
          Double board-certified · Charlotte, NC · 20+ years
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[19ch] text-balance text-[var(--color-fg)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.02 }}
        >
          Board-certified in dermatology — and{" "}
          <span className="font-display-em text-[var(--color-accent-deep)]">
            dermatopathology.
          </span>{" "}
          Few are.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[var(--color-fg-muted)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.58 }}
        >
          Most dermatologists send your biopsy to a lab they&rsquo;ll never
          meet.{" "}
          <span className="font-medium text-[var(--color-fg)]">
            Dr. Marc A. Darst, MD reads it himself
          </span>{" "}
          — board-certified in both disciplines, caring for Charlotte for over
          two decades. The same expert eye, from a skin-cancer screening to
          natural-looking, never-overdone aesthetics — your skin read by the
          physician who treats you.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Magnetic>
            <Link
              href="#book"
              className={cn(
                "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
                "bg-[var(--color-accent-deep)] font-semibold tracking-tight text-[var(--color-accent-fg)]",
                "shadow-[0_16px_44px_-16px_oklch(48%_0.105_197_/_0.55)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_22px_58px_-14px_oklch(48%_0.105_197_/_0.7)]",
                "active:translate-y-0 active:scale-[0.98] active:duration-100",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
              )}
            >
              Book in 30 seconds
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Magnetic>
          <Link
            href="#credentials"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-[var(--color-border)] bg-[oklch(99%_0.004_78_/_0.7)] font-medium text-[var(--color-fg)] backdrop-blur-md",
              "transition-colors duration-300 hover:border-[var(--color-accent-deep)] hover:text-[var(--color-accent-deep)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            Why this matters
          </Link>
        </motion.div>

        {/* Dual-path scent trail — opens the SECOND door so the high-ticket
            aesthetics buyer sees herself above the fold. A teal medical chip +
            a coral aesthetic chip (the brand's warm note), each routing the
            scheduler to her intent. Recolored for the light field. */}
        <motion.nav
          variants={item}
          aria-label="Choose your path"
          className="mt-7 flex flex-wrap items-center gap-2.5 text-[0.82rem]"
        >
          <span className="mr-0.5 text-[var(--color-fg-subtle)]">
            Two paths, one physician:
          </span>
          <Link
            href="#credentials"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[oklch(99%_0.004_78_/_0.7)] px-3.5 py-1.5 font-medium text-[var(--color-fg)] backdrop-blur-md transition-colors duration-300 hover:border-[var(--color-accent-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-deep)]"
            />
            Skin cancer &amp; medical
          </Link>
          <Link
            href="#aesthetics"
            className="group inline-flex items-center gap-2 rounded-full border border-[oklch(70%_0.09_32_/_0.5)] bg-[var(--color-coral-subtle)] px-3.5 py-1.5 font-medium text-[var(--color-coral-deep)] backdrop-blur-md transition-colors duration-300 hover:border-[var(--color-coral-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-coral-deep)]"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-coral-deep)]"
            />
            Aesthetics &amp; injectables
          </Link>
        </motion.nav>
      </motion.div>

      {/* ----- The micrometer DEPTH GAUGE (desktop, motion-ok) — recolored for
          the light field: a warm hairline rail, the four strata at physical
          depths in dark ink, a teal needle tracking the read, and a live µm
          readout. Decorative (aria-hidden); hidden under reduced motion /
          mobile. ----- */}
      {!prefersReduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-7 z-10 hidden items-center md:flex lg:right-12"
        >
          <div ref={railRef} className="relative h-[56svh] w-px">
            <span className="absolute inset-y-0 right-0 w-px bg-[oklch(45%_0.045_60_/_0.22)]" />
            <span className="strata-ticks absolute inset-y-0 right-[-3px] w-[7px] opacity-30" />

            {STRATA.map((s, i) => (
              <div
                key={s.label}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="absolute right-4 -translate-y-1/2 text-right transition-[color,opacity] duration-500"
                style={{
                  top: `${s.at}%`,
                  opacity: i === 0 ? 1 : 0.42,
                  color:
                    i === 0
                      ? "var(--color-accent-deep)"
                      : "oklch(44% 0.04 62)",
                }}
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.26em]">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[0.58rem] tracking-[0.08em] opacity-70 tnum">
                  {s.depth}
                </p>
              </div>
            ))}

            <div
              ref={needleRef}
              className="absolute right-0 top-0 flex translate-x-1/2 items-center gap-2"
            >
              <span className="whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[oklch(99%_0.004_78_/_0.85)] px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.1em] text-[var(--color-accent-deep)] backdrop-blur-md tnum">
                <span ref={readoutRef}>0 µm</span>
              </span>
              <span className="relative block h-px w-8 bg-[var(--color-accent-deep)]">
                <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--color-accent-deep)] shadow-[0_0_8px_oklch(54%_0.105_197_/_0.6)]" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ----- Deep-dermis annotation — the journal-plate caption that lands the
          metaphor at the bottom of the read. Hairline draws, then the figure
          caption surfaces. Decorative (aria-hidden), dark-ink on light. ----- */}
      {!prefersReduced && (
        <div
          ref={annotRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[18svh] left-6 z-10 hidden opacity-0 sm:left-8 md:block"
        >
          <div className="flex items-center gap-3">
            <span
              ref={annotRuleRef}
              className="block h-px w-12 origin-left bg-[var(--color-accent-deep)]"
            />
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-accent-deep)] tnum">
              Fig. 01 — Dermal cross-section
            </p>
          </div>
          <p className="font-display mt-4 max-w-[24ch] text-balance text-3xl leading-snug text-[var(--color-fg)] lg:text-4xl">
            The diagnosis is rarely at the surface.{" "}
            <span className="font-display-em text-[var(--color-accent-deep)]">
              He reads deeper.
            </span>
          </p>
        </div>
      )}

      {/* Scroll cue */}
      <div ref={cueRef} className="pointer-events-none absolute inset-x-0 bottom-6">
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center"
        >
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(45%_0.045_60_/_0.32)] p-1">
            <motion.span
              className="block h-2 w-1 rounded-full bg-[var(--color-accent-deep)]"
              animate={prefersReduced ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
