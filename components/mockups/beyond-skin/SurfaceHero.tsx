"use client";

/**
 * SurfaceHero — hero section + the lazy WebGL boundary for the signature
 * "Journey to Wellness" silk light-field.
 *
 * The R3F silk scene is dynamically imported with ssr:false (only legal inside
 * a "use client" module — Next 16 gotcha). Until it mounts — and on mobile /
 * reduced-motion / no-WebGL / save-data — we render a static CSS silk gradient
 * field so there is never a blank frame, zero CLS, and full graceful degradation.
 *
 * Copy is faithful to the REAL brand: "The Joy of Beauty & Wellness" /
 * "Unveil your inner beauty, as you discover joyful wellness."
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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

export function SurfaceHero() {
  const prefersReduced = useReducedMotion();
  const { enabled, lite } = useEnableWebGL();
  const sectionRef = useRef<HTMLElement>(null);

  /* Trigger the hero entrance ONLY when the document is actually visible.
     The copy is visible by default (CSS resting state), so this purely adds the
     staggered rise; it never gates legibility. If the page first loads in a
     background tab, we defer the animation to the moment it becomes visible so
     the reveal plays for the user instead of silently completing off-screen —
     and the copy was never hidden in the meantime. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let safety = 0;
    const reveal = () => {
      el.setAttribute("data-hero", "reveal");
      // Safety net: if the tab is backgrounded mid-reveal, CSS animations are
      // throttled and `backwards` fill could otherwise pin a child at opacity 0.
      // Once the animation window has comfortably elapsed, drop the attribute so
      // every child falls back to its fully visible resting state — guaranteeing
      // the hero is never stuck invisible under any tab-visibility race.
      safety = window.setTimeout(() => el.removeAttribute("data-hero"), 2600);
    };
    if (document.visibilityState === "visible") {
      reveal();
      return () => window.clearTimeout(safety);
    }
    const onVis = () => {
      if (document.visibilityState === "visible") {
        reveal();
        document.removeEventListener("visibilitychange", onVis);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearTimeout(safety);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Beyond Skin Aesthetics — the joy of beauty and wellness in Gahanna, Columbus"
      className="grain relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static silk field — always painted (SSR + fallback, no CLS) */}
      <div className="surface-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL silk light-field (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <SurfaceScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any silk frame.
          Left wash anchors the copy column; vertical seats nav + base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(24%_0.06_340_/_0.9)] via-[oklch(26%_0.06_342_/_0.45)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(24%_0.06_340_/_0.72)] via-transparent to-[oklch(22%_0.05_340_/_0.82)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(68%_90%_at_24%_58%,oklch(22%_0.05_340_/_0.55),transparent_60%)]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-40">
        <p className="bs-rise bs-rise-1 mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-dark-border)] bg-[var(--glass-dark)] px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[oklch(96%_0.02_350)] backdrop-blur-md">
          <span aria-hidden className="text-[var(--glow-blush)]">
            ✦
          </span>
          The Joy of Beauty &amp; Wellness · Gahanna, OH
        </p>

        <h1
          className="bs-rise bs-rise-2 font-display max-w-[18ch] text-balance font-light text-[oklch(98%_0.01_350)] drop-shadow-[0_2px_36px_oklch(18%_0.05_340_/_0.7)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.0 }}
        >
          Unveil your inner beauty, as you discover
          <span className="font-em text-molten text-molten-anim"> joyful wellness.</span>
        </h1>

        <p
          className="bs-rise bs-rise-3 mt-7 max-w-[52ch] text-pretty font-light text-[oklch(95%_0.012_350_/_0.92)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
        >
          A warm, judgment-free home for aesthetics &amp; wellness in Columbus —
          where your journey to your best self is met with expertise, comfort and
          genuine care. This is the experience the brand was built to match.
        </p>

        <div className="bs-rise bs-rise-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Magnetic>
            <Link
              href="#book"
              className={cn(
                "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
                "bg-[oklch(98%_0.008_350)] font-semibold tracking-tight text-[var(--plum-deep)]",
                "shadow-[0_18px_50px_-16px_oklch(66%_0.1_350_/_0.6)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_24px_64px_-14px_oklch(66%_0.1_350_/_0.75)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-blush)]",
              )}
            >
              Begin your journey
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
              "border border-[var(--glass-dark-border)] bg-[var(--glass-dark)] font-medium text-[oklch(97%_0.01_350)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-[oklch(40%_0.06_345_/_0.4)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-blush)]",
            )}
          >
            Explore the experience
          </Link>
        </div>

        <dl className="bs-rise bs-rise-5 mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[oklch(97%_0.01_350)]">
          {[
            { v: "4.9★", k: "Google reviews" },
            { v: "Judgment-free", k: "Every visit" },
            { v: "Est. 2017", k: "Gahanna · Columbus" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl font-medium leading-none">
                {s.v}
              </dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[oklch(90%_0.02_350_/_0.72)]">
                {s.k}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll cue — the journey begins. Entrance via the same pure-CSS rise
          (delayed last) so it never depends on the in-view observer either. */}
      <div
        aria-hidden="true"
        className="bs-rise bs-rise-6 pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(90%_0.05_350_/_0.4)] p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--glow-blush)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}
