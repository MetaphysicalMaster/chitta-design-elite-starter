import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "restraint-tier",
  name: "Restraint Tier",
  description:
    "Deliberate emptiness as the wow-moment. The Anthropic-tier wow: where less IS more. Single perfectly-timed transition. Hand-crafted minimal layouts. No effect at all is the effect.",
  tiers: [0, 2],
  perf_tier: "low",
  bundle_kb_gzip: 0,
  expected_fps_throttled: 60,
  archetypes: { Innocent: "serves-strongly", Sage: "serves-strongly", Explorer: "neutral", Outlaw: "neutral", Magician: "serves", Hero: "neutral", Lover: "neutral", Jester: "neutral", Everyman: "neutral", Caregiver: "serves", Ruler: "serves-strongly", Creator: "neutral" },
  voice_tags: ["calm", "considered", "confident", "mature"],
  lifecycle: "always",
  ssr_safe: true,
  browser_min: "universal",
  mobile_fallback_strategy: "css-only",
  reduced_motion_strategy: "unchanged",
  status: "stub",
};
