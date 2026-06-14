"use client";

/**
 * TreeScene — the AWWWARDS SIGNATURE EXPERIENCE.
 *
 * The brand IS a tree (the logo). "Encore" = renewal, a second act, growth. So
 * the hero is that tree, DRAWING ITSELF: a single trunk grows and forks into a
 * branch family (each branch a tapered ink stroke revealed via
 * stroke-dashoffset), then the canopy LEAVES bud and unfurl in a staggered
 * cascade, each leaf catching the brand teal light. As the reader scrolls the
 * branches finish drawing (a ScrollTrigger scrub), and the leaves drift on the
 * reader's own scroll velocity — a breeze through the canopy.
 *
 * WHY this is the showpiece, not decoration:
 *  - it is unique + brand-rooted (no generic particle field — it's the logo,
 *    alive), it earns the "encore / renewal" idea, and it carries restraint +
 *    medical authority (a single teal precision line of branches on white).
 *
 * CRAFT / PERF:
 *  - pure inline SVG → static-export safe (no WebGL, no fetch, no Node);
 *  - motion is GSAP on transform/opacity + stroke-dashoffset ONLY (composited,
 *    60fps); the per-frame leaf-breeze is one rAF reading the windBus;
 *  - FAIL-SAFE: SSR ships the tree FULLY DRAWN + leaves present. The hidden
 *    "undrawn" state is applied by JS only once motion is confirmed, so no-JS,
 *    reduced-motion and any GSAP failure all land on the finished tree (zero
 *    CLS, no blank frame);
 *  - paused via the `paused` prop (the hero's IntersectionObserver / tab gate);
 *  - decorative (aria-hidden) — the hero copy carries all accessible meaning.
 */

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { windBus } from "./wind";

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------------------
 * Procedural tree generation (deterministic — identical SSR + client, so
 * hydration matches and the static export is stable). An L-system-ish recursive
 * branch builder produces a natural, asymmetric canopy; leaves are seeded at
 * the branch tips + along the upper twigs.
 * -------------------------------------------------------------------------- */

type Branch = { d: string; w: number; len: number; depth: number };
type Leaf = { x: number; y: number; r: number; rot: number; tone: number; delay: number };

