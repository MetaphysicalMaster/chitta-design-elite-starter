import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "displacement-noise",
  name: "Displacement Noise",
  description:
    "Generic noise-displacement filter — applies to images/text/elements for organic distortion. STUB — SVG feDisplacementMap + R3F variants in v1.0.",
  tiers: [1, 7],
  perf_tier: "low",
  bundle_kb_gzip: 4,
  expected_fps_throttled: 60,
  archetypes: { Innocent: "neutral", Sage: "neutral", Explorer: "serves", Outlaw: "serves", Magician: "serves", Hero: "neutral", Lover: "neutral", Jester: "serves", Everyman: "neutral", Caregiver: "neutral", Ruler: "neutral", Creator: "serves" },
  voice_tags: ["organic", "irregular", "textured"],
  lifecycle: "always",
  ssr_safe: true,
  browser_min: "SVG filter (universal)",
  mobile_fallback_strategy: "css-only",
  reduced_motion_strategy: "static-fallback",
  status: "stub",
};
