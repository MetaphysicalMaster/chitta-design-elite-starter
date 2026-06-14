"use client";

/**
 * RenewalHero — the hero. The signature self-drawing / leafing TREE (the brand
 * logo, alive) stands on a luminous white field, the copy column to the left.
 *
 * The TreeScene is the showpiece (pure SVG + GSAP, static-export safe). A static
 * CSS field gradient is always painted beneath it so there is never a blank
 * frame, no CLS, and reduced-motion / no-JS lands on the finished tree (the
 * scene ships fully-drawn from SSR). Visibility is gated by an
 * IntersectionObserver + tab visibility so the leaf-breeze rAF pauses offscreen.
 *
 * ENTRANCE — the copy column reveals via DETERMINISTIC CSS keyframes
 * (`.en-rise`, mirroring the-luxe's working hero), NOT Framer-Motion variants.
 * Framer's staggered `animate="show"` could stick the children at opacity:0 on
 * load (only flushing after an unrelated interaction) because the heavy
 * synchronous mount work (GSAP context + Lenis + the dynamic tree) starved the
 * orchestration. CSS keyframes fire on mount with no rAF/IO/focus dependency,
 * `forwards`-fill holds the end frame, and reduced-motion lands fully visible.
 */

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TreeScene } from "./TreeScene";
import { PRACTICE } from "./nap";

export function RenewalHero() {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  // Pause the scene's leaf-breeze when the hero scrolls offscreen / tab hidden.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setPaused(!e.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    const onVis = () => {
      if (document.visibilityState !== "visible") setPaused(true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Encore Dermatology — the science of dermatology, the environment of a spa"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static luminous field — always painted (SSR + fallback) */}
      <div className="field-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: the signature TREE — anchored to the right, the whole tree
          (trunk + leafy canopy) fitting within the viewport. Pure SVG, always
          present (ships drawn for SSR / no-JS). Pinned to a viewport-tall box so
          the canopy is never clipped above the fold. */}
      <div
        className="pointer-events-none absolute right-0 top-0 -z-10 h-[100svh] w-full md:w-[66%] lg:w-[60%]"
        aria-hidden="true"
      >
        <TreeScene paused={paused} />
      </div>

      {/* Legibility wash anchoring the copy column over the white field — keeps
          the left column crisp even where the canopy reaches across on mobile. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--color-bg)] via-[oklch(99%_0.004_200_/_0.7)] to-transparent md:via-[oklch(99%_0.004_200_/_0.35)]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-32 sm:px-8 md:pt-36">
        <p className="en-rise en-rise-1 glass mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--clinical-deep)]">
          <span aria-hidden className="text-[var(--leaf)]">❧</span>
          NW Columbus · OSU faculty-led · since 2010
        </p>

        <h1
          className="en-rise en-rise-2 font-display display-tight max-w-[16ch] text-balance text-[var(--color-fg)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.0 }}
        >
          The science of dermatology.{" "}
          <span className="display-em foil-sheen">The calm of a spa.</span>
        </h1>

        <p
          className="en-rise en-rise-3 mt-7 max-w-[50ch] text-pretty font-light text-[var(--color-fg-muted)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
        >
          Established medical &amp; surgical dermatology and{" "}
          <span className="font-medium text-[var(--clinical-deep)]">
            The Spa at Encore
          </span>{" "}
          — luxury aesthetics — under one roof in {PRACTICE.area}. Led by{" "}
          <span className="font-medium text-[var(--color-fg)]">
            Dr. Gwyn Londeree, MD
          </span>
          , Associate Professor of Dermatology at the Ohio State University
          College of Medicine.
        </p>

        <div className="en-rise en-rise-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "bg-[var(--color-accent)] font-semibold tracking-tight text-[var(--color-accent-fg)]",
              "shadow-[0_18px_44px_-16px_oklch(46%_0.09_200_/_0.6)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-14px_oklch(46%_0.09_200_/_0.75)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)]",
            )}
          >
            Book Appointment
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="#spa"
            className={cn(
              "glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "font-medium text-[var(--clinical-deep)]",
              "transition-colors duration-300 hover:bg-[var(--glass-bg-strong)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clinical)]",
            )}
          >
            <span aria-hidden className="text-[var(--spa-deep)]">✦</span>
            Discover The Spa at Encore
          </Link>
        </div>

        <dl className="en-rise en-rise-5 mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[var(--color-fg)]">
          {[
            { v: "4.8★", k: "Patient-rated" },
            { v: "OSU", k: "Associate Professor" },
            { v: "Est. 2010", k: "Columbus, Ohio" },
            { v: "Board-certified", k: "Dermatology" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none text-[var(--clinical-deep)]">
                {s.v}
              </dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                {s.k}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll cue — CSS-driven fade-in (no Framer mount-orchestration, so it
          can never stick hidden), with the looping dot bounce. */}
      <div
        aria-hidden="true"
        className="en-cue pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--color-border)] p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--clinical)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}
