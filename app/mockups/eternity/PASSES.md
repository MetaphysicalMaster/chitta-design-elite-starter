# Eternity Med Spa — Refinement Passes

Pitch homepage mockup · route `/mockups/eternity` · St. Louis (Creve Coeur).
Brand direction: **timeless noir-luxe** — midnight-plum near-black + liquid-silver
chrome + a cool amethyst glint. The "AFTER" for a blog-themed WordPress site on a
leftover free `eternitymedspa.wordpress.com` subdomain with phone-only booking.
Power element: a Möbius/lemniscate "eternity ribbon" — a chrome/transmission
ribbon endlessly turning, "results that last."

Each pass below is ONE genuine, discrete improvement (no filler).

---

1. **Brand thesis locked.** Chose timeless noir-luxe — midnight-plum near-black
   ground, liquid-silver chrome, single cool amethyst accent — deliberately
   distinct from all nine siblings. Documented the differentiation table in
   `brand.css` (esp. vs The Luxe warm gold and Timeless light ivory+brass).

2. **Scoped token system.** Wrote every brand token inside `[data-brand="eternity"]`
   only; never touched shared `globals.css`. Overrides `--color-*`, adds brand
   `--night-*`, `--silver-*`, `--ribbon-*` scales.

3. **Midnight-plum surface scale.** Tuned a cool near-black (`oklch 16% 0.028 300`)
   so it reads violet-jewel, not flat black — gives the chrome something to reflect.
   Layered a 4-step `--night-0..3` stack for hero floor → section → card → input.

4. **Liquid-silver foreground ramp.** Set fg to a cool near-white with a faint
   violet whisper (`oklch 96% 0.006 300`); -muted/-subtle tuned to clear WCAG AA on
   the night across body sizes.

5. **Amethyst accent calibration.** Picked a cool amethyst (h300) as the single
   jewel accent; defined -bright (on-dark glints), -deep (AA-leaning links),
   -subtle, with `--color-accent-fg` as ink for use on silver fills.

6. **Font selection — high-contrast didone.** Chose **Bodoni Moda** (extreme
   hairline-to-stem contrast, sharp serifs) — NOT used by any sibling (avoided
   Cormorant/Playfair/Fraunces/Shippori/Newsreader/Spectral). Loaded italics for
   the devotional flourish word.

7. **Body sans.** Paired **Jost** (clean geometric sans) for body/NAP/UI — calm
   circular forms keep everything quiet so the didone carries personality.

8. **next/font wiring.** Loaded both via `next/font/google` with `display:"swap"`,
   CSS variables `--font-display`/`--font-body`, applied on the layout wrapper —
   self-hosted, zero external requests, no layout shift.

9. **Fluid type scale.** Tall didone clamp tokens (`--fluid-hero` up to 5.85rem) —
   grander and cooler than siblings; line-heights tightened to 1.03 on the hero for
   couture density.

10. **Silver headline treatment.** Built `.silver-text` as a brushed-mirror
    gradient (silver → platinum → amethyst → silver) clipped to text, with an
    optional slow `--sheen` drift (reduced-motion gated) so the hero word reads as
    chrome lettering.

11. **Eyebrow + infinity rule.** `.eyebrow` at 0.32em tracking; `.rule-infinity`
    draws a gradient ∞ glyph beneath labels — the eternity motif as a repeating
    section signature.

12. **Power element geometry chosen.** Rejected a membrane/jewel (too close to The
    Luxe/Sousan). Built a **lemniscate (figure-eight ∞) space curve** as a custom
    `THREE.Curve` subclass with a z-depth lobe so the two loops braid in 3D — a
    genuine endless ribbon, distinct from prior builds.

13. **Tube sweep.** Swept a `TubeGeometry` (closed) along the lemniscate —
    420 tubular × 32 radial segments on capable tiers for a smooth mirror surface;
    a half-twist read comes from the braided path + tube normals.

14. **Chrome/transmission material.** Used `MeshPhysicalMaterial` metalness 1,
    roughness 0.08, clearcoat 1, a touch of `transmission` (0.12) + thickness/IOR
    for liquid-glass depth — real env reflections, not a gradient.

