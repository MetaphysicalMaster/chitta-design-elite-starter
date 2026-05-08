import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "glitch-effect",
  name: "Glitch Effect",
  description:
    "Dystopian/cyberpunk glitch with RGB shift, scan lines, random offset. STUB — postprocessing Glitch + custom shader in v1.0.",
  tiers: [9, 10],
  perf_tier: "medium",
  bundle_kb_gzip: 18,
  expected_fps_throttled: 60,
  archetypes: { Innocent: "violates", Sage: "violates", Explorer: "neutral", Outlaw: "serves-strongly", Magician: "neutral", Hero: "neutral", Lover: "violates", Jester: "serves", Everyman: "neutral", Caregiver: "violates", Ruler: "violates", Creator: "serves" },
  voice_tags: ["jittery", "broken", "dystopian", "edgy", "tech"],
  lifecycle: "interaction",
  ssr_safe: false,
  browser_min: "WebGL2",
  mobile_fallback_strategy: "css-only",
  reduced_motion_strategy: "disabled",
  status: "stub",
};
