"use client";

/**
 * SkinGlowHero — the photo-led hero. THE centerpiece is the client's real
 * hero photograph (a woman, eyes closed, hand to her face, a genuine moment
 * of serene joy, warm muted tone). Per the brand owner's directive it renders
 * as a full-bleed, SEAMLESS looping <video>:
 *
 *   poster = /clients/simplyskin/hero.jpg   (also the graceful fallback)
 *   src    = /clients/simplyskin/hero-loop.mp4   (generated later by Higgsfield)
 *
 * The mp4 does NOT exist yet. The <video> therefore degrades gracefully:
 *   · `poster` paints hero.jpg immediately (before/while the mp4 loads),
 *   · a hidden <img> fallback guarantees the still shows perfectly even if the
 *     mp4 is missing entirely (revealed on the video's `error` event) — no
 *     broken state, no layout shift,
 *   · a tasteful CSS Ken-Burns drift gives the still a breath of life as
 *     stand-in motion until the seamless loop is dropped in (reduced-motion
 *     gated in brand.css).
 *
 * Over/behind the photo sits a WHISPER-subtle skin-glow: a static CSS warm
 * sheen always (SSR + fallback, zero CLS) and, on capable desktops, the R3F
 * caustic scene at low opacity. It is a soft restrained glow that must never
 * fight the photograph. Copy holds AA contrast via a warm left/bottom scrim.
 *
 * Accessibility: video is muted + playsInline + loop (autoplay-safe); the
 * Ken-Burns drift and WebGL scene are disabled under reduced motion.
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

const HERO_POSTER = "/clients/simplyskin/hero.jpg";
const HERO_LOOP = "/clients/simplyskin/hero-loop.mp4";

/**
 * HeroMedia — full-bleed seamless-loop video with a bulletproof still
 * fallback. Until/unless the mp4 exists, the poster (hero.jpg) shows; if the
 * video element errors (mp4 absent), we reveal the hidden <img> so the still
 * is always perfect. A Ken-Burns drift (CSS, reduced-motion gated) gives the
 * still gentle life.
 */