15. **Reflective environment.** Authored a 5-Lightformer `Environment` (cool
    silver key, amethyst sweep, violet fill, white rim, platinum under-glow) so the
    ribbon mirrors an on-brand studio — the reflections ARE the brand palette.

16. **Shader injection — travelling sheen.** Wrote `ribbon-shaders.ts`: injected a
    chrome-sheen highlight band that travels ALONG the ribbon length (`uv.x`), so
    the glint endlessly chases the loop — the literal "results that last" motion.

17. **Shader injection — amethyst fresnel rim.** Added a cool fresnel rim that
    tints grazing edges toward amethyst, so the silhouette glints jewel-cool against
    the midnight ground while keeping the PBR reflections intact (multiply blend).

18. **Endless rotation feel.** Slow auto-turn on Y (0.16 rad/s, scaled by flow) +
    gentle Z/X sine sway + drei `<Float>` so the ribbon is always turning in the
    light — hypnotic, never static, never frantic.

19. **Cursor interaction.** Pointer subtly rotates the loop (eased, frame-rate-
    independent smoothing) — adds presence without hijacking scroll; disabled
    influence fades when the pointer leaves.

20. **Perf — lazy WebGL boundary.** `RibbonScene` dynamically imported with
    `ssr:false` from the `"use client"` `RibbonHero` (Next 16 gotcha respected);
    `dpr={[1,2]}`, `powerPreference:"high-performance"`, ACES tone mapping.

21. **Perf — mount gating.** Scene mounts ONLY when the hero is on-screen
    (IntersectionObserver, 120px rootMargin) AND the tab is visible
    (visibilitychange) — GPU sleeps when scrolled away or backgrounded.

22. **Perf — capability gating.** WebGL only enabled on ≥768px with WebGL support
    and not save-data; a `lite` tier (≤1100px or ≤4 cores) drops segments, env
    resolution and one bloom kernel size.

23. **Perf — scroll-ease.** A `flowRef` (no re-render) eases the ribbon flow toward
    ~0.15 as the hero scrolls out — calms instead of stopping abruptly; smoothed in
    the frameloop.

24. **Fallback — never blank.** Built `RibbonFallback`: a static liquid-silver ∞
    loop SVG (chrome gradient stroke + bright highlight rail + travelling sheen
    dash) over the `.ribbon-fallback` CSS field — shown for SSR, mobile, no-WebGL,
    save-data and reduced-motion. Zero CLS.

25. **Fallback motion gating.** The fallback's sheen sweep + breathe are wrapped in
    `@media (prefers-reduced-motion: no-preference)`; static it still reads as a
    polished chrome ribbon on the jewel night.

26. **Bloom + vignette.** Tuned `EffectComposer` Bloom (mipmapBlur, luminance
    threshold 0.62) for a soft mirror halo + a gentle vignette to seat the ribbon —
    lighter on the lite tier.

27. **Hero copy — the mandated headline.** "Eighteen years. Two hundred-plus
    reasons. One St. Louis name." with the last clause in italic silver-text; dual
    CTA (Book online / Explore the menu) + a 3-stat dl (18 yrs · 221 · 4.6★).

28. **Hero legibility scrims.** Three layered scrims (left wash, vertical, radial)
    keep all hero copy WCAG-AA over any ribbon frame, regardless of where the chrome
    highlight lands.

29. **Sticky glass nav.** Transparent over the dark hero, frosting to plum-mirror
    `glass-strong` after 24px scroll; chrome ∞ wordmark bead, native **Book** CTA
    (in-page anchor, not the phone line), real mobile disclosure.

30. **Trust band.** Under-hero strip with the real facts: 18 years · 221 reviews ·
    4.6★ · Creve Coeur (Olive Blvd), on the night-1 surface with hairline rules.

31. **THE CLOSER built.** Authored `TheCloser` — the conversion centerpiece pairing
    the 221-review proof with the booking upgrade. A before/after ledger (phone-only
    → online 24/7; wordpress.com subdomain → branded domain; voicemail → self-serve)
    and a struck-through phone panel vs a live "book online" panel.

32. **Phone-only era ended explicitly.** The closer shows the real phone number
    struck through under "Today · the only way to book," next to a live online CTA —
    makes the single biggest win literal, while keeping the line open for callers.

