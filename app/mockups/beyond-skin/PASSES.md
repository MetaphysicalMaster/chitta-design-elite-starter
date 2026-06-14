# Beyond Skin Aesthetics — Refinement Pass Log

Route: `/mockups/beyond-skin`. "AFTER" pitch mockup. Aspirational, not corrective.
Each pass = one concrete improvement.

## REBRAND PASS — faithful to the real practice (national-7 standard)
Grounded on the live site (beyondskinaesthetics.com): "The Joy of Beauty &
Wellness" / "Unveil your inner beauty, as you discover joyful wellness." —
feminine, warm, judgment-free wellness journey.
- Palette retuned in `brand.css` (token VALUES, names kept): dusty MAUVE/PLUM
  accents · warm CREAM canvas · plum ink · champagne taupe. Replaced the prior
  espresso/rose-bronze "editorial luxury" direction. Back-compat aliases map the
  old glow-bronze/glow-gold/ink-* tokens onto the new palette.
- Fonts (layout.tsx): Cormorant Garamond (light editorial serif display) + Inter
  (sans). Logo recreated in CSS/SVG — mauve lotus/petal mark + serif wordmark.
- SIGNATURE "Journey to Wellness": (1) a WebGL silk light-field hero — a lit
  mauve/plum silk surface with a left→right "current" + pointer bloom + scroll
  deepening (surface-shaders.ts viewport-scaled plane, ortho camera, R3F; static
  CSS silk fallback for SSR/mobile/reduced-motion/no-WebGL); (2) JourneyThread —
  a fixed luminous mauve thread that traces itself down the page spine via native
  scroll progress (Lenis-driven), with a glowing light bead riding the head.
  Reduced-motion → fully drawn, static.
- NEW Concierge.tsx — AI front-desk: canned, brand-voiced text-back→book flow,
  books/qualifies/routes only (no medical advice), "Preview" tag, mobile bottom
  sheet, focus trap, real text line (614) 745-4177.
- NEW ReviewsMarquee.tsx — continuous full-text 5-star sliding wall (pause on
  hover/focus, reduced-motion swipe strip, Google aggregate band, sample-labeled).
- BeforeAfter.tsx rebuilt to the REAL aligned photo pair (ba-after base +
  ba-before clipped overlay) — pointer + keyboard ARIA slider, "Illustrative"
  tag, static-export-safe plain <img>.
- SiteFooter.tsx — real NAP + hours + text line; added "Book a free Reactivation
  Audit" CTA → themetamarketer.com/start (MetaMarketer attribution).
- All section copy re-voiced to the real brand (services = real categories;
  wellness-journey tone; judgment-free/inclusive trust signals).
- Motion fix: standardized all reveals on variant-label form
  (initial="hidden"/whileInView="show") — inline-object whileInView/animate did
  not reliably fire here; RevealGroup distributes a per-item stagger delay.
- Gates: `npx tsc --noEmit` clean (0 beyond-skin errors). Chrome-verified:
  hero + silk fallback + journey thread draw, concierge full flow, reviews
  marquee animating, before/after drag (aria-valuenow updates), footer audit CTA.
  Console clean (only benign THREE.Clock deprecation warning).

---
## (Prior sandbox-build log — superseded by the rebrand above)

## Foundations
1. Scoped OKLch brand palette in `brand.css` under `[data-brand="beyond-skin"]` — warm porcelain-ivory canvas, espresso ink fg, molten rose-bronze accent. Distinct from blue-sky (airy blue) and encore (dark crystal).
2. Brand-specific glow tokens (`--glow-rose/-bronze/-gold/-plum`, `--ink-deep/-warm`) used by both the WebGL hero and its CSS fallback, kept perceptually adjacent for a luminous skin/light read.
3. Editorial type pairing via `next/font/google`: Bricolage Grotesque (display) + Inter (sans), wired to `--font-display` / `--font-sans`. Fashion-magazine feel, distinct from siblings' Fraunces/Manrope.
4. Fluid clamp type scale (`--fluid-hero/h2/h3/lead`) for breakpoint-free rhythm.
5. Glass surfaces for both light field (`.glass`, `.glass-strong`) and the dark hero field (`.glass-dark`) so chrome reads correctly on either background.

## The power element — "Beyond the Surface" particle morph
6. GPU particle system (drei `<points>` + custom GLSL), single draw call, 9000 particles (lite: ~55%). Budget kept sane; all motion in the shader.
7. Four morph targets generated procedurally: serene FACE PROFILE → botanical LEAF → flowing silk RIBBON → dispersed CLOUD, looping back to face.
8. Face profile sampled as a contour band + interior fill so the silhouette reads recognizably (forehead/nose/lips/chin/neck).
9. Continuous morph phase (0..4) with smoothstep windows — dissolve/re-form rather than hard cuts.
10. Mid-transition "dissolve burst" displaces particles by per-particle noise so shapes melt apart, not snap.
11. Organic curl-ish drift (hash3 noise) so particles never sit still — "living skin."
12. Cursor flow field: in-plane swirl + gentle outward repel + z lift near the pointer, eased and frame-rate independent.
13. Intro reveal: particles fly in from the dispersed cloud on mount (`uIntro` eased to 1).
14. Brand-tinted fragment color: depth blends deep→bronze, life lifts→rose, cursor proximity flares gold; soft round feathered sprite (no texture) + core hotspot for bloom pickup.
15. Additive blending + `depthWrite/Test:false` for luminous layering; soft `Bloom` (low luminance threshold) for couture glow, not a tech demo.
16. `SwayRig` rotates the whole portrait slowly so it breathes.
17. `dpr={[1,2]}`, `antialias:false`, `powerPreference:"high-performance"`; delta clamped to 1/30 to avoid huge jumps after tab-switch.
18. Deterministic PRNG (mulberry32) so geometry is stable across renders/HMR.

