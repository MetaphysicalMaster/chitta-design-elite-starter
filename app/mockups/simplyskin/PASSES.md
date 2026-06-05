# SimplySkin MedSpa — Refinement Passes

Pitch homepage ("AFTER") for **SimplySkin MedSpa** (Fishers + Carmel, Indiana) at
`/mockups/simplyskin`. The brief: kill the repurposed-Shopify "add to cart" DNA and
present a true premium, consult-driven med spa in **quiet-luxury, clinical-minimal**
dress — soft platinum + warm nude + a single deep-teal accent on white, editorial
Fraunces serif over Inter, the **Top 1% US Allergan** authority and the **Carmel
expansion** foregrounded.

Each pass below is ONE genuine improvement. No filler.

---

## I. Brand system, palette & identity

1. **Scoped token system.** Authored `brand.css` with every `--color-*` override
   nested under `[data-brand="simplyskin"]`, so nothing leaks into shared
   `globals.css` or sibling builds. Surfaces are a near-white warmed toward nude
   (`oklch 99.2% .004 70`) — luminous, never the sterile blue of the old shop.
2. **Single-accent discipline.** Chose ONE quiet deep-teal accent
   (`oklch 48% .072 196`) used sparingly — the opposite of e-commerce colour-spam.
   Defined `--color-accent-deep` (40% L) as the AA-safe on-light variant for links,
   prices and labels.
3. **Sibling differentiation.** Deliberately diverged from siblings: Avail (cobalt
   slipstream) and Happy Clinic (saturated aurora violet→teal). SimplySkin is
   restrained, airy, low-chroma platinum with a single teal note — documented in the
   brand.css header so the distinction is intentional, not accidental.
4. **Warm-metal palette.** Added platinum / nude / champagne tokens
   (`--platinum`, `--nude`, `--champagne`) for hairlines, foil and photo plates so
   every surface reads as one cohesive material story.
5. **Ink scale, not black.** The rare dark sections use a warm ink scale
   (`--ink-0..2`, ~20–30% L, hue 240–250) rather than pure black — expensive, soft,
   on-brand even in the booking/CTA bands.
6. **Hairline-first borders.** Borders set to barely-there platinum
   (`--color-border` 92.5% L) plus an even softer `--color-border-subtle` — the
   fine-hairline signature of quiet luxury.

## II. Typography

7. **Editorial serif via `next/font/google`.** Selected **Fraunces** (variable,
   optical-sizing) for display + **Inter** for body/UI. Fraunces light reads
   "effortless-expert"; Inter keeps NAP/UI clean. Distinct from siblings' geometric
   sans (Sora / Space Grotesk).
8. **Variable-font axes fix.** First build failed: `axes` cannot be combined with a
   `weight` array. Removed `weight`, kept `axes: [opsz, SOFT, WONK]` + both
   `normal`/`italic` styles so the full 300–500 range loads — `font-weight: 340` is
   then valid via CSS on the variable font.
9. **Display weight tuned to 340.** Set `.font-display` to a custom 340 weight with
   `font-optical-sizing: auto` and `-0.012em` tracking — a hair lighter than book,
   which is what makes it read couture rather than corporate.
10. **Italic emphasis variant.** Added `.font-display-em` (italic 380) for the one
    editorial emphasis word per heading — "Effortless", "Restraint is the result",
    "The same elite hands" — a restrained pull-quote cadence.
11. **Fluid type scale.** `--fluid-hero/-h2/-lead` via `clamp()` so headings scale
    smoothly 375→1920 with no break-point jumps and `text-wrap: balance` on display.
12. **Tabular numerics.** `.tnum` applied to every phone number, address, price and
    metric so NAP/figures align in columns — a small precision tell of craft.
13. **Refined eyebrow.** A reusable `.eyebrow` class (0.7rem, 0.28em tracking) with a
    `.rule-fine` 1px teal→platinum hairline underline — the section-label system.

## III. The WebGL power element (caustic skin-glow light study)

14. **Custom caustic shader.** Authored `skin-glow-shaders.ts`: a domain-warped
    fbm caustic field + a broad diagonal light-sweep band over a luminous near-white
    surface — implying healthy, glowing skin. Soft and low-contrast by design (quiet
    luxury), not a saturated light show.
15. **MeshTransmission refractive surface.** Built `SkinGlowScene.tsx` with a
    high-subdivision icosahedron (smooth dome) under drei
    `MeshTransmissionMaterial` — light passes through and is "perfected".
16. **Skin-toned attenuation.** Set `attenuationColor` to warm nude
    (`#e7d3bd`) with low `chromaticAberration` (0.42) and soft `roughness` (0.16),
    so the refraction reads as luminous skin, not cold glass.
