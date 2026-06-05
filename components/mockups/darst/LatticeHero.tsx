"use client";

/**
 * LatticeHero — hero section + the lazy WebGL boundary.
 *
 * The dermal-lattice R3F scene is dynamically imported with ssr:false (only
 * legal inside a "use client" module — Next 16 gotcha) and only MOUNTED once
 * the hero is on-screen (IntersectionObserver), pausing GPU work when scrolled
 * away or the tab is hidden. Until it mounts — and on mobile / reduced-motion /
 * no-WebGL / save-data — we render the static on-brand dermal SVG illustration
 * over a CSS strata field, so there is never a blank frame, zero CLS, and full
 * graceful degradation.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";
import { DermalFallback } from "./DermalFallback";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const LatticeScene = dynamic(() => import("./LatticeScene"), {
  ssr: false,
  loading: () => null,
});

/** Gate: only enable the heavy WebGL scene on capable, willing devices. */
function useEnableWebGL() {
  const prefersReduced = useReducedMotion();
  const [capable, setCapable] = useState(false);
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

    const update = () => {
      setCapable(mq.matches && hasWebGL && !saveData);
      setLite(mqLite.matches || cores <= 4);
    };
    update();
    mq.addEventListener("change", update);
    mqLite.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      mqLite.removeEventListener("change", update);
    };
  }, [prefersReduced]);

  return { capable, lite };
}

/** Mount the scene only while the hero is intersecting AND the tab is visible. */
function useActiveWhenVisible(ref: React.RefObject<HTMLElement | null>) {
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function LatticeHero() {
  const prefersReduced = useReducedMotion();
  const { capable, lite } = useEnableWebGL();
  const sectionRef = useRef<HTMLElement>(null);
  const active = useActiveWhenVisible(sectionRef);
  const showScene = capable && active;

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
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static dermal field — always painted (SSR + fallback, no CLS) */}
      <div className="lattice-fallback absolute inset-0 -z-20" aria-hidden="true">
        <DermalFallback />
      </div>

      {/* Layer 1: WebGL power element (capable, motion-ok, on-screen, visible) */}
      {showScene && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <LatticeScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any lattice frame WHILE
          letting the WebGL dermal-lattice (resolve / DoF / teal capillary)
          breathe on the right two-thirds where the eye lands after reading. The
          left wash + base anchor stay strong (copy lives there, with its own
          drop-shadow); the right end-stop is now fully clear (0.08 → 0.0) and
          the bottom scrim eased (0.82 → 0.6) so the resolving lattice + teal
          capillary actually read on first paint instead of drowning under a
          flat espresso wash. The radial copy-column ellipse anchors the headline
          column only. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(18%_0.032_54_/_0.92)] from-5% via-[oklch(21%_0.038_56_/_0.42)] via-45% to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(18%_0.032_54_/_0.66)] via-transparent to-[oklch(17%_0.03_54_/_0.6)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(54%_80%_at_20%_54%,oklch(17%_0.03_54_/_0.5),transparent_62%)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-40"
      >
        <motion.p
          variants={item}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-border-dark)] bg-[var(--glass-bg-dark)] px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[oklch(95%_0.014_72)] backdrop-blur-md"
        >
          <span aria-hidden className="text-[var(--color-accent-bright)]">
            ✦
          </span>
          Double board-certified · Charlotte, NC · 20+ years
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[19ch] text-balance text-[oklch(98%_0.01_74)] drop-shadow-[0_2px_30px_oklch(14%_0.03_54_/_0.6)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.02 }}
        >
          Board-certified in dermatology — and{" "}
          <span className="font-display-em text-[var(--color-accent-bright)]">
            dermatopathology.
          </span>{" "}
          Few are.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[oklch(93%_0.014_72_/_0.92)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.58 }}
        >
          Most dermatologists send your biopsy to a lab they&rsquo;ll never
          meet.{" "}
          <span className="font-medium text-[oklch(99%_0.01_74)]">
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
                "bg-[oklch(98%_0.01_74)] font-semibold tracking-tight text-[var(--navy-ink)]",
                "shadow-[0_16px_44px_-16px_oklch(17%_0.03_54_/_0.8)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_22px_58px_-14px_oklch(17%_0.03_54_/_0.9)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
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
              "border border-[var(--glass-border-dark)] bg-[var(--glass-bg-dark)] font-medium text-[oklch(96%_0.012_72)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-[oklch(38%_0.05_60_/_0.5)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            Why this matters
          </Link>
        </motion.div>

        {/* Dual-path scent trail — the medical headline above carries the
            differentiator; this opens the SECOND door so the high-ticket
            aesthetics buyer sees herself above the fold, not eight sections
            down. Two quiet hash-links: a teal medical chip + a coral aesthetic
            chip (the only warm note in the dark hero), each routing the
            scheduler to her intent. */}
        <motion.nav
          variants={item}
          aria-label="Choose your path"
          className="mt-7 flex flex-wrap items-center gap-2.5 text-[0.82rem]"
        >
          <span className="mr-0.5 text-[oklch(82%_0.025_70_/_0.62)]">
            Two paths, one physician:
          </span>
          <Link
            href="#credentials"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--glass-border-dark)] bg-[var(--glass-bg-dark)] px-3.5 py-1.5 font-medium text-[oklch(95%_0.014_72)] backdrop-blur-md transition-colors duration-300 hover:border-[var(--color-accent-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-bright)]"
            />
            Skin cancer &amp; medical
          </Link>
          <Link
            href="#aesthetics"
            className="group inline-flex items-center gap-2 rounded-full border border-[oklch(70%_0.09_32_/_0.42)] bg-[oklch(40%_0.06_34_/_0.32)] px-3.5 py-1.5 font-medium text-[oklch(95%_0.02_46)] backdrop-blur-md transition-colors duration-300 hover:border-[oklch(78%_0.1_34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(78%_0.1_34)]"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[oklch(78%_0.12_34)]"
            />
            Aesthetics &amp; injectables
          </Link>
        </motion.nav>

        {/* No numeric stat row here. The headline + lead already carry "2
            boards" and "20+ years" in prose, and TrustBar (the very next
            section) owns the figures — restating them back-to-back was the
            page's most-scrutinized fold repeating the same two numbers one row
            apart (both counsels flagged it). Dropping the <dl> also lets the
            signature lattice + teal capillary breathe in the lower-right, and
            gives the hero a cleaner scroll into the credential band. The
            dual-path chips above carry the scent trail without numbers. */}
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(80%_0.04_66_/_0.4)] p-1">
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