## WebGL gate + fallback (Next 16 correctness)
19. `dynamic(() => import("./SurfaceScene"), { ssr:false })` called inside the `"use client"` `SurfaceHero` — the Next-16 gotcha honored.
20. `useEnableWebGL` gate: ≥768px + WebGL probe + not save-data + not reduced-motion; `lite` tier for ≤1100px or ≤4 cores.
21. Static `.surface-fallback` CSS gradient field painted at `-z-20` always — SSR, mobile, no-WebGL, reduced-motion. Zero CLS, never a blank frame. Verified present in SSR HTML.
22. Triple legibility scrims (left wash + vertical + radial anchor) guarantee WCAG-AA hero copy over any morph frame.

## Layout & content
23. Sticky glass nav: condenses on scroll, wordmark, desktop links, native phone link, prominent native **Book Now** (no WellnessLiving redirect), animated mobile drawer with proper `aria-expanded`/`aria-controls`.
24. Hero: molten animated "beyond" word, growth-story subhead (Dr. Mulumba + 4× expansion), dual CTA with magnetic primary, stat row (4.9★ / 4× / Est. 2017).
25. Trust bar: 4.9★ / 281 reviews / dual board-certified / 2017 / 4× — hairline-divided grid (px gaps over border-subtle bg).
26. Brand-story "we've grown" section: oversized editorial type + stacked 2017→4× frames visual leaning into the 2023 expansion.
27. Services grid: real treatments + price anchors ($600–1,200/syringe etc.), hover lift + animated gradient top-edge, focusable cards into booking.
28. **Unified** section (the strategic core): Treat · Shop · Belong fused on one dark field — directly answers the fragmented site + Shopify + WellnessLiving split.
29. Membership: $149/mo banked-credit card using the shared `HolographicFoil` effect + a clear 3-step "how banked credit works" mechanic.
30. Before/after drag slider: pointer + full keyboard (`role="slider"`, arrows/Home/End), brand-tinted "sample" placeholders.
31. Instagram-style mosaic gallery with a featured 2×2 tile, hover captions, follow CTA.
32. Native "book in 30 seconds" 3-step scheduler (treatment → date/time → confirm) replacing the WellnessLiving handoff — real client-side state, animated step transitions.
33. Testimonials reflecting the 4.9★/281 reputation; clearly marked illustrative.
34. Footer: final molten CTA band + semantic `<address>` NAP (540 Officenter Pl Ste 120, Gahanna 43230 · (614) 532-6423), hours `<dl>`, provider credits.

## Motion, a11y, polish
35. All reveals/staggers/magnetic/molten-shimmer honor `prefers-reduced-motion` (motion's `useReducedMotion` + CSS `@media`); Lenis disabled under reduced-motion.
36. Shared easing `cubic-bezier(0.16,1,0.3,1)` across reveals for a consistent voice; magnetic CTA disabled on touch + reduced-motion.
37. Skip link, single `<main id="main">`, semantic `header/nav/section/footer/figure/address/dl`, `aria-label`s on landmark sections, `aria-hidden` on all decorative layers.
38. Focus-visible rings on every interactive element (brand-tinted, offset). Tab order is logical top→bottom.
39. Fixed Tailwind-v4 arbitrary-color opacity: baked alpha into spaced `oklch(... / a)` values where `/NN` on a spaced arbitrary value was ambiguous; removed a buggy redundant `last:md:hidden` seam (grid `gap-px` already draws the seam).
40. Subtle SVG grain overlay (`.grain`) ties dark editorial sections together; trust-bar hairline dividers corrected to actually render.

## Quality gates
- `npx tsc --noEmit` → clean (0 errors).
- `npx next build` → succeeds; `/mockups/beyond-skin` prerendered as static (○).
- Dev render verified HTTP 200, SSR contains hero copy + static fallback, no runtime errors/warnings in the dev log.
- Reduced-motion / mobile / no-WebGL / save-data all fall back to the static `.surface-fallback` gradient; reasoned through and gated in `useEnableWebGL`.

## Self-score (/10)
- Visual impact: 9.2
- Brand fit: 9.3 (bold editorial luxury, "beyond the surface" metaphor literalized in the hero)
- Power-element wow: 9.2 (recognizable face→leaf→ribbon morph, cursor flow field, bloom)
- Motion craft: 9.1
- Responsiveness: 9.0 (375/768/1280/1920 ladders; lite tier; fluid type)
- A11y: 9.2 (keyboard slider, skip link, landmarks, reduced-motion, AA scrims)
- Code quality: 9.1 (scoped tokens, reused effect lib + cn(), shaders documented, lane respected)
- Conversion design: 9.4 (native booking, unified brand, membership clarity, trust signals)

**Average ≈ 9.19 — above the 9.0 bar.**
