"use client";

/**
 * PinkThread — THE signature experience.
 *
 * One continuous hot-magenta thread literally sews the page together: it spills
 * from Sousan's script signature in the hero, crests and wraps the founder
 * portrait, underlines the statement word of every section heading, threads
 * vertically through the wall-of-proof medallions, fuses with the evolution
 * timeline's pink rail, passes through the before/after divider, and finally
 * ties a knot around the booking CTA — the whole monochrome page held on one
 * living pink line.
 *
 * How it works:
 *  - Section components mark anchors with `data-thread="start|frame|underline|
 *    rail|pass|passv|knot"`. On mount (and on resize / font-load / layout
 *    change) we measure each anchor via the offsetParent chain (LAYOUT
 *    positions — immune to the entrance-reveal transforms that pollute
 *    getBoundingClientRect) and build one smooth Catmull-Rom path through the
 *    generated points, inserting alternating left/right "weave" sways across
 *    long vertical gaps.
 *  - The path is drawn with the classic stroke-dashoffset technique, scrubbed
 *    by a single ScrollTrigger (synced to Lenis in SmoothScroll). The mapping
 *    scroll → arc-length is piecewise-linear through the anchor checkpoints, so
 *    the thread's tip arrives at each anchor EXACTLY as it crosses the
 *    viewport's focal line — underlines underline on cue, the knot ties as you
 *    reach the button.
 *  - Color-pop moments: elements marked `data-pop` get `.is-popped` as they
 *    cross the viewport (portrait filet blooms, medallion rings glow, the
 *    "after" plate develops from greyscale to pink — a literal saturate sweep).
 *    Hairlines marked `data-rule` draw in with a transform-only scaleX.
 *
 * Craft constraints honored: stroke-dashoffset + transforms only (no layout
 * thrash), one path element, sampling done once per build, pointer-events:none,
 * aria-hidden. prefers-reduced-motion: the thread renders fully drawn & quiet
 * (no scrub, no tip), pops apply instantly — elegant static, never broken.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Pt = { x: number; y: number; cp: boolean };

/** Document-space LAYOUT rect via the offsetParent chain — ignores transforms,
    so anchors measured mid-entrance-reveal still land where the element rests. */
function layoutRect(el: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { left: x, top: y, width: el.offsetWidth, height: el.offsetHeight };
}

/** Generate the thread's control points for one anchor element. */
function pointsFor(el: HTMLElement, type: string, W: number): Pt[] {
  const r = layoutRect(el);
  const right = r.left + r.width;
  const bottom = r.top + r.height;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const mobile = W < 768;

  switch (type) {
    // The signature tail — the thread spills out from under "Sousan".
    case "start":
      return [
        { x: r.left + r.width * 0.08, y: bottom + 6, cp: true },
        { x: right + (mobile ? 14 : 30), y: bottom - r.height * 0.2, cp: true },
      ];

    // Crest and wrap the founder portrait (skipped on mobile — the single
    // column stacks the portrait above the signature; looping back up there
    // would read as scribble, so the thread passes politely on).
    case "frame": {
      if (mobile) return [];
      return [
        { x: r.left + r.width * 0.3, y: r.top - 18, cp: true },
        { x: right + 22, y: r.top + r.height * 0.32, cp: true },
        { x: right - r.width * 0.16, y: bottom + 20, cp: true },
        { x: r.left + r.width * 0.06, y: bottom + 36, cp: true },
      ];
    }

    // Underline a statement word — a shallow hand-drawn swash beneath it.
    case "underline":
      return [
        { x: r.left - 8, y: bottom + 6, cp: true },
        { x: cx, y: bottom + 11, cp: false },
        { x: right + 8, y: bottom + 4, cp: true },
      ];

    // Fuse with the evolution timeline's pink rail — the thread BECOMES it.
    case "rail":
      return [
        { x: r.left + 1, y: r.top + 4, cp: true },
        { x: r.left + 1, y: cy, cp: false },
        { x: r.left + 1, y: bottom - 4, cp: true },
      ];

    // Pass through a point (e.g. the before/after divider handle).
    case "pass":
      return [{ x: cx, y: cy, cp: true }];

    // Vertical pass — thread the needle down a grid's central seam (between
    // the proof medallions / between the service-card columns). Skipped when
    // the grid collapses to one column (no seam to sew).
    case "passv": {
      if (W < 640) return [];
      return [
        { x: cx, y: r.top + r.height * 0.14, cp: true },
        { x: cx, y: r.top + r.height * 0.5, cp: false },
        { x: cx, y: r.top + r.height * 0.86, cp: true },
      ];
    }

    // Tie off around the booking CTA — over the top, around the right, under,
    // and rest the tip against its left edge. The knot that ends the page.
    case "knot": {
      const reach = mobile ? 12 : 22;
      return [
        { x: cx - r.width * 0.34, y: r.top - 14, cp: true },
        { x: right + reach, y: cy, cp: true },
        { x: cx + r.width * 0.06, y: bottom + 16, cp: true },
        { x: r.left - reach, y: cy + 2, cp: true },
        { x: r.left - 4, y: cy, cp: true },
      ];
    }

    default:
      return [{ x: cx, y: cy, cp: true }];
  }
}

