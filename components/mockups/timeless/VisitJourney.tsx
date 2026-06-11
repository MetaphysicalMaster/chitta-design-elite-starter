"use client";

/**
 * VisitJourney — the GSAP-pinned "your visit" journey strip.
 *
 * The page's scroll-told story: a single orange BOKEH LIGHT-DOT (the brand's
 * signature mark, set in motion) travels a hand-drawn waving SVG path through
 * four stations — Consult → Plan → Treat → Glow — while the section is PINNED
 * and the visitor's scroll drives everything:
 *
 *   · the orange path DRAWS itself (dashoffset) behind the traveling dot,
 *     over a dotted peach guide (a string of tiny bokeh dots — the path
 *     itself speaks the brand texture);
 *   · the light-dot rides the path via getPointAtLength (hand-rolled motion
 *     path — no paid plugins), trailed by a soft comet of lagging glints;
 *   · each station pings + fills orange as the light arrives, and its card
 *     below wakes (rise + brighten) — light literally leading the eye from
 *     "hello" to "glow", and onward to the booking section.
 *
 * Choreography is scrubbed (scrub: 0.75) so the dot carries real inertia on
 * top of Lenis' smoothing — it glides, never teleports.
 *
 * Degradation (all states elegant, never broken):
 *   · The DEFAULT server-rendered state is the COMPLETED journey — path fully
 *     drawn, all four stations lit, the dot resting at "Glow". Reduced-motion
 *     and no-JS users get a finished, readable diagram.
 *   · The pin + scrub only mount via gsap.matchMedia on
 *     (min-width: 768px) and (prefers-reduced-motion: no-preference).
 *   · Mobile gets a calm vertical version of the same four steps (no pin).
 *
 * A11y: the SVG band is decorative (aria-hidden); the four steps are a real
 * <ol> read in order by AT regardless of scroll state.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal, SectionHeading } from "./primitives";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* The four stations. Path runs through (150,206) (450,96) (750,206) (1050,96)
   in a 1200×280 viewBox — three identical-length cubic waves, so the stations
   sit at progress 0, 1/3, 2/3, 1 exactly, centered under grid-cols-4 columns. */
const STOPS = [
  {
    n: "01",
    title: "Consult",
    body: "A real conversation with your physician — your goals first, never a quota.",
  },
  {
    n: "02",
    title: "Plan",
    body: "A plan shaped to your face, your timeline and your budget — decided together.",
  },
  {
    n: "03",
    title: "Treat",
    body: "Physician-placed care in a calm private room — unhurried, precise, gentle.",
  },
  {
    n: "04",
    title: "Glow",
    body: "Walk out rested and refreshed — still you, on your best day.",
  },
] as const;

const PATH_D =
  "M 150 206 C 255 206 345 96 450 96 C 555 96 645 206 750 206 C 855 206 945 96 1050 96";
const STATION_XY: [number, number][] = [
  [150, 206],
  [450, 96],
  [750, 206],
  [1050, 96],
];
/* Station i lights the moment the light reaches it (its exact path fraction,
   nudged a hair early so the ping reads as the dot's arrival). */
const THRESHOLDS = [0, 0.321, 0.655, 0.985];

