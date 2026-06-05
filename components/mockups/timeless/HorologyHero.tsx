"use client";

/**
 * HorologyHero — hero section + the lazy WebGL boundary.
 *
 * The orange-bokeh R3F scene is dynamically imported with ssr:false (only legal
 * inside a client component — Next 16). Until it mounts (and on mobile /
 * reduced-motion / no-WebGL), we render a static CSS bokeh field (warm
 * orange→peach gradient + soft out-of-focus light dots) so there is never a
 * blank frame, no CLS, and full graceful degradation. The hero is LIGHT (sunlit
 * peach/cream — the live brand) so copy is warm charcoal — friendly and
 * optimistic, true to cincymedspa.com.
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

  // The hero copy must NEVER flash empty during the WebGL-compile / hydration
  // gap (the most-seen screen). So the entrance is a gentle SETTLE, not a
  // from-nothing build: the copy starts at FULL opacity and only rises a few px,
  // and under reduced-motion it is fully static. Even if the stagger only runs
  // post-hydration, the worst case is text that's already legible easing up a
  // hair — never an invisible headline.
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReduced ? 0 : 0.06, delayChildren: 0.04 },
    },
  };
  const item = {
    hidden: { opacity: 1, y: prefersReduced ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Timeless Aesthetics MedSpa — rejuvenate, renew, refresh"
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

      {/* Legibility scrims — keep warm-CHARCOAL copy WCAG-AA over any frame.
          The hero is LIGHT, so we LIGHTEN behind the copy (left/bottom) with a
          warm cream veil rather than darkening. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(98%_0.014_64_/_0.92)] via-[oklch(97%_0.02_60_/_0.5)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[oklch(98%_0.012_64_/_0.85)] via-transparent to-[oklch(98%_0.012_64_/_0.18)]"
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
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--brass)]/40 bg-[oklch(100%_0_0_/_0.7)] px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-deep)] shadow-[0_8px_24px_-16px_oklch(60%_0.14_52_/_0.6)] backdrop-blur-md"
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          Cincinnati, Ohio · Physician-run medspa
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[16ch] text-balance text-[var(--color-fg)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.04 }}
        >
          Rejuvenate. Renew.{" "}
          <span className="font-display-em foil-sheen">Refresh.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[var(--color-fg-muted)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.62 }}
        >
          Look in the mirror and see{" "}
          <span className="font-medium text-[var(--color-fg)]">you on your best day</span>{" "}
          — rested, refreshed, never &ldquo;done.&rdquo; Every treatment is placed
          in person by two physicians,{" "}
          <span className="font-medium text-[var(--color-fg)]">Dr. Sonja Heuker, MD</span>{" "}
          &amp;{" "}
          <span className="font-medium text-[var(--color-fg)]">Dr. Timothy McCarren, MD</span>,
          so the result always looks like you. Tox, filler, laser, Secret RF and
          medical skin care.
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
              "shadow-[0_18px_50px_-18px_oklch(60%_0.15_52_/_0.65)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_oklch(60%_0.15_52_/_0.85)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            Start with a conversation
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#physicians"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-[var(--color-border)] bg-[oklch(100%_0_0_/_0.75)] font-medium text-[var(--color-fg)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-[oklch(100%_0_0_/_0.95)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            Meet the physicians
          </Link>
        </motion.div>

        {/* Hero proof — given real structure: a faint glass strip with hairline
            dividers so the four signals read as one credibility unit at first
            impression, led by a quiet one-line label. */}
        <motion.div variants={item} className="mt-14">
          <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-deep)]">
            Why Cincinnati trusts us
          </p>
          <dl className="inline-flex flex-wrap items-stretch gap-y-4 rounded-2xl border border-[var(--color-border)] bg-[oklch(100%_0_0_/_0.55)] px-6 py-5 shadow-[var(--glass-shadow)] backdrop-blur-md">
            {[
              { v: "4.9★", k: "Across hundreds of reviews" },
              { v: "10+ yrs", k: "Caring for Cincinnati" },
              { v: "Two MDs", k: "Heuker + McCarren" },
              { v: "Westbourne", k: "3260 Westbourne Dr · 45248" },
            ].map((s, i) => (
              <div
                key={s.k}
                className={cn(
                  "flex flex-col px-5 first:pl-0 last:pr-0",
                  i > 0 && "border-l border-[var(--color-border)]",
                )}
              >
                <dt className="font-display text-[2rem] font-normal leading-none tnum text-[var(--color-fg)]">
                  {s.v}
                </dt>
                <dd className="mt-2 max-w-[16ch] text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--color-accent-deep)]">
                  {s.k}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.9 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--brass)]/45 bg-[oklch(100%_0_0_/_0.6)] p-1 backdrop-blur-sm">
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
