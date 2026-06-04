# Encore Dermatology — Refinement Passes

A numbered log of concrete improvements made while building the pitch homepage
mockup at `/mockups/encore`. Each pass = one concrete change with a one-line
note. Brand essence: clinical authority + academic credibility fused with
premium med-spa luxury — "the most trusted skin in Columbus."

## Foundation

1. **Brand palette (OKLch).** Defined a scoped dark, cinematic palette under `[data-brand="encore"]` — deep ink-navy surfaces, warm champagne-gold accent, cool clinical-teal counter-accent, spa-rose for the aesthetic side. Distinct from blue-sky's airy light theme.
2. **Type pairing.** `Newsreader` (editorial serif, optical sizing + italic) for academic authority headings; `Inter Tight` (precise grotesque) for clinical body/UI clarity. Wired via `next/font/google` in `layout.tsx`.
3. **Fluid type tokens.** Added `--fluid-hero/h2/h3/lead` clamp() tokens for breakpoint-free type rhythm from 375→1920.
4. **Glass system.** Dark frosted `.glass` / `.glass-strong` surfaces with gold-tinted hairline borders and a deep shadow — premium, not airy.
5. **Static hero fallback.** Authored `.crystal-fallback` — a dark void raked by warm + cool light shafts and a conic prism glow, mirroring the WebGL scene so SSR/mobile/reduced-motion show no blank frame and zero CLS.

## Power element — Renewal Light (WebGL)

6. **Two-canvas architecture.** Orthographic full-bleed shader backdrop (volumetric god-ray shafts) + a transparent perspective canvas for the refractive crystal — composited cleanly, matching the blue-sky convention.
7. **Volumetric shaft shader.** Custom GLSL fbm light-shaft field with radial falloff, warm + cool beam systems, vertical bias, vignette and anti-band grain.
8. **Refractive crystal.** drei `MeshTransmissionMaterial` on an octahedron (reads as a faceted gem/prism) with high `chromaticAberration` (0.9) for visible dispersion, clearcoat, IOR 1.42.
9. **Studio lighting via Environment + Lightformers.** Warm key, cool clinical fill, soft rim and a gold ring — emissive shapes that reflect in the crystal and seed Bloom, rather than a flat HDRI.
10. **Postprocessing.** `Bloom` (mipmap, large kernel, threshold 0.62) for the cinematic light core + `Vignette` to frame. ACES filmic tone mapping on the crystal canvas for filmic falloff.
11. **Cursor interaction.** Crystal tilts toward the pointer (eased, frame-rate-independent lerp) and the shaft source shifts the rake angle — subtle, not gimmicky.
12. **Breathing.** Slow sine-driven tilt + micro-scale on the crystal so it feels alive when idle.
13. **Reveal easing.** Shader `u_intensity` eases 0→1 on mount so the scene fades up gracefully instead of popping.
14. **Perf budget.** `dpr={[1,2]}`, `antialias:false` on the shader backdrop, `high-performance` power preference, capped sparkle count, single-frame Environment. 60fps target on desktop.
15. **`lite` tier.** Scene accepts a `lite` prop (drops sparkles, softer bloom) for future smaller-tier use.

## Lazy-load + graceful degradation

16. **`ssr:false` boundary.** `RenewalLightScene` dynamically imported from inside the `"use client"` `RenewalHero` (the Next-16 gotcha) with `loading: () => null`.
17. **Capability gate.** `useEnableWebGL` probes `min-width:768px`, live WebGL context, and `navigator.connection.saveData` before mounting the heavy scene; otherwise the CSS fallback stays.
18. **Reduced-motion.** `useReducedMotion` short-circuits WebGL entirely and freezes decorative loops (scroll cue, monogram orbit) — the static crystal gradient is shown.

## Layout, spacing & content

