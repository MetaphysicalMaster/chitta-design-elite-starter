"use client";

/**
 * AuroraHero — hero section + the lazy WebGL boundary.
 *
 * The volumetric Colorado-night-sky R3F scene is dynamically imported with
 * ssr:false (only legal inside a client component — Next 16). Until it mounts
 * (and on mobile / reduced-motion / no-WebGL) we render a static CSS aurora
 * gradient so there is never a blank frame, no CLS, full graceful degradation.
 *
 * Brand voice: the live site's signature italic-serif tagline "Subtle is The
 * New WOW" over a navy night sky, led by Dr. Phil Hong Nguyen, MD. Pale-yellow
 * primary CTA (dark text) — the practice's true button color.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const AuroraScene = dynamic(() => import("./AuroraScene"), {
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
      // Run the full mote field only on large viewports.
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

export function AuroraHero() {
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
      aria-label="Happy Clinic Denver — Subtle is The New WOW, with Dr. Phil Hong Nguyen, MD"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static aurora — always painted (SSR + fallback, zero CLS) */}
      <div className="aurora-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 0b: a MOBILE-ONLY second drifting aurora ribbon. WebGL is gated to
          >=768px, so phones (where med-spa traffic actually is) only ever get the
          CSS fallback — this keeps the showpiece feeling alive there. A single
          GPU-cheap transform/opacity sweep at a different angle + slower cadence
          than the base ::before ribbon. Hidden on md+ (the R3F scene takes over)
          and fully reduced-motion gated in brand.css. */}
      <div className="aurora-fallback__drift absolute inset-0 -z-20 md:hidden" aria-hidden="true" />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <AuroraScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any aurora frame while
          letting MORE of the signature aurora bloom read through. The left wash
          is lifted to a luminous navy twilight (not near-black) and fades faster
          to transparent past the copy column; the headline carries its own
          drop-shadow, and body copy is white/85 — both clear AA against the
          brightest shader frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(22%_0.06_252_/_0.74)] via-[oklch(24%_0.06_252_/_0.34)] via-45% to-[oklch(20%_0.055_252_/_0.5)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(20%_0.055_252_/_0.5)] via-[oklch(24%_0.055_252_/_0.08)] to-[oklch(15%_0.05_252_/_0.7)]"
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
          <span aria-hidden className="text-white/70">✦</span>
          Denver, CO · 25 years of cosmetic-injection mastery
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[15ch] text-balance text-white drop-shadow-[0_2px_30px_oklch(12%_0.04_252_/_0.72)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.04, fontWeight: 600 }}
        >
          Subtle is{" "}
          <span className="font-display-em foil-sheen">The New WOW.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[54ch] text-pretty font-light text-white/85"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
        >
          Refined, natural-looking results from{" "}
          <span className="font-medium text-white">Dr. Phil Hong Nguyen, MD</span> —
          with{" "}
          <span className="font-medium text-white">25 years of cosmetic-injection
          experience</span> and honest,{" "}
          <span className="font-medium text-white">$9-per-unit Botox</span>.
          Subtle by design. Right here in Denver.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "bg-[var(--color-gold)] text-[var(--color-fg)] font-bold tracking-tight",
              "shadow-[0_18px_50px_-16px_oklch(86%_0.15_96_/_0.85)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-14px_oklch(86%_0.15_96_/_1)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            )}
          >
            Book in 30 seconds
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#authority"
            className={cn(
              "group/link inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-3.5",
              "font-medium text-white/80 underline-offset-4 hover:text-white hover:underline",
              "transition-colors duration-300",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            )}
          >
            Meet Dr. Phil
            <span aria-hidden className="transition-transform duration-300 group-hover/link:translate-x-0.5">→</span>
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-12 flex flex-wrap gap-x-9 gap-y-4 text-white/90 sm:gap-x-12"
        >
          {[
            { v: "25 yrs", k: "Cosmetic injection experience" },
            { v: "Natural", k: "Never overdone — subtle by design" },
            { v: "MD-led", k: "Physician-administered care" },
            { v: "$9/unit", k: "Honest, transparent Botox pricing", gold: true },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt
                className={cn(
                  // Montserrat bold (font-heading) — one coherent numeric voice
                  // with the TrustBar/Financing numerals; Cormorant is reserved
                  // for the tagline + accent words, never the metrics.
                  "font-heading text-4xl font-bold leading-none tnum",
                  s.gold ? "text-[var(--color-gold)]" : "text-white",
                )}
              >
                {s.v}
              </dt>
              <dd className="mt-1.5 max-w-[16ch] text-xs uppercase tracking-[0.12em] text-white/65">
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
            className="block h-2 w-1 rounded-full bg-white/75"
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
