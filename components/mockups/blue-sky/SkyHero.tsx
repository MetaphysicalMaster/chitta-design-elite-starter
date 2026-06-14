"use client";

/**
 * SkyHero — the SIGNATURE EXPERIENCE. A living DAWN SKY whose brand SUN RISES as
 * you scroll: the sky brightens from soft dawn to luminous clear day across the
 * hero's scroll length (the day-arc = "elevate"). The rise is a GSAP
 * ScrollTrigger scrub (Lenis-synced in SmoothScroll) driving a `rise` ref the
 * WebGL scene reads each frame — so it's buttery on the GPU and never reflows.
 *
 * Architecture:
 *  - the section is TALL (≈220vh) and the visual content is `sticky` to the
 *    viewport, so the sky holds in place while you scroll "up the arc";
 *  - the "Breath of Sky" R3F scene is dynamically imported with ssr:false (only
 *    legal inside a client component — Next 16). Until it mounts (and on mobile /
 *    reduced-motion), a static CSS sky gradient shows so there is never a blank
 *    frame, no CLS, full graceful degradation;
 *  - reduced-motion / no-WebGL: the static dawn gradient holds, no scrub, no
 *    pin — the page scrolls natively and the hero is a calm still sky.
 */

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CloudDivider } from "./CloudDivider";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const BreathOfSkyScene = dynamic(() => import("./BreathOfSkyScene"), {
  ssr: false,
  loading: () => null,
});

function useEnableWebGL() {
  const prefersReduced = useReducedMotion();
  const [ok, setOk] = useState(false);
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const mqLarge = window.matchMedia("(min-width: 1024px)");
    const saveData =
      // @ts-expect-error — connection is non-standard but widely supported
      navigator.connection?.saveData === true;
    // Probe WebGL availability before committing to the heavy scene.
    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      hasWebGL = false;
    }

    const update = () => {
      setIsLarge(mqLarge.matches);
      setOk(mq.matches && hasWebGL && !saveData);
    };
    update();
    mq.addEventListener("change", update);
    mqLarge.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      mqLarge.removeEventListener("change", update);
    };
  }, [prefersReduced]);

  // Orb is the costliest layer — only run it on large/high-perf viewports.
  return { enabled: ok, showOrb: ok && isLarge };
}

