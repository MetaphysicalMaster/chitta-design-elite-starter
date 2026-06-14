"use client";

/**
 * AuroraVeilScene — the AWWWARDS signature experience for Beyond Skin Aesthetics.
 *
 * The brand voice is "Unveil your inner beauty"; the jewel is dusty MAUVE/PLUM.
 * So the showpiece is "The Unveiling": a warm rose/blush bloom rising low-center
 * over the deep-plum field, with 3–5 tall, soft, blurred vertical "aurora veils"
 * (semi-transparent mauve→rose→blush ribbons) that gently sway + drift sideways
 * with slow parallax — luminous silk curtains / northern lights parting — plus a
 * sparse field of slow-RISING luminous motes (light ascending = the unveiling).
 * The pointer lifts + brightens a soft bloom near the cursor. Restraint = luxury:
 * one elegant light idea, legible and premium, never a muddy flat wash.
 *
 * Why Canvas-2D, not WebGL: this replaces a muddy three.js silk shader the brand
 * couldn't read. Canvas-2D paints clean, layered, blurred gradients far cheaper,
 * removes three.js from this page's bundle (a real perf win), ships static-export
 * safe (no env/fetch), and degrades cleanly to the CSS `.surface-fallback`.
 *
 * Performance / safety:
 *  - dynamic(ssr:false) from SurfaceHero; the static CSS silk fallback paints
 *    first so there is never a blank frame or CLS.
 *  - DPR-capped (lite ≤1.25 / full ≤1.5), veil + mote counts scale with lite,
 *    hot path only mutates canvas (no React state per frame).
 *  - IntersectionObserver + document.visibilitychange PAUSE the RAF when the hero
 *    scrolls offscreen or the tab is hidden (battery / 60fps neighbours).
 *  - prefers-reduced-motion is gated upstream (scene never mounts) AND re-checked
 *    here as a belt-and-braces guard.
 *
 * Scroll sync: an exported progressRef lets the hero feed a 0..1 scroll progress
 * so the veil sway + bloom ease + fade as the hero scrolls out — driven from
 * SurfaceHero's rAF loop (which rides the shared SmoothScroll Lenis scroll).
 */

import { useEffect, useRef } from "react";

type Veil = {
  /** base horizontal center as a fraction of width (0..1) */
  cx: number;
  /** ribbon half-width in px */
  half: number;
  /** sway amplitude in px */
  amp: number;
  /** sway angular speed (rad/sec) */
  sw: number;
  /** sway phase */
  ph: number;
  /** parallax drift speed (px/sec, signed) */
  drift: number;
  /** 0..1 tone mix (mauve → blush) */
  tone: number;
  /** peak alpha for this veil */
  alpha: number;
};

type Mote = {
  x: number;
  y: number;
  r: number;
  /** rising velocity (px/sec, negative = up) */
  vy: number;
  /** gentle horizontal wander speed */
  vx: number;
  /** twinkle phase */
  ph: number;
  /** twinkle speed */
  ps: number;
  /** 0..1 brightness mix (rose → blush) */
  tone: number;
};

