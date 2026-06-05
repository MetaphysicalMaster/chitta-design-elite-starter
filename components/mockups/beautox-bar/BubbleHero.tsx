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

const ease = [0.22, 1, 0.36, 1] as const;

export function BubbleHero() {
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
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  return (
    <section
      id="top"
      aria-label="Beautox Bar — Botox bar & med spa across the Minneapolis–St. Paul metro"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static candy bubble field — always painted (SSR + fallback) */}
      <div className="bubble-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <BubbleScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any bubble frame. Left wash
          anchors the copy column; vertical seats nav + base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(20%_0.09_330_/_0.92)] via-[oklch(22%_0.09_330_/_0.5)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(20%_0.09_330_/_0.72)] via-transparent to-[oklch(18%_0.09_330_/_0.88)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(64%_88%_at_24%_52%,oklch(18%_0.09_330_/_0.6),transparent_60%)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-40"
      >
        <motion.p
          variants={item}
          className="glass-dark mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[oklch(95%_0.03_340)]"
        >
          <span aria-hidden className="text-[var(--candy-pink)]">
            ●
          </span>
          MPLS · St. Paul · Now 3 Bars
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[15ch] text-balance text-[var(--color-bg)] drop-shadow-[0_2px_44px_oklch(12%_0.06_330_/_0.7)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 0.98 }}
        >
          Three locations.{" "}
          <span className="candy-text--bright">One vibe</span> you actually like.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty text-[oklch(93%_0.025_330_/_0.92)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
        >
          The Twin Cities&apos; fun, nurse-founded{" "}
          <span className="font-semibold text-[var(--color-bg)]">Botox bar</span>{" "}
          — tox, filler &amp; glow without the boring. Maple Grove, Champlin, and
          now opening in White Bear Township.
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
                "shadow-[0_18px_50px_-16px_oklch(60%_0.24_352_/_0.6)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_24px_64px_-14px_oklch(64%_0.26_352_/_0.74)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--candy-pink)]",
              )}
            >
              Book your glow
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Magnetic>
          <Link
            href="#locations"
            className={cn(
              "glass-dark inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "font-semibold text-[var(--color-bg)]",
              "transition-colors duration-300 hover:bg-[oklch(30%_0.1_328_/_0.6)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--candy-pink)]",
            )}
          >
            Find your bar
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[var(--color-bg)]"
        >
          {[
            { v: "3", k: "Metro locations" },
            { v: "7+ yrs", k: "Nurse-founded" },
            { v: "5.0★", k: "Loved by regulars" },
            { v: "Woman-owned", k: "Liz + Nicole" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none tnum">{s.v}</dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[oklch(88%_0.03_330_/_0.82)]">
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
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(82%_0.16_330_/_0.45)] p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--candy-pink)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
