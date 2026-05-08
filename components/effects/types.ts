/**
 * Effect Library — shared types
 *
 * Every effect in components/effects/<name>/ implements this contract.
 * Used by registry.ts to enable advanced-renderer-router skill to query.
 */

export type Archetype =
  | "Innocent"
  | "Sage"
  | "Explorer"
  | "Outlaw"
  | "Magician"
  | "Hero"
  | "Lover"
  | "Jester"
  | "Everyman"
  | "Caregiver"
  | "Ruler"
  | "Creator";

export type ArchetypeAlignment = "serves-strongly" | "serves" | "neutral" | "violates";

export type VoiceOfMotionTag =
  | "flowing"
  | "organic"
  | "ethereal"
  | "dreamy"
  | "atmospheric"
  | "luminous"
  | "premium"
  | "edgy"
  | "tech"
  | "glitchy"
  | "playful"
  | "responsive"
  | "tactile"
  | "irregular"
  | "textured"
  | "jittery"
  | "broken"
  | "dystopian"
  | "iridescent"
  | "futuristic"
  | "reflective"
  | "polished"
  | "analog"
  | "nostalgic"
  | "warm"
  | "hand-drawn"
  | "raw"
  | "artistic"
  | "responsive-water"
  | "energetic"
  | "electric"
  | "vibrant"
  | "naturalistic"
  | "divine"
  | "dramatic"
  | "drifting"
  | "subtle"
  | "cinematic"
  | "shimmering"
  | "retro"
  | "scientific"
  | "geometric"
  | "technical"
  | "biological"
  | "calm"
  | "considered"
  | "confident"
  | "mature";

export type PerfTier = "low" | "medium" | "high" | "very-high";

export type RenderTier =
  | 0  // Pure CSS
  | 1  // CSS @keyframes
  | 2  // Framer Motion
  | 3  // react-spring
  | 4  // GSAP + ScrollTrigger
  | 5  // Lottie
  | 6  // Rive
  | 7  // OGL (lightweight WebGL)
  | 8  // R3F (Three.js)
  | 9  // R3F + postprocessing
  | 10; // Custom GLSL shader

export type Lifecycle = "always" | "viewport" | "interaction" | "scroll-trigger";

export interface EffectMeta {
  /** Unique identifier — matches folder name */
  id: string;
  /** Human-readable name */
  name: string;
  /** Brief description of the visual effect */
  description: string;
  /** Render tier(s) used */
  tiers: RenderTier[];
  /** Performance cost classification */
  perf_tier: PerfTier;
  /** Bundle size added in KB gzip */
  bundle_kb_gzip: number;
  /** Expected fps under 4× CPU throttle on mid-tier device */
  expected_fps_throttled: number;
  /** Archetype alignment matrix */
  archetypes: Record<Archetype, ArchetypeAlignment>;
  /** Voice-of-motion tags */
  voice_tags: VoiceOfMotionTag[];
  /** Lifecycle pattern */
  lifecycle: Lifecycle;
  /** Whether SSR-safe; if false must be wrapped in dynamic({ ssr: false }) */
  ssr_safe: boolean;
  /** Browser support requirement (e.g., "WebGL2", "universal", "View Transitions API") */
  browser_min: string;
  /** Mobile fallback: "css-only" | "static-image" | "lighter-shader" | "disabled" */
  mobile_fallback_strategy: "css-only" | "static-image" | "lighter-shader" | "disabled";
  /** Reduced-motion behavior */
  reduced_motion_strategy: "static-fallback" | "instant-transition" | "disabled" | "unchanged";
  /** Implementation completeness */
  status: "stub" | "partial" | "complete";
}