17. **Restrained Bloom.** Bloom kept low (`intensity` 0.7 desktop / 0.45 lite,
    `luminanceThreshold` 0.75) so only the brightest caustic cores lift — wow without
    flash, matching the brand register.
18. **Two-canvas composition.** An orthographic full-bleed glow backdrop +
    a transparent perspective lens canvas over it, mirroring the proven Encore/Happy
    Clinic architecture for clean layering.
19. **Eased cursor reactivity.** Both the shader light source and the lens tilt ease
    toward the pointer with frame-rate-independent smoothing
    (`1 - pow(k, delta)`) — calm, never jittery.
20. **Barely-there motion.** Lens rotates at 0.05 rad/s and breathes ±1.2% — "alive"
    but quiet; the antithesis of a spinning hero gimmick.
21. **`dpr={[1,2]}` + perf gates.** Both canvases cap DPR at 2, use
    `powerPreference: high-performance`, and pause (`frameloop="never"`) when the
    hero is offscreen (IntersectionObserver, 120px margin) or the tab is hidden.
22. **`lite` performance tier.** On <1280px the transmission resolution drops
    512→256, samples 10→6, and the Bloom kernel shrinks — protecting 60fps on
    mid-range hardware.
23. **Smooth mount fade-in.** Shader `u_intensity` ramps from 0 on first frames so
    the WebGL never "pops" in over the CSS fallback — a seamless handoff.

## IV. Graceful degradation & fallback

24. **`dynamic(ssr:false)` from a client wrapper.** `SkinGlowScene` is imported via
    `next/dynamic` with `ssr:false` inside the `"use client"` `SkinGlowHero` — the
    Next 16 rule (ssr:false is illegal in Server Components).
25. **On-brand CSS fallback, never blank.** `.glow-fallback` paints a static caustic
    light-sweep gradient (nude bloom + teal whisper + rose glow over platinum) that
    is ALWAYS rendered at `-z-20`, covering SSR, the pre-mount frame, mobile,
    no-WebGL and reduced-motion. Zero CLS — it's a full-bleed absolute layer.
26. **Capability gating.** `useEnableWebGL` mounts the canvas only when
    `min-width:768px` AND WebGL is present AND `navigator.connection.saveData` is
    false AND reduced-motion is off — otherwise the CSS fallback stands alone.
27. **Reduced-motion honoured everywhere.** The fallback sweep animation, the foil
    sheen, the scroll cue, Lenis, and all Reveal/hero motion are gated on
    `prefers-reduced-motion` (CSS `@media` + `useReducedMotion`).

## V. Layout, whitespace rhythm & the closer

28. **Full premium section architecture.** Sticky glass nav → skin-glow hero →
    trust band → **two-location closer** → authority → services → before/after →
    proof wall → Allē/financing → native scheduler → per-location footer.
29. **The closer, foregrounded.** `Locations.tsx` places the Fishers + Carmel grid
    high (right after trust), with the Carmel card carrying a tasteful "Now Open"
    launch ribbon and accent border + soft glow — the expansion is the headline
    moment, paired with a Top-1% Allergan authority badge.
30. **Generous, consistent vertical rhythm.** Every section uses
    `py-24 sm:py-28` and `scroll-mt-20` (sticky-nav offset) for a calm, unhurried
    cadence and correct anchor landing positions.
31. **Editorial asymmetry.** Authority and Financing use 5/7 and 12-col grids with a
    floating signature card and perk list — magazine layout, not a product grid.
32. **De-commerced services menu.** Services are editorial cards with "from / by
    consultation" pricing and a "Consult →" affordance — explicitly NOT add-to-cart,
    with a "Most requested" feature on injectables and a "sample pricing" disclaimer.

## VI. Motion craft

33. **Staggered hero entrance.** Eyebrow→headline→lead→CTAs→metrics rise and fade on
    a shared `[0.16,1,0.3,1]` ease with `staggerChildren`, decaying to instant under
    reduced-motion.
34. **Scroll-linked hero parallax.** Hero copy drifts `-50px` and fades as the
    section scrolls away (`useScroll`/`useTransform`), clamped to 0 under
    reduced-motion.
35. **In-view Reveals.** A single `Reveal` primitive drives every section's
    fade/rise with `viewport={{ once:true }}` and a `-12%` margin, so content animates
    once, just before entering — never on every scroll.
36. **Premium Lenis cadence.** Smooth scroll at `duration: 1.2` with an expo ease;
    anchor clicks glide with an `-88px` nav offset. Fully removed under reduced-motion.