function HeroMedia({ drift }: { drift: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Until the real video can actually play, keep the still <img> visible so
  // there is never a blank/broken frame and no layout shift.
  const [videoReady, setVideoReady] = useState(false);
  // The hero-loop.mp4 is dropped in later by the orchestrator and 404s today.
  // Probe with a HEAD request on mount and only mount the <video> (and fire a
  // media request) once the asset is confirmed present — so a pristine
  // DevTools-inspected pitch artifact never shows a console media error or a
  // wasted 404. Until then the still <img> below is the sole, perfect layer.
  const [loopExists, setLoopExists] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(HERO_LOOP, { method: "HEAD" })
      .then((res) => {
        if (alive && res.ok) setLoopExists(true);
      })
      .catch(() => {
        /* absent — keep the still poster as the sole layer */
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!loopExists) return;
    const v = videoRef.current;
    if (!v) return;
    // If the source 404s / is missing, force the still fallback to stay shown.
    const onError = () => setVideoReady(false);
    const onPlaying = () => setVideoReady(true);
    v.addEventListener("error", onError, true);
    v.addEventListener("playing", onPlaying);
    // Best-effort autoplay (muted autoplay is permitted); ignore rejections.
    v.play?.().catch(() => {});
    return () => {
      v.removeEventListener("error", onError, true);
      v.removeEventListener("playing", onPlaying);
    };
  }, [loopExists]);

  const driftClass = drift ? "ken-burns" : "";
  // Aspect-aware framing: a 16:9 source cropped to a tall phone viewport can
  // pull the subject's face under the left-anchored headline. On narrow
  // screens bias the crop toward the subject (lower/centred) and reserve the
  // right-weighted 74%/38% framing — which guarantees the empty left third —
  // for md+ where the copy column and the photo coexist side by side.
  const framing = "object-[58%_28%] md:object-[74%_38%]";

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-[var(--color-bg-warm)]">
      {/* Still fallback — guarantees a perfect frame with NO mp4. Shown until
          the video is actually playing; always present underneath. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_POSTER}
        alt="A woman with her eyes closed and hand resting to her face, smiling in a moment of calm, natural joy — warm, soft-lit skin."
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          framing,
          driftClass,
          videoReady ? "opacity-0" : "opacity-100",
        )}
        draggable={false}
        fetchPriority="high"
      />

      {/* Seamless looping hero video — mounted ONLY once the mp4 is confirmed
          to exist (HEAD probe above), so no request/console error fires while
          it is absent. Degrades to the still <img> otherwise. Decorative — the
          <img> above carries the accessible description. */}
      {loopExists && (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            framing,
            videoReady ? "opacity-100" : "opacity-0",
          )}
          poster={HERO_POSTER}
          src={HERO_LOOP}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </div>
  );
}

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
      aria-label="SimplySkin MedSpa — body & skincare, guided by medical expertise"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer -2: the real hero photograph as a full-bleed seamless-loop video
          (graceful still fallback baked in). THE centerpiece. */}
      <HeroMedia drift={!prefersReduced} />

      {/* Layer -1a: whisper-soft static caustic glow OVER the photo — always
          painted (SSR + fallback). Soft-light blend so it never fights the
          photo; kept very low opacity. */}
      <div
        className="glow-fallback absolute inset-0 -z-10 opacity-30 mix-blend-soft-light"
        aria-hidden="true"
      />

      {/* Layer -1b: WebGL skin-glow (desktop, motion-ok, webgl-ok) — kept to a
          true whisper (low opacity + soft-light) so the photograph stays the
          hero and the opaque backdrop canvas never washes it out. */}
      {enabled && (
        <div
          className="absolute inset-0 -z-10 opacity-25 mix-blend-soft-light"
          aria-hidden="true"
        >
          <SkinGlowScene lite={lite} />
        </div>
      )}

      {/* Legibility scrims — warm, anchoring the dark copy on the left/bottom so
          it clears WCAG AA over the brightest part of the photo. The photo
          (face) sits to the right and breathes through. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[5] bg-gradient-to-r from-[oklch(97%_0.007_76_/_0.94)] via-[oklch(97%_0.007_76_/_0.62)] to-[oklch(97%_0.007_76_/_0.06)] md:to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[5] bg-gradient-to-b from-[oklch(98%_0.005_78_/_0.5)] via-transparent to-[oklch(96%_0.009_74_/_0.62)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ y: copyY, opacity: copyOpacity }}
        className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16 sm:px-8 md:pt-32"
      >
        {/* Copy is pinned into the photo's clean grey LEFT negative space (the
            portrait is right-weighted, with a purpose-built empty left third)
            so the headline never lands on the subject's face/hand. */}
        <div className="max-w-xl">
        <motion.p
          variants={item}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[oklch(99%_0.004_78_/_0.7)] px-4 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-fg-muted)] backdrop-blur-md"
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          Fishers &amp; Carmel · Zionsville, Indiana
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display max-w-[16ch] text-balance text-[var(--color-fg)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.06 }}
        >
          Body &amp; <span className="font-display-em foil-sheen">skincare</span>,
          <br />
          guided by medical expertise.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[50ch] text-pretty font-light text-[var(--color-fg-muted)]"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.62 }}
        >
          Medical-grade care for the Indianapolis metro, where the goal is never
          &ldquo;done&rdquo; — just a more-rested version of you that still looks
          like you. Quiet, natural results at two locations: Fishers and Carmel
          &middot; Zionsville.
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
              "shadow-[0_18px_50px_-20px_oklch(58%_0.04_184_/_0.55)]",
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-18px_oklch(58%_0.04_184_/_0.7)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            Book a consultation
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#authority"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
              "border border-[var(--color-border)] bg-[oklch(99%_0.004_78_/_0.65)] font-medium text-[var(--color-fg)] backdrop-blur-md",
              "transition-colors duration-300 hover:bg-[oklch(99%_0.004_78_/_0.88)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            Our approach
          </Link>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-5 sm:gap-x-14"
        >
          {[
            { v: "2", k: "Locations · Fishers + Carmel" },
            { v: "Physician-led", k: "Every plan, medically guided" },
            { v: "Natural", k: "Restrained, never overdone" },
          ].map((s) => (
            <div key={s.k} className="flex flex-col">
              <dt className="font-display text-[1.6rem] leading-none tnum text-[var(--color-fg)]">
                {s.v}
              </dt>
              <dd className="mt-2 max-w-[18ch] text-xs uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                {s.k}
              </dd>
            </div>
          ))}
        </motion.dl>
        </div>
      </motion.div>

      {/* Scroll cue — aligned UNDER the left-anchored copy column (not over the
          subject's face) and quieted to a single slow hairline chevron, so it
          reads as a refined wayfinding mark, not a stock "scroll" widget. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.9 }}
        className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center md:justify-start"
      >
        <div className="mx-auto flex w-full max-w-6xl px-6 sm:px-8">
          <motion.span
            className="flex flex-col items-center gap-1.5 text-[var(--color-fg-subtle)]"
            animate={prefersReduced ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="block h-7 w-px bg-[var(--color-border)]" />
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
