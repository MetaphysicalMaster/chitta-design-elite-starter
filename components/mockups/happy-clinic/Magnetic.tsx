"use client";

/**
 * Magnetic — a small GSAP wrapper that lets the hero's pale-yellow CTA lean
 * toward the cursor and snap home with an elastic settle on leave. Personality
 * without gimmick: the strength is low (the button "notices" you, it doesn't
 * chase you).
 *
 * Gates: fine pointers only (touch devices simply get the plain button) and
 * prefers-reduced-motion → inert. Transform-only (GPU), no layout writes.
 */

import { gsap } from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  /** 0..1 — how far the element leans toward the cursor. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.45)",
        overwrite: "auto",
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn("inline-flex will-change-transform", className)}>
      {children}
    </div>
  );
}
