"use client";

/**
 * SkyHero — hero section + the lazy WebGL boundary.
 *
 * The "Breath of Sky" R3F scene is dynamically imported with ssr:false (only
 * legal inside a client component — Next 16). Until it mounts (and on mobile /
 * reduced-motion), we render a static CSS sky gradient so there is never a
 * blank frame, no CLS, and full graceful degradation.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const BreathOfSkyScene = dynamic(() => import("./BreathOfSkyScene"), {
  ssr: false,
  loading: () => null,
});

function useEnableWebGL() {
  const prefersReduced = useReducedMotion();
  const [ok, setOk] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const saveData =
      // @ts-expect-error — connection is non-standard but widely supported
      navigator.connection?.saveData === true;
    // Probe WebGL availability before committing to the heavy scene.
    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(
        c.getContext("webgl2") || c.getContext("webgl")
      );
    } catch {
      hasWebGL = false;
    }

    const update = () => {
      setIsDesktop(mq.matches);
      setOk(mq.matches && hasWebGL && !saveData);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefersReduced]);

  return { enabled: ok, isDesktop };
}

const ease = [0.16, 1, 0.3, 1] as const;

export function SkyHero() {
  const prefersReduced = useReducedMotion();
  const { enabled } = useEnableWebGL();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReduced ? 0 : 0.09, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  return (
    <section
      aria-label="Blue Sky Med Spa — physician-led aesthetics"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static sky — always painted (SSR + fallback, zero CLS) */}
      <div className="sky-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <BreathOfSkyScene />
        </div>
      )}

      {/* Legibility scrims — keep headline WCAG-AA over any sky frame.
          Vertical seats the top nav + bottom; the left wash anchors the copy. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(28%_0.08_255_/_0.42)] via-[oklch(30%_0.08_255_/_0.12)] to-[oklch(26%_0.08_255_/_0.5)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(26%_0.08_255_/_0.45)] via-[oklch(28%_0.08_255_/_0.12)] to-transparent"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16 sm:px-8 md:pt-32"
      >
        <motion.p
          variants={item}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md"
        >
          <span aria-hidden className="text-[var(--gold)]">★</span>
          5.0 Google rating · Physician-led
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[16ch] text-balance text-white drop-shadow-[0_2px_24px_oklch(30%_0.1_255_/_0.45)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.02, fontWeight: 400 }}
        >
          Aesthetics with the
          <span className="italic"> calm of a clear sky.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-[46ch] text-pretty font-light text-white/90"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.5 }}
        >
          German Village&rsquo;s physician-led, family-owned medical spa. Real
          medicine, an artist&rsquo;s eye, and results you can trust &mdash; from{" "}
          <span className="font-medium text-white">Dr. Maura Manning, MD</span>.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "bg-white text-[var(--color-fg)] font-semibold tracking-tight shadow-[var(--glass-shadow)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_oklch(46%_0.12_255_/_0.5)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            )}
          >
            Book in 30 seconds
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#services"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-white/55 bg-white/10 font-medium text-white backdrop-blur-md",
              "transition-colors duration-300 hover:bg-white/20",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            )}
          >
            Explore treatments
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-white/90"
        >
          {[
            { v: "5.0★", k: "Google rating" },
            { v: "MD", k: "Physician-led care" },
            { v: "Est. 2021", k: "Family-owned" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none">{s.v}</dt>
              <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-white/70">
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
        transition={{ delay: 1.1, duration: 0.8 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/50 p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-white/80"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