export function SkyHero() {
  const prefersReduced = useReducedMotion();
  const { enabled, showOrb } = useEnableWebGL();

  /* ENTRANCE SAFETY NET. The hero entrance is a pure-CSS keyframe (.bs-rise) so
     it never depends on rAF / IntersectionObserver to *start*. But the document
     timeline is paused while a tab is backgrounded, so a page that loads in a
     background tab would otherwise hold the copy at the from-state (opacity:0).
     This forces the revealed end-state once mounted — via a timeout that still
     fires (throttled) in a hidden tab, and immediately on first visibility — so
     the copy is GUARANTEED visible regardless of focus, with no pop when the
     animation already finished in the foreground. Reduced-motion reveals at once. */
  const [revealed, setRevealed] = useState(prefersReduced);
  useEffect(() => {
    if (prefersReduced) {
      setRevealed(true);
      return;
    }
    // Long enough for the staggered entrance (≈0.55s delay + 0.8s) to play in a
    // foreground tab before we hard-snap, so there is no visible jump.
    const t = window.setTimeout(() => setRevealed(true), 1500);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        // Let the keyframe finish, then lock the end-state (idempotent).
        window.setTimeout(() => setRevealed(true), 1450);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [prefersReduced]);

  // Scroll-scrubbed day-arc (0 = dawn, 1 = high clear day). The scene reads this
  // ref every frame; updating a ref (not state) keeps the hot path React-free.
  const rise = useRef(0);

  // Section spans the scroll length; the inner visual sticks to the viewport so
  // the sun visibly climbs as you descend.
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  /* THE DAY-ARC SCRUB — sun rises + sky brightens across the hero scroll.
     Lenis is wired to ScrollTrigger.update() in SmoothScroll, so this tracks the
     smoothed scroll position. Disabled under reduced motion (rise stays 0 →
     calm dawn). */
  useEffect(() => {
    if (prefersReduced) return;
    const sec = sectionRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      const state = { v: 0 };
      gsap.to(state, {
        v: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
        onUpdate: () => {
          rise.current = state.v;
        },
      });

      // The copy lifts + fades on its own scrub as the headline crests the arc.
      if (copyRef.current) {
        gsap.to(copyRef.current, {
          y: -72,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: "55% top",
            scrub: 0.6,
          },
        });
      }
    }, sec);

    return () => ctx.revert();
  }, [prefersReduced, enabled]);

  return (
    <div
      ref={sectionRef}
      className={cn(
        "relative",
        // Tall scroll runway for the arc when motion is on; a single screen at
        // rest so reduced-motion / SSR has no extra empty space.
        prefersReduced ? "min-h-[100svh]" : "h-[220vh]",
      )}
    >
      <section
        ref={stickyRef}
        aria-label="Blue Sky Med Spa — physician-led aesthetics & wellness"
        className={cn(
          "isolate flex min-h-[100svh] flex-col justify-center overflow-hidden",
          prefersReduced ? "relative" : "sticky top-0 h-[100svh]",
          revealed && "bs-revealed",
        )}
      >
        {/* Layer 0: static sky — always painted (SSR + fallback, zero CLS) */}
        <div className="sky-fallback absolute inset-0 -z-20" aria-hidden="true" />

        {/* Layer 1: WebGL power element (desktop, motion-ok, webgl-ok only) */}
        {enabled && (
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <BreathOfSkyScene showOrb={showOrb} rise={rise} />
          </div>
        )}

        {/* Legibility scrims — keep headline WCAG-AA over any sky frame.
            Vertical seats the top nav + bottom; the left wash anchors the copy. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(26%_0.08_255_/_0.46)] via-[oklch(30%_0.08_255_/_0.14)] to-[oklch(24%_0.08_255_/_0.52)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(24%_0.08_255_/_0.52)] via-[oklch(28%_0.08_255_/_0.16)] to-transparent"
        />

        {/* Entrance is PURE CSS (.bs-rise) so the copy is never gated on
            rAF/IntersectionObserver/tab-focus — it reveals on mount even in a
            background tab and respects reduced-motion (renders visible at once).
            copyRef remains the GSAP scroll-lift target as the headline crests. */}
        <div
          ref={copyRef}
          className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16 sm:px-8 md:pt-32"
        >
          <p className="bs-rise bs-rise-1 mb-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
            <span aria-hidden className="text-[var(--gold)]">★</span>
            5.0 Google rating · Physician-led · 30 years
          </p>

          <h1
            className="bs-rise bs-rise-2 font-display max-w-[16ch] text-balance text-white drop-shadow-[0_2px_24px_oklch(30%_0.1_255_/_0.45)]"
            style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.02, fontWeight: 400 }}
          >
            Elevate your
            <span className="italic"> wellness.</span>
          </h1>

          <p
            className="bs-rise bs-rise-3 mt-6 max-w-[48ch] text-pretty font-light text-white/90"
            style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.5 }}
          >
            German Village&rsquo;s family- &amp; woman-owned medical spa &mdash;
            where over 30 years of medical expertise meets a holistic eye for
            beauty and wellness, with a{" "}
            <span className="font-medium text-white">Medical&nbsp;Doctor on staff</span>.
          </p>

          <div className="bs-rise bs-rise-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#book"
              className={cn(
                "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
                "bg-white text-[var(--color-fg)] font-semibold tracking-tight shadow-[var(--glass-shadow)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_oklch(46%_0.12_255_/_0.5)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              )}
            >
              Book in 30 seconds
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="#services"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
                "border border-white/55 bg-white/10 font-medium text-white backdrop-blur-md",
                "transition-colors duration-300 hover:bg-white/20",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              )}
            >
              Explore treatments
            </Link>
          </div>

          <dl className="bs-rise bs-rise-5 mt-12 flex flex-wrap gap-x-7 gap-y-4 text-white/90 sm:gap-x-10">
            {[
              { v: "5.0★", k: "Google rating" },
              { v: "30+ yrs", k: "Medical expertise" },
              { v: "MD", k: "On staff" },
            ].map((s) => (
              <div key={s.k} className="flex flex-col">
                <dt className="font-display text-2xl leading-none">{s.v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-white/70">
                  {s.k}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Scroll cue — invites you to "rise" up the arc. Pure-CSS fade + bob so
            it is never gated on JS entrance (same background-tab safety). */}
        <div
          aria-hidden="true"
          className="bs-cue pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2"
        >
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/70">
            Scroll to rise
          </span>
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/50 p-1">
            <span className="bs-cue-dot block h-2 w-1 rounded-full bg-white/80" />
          </span>
        </div>

        {/* Cloud-form landing: the hero sky settles into the page on soft wisps. */}
        <CloudDivider
          variant="bottom"
          fill="var(--color-bg-subtle)"
          tint="oklch(96% 0.02 236)"
          heightClass="h-14 sm:h-24"
        />
      </section>
    </div>
  );
}
