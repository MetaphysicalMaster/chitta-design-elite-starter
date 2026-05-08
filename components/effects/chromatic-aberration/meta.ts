import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "chromatic-aberration",
  name: "Chromatic Aberration",
  description:
    "RGB channel offset post-processing — gives cinematic edgy feel. STUB — uses @react-three/postprocessing ChromaticAberration in v1.0.",
  tiers: [9],
  perf_tier: "low",
  bundle_kb_gzip: 6,
  expected_fps_throttled: 60,
  archetypes: { Innocent: "violates", Sage: "neutral", Explorer: "neutral", Outlaw: "serves-strongly", Magician: "serves", Hero: "serves", Lover: "neutral", Jester: "serves", Everyman: "neutral", Caregiver: "violates", Ruler: "neutral", Creator: "serves" },
  voice_tags: ["edgy", "tech", "glitchy", "cinematic"],
  lifecycle: "always",
  ssr_safe: false,
  browser_min: "WebGL2",
  mobile_fallback_strategy: "disabled",
  reduced_motion_strategy: "disabled",
  status: "complete",
};
