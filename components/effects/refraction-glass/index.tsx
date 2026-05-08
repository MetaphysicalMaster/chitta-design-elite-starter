import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RefractionGlassProps {
  children: ReactNode;
  /** Blur amount in px (default 20) */
  blur?: number;
  /** Saturation boost (default 1.4) */
  saturation?: number;
  /** Border radius (default 16px / Tailwind rounded-2xl) */
  radius?: string;
  /** Tint color (default subtle white wash) */
  tint?: string;
  /** Opacity of glass surface (default 0.3) */
  opacity?: number;
  className?: string;
}

/**
 * Refraction Glass — frosted-glass / liquid-glass effect.
 *
 * Pure CSS backdrop-filter. SSR-safe. Universal browser support.
 * Performance: ~0KB JS. 60fps. Hardware-accelerated.
 *
 * Archetype: Lover (✓✓), Ruler (✓✓), Innocent, Sage, Caregiver, Magician, Creator.
 * Voice: premium, polished, atmospheric, layered.
 *
 * Usage:
 * ```tsx
 * <div className="relative h-screen bg-[url(/hero.jpg)] bg-cover">
 *   <RefractionGlass className="absolute inset-x-0 bottom-0 p-12">
 *     <h1>Through the glass</h1>
 *   </RefractionGlass>
 * </div>
 * ```
 */
export function RefractionGlass({
  children,
  blur = 20,
  saturation = 1.4,
  radius = "1rem",
  tint = "oklch(98% 0.005 240 / 0.1)",
  opacity = 0.3,
  className,
}: RefractionGlassProps) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundColor: tint,
        backdropFilter: `blur(${blur}px) saturate(${saturation})`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation})`,
        borderRadius: radius,
        boxShadow:
          "inset 0 1px 0 0 oklch(100% 0 0 / 0.2), inset 0 -1px 0 0 oklch(0% 0 0 / 0.1)",
      }}
    >
      {/* Inner refraction glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top left, oklch(100% 0 0 / 0.15) 0%, transparent 50%)",
          opacity,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
