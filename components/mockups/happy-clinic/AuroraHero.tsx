"use client";

/**
 * AuroraHero — the hero section. The WebGL sky itself now lives on the
 * page-level fixed canvas (AuroraConductor); this section is a transparent
 * "sky window" onto it ([data-sky-window]), keeping only:
 *  - the static CSS aurora fallback (SSR / mobile / reduced-motion / no-WebGL
 *    — faded out via [data-aurora-live] when the live sky is up, zero CLS),
 *  - the legibility scrims, and
 *  - the copy, now choreographed by GSAP:
 *
 * SIGNATURE MOTION (hand-rolled, no Club plugins):
 *  1. Char-split entrance — "Subtle is" cascades in per-character (rise +
 *     settle on an expo ease) while the foil phrase "The New WOW." rises as
 *     ONE piece through an overflow mask, so its continuous teal→gold foil
 *     sweep is never broken into per-char fragments.
 *  2. Pinned descend — on desktop the hero pins for ~45vh while ScrollTrigger
 *     scrubs the copy up and away; with the aurora parallax (drive.scroll)
 *     pushing the curtains up behind it, leaving the hero feels like sinking
 *     down through the night sky.
 *  3. Magnetic pale-yellow CTA — the one loud button leans toward the cursor
 *     and settles home elastically (fine pointers only).
 *
 * Reduced motion: no timelines are created (copy renders static + visible),
 * no pin, no magnetism; the static aurora holds. Brand voice unchanged: the
 * live site's italic-serif "Subtle is The New WOW" over a navy night sky, led
 * by Dr. Phil Hong Nguyen, MD. Pale-yellow primary CTA (dark text).
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Hand-rolled SplitText: word-wrapped char spans so lines never break
   mid-word and each glyph can rise independently. Visual-only (the h1
   carries an aria-label with the full phrase). */
function SplitChars({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <span key={`${w}-${wi}`}>
          <span className="hc-word">
            {Array.from(w).map((c, ci) => (
              <span key={ci} className="hc-char">
                {c}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export function AuroraHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy) return;

    const mm = gsap.matchMedia();

    /* Entrance — any viewport, motion permitting. */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hc-hero-eyebrow", { y: 16, autoAlpha: 0, duration: 0.7 }, 0.05)
        .from(
          ".hc-char",
          {
            yPercent: 110,
            rotate: 4,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.035,
            ease: "expo.out",
          },
          0.15,
        )
        .from(
          ".hc-foil-inner",
          { yPercent: 116, duration: 1.05, ease: "expo.out" },
          0.52,
        )
        .from(
          [".hc-hero-lead", ".hc-hero-ctas", ".hc-hero-stats"],
          { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.1 },
          0.74,
        );
      // NOTE: the scroll cue's entrance is CSS (hc-cue-in, brand.css) so the
      // pin scrub below is the ONLY gsap owner of its opacity — two tweens on
      // one property with lazy start-recording can wedge it invisible.
      return () => tl.kill();
    }, section);

    /* Pinned descend — desktop only (phones keep a plain, fast scroll-away). */
    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
      () => {
        const scrub = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=45%",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
          },
        });
        scrub
          .to(copy, { yPercent: -16, autoAlpha: 0, ease: "power1.in" }, 0)
          .fromTo(
            ".hc-scroll-cue",
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.3, immediateRender: false },
            0,
          );
        return () => {
          scrub.scrollTrigger?.kill();
          scrub.kill();
        };
      },
      section,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      data-sky-window
      aria-label="Happy Clinic Denver — Subtle is The New WOW, with Dr. Phil Hong Nguyen, MD"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Layer 0: static aurora — always painted (SSR + fallback, zero CLS).
          When the live fixed-canvas sky is up ([data-aurora-live]) brand.css
          fades this out so the section becomes a window onto the real aurora. */}
      <div
        className="aurora-fallback absolute inset-0 -z-20"
        data-hide-when-live="true"
        aria-hidden="true"
      />

      {/* Layer 0b: a MOBILE-ONLY second drifting aurora ribbon. WebGL is gated to
          >=768px, so phones (where med-spa traffic actually is) only ever get the
          CSS fallback — this keeps the showpiece feeling alive there. A single
          GPU-cheap transform/opacity sweep at a different angle + slower cadence
          than the base ::before ribbon. Hidden on md+ (the live sky takes over)
          and fully reduced-motion gated in brand.css. */}
      <div className="aurora-fallback__drift absolute inset-0 -z-20 md:hidden" aria-hidden="true" />

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

      <div
        ref={copyRef}
        className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16 sm:px-8 md:pt-32"
      >
        <p className="hc-hero-eyebrow mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
          <span aria-hidden className="text-white/70">✦</span>
          Denver, CO · 25 years of cosmetic-injection mastery
        </p>

        <h1
          aria-label="Subtle is The New WOW."
          className="font-display max-w-[15ch] text-balance text-white drop-shadow-[0_2px_30px_oklch(12%_0.04_252_/_0.72)]"
          style={{ fontSize: "var(--fluid-hero)", lineHeight: 1.04, fontWeight: 600 }}
        >
          <span aria-hidden="true">
            <SplitChars text="Subtle is" />{" "}
            {/* The GSAP transform target (.hc-foil-inner) and the
                background-clip:text element (.foil-sheen) MUST be separate —
                will-change/transform on the clipped element makes Chrome
                composite it as a layer and paint the gradient UNclipped. */}
            <span className="hc-foil-mask">
              <span className="hc-foil-inner">
                <span className="font-display-em foil-sheen">The New WOW.</span>
              </span>
            </span>
          </span>
        </h1>

        <p
          className="hc-hero-lead mt-7 max-w-[54ch] text-pretty font-light text-white/85"
          style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
        >
          Refined, natural-looking results from{" "}
          <span className="font-medium text-white">Dr. Phil Hong Nguyen, MD</span> —
          with{" "}
          <span className="font-medium text-white">25 years of cosmetic-injection
          experience</span> and honest,{" "}
          <span className="font-medium text-white">$9-per-unit Botox</span>.
          Subtle by design. Right here in Denver.
        </p>

        <div className="hc-hero-ctas mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Magnetic>
            <Link
              href="#book"
              className={cn(
                "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
                "bg-[var(--color-gold)] text-[var(--color-fg)] font-bold tracking-tight",
                "shadow-[0_18px_50px_-16px_oklch(86%_0.15_96_/_0.85)]",
                "transition-[translate,scale,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-14px_oklch(86%_0.15_96_/_1)]",
                "active:translate-y-0 active:scale-[0.97] active:duration-100",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              )}
            >
              Book in 30 seconds
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Magnetic>
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
        </div>

        <dl className="hc-hero-stats mt-12 flex flex-wrap gap-x-9 gap-y-4 text-white/90 sm:gap-x-12">
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
        </dl>
      </div>

      {/* Scroll cue — CSS bob (reduced-motion gated in brand.css); GSAP fades
          it in on load and out as the pinned descend begins. */}
      <div
        aria-hidden="true"
        className="hc-scroll-cue pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/45 p-1">
          <span className="hc-cue-dot block h-2 w-1 rounded-full bg-white/75" />
        </span>
      </div>
    </section>
  );
}