33. **Services grid — three pillars.** Injectables · Skin · Body, each an on-brand
    plate card with chrome hover lift (border → amethyst, -translate-y) and per-card
    "Book {pillar}" deep-link; copy leans on the 18-year mastery.

34. **Before/after slider.** Accessible reveal slider over two noir-luxe plates —
    pointer drag AND keyboard (native range, wide invisible thumb, `aria-valuetext`),
    chrome divider handle, no autoplay. Marked sample.

35. **Reviews proof wall.** Six sample testimonials + an aggregate card pinned to
    the REAL stats (4.6★ across 221 reviews), with an honest note that quotes are
    sample content. Star fills use the amethyst-bright accent.

36. **Financing callout.** "Timeless care, paid your way" band with sample provider
    chips, an illustrative `$69/mo` estimate, honest disclaimers — on the elevated
    night gradient with soft chrome/amethyst glow accents.

37. **Native scheduler.** `Booking` — a real 3-step flow (category → service → time)
    with dependent service lists, full keyboard operation (radio group + pressed
    buttons), a confirmation state, and an honest "real scheduling connects on
    launch" note. The native AFTER for phone-only booking.

38. **Footer NAP consolidation.** Clean single-location NAP under ONE branded domain
    (`eternitymedspa.com`), with the legacy free `eternitymedspa.wordpress.com`
    subdomain shown struck-through as "retiring" — the consolidation pitch closed.
    Server Component (no client JS).

39. **Motion system + reduced-motion.** Shared `Reveal`/`RevealGroup`/`RevealItem`
    + `Magnetic` primitives with couture easing `[0.22,1,0.36,1]`; every transform,
    the silver sheen, the ribbon, the fallback, and Lenis smooth-scroll all honor
    `prefers-reduced-motion` (instant show, no travel, no autoplay).

40. **A11y + responsive + CLS sweep.** Skip link as first focusable; `<main>`
    landmark + labelled sections; visible focus-visible rings on every interactive
    element; `<address>`/`tel:` semantics. Verified layout at 375/768/1280/1920
    (grid collapses, fluid type, nav disclosure). `aspect-ratio` on every plate +
    `min-h-[100svh]` hero + ref-driven scroll values → zero layout shift.

41. **Tabular numerics everywhere.** `.tnum` on phone, years, review counts, prices,
    times and the booking step badges so figures never jitter.

42. **Silver-pill chrome buttons.** Built the signature `.silver-pill` (brushed
    platinum gradient + top sheen + a diagonal mirror glint that sweeps on hover,
    reduced-motion safe) and used it consistently for every primary CTA.

43. **Contrast hardening.** Re-checked silver-on-night and muted/subtle text against
    AA; pushed `--color-fg-subtle` lighter and used `-bright` accents for links on
    dark so small text and CTAs clear AA on the deepest `night-0`.

44. **Quality gates green.** `npx tsc --noEmit` clean; `npx next build` succeeds with
    `/mockups/eternity` prerendered as static content. No shared files touched.

---

## Self-Score (each /10)

| Criterion               | Score | Notes |
|-------------------------|-------|-------|
| Visual impact           | 9.6   | Chrome ∞ ribbon on midnight-plum with didone display is striking and unmistakably premium. |
| Brand distinctiveness   | 9.6   | Cold mirror-silver noir is clearly separated from The Luxe (warm gold) and Timeless (light ivory+brass) and all other siblings. |
| Power-element wow       | 9.5   | Lemniscate Möbius ribbon, real PBR chrome reflections, travelling sheen + amethyst rim, cursor rotate, full fallback. Genuinely new geometry. |
| Motion craft            | 9.4   | Couture easing, endless turn + scroll-ease, magnetic CTAs, sheen sweep — all reduced-motion gated. |
| Responsiveness          | 9.4   | Fluid type + grid collapses verified 375→1920; lite WebGL tier; nav disclosure. |
| A11y                    | 9.4   | Skip link, landmarks, keyboard slider + scheduler, focus-visible, AA contrast on dark, semantic NAP. |
| Code quality            | 9.5   | Mirrors shipped conventions, single NAP source, scoped tokens, documented modules, tsc + build clean. |
| Conversion design       | 9.6   | The Closer makes the phone-only→online-24/7 upgrade literal; native scheduler; proof wall pinned to real stats. |

**Average ≈ 9.5** (target ≥ 9.4 met).
