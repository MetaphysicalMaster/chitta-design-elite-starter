"use client";

/**
 * LuxeHero — the editorial-luxe hero + the lazy "Turn Back Time" signature
 * boundary.
 *
 * Direction: warm marble + soft peach light, the GOLD SCRIPT "The Luxe" wordmark
 * as the jewel, with a slow gold-dust drift + a reverse-time light sweep + a
 * counter-clockwise horologe drawn on a Canvas-2D layer (TurnBackTimeScene).
 *
 * The scene is dynamically imported with ssr:false (only legal inside a
 * "use client" module — Next 16 gotcha). Until it mounts — and on
 * reduced-motion / save-data / tiny screens — we render the static CSS
 * `.luxe-marble-fallback` so there is never a blank frame and zero CLS.
 *
 * Scroll sync: we drive a `progressRef` (0..1 across the hero height) on a rAF
 * loop and hand it to the scene, so the gold drift + reverse sweep settle as the
 * hero scrolls out — synced to the same scroll Lenis smooths upstream.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const TurnBackTimeScene = dynamic(() => import("./TurnBackTimeScene"), {
  ssr: false,
  loading: () => null,
});

/** Gate: only enable the animated scene on capable, willing devices. */
function useEnableScene() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    const mq = window.matchMedia("(min-width: 640px)");
    const mqLite = window.matchMedia("(max-width: 1100px)");
    const saveData =
      // @ts-expect-error — connection is non-standard but widely supported
      navigator.connection?.saveData === true;
    const cores =
      typeof navigator.hardwareConcurrency === "number"
        ? navigator.hardwareConcurrency
        : 8;

    const update = () => {
      setEnabled(mq.matches && !saveData);
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

export function LuxeHero() {
  const prefersReduced = useReducedMotion();
  const { enabled, lite } = useEnableScene();
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  // Drive hero scroll progress (0..1) on rAF for the scene to read.
  useEffect(() => {
    if (prefersReduced) return;
    let raf = 0;
    const loop = () => {
      const el = sectionRef.current;
      if (el) {
        const vh = window.innerHeight || 1;
        const top = el.getBoundingClientRect().top;
        // 0 at hero top in view → 1 once scrolled a full viewport up
        progressRef.current = Math.min(1, Math.max(0, -top / vh));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      aria-label="The Luxe MedSpa — turn back time. Top-rated medical spa in Upper Arlington, Columbus."
      className="grain relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static warm-marble field — always painted (SSR + fallback, no CLS) */}
      <div className="luxe-marble-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: the "Turn Back Time" gold signature (capable devices only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <TurnBackTimeScene lite={lite} progressRef={progressRef} />
        </div>
      )}

      {/* Legibility wash — keep copy AA over the warm marble + drifting gold.
          A soft cream veil from the left where the copy column sits. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(97%_0.012_78_/_0.86)] via-[oklch(97%_0.012_78_/_0.42)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(97%_0.012_78_/_0.55)] via-transparent to-[oklch(95%_0.016_74_/_0.7)]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:px-8 md:pt-40">
        <p className="luxe-rise luxe-rise-1 eyebrow mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-1.5 text-[0.62rem] text-[var(--color-fg-muted)] backdrop-blur-md">
          <span aria-hidden className="text-[var(--gold-deep)]">
            ✦
          </span>
          Physician-Led · Upper Arlington · Columbus
        </p>

        {/* The gold SCRIPT wordmark as the jewel, with the brand promise. */}
        <h1 className="luxe-rise luxe-rise-2 text-balance text-[var(--color-fg)]">
          <span className="sr-only">The Luxe MedSpa — Turn Back Time.</span>
          <span
            aria-hidden
            className="font-script gold-leaf gold-leaf-anim block whitespace-nowrap leading-[0.95] text-[2.9rem] sm:text-[4.4rem] lg:text-[6rem] xl:text-[6.75rem]"
          >
            Turn Back Time
          </span>
          <span
            aria-hidden
            className="font-display mt-3 block not-italic tracking-[0.02em] text-[var(--color-fg-muted)]"
            style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
          >
            Live beautifully. Feel empowered.
          </span>
        </h1>

        <p
          className="luxe-rise luxe-rise-3 mt-7 max-w-[52ch] text-pretty font-light text-[var(--color-fg-muted)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
        >
          A top-rated medical spa in Upper Arlington, proudly serving Columbus,
          Ohio. The Luxe MedSpa blends advanced aesthetic treatments with
          thoughtful, individualized care — so you look and feel your best.
        </p>

        <div className="luxe-rise luxe-rise-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Magnetic>
            <Link
              href="#book"
              className={cn(
                "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
                "bg-[var(--color-accent)] font-semibold tracking-tight text-[var(--color-accent-fg)]",
                "shadow-[0_16px_44px_-16px_oklch(70%_0.12_78_/_0.6)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-14px_oklch(70%_0.12_78_/_0.72)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
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
              "border border-[var(--color-border)] bg-[var(--glass-bg)] font-medium text-[var(--color-fg)] backdrop-blur-md",
              "transition-colors duration-300 hover:border-[var(--gold)] hover:bg-[var(--glass-bg-strong)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
            )}
          >
            Explore treatments
          </Link>
        </div>

        <dl className="luxe-rise luxe-rise-5 mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[var(--color-fg)]">
          {[
            { v: "4.9★", k: "≈122 Google reviews" },
            { v: "Physician-Led", k: "Individualized, science-backed care" },
            { v: "Upper Arlington", k: "3025 Northwest Blvd · Columbus" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none">{s.v}</dt>
              <dd className="mt-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                {s.k}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="luxe-rise pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
        style={{ animationDelay: "1.1s" }}
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--gold)] p-1">
          <motion.span
            className="block h-2 w-1 rounded-full bg-[var(--gold-deep)]"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}
