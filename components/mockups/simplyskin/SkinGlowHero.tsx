"use client";

/**
 * SkinGlowHero — hero section + the lazy WebGL boundary.
 *
 * The caustic skin-glow R3F scene is dynamically imported with ssr:false (only
 * legal inside a client component — Next 16). Until it mounts (and on mobile /
 * reduced-motion / no-WebGL), we render a static CSS caustic light-sweep
 * gradient so there is never a blank frame, no CLS, and full graceful
 * degradation. The hero is LIGHT (quiet-luxury) so copy is dark ink — distinct
 * from the dark, saturated sibling heroes.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const SkinGlowScene = dynamic(() => import("./SkinGlowScene"), {
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
      // Use the heavier transmission/Bloom tier only on large viewports.
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

export function SkinGlowHero() {
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
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="SimplySkin MedSpa — Top 1% in the country, effortless by design"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static caustic glow — always painted (SSR + fallback, zero CLS) */}
      <div className="glow-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <SkinGlowScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep dark copy WCAG-AA over any glow frame.
          The hero is light, so we LIGHTEN behind the copy (left/top). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(99%_0.006_80_/_0.86)] via-[oklch(99%_0.006_80_/_0.45)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(99%_0.006_80_/_0.5)] via-transparent to-[oklch(97%_0.012_64_/_0.55)]"
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
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-muted)] backdrop-blur-md"
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          Fishers &amp; Carmel, Indiana · Now expanding to Carmel
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[16ch] text-balance text-[var(--color-fg)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.04 }}
        >
          Top 1% in the country.
          <br />
          <span className="font-display-em foil-sheen">Effortless</span> by design.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[var(--color-fg-muted)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.62 }}
        >
          Led by{" "}
          <span className="font-medium text-[var(--color-fg)]">Holly Sheldon-Paquin</span>
          {" "}— a{" "}
          <span className="font-medium text-[var(--color-fg)]">Top 1% US Allergan</span>{" "}
          injector with twenty years of artistry. Natural, restrained results
          from an injectables-led menu — now at two Indianapolis-metro
          locations. Simple by design, elite by results.
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
              "shadow-[0_18px_50px_-18px_oklch(48%_0.072_196_/_0.6)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_oklch(48%_0.072_196_/_0.8)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            Book in 30 seconds
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#authority"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-[var(--color-border)] bg-white/65 font-medium text-[var(--color-fg)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-white/85",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            Meet Holly
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 sm:gap-x-14"
        >
          {[
            { v: "Top 1%", k: "US Allergan injector" },
            { v: "20 yrs", k: "Of injectable artistry" },
            { v: "Two", k: "Locations · Fishers + Carmel" },
            { v: "Top 10", k: "In Indiana" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-[1.7rem] leading-none tnum text-[var(--color-fg)]">
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
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--color-border)] bg-white/40 p-1 backdrop-blur-sm">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--color-accent)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
