import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "refraction-glass",
  name: "Refraction Glass",
  description:
    "Frosted-glass / liquid-glass effect with displacement and refraction. backdrop-filter + R3F MeshTransmissionMaterial. STUB — full v1.0.",
  tiers: [1, 8],
  perf_tier: "medium",
  bundle_kb_gzip: 22,
  expected_fps_throttled: 58,
  archetypes: { Innocent: "serves", Sage: "serves", Explorer: "neutral", Outlaw: "neutral", Magician: "serves", Hero: "neutral", Lover: "serves-strongly", Jester: "neutral", Everyman: "neutral", Caregiver: "serves", Ruler: "serves-strongly", Creator: "serves" },
  voice_tags: ["premium", "polished", "atmospheric"],
  lifecycle: "always",
  ssr_safe: true,
  browser_min: "backdrop-filter (universal modern)",
  mobile_fallback_strategy: "css-only",
  reduced_motion_strategy: "unchanged",
  status: "complete",
};