19. **Section primitive.** Shared `Section` (max-w-6xl, py-24/32) + `SectionHeading` (eyebrow→title→lede) enforce one consistent vertical rhythm and header cadence across all sections.
20. **Sticky glass nav.** Condenses to a floating pill on scroll, native "Book Appointment" CTA (NOT a Zocdoc redirect), visible phone number, full-screen mobile menu with body-scroll lock.
21. **Trust bar.** Five-up authority strip surfacing 4.81★, 404 reviews, OSU Associate Professor, since-2010, board-certified — the proof the real site buries.
22. **Two-path split.** `CarePaths` gives Medical and The Spa equal, gorgeous weight with tone washes (clinical-teal vs spa-rose); the under-marketed spa side is merchandised as a first-class growth engine.
23. **Dual service grids.** Real treatments only, 8 per side, 4-col responsive grids with a tone-colored hover accent bar.
24. **Before/After drag slider.** The asset the real site lacks — three interactive reveal sliders with CSS placeholder art clearly watermarked "Sample · for illustration."
25. **Dr. Londeree section.** Leads on the crown jewel — OSU faculty role — with a refined monogram portrait placeholder (clearly "sample") and a credentials grid.
26. **Financing/CareCredit.** A callout the real site surfaces nowhere — promotional financing, membership pricing, seasonal promos — a direct conversion lever.
27. **Native scheduler.** `BookingCTA` — a 3-step "book in 30 seconds" picker (path → time → confirm) replacing the Zocdoc handoff, with a phone fallback.
28. **Testimonials.** Masonry quote cards tied to the 4.81★ reputation, tagged Medical/Spa, framed as illustrative samples.
29. **Footer NAP.** Semantic `<address>` landmark with real name/address/phone, hours `<dl>`, footer nav — fixing the dated, keyword-stuffed footprint.

## Motion choreography

30. **Hero stagger.** Eyebrow→headline→lede→CTAs→stats stagger on `[0.16,1,0.3,1]` expo-out; all offsets collapse under reduced motion.
31. **Scroll reveals.** Shared `Reveal` uses `whileInView` with `once:true` and a -12% margin so content arrives just before fully in view; per-card delays create gentle cascades.
32. **Hover physics.** Care-path cards lift 6px; service cards grow their accent bar; CTAs translate-y and intensify their gold glow; arrow glyphs slide on group-hover.

## Color / contrast (WCAG AA on dark)

33. **Foreground ramp.** `--color-fg` porcelain (oklch 96%), `-muted` 80%, `-subtle` 66% — all clear AA on the oklch 20% ink-navy bg.
34. **Gold button contrast.** `--color-accent-fg` is dark ink (oklch 22%) on the oklch 82% gold so the primary CTA passes AA.
35. **Hero scrims.** Layered left wash (0.86), vertical seats, and a focused radial anchor behind the copy column guarantee AA over any moving light-shaft frame.

## A11y & focus

36. **Skip link + landmarks.** Skip-to-content link, `<main>`, `aria-labelledby` on every section, `<nav aria-label>`, `<address>`, `<dl>` for stats/hours.
37. **Focus-visible everywhere.** Gold outline (offset 2) on every interactive element; nav toggle exposes `aria-expanded`/`aria-controls`.
38. **Accessible slider.** Before/after handle is `role="slider"` with min/max/now/valuetext and full Arrow/Home/End keyboard support; decorative star ratings use `aria-hidden` with `sr-only` text on the trust bar.
39. **Scheduler a11y.** `<fieldset>/<legend>` steps, `aria-pressed` toggles, disabled-until-ready confirm, `role="status" aria-live="polite"` confirmation.

## Responsive

40. **Breakpoint sweep.** Hero, nav (desktop links ≥lg, pill phone ≥md, mobile menu <lg), 2-col paths, 1→2→4 service grids, 3-col results, 2-col masonry testimonials, and a stacked scheduler all verified at 375/768/1280/1920.
41. **Equal-height path cards.** CTA pinned to card bottom (`md:mt-auto`) so the two care-path cards align regardless of copy length.

## Verification

42. **`npx tsc --noEmit` → clean (0 errors).**
43. **`npx next build` → succeeds; `/mockups/encore` prerenders as static content.**

---

## Self-score (each /10)

| Dimension          | Score | Note |
|--------------------|-------|------|
| Visual impact      | 9.5   | Cinematic dark theme, dispersive crystal + volumetric shafts, gold-foil editorial type. |
| Brand fit          | 9.5   | Academic authority + spa luxury fused; gold/ink/clinical-teal palette is on-essence and distinct from blue-sky. |
| Power-element wow  | 9.5   | Refractive prism in raking god-rays with Bloom + cursor tilt + breathing; robust SSR/mobile/reduced-motion fallback. |
| Motion craft       | 9.0   | Consistent expo-out easing, staggered reveals, tasteful hover physics, full reduced-motion honoring. |
| Responsiveness     | 9.0   | Fluid type + verified layouts across 375→1920; equal-height cards; adaptive nav. |
| A11y               | 9.0   | Skip link, landmarks, focus-visible, accessible drag-slider + scheduler, AA contrast on dark. |
| Code quality       | 9.0   | Scoped tokens, shared primitives, reused effect patterns, typed throughout, clean build. |
| Conversion design  | 9.5   | Native booking, financing, two-path merchandising, trust bar, before/after — every real-site flaw addressed. |

**Average: 9.25 / 10** — clears the ≥9.0 bar.
