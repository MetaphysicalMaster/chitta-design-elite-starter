"use client";

/**
 * BubbleHero — hero section + the lazy WebGL boundary.
 *
 * The "Bubble Bar" R3F scene is dynamically imported with ssr:false (only legal
 * inside a "use client" module — Next 16 gotcha). Until it mounts — and on
 * mobile / reduced-motion / no-WebGL / save-data — we render the static CSS
 * bubble field so there is never a blank frame, zero CLS, and full graceful
 * degradation. The scene itself pauses its render loop when scrolled offscreen
 * or the tab is hidden (IntersectionObserver + visibility).
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";
import { BRAND } from "./nap";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const BubbleScene = dynamic(() => import("./BubbleScene"), {
  ssr: false,
  loading: () => null,
});

/** Gate: only enable the heavy WebGL scene on capable, willing devices. */
function useEnableWebGL() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const mqLite = window.matchMedia("(max-width: 1100px)");
    const saveData =
      // @ts-expect-error — connection is non-standard but widely supported
      navigator.connection?.saveData === true;
    const cores =
      typeof navigator.hardwareConcurrency === "number"
        ? navigator.hardwareConcurrency
        : 8;

    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      hasWebGL = false;
    }

    // SHIP-BLOCKER FIX: mounting the heavy R3F <Canvas> synchronously in this
    // effect steals Motion's very first requestAnimationFrame, so the hero copy's
    // mount transition is never scheduled and the headline/CTAs stay at opacity:0
    // until a scroll/resize. Defer the `enabled` flip past first paint (two rAFs)
    // so the copy reveal renders first; the WebGL scene then mounts a frame later.
    let raf1 = 0;
    let raf2 = 0;
    const update = () => {
      setLite(mqLite.matches || cores <= 4);
      const wantWebGL = mq.matches && hasWebGL && !saveData;
      if (wantWebGL) {
        raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => setEnabled(true));
        });
      } else {
        setEnabled(false);
      }
    };
    update();
    mq.addEventListener("change", update);
    mqLite.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      mq.removeEventListener("change", update);
      mqLite.removeEventListener("change", update);
    };
  }, [prefersReduced]);

  return { enabled, lite };
}

const ease = [0.22, 1, 0.36, 1] as const;

export function BubbleHero() {
  const prefersReduced = useReducedMotion();
  const { enabled, lite } = useEnableWebGL();
  // Fade the scroll cue out once the visitor scrolls so it never competes with
  // the now-revealed CTAs sitting just above it.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.09,
        delayChildren: 0.12,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  return (
    <section
      id="top"
      aria-label="Beautox Bar — a playful Botox bar & med spa in Maple Grove and White Bear Lake, MN"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static champagne-fizz field — always painted (SSR + fallback) */}
      <div className="bubble-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <BubbleScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any fizz frame. Left wash
          anchors the copy column; vertical seats nav + base. (Black-based.) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(14%_0.006_350_/_0.94)] via-[oklch(16%_0.006_350_/_0.55)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(14%_0.006_350_/_0.74)] via-transparent to-[oklch(12%_0.006_350_/_0.9)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(64%_88%_at_24%_52%,oklch(12%_0.006_350_/_0.6),transparent_60%)]"
      />

      {/* whileInView (not animate) so the reveal is driven by an Intersection
          observer that re-fires reliably even if the first paint frame is starved
          by the WebGL mount — the hero is in-view at load, so it plays immediately
          with zero interaction. once:true keeps it a single entrance. */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-40"
      >
        <motion.p
          variants={item}
          className="glass-dark mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[oklch(95%_0.01_350)]"
        >
          <span aria-hidden className="text-[var(--color-accent-bright)]">
            ●
          </span>
          Maple Grove · White Bear Lake, MN · Since {BRAND.foundedYear}
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[16ch] text-balance text-[var(--color-bg)] drop-shadow-[0_2px_44px_oklch(8%_0.01_350_/_0.7)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 0.98 }}
        >
          Where <span className="candy-text--bright">shots &amp; beauty</span>{" "}
          mingle.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty text-[oklch(93%_0.008_350_/_0.92)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
        >
          Pull up a stool at the Twin Cities&apos; playful{" "}
          <span className="font-semibold text-[var(--color-bg)]">Botox bar</span>{" "}
          &amp; med spa — tox, filler, lips, peptides &amp; the glow. Subtle enough
          that they notice <em className="not-italic font-semibold text-[var(--color-bg)]">you</em>,
          never the work — first-timer-friendly, zero judgment. It&apos;s always
          Happy Hour in Maple Grove &amp; White Bear Lake.
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
                "gloss-pill font-semibold tracking-tight text-[var(--color-accent-fg)]",
                "shadow-[0_18px_50px_-16px_oklch(60%_0.18_356_/_0.6)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_24px_64px_-14px_oklch(64%_0.2_356_/_0.74)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
              )}
            >
              Book a pour
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Magnetic>
          <Link
            href="#services"
            className={cn(
              "glass-dark inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "font-semibold text-[var(--color-bg)]",
              "transition-colors duration-300 hover:bg-[oklch(28%_0.008_350_/_0.7)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            See the menu
          </Link>
        </motion.div>

        {/* Risk-reversal at the point of action — a $575+ first injectable's real
            friction is fear, not price; pairing the CTA with the genuine free,
            no-pressure consult (a true offer, also surfaced in Meet) de-risks the
            decisive first step for first-timers. Honest, additive, no new claim. */}
        <motion.p
          variants={item}
          className="mt-5 inline-flex items-center gap-2 text-sm text-[oklch(90%_0.008_350_/_0.86)]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--color-accent-bright)]" fill="none" aria-hidden>
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Free, no-pressure consult — first-timers always welcome.
        </motion.p>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[var(--color-bg)]"
        >
          {/* Mostly aspirational, but one HARD anchor (Est. 2019 / two real
              bars) so the decisive first moment carries verifiable proof — the
              rating + count detail still live in the TrustBar below. */}
          {[
            { v: "Natural", k: "Never frozen" },
            { v: "First-timer", k: "Friendly · zero judgment" },
            { v: `Est. ${BRAND.foundedYear}`, k: "Two Twin Cities bars" },
            { v: "Woman-owned", k: "Nurse-led" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none tnum">{s.v}</dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[oklch(88%_0.008_350_/_0.82)]">
                {s.k}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue — fades back out the moment the page is scrolled. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ delay: scrolled ? 0 : 1.2, duration: scrolled ? 0.35 : 0.8 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(82%_0.12_356_/_0.45)] p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--color-accent-bright)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
