"use client";

/**
 * CausticsHero — hero section + the lazy WebGL boundary.
 *
 * The "Liquid-Gold Caustics" R3F scene is dynamically imported with ssr:false
 * (only legal inside a "use client" module — Next 16 gotcha). Until it mounts —
 * and on mobile / reduced-motion / no-WebGL / save-data — we render a static
 * CSS gold-caustics-on-emerald field so there is never a blank frame, zero CLS,
 * and full graceful degradation. The scene itself pauses its render loop when
 * scrolled offscreen or the tab is hidden (IntersectionObserver + visibility).
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const CausticsScene = dynamic(() => import("./CausticsScene"), {
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

export function CausticsHero() {
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
      id="top"
      aria-label="Sousan Med Spa — River Oaks, Houston · trusted since 1995"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static gold-caustics field — always painted (SSR + fallback) */}
      <div
        className="caustics-fallback absolute inset-0 -z-20"
        aria-hidden="true"
      />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <CausticsScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any caustic frame.
          Left wash anchors the copy column; vertical seats nav + base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(15%_0.04_166_/_0.93)] via-[oklch(16%_0.04_166_/_0.52)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(15%_0.04_166_/_0.72)] via-transparent to-[oklch(13%_0.038_166_/_0.88)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(64%_88%_at_26%_54%,oklch(13%_0.038_166_/_0.62),transparent_60%)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-40"
      >
        <motion.p
          variants={item}
          className="glass-dark mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.66rem] font-medium uppercase tracking-[0.3em] text-[oklch(94%_0.02_92)]"
        >
          <span aria-hidden className="text-[var(--gold)]">
            ✦
          </span>
          River Oaks · Houston · Est. 1995
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[17ch] text-balance text-[var(--color-bg)] drop-shadow-[0_2px_44px_oklch(10%_0.03_166_/_0.7)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.0 }}
        >
          Twenty-nine years.
          <span className="mt-1 block">
            One{" "}
            <span className="gold-leaf--bright gold-leaf-anim font-display-em">
              address
            </span>{" "}
            that matters.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[54ch] text-pretty font-light text-[oklch(91%_0.018_110_/_0.92)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
        >
          River Oaks has trusted one name since 1995. Sousan Med Spa —{" "}
          <span className="font-normal text-[var(--color-bg)]">
            HydraFacial&nbsp;MD, IPL, body contouring &amp; injectables
          </span>
          , delivered with the discretion an institution earns over three
          decades.
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
                "bg-[var(--gold)] font-semibold tracking-tight text-[oklch(28%_0.06_70)]",
                "shadow-[0_18px_50px_-16px_oklch(80%_0.12_86_/_0.5)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_24px_64px_-14px_oklch(82%_0.12_86_/_0.68)]",
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
              "glass-dark inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "font-medium text-[var(--color-bg)]",
              "transition-colors duration-300 hover:bg-[oklch(28%_0.05_166_/_0.6)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
            )}
          >
            Explore the menu
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[var(--color-bg)]"
        >
          {[
            { v: "29 yrs", k: "River Oaks since 1995" },
            { v: "Sousan", k: "Owner-led, one name" },
            { v: "5.0★", k: "River Oaks reputation" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none tnum">{s.v}</dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[oklch(86%_0.02_110_/_0.82)]">
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
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(82%_0.1_88_/_0.42)] p-1">
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
