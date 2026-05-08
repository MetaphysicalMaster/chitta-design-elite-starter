import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "dust-particles",
  name: "Dust Particles",
  description:
    "Subtle ambient floating dust motes — atmospheric depth without dominating. STUB — variant of particle-field with different config in v1.0.",
  tiers: [7],
  perf_tier: "low",
  bundle_kb_gzip: 14,
  expected_fps_throttled: 60,
  archetypes: { Innocent: "serves", Sage: "serves", Explorer: "serves", Outlaw: "neutral", Magician: "serves", Hero: "neutral", Lover: "serves", Jester: "neutral", Everyman: "neutral", Caregiver: "serves", Ruler: "serves", Creator: "serves" },
  voice_tags: ["atmospheric", "drifting", "subtle"],
  lifecycle: "always",
  ssr_safe: false,
  browser_min: "universal (Canvas)",
  mobile_fallback_strategy: "disabled",
  reduced_motion_strategy: "disabled",
  status: "complete",
};
