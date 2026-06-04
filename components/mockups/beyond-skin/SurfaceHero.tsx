"use client";

/**
 * SurfaceHero — hero section + the lazy WebGL boundary.
 *
 * The "Beyond the Surface" particle-morph R3F scene is dynamically imported
 * with ssr:false (only legal inside a "use client" module — Next 16 gotcha).
 * Until it mounts — and on mobile / reduced-motion / no-WebGL / save-data — we
 * render a static CSS surface gradient field so there is never a blank frame,
 * zero CLS, and full graceful degradation.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const SurfaceScene = dynamic(() => import("./SurfaceScene"), {
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

    const update = () => {
      setEnabled(mq.matches && hasWebGL && !saveData);
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

  return { enabled, lite };
}

const ease = [0.16, 1, 0.3, 1] as const;

export function SurfaceHero() {
  const prefersReduced = useReducedMotion();
  const { enabled, lite } = useEnableWebGL();

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
    hidden: { opacity: 0, y: prefersReduced ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
  };

  return (
    <section
      aria-label="Beyond Skin Aesthetics — editorial luxury med spa in Gahanna, Columbus"
      className="grain relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static surface field — always painted (SSR + fallback, no CLS) */}
      <div
        className="surface-fallback absolute inset-0 -z-20"
        aria-hidden="true"
      />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <SurfaceScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any morph frame.
          Left wash anchors the copy column; vertical seats nav + base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(19%_0.02_40_/_0.9)] via-[oklch(20%_0.02_40_/_0.5)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(19%_0.02_40_/_0.7)] via-transparent to-[oklch(18%_0.02_40_/_0.82)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(68%_90%_at_24%_58%,oklch(18%_0.02_40_/_0.55),transparent_60%)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-40"
      >
        <motion.p
          variants={item}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-dark-border)] bg-[var(--glass-dark)] px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[oklch(96%_0.02_80)] backdrop-blur-md"
        >
          <span aria-hidden className="text-[var(--glow-gold)]">
            ✦
          </span>
          Dual board-certified · Gahanna, OH · Est. 2017
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[16ch] text-balance text-[oklch(98%_0.01_80)] drop-shadow-[0_2px_36px_oklch(12%_0.02_40_/_0.7)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 0.98 }}
        >
          Beauty that lives
          <span className="text-molten text-molten-anim italic"> beyond </span>
          the surface.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[50ch] text-pretty font-light text-[oklch(94%_0.012_80_/_0.92)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
        >
          Columbus&rsquo; boldest aesthetics studio — led by{" "}
          <span className="font-medium text-[oklch(99%_0.01_80)]">
            Dr. Matia Mulumba, dual board-certified
          </span>
          . In 2023 we quadrupled our space. This is the brand to match it.
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
                "bg-[oklch(98%_0.01_80)] font-semibold tracking-tight text-[var(--ink-deep)]",
                "shadow-[0_18px_50px_-16px_oklch(72%_0.15_25_/_0.6)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_24px_64px_-14px_oklch(72%_0.15_25_/_0.75)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-gold)]",
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
            href="#experience"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-[var(--glass-dark-border)] bg-[var(--glass-dark)] font-medium text-[oklch(97%_0.01_80)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-[oklch(40%_0.04_40_/_0.4)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-gold)]",
            )}
          >
            Explore the experience
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[oklch(97%_0.01_80)]"
        >
          {[
            { v: "4.9★", k: "281 Google reviews" },
            { v: "4×", k: "Larger since 2023" },
            { v: "Est. 2017", k: "Gahanna · Columbus" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none">{s.v}</dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[oklch(88%_0.02_80_/_0.72)]">
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
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(90%_0.04_70_/_0.4)] p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--glow-gold)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
