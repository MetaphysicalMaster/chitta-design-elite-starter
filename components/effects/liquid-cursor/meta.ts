import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "liquid-cursor",
  name: "Liquid Cursor",
  description:
    "Cursor-driven displacement shader — image warps toward cursor like liquid. STUB — OGL-based implementation in v1.0.",
  tiers: [7, 10],
  perf_tier: "medium",
  bundle_kb_gzip: 18,
  expected_fps_throttled: 58,
  archetypes: { Innocent: "neutral", Sage: "neutral", Explorer: "serves", Outlaw: "serves", Magician: "serves-strongly", Hero: "neutral", Lover: "serves", Jester: "serves-strongly", Everyman: "neutral", Caregiver: "neutral", Ruler: "neutral", Creator: "serves" },
  voice_tags: ["playful", "organic", "responsive", "tactile"],
  lifecycle: "interaction",
  ssr_safe: false,
  browser_min: "WebGL2",
  mobile_fallback_strategy: "disabled",
  reduced_motion_strategy: "disabled",
  status: "stub",
};
