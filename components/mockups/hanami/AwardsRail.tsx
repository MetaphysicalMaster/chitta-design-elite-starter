"use client";

/**
 * AwardsRail — THE CENTERPIECE. Replaces the old reviews/testimonials section
 * entirely.
 *
 * Hanami's proudest, most under-used asset is its hardware: back-to-back DFW
 * Favorites WINNER badges (Fort Worth Star-Telegram) and Fort Worth Magazine
 * Top Doctor honors. The live SEO template buries these; here they become an
 * OVERSIZED, auto-scrolling trophy rail on a sumi-black field with gold-leaf
 * framing — big, proud, and unmistakably the real brand.
 *
 * TROPHY LANGUAGE (pass 3): the source art is two incompatible shapes, so we
 * stop forcing one box. Every plate shares ONE non-square portrait rhythm
 * (5/6), but the contents honour the art:
 *  - the OPAQUE SQUARE DFW emblems (which carry their own black+gold ground)
 *    sit edge-to-edge ON the gold-leaf plate — no nested light panel, the plate's
 *    own inset gold rule is the only frame (kills the prior triple-frame),
 *  - the WIDE TRANSPARENT Top Doctors lockup gets its own honest horizontal
 *    treatment — centred on a GENEROUS gold-foil bar (grown to fill the plate so
 *    it carries mass comparable to the DFW emblems) — so it reads as a co-equal
 *    trophy, not a small chip floating in dead black.
 * Captions lead with the YEAR (the thing the badge states least loudly); the
 * publication is already legible in-art, so we don't echo it. DFW year captions
 * are CHAMPAGNE (neutral glint) not gold-foil, so the silver 2025 badge isn't
 * undercut by a gold caption asserting a metal its art doesn't have.
 *
 * Mechanics (modeled on darst's .dt-marquee, ported to .hn-marquee in brand.css):
 *  - the track holds the badges TWICE and translates -50% in a seamless loop,
 *  - PAUSES on hover / focus-within,
 *  - prefers-reduced-motion → animation off + the rail becomes a normal
 *    horizontally-scrollable, swipeable, snapping strip (CSS), and the
 *    seamless-loop duplicate is removed from layout so the swipe shows the four
 *    real trophies exactly once,
 *  - edges fade via a CSS mask so badges enter/leave gracefully.
 * The duplicated half is aria-hidden so assistive tech announces each award once.
 */

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal, SectionHeading } from "./primitives";
import { InkStroke } from "./InkStroke";

gsap.registerPlugin(ScrollTrigger);

type Award = {
  id: string;
  src: string;
  alt: string;
  /** opaque square emblem (sits edge-to-edge) vs wide transparent lockup. */
  kind: "emblem" | "lockup";
  /** the loud line — the year for the DFW streak; the honor for Top Doctor. */
  headline: string;
  sub: string;
};

// Order tells the streak CHRONOLOGICALLY — 2024 → 2025 → 2026 — so the rail (and
// its seamless duplicate) reads as one intentional ascending run, never a
// scrambled set. The Fort Worth Top Doctor honor is a SEPARATE credential (not a
// DFW year), so it sits LAST as the deliberate capstone — the run of consecutive
// DFW wins, then the physician honor that crowns them.
const AWARDS: Award[] = [
  {
    id: "dfw-2024",
    src: "/clients/hanami/award-2024.png",
    alt: "DFW Favorites 2024 Winner badge — Fort Worth Star-Telegram",
    kind: "emblem",
    headline: "2024",
    sub: "DFW Favorites — Winner",
  },
  {
    id: "dfw-2025",
    src: "/clients/hanami/award-2025.jpg",
    alt: "DFW Favorites 2025 Winner badge — Fort Worth Star-Telegram",
    kind: "emblem",
    headline: "2025",
    sub: "DFW Favorites — Winner",
  },
  {
    id: "dfw-2026",
    src: "/clients/hanami/award-2026.png",
    alt: "DFW Favorites 2026 Winner badge — Fort Worth Star-Telegram",
    kind: "emblem",
    headline: "2026",
    sub: "DFW Favorites — Winner",
  },
  {
    id: "topdoctor-2026",
    src: "/clients/hanami/award-topdoctors-2026.png",
    alt: "Fort Worth Magazine Top Doctors 2026 honor for Dr. Elaine Phuah",
    kind: "lockup",
    headline: "Fort Worth Top Doctor",
    sub: "Selected 2026",
  },
];

