# The Luxe MedSpa — Refinement Passes

Pitch homepage mockup at `/mockups/the-luxe` (the "AFTER" for The Luxe MedSpa
Aesthetics & Bodycare, Upper Arlington / Columbus OH). Brand direction: opulent
jewel-tone luxury — **onyx + deep emerald** ground with **molten / champagne
gold**. Display: **Italiana** (couture). Sans: **Jost** (refined geometric).
Power element: a real-time reflective **"Liquid Gold"** rippling metallic
membrane (R3F), cursor-reactive, with a static gold-on-emerald fallback.

Each pass = one concrete improvement.

## Foundation
1. Read AGENTS.md + all five Next-16 docs (layouts, server/client, css, fonts, lazy-loading) before writing code.
2. Studied effect library types + all three sibling mockups (blue-sky, encore, beyond-skin) for the `dynamic(ssr:false)`, `useEnableWebGL` gate, scoped-brand, and `next/font` conventions.
3. Scaffolded route (`app/mockups/the-luxe/*`) + components (`components/mockups/the-luxe/*`) only — no shared files touched.

## Brand system
4. `brand.css`: scoped OKLch palette under `[data-brand="the-luxe"]` — onyx/emerald surfaces, champagne-ivory foreground, molten-gold accent. Distinct from all three siblings (airy-blue / dark-crystal / porcelain-rose).
5. Added jewel-tone brand vars (emerald-abyss→mid, onyx, 5 gold stops) for the WebGL hero + CSS fallback to share.
6. Smoked-obsidian glass tokens with a warm gold rim (`--glass-*`) for nav + cards.
7. Fluid type clamps (`--fluid-hero/h2/lead`) for breakpoint-fluid rhythm.
8. `.gold-leaf` text treatment (multi-stop gold gradient clipped to text) + `.gold-leaf-anim` sheen sweep — the signature wordmark shimmer.
9. `.liquid-gold-fallback` static molten-on-emerald gradient — SSR/mobile/no-WebGL/reduced-motion safety so the hero never flashes blank (zero CLS).
10. `.grain` SVG-noise overlay + `.hairline-gold` dividers for luxe texture and section separation.
11. `layout.tsx`: wired Italiana + Jost via `next/font/google` with `display:swap`; SEO metadata with `robots: noindex` (mockup).

## Power element — "Liquid Gold" (R3F)
12. Built `liquid-gold-shaders.ts`: Ashima 3D simplex + fbm helpers (public domain), GPU-friendly.
13. Displacement: high-poly icosphere pushed along its normal by layered noise → organic molten ripple + a slow "breathing" swell.
14. Cursor reactivity: a soft gaussian impulse swells the surface toward the pointer direction (mapped onto the unit sphere), eased frame-rate-independently.
15. Material: PBR `meshStandardMaterial` (metalness 1, low roughness, envMapIntensity) so it shows REAL reflections, not a flat gradient — couture, not tech-demo.
16. `Environment` lightformers: champagne key, molten-gold sweep, emerald jewel fill, white rim, bronze under-glow — the actual reflected scene.
17. `onBeforeCompile` injection tints peaks→champagne / valleys→bronze via a displacement ramp + champagne fresnel rim, blended over the env reflection.
18. **Lighting follows the ripples**: refactored to recompute `objectNormal` via finite-difference of the displacement field inside `<beginnormal_vertex>` (before view-space transform) — shared `luxeDisplace()` so normal + position chunks agree.
19. Postprocessing: `Bloom` (luxe glow) + `Vignette` to seat the gold in the dark field.
20. Perf: `dpr={[1,2]}`, slow auto-rotation, `lite` tier drops icosphere detail 48→24, env res 256→128, bloom kernel LARGE→MEDIUM, lower bloom intensity.
21. `LiquidGoldHero.tsx`: `dynamic(ssr:false)` from a `"use client"` module (Next-16 gotcha) + `useEnableWebGL` gate (≥768px + WebGL probe + !saveData + !reduced-motion; lite if ≤1100px or ≤4 cores).
22. Code-quality: removed a module-level `_lite` mutation smell — env resolution now flows as a clean prop; dropped a dead no-op shader replace.