export function VisitJourney() {
  const pinRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const drawPathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const pinEl = pinRef.current;
        const band = bandRef.current;
        const path = drawPathRef.current;
        const dot = dotRef.current;
        if (!pinEl || !band || !path || !dot) return;

        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;

        const stations = Array.from(
          band.querySelectorAll<SVGGElement>("[data-station]"),
        );
        const trail = Array.from(
          band.querySelectorAll<SVGCircleElement>("[data-trail]"),
        );
        const stops = Array.from(
          pinEl.querySelectorAll<HTMLElement>("[data-stop]"),
        );

        /* One render fn, pure DOM writes — the scrubbed proxy drives it. */
        const render = (p: number) => {
          path.style.strokeDashoffset = `${len * (1 - p)}`;
          const pt = path.getPointAtLength(len * p);
          dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          trail.forEach((c, i) => {
            const lag = Math.max(0, p - 0.045 * (i + 1));
            const tp = path.getPointAtLength(len * lag);
            c.setAttribute("transform", `translate(${tp.x} ${tp.y})`);
            c.style.opacity = p <= 0.004 ? "0" : "";
          });
          THRESHOLDS.forEach((th, i) => {
            const active = p >= th;
            stations[i]?.setAttribute("data-active", String(active));
            stops[i]?.setAttribute("data-active", String(active));
          });
        };

        const proxy = { p: 0 };
        gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: () => render(proxy.p),
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: 0.75,
            anticipatePin: 1,
          },
        });
        render(0);

        /* On teardown (resize down / reduced-motion flip) restore the elegant
           finished-journey static state the markup ships with. */
        return () => {
          path.style.strokeDasharray = "";
          path.style.strokeDashoffset = "";
          const end = STATION_XY[STATION_XY.length - 1];
          dot.setAttribute("transform", `translate(${end[0]} ${end[1]})`);
          trail.forEach((c) => {
            c.style.opacity = "0";
          });
          stations.forEach((s) => s.setAttribute("data-active", "true"));
          stops.forEach((s) => s.setAttribute("data-active", "true"));
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="visit" className="relative scroll-mt-20 bg-[var(--color-bg)]">
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 md:py-0"
      >
        {/* warm peach aura — the light's room */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-80"
          style={{
            background:
              "radial-gradient(55% 45% at 18% 12%, oklch(93% 0.05 60 / 0.7), transparent 68%), radial-gradient(50% 55% at 88% 88%, var(--color-accent-subtle), transparent 70%)",
          }}
        />

        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <SectionHeading
            align="center"
            eyebrow="Your visit"
            title={
              <>
                From hello,{" "}
                <span className="font-display-em text-[var(--color-accent-deep)]">
                  to glow.
                </span>
              </>
            }
            lead="Four unhurried steps — and one thread of warm light from the first conversation to the mirror. Scroll, and walk it."
          />

          {/* ---- Desktop: the pinned light-path band ---- */}
          <div ref={bandRef} className="mt-4 hidden md:block">
            <svg
              viewBox="0 0 1200 280"
              className="w-full overflow-visible"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="tl-vj-stroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--brass)" />
                  <stop offset="55%" stopColor="var(--color-accent)" />
                  <stop offset="100%" stopColor="var(--brass-deep)" />
                </linearGradient>
                <radialGradient id="tl-vj-glow">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* the guide: a string of tiny bokeh dots (brand texture as path) */}
              <path
                d={PATH_D}
                fill="none"
                stroke="var(--color-hairline)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="0 14"
              />
              {/* the drawn orange thread of light */}
              <path
                ref={drawPathRef}
                d={PATH_D}
                fill="none"
                stroke="url(#tl-vj-stroke)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* station markers — ping + fill as the light arrives */}
              {STATION_XY.map(([x, y], i) => (
                <g
                  key={STOPS[i].title}
                  data-station
                  data-active="true"
                  className="tl-station"
                  transform={`translate(${x} ${y})`}
                >
                  <circle className="tl-station-ping" r="9" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
                  <circle className="tl-station-ring" r="8" fill="var(--color-bg-elevated)" strokeWidth="1.5" />
                  <circle className="tl-station-core" r="3.4" />
                </g>
              ))}

              {/* comet trail (lagging glints) — hidden in the static state */}
              <circle data-trail r="4" fill="var(--color-accent)" opacity="0" className="tl-vj-trail" transform="translate(150 206)" />
              <circle data-trail r="3" fill="var(--brass)" opacity="0" className="tl-vj-trail tl-vj-trail--2" transform="translate(150 206)" />
              <circle data-trail r="2.2" fill="var(--brass-pale)" opacity="0" className="tl-vj-trail tl-vj-trail--3" transform="translate(150 206)" />

              {/* THE traveling light-dot — soft bokeh halo + bright core */}
              <g ref={dotRef} transform="translate(1050 96)">
                <circle r="34" fill="url(#tl-vj-glow)" />
                <circle r="13" fill="var(--brass)" opacity="0.22" />
                <circle r="6.5" fill="var(--color-accent)" />
                <circle r="2.4" fill="oklch(98% 0.02 70)" />
              </g>
            </svg>

            {/* the four step cards, centered under their stations */}
            <ol className="-mt-1 grid list-none grid-cols-4 gap-4 p-0">
              {STOPS.map((s) => (
                <li
                  key={s.title}
                  data-stop
                  data-active="true"
                  className="tl-stop px-2 text-center"
                >
                  <p className="tnum text-[0.68rem] font-semibold tracking-[0.22em] text-[var(--color-accent-deep)]">
                    {s.n}
                  </p>
                  <h3 className="font-display mt-1.5 text-2xl text-[var(--color-fg)]">
                    {s.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-[26ch] text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* ---- Mobile: the same four steps, a calm vertical thread ---- */}
          <ol className="relative mx-auto mt-12 max-w-md list-none space-y-9 p-0 md:hidden">
            {/* dotted vertical guide */}
            <span
              aria-hidden
              className="absolute bottom-3 left-[1.05rem] top-3 w-px"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, var(--color-hairline) 0 3px, transparent 3px 11px)",
              }}
            />
            {STOPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <li className="relative flex gap-5 pl-0">
                  <span
                    aria-hidden
                    className="relative z-[1] mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.66rem] font-semibold tnum text-[var(--color-accent-fg)] shadow-[0_10px_26px_-10px_oklch(60%_0.15_52_/_0.7)]"
                    style={{
                      background:
                        "radial-gradient(130% 130% at 30% 22%, oklch(72% 0.15 58), oklch(58% 0.145 46))",
                    }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-[var(--color-fg)]">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
                      {s.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
