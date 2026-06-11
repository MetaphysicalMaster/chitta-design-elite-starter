"use client";

/**
 * PetalHero — hero section + the lazy WebGL boundary.
 *
 * The drifting cherry-blossom petal field (R3F) is dynamically imported with
 * ssr:false (only legal inside a client component — Next 16). Until it mounts
 * (and on mobile / reduced-motion / no-WebGL), we render the static CSS layered
 * petal field (`.sakura-fallback--ink`) so there is never a blank frame, no CLS,
 * and full graceful degradation.
 *
 * REBRAND: the hero is now SUMI-BLACK luxury — real sakura-pink petals drift
 * over a black-tie night with gold dawn glints; copy is rice-paper white + a
 * gold sheen highlight. This is the real brand's black + gold + sakura world and
 * ties straight into the gold awards rail below.
 *
 * The scroll progress drives a shared `flowRef` (1 = full petal storm at the
 * top → calm as you descend), passed into the scene so the field settles into
 * stillness — mono no aware, the gentle fading of the bloom.
 */

import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { InkStroke } from "./InkStroke";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const PetalScene = dynamic(() => import("./PetalScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * SceneErrorBoundary — the WebGL fail-safe. THREE.WebGLRenderer can throw at
 * construction even when a bare probe context succeeded (attribute mismatches,
 * per-tab context limits, flaky ANGLE/GPU process). R3F surfaces that as a
 * render-phase exception; without a boundary it bubbles as an uncaught error
 * and strands an orphaned 300×150 <canvas> in the DOM. This boundary catches
 * it, reports up (so the hero unmounts the whole canvas wrapper — no orphan),
 * and the always-painted CSS petal field simply carries on. Never retried.
 */
class SceneErrorBoundary extends Component<
  { onFail: () => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function useEnableWebGL() {
  const prefersReduced = useReducedMotion();
  const [ok, setOk] = useState(false);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const mqLite = window.matchMedia("(min-width: 1280px)");
    const saveData =
      // @ts-expect-error — connection is non-standard but widely supported
      navigator.connection?.saveData === true;

    // Probe with the SAME attributes the R3F renderer will request — a bare
    // getContext("webgl") succeeding does NOT guarantee the antialias +
    // high-performance context THREE asks for will (observed in QA: manual
    // probe OK, WebGLRenderer constructor threw). Free the probe context
    // immediately so it never counts against the per-tab context budget.
    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      const attrs: WebGLContextAttributes = {
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      };
      const ctx = (c.getContext("webgl2", attrs) ||
        c.getContext("webgl", attrs)) as WebGLRenderingContext | null;
      hasWebGL = !!ctx;
      ctx?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      hasWebGL = false;
    }

    const update = () => {
      setOk(mq.matches && hasWebGL && !saveData);
      // Heavier petal budget + far-layer bokeh only on large viewports.
      setLite(!mqLite.matches);
    };
    update();
    mq.addEventListener("change", update);
    mqLite.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      mqLite.removeEventListener("change", update);
    };
  }, [prefersReduced]);

  return { enabled: ok, lite };
}

const ease = [0.16, 1, 0.3, 1] as const;

