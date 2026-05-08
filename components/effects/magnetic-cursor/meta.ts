import type { EffectMeta } from "../types";

export const meta: EffectMeta = {
  id: "magnetic-cursor",
  name: "Magnetic Cursor",
  description:
    "Custom cursor that magnetically pulls toward CTAs and interactive elements. Premium tactile feel. STUB — Framer Motion + element detection in v1.0.",
  tiers: [2],
  perf_tier: "low",
  bundle_kb_gzip: 4,
  expected_fps_throttled: 60,
  archetypes: { Innocent: "neutral", Sage: "neutral", Explorer: "serves", Outlaw: "serves", Magician: "serves", Hero: "neutral", Lover: "serves", Jester: "serves-strongly", Everyman: "neutral", Caregiver: "neutral", Ruler: "serves", Creator: "serves" },
  voice_tags: ["playful", "responsive", "tactile"],
  lifecycle: "always",
  ssr_safe: false,
  browser_min: "universal (desktop only — no cursor on mobile)",
  mobile_fallback_strategy: "disabled",
  reduced_motion_strategy: "disabled",
  status: "stub",
};
