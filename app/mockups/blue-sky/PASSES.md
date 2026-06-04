# Blue Sky Med Spa — Refinement Log

Pitch homepage mockup at `/mockups/blue-sky`. The "AFTER" in a before/after
pitch against their templated, two-domain WordPress + Vagaro-redirect site.

---

## Brand DNA (researched June 2026 — what's authentic, and how we honor it)

Researched via web search of their real footprint (blueskymedspa.net /
blueskymedspaoh.com, Facebook BlueSkyMedSpaLLC, Instagram @blueskymedspallc,
Yelp, BBB, LinkedIn, Vagaro). **No copyrighted photos or logo files were
hotlinked or scraped** — all imagery is recreated CSS/SVG, clearly marked
"sample." Authentic cues found, and how this mockup honors each:

- **Real tagline / voice:** "You are seen, and we are here to help you live your
  best life." → Now the hero H1 ("You are seen. *Live your best life.*") and
  echoed in the footer brand line.
- **"30 years of medical expertise" + "holistic approach to beauty and
  wellness":** → Woven into the hero lead, Services lead, Story section, trust
  bar, and metadata.
- **Founder story (Dr. Maura Manning, MD — left ER medicine because she wanted
  to reach people *before* a crisis, with preventive care):** → New "Our Story"
  section built around a faithful paraphrase ("Emergency care rarely competes
  with prevention and wellness"), with a clearly-labeled *sample* portrait.
- **Family-owned + woman-owned + locally based, German Village; started Aug 2021;
  "hidden gem," "incredibly relaxing" ambiance:** → Trust bar ("Woman & family-
  owned"), testimonials reworded to the real reviews' tone ("quite the little
  hidden gem," "above and beyond on both the beauty and wellness side").
- **Two real memberships — "Blue Sky Membership" (wellness) + "Next Level Beauty
  Membership" (beauty), with free monthly services + discounts:** → Corrected
  the wellness tier name (was "Blue Sky Wellness") and perks to match the real
  free-monthly-service + member-pricing structure.
- **Real services:** high-end facials, microneedling, neurotoxins, fillers,
  Sculptra, chemical peels, PDO thread lifts, weight loss, BHRT, IV therapy →
  all present and correctly named in the Services grid.
- **Brand essence "blue sky":** literal clear-daylight palette — champagne-gold
  dawn → clear daylight blue → luminous azure → soft horizon ink. Scoped OKLch
  palette re-tuned to these real hues; WebGL + CSS sky + aurora all matched.
- **Logo motif:** recreated (not copied) a brand-faithful SVG mark — a champagne
  sun rising over a clear-sky horizon arc, in nav + footer.
- **NAP:** 480 S 3rd St, Columbus OH 43215 · (614) 512-9665 (real, verified).

**Brand direction.** Serene, premium, airy — literally "blue sky." Scoped OKLch
palette (in `brand.css`) overrides the shared `--color-*` tokens only within
`[data-brand="blue-sky"]`: dawn champagne → daylight blue → azure → horizon ink,
deep sky-ink foreground (not pure black) for calm AA contrast, plus a champagne
`--gold` luxe accent. Type pairing: **Fraunces** (variable serif display, SOFT +
opsz axes, italic for emphasis) + **Manrope** (humanist sans for UI/body), wired
to CSS vars on the brand wrapper via `next/font/google`.

**Power element.** "Breath of Sky" — a full-bleed orthographic R3F shader plane
running custom GLSL fbm (domain-warped 5-octave simplex) over a dawn→day vertical
gradient: slow drifting volumetric clouds, cursor parallax (smoothed, framerate-
independent lerp), a slow palette "breath," and a floating refractive glass orb
(drei `MeshTransmissionMaterial` on a second perspective canvas). Lazy-loaded via
`dynamic(ssr:false)` from the `SkyHero` client component. Fallback: a static CSS
`.sky-fallback` gradient is always painted under it (zero CLS), and WebGL only
mounts on desktop (≥768px) with motion allowed, WebGL present, and no save-data.

---

## Passes

1. Read AGENTS.md + all mandated Next 16 docs (layouts, server/client, css, fonts, lazy-loading) before writing code.
2. Studied effects library (fluid-color-mix shaders, aurora-gradient), globals.css OKLch token system, and `cn()` helper for reuse.
3. Scaffolded route: `layout.tsx` + scoped `brand.css` + `page.tsx`; chose architecture (server page composing client sections).
4. Defined scoped OKLch brand palette overriding `--color-*` only inside `[data-brand="blue-sky"]`; added brand vars (sky stops, gold, glass).
5. Wired Fraunces (serif display) + Manrope (sans) via next/font, mapped to `--font-display` / `--font-sans` on the wrapper.
6. Authored "Breath of Sky" GLSL: 5-octave fbm + domain warp for organic volumetric clouds (spirit of fluid-color-mix, not a copy).
7. Built R3F scene: orthographic shader plane filling viewport exactly + second perspective canvas for the glass orb.
8. Added cursor parallax via a shared pointer ref + framerate-independent damped lerp; clouds glide toward cursor, never snap.
9. Added master `u_intensity` ease-in so the sky reveals gracefully instead of popping on mount.
10. Added slow `breath` luminance pulse + time-based palette shift for living, serene motion (not a tech demo).
11. Implemented `SkyHero` client wrapper: `dynamic(ssr:false)` boundary (Next 16 gotcha) with static gradient fallback always underneath.
12. Gated WebGL on desktop + reduced-motion + WebGL-probe + save-data; mobile/reduced-motion get the CSS sky only.
13. Hero content: eyebrow badge, fluid serif headline with italic emphasis, lead naming Dr. Manning, dual CTA, KPI stat row, scroll cue.
14. Hero motion choreography: staggered container reveal with expo-out easing; reduced-motion zeroes stagger + translate.
15. Built sticky glass `SiteNav`: transparent over hero → `glass-strong` on scroll; reserves 16-height (no CLS); animated underlines.
16. Added accessible mobile drawer: `aria-expanded`/`aria-controls`, body-scroll lock, animated hamburger, AnimatePresence.
17. Built `TrustBar` — the three buried pillars (5.0★, physician-led, family-owned) + location, surfaced immediately under hero.
18. Built `Services` grid: 8 real treatments with clear names, plain-language blurbs, "from" price anchors — fixes generic repetitive titles.
19. Service cards: spring hover lift, hover sky-wash, icon tiles, tag chips, "Book →" affordance; staggered reveal group.
20. Built `BeforeAfter` interactive drag slider — the asset the real site entirely lacks; clipPath reveal with labeled sample gradients.
21. Made the slider fully keyboard-accessible: `role="slider"`, arrow/Home/End keys, `aria-valuenow`/`aria-valuetext`, focus-visible ring.
22. Set before/after on a dark field with sky aura + clear "Sample · illustrative" watermark to set honest expectations.
23. Built `Membership` premium pricing cards for the two real tiers (Blue Sky Wellness / Next Level Beauty); featured tier inverted + "Most popular".
24. Built `Testimonials` reinforcing the 5.0★ Google reputation with a rating callout; marked representative.
25. Built `BookingCTA` native 3-step inline scheduler (treatment → time → confirmed) replacing the Vagaro redirect; reused shared `AuroraGradient`.
26. Built `SiteFooter` with semantic `<address>`, real NAP (480 S 3rd St, (614) 512-9665), hours table, map/tel links.
27. Added `SmoothScroll` (Lenis) provider; disabled entirely under reduced-motion; anchor clicks glide with -64 nav offset.
28. Added skip-to-content link + `id="main"` landmark; semantic `header`/`main`/`section`/`footer`/`address` throughout.
29. `tsc --noEmit` clean (0 errors). Fixed Tailwind v4 invalid `h-5.5` arbitrary size to `h-5`.
30. `next build` gate: fixed Fraunces font (axes can't combine with explicit weight) — dropped weight, kept variable axes; build passes, route prerenders static.
31. Verified SSR HTML paints the static sky + all key copy with JS disabled (curl) — confirms graceful no-JS / pre-hydration state, zero blank frame.
32. Contrast pass: strengthened hero scrims (vertical + left wash) so white headline holds WCAG-AA over the brightest sky frame; seated nav + scroll cue.
33. TrustBar pass: replaced gap-px (invisible without bg) with explicit subtle cell dividers for a crisp ruled strip at 2-col (mobile) and 4-col (desktop).
34. Responsive audit (375 / 768 / 1280 / 1920): fluid clamp type tokens, grid reflows (1→2→4 services, 1→3 results, 1→2 membership), drawer under md.
35. A11y audit: focus-visible rings on every interactive element, alt/aria-hidden on decorative SVG/canvas, aria-labels on icon buttons, role="img" on star ratings.
36. Reduced-motion audit: Lenis off, Float/parallax skipped (WebGL not mounted), all Reveal/stagger collapse to instant — reasoned through end-to-end.
37. Motion-craft pass: unified expo-out easing `[0.16,1,0.3,1]`, spring hovers on cards, once-only in-view reveals with -12% margin to avoid early fire.
38. Honesty/polish pass: "sample / mockup" disclaimers on pricing, results, reviews, scheduler, and footer so the prospect reads it as a concept correctly.
39. Final `tsc` + `next build` re-run after all edits — both clean; no runtime errors/warnings in dev log on the route.

---

## ENHANCEMENT ROUND (passes 40+)

A disciplined second pass focused on **brand authenticity first**, then power-
element, craft, responsive, a11y and perf. Each line = one concrete action.

### Brand research & authenticity
40. Web-researched the real Blue Sky Med Spa (site, FB, IG, Yelp, BBB, LinkedIn) and wrote the Brand DNA note atop this file.
41. Captured the real tagline "You are seen… live your best life" and made it the hero H1.
42. Replaced generic hero lead with their authentic "30 years of medical expertise + holistic" positioning, attributed to Dr. Manning.
43. Corrected hero KPI row to authentic facts: 5.0★, "30 yrs medical expertise," "MD-led · woman & family-owned."
44. Verified + kept real NAP (480 S 3rd St, Columbus OH 43215 · (614) 512-9665) across nav, footer, maps/tel links.
45. Corrected the wellness membership name to the real "Blue Sky Membership" (was "Blue Sky Wellness").
46. Reworked membership perks to the real structure: free monthly service + member pricing on skincare, not invented credits.
47. Confirmed all 8 services map to their real menu (facials, microneedling/PRP, neurotoxins, fillers, Sculptra, peels, PDO, IV, BHRT, weight loss).
48. Reworded testimonials to mirror real-review tone: "quite the little hidden gem," "above and beyond on both the beauty and wellness side."
49. Built a new **"Our Story"** section around Dr. Manning's authentic ex-ER → preventive-care motivation (faithful paraphrase, attributed).
50. Marked the Story portrait a clearly-labeled "Sample portrait" placeholder — no scraped photos, honest concept.
51. Wove "holistic approach to beauty and wellness" into the Services section lead.
52. Updated footer brand line with the real voice ("You are seen — and we're here to help you live your best life").
53. Rewrote `<title>`/description metadata with the real tagline, full real service list, and woman/family-owned + German Village cues.
54. Added "Our Story" to the primary nav + mobile drawer so the brand narrative is reachable.

### Brand palette & typography
55. Re-tuned scoped OKLch palette toward their true clear-daylight hues (azure ~240–242, warmer champagne dawn).
56. Deepened `--color-fg-muted`/`--color-fg-subtle` so muted body copy passes AA on both `bg` and `bg-subtle`.
57. Added `--color-accent-deep` (AA-safe accent for on-light text/links) + `.text-accent-deep` utility.
58. Added `--gold-ink` + `.text-gold-ink` for readable champagne-tinted text on light surfaces.
59. Warmed + clarified the five sky stops (dawn/mid/high/deep/blush) to read as a clear sky, not a generic night/tech sky.
60. Rebuilt `.sky-fallback` as a 4-layer gradient (champagne dawn glow, rose blush, luminous crown, horizon ink) echoing the WebGL frame.
61. Added a slow, calm `bs-sky-drift` keyframe on the fallback (motion-safe) so even the static sky feels alive.
62. Tightened display letter-spacing to -0.015em and enabled serif ligatures/`calt` for an editorial luxe feel.
63. Added humanist sans `font-feature-settings` (cv11/ss01) + micro letter-spacing for body polish.
64. Synced the JS `PALETTE` hexes in `BreathOfSkyScene` to the refined OKLch stops so WebGL == CSS.
65. Synced the `AuroraGradient` colors on the booking section to the refined champagne/azure palette.

### Power element — Breath of Sky
66. Reworked the dawn glow into a proper two-radius **sun bloom** (tight warm core + wide glow) low-left — their signature "first light."
67. Warmed the cloud color near the sun so wisps catch dawn light instead of staying uniformly cool.
68. Slowed base cloud drift (0.02→0.017) and palette shift for a calmer, more luxe cadence.
69. Softened cloud-band thresholds for gentler, more volumetric (less crunchy) forms.
70. Added subtle atmospheric grain to kill gradient banding on the smooth sky.
71. Eased the master fade-in floor color toward the brand deep-blue for a graceful, on-brand reveal.
72. Gated the costly refractive **orb to ≥1024px** only (new `showOrb` perf tier) — mid screens keep the sky, drop the orb.
73. Bumped orb quality (samples 6→8, res 256→320, ior 1.2) now that it only runs on large/high-perf viewports.
74. Retuned orb tint to the warmer brand palette (#eef5ff / attenuation #d6e6f8).
75. Added an **IntersectionObserver `frameloop` pause** — both canvases stop rendering when the hero scrolls offscreen (battery/GPU).
76. Kept smoothed, framerate-independent cursor parallax; reduced parallax amount slightly (0.06→0.055) for subtlety.
77. Re-verified the `dynamic(ssr:false)`-inside-client-component boundary against the Next 16 lazy-loading doc — pattern preserved.

### Craft — type, color, motion, micro-interactions
78. Promoted every on-light accent *text* usage (section eyebrows, prices, links, avatar) to `text-accent-deep` for guaranteed AA.
79. Computed actual WCAG ratios for all key pairs in a script — documented; all body/heading/eyebrow pairs now ≥ 4.5 (AA).
80. Made the **whole service card a real link** (stretched anchor on the title) — clickable + keyboard-focusable, with `focus-within` ring.
81. Marked the decorative "Book →" affordance `aria-hidden` so the card exposes one clean accessible name ("Book {service}").
82. Strengthened hero legibility scrims (left + vertical) so the white H1 holds AA over the new, brighter daylight crown.
83. Added gentle **scroll-parallax** to hero copy (drifts up + fades on exit) via `useScroll`/`useTransform`; zeroed under reduced-motion.
84. Added top/bottom fade strips to the dark Results band so it eases into the light sections instead of hard-cutting.
85. Refined the logo mark into a distinctive champagne-sun-over-horizon glyph with a faint halo + second cloud arc (nav + footer).
86. Added subtle `ring` to the logo badge for definition on both dark (over-hero) and light (scrolled) states.
87. Clarified the before/after slider `aria-valuetext` ("Showing X% before, Y% after").
88. Improved the Story numeric stat row (Preventive / Holistic / Local) with hairline rules for rhythm.

### Responsive
89. Re-verified 375 / 768 / 1280 / 1920: hero, trust bar (2→4), services (1→2→4), results (1→3), membership (1→2) all reflow cleanly.
90. Tightened hero KPI row gap on mobile (gap-x-7 → sm:gap-x-10) so three stats don't wrap awkwardly at 375.
91. Confirmed the new Story section reflows from 2-col (≥lg) to single column with the portrait on top on small screens.
92. Confirmed the orb-off / sky-on tier at 768–1023px keeps the hero beautiful without the heavy transmission pass.

### A11y & perf
93. Re-verified semantic landmarks: skip link, `header`/`main`/`section`/`footer`/`address`, single H1, ordered H2s incl. Story.
94. Re-verified focus-visible rings on every interactive element incl. the new stretched service links and Story.
95. Reduced-motion end-to-end: WebGL not mounted, Lenis off, sky-drift off, hero/scroll parallax zeroed, all reveals instant.
96. No-CLS check: static `.sky-fallback` always painted under the canvas; nav reserves its height; portrait/figure have fixed aspect.
97. Confirmed all decorative SVG/canvas are `aria-hidden`; star ratings keep `role="img"` + label; sample placeholders labeled.
98. Perf: orb gated to large screens + frameloop pause offscreen materially cut idle GPU cost vs. the prior always-on dual canvas.
99. Verified prerendered HTML (`grep`) ships the static sky + all key brand copy ("You are seen," "Our Story," NAP) — graceful no-JS.
100. Final `tsc --noEmit` + `next build` re-run after all edits — both clean; route prerenders as static.

---

## Self-Score (/10)

| Criterion                    | Score | Note |
|------------------------------|-------|------|
| Visual impact                | 9.5   | Sun-bloom living sky + warm champagne/azure luxe system reads instantly premium. |
| **Brand authenticity** (×wt) | 9.6   | Real tagline, story, palette, services, memberships, NAP, recreated mark — all faithful, none scraped. |
| Power-element wow            | 9.5   | Two-radius dawn bloom, warmed clouds, grain, perf tiers + offscreen pause; matches brand exactly. |
| Motion craft                 | 9.3   | Hero scroll-parallax, calmer sky cadence, section fades, spring hovers; fully reduced-motion safe. |
| Responsiveness               | 9.3   | Clean reflows 375→1920; mobile gap fix; orb-off mid tier; Story stacks gracefully. |
| A11y                         | 9.4   | AA verified by computed ratios; stretched links keyboard-reachable; landmarks; reduced-motion complete. |
| Code quality                 | 9.4   | Scoped tokens, reused effects/`cn()`, typed, Next-16 lazy boundary correct, no-op-free. |
| Conversion design            | 9.4   | Whole service cards bookable, sticky Book Now, native scheduler, story-driven trust, clear memberships. |
| **Average**                  | **9.43** | ≥ 9.4 target met. |

## Quality gates
- `npx tsc --noEmit` → clean (0 errors).
- `npx next build` → succeeds; `/mockups/blue-sky` prerenders as static content.
- WCAG AA verified via computed sRGB contrast ratios for all key text/bg pairs.
- Reduced-motion + mobile/mid WebGL fallback reasoned through end-to-end: static
  `.sky-fallback` gradient always painted; R3F sky only mounts desktop + motion-
  ok + WebGL-ok; refractive orb only ≥1024px; both canvases pause offscreen.
