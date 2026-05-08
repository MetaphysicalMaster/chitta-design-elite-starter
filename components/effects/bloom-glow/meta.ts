import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "bloom-glow",
  name: "Bloom Glow",
  description:
    "Post-processing bloom effect on R3F scenes. Bright surfaces emit luminous glow. Premium polish for hero scenes with light sources.",
  tiers: [9],
  perf_tier: "medium",
  bundle_kb_gzip: 28,
  expected_fps_throttled: 56,
  archetypes: {
    Innocent: "neutral",
    Sage: "neutral",
    Explorer: "neutral",
    Outlaw: "serves",
    Magician: "serves-strongly",
    Hero: "serves",
    Lover: "serves-strongly",
    Jester: "serves",
    Everyman: "neutral",
    Caregiver: "neutral",
    Ruler: "serves",
    Creator: "serves",
  },
  voice_tags: ["luminous", "dreamy", "premium"],
  lifecycle: "always",
  ssr_safe: false,
  browser_min: "WebGL2",
  mobile_fallback_strategy: "lighter-shader",
  reduced_motion_strategy: "unchanged",
  status: "complete",
};
