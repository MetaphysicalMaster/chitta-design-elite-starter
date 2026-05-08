/**
 * Effect Library — barrel export
 *
 * Import individual effects directly to enable tree-shaking:
 * ```tsx
 * import { FluidColorMix } from "@/components/effects/fluid-color-mix";
 * ```
 *
 * For metadata queries (advanced-renderer-router skill), use:
 * ```tsx
 * import { effectRegistry, filterByArchetype } from "@/components/effects/registry";
 * ```
 */

export { effectRegistry, filterByArchetype, filterByPerfBudget, filterByVoice, getCompleteEffects } from "./registry";
export type { EffectMeta, Archetype, ArchetypeAlignment, VoiceOfMotionTag, PerfTier, RenderTier, Lifecycle } from "./types";
