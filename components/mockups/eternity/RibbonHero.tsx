"use client";

/**
 * RibbonHero — hero section + the lazy WebGL boundary.
 *
 * The Möbius eternity-ribbon R3F scene is dynamically imported with ssr:false
 * (only legal inside a "use client" module — Next 16 gotcha) and only MOUNTED
 * once the hero is on-screen (IntersectionObserver), pausing GPU work when
 * scrolled away or the tab is hidden. The flow also EASES toward stillness as
 * the hero scrolls out of view (a scroll-ease value fed to the scene). Until it
 * mounts — and on mobile / reduced-motion / no-WebGL / save-data — we render the
 * static on-brand chrome infinity-loop SVG over a CSS field, so there is never a
 * blank frame, zero CLS, and full graceful degradation.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";
import { RibbonFallback } from "./RibbonFallback";
import { BRAND } from "./nap";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const RibbonScene = dynamic(() => import("./RibbonScene"), {
  ssr: false,
  loading: () => null,
});

/** Gate: only enable the heavy WebGL scene on capable, willing devices. */
function useEnableWebGL() {
  const prefersReduced = useReducedMotion();
  const [capable, setCapable] = useState(false);
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
      setCapable(mq.matches && hasWebGL && !saveData);
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

  return { capable, lite };
}

/** Mount the scene only while the hero is intersecting AND the tab is visible. */
function useActiveWhenVisible(ref: React.RefObject<HTMLElement | null>) {
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function RibbonHero() {
  const prefersReduced = useReducedMotion();
  const { capable, lite } = useEnableWebGL();
  const sectionRef = useRef<HTMLElement>(null);
  const active = useActiveWhenVisible(sectionRef);
  const showScene = capable && active;

  // Scroll-ease: 1 while the hero fills the viewport, easing toward ~0.15 as it
  // scrolls away — the ribbon flow calms instead of stopping abruptly. Passed by
  // ref so the Canvas tree never re-renders on scroll.
  const flowRef = useRef(1);
  useEffect(() => {
    if (prefersReduced) return;
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const p = 1 - Math.min(1, Math.max(0, -rect.top / vh));
        flowRef.current = 0.15 + 0.85 * p;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [prefersReduced]);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.08,
        delayChildren: 0.12,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label={`${BRAND.name} — enduring St. Louis med spa in Creve Coeur, ${BRAND.years} years`}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static chrome infinity-loop field — always painted (SSR + fallback) */}
      <div className="ribbon-fallback absolute inset-0 -z-20" aria-hidden="true">
        <RibbonFallback />
      </div>

      {/* Layer 1: WebGL power element (capable, motion-ok, on-screen, visible) */}
      {showScene && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <RibbonScene lite={lite} flowRef={flowRef} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any ribbon frame.
          Left wash anchors the copy column; vertical seats nav + base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(13%_0.024_300_/_0.94)] via-[oklch(15%_0.026_300_/_0.6)] to-[oklch(16%_0.028_300_/_0.2)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(13%_0.024_300_/_0.78)] via-transparent to-[oklch(13%_0.024_300_/_0.86)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_92%_at_26%_56%,oklch(13%_0.024_300_/_0.5),transparent_62%)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-40"
      >
        <motion.p
          variants={item}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-border-dark)] bg-[var(--glass-bg-dark)] px-4 py-1.5 text-[0.66rem] font-medium uppercase tracking-[0.28em] text-[oklch(94%_0.01_300)] backdrop-blur-md"
        >
          <span aria-hidden className="text-[var(--color-accent-bright)]">
            ∞
          </span>
          Creve Coeur · St. Louis · {BRAND.years} years on Olive Blvd
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[20ch] text-balance font-medium text-[oklch(98%_0.006_300)] drop-shadow-[0_2px_34px_oklch(8%_0.02_300_/_0.7)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.03 }}
        >
          Eighteen years. Two hundred-plus reasons.{" "}
          <span className="font-display-em silver-text silver-text--sheen">
            One St. Louis name.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[oklch(88%_0.012_300_/_0.94)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.62 }}
        >
          Injectables, skin and body on the Olive Blvd corridor — led by{" "}
          <span className="font-medium text-[oklch(99%_0.006_300)]">
            {BRAND.owner}
          </span>{" "}
          for {BRAND.years} years. Results that last, and — at last — booking that
          fits your life. Reserve online in seconds, no phone tag.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Magnetic>
            <Link
              href="#book"
              className={cn(
                "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5",
                "silver-pill font-semibold tracking-tight text-[var(--color-accent-fg)]",
                "shadow-[0_18px_48px_-18px_oklch(72%_0.04_300_/_0.55)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_24px_62px_-14px_oklch(74%_0.05_300_/_0.65)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
              )}
            >
              Book online in 30 seconds
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
              "border border-[var(--glass-border-dark)] bg-[var(--glass-bg-dark)] font-medium text-[oklch(95%_0.01_300)] backdrop-blur-md",
              "transition-colors duration-300 hover:border-[var(--color-accent-bright)] hover:text-[var(--color-accent-bright)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]",
            )}
          >
            Explore the menu
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[oklch(96%_0.008_300)]"
        >
          {[
            { v: `${BRAND.years} yrs`, k: "Caring for St. Louis" },
            { v: `${BRAND.reviews}`, k: "Patient reviews" },
            { v: `${BRAND.rating}★`, k: "Average rating" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl font-semibold leading-none tnum">
                {s.v}
              </dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[oklch(82%_0.012_300_/_0.78)]">
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
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(80%_0.02_300_/_0.4)] p-1">
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
