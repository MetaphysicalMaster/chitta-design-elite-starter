"use client";

/**
 * TurnBackTimeScene — the AWWWARDS signature experience for The Luxe MedSpa.
 *
 * The brand voice is "TURN BACK TIME"; the jewel is GOLD. So the showpiece is a
 * refined, slow TEMPORAL motion rendered on a single Canvas-2D layer over warm
 * marble: a drifting field of gold dust + a periodic REVERSE-TIME light sweep
 * (a soft gold foil band that travels RIGHT → LEFT — time running backward) and
 * a faint horologe ring whose hand ticks COUNTER-clockwise. Restraint = luxury:
 * one exquisite moving idea, never glitter-spam.
 *
 * Why Canvas-2D, not WebGL: the brief calls for "a slow gold particle drift or a
 * subtle reverse-time light sweep over warm marble" with restraint — a tasteful
 * temporal motion, not a tech-demo. Canvas-2D nails that look at a fraction of
 * the cost, ships static-export-safe (no env/fetch), and degrades cleanly.
 *
 * Performance / safety:
 *  - dynamic(ssr:false) from LuxeHero; a static CSS marble fallback paints first
 *    so there is never a blank frame or CLS.
 *  - DPR-capped (≤2), particle count scales with viewport, hot path only mutates
 *    canvas (no React state per frame).
 *  - IntersectionObserver + document.visibilitychange PAUSE the RAF when the hero
 *    scrolls offscreen or the tab is hidden (battery / 60fps neighbours).
 *  - prefers-reduced-motion is gated upstream (scene never mounts) AND re-checked
 *    here as a belt-and-braces guard.
 *
 * Scroll sync: an exported setter lets the hero feed a 0..1 scroll progress so
 * the gold drift + reverse sweep ease as you scroll the hero out — Lenis-driven
 * from LuxeHero (which reads the shared SmoothScroll Lenis loop via rAF).
 */

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  /** base drift velocity (px/sec) */
  vx: number;
  vy: number;
  /** twinkle phase */
  ph: number;
  /** twinkle speed */
  ps: number;
  /** 0..1 gold tone mix (deep → champagne) */
  tone: number;
};