export function PetalHero() {
  const prefersReduced = useReducedMotion();
  const { enabled, lite } = useEnableWebGL();

  // If the renderer still throws past the probe, fail CLOSED for the session:
  // unmount the canvas wrapper (no orphaned <canvas>) and never remount.
  const [sceneFailed, setSceneFailed] = useState(false);
  const onSceneFail = useCallback(() => setSceneFailed(true), []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Shared flow value: 1 at the top (full storm) → ~0.35 as the hero exits.
  const flowRef = useRef(1);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    flowRef.current = 1 - p * 0.65;
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : -50]);
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [1, 1, prefersReduced ? 1 : 0],
  );

  // Hero entrance — FAIL-SAFE, STATE-DRIVEN PLAY ON MOUNT.
  //
  // The hero is ALWAYS above the fold, so its copy must be visible the instant
  // the screen paints — never gated on an animation lifecycle. Two prior
  // regressions proved this: whileInView's in-view callback never fired at mount
  // during the R3F-canvas + Lenis-init race (black void), and the plain
  // initial→animate spread ALSO stranded every element at its `initial`
  // opacity:0/translateY(18px) on cold load when the play-on-mount keyframe
  // failed to apply — the same race, just killing the mount path instead.
  //
  // The cure: visibility can NEVER depend on a JS animation completing.
  //  1. `initial={false}` → Framer renders the element at its CURRENT animate
  //     target on first paint (no opacity:0 initial frame to get stuck on); SSR
  //     and a stalled JS runtime both leave the copy fully visible.
  //  2. A post-mount `useEffect` flips `mounted` AFTER first paint, so the
  //     entrance is a state transition from the (already-visible-as-fallback)
  //     pre-mount target to the same visible resting state — independent of
  //     scroll, IntersectionObserver, and the canvas race.
  //  3. A CSS safety net (`.hn-hero-copy { opacity: 1 }`) guarantees the column
  //     is opaque even if Framer never hydrates at all.
  // Reduced-motion hard-cuts to visible (no transform, no ramp delay).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const item = (i: number) => ({
    initial: false as const,
    animate: mounted
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: prefersReduced ? 0 : 18 },
    transition: {
      duration: 0.85,
      ease,
      delay: prefersReduced ? 0 : 0.1 + i * 0.09,
    },
  });

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Hanami Medspa — the art of becoming, in bloom"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[var(--night-0)]"
    >
      {/* Layer 0: static sumi-black night + layered petal field — always painted
          (SSR + fallback, zero CLS). The section itself carries the sumi-black
          base so the hero is solid black-tie even before the canvas/fallback. */}
      <div className="sakura-fallback sakura-fallback--ink absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL petal field (desktop, motion-ok, webgl-ok only) —
          boundary-guarded so a renderer-construction failure degrades cleanly
          to the CSS petal field above (no orphaned canvas, no uncaught error). */}
      {enabled && !sceneFailed && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <SceneErrorBoundary onFail={onSceneFail}>
            <PetalScene lite={lite} flowRef={flowRef} />
          </SceneErrorBoundary>
        </div>
      )}

      {/* Legibility wash — the hero is DARK, so we DEEPEN behind the COPY COLUMN
          only (left). Capped to ~60% width (where the copy sits) so the falling
          sakura on the RIGHT read bright and pink instead of being muddied to
          maroon by a full-width scrim. Copy stays WCAG-AA over any frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 w-full max-w-[62%] bg-gradient-to-r from-[oklch(13%_0.003_60_/_0.86)] via-[oklch(14%_0.003_60_/_0.4)] to-transparent lg:max-w-[68%] lg:from-[oklch(13%_0.003_60_/_0.9)] lg:via-[oklch(14%_0.003_60_/_0.46)]"
      />
      {/* a gentle bottom anchor for the stat rail — lightened so it scrims the
          copy, not the petals (the densest near-layer reads sakura at the base). */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-[oklch(13%_0.003_60_/_0.62)] to-transparent"
      />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="hn-hero-copy mx-auto w-full max-w-6xl px-6 pt-28 pb-16 sm:px-8 md:pt-32"
      >
        <motion.p
          {...item(0)}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[oklch(82%_0.09_88_/_0.4)] bg-[oklch(20%_0.006_60_/_0.55)] px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-bright)] backdrop-blur-md"
        >
          <span aria-hidden className="petal-mark h-2.5 w-2.5" />
          DFW Favorites Winner · Fort Worth Top Doctor · 花見
        </motion.p>

        <motion.h1
          {...item(1)}
          className="font-display max-w-[15ch] text-balance text-[var(--color-bg)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.04 }}
        >
          The art of becoming —{" "}
          <span className="font-display-em bloom-sheen">in bloom.</span>
          {/* the sumi-e signature — a brush stroke pulled under the headline
              once the copy settles (mount-drawn: the hero is above the fold).
              Decorative + fail-safe: SSR/no-JS/reduced-motion ship it drawn. */}
          <InkStroke
            tone="champagne"
            draw="mount"
            delay={1.15}
            className="mt-4 w-44 opacity-90 sm:w-56"
          />
        </motion.h1>

        <motion.p
          {...item(2)}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[var(--color-bg)]/78"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.64 }}
        >
          Fort Worth&apos;s award-winning med spa, where every face is shaped by
          one set of hands —{" "}
          <span className="font-medium text-[var(--color-bg)]">
            Dr. Elaine Phuah
          </span>
          , DO, MBA. Injectables, laser &amp; IPL, held to the quiet patience of{" "}
          <span className="italic">hanami</span> — the art of noticing beauty as
          it unfolds.
        </motion.p>

        <motion.div
          {...item(3)}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="#book"
            className={cn(
              "hn-sheen group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold tracking-tight",
              "shadow-[0_18px_50px_-18px_oklch(72%_0.11_86_/_0.6)]",
              "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_oklch(78%_0.11_86_/_0.78)]",
              "active:translate-y-0 active:scale-[0.98]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            Book your consultation
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#injector"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "glass-dark font-medium text-[var(--color-bg)]",
              "transition-[background-color,transform] duration-300 hover:bg-[oklch(26%_0.006_60_/_0.6)]",
              "active:scale-[0.98]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            Meet Dr. Phuah
          </Link>
        </motion.div>

        {/* Hero stats lead with the OWNABLE differentiator (one injector — the
            Seed Thought) and let the TrustBar + AwardsRail carry the honors, so
            the same two awards aren't stated three times in the first screen. */}
        <motion.dl
          {...item(4)}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 sm:gap-x-14"
        >
          {[
            { v: "One injector", k: "Dr. Phuah places every syringe" },
            { v: "DO · MBA", k: "Physician-led, in person" },
            { v: "Fort Worth", k: "8th Ave · by appointment" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-[1.7rem] leading-none tnum text-[var(--color-accent-bright)] sm:text-[1.85rem]">
                {s.v}
              </dt>
              <dd className="mt-2 max-w-[18ch] text-xs uppercase tracking-[0.14em] text-[var(--color-bg)]/68">
                {s.k}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue — same fail-safe pattern: initial:false so it can't freeze
          invisible if the mount keyframe never applies; it simply fades in once
          `mounted` flips (and is harmlessly visible if Framer never hydrates). */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: mounted ? 1 : 0.0001 }}
        transition={{ delay: 1.2, duration: 0.9 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(82%_0.09_88_/_0.45)] bg-[oklch(20%_0.006_60_/_0.45)] p-1 backdrop-blur-sm">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--color-accent-bright)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