function Badge({ a, sizeHint }: { a: Award; sizeHint: string }) {
  const isLockup = a.kind === "lockup";
  return (
    <figure className="group flex w-[18rem] shrink-0 flex-col items-center sm:w-[21rem] lg:w-[23rem]">
      {/* ONE plate rhythm (5/6 portrait) for both trophy types — but the contents
          differ so neither shape is abused. */}
      <div className="award-plate flex aspect-[5/6] w-full flex-col items-center justify-center rounded-[1.75rem] p-5 transition-transform duration-500 group-hover:-translate-y-1 sm:p-6">
        {isLockup ? (
          /* WIDE transparent lockup — its own honest horizontal gold-foil bar,
             never letterboxed into a square. The bar now CARRIES the plate: it
             fills nearly the full inner width and a tall slice of the height
             (aspect 1.55/1, vertically grown) so the Top Doctor honor reads with
             mass comparable to the edge-to-edge DFW emblems — not a small chip
             floating in dead black. */
          <div className="award-foilbar relative flex aspect-[1.55/1] w-full items-center justify-center overflow-hidden rounded-[1.1rem] px-6 py-5 sm:px-7 sm:py-6">
            <div className="relative h-full w-full">
              <Image
                src={a.src}
                alt={a.alt}
                fill
                sizes={sizeHint}
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          /* OPAQUE square emblem — edge-to-edge on the gold-leaf plate; the
             plate's inset gold rule is the only frame (no nested light panel). */
          <div className="relative h-full w-full">
            <Image
              src={a.src}
              alt={a.alt}
              fill
              sizes={sizeHint}
              className="object-contain"
            />
          </div>
        )}
      </div>
      <figcaption className="mt-5 text-center">
        {/* The DFW emblem captions are CHAMPAGNE (the brand's neutral glint on
            black), NOT gold-foil: the 2025 badge is silver while 2024/2026 are
            gold, so a gold-foil year caption would assert "gold" over a silver
            badge and read as a mid-streak downgrade. Champagne lets each real
            badge carry its own metal honestly. The Top Doctor lockup keeps the
            gold-foil flourish (its art is metal-free, nothing to clash). */}
        <p
          className={
            isLockup
              ? "gold-foil font-display tnum text-2xl tracking-wide sm:text-3xl"
              : "font-display tnum text-2xl tracking-wide text-[var(--color-accent-bright)] sm:text-3xl"
          }
        >
          {a.headline}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-bg)]/65">
          {a.sub}
        </p>
      </figcaption>
    </figure>
  );
}

const SIZE_HINT = "(min-width: 1024px) 23rem, (min-width: 640px) 21rem, 18rem";

