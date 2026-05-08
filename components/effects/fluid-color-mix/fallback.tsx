/**
 * CSS-only fallback for FluidColorMix.
 * Used when prefers-reduced-motion OR mobile/low-power conditions.
 *
 * Replicates the multi-color fluid feel via animated conic-gradient + blur.
 * Performance cost: ~0KB JS. Pure CSS @keyframes.
 */

import type { CSSProperties } from "react";

export interface FluidColorMixFallbackProps {
  colors: string[];
  className?: string;
  style?: CSSProperties;
}

export function FluidColorMixFallback({ colors, className, style }: FluidColorMixFallbackProps) {
  // Build conic-gradient from colors
  const gradient = colors
    .map((color, i) => `${color} ${(i / (colors.length - 1)) * 360}deg`)
    .join(", ");

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        background: `conic-gradient(from 0deg at 50% 50%, ${gradient})`,
        filter: "blur(80px) saturate(1.1)",
        animation: "fluid-drift 24s ease-in-out infinite alternate",
        opacity: 0.9,
        ...style,
      }}
    >
      <style>{`
        @keyframes fluid-drift {
          0% {
            transform: scale(1) rotate(0deg);
            filter: blur(80px) saturate(1.1) hue-rotate(0deg);
          }
          50% {
            transform: scale(1.15) rotate(30deg);
            filter: blur(100px) saturate(1.2) hue-rotate(15deg);
          }
          100% {
            transform: scale(1) rotate(60deg);
            filter: blur(80px) saturate(1.1) hue-rotate(0deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-fluid-fallback] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
