"use client";

/**
 * PetalHero — hero section + the lazy WebGL boundary.
 *
 * The drifting cherry-blossom petal field (R3F) is dynamically imported with
 * ssr:false (only legal inside a client component — Next 16). Until it mounts
 * (and on mobile / reduced-motion / no-WebGL), we render the static CSS layered
 * petal field (`.sakura-fallback`) so there is never a blank frame, no CLS, and
 * full graceful degradation. The hero is LIGHT (rice-paper dawn) so copy is
 * sumi-ink — airy, botanical, distinct from the dark Timeless sibling hero.
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
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const PetalScene = dynamic(() => import("./PetalScene"), {
  ssr: false,
  loading: () => null,
});

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

    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
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

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReduced ? 0 : 0.09, delayChildren: 0.12 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Hanami Medspa — the art of becoming, in bloom"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static rice-paper dawn + layered petal field — always painted
          (SSR + fallback, zero CLS). */}
      <div className="sakura-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL petal field (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <PetalScene lite={lite} flowRef={flowRef} />
        </div>
      )}

      {/* Legibility wash — the hero is LIGHT, so we LIGHTEN behind the copy
          (left/bottom) to keep sumi-ink copy WCAG-AA over any frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(99%_0.005_352_/_0.9)] via-[oklch(99%_0.005_352_/_0.5)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[oklch(99%_0.006_352_/_0.85)] via-transparent to-[oklch(99%_0.006_352_/_0.35)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ y: copyY, opacity: copyOpacity }}
        className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16 sm:px-8 md:pt-32"
      >
        <motion.p
          variants={item}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--sakura)]/55 bg-[oklch(99%_0.006_352_/_0.6)] px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-deep)] backdrop-blur-md"
        >
          <span aria-hidden className="petal-mark h-2.5 w-2.5" />
          Fort Worth, Texas · 花見 · Cherry-blossom viewing
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[16ch] text-balance text-[var(--color-fg)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.04 }}
        >
          The art of becoming —{" "}
          <span className="font-display-em bloom-sheen">in bloom.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[var(--color-fg-muted)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.64 }}
        >
          A botanical med spa in Fort Worth, where every face is shaped by one
          set of hands —{" "}
          <span className="font-medium text-[var(--color-fg)]">
            Dr. Elaine Phuah
          </span>
          , DO, MBA. Injectables, laser &amp; IPL, held to the quiet patience of{" "}
          <span className="italic">hanami</span> — the art of noticing beauty as
          it unfolds.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "bg-[var(--color-accent-deep)] text-[var(--color-accent-fg)] font-medium tracking-tight",
              "shadow-[0_18px_50px_-18px_oklch(60%_0.15_356_/_0.6)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_oklch(60%_0.15_356_/_0.78)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            Book in 30 seconds
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#injector"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-[var(--sakura)]/60 bg-[oklch(99%_0.006_352_/_0.55)] font-medium text-[var(--color-fg)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-[oklch(96%_0.02_352_/_0.7)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]",
            )}
          >
            Meet Dr. Phuah
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 sm:gap-x-14"
        >
          {[
            { v: "4.9★", k: "Across 243 reviews" },
            { v: "One", k: "Injector · Dr. Phuah, every face" },
            { v: "DO · MBA", k: "Physician-led, in person" },
            { v: "8th Ave", k: "800 8th Ave · Suite 508" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-[1.85rem] leading-none tnum text-[var(--color-fg)]">
                {s.v}
              </dt>
              <dd className="mt-2 max-w-[18ch] text-xs uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                {s.k}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.9 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--sakura)]/60 bg-[oklch(99%_0.006_352_/_0.45)] p-1 backdrop-blur-sm">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--color-accent-deep)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