export function AwardsRail() {
  const sectionRef = useRef<HTMLElement>(null);

  // GOLD-LEAF SHIMMER — as the trophy wall enters, a glint of light sweeps
  // across every gold-foil text (the headline + the Top Doctor captions), and
  // the 2024→2025→2026 year-spine assembles left-to-right. ScrollTrigger is
  // Lenis-synced via SmoothScroll. Reduced-motion (gsap.matchMedia) and no-JS
  // both land on the static gold — the shimmer is pure additive grace.
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The glint helper: stretch the foil gradient and slide its bright band
      // across the glyphs once; clearProps restores the pristine static foil.
      const glint = (targets: HTMLElement[], tl: gsap.core.Timeline, at: number) =>
        tl.fromTo(
          targets,
          { backgroundSize: "280% 100%", backgroundPosition: "130% 0%" },
          {
            backgroundPosition: "-40% 0%",
            duration: 1.7,
            ease: "power2.inOut",
            stagger: 0.1,
            clearProps: "backgroundSize,backgroundPosition",
          },
          at,
        );

      // BEAT 1 — anchored on the YEAR-SPINE (not the section top, which on a
      // slow scroll would fire while everything is still below the fold): the
      // 2024 → 2025 → 2026 run assembles left-to-right and the headline foil
      // catches the light, all on screen.
      const spineWrap = root.querySelector<HTMLElement>("[data-year-spine]");
      const years = gsap.utils.toArray<HTMLElement>("[data-spine-year]", root);
      const rules = gsap.utils.toArray<HTMLElement>("[data-spine-rule]", root);
      const headFoils = gsap.utils.toArray<HTMLElement>("h2 .gold-foil", root);

      const headTl = gsap.timeline({
        scrollTrigger: {
          trigger: spineWrap ?? root,
          start: "top 86%",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });
      if (years.length) {
        headTl.from(years, { opacity: 0, y: 10, duration: 0.55, stagger: 0.18 }, 0);
      }
      if (rules.length) {
        headTl.from(
          rules,
          { scaleX: 0, transformOrigin: "0% 50%", duration: 0.45, stagger: 0.18 },
          0.12,
        );
      }
      if (headFoils.length) glint(headFoils, headTl, 0);

      // BEAT 2 — the trophy rail's own captions glint as the rail enters.
      const railFoils = gsap.utils.toArray<HTMLElement>(
        ".hn-marquee .gold-foil",
        root,
      );
      if (railFoils.length) {
        const railTl = gsap.timeline({
          scrollTrigger: {
            trigger: root.querySelector(".hn-marquee") ?? root,
            start: "top 82%",
            once: true,
          },
        });
        glint(railFoils, railTl, 0.1);
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="awards"
      ref={sectionRef}
      aria-labelledby="awards-title"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
      style={{ background: "linear-gradient(168deg, var(--night-1), var(--night-0))" }}
    >
      {/* GOLD-forward aura, centred high to HALO the trophy rail (this section's
          own room — gold dominant, unlike the coral-leaning night sections). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(60% 48% at 50% 30%, oklch(74% 0.12 86 / 0.26), transparent 72%), radial-gradient(40% 40% at 50% 104%, oklch(64% 0.14 12 / 0.16), transparent 74%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Recognized across Fort Worth"
          invert
          align="center"
          title={
            <span id="awards-title">
              Year after year,{" "}
              <span className="gold-foil font-display-em">Fort Worth&apos;s favor.</span>
              <InkStroke tone="champagne" className="mx-auto mt-5 w-44 opacity-90 sm:w-52" />
            </span>
          }
          lead="Back-to-back DFW Favorites WINNER honors from the Fort Worth Star-Telegram — 2024, 2025, and 2026 — and a Fort Worth Magazine Top Doctor. The honors behind one trusted set of hands: Dr. Elaine Phuah's."
        />

        {/* Year-spine — dramatizes the DFW streak as ONE continuous flex (the real
            story) rather than three near-identical copies looping past. */}
        <Reveal delay={0.06}>
          <p
            aria-hidden
            data-year-spine
            className="mt-7 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-accent-bright)]/85 sm:gap-4"
          >
            <span data-spine-year className="tnum">2024</span>
            <span data-spine-rule className="h-px w-6 bg-[var(--color-accent-bright)]/35 sm:w-9" />
            <span data-spine-year className="tnum">2025</span>
            <span data-spine-rule className="h-px w-6 bg-[var(--color-accent-bright)]/35 sm:w-9" />
            <span data-spine-year className="tnum">2026</span>
          </p>
        </Reveal>
      </div>

      <Reveal className="relative mt-12 sm:mt-14">
        {/* The rail viewport — masked edges; pauses on hover/focus. */}
        <div
          className="hn-marquee"
          aria-label="Awards and honors (auto-scrolling)"
        >
          <ul className="hn-marquee__track items-stretch gap-7 px-7 sm:gap-9 sm:px-9">
            {AWARDS.map((a) => (
              <li key={a.id} className="snap-center">
                <Badge a={a} sizeHint={SIZE_HINT} />
              </li>
            ))}
            {/* Seamless-loop duplicate — hidden from assistive tech, and removed
                from layout under reduced-motion (see brand.css) so the static
                swipe strip shows the four real trophies exactly once. */}
            {AWARDS.map((a) => (
              <li key={`dup-${a.id}`} aria-hidden className="hn-marquee__dup snap-center">
                <Badge a={a} sizeHint={SIZE_HINT} />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* A quiet aggregate strip + the real IG handle — confidence, not star-spam. */}
      <Reveal delay={0.08} className="relative mx-auto mt-14 max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-8">
          <p className="text-sm text-[var(--color-bg)]/72">
            Recognized every year since 2024 — by one set of hands.
          </p>
          <span aria-hidden className="hidden h-4 w-px bg-white/15 sm:block" />
          <a
            href="https://instagram.com/hanami.medspa"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-bright)] underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
            </svg>
            @hanami.medspa
          </a>
        </div>
      </Reveal>
    </section>
  );
}
