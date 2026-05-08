import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "particle-field",
  name: "Particle Field",
  description:
    "Atmospheric background particle system using tsParticles. Drifting points of light with brand-tinted color, subtle parallax on cursor.",
  tiers: [7],
  perf_tier: "low",
  bundle_kb_gzip: 14,
  expected_fps_throttled: 60,
  archetypes: {
    Innocent: "serves",
    Sage: "serves",
    Explorer: "serves",
    Outlaw: "neutral",
    Magician: "serves-strongly",
    Hero: "neutral",
    Lover: "serves",
    Jester: "neutral",
    Everyman: "neutral",
    Caregiver: "neutral",
    Ruler: "serves",
    Creator: "serves-strongly",
  },
  voice_tags: ["atmospheric", "drifting", "subtle", "ethereal"],
  lifecycle: "always",
  ssr_safe: false,
  browser_min: "universal (Canvas API)",
  mobile_fallback_strategy: "css-only",
  reduced_motion_strategy: "static-fallback",
  status: "complete",
};
