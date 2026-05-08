import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "fluid-color-mix",
  name: "Fluid Color Mix",
  description:
    "Smoky/wispy color transitions between multiple stages using simplex-noise displacement on a custom GLSL shader. Solves the 'choppy linear color shift' problem with organic noise-driven mixing in OKLCh-equivalent linear space.",
  tiers: [8, 10],
  perf_tier: "medium",
  bundle_kb_gzip: 24,
  expected_fps_throttled: 58,
  archetypes: {
    Innocent: "serves",
    Sage: "neutral",
    Explorer: "neutral",
    Outlaw: "neutral",
    Magician: "serves-strongly",
    Hero: "neutral",
    Lover: "serves-strongly",
    Jester: "neutral",
    Everyman: "neutral",
    Caregiver: "serves",
    Ruler: "violates",
    Creator: "serves",
  },
  voice_tags: ["flowing", "organic", "atmospheric", "dreamy", "ethereal"],
  lifecycle: "always",
  ssr_safe: false,
  browser_min: "WebGL2 (Chrome 56+, Safari 15+, Firefox 51+)",
  mobile_fallback_strategy: "static-image",
  reduced_motion_strategy: "static-fallback",
  status: "complete",
};
