"use client";

/**
 * RenewalHero — hero section + the lazy WebGL boundary.
 *
 * The "Renewal Light" R3F scene is dynamically imported with ssr:false (only
 * legal inside a client component — Next 16). Until it mounts (and on mobile /
 * reduced-motion / no-WebGL), we render a static CSS crystal/void gradient so
 * there is never a blank frame, no CLS, and full graceful degradation.
 */

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const RenewalLightScene = dynamic(() => import("./RenewalLightScene"), {
  ssr: false,
  loading: () => null,
});

function useEnableWebGL() {
  const prefersReduced = useReducedMotion();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
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

    const update = () => setOk(mq.matches && hasWebGL && !saveData);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefersReduced]);

  return ok;
}

const ease = [0.16, 1, 0.3, 1] as const;

export function RenewalHero() {
  const prefersReduced = useReducedMotion();
  const enabled = useEnableWebGL();

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
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
  };

  return (
    <section
      aria-label="Encore Dermatology — academic-level skin care in Columbus"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static crystal/void — always painted (SSR + fallback, no CLS) */}
      <div className="crystal-fallback absolute inset-0 -z-20" aria-hidden="true" />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <RenewalLightScene />
        </div>
      )}

      {/* Legibility scrims — keep copy WCAG-AA over any crystal frame.
          Left wash anchors the copy column; vertical seats nav + base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(14%_0.02_265_/_0.86)] via-[oklch(15%_0.02_265_/_0.42)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(14%_0.02_265_/_0.72)] via-transparent to-[oklch(13%_0.02_266_/_0.72)]"
      />
      {/* Focused anchor wash behind the copy column — guarantees WCAG-AA even
          if the warm light shaft sweeps toward the cursor on the left. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_22%_55%,oklch(13%_0.02_266_/_0.6),transparent_62%)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 sm:px-8 md:pt-36"
      >
        <motion.p
          variants={item}
          className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg)] backdrop-blur-md"
        >
          <span aria-hidden className="text-[var(--gold)]">✦</span>
          Board-certified · OSU faculty-led · Since 2010
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[18ch] text-balance text-[var(--color-fg)] drop-shadow-[0_2px_30px_oklch(10%_0.02_265_/_0.6)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.02 }}
        >
          The most trusted
          <span className="italic foil"> skin </span>
          in Columbus.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[50ch] text-pretty font-light text-[var(--color-fg-muted)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
        >
          Dermatology practiced at an academic-medical level — led by{" "}
          <span className="font-medium text-[var(--color-fg)]">
            Dr. Gwyn Londeree, MD
          </span>
          , Associate Professor of Dermatology at the{" "}
          <span className="text-[var(--color-fg)]">
            Ohio State University College of Medicine
          </span>
          . Clinical care and luxury aesthetics, under one roof.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold tracking-tight",
              "shadow-[0_18px_50px_-16px_oklch(82%_0.1_84_/_0.55)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-14px_oklch(82%_0.1_84_/_0.7)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]",
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
            href="#paths"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-[var(--glass-border)] bg-[var(--glass-bg)] font-medium text-[var(--color-fg)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-[var(--glass-bg-strong)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]",
            )}
          >
            Explore care paths
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 text-[var(--color-fg)]"
        >
          {[
            { v: "4.81★", k: "404 patient reviews" },
            { v: "OSU", k: "Associate Professor" },
            { v: "Est. 2010", k: "Columbus, Ohio" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-2xl leading-none">{s.v}</dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
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
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--color-border)] p-1">
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
