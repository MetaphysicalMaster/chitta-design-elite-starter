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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";
import { DermalFallback } from "./DermalFallback";

gsap.registerPlugin(ScrollTrigger);

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
  const { capable, lite } = useEnableWebGL();
  const sectionRef = useRef<HTMLElement>(null);
  const active = useActiveWhenVisible(sectionRef);
  const showScene = capable && active;

  /* ----- DESCENT THROUGH THE DERMIS (the signature scroll experience) -----
     A GSAP ScrollTrigger pins the hero and scrubs `descentRef.p` 0→1 while
     the visitor scrolls: the Three.js camera tracks DOWN through the strata
     (corneum → epidermis → dermis) and dollies IN, the DoF focal plane follows
     the descent, the copy lifts away, a micrometer depth gauge reads out the
     live depth, and the closing annotation surfaces in the deep dermis — the
     literal "he reads deeper". Desktop + motion-ok only; under reduced motion
     or on mobile nothing pins and the page flows exactly as before. */
  const descentRef = useRef({ p: 0 });
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

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        let railH = railRef.current?.offsetHeight ?? 0;
        let lastDepthText = "";
        let lastIdx = -1;

        // Center the needle hairline on its exact depth point (yPercent is a
        // separate GSAP channel, so the scrubbed y never clobbers it).
        if (needleRef.current) gsap.set(needleRef.current, { yPercent: -50 });
        const setNeedleY = needleRef.current
          ? gsap.quickSetter(needleRef.current, "y", "px")
          : null;

        const onUpdate = (self: ScrollTrigger) => {
          const p = self.progress;
          descentRef.current.p = p;

          // Instrument needle + live µm readout (transform + text only).
          if (setNeedleY) setNeedleY(p * railH);
          if (readoutRef.current) {
            const txt = formatDepth(depthAt(p));
            if (txt !== lastDepthText) {
              lastDepthText = txt;
              readoutRef.current.textContent = txt;
            }
          }
          // Active stratum label highlight.
          const idx = strataIndexAt(p);
          if (idx !== lastIdx) {
            lastIdx = idx;
            labelRefs.current.forEach((el, i) => {
              if (!el) return;
              el.style.opacity = i === idx ? "1" : "0.4";
              el.style.color =
                i === idx
                  ? "var(--color-accent-bright)"
                  : "oklch(90% 0.018 70)";
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

        // The copy lifts away as the descent begins — the lattice takes the
        // stage (parallax-up + fade over the first ~45% of the descent).
        if (copyRef.current) {
          tl.to(copyRef.current, { opacity: 0, y: -64, duration: 0.45 }, 0);
        }
        // Scroll cue dissolves immediately (it has done its job).
        if (cueRef.current) {
          tl.to(cueRef.current, { opacity: 0, duration: 0.12 }, 0);
        }
        // Deep-dermis annotation: the hairline draws, then the figure caption
        // surfaces — the journal-plate landing of the metaphor.
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
          descentRef.current.p = 0;
        };
      },
    );

    return () => mm.revert();
  }, []);

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
          <LatticeScene lite={lite} descent={descentRef} />
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
          column only.

          MOBILE (<md): the WebGL gate never opens, so the backdrop is the
          static dermal SVG whose upper strata are light cream/tan — and the
          copy spans the FULL width, so the to-r scrim's transparent right end
          let the right halves of paragraph lines wash out (QA: light-gray on
          near-white). A md:hidden full-width vertical espresso scrim keeps the
          whole copy block over dark: a breath of the cream "surface" survives
          at the very top, then ≥0.78 alpha through the entire copy zone
          (AA+ for the oklch(93%) lead), easing toward the bottom. Desktop
          scrims are untouched. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 md:hidden bg-[linear-gradient(180deg,oklch(18%_0.032_54_/_0.34)_0%,oklch(18%_0.032_54_/_0.78)_14%,oklch(19%_0.034_56_/_0.86)_38%,oklch(18%_0.032_54_/_0.8)_72%,oklch(17%_0.03_54_/_0.68)_100%)]"
      />
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
        ref={copyRef}
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
          className="mt-7 max-w-[52ch] text-pretty font-light text-[oklch(93%_0.014_72_/_0.92)] [text-shadow:0_1px_18px_oklch(14%_0.03_54_/_0.55)]"
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
                "active:translate-y-0 active:scale-[0.98] active:duration-100",
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

      {/* ----- The micrometer DEPTH GAUGE (desktop, motion-ok) — the precision
          instrument that narrates the descent: a hairline rail with the four
          strata labelled at physical depths, a teal needle that tracks the
          scroll, and a live tabular-numeric µm readout. Decorative for AT
          (aria-hidden); under reduced motion / mobile it never animates and
          stays hidden. ----- */}
      {!prefersReduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-7 z-10 hidden items-center md:flex lg:right-12"
        >
          <div ref={railRef} className="relative h-[56svh] w-px">
            {/* rail + fine tick column */}
            <span className="absolute inset-y-0 right-0 w-px bg-[oklch(82%_0.035_66_/_0.3)]" />
            <span className="strata-ticks absolute inset-y-0 right-[-3px] w-[7px] opacity-25" />

            {/* strata labels at physical positions */}
            {STRATA.map((s, i) => (
              <div
                key={s.label}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="absolute right-4 -translate-y-1/2 text-right transition-[color,opacity] duration-500"
                style={{ top: `${s.at}%`, opacity: i === 0 ? 1 : 0.4 }}
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.26em]">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[0.58rem] tracking-[0.08em] opacity-70 tnum">
                  {s.depth}
                </p>
              </div>
            ))}

            {/* the needle — a teal crosshair hairline + live depth readout */}
            <div
              ref={needleRef}
              className="absolute right-0 top-0 flex translate-x-1/2 items-center gap-2"
            >
              <span className="whitespace-nowrap rounded-full border border-[var(--glass-border-dark)] bg-[var(--glass-bg-dark)] px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.1em] text-[var(--color-accent-bright)] backdrop-blur-md tnum">
                <span ref={readoutRef}>0 µm</span>
              </span>
              <span className="relative block h-px w-8 bg-[var(--color-accent-bright)]">
                <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--color-accent-bright)] shadow-[0_0_8px_oklch(72%_0.115_194_/_0.8)]" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ----- Deep-dermis annotation — the journal-plate caption that lands
          the metaphor at the bottom of the descent. Hairline draws, then the
          figure caption surfaces. Decorative reinforcement (aria-hidden). ----- */}
      {!prefersReduced && (
        <div
          ref={annotRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[18svh] left-6 z-10 hidden opacity-0 sm:left-8 md:block"
        >
          <div className="flex items-center gap-3">
            <span
              ref={annotRuleRef}
              className="block h-px w-12 origin-left bg-[var(--color-accent-bright)]"
            />
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-accent-bright)] tnum">
              Fig. 01 — Dermal cross-section
            </p>
          </div>
          <p className="font-display mt-4 max-w-[24ch] text-balance text-3xl leading-snug text-[oklch(97%_0.012_72)] drop-shadow-[0_2px_24px_oklch(14%_0.03_54_/_0.7)] lg:text-4xl">
            The diagnosis is rarely at the surface.{" "}
            <span className="font-display-em text-[var(--color-accent-bright)]">
              He reads deeper.
            </span>
          </p>
        </div>
      )}

      {/* Scroll cue (wrapped so the descent timeline can dissolve it without
          fighting the framer entrance animation) */}
      <div ref={cueRef} className="pointer-events-none absolute inset-x-0 bottom-6">
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center"
        >
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(80%_0.04_66_/_0.4)] p-1">
            <motion.span
              className="block h-2 w-1 rounded-full bg-[var(--color-accent-bright)]"
              animate={prefersReduced ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
