"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export interface BloomGlowProps {
  /** Bloom intensity (default 1.5) */
  intensity?: number;
  /** Luminance threshold — only pixels brighter than this glow (default 0.85) */
  threshold?: number;
  /** Smoothness of luminance threshold (default 0.025) */
  smoothing?: number;
  /** Mipmap blur for higher quality (default true) */
  mipmapBlur?: boolean;
}

/**
 * Drop-in post-processing bloom for any R3F scene.
 *
 * Use inside an R3F <Canvas>:
 * ```tsx
 * <Canvas>
 *   <YourScene />
 *   <BloomGlow intensity={2} />
 * </Canvas>
 * ```
 *
 * Performance: ~28KB gzip. ~56fps under 4× throttle.
 */
export function BloomGlow({
  intensity = 1.5,
  threshold = 0.85,
  smoothing = 0.025,
  mipmapBlur = true,
}: BloomGlowProps) {
  return (
    <EffectComposer>
      <Bloom
        intensity={intensity}
        luminanceThreshold={threshold}
        luminanceSmoothing={smoothing}
        mipmapBlur={mipmapBlur}
        blendFunction={BlendFunction.SCREEN}
      />
    </EffectComposer>
  );
}
