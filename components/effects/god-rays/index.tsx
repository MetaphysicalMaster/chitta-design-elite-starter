"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface GodRaysProps {
  /** Number of rays (default 6) */
  rayCount?: number;
  /** Ray color (CSS color string) */
  color?: string;
  /** Origin point — "top" | "top-left" | "top-right" | "center" */
  origin?: "top" | "top-left" | "top-right" | "center";
  /** Animate rays (slow drift) */
  animated?: boolean;
  /** Opacity 0-1 (default 0.18) */
  opacity?: number;
  className?: string;
}

/**
 * God Rays — divine atmospheric volumetric light beams.
 *
 * SSR-safe SVG implementation. 0KB JS overhead beyond Framer Motion (already in bundle).
 *
 * For HEAVY 3D god-rays use postprocessing GodRaysFakePass inside R3F Canvas.
 * This SSR variant works for hero backgrounds across all archetypes.
 *
 * Archetype: Innocent (✓✓), Sage (✓✓), Magician (✓✓), Caregiver (✓✓), Lover (✓), Hero (✓), Ruler (✓)
 * Voice: divine, atmospheric, luminous, dramatic
 */
export function GodRays({
  rayCount = 6,
  color = "currentColor",
  origin = "top",
  animated = true,
  opacity = 0.18,
  className,
}: GodRaysProps) {
  const originPoint = {
    top: { x: 50, y: -10 },
    "top-left": { x: 10, y: -10 },
    "top-right": { x: 90, y: -10 },
    center: { x: 50, y: 50 },
  }[origin];

  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = -45 + (i / (rayCount - 1)) * 90;
    const length = 200;
    const x2 = originPoint.x + Math.sin((angle * Math.PI) / 180) * length;
    const y2 = originPoint.y + Math.cos((angle * Math.PI) / 180) * length;
    return { id: i, x1: originPoint.x, y1: originPoint.y, x2, y2, angle };
  });

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="god-rays-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="god-rays-blur">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>
        {rays.map((ray) => (
          <motion.line
            key={ray.id}
            x1={ray.x1}
            y1={ray.y1}
            x2={ray.x2}
            y2={ray.y2}
            stroke="url(#god-rays-gradient)"
            strokeWidth="6"
            filter="url(#god-rays-blur)"
            initial={animated ? { opacity: 0.4 } : undefined}
            animate={
              animated
                ? { opacity: [0.3, 0.7, 0.3] }
                : undefined
            }
            transition={
              animated
                ? {
                    duration: 8 + ray.id * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: ray.id * 0.3,
                  }
                : undefined
            }
          />
        ))}
      </svg>
    </div>
  );
}
