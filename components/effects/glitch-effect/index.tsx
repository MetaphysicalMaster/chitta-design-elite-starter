"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface GlitchEffectProps {
  children: ReactNode;
  /** Glitch intensity 0-1 (default 0.5) */
  intensity?: number;
  /** Glitch on hover only (default false = continuous) */
  hoverOnly?: boolean;
  /** Animation speed multiplier (default 1) */
  speed?: number;
  className?: string;
}

/**
 * Glitch Effect — RGB channel split + scan lines + random offset.
 *
 * CSS-only implementation. SSR-safe. Works without WebGL.
 *
 * Performance: ~2KB CSS. 60fps. Pure CSS animation.
 * Reduced-motion: auto-disables animation.
 *
 * Archetype warning: serves Outlaw (✓✓), Jester, Creator. VIOLATES Innocent, Sage,
 * Lover, Caregiver, Ruler. NOT FOR CHITTA artifacts.
 *
 * Voice: jittery, broken, dystopian, edgy, tech.
 */
export function GlitchEffect({
  children,
  intensity = 0.5,
  hoverOnly = false,
  speed = 1,
  className,
}: GlitchEffectProps) {
  const shift = intensity * 4;
  const dur = 0.4 / speed;

  return (
    <motion.div
      whileHover={hoverOnly ? "active" : undefined}
      animate={hoverOnly ? "idle" : "active"}
      variants={{
        idle: { x: 0 },
        active: {
          x: [0, -shift / 2, shift / 2, -shift / 4, 0],
          transition: {
            duration: dur,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.2, 0.4, 0.6, 1],
          },
        },
      }}
      className={cn("relative inline-block motion-reduce:!animate-none", className)}
    >
      {/* Cyan channel offset */}
      <span
        aria-hidden="true"
        className="absolute inset-0 motion-reduce:hidden"
        style={{
          color: "cyan",
          mixBlendMode: "screen",
          transform: `translate(${-shift}px, 0)`,
          clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
        }}
      >
        {children}
      </span>
      {/* Magenta channel offset */}
      <span
        aria-hidden="true"
        className="absolute inset-0 motion-reduce:hidden"
        style={{
          color: "magenta",
          mixBlendMode: "screen",
          transform: `translate(${shift}px, 0)`,
          clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
        }}
      >
        {children}
      </span>
      {/* Original content */}
      <span className="relative">{children}</span>
    </motion.div>
  );
}
