"use client";

/**
 * CausticsHero — hero section + the lazy WebGL boundary.
 *
 * The "Liquid-Gold Caustics" R3F scene is dynamically imported with ssr:false
 * (only legal inside a "use client" module — Next 16 gotcha). Until it mounts —
 * and on mobile / reduced-motion / no-WebGL / save-data — we render a static
 * CSS pink-caustics-on-charcoal field so there is never a blank frame, zero CLS,
 * and full graceful degradation. The scene itself pauses its render loop when
 * scrolled offscreen or the tab is hidden (IntersectionObserver + visibility).
 */

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./primitives";

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const CausticsScene = dynamic(() => import("./CausticsScene"), {
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

const ease = [0.16, 1, 0.3, 1] as const;

export function CausticsHero() {
  const prefersReduced = useReducedMotion();
  const { enabled, lite } = useEnableWebGL();

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
    hidden: { opacity: 0, y: prefersReduced ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
  };

  return (
    <section
      id="top"
      aria-label="Sousan Med Spa — Houston, TX · your beauty evolution"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static monochrome + pink-light field — always painted (SSR) */}
      <div
        className="caustics-fallback absolute inset-0 -z-20"
        aria-hidden="true"
      />

      {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
      {enabled && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <CausticsScene lite={lite} />
        </div>
      )}

      {/* Base legibility wash — anchors the copy column over the caustics field
          and seats the nav + the trust-bar transition. The founder portrait is
          NO LONGER a full-bleed background scrim; she is a real, visible framed
          element in the grid below (see the portrait column). Decorative. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(12%_0_0_/_0.88)] via-[oklch(12%_0_0_/_0.46)] to-[oklch(12%_0_0_/_0.12)] md:to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(12%_0_0_/_0.6)] via-transparent to-[oklch(11%_0_0_/_0.92)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-32 pb-20 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:pt-40 lg:gap-16"
      >
      <motion.div variants={container} className="order-2 md:order-1">
        <motion.p
          variants={item}
          className="glass-dark mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-[oklch(96%_0_0)]"
        >
          <span aria-hidden className="text-[var(--gold-bright)]">
            ✦
          </span>
          Houston, TX · Medspa &amp; Aesthetics
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[15ch] text-balance text-[var(--color-bg)] drop-shadow-[0_2px_44px_oklch(8%_0_0_/_0.7)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.0 }}
        >
          Embark on your{" "}
          <span className="gold-leaf--bright font-display-em">
            beauty evolution.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[52ch] text-pretty font-light text-[oklch(93%_0_0_/_0.92)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
        >
          Discover transformative medspa services at Sousan Medspa, Houston —{" "}
          <span className="font-medium text-[var(--color-bg)]">
            IPL, HydraFacial&nbsp;MD &amp; the Deluxe Facial
          </span>
          , delivered with an artist&rsquo;s eye and award-winning care.
        </motion.p>

        {/* Named provider trust line — high-ticket aesthetics buyers buy the
            PROVIDER first, so the promise is tied to Sousan by name (her standard
            and voice, NOT unverifiable credentials). This converts the portrait
            badge from decoration into the hero's trust spine. */}
        <motion.p
          variants={item}
          className="mt-5 flex items-center gap-2.5 text-[0.95rem] font-light text-[oklch(90%_0_0_/_0.9)]"
        >
          <span
            aria-hidden
            className="h-px w-7 shrink-0 bg-[var(--gold-bright)]"
          />
          Led personally by{" "}
          <span className="font-medium text-[var(--color-bg)]">Sousan</span>
          &nbsp;— Houston&rsquo;s artist of natural results.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Magnetic>
            <Link
              href="#book"
              className={cn(
                "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
                "bg-[var(--gold)] font-semibold tracking-tight text-[oklch(100%_0_0)]",
                "shadow-[0_18px_50px_-16px_oklch(58%_0.245_358_/_0.6)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_24px_64px_-14px_oklch(58%_0.245_358_/_0.78)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
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
              "glass-dark inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "font-medium text-[var(--color-bg)]",
              "transition-colors duration-300 hover:bg-[oklch(30%_0_0_/_0.6)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
            )}
          >
            Explore the menu
          </Link>
        </motion.div>

        {/* Stat row — a deliberate 3-up grid with thin pink hairline dividers
            (echoing the editorial rhythm) so the three always sit on ONE balanced
            row instead of orphan-wrapping 2+1. Value-first hierarchy: a pink tick
            leads the bright value; the caption drops in weight but clears AA. */}
        <motion.dl
          variants={item}
          className="mt-14 grid max-w-md grid-cols-3 text-[var(--color-bg)]"
        >
          {[
            { v: "Award-winning", k: "Houston aesthetics" },
            { v: "5.0★", k: "Client-rated care" },
            { v: "IPL · HydraFacial", k: "Signature care" },
          ].map((s, i) => (
            <div
              key={s.k}
              className={cn(
                "flex flex-col px-4 first:pl-0",
                i > 0 && "border-l border-[oklch(66%_0.255_356_/_0.4)]",
              )}
            >
              <dt className="font-display flex items-baseline gap-1.5 text-xl leading-none tnum sm:text-2xl">
                <span
                  aria-hidden
                  className="inline-block h-3.5 w-[3px] shrink-0 translate-y-[1px] rounded-full bg-[var(--gold-bright)]"
                />
                {s.v}
              </dt>
              <dd className="mt-2 text-[0.66rem] font-medium uppercase tracking-[0.14em] text-[oklch(85%_0_0_/_0.78)]">
                {s.k}
              </dd>
            </div>
          ))}
        </motion.dl>
        </motion.div>

        {/* Founder portrait — the REAL practitioner, Sousan. The source asset is
            a full-COLOR warm headshot; it is graded to TRUE greyscale (.sn-grayscale
            = grayscale(1)) so its warm gold-brown background can't fight the strict
            monochrome brand, and the lone hot-pink accent lives entirely on the
            frame + credential badge. She is no longer buried as an aria-hidden
            background scrim: she is the visible trust anchor — high-ticket
            aesthetics buyers buy the provider first. Real alt text. */}
        <motion.figure
          variants={item}
          className="relative order-1 mx-auto w-full max-w-[24rem] md:order-2 md:max-w-none"
        >
          <div className="filet relative overflow-hidden rounded-[1.75rem] border border-[oklch(100%_0_0_/_0.16)] shadow-[0_40px_90px_-40px_oklch(0%_0_0_/_0.85)]">
            <Image
              src="/clients/sousan/hero.jpg"
              alt="Sousan, founder and lead aesthetic provider at Sousan Medspa, Houston"
              width={760}
              height={950}
              priority
              sizes="(max-width: 768px) 90vw, 42vw"
              className="sn-grayscale aspect-[4/5] w-full object-cover object-[center_18%]"
            />
            {/* neutral inner vignette — grounds the monochrome figure into the
                dark charcoal studio so the hero reads as one editorial frame */}
            <div aria-hidden className="sn-portrait-vignette" />
            {/* base seat so the portrait grounds into the dark field */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[oklch(11%_0_0_/_0.9)] via-[oklch(11%_0_0_/_0.35)] to-transparent"
            />
            {/* hot-pink credential badge — the lone statement color on the frame */}
            <figcaption className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-[oklch(100%_0_0_/_0.14)] bg-[oklch(14%_0_0_/_0.62)] px-4 py-3 backdrop-blur-md">
              <span
                aria-hidden
                className="h-9 w-1 shrink-0 rounded-full bg-[var(--gold-bright)]"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-base text-[oklch(99%_0_0)]">
                  Sousan
                </span>
                <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--gold-bright)]">
                  Founder &amp; Lead Aesthetic Provider
                </span>
              </span>
            </figcaption>
          </div>
        </motion.figure>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[oklch(66%_0.255_356_/_0.45)] p-1">
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