export default function TurnBackTimeScene({
  lite = false,
  progressRef,
}: {
  lite?: boolean;
  /** hero feeds scroll progress 0..1 here; we read it each frame. */
  progressRef?: React.MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let last = performance.now();
    let running = true;
    let visible = true;

    /* Gold palette sampled to canonical sRGB so the canvas matches brand.css. */
    const GOLD_DEEP: [number, number, number] = [176, 130, 58]; // burnished
    const GOLD: [number, number, number] = [205, 164, 79]; // core gold
    const GOLD_BRIGHT: [number, number, number] = [236, 213, 150]; // champagne

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

    function build() {
      const area = w * h;
      const density = lite ? 26000 : 15000; // px² per particle
      const count = Math.max(40, Math.min(220, Math.round(area / density)));
      particles = Array.from({ length: count }, () => spawn(true));
    }

    function spawn(anywhere: boolean): Particle {
      const tone = Math.random();
      return {
        x: anywhere ? Math.random() * w : -10,
        y: Math.random() * h,
        r: lerp(0.5, tone > 0.7 ? 2.4 : 1.6, Math.random()) * dpr,
        // gentle warm drift up-and-to-the-right (gold rising)
        vx: lerp(4, 14, Math.random()) * dpr,
        vy: lerp(-10, -3, Math.random()) * dpr,
        ph: Math.random() * Math.PI * 2,
        ps: lerp(0.6, 1.8, Math.random()),
        tone,
      };
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width * dpr));
      h = Math.max(1, Math.round(rect.height * dpr));
      canvas!.width = w;
      canvas!.height = h;
      build();
    }

    let sweepClock = 0; // accumulates time for the reverse-time sweep + horologe

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!running || !visible) {
        last = now;
        return;
      }
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05; // clamp after a tab-resume stall
      sweepClock += dt;

      const progress = progressRef ? Math.min(1, Math.max(0, progressRef.current)) : 0;
      // as the hero scrolls away, settle the motion + fade
      const energy = 1 - progress * 0.85;

      ctx!.clearRect(0, 0, w, h);

      /* ---- 1) Reverse-time light sweep: a soft gold foil band that travels
              RIGHT → LEFT (time running backward) on a slow ~13s cycle. ---- */
      const sweepPeriod = 13;
      const sp = (sweepClock % sweepPeriod) / sweepPeriod; // 0..1
      const sweepX = w * (1 - sp); // moves leftward
      const bandW = w * 0.42;
      const grad = ctx!.createLinearGradient(
        sweepX - bandW,
        0,
        sweepX + bandW,
        0,
      );
      const peak = 0.12 * energy;
      grad.addColorStop(0, "rgba(236,213,150,0)");
      grad.addColorStop(0.5, `rgba(236,213,150,${peak})`);
      grad.addColorStop(1, "rgba(236,213,150,0)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      /* ---- 2) The horologe ring — a faint gold clock whose hand ticks
              COUNTER-clockwise (turning time back). Lower-right, subtle. ---- */
      drawHorologe(ctx!, w, h, dpr, sweepClock, energy, lite);

      /* ---- 3) Gold dust drift ---- */
      ctx!.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.vx * dt * energy;
        p.y += p.vy * dt * energy;
        p.ph += p.ps * dt;

        // recycle when it leaves the field
        if (p.x > w + 12 || p.y < -12) {
          Object.assign(p, spawn(false));
          p.x = -10;
          p.y = Math.random() * h;
        }

        const tw = 0.55 + 0.45 * Math.sin(p.ph); // twinkle 0.1..1
        const [cr, cg, cb] = mix(
          mix(GOLD_DEEP, GOLD, p.tone),
          GOLD_BRIGHT,
          Math.max(0, p.tone - 0.6) / 0.4,
        );
        const a = tw * (0.5 + 0.5 * p.tone) * energy * 0.85;

        // soft glow halo for the brighter motes
        if (p.tone > 0.72) {
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${a * 0.18})`;
          ctx!.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${a})`;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    resize();
    raf = requestAnimationFrame(frame);

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

/* A faint engraved-gold horologe (clock face) whose single hand sweeps
   COUNTER-clockwise — the literal "turn back time" motif, kept whisper-quiet so
   it reads as luxe ornament, never a gimmick. */
function drawHorologe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
  t: number,
  energy: number,
  lite: boolean,
) {
  const cx = w * 0.79;
  const cy = h * 0.62;
  const R = Math.min(w, h) * (lite ? 0.16 : 0.19);
  const baseAlpha = 0.16 * energy;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineCap = "round";

  // outer ring
  ctx.strokeStyle = `rgba(205,164,79,${baseAlpha})`;
  ctx.lineWidth = 1.2 * dpr;
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, Math.PI * 2);
  ctx.stroke();

  // hour ticks
  ctx.strokeStyle = `rgba(205,164,79,${baseAlpha * 0.9})`;
  ctx.lineWidth = 1 * dpr;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r1 = R * 0.88;
    const r2 = i % 3 === 0 ? R * 0.74 : R * 0.8;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
    ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
    ctx.stroke();
  }

  // COUNTER-clockwise hand (negative angle): one revolution per ~24s
  const ang = -((t / 24) % 1) * Math.PI * 2 - Math.PI / 2;
  ctx.strokeStyle = `rgba(236,213,150,${Math.min(0.5, baseAlpha * 2.6)})`;
  ctx.lineWidth = 1.6 * dpr;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(ang) * R * 0.66, Math.sin(ang) * R * 0.66);
  ctx.stroke();

  // a brighter leading mote on the hand tip
  ctx.fillStyle = `rgba(236,213,150,${Math.min(0.6, baseAlpha * 3)})`;
  ctx.beginPath();
  ctx.arc(Math.cos(ang) * R * 0.66, Math.sin(ang) * R * 0.66, 2.2 * dpr, 0, Math.PI * 2);
  ctx.fill();

  // center cap
  ctx.fillStyle = `rgba(205,164,79,${baseAlpha * 1.4})`;
  ctx.beginPath();
  ctx.arc(0, 0, 2.6 * dpr, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