## Layout, content & conversion
23. Sticky smoked-glass `SiteNav` — gold wordmark, condense-on-scroll, **native "Book Now"** (no Fresha redirect), accessible animated mobile drawer, real phone `tel:`.
24. Hero: opulent headline ("Luxury, made literal." + couture subhead), physician-led lead naming Dr. Sanchez, dual CTA, 4.9★/MD-led/est-2023 stat row.
25. `TrustBar`: 4.9★ / ~122 reviews / physician-led / Upper Arlington address / est. 2023 — gold-hairline framed, staggered reveal.
26. `BrandStory`: editorial physician-founder + white-glove pillars, with a pure-CSS gold-leaf-on-emerald art panel (marked "sample").
27. `Services`: the REAL menu grouped Injectables / Laser & Skin / Body & Wellness via an accessible `role="tablist"` segmented control with a shared-`layoutId` pill — **every service carries a price anchor** (their real site hides pricing).
28. `BeforeAfter`: interactive drag slider with full pointer + keyboard (`role="slider"`, arrows/Home/End), brand-tinted placeholder "images" clearly watermarked "Sample · illustrative".
29. `Team` ("Meet Dr. Sanchez"): founder credibility (board-certified, Voyage Ohio) + the real care roster (Anne Wood FNP-C, Dawn Haque NP, aesthetician, Nikki).
30. `Financing`: tasteful CareCredit callout — premium-but-accessible, gold-framed, not cheapened.
31. `Booking`: native "book in 30 seconds" 3-step scheduler (Service → Time → Details → confirmation) replacing the Fresha handoff — progress rail, live selection, `role="status"` confirm.
32. `Testimonials`: 4.9★ review wall echoing reputation, centered heading, sample disclaimer.
33. `SiteFooter`: semantic `<address>` NAP (real address + `tel:`), real hours `<dl>`, footer nav, closing gold CTA, mockup disclaimer.
34. `SmoothScroll`: Lenis with anchor-glide + sticky-nav offset, fully disabled under reduced-motion.
35. `page.tsx`: skip link + semantic `<main>` landmark; composed all sections.

## Motion, a11y & polish
36. All reveals/stagger via shared `primitives.tsx` (Reveal/RevealGroup/RevealItem) with `useReducedMotion` → zero transforms + instant show when reduced.
37. `Magnetic` CTA wrapper — disabled on touch + reduced-motion; expo easing `[0.16,1,0.3,1]` throughout for couture deceleration.
38. Legibility scrims (left wash + vertical + radial anchor) keep hero copy WCAG-AA over any molten frame; gold eyebrow `oklch(80% .13 86)` on near-black clears AA; gold-leaf used only on large decorative display text.
39. Brand-scoped gold `:focus-visible` ring + gold `::selection` (overrides the shared purple accent inside the brand only).
40. Responsive sweep (375 / 768 / 1280 / 1920): hero clamps + max-widths, services 1→2→3 cols, before/after 1→3, trust bar 2→5 cols, footer 1→4 cols, CTA clusters wrap on narrow.

## Quality gates
- `npx tsc --noEmit` → clean (0 errors).
- `npx next build` → succeeds; `/mockups/the-luxe` prerendered as static content.
- Reduced-motion + mobile/no-WebGL reasoned through: WebGL fully gated off → static `.liquid-gold-fallback` painted at -z-20 always; Lenis + sheen + reveals all disabled.

## Self-score (/10)
- Visual impact — 9.4 (opulent onyx-emerald + molten gold, real reflections)
- Brand fit — 9.5 ("Luxe" made literal as liquid gold; couture Italiana)
- Power-element wow — 9.3 (reflective rippling liquid-metal membrane, cursor-reactive, lighting follows ripples)
- Motion craft — 9.1 (expo easing, magnetic, shared-layout pill, full reduced-motion)
- Responsiveness — 9.1 (fluid clamps + four-breakpoint grids)
- A11y — 9.2 (skip link, landmarks, slider/tablist roles, gold focus ring, AA scrims)
- Code quality — 9.2 (clean shader chunk architecture, typed, no shared-file edits)
- Conversion design — 9.4 (native scheduler vs Fresha, price transparency, CareCredit, physician trust)

**Average ≈ 9.3 / 10.**
