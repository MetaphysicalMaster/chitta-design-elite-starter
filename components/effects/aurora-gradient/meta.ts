import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "aurora-gradient",
  name: "Aurora Gradient",
  description:
    "Animated aurora-style gradient backgrounds with depth and flow. Multi-layered conic gradients with blur + animated rotation.",
  tiers: [1],
  perf_tier: "low",
  bundle_kb_gzip: 2,
  expected_fps_throttled: 60,
  archetypes: {
    Innocent: "serves",
    Sage: "serves",
    Explorer: "serves",
    Outlaw: "neutral",
    Magician: "serves-strongly",
    Hero: "neutral",
    Lover: "serves-strongly",
    Jester: "neutral",
    Everyman: "neutral",
    Caregiver: "serves",
    Ruler: "neutral",
    Creator: "serves",
  },
  voice_tags: ["flowing", "ethereal", "atmospheric"],
  lifecycle: "always",
  ssr_safe: true,
  browser_min: "universal (CSS conic-gradient + filter)",
  mobile_fallback_strategy: "css-only",
  reduced_motion_strategy: "instant-transition",
  status: "complete",
};