export default function AuroraVeilScene({
  lite = false,
  progressRef,
}: {
  lite?: boolean;
  /** hero feeds scroll progress 0..1 here; we read it each frame. */
  progressRef?: React.MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // pointer bloom target (CSS px, relative to canvas) + eased current position
  const pointerRef = useRef<{ x: number; y: number; active: number }>({
    x: 0,
    y: 0,
    active: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // belt-and-braces: never animate under reduced motion
    }

    const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 1.5);
    let w = 0;
    let h = 0;
    let veils: Veil[] = [];
    let motes: Mote[] = [];
    let raf = 0;
    let last = performance.now();
    let running = true;
    let visible = true;

    /* Palette sampled to canonical sRGB so the canvas matches brand.css journey
       stops (--glow-plum / --glow-mauve / --glow-rose / --glow-blush). */
    const PLUM: [number, number, number] = [90, 49, 88]; // deep plum core
    const MAUVE: [number, number, number] = [160, 107, 148]; // dusty mauve
    const ROSE: [number, number, number] = [201, 154, 160]; // warm petal-rose
    const BLUSH: [number, number, number] = [232, 201, 207]; // pale blush sheen

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const mix = (
      c1: [number, number, number],
      c2: [number, number, number],
      t: number,
    ): [number, number, number] => [
      lerp(c1[0], c2[0], t),
      lerp(c1[1], c2[1], t),
      lerp(c1[2], c2[2], t),
    ];
    /** veil tone: mauve→rose→blush across 0..1 */
    const veilColor = (tone: number) =>
      tone < 0.5
        ? mix(MAUVE, ROSE, tone / 0.5)
        : mix(ROSE, BLUSH, (tone - 0.5) / 0.5);

    function buildVeils() {
      // 3 veils on lite, 5 on full — tall luminous curtains spread across width
      const count = lite ? 3 : 5;
      veils = Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count;
        return {
          cx: t,
          half: lerp(0.16, 0.27, Math.random()) * w,
          amp: lerp(0.03, 0.07, Math.random()) * w,
          sw: lerp(0.06, 0.13, Math.random()), // very slow
          ph: Math.random() * Math.PI * 2,
          drift: (Math.random() < 0.5 ? -1 : 1) * lerp(2, 7, Math.random()) * dpr,
          tone: Math.random(),
          alpha: lerp(0.16, 0.3, Math.random()),
        };
      });
    }

    function buildMotes() {
      const area = w * h;
      const density = lite ? 42000 : 26000; // px² per mote (sparse, premium)
      const count = Math.max(18, Math.min(110, Math.round(area / density)));
      motes = Array.from({ length: count }, () => spawnMote(true));
    }

    function spawnMote(anywhere: boolean): Mote {
      const tone = Math.random();
      return {
        x: Math.random() * w,
        // start anywhere on first build, otherwise just below the field
        y: anywhere ? Math.random() * h : h + lerp(4, 40, Math.random()),
        r: lerp(0.6, tone > 0.7 ? 2.2 : 1.5, Math.random()) * dpr,
        vy: -lerp(7, 20, Math.random()) * dpr, // rising
        vx: lerp(-4, 4, Math.random()) * dpr,
        ph: Math.random() * Math.PI * 2,
        ps: lerp(0.5, 1.5, Math.random()),
        tone,
      };
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width * dpr));
      h = Math.max(1, Math.round(rect.height * dpr));
      canvas!.width = w;
      canvas!.height = h;
      // seed pointer at lower-center so the resting bloom sits where the eye lands
      pointerRef.current.x = w * 0.5;
      pointerRef.current.y = h * 0.72;
      buildVeils();
      buildMotes();
    }

    let clock = 0; // accumulates time for sway + drift
    // eased pointer position (canvas px) so the bloom glides, never snaps
    let pcx = 0;
    let pcy = 0;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!running || !visible) {
        last = now;
        return;
      }
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05; // clamp after a tab-resume stall
      clock += dt;

      const progress = progressRef ? Math.min(1, Math.max(0, progressRef.current)) : 0;
      // as the hero scrolls away, settle the motion + fade
      const energy = 1 - progress * 0.85;

      ctx!.clearRect(0, 0, w, h);

      /* ---- 1) The base BLOOM: a warm rose/blush radial glow rising low-center
              on the deep-plum field. This is the anchor light — legible, never a
              flat wash — and it brightens toward the eased pointer. ---- */
      const targetX = pointerRef.current.active
        ? pointerRef.current.x
        : w * 0.5;
      const targetY = pointerRef.current.active
        ? pointerRef.current.y
        : h * 0.72;
      pcx += (targetX - pcx) * Math.min(1, dt * 3.2);
      pcy += (targetY - pcy) * Math.min(1, dt * 3.2);

      const bloomR = Math.min(w, h) * (lite ? 0.78 : 0.9);
      const bloom = ctx!.createRadialGradient(pcx, pcy, 0, pcx, pcy, bloomR);
      const bloomPeak = (0.46 + 0.12 * pointerRef.current.active) * energy;
      bloom.addColorStop(0, `rgba(${BLUSH[0]},${BLUSH[1]},${BLUSH[2]},${bloomPeak})`);
      bloom.addColorStop(
        0.32,
        `rgba(${ROSE[0]},${ROSE[1]},${ROSE[2]},${bloomPeak * 0.62})`,
      );
      bloom.addColorStop(
        0.66,
        `rgba(${MAUVE[0]},${MAUVE[1]},${MAUVE[2]},${bloomPeak * 0.26})`,
      );
      bloom.addColorStop(1, "rgba(90,49,88,0)");
      ctx!.fillStyle = bloom;
      ctx!.fillRect(0, 0, w, h);

      /* ---- 2) The AURORA VEILS: tall, soft, blurred vertical ribbons that sway
              + drift with slow parallax — luminous curtains parting. Each is a
              horizontal gradient (transparent → tone → transparent) over the full
              height, layered with `lighter` so overlaps bloom luminously. ---- */
      ctx!.globalCompositeOperation = "lighter";
      for (const v of veils) {
        const sway = Math.sin(clock * v.sw + v.ph) * v.amp;
        // parallax drift wraps across the width so the curtains never run out
        const driftX = ((v.drift * clock) % w + w) % w;
        let center = v.cx * w + sway + driftX;
        // wrap the center into [-half, w+half] visible band
        center = ((center + v.half) % (w + v.half * 2)) - v.half;

        const [cr, cg, cb] = veilColor(v.tone);
        const a = v.alpha * energy;
        // a touch of vertical taper: brighter low (near the bloom), softer at top
        const grad = ctx!.createLinearGradient(
          center - v.half,
          0,
          center + v.half,
          0,
        );
        grad.addColorStop(0, `rgba(${cr | 0},${cg | 0},${cb | 0},0)`);
        grad.addColorStop(0.5, `rgba(${cr | 0},${cg | 0},${cb | 0},${a})`);
        grad.addColorStop(1, `rgba(${cr | 0},${cg | 0},${cb | 0},0)`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(center - v.half, 0, v.half * 2, h);
      }

      /* ---- 3) Rising luminous motes — the unveiling/ascension. Sparse light
              particles drifting upward with a gentle wander + twinkle. ---- */
      for (const p of motes) {
        p.y += p.vy * dt * energy;
        p.x += p.vx * dt * energy;
        p.ph += p.ps * dt;

        // recycle once it rises off the top
        if (p.y < -12) {
          Object.assign(p, spawnMote(false));
        }

        const tw = 0.5 + 0.5 * Math.sin(p.ph); // twinkle 0..1
        const [cr, cg, cb] = mix(ROSE, BLUSH, p.tone);
        const a = tw * (0.4 + 0.5 * p.tone) * energy * 0.9;

        // soft glow halo for the brighter motes
        if (p.tone > 0.7) {
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${a * 0.16})`;
          ctx!.arc(p.x, p.y, p.r * 3.6, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${a})`;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";

      // ease the pointer "active" influence back to rest when idle
      if (pointerRef.current.active > 0) {
        pointerRef.current.active = Math.max(
          0,
          pointerRef.current.active - dt * 0.5,
        );
      }
    }

    resize();
    raf = requestAnimationFrame(frame);

    /* Pointer lifts + brightens a bloom near the cursor (desktop fine pointers). */
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = canvas!.getBoundingClientRect();
      pointerRef.current.x = (e.clientX - rect.left) * dpr;
      pointerRef.current.y = (e.clientY - rect.top) * dpr;
      pointerRef.current.active = 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* Pause when offscreen (IO) or tab hidden. */
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const onVis = () => {
      running = document.visibilityState === "visible";
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVis);

    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(resize, 160);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, [lite, progressRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
      style={{ display: "block" }}
    />
  );
}