function buildTree() {
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];

  // a small seeded RNG so the tree is identical every render (SSR === client)
  let seed = 20100; // founded 2010 — a quiet nod
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const ROOT_X = 250;
  const ROOT_Y = 478;

  // recursive grow: each branch spawns 2 children with angle spread + length
  // decay, until it gets thin enough to leaf out.
  function grow(
    x: number,
    y: number,
    angle: number, // radians, -PI/2 = straight up
    len: number,
    width: number,
    depth: number,
  ) {
    const ex = x + Math.cos(angle) * len;
    const ey = y + Math.sin(angle) * len;

    // gently curved branch via a quadratic control point biased along the
    // direction with a little sway — reads as organic bark, not a stick.
    const midx = x + Math.cos(angle) * len * 0.5 + (rand() - 0.5) * len * 0.18;
    const midy = y + Math.sin(angle) * len * 0.5 - len * 0.06;
    branches.push({
      d: `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${midx.toFixed(1)} ${midy.toFixed(
        1,
      )} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      w: width,
      len,
      depth,
    });

    // Leaf out generously across the UPPER canopy (depth ≥ 3), not just at the
    // terminal tips — this is what makes the crown read as lush + "leafing"
    // rather than wintry/bare. A fuller, larger cluster the higher we are.
    if (depth >= 3) {
      const cluster = depth >= 5 || len < 26 ? 3 + Math.floor(rand() * 3) : 1 + Math.floor(rand() * 2);
      for (let i = 0; i < cluster; i++) {
        leaves.push({
          x: ex + (rand() - 0.5) * 26,
          y: ey + (rand() - 0.5) * 26,
          r: 8 + rand() * 7,
          rot: rand() * 360,
          tone: rand(),
          delay: depth * 0.05 + rand() * 0.3,
        });
      }
    }

    if (depth >= 5 || len < 26) {
      return; // terminal tip — already leafed above
    }

    // spread: two children, occasionally a third middle shoot up high
    const spread = 0.42 + rand() * 0.34;
    const decay = 0.7 + rand() * 0.1;
    grow(ex, ey, angle - spread, len * decay, width * 0.72, depth + 1);
    grow(ex, ey, angle + spread * (0.7 + rand() * 0.5), len * decay, width * 0.72, depth + 1);
    if (depth < 2 && rand() > 0.5) {
      grow(ex, ey, angle + (rand() - 0.5) * 0.3, len * decay * 0.9, width * 0.6, depth + 1);
    }
  }

  // trunk first (a slightly leaning, tapering stem), then the canopy. A longer
  // first segment + taller scale so the whole tree fills the viewBox height
  // (trunk near the base, canopy reaching toward the top — never clipped).
  grow(ROOT_X, ROOT_Y, -Math.PI / 2 - 0.04, 120, 13, 0);

  // sort branches trunk→tip so the draw cascades outward from the trunk
  branches.sort((a, b) => a.depth - b.depth);

  return { branches, leaves, rootX: ROOT_X, rootY: ROOT_Y };
}

const LEAF_TONES = [
  "var(--leaf)",
  "var(--leaf-bright)",
  "var(--clinical)",
  "var(--leaf-deep)",
] as const;

export function TreeScene({ paused = false }: { paused?: boolean }) {
  const prefersReduced = useReducedMotion();
  const rootRef = useRef<SVGSVGElement>(null);
  const canopyRef = useRef<SVGGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const rafRef = useRef(0);

  const { branches, leaves } = useMemo(() => buildTree(), []);

  /* The DRAW + LEAF-OUT timeline. Built once; SSR ships fully drawn, JS hides
     then reveals so any failure lands on the finished tree. */
  useEffect(() => {
    if (prefersReduced) return;
    const svg = rootRef.current;
    if (!svg) return;

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>("[data-branch]", svg);
      const leafEls = gsap.utils.toArray<SVGGElement>("[data-leaf]", svg);

      // Prepare the undrawn state (only now that JS + motion are confirmed).
      paths.forEach((p) => {
        const L = p.getTotalLength();
        gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
      });
      gsap.set(leafEls, { scale: 0, opacity: 0, transformOrigin: "0px 0px" });

      // Intro: the trunk + branches draw outward, then leaves cascade open.
      const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
      intro.to(paths, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power1.inOut",
        stagger: { each: 0.012, from: "start" },
      });
      intro.to(
        leafEls,
        {
          scale: 1,
          opacity: 1,
          duration: 0.62,
          ease: "back.out(1.7)",
          stagger: { each: 0.01, from: "center" },
        },
        "-=0.7",
      );

      tlRef.current = intro;

      // Scroll affinity: as the reader descends the hero, the canopy lifts +
      // parallaxes a touch and the whole tree settles (a calm "rooted" feel).
      // Scrub-linked to the hero scroll, transform-only → 60fps.
      if (canopyRef.current) {
        gsap.to(canopyRef.current, {
          yPercent: -6,
          scale: 1.015,
          transformOrigin: "50% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: svg,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, svg);

    return () => ctx.revert();
  }, [prefersReduced]);

  // Pause/resume the intro + ScrollTriggers with the hero's visibility gate.
  useEffect(() => {
    const tl = tlRef.current;
    if (tl) {
      if (paused) tl.pause();
      else tl.play();
    }
  }, [paused]);

  /* The LEAF-BREEZE: each frame, ease the reader's scroll velocity into a gust
     and sway the canopy group + individual leaves. transform-only, one rAF,
     paused when offscreen. The raw velocity decays so the canopy always
     settles back to stillness when the reader pauses. */
  useEffect(() => {
    if (prefersReduced) return;
    const canopy = canopyRef.current;
    if (!canopy) return;

    const leafEls = canopy.querySelectorAll<SVGGElement>("[data-flutter]");
    let gust = 0;
    let sway = 0;
    let last = performance.now();

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (paused) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const v = windBus.velocity;
      const gustTarget = Math.min(1, Math.abs(v) / 40);
      // attack fast, release slow (real wind)
      const gk = gustTarget > gust ? Math.min(1, dt * 8) : Math.min(1, dt * 1.4);
      gust += (gustTarget - gust) * gk;
      windBus.gust = gust;

      const swayTarget = Math.max(-1, Math.min(1, v / 60));
      sway += (swayTarget - sway) * Math.min(1, dt * 5);
      windBus.velocity *= Math.exp(-dt * 3.2);

      const t = now / 1000;
      // whole-canopy lean — like a tree bending in a breeze
      const lean = Math.sin(t * 0.6) * (0.4 + gust * 1.6) - sway * 1.4;
      canopy.style.transform = `rotate(${lean.toFixed(3)}deg)`;
      canopy.style.transformOrigin = "250px 470px";

      // per-leaf flutter — staggered phase, amplitude scaled by the gust
      leafEls.forEach((el, i) => {
        const ph = i * 0.7;
        const fx = Math.sin(t * 1.3 + ph) * (1 + gust * 4);
        const fy = Math.cos(t * 1.05 + ph * 1.3) * (0.6 + gust * 2.4);
        const rot = Math.sin(t * 1.6 + ph) * (3 + gust * 10);
        el.style.transform = `translate(${fx.toFixed(2)}px, ${fy.toFixed(
          2,
        )}px) rotate(${rot.toFixed(2)}deg)`;
      });
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [prefersReduced, paused]);

  return (
    <svg
      ref={rootRef}
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 500 500"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        {/* a soft teal glow the canopy sits in — the "renewal light" */}
        <radialGradient id="en-tree-glow" cx="50%" cy="34%" r="46%">
          <stop offset="0%" stopColor="var(--clinical-bright)" stopOpacity="0.22" />
          <stop offset="60%" stopColor="var(--clinical)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--clinical)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="en-bark" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--bark)" />
          <stop offset="100%" stopColor="var(--clinical-deep)" />
        </linearGradient>
        {/* a single ground line the trunk rises from */}
        <linearGradient id="en-ground" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--clinical)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-border)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* canopy glow */}
      <ellipse cx="250" cy="200" rx="210" ry="190" fill="url(#en-tree-glow)" />

      {/* the single teal precision ground-line — restraint + authority */}
      <line x1="70" y1="470" x2="430" y2="470" stroke="url(#en-ground)" strokeWidth="1.5" />

      <g ref={canopyRef} style={{ willChange: "transform" }}>
        {/* branches — tapered ink strokes; drawn outward from the trunk */}
        <g>
          {branches.map((b, i) => (
            <path
              key={i}
              data-branch
              d={b.d}
              stroke="url(#en-bark)"
              strokeWidth={Math.max(1, b.w)}
              strokeLinecap="round"
              fill="none"
              opacity={0.92}
            />
          ))}
        </g>

        {/* leaves — soft teardrops catching the teal light.
            THREE nested groups so transforms never collide:
              · outer  = static POSITION (attribute only, never touched by JS),
              · [data-leaf]   = GSAP scale/opacity target (the bud → unfurl),
              · [data-flutter]= the rAF leaf-breeze target (small translate/rot).
            (A CSS style.transform overrides the positioning ATTRIBUTE, so the
            position must live on a separate, untouched wrapper.) */}
        <g>
          {leaves.map((lf, i) => (
            <g key={i} transform={`translate(${lf.x.toFixed(1)} ${lf.y.toFixed(1)})`}>
              <g data-leaf style={{ willChange: "transform" }}>
                <g data-flutter style={{ willChange: "transform" }}>
                  <g transform={`rotate(${lf.rot.toFixed(0)})`}>
                    {(() => {
                  const r = lf.r;
                  const d = `M0 ${(-r).toFixed(1)} C ${(r * 0.82).toFixed(1)} ${(
                    -r * 0.4
                  ).toFixed(1)}, ${(r * 0.82).toFixed(1)} ${(r * 0.7).toFixed(
                    1,
                  )}, 0 ${r.toFixed(1)} C ${(-r * 0.82).toFixed(1)} ${(r * 0.7).toFixed(
                    1,
                  )}, ${(-r * 0.82).toFixed(1)} ${(-r * 0.4).toFixed(1)}, 0 ${(-r).toFixed(
                    1,
                  )} Z`;
                  return (
                    <>
                      <path
                        d={d}
                        fill={LEAF_TONES[Math.floor(lf.tone * LEAF_TONES.length)]}
                        opacity={0.96}
                      />
                      {/* teal catch-light on the upper side of the leaf */}
                      <path
                        d={`M0 ${(-r).toFixed(1)} C ${(r * 0.82).toFixed(1)} ${(
                          -r * 0.4
                        ).toFixed(1)}, ${(r * 0.5).toFixed(1)} ${(r * 0.1).toFixed(
                          1,
                        )}, 0 0 Z`}
                        fill="var(--clinical-bright)"
                        opacity={0.45}
                      />
                      {/* central vein — fine ink line for craft */}
                      <line
                        x1="0"
                        y1={(-r * 0.82).toFixed(1)}
                        x2="0"
                        y2={(r * 0.82).toFixed(1)}
                        stroke="var(--leaf-deep)"
                        strokeWidth="0.7"
                        opacity="0.55"
                      />
                    </>
                  );
                    })()}
                  </g>
                </g>
              </g>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

export default TreeScene;
