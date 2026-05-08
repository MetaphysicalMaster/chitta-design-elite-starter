"use client";

import { EffectComposer, ChromaticAberration as PostChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export interface ChromaticAberrationProps {
  /** RGB channel offset in viewport units. Default [0.0005, 0.0012] = subtle. */
  offset?: [number, number];
  /** Blend with original (0-1, default 1 = full) */
  blendFunction?: BlendFunction;
  /** Use radial intensity modulation (more aberration at edges) */
  radialModulation?: boolean;
  /** Modulation offset (default 0.5) */
  modulationOffset?: number;
}

/**
 * Chromatic Aberration — RGB channel offset for cinematic edgy feel.
 *
 * Drop inside an R3F <Canvas>:
 * ```tsx
 * <Canvas>
 *   <YourScene />
 *   <ChromaticAberration offset={[0.001, 0.002]} />
 * </Canvas>
 * ```
 *
 * Performance: ~6KB gzip. 60fps. Single post-processing pass.
 *
 * Archetype warning: serves Outlaw / Magician / Hero / Creator. VIOLATES Innocent / Caregiver.
 * Voice: edgy, tech, glitchy, cinematic. Avoid for restraint-tier brands.
 */
export function ChromaticAberration({
  offset = [0.0005, 0.0012],
  blendFunction = BlendFunction.NORMAL,
  radialModulation = false,
  modulationOffset = 0.5,
}: ChromaticAberrationProps) {
  return (
    <EffectComposer>
      <PostChromaticAberration
        offset={new THREE.Vector2(...offset)}
        blendFunction={blendFunction}
        radialModulation={radialModulation}
        modulationOffset={modulationOffset}
      />
    </EffectComposer>
  );
}
