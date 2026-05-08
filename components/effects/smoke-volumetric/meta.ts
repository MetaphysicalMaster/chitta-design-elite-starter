import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "smoke-volumetric",
  name: "Smoke Volumetric",
  description:
    "Volumetric smoke clouds via R3F + raymarched fragment shader. Atmospheric depth for hero scenes. STUB — full implementation in v1.0.",
  tiers: [8, 10],
  perf_tier: "high",
  bundle_kb_gzip: 60,
  expected_fps_throttled: 50,
  archetypes: { Innocent: "neutral", Sage: "serves", Explorer: "serves", Outlaw: "neutral", Magician: "serves-strongly", Hero: "neutral", Lover: "serves", Jester: "neutral", Everyman: "neutral", Caregiver: "neutral", Ruler: "violates", Creator: "serves" },
  voice_tags: ["flowing", "organic", "ethereal", "atmospheric"],
  lifecycle: "always",
  ssr_safe: false,
  browser_min: "WebGL2",
  mobile_fallback_strategy: "static-image",
  reduced_motion_strategy: "static-fallback",
  status: "complete",
};
