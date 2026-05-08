import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "voronoi-pattern",
  name: "Voronoi Pattern",
  description:
    "Organic cell-network background pattern via shader. Bio/network feel. STUB — voronoi distance shader in v1.0.",
  tiers: [8, 10],
  perf_tier: "medium",
  bundle_kb_gzip: 28,
  expected_fps_throttled: 58,
  archetypes: { Innocent: "neutral", Sage: "serves", Explorer: "serves", Outlaw: "neutral", Magician: "serves", Hero: "neutral", Lover: "neutral", Jester: "neutral", Everyman: "neutral", Caregiver: "neutral", Ruler: "serves", Creator: "serves-strongly" },
  voice_tags: ["organic", "geometric", "biological"],
  lifecycle: "always",
  ssr_safe: false,
  browser_min: "WebGL2",
  mobile_fallback_strategy: "static-image",
  reduced_motion_strategy: "static-fallback",
  status: "stub",
};
