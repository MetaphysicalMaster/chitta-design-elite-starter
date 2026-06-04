"use client";

/**
 * LiquidGoldHero — hero section + the lazy WebGL boundary.
 *
 * The "Liquid Gold" R3F scene is dynamically imported with ssr:false (only
 * legal inside a "use client" module — Next 16 gotcha). Until it mounts — and
 * on mobile / reduced-motion / no-WebGL / save-data — we render a static CSS
 * liquid-gold gradient so there is never a blank frame, zero CLS, and full
 * graceful degradation.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const LiquidGoldScene = dynamic(() => import("./LiquidGoldScene"), {
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

export function LiquidGoldHero() {
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
      aria-label="The Luxe MedSpa — physician-led luxury aesthetics in Upper Arlington, Columbus"
      className="grain relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static liquid-gold field — always painted (SSR + fallback, no CLS) */}
      <div
        className="liquid-gold-fallback absolute inset-0 -z-20"
        aria-hidden="true"
      />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <LiquidGoldScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any molten frame.
          Left wash anchors the copy column; vertical seats nav + base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(13%_0.024_168_/_0.92)] via-[oklch(14%_0.024_168_/_0.5)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(13%_0.024_168_/_0.7)] via-transparent to-[oklch(12%_0.022_168_/_0.85)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(66%_90%_at_24%_56%,oklch(12%_0.022_168_/_0.6),transparent_60%)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-40"
      >
        <motion.p
          variants={item}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-1.5 text-[0.66rem] font-medium uppercase tracking-[0.3em] text-[var(--color-fg)] backdrop-blur-md"
        >
          <span aria-hidden className="text-[var(--gold)]">
            ✦
          </span>
          Physician-Led · Upper Arlington · Est. 2023
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[16ch] text-balance text-[var(--color-fg)] drop-shadow-[0_2px_40px_oklch(10%_0.02_168_/_0.7)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 0.98 }}
        >
          Luxury, made
          <span className="gold-leaf gold-leaf-anim italic"> literal.</span>
          <span className="mt-2 block font-display text-[0.42em] not-italic tracking-[0.01em] text-[var(--color-fg-muted)]">
            Aesthetics &amp; bodycare, perfected.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[oklch(90%_0.02_95_/_0.92)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
        >
          Upper Arlington&rsquo;s opulent destination for injectables, Morpheus8,
          laser &amp; medical wellness — directed by{" "}
          <span className="font-normal text-[var(--color-fg)]">
            Dr. Carlos Sanchez, MD
          </span>
          . Premium clinical results, delivered with white-glove polish.
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
                "bg-[var(--color-accent)] font-semibold tracking-tight text-[var(--color-accent-fg)]",
                "shadow-[0_18px_50px_-16px_oklch(80%_0.13_86_/_0.5)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_24px_64px_-14px_oklch(80%_0.13_86_/_0.66)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
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
            href="#services"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-[var(--glass-border)] bg-[var(--glass-bg)] font-medium text-[var(--color-fg)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-[var(--glass-bg-strong)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
            )}
          >
            Explore treatments
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[var(--color-fg)]"
        >
          {[
            { v: "4.9★", k: "≈122 Google reviews" },
            { v: "MD-Led", k: "Board-certified director" },
            { v: "Est. 2023", k: "Upper Arlington · Columbus" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none">{s.v}</dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
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
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(82%_0.1_88_/_0.4)] p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--gold)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
