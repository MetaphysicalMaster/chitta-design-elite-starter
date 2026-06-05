"use client";

/**
 * HorologyHero — hero section + the lazy WebGL boundary.
 *
 * The brass-orrery R3F scene is dynamically imported with ssr:false (only legal
 * inside a client component — Next 16). Until it mounts (and on mobile /
 * reduced-motion / no-WebGL), we render a static CSS brass-aura + concentric
 * rings field so there is never a blank frame, no CLS, and full graceful
 * degradation. The hero is DARK (candlelit aubergine) so copy is warm ivory —
 * heirloom-luxury, distinct from the light SimplySkin sibling hero.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const HorologyScene = dynamic(() => import("./HorologyScene"), {
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
      // Use the heavier Bloom + ring tessellation only on large viewports.
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

export function HorologyHero() {
  const prefersReduced = useReducedMotion();
  const { enabled, lite } = useEnableWebGL();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
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
      aria-label="Timeless Aesthetics MedSpa — ten years ahead of timeless"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static brass-aura + concentric rings — always painted
          (SSR + fallback, zero CLS). */}
      <div className="horology-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <HorologyScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep warm-ivory copy WCAG-AA over any frame.
          The hero is dark, so we DARKEN behind the copy (left/bottom). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(18%_0.05_338_/_0.9)] via-[oklch(18%_0.05_338_/_0.5)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[oklch(16%_0.05_338_/_0.85)] via-transparent to-[oklch(16%_0.05_338_/_0.35)]"
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
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--brass)]/35 bg-[oklch(20%_0.05_338_/_0.5)] px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-[var(--brass-pale)] backdrop-blur-md"
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-bright)]" />
          Cincinnati, Ohio · Physician-led since 2014
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[15ch] text-balance text-[var(--color-bg)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.02 }}
        >
          Ten years ahead of{" "}
          <span className="font-display-em foil-sheen">timeless.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[var(--color-bg)]/80"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.62 }}
        >
          A physician-led aesthetics institution in Cincinnati — directed by{" "}
          <span className="font-medium text-[var(--color-bg)]">Dr. Timothy McCarren</span>{" "}
          &amp;{" "}
          <span className="font-medium text-[var(--color-bg)]">Dr. Sonja Heuker</span>.
          Injectables, Secret RF &amp; laser, and medical skin, held to one
          standard for over a decade. Trusted for a decade, ahead for the next.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-medium tracking-tight",
              "shadow-[0_18px_50px_-18px_oklch(58%_0.094_76_/_0.7)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_oklch(58%_0.094_76_/_0.9)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            Book in 30 seconds
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#physicians"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-[var(--brass)]/40 bg-[oklch(22%_0.05_338_/_0.4)] font-medium text-[var(--color-bg)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-[oklch(26%_0.06_340_/_0.55)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            Meet the physicians
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 sm:gap-x-14"
        >
          {[
            { v: "4.9★", k: "Across hundreds of reviews" },
            { v: "10+ yrs", k: "One uncompromising standard" },
            { v: "Two", k: "Physicians · McCarren + Heuker" },
            { v: "Westbourne", k: "3260 Westbourne Dr · 45248" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-[1.85rem] leading-none tnum text-[var(--color-bg)]">
                {s.v}
              </dt>
              <dd className="mt-2 max-w-[18ch] text-xs uppercase tracking-[0.14em] text-[var(--brass-pale)]/80">
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
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--brass)]/40 bg-[oklch(22%_0.05_338_/_0.35)] p-1 backdrop-blur-sm">
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
