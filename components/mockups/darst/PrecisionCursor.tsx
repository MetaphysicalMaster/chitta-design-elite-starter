"use client";

/**
 * PrecisionCursor — the precision-instrument micro-cursor. A small teal
 * crosshair (center dot + four hairline ticks + a fine ring) that EASES after
 * the native pointer like a tracking reticle. Over interactive elements the
 * ring blooms and the ticks rotate 45° — the instrument "locks on"; on press
 * it pulses tighter. The native cursor is NEVER hidden (usability first — the
 * reticle is an accompaniment, not a replacement).
 *
 * Desktop-only by capability (hover + fine pointer), disabled under
 * prefers-reduced-motion, pointer-events: none, aria-hidden. All motion is
 * transform/opacity on gsap.ticker — zero layout work per frame.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "motion/react";

const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor]';

export function PrecisionCursor() {
  const prefersReduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (prefersReduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const root = rootRef.current;
    const reticle = reticleRef.current;
    const ring = ringRef.current;
    if (!root || !reticle || !ring) return;

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let shown = false;
    let hot = 0; // eased 0..1 — over an interactive element
    let hotTarget = 0;
    let press = 0; // eased 0..1 — pointer down
    let pressTarget = 0;

    const setXY = gsap.quickSetter(root, "css") as (v: object) => void;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!shown) {
        // First contact: appear AT the pointer (no fly-in from a corner).
        pos.x = target.x;
        pos.y = target.y;
        shown = true;
        gsap.to(root, { opacity: 1, duration: 0.4, ease: "power2.out" });
      }
      const el = e.target as Element | null;
      hotTarget = el?.closest?.(INTERACTIVE) ? 1 : 0;
    };
    const onDown = () => {
      pressTarget = 1;
    };
    const onUp = () => {
      pressTarget = 0;
    };
    const onLeaveDoc = () => {
      shown = false;
      gsap.to(root, { opacity: 0, duration: 0.3, ease: "power2.out" });
    };

    const tick = (_t: number, dt: number) => {
      const s = dt / 1000;
      // Reticle trails the pointer — a tracking instrument, not a lag bug.
      const k = 1 - Math.pow(0.00045, s);
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      hot += (hotTarget - hot) * Math.min(1, s * 11);
      press += (pressTarget - press) * Math.min(1, s * 14);

      setXY({ x: pos.x, y: pos.y });
      const scale = (1 + hot * 0.85) * (1 - press * 0.18);
      reticle.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${hot * 45}deg)`;
      ring.style.opacity = String(0.15 + hot * 0.75);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
      gsap.ticker.remove(tick);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="dt-cursor" style={{ opacity: 0 }}>
      <div ref={reticleRef} className="dt-cursor__reticle">
        <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
          {/* fine lock-on ring (blooms over interactive elements) */}
          <circle
            ref={ringRef}
            cx="18"
            cy="18"
            r="11"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.15"
          />
          {/* four hairline ticks */}
          <path
            d="M18 1.5v6M18 28.5v6M1.5 18h6M28.5 18h6"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* center dot */}
          <circle cx="18" cy="18" r="2" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
