/**
 * Effect Library Registry
 *
 * Central manifest of all effects. advanced-renderer-router skill queries this
 * to pick effects by archetype / perf budget / voice-of-motion match.
 *
 * To add a new effect:
 * 1. Create components/effects/<name>/ folder with index.tsx + meta.ts + README.md
 * 2. Import + register here
 * 3. Update components/effects/index.ts barrel export
 */

import type { EffectMeta } from "./types";

import { meta as fluidColorMixMeta } from "./fluid-color-mix/meta";
import { meta as particleFieldMeta } from "./particle-field/meta";
import { meta as bloomGlowMeta } from "./bloom-glow/meta";
import { meta as auroraGradientMeta } from "./aurora-gradient/meta";
import { meta as smokeVolumetricMeta } from "./smoke-volumetric/meta";
import { meta as chromaticAberrationMeta } from "./chromatic-aberration/meta";
import { meta as liquidCursorMeta } from "./liquid-cursor/meta";
import { meta as holographicFoilMeta } from "./holographic-foil/meta";
import { meta as displacementNoiseMeta } from "./displacement-noise/meta";
import { meta as refractionGlassMeta } from "./refraction-glass/meta";
import { meta as magneticCursorMeta } from "./magnetic-cursor/meta";
import { meta as dustParticlesMeta } from "./dust-particles/meta";
import { meta as godRaysMeta } from "./god-rays/meta";
import { meta as voronoiPatternMeta } from "./voronoi-pattern/meta";
import { meta as glitchEffectMeta } from "./glitch-effect/meta";
import { meta as restraintTierMeta } from "./restraint-tier/meta";

export const effectRegistry: Record<string, EffectMeta> = {
  "fluid-color-mix": fluidColorMixMeta,
  "particle-field": particleFieldMeta,
  "bloom-glow": bloomGlowMeta,
  "aurora-gradient": auroraGradientMeta,
  "smoke-volumetric": smokeVolumetricMeta,
  "chromatic-aberration": chromaticAberrationMeta,
  "liquid-cursor": liquidCursorMeta,
  "holographic-foil": holographicFoilMeta,
  "displacement-noise": displacementNoiseMeta,
  "refraction-glass": refractionGlassMeta,
  "magnetic-cursor": magneticCursorMeta,
  "dust-particles": dustParticlesMeta,
  "god-rays": godRaysMeta,
  "voronoi-pattern": voronoiPatternMeta,
  "glitch-effect": glitchEffectMeta,
  "restraint-tier": restraintTierMeta,
};

/** Filter effects by performance budget */
export function filterByPerfBudget(maxKb: number) {
  return Object.values(effectRegistry).filter(e => e.bundle_kb_gzip <= maxKb);
}

/** Filter effects by archetype alignment */
export function filterByArchetype(
  archetype: keyof EffectMeta["archetypes"],
  minAlignment: "serves-strongly" | "serves" | "neutral" = "serves",
) {
  const order: Record<string, number> = {
    "violates": 0,
    "neutral": 1,
    "serves": 2,
    "serves-strongly": 3,
  };
  const min = order[minAlignment];
  return Object.values(effectRegistry).filter(
    e => order[e.archetypes[archetype]] >= min,
  );
}

/** Filter effects by voice-of-motion tags (any match) */
export function filterByVoice(tags: string[]) {
  return Object.values(effectRegistry).filter(e =>
    e.voice_tags.some(t => tags.includes(t)),
  );
}

/** Get only complete (non-stub) effects */
export function getCompleteEffects() {
  return Object.values(effectRegistry).filter(e => e.status === "complete");
}
