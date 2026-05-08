"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface HolographicFoilProps {
  children: ReactNode;
  /** Foil intensity 0-1 (default 0.6) */
  intensity?: number;
  /** Disable on mobile (default true — uses static gradient fallback) */
  desktopOnly?: boolean;
  className?: string;
}

/**
 * Holographic Foil — iridescent rainbow surface that shifts with cursor angle.
 * Premium card / pricing tier accent.
 *
 * Pure CSS conic-gradient + cursor tracking. SSR-safe.
 * Performance: ~8KB gzip (Framer Motion already in bundle). 60fps.
 *
 * Archetype: Magician (✓✓), Lover (✓✓), Creator (✓✓), Hero, Outlaw, Jester, Ruler.
 * Voice: iridescent, futuristic, premium.
 */
export function HolographicFoil({
  children,
  intensity = 0.6,
  desktopOnly = true,
  className,
}: HolographicFoilProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  const angle = useTransform(sx, [0, 1], [0, 360]);
  const lightX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const lightY = useTransform(sy, [0, 1], ["0%", "100%"]);

  const onMove = (e: React.PointerEvent) => {
    if (!ref.current) return;
    if (desktopOnly && matchMedia("(hover: none)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      className={cn("relative isolate overflow-hidden rounded-2xl", className)}
    >
      {/* Holographic foil layer */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: intensity,
          background: useTransform(
            angle,
            (a) =>
              `conic-gradient(from ${a}deg at 50% 50%, ` +
              `oklch(70% 0.18 0), oklch(70% 0.18 60), oklch(70% 0.18 120), ` +
              `oklch(70% 0.18 180), oklch(70% 0.18 240), oklch(70% 0.18 300), ` +
              `oklch(70% 0.18 360))`,
          ),
          mixBlendMode: "color-dodge",
          filter: "blur(8px) saturate(1.2)",
        }}
      />
      {/* Light highlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: intensity * 0.5,
          background: useTransform(
            [lightX, lightY],
            ([lx, ly]) =>
              `radial-gradient(circle at ${lx} ${ly}, ` +
              `oklch(98% 0.005 240) 0%, transparent 50%)`,
          ),
          mixBlendMode: "screen",
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
