import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "holographic-foil",
  name: "Holographic Foil",
  description:
    "Iridescent rainbow surface that shifts with cursor angle — premium card / pricing tier accent. STUB — CSS conic + R3F variants in v1.0.",
  tiers: [1, 8],
  perf_tier: "medium",
  bundle_kb_gzip: 12,
  expected_fps_throttled: 60,
  archetypes: { Innocent: "neutral", Sage: "neutral", Explorer: "serves", Outlaw: "serves", Magician: "serves-strongly", Hero: "serves", Lover: "serves-strongly", Jester: "serves", Everyman: "neutral", Caregiver: "neutral", Ruler: "serves", Creator: "serves-strongly" },
  voice_tags: ["iridescent", "futuristic", "premium"],
  lifecycle: "interaction",
  ssr_safe: false,
  browser_min: "CSS conic-gradient (universal modern)",
  mobile_fallback_strategy: "css-only",
  reduced_motion_strategy: "static-fallback",
  status: "stub",
};
