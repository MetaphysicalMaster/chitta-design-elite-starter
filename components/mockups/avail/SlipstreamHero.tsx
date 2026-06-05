"use client";

/**
 * SlipstreamHero — hero section + the lazy WebGL boundary.
 *
 * The "Slipstream" R3F scene is dynamically imported with ssr:false (only legal
 * inside a client component — Next 16). Until it mounts (and on mobile /
 * reduced-motion / no-WebGL), we render a static CSS slipstream gradient so
 * there is never a blank frame, no CLS, and full graceful degradation.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const SlipstreamScene = dynamic(() => import("./SlipstreamScene"), {
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
      // Run the full 220-streak field only on large viewports.
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

export function SlipstreamHero() {
  const prefersReduced = useReducedMotion();
  const { enabled, lite } = useEnableWebGL();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : -60]);
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [1, 1, prefersReduced ? 1 : 0],
  );

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReduced ? 0 : 0.085, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Avail Aesthetics — four locations, one standard"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static slipstream — always painted (SSR + fallback, zero CLS) */}
      <div className="slipstream-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <SlipstreamScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any slipstream frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(16%_0.02_262_/_0.9)] via-[oklch(18%_0.02_262_/_0.5)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(16%_0.02_262_/_0.72)] via-transparent to-[oklch(15%_0.02_262_/_0.78)]"
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
          className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md"
        >
          <span aria-hidden className="text-[var(--color-accent-bright)]">◆</span>
          4 NC locations · One standard of care
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[15ch] text-balance text-white drop-shadow-[0_2px_28px_oklch(14%_0.02_262_/_0.6)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.0, fontWeight: 600 }}
        >
          Four locations.
          <br />
          One standard.
          <br />
          <span className="foil-sheen">Built to scale.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-white/85"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
        >
          North Carolina&rsquo;s growth-built medical aesthetics brand — one
          consistent, premium standard across{" "}
          <span className="font-medium text-white">Cary, Raleigh, Wake Forest</span>{" "}
          and <span className="font-medium text-white">Asheville</span>. Led by
          CEO <span className="font-medium text-white">Stephen Rhodes</span> and{" "}
          <span className="font-medium text-white">Dr. Nathan Davis</span>.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "bg-white text-[var(--color-fg)] font-semibold tracking-tight",
              "shadow-[0_18px_50px_-16px_oklch(60%_0.18_264_/_0.6)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-14px_oklch(60%_0.18_264_/_0.8)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            )}
          >
            Book in 30 seconds
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#locations"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-white/45 bg-white/10 font-medium text-white backdrop-blur-md",
              "transition-colors duration-300 hover:bg-white/20",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            )}
          >
            Find your location
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-12 flex flex-wrap gap-x-9 gap-y-4 text-white/90 sm:gap-x-12"
        >
          {[
            { v: "4", k: "Locations · one brand" },
            { v: "4.9★", k: "Across-location rating" },
            { v: "30 sec", k: "To book online" },
            { v: "100+", k: "Treatments offered" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none tnum">{s.v}</dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.14em] text-white/65">
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
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/45 p-1">
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
