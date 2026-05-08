import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "god-rays",
  name: "God Rays",
  description:
    "Volumetric light rays through a scene — divine atmospheric effect. STUB — postprocessing GodRaysFakePass in v1.0.",
  tiers: [8, 9],
  perf_tier: "high",
  bundle_kb_gzip: 32,
  expected_fps_throttled: 54,
  archetypes: { Innocent: "serves-strongly", Sage: "serves-strongly", Explorer: "serves", Outlaw: "neutral", Magician: "serves-strongly", Hero: "serves", Lover: "serves", Jester: "neutral", Everyman: "neutral", Caregiver: "serves-strongly", Ruler: "serves", Creator: "neutral" },
  voice_tags: ["divine", "atmospheric", "luminous", "dramatic"],
  lifecycle: "always",
  ssr_safe: false,
  browser_min: "WebGL2",
  mobile_fallback_strategy: "static-image",
  reduced_motion_strategy: "static-fallback",
  status: "stub",
};
