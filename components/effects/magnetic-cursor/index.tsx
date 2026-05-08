"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface MagneticCursorProps {
  /** CSS selector for elements to magnetize toward (default: ".magnetic, [data-magnetic], button, a") */
  magneticSelector?: string;
  /** Pull strength on magnetic targets (0-1, default 0.4) */
  strength?: number;
  /** Cursor diameter in px (default 12) */
  size?: number;
  /** Outer ring diameter when over interactive (default 36) */
  hoverSize?: number;
  /** Disable on touch devices (default true) */
  desktopOnly?: boolean;
  className?: string;
}

/**
 * Premium custom cursor with magnetic pull toward CTAs / interactive elements.
 * Inspired by rauno.me interaction patterns.
 *
 * Performance: ~4KB gzip. 60fps. Pure Framer Motion (no shaders).
 * Mobile: disabled by default (no cursor on touch).
 * Reduced-motion: disabled (no spring physics).
 */
export function MagneticCursor({
  magneticSelector = ".magnetic, [data-magnetic], button, a",
  strength = 0.4,
  size = 12,
  hoverSize = 36,
  desktopOnly = true,
  className,
}: MagneticCursorProps) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28, mass: 0.5 });
  const scaleValue = useMotionValue(1);
  const scaleSpring = useSpring(scaleValue, { stiffness: 400, damping: 25 });
  const isOver = useRef(false);

  useEffect(() => {
    if (desktopOnly && matchMedia("(hover: none)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const magnetic = target?.closest(magneticSelector) as HTMLElement | null;

      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * (1 - strength);
        const dy = (e.clientY - cy) * (1 - strength);
        cursorX.set(cx + dx);
        cursorY.set(cy + dy);
        if (!isOver.current) {
          scaleValue.set(hoverSize / size);
          isOver.current = true;
        }
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        if (isOver.current) {
          scaleValue.set(1);
          isOver.current = false;
        }
      }
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [cursorX, cursorY, scaleValue, magneticSelector, strength, size, hoverSize, desktopOnly]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        scale: scaleSpring,
        width: size,
        height: size,
        translateX: "-50%",
        translateY: "-50%",
      }}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[9999] rounded-full mix-blend-difference",
        "bg-fg",
        className,
      )}
    />
  );
}