/** Insert alternating left/right sway points across long vertical gaps so the
    thread WEAVES down the page instead of falling straight. */
function withDrift(pts: Pt[], W: number, vh: number): Pt[] {
  const out: Pt[] = [];
  let side = 1;
  const amp = Math.min(W * 0.28, 280);
  const step = Math.max(vh * 0.66, 420);
  for (const cur of pts) {
    if (out.length) {
      const prev = out[out.length - 1];
      const gap = cur.y - prev.y;
      if (gap > step * 1.5) {
        const n = Math.min(3, Math.floor(gap / step));
        for (let j = 1; j <= n; j++) {
          const t = j / (n + 1);
          const baseX = prev.x + (cur.x - prev.x) * t;
          const x = Math.min(
            W * 0.92,
            Math.max(W * 0.08, baseX + side * amp),
          );
          out.push({ x, y: prev.y + gap * t, cp: true });
          side *= -1;
        }
      }
    }
    out.push(cur);
  }
  return out;
}

/** Catmull-Rom → cubic Bézier — one smooth continuous stroke through points. */
function catmullRomPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function PinkThread() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const tip = tipRef.current;
    const glow = glowRef.current;
    if (!wrap || !svg || !path || !tip || !glow) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = (wrap.parentElement ?? document.body) as HTMLElement;

    let totalLen = 0;
    let mapY: number[] = [];
    let mapL: number[] = [];
    let lastH = 0;
    let buildT = 0;
    let debounceT = 0;

    /** Piecewise-linear focal-Y → arc-length through anchor checkpoints. */
    function lerpMap(focalY: number): number {
      const n = mapY.length;
      if (n < 2) return 0;
      if (focalY <= mapY[0]) return 0;
      if (focalY >= mapY[n - 1]) return totalLen;
      let lo = 0;
      let hi = n - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (mapY[mid] <= focalY) lo = mid;
        else hi = mid;
      }
      const span = mapY[hi] - mapY[lo] || 1;
      const t = (focalY - mapY[lo]) / span;
      return mapL[lo] + (mapL[hi] - mapL[lo]) * t;
    }

    function update(scrollY: number) {
      if (!totalLen || !path || !tip || !glow) return;
      const focal = scrollY + window.innerHeight * 0.62;
      const L = Math.max(0, Math.min(totalLen, lerpMap(focal)));
      path.style.strokeDashoffset = String(totalLen - L);

      if (L > 2 && L < totalLen - 1) {
        const p = path.getPointAtLength(L);
        tip.setAttribute("cx", p.x.toFixed(1));
        tip.setAttribute("cy", p.y.toFixed(1));
        glow.setAttribute("cx", p.x.toFixed(1));
        glow.setAttribute("cy", p.y.toFixed(1));
        tip.style.display = "";
        glow.style.display = "";
      } else {
        tip.style.display = "none";
        glow.style.display = "none";
      }

      // The thread completes → the knot "ties" into the booking button.
      if (L >= totalLen - 3) {
        root
          .querySelector<HTMLElement>('[data-thread="knot"]')
          ?.classList.add("sn-tied");
      }
    }

    function build() {
      if (!svg || !path) return;
      const W = root.clientWidth;
      const H = root.clientHeight;
      if (!W || !H) return;

      const anchors = Array.from(
        root.querySelectorAll<HTMLElement>("[data-thread]"),
      );
      if (anchors.length < 2) return;

      let pts: Pt[] = [];
      for (const el of anchors) {
        pts = pts.concat(pointsFor(el, el.dataset.thread || "pass", W));
      }
      pts = withDrift(pts, W, window.innerHeight);
      if (pts.length < 2) return;

      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      path.setAttribute("d", catmullRomPath(pts));
      totalLen = path.getTotalLength();
      path.style.strokeDasharray = `${totalLen} ${totalLen}`;

      // One-time dense sampling → map each checkpoint to its arc length.
      const SAMPLES = Math.min(
        1500,
        Math.max(400, Math.round(totalLen / 16)),
      );
      const sx: number[] = [];
      const sy: number[] = [];
      const sl: number[] = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const l = (totalLen * i) / SAMPLES;
        const p = path.getPointAtLength(l);
        sx.push(p.x);
        sy.push(p.y);
        sl.push(l);
      }
      mapY = [];
      mapL = [];
      let cursor = 0;
      for (const pt of pts) {
        if (!pt.cp) continue;
        let best = cursor;
        let bestD = Infinity;
        for (let i = cursor; i <= SAMPLES; i++) {
          const dx = sx[i] - pt.x;
          const dy = sy[i] - pt.y;
          const d = dx * dx + dy * dy;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        cursor = best; // checkpoints only ever move forward along the path
        const y = mapY.length
          ? Math.max(mapY[mapY.length - 1] + 2, pt.y)
          : pt.y;
        const l = mapL.length
          ? Math.max(mapL[mapL.length - 1] + 1, sl[best])
          : sl[best];
        mapY.push(y);
        mapL.push(l);
      }
      // Lead-in before the signature, lead-out past the knot.
      mapY.unshift(mapY[0] - 260);
      mapL.unshift(0);
      mapY.push(mapY[mapY.length - 1] + 240);
      mapL.push(totalLen);

      lastH = H;
      path.style.opacity = ""; // reveal once geometry is real

      if (reduced) {
        // Elegant static: the full thread, quiet, no tip, no scrub.
        path.style.strokeDashoffset = "0";
        if (tip) tip.style.display = "none";
        if (glow) glow.style.display = "none";
      } else {
        update(window.scrollY);
      }
    }

    // setTimeout, NOT requestAnimationFrame: rAF never fires in hidden /
    // background tabs, which would leave the thread unbuilt until the user
    // focused the tab. A 0ms timeout still batches same-tick callers and
    // fires regardless of visibility, so the thread is ready before first
    // paint of a foregrounded tab.
    function schedule() {
      window.clearTimeout(buildT);
      buildT = window.setTimeout(() => {
        build();
        ScrollTrigger.refresh();
      }, 0);
    }
    function scheduleDebounced() {
      window.clearTimeout(debounceT);
      debounceT = window.setTimeout(schedule, 180);
    }

    const ctx = gsap.context(() => {
      if (!reduced) {
        // The scrub — one trigger across the whole document.
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => update(self.scroll()),
        });
      }

      // Color-pop moments: pink blooms as elements cross the focal band.
      root.querySelectorAll<HTMLElement>("[data-pop]").forEach((el) => {
        if (reduced) {
          el.classList.add("is-popped");
          return;
        }
        ScrollTrigger.create({
          trigger: el,
          start: "top 72%",
          once: true,
          onEnter: () => el.classList.add("is-popped"),
        });
      });

      // Hairline rules draw themselves in (transform-only).
      root.querySelectorAll<HTMLElement>("[data-rule]").forEach((el) => {
        if (reduced) return;
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          },
        );
      });
    });

    schedule();
    // Re-measure after webfonts settle and after full load (images, etc.).
    document.fonts?.ready.then(() => schedule()).catch(() => {});
    window.addEventListener("load", schedule);
    window.addEventListener("resize", scheduleDebounced);

    // The booking card swaps form ⇄ confirmation; heights move. Rebuild.
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (Math.abs(root.clientHeight - lastH) > 2) scheduleDebounced();
          })
        : undefined;
    ro?.observe(root);

    return () => {
      ctx.revert();
      ro?.disconnect();
      window.removeEventListener("load", schedule);
      window.removeEventListener("resize", scheduleDebounced);
      window.clearTimeout(buildT);
      window.clearTimeout(debounceT);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="sn-thread">
      <svg ref={svgRef} preserveAspectRatio="none">
        <path ref={pathRef} style={{ opacity: 0 }} />
        <circle
          ref={glowRef}
          className="sn-thread__glow"
          r="9"
          style={{ display: "none" }}
        />
        <circle
          ref={tipRef}
          className="sn-thread__tip"
          r="3.2"
          style={{ display: "none" }}
        />
      </svg>
    </div>
  );
}