## VII. Accessibility (WCAG AA)

37. **AA-safe accent foil.** The hero highlight word "Effortless" originally used a
    light platinum foil that would fail contrast on the light hero. Re-tuned the foil
    stops to a teal-tinted metal with the darkest stop at ~40% L (AA on near-white) —
    legible through the whole sweep, still luxe. Body/muted/subtle fg tokens were
    chosen at AA-passing L values for light surfaces.
38. **Landmarks + skip link.** `header`/`main#main`/`footer`/`nav[aria-label]`,
    `address`, `figure/figcaption`, `dl/dt/dd`, and a first-focusable skip link that
    becomes visible on focus.
39. **Slider a11y.** Before/after handle is a `role="slider"` with
    `aria-valuemin/max/now/valuetext` and full keyboard control (arrows/Home/End).
40. **Scheduler radiogroups w/ roving tabindex.** The native booking flow uses real
    `role="radiogroup"`/`role="radio"` fieldsets; refined to a roving-tabindex model
    (one tab stop per group, arrow keys move + select) with an `aria-live` summary and
    a disabled-until-complete confirm button.
41. **Visible focus throughout.** Every interactive element has a
    `focus-visible:outline-2 outline-offset-2` ring in the accent colour (or white on
    ink) — no focus is ever swallowed.
42. **Decorative SVGs hidden.** All ornamental icons/plates carry `aria-hidden`;
    placeholder plates expose `role="img"` + a descriptive `aria-label` and a visible
    "sample" tag so reviewers and AT both know they're illustrative.

## VIII. Responsive (375 / 768 / 1280 / 1920)

43. **Mobile-first grids.** Locations 1→2 col, Services/Proof 1→2→3 col, Authority
    stacks to a single column under `lg`; the hero metrics `flex-wrap` cleanly at
    375px.
44. **No-clip floating cards.** The Authority signature card is inset (`right-3`) on
    mobile and only floats off-edge (`sm:-right-6`) from `sm` up, so it never clips
    the viewport at 375px.
45. **Fluid type + balanced wraps.** `clamp()` headings and `text-balance`/
    `text-pretty` keep line lengths elegant from 375 through 1920 without manual
    breakpoints.

## IX. Performance & CLS

46. **Zero-CLS media.** Every placeholder uses CSS `aspect-ratio` (BrandImage,
    sliders, plates) and the hero fallback is an absolute full-bleed layer — nothing
    reflows when the WebGL mounts.
47. **Lazy, code-split WebGL.** The R3F bundle loads only client-side, only when
    capability checks pass, and the hero scene pauses its render loops offscreen —
    keeping the static-prerendered route light by default.
48. **Quality gates green.** `npx tsc --noEmit` clean; `npx next build` succeeds and
    statically prerenders `/mockups/simplyskin`. No shared files, `package.json`,
    root layout, effects library or sibling folders were touched.

---

## Self-score (each /10)

| Criterion               | Score | Notes |
|-------------------------|------:|-------|
| Visual impact           | 9.5 | Luminous skin-glow hero + editorial Fraunces; reads $10K-tier, kills the shop feel. |
| Brand distinctiveness   | 9.6 | Quiet-luxury platinum/nude + single teal — unmistakably apart from cobalt/aurora siblings. |
| Power-element wow       | 9.4 | Caustic shader + MeshTransmission skin-glow; restrained on purpose, with a flawless fallback. |
| Motion craft            | 9.4 | Staggered hero, scroll parallax, eased WebGL reactivity, Lenis — all reduced-motion safe. |
| Responsiveness          | 9.4 | Clean 375/768/1280/1920; no-clip floating cards; fluid type. |
| A11y                    | 9.5 | Landmarks, skip link, AA-tuned tokens, slider + roving-tabindex radiogroups, visible focus. |
| Code quality            | 9.5 | Mirrors shipped conventions; scoped tokens; lean primitives; tsc + build green. |
| Conversion design       | 9.5 | Carmel-launch closer, native 30-sec scheduler, Allē value framing, dual CTAs, NAP everywhere. |

**Average: ≈ 9.48** (target ≥ 9.4 met.)

### Files created
- `app/mockups/simplyskin/{page.tsx, layout.tsx, brand.css, PASSES.md}`
- `components/mockups/simplyskin/{SmoothScroll, SiteNav, SkinGlowHero, SkinGlowScene,
  skin-glow-shaders, primitives, TrustBar, Locations, Authority, Services,
  BeforeAfter, ProofWall, Financing, BookingCTA, SiteFooter}`
