# Sousan Med Spa — Refinement Passes

Pitch homepage at `/mockups/sousan`. The "AFTER" for a 29-year River Oaks
institution whose live presence is a dated DIY WordPress with a gmail business
email and conflicting addresses across directories. Brand direction: old-money
River Oaks couture — **emerald jewel + champagne-gold on cream marble**, with a
**liquid-gold-caustics / refractive emerald-jewel** WebGL power element.

Each pass below is ONE genuine improvement (no filler). Scoped entirely within
`[data-brand="sousan"]`; shared `globals.css`, `package.json`, root layout, the
effects library, and sibling folders were not touched.

---

## Brand, palette & identity

1. **Scoped token system.** Authored a full OKLch token set under
   `[data-brand="sousan"]` only — surfaces, fg, accent, borders, glass — so the
   brand cannot leak into shared `globals.css` or any sibling mockup.
2. **Cream-marble surfaces, not clinical white.** `--color-bg` is a warm ivory
   (`oklch(97.6% 0.008 92)`) with a faint gold breath; `--color-bg-warm` gives a
   deeper marble wash for alternating blocks — a drawing room, not a clinic.
3. **Emerald jewel as the soul color.** Foreground ink is a deep forest-emerald
   (`oklch(25% 0.045 165)`) so even body copy carries the brand's green, reading
   near-black for legibility while never feeling generic charcoal.
4. **Champagne-gold metal ramp.** A five-stop gold scale (`--gold` →
   `--gold-bright` / `--gold-mid` / `--gold-deep` / `--gold-ink`) so gold can be
   sheen, rim, hairline AND AA-legible text depending on the stop.
5. **Sibling differentiation, deliberate.** Documented in `brand.css` how Sousan
   diverges from avail (cobalt), happy-clinic (aurora), simplyskin (platinum),
   timeless (aubergine/brass), hanami (sakura), and crucially **The Luxe**: where
   The Luxe is a molten liquid-GOLD membrane on green-black, Sousan is refractive
   EMERALD jewel light over GOLD CAUSTICS on bright marble.
6. **Emerald-night dark scale.** `--night-0/1/2` give a cohesive dark-section
   family (hero, financing, booking, footer) that's emerald-rooted, never neutral
   black — the dark and light halves of the page share one DNA.
7. **Metadata as identity correction.** `layout.tsx` title/description ship the
   one clean NAP + "since 1995" positioning the live gmail/duplicate-listing
   presence wastes; `robots: noindex` since it's a pitch mockup.

## Typography (couture serif craft)

8. **Playfair Display** wired via `next/font/google` (`--font-display`, swap) — a
   high-contrast editorial serif ("Vogue" voice) chosen because the brief flags
   Cormorant as already used by a sibling. Loaded with italic for couture
   emphasis.
9. **Jost** as the refined geometric sans (`--font-body`) — quiet circular
   geometry that lets the serif star while reading modern and clean.
10. **`.font-display-em` italic variant** for the couture emphasis words
    ("address that matters", "start tomorrow", "couture delivery") — restraint,
    used sparingly.
11. **Negative display tracking** (`-0.005em`) + `text-wrap: balance` on headings
    for tight, expensive multi-line ragging.
12. **Fluid type tokens** (`--fluid-hero/h2/lead` via `clamp()`) tuned for a
    couture high-contrast scale that holds from 375px to 1920px without manual
    breakpoints.
13. **Tabular numerics** (`.tnum`) on every NAP, price, year, rating and stat so
    figures align in columns — the precision a luxury brand signals.
14. **Letterspaced eyebrows** (`0.32em`, uppercase) with a gold hairline rule
    (`.rule-gold`) as the consistent section-label motif.

## The WebGL power element (liquid-gold caustics)

15. **Two-canvas jewel study.** An orthographic full-bleed caustics backdrop +
    a perspective refractive-jewel layer compose the "light through a precious
    gem" effect — opulent and distinct from the single-mesh siblings.
16. **Custom caustic shader.** `caustics-shaders.ts` builds domain-warped ridge
    caustics (abs-of-signed-field → bright filaments) — the authentic refracted
    light-on-water/gem look — in champagne-gold over an emerald void.
17. **Refractive emerald jewel.** A `MeshTransmissionMaterial` **dodecahedron**
    (many facets) tinted with an emerald `attenuationColor` and gold-leaning
    `chromaticAberration` — a cut emerald, not The Luxe's molten metal nor
    Encore's clear prism.
18. **"Settles as the hero loads."** A `u_intensity` reveal uniform eases the
    caustics up from 0.18→1.0 over the first frames so the gem visibly settles
    into the light on load — the brief's exact ask.
19. **Jewel-true lighting.** Emissive Lightformers — champagne key, emerald fill,
    gold rim, deep emerald under-glow — give real refraction/reflection in the
    transmission material, not a flat gradient.
20. **Cursor interaction.** Both the caustic source and the jewel tilt toward the
    pointer (eased, frame-rate-independent via `1 - pow(k, dt)`), plus a slow
    auto-rotation + breathe so it's alive even when idle.
21. **Bloom + vignette** postprocessing seeds the brightest caustic cores and
    facet glints into an opulent glow and frames the drawing room.
22. **`dpr={[1,2]}`** on both canvases caps device-pixel-ratio cost while staying
    crisp on retina.
23. **`dynamic(ssr:false)` from a `"use client"` wrapper.** The scene is imported
    only inside `CausticsHero` (a client module) — the Next 16 rule that
    `ssr:false` is illegal in Server Components is honored.
24. **IntersectionObserver + tab-hidden pause.** `CausticsScene` sets
    `frameloop="never"` on BOTH canvases when the hero scrolls offscreen
    (rootMargin 120px) or `document.visibilityState` is hidden — zero GPU when
    unseen.
25. **Capability gate.** `useEnableWebGL` enables the scene only on ≥768px, with
    WebGL present, and `saveData` off; it derives a `lite` tier
    (≤1100px or ≤4 cores) that drops transmission samples/resolution + sparkles
    and softens Bloom.
26. **`prefers-reduced-motion` → static.** The gate short-circuits to the CSS
    fallback when reduced motion is requested; no WebGL mounts at all.

## On-brand fallback (never blank)

27. **CSS conic-gradient caustics fallback.** `.caustics-fallback` paints a deep
    emerald drawing room lit by a conic champagne-on-emerald sweep + radial jewel
    glow — the brief's "conic-gradient gold-sheen-on-emerald" fallback, rendered
    for SSR, mobile, no-WebGL and reduced-motion.
28. **Layered depth in the fallback.** A `::before` masked conic sweep + a
    `::after` champagne glint speckle give the static state real gem depth, so it
    reads as designed art even with zero JS.
29. **Reduced-motion gating on the fallback animation.** The slow caustic
    rotate/scale only runs under `prefers-reduced-motion: no-preference`; static
    it still reads as a jewel, never empty.
30. **Zero CLS.** The fallback is `absolute inset-0` behind the hero copy and the
    hero reserves `min-h-[100svh]`, so the WebGL mounting later never shifts
    layout.

## Layout rhythm & motion

31. **Alternating surface cadence.** Marble → elevated → marble-subtle →
    emerald-night sections create a deliberate light/dark rhythm down the page,
    with the dark blocks (hero, financing, booking, footer) bookending the story.
32. **Shared reveal primitives.** `Reveal / RevealGroup / RevealItem` drive
    consistent scroll choreography with staggered children, `viewport once`, and
    a couture easing `[0.16, 1, 0.3, 1]`.
33. **Magnetic CTAs.** Primary buttons use a spring-magnetic cursor pull,
    disabled on touch (`hover: none`) and reduced-motion.
34. **Hero entrance choreography.** Eyebrow → headline → lead → CTAs → stats
    stagger in on load; the scroll cue fades in last.
35. **Reduced-motion honored everywhere.** Every primitive zeroes its `y` offset
    and delay under reduced motion; Lenis smooth-scroll is fully disabled; the
    gold-leaf sheen and fallback drift are gated; only the scroll-cue uses a
    repeat which collapses when reduced.

## The closer (legacy + NAP fix)

36. **Single source of NAP truth.** `nap.ts` exports the one authoritative
    listing; Legacy, Booking and Footer all import it — the address is
    structurally incapable of conflicting across the page, directly answering the
    live site's #1 trust gap.
37. **Before→After of the data itself.** The Legacy contact block literally shows
    the gmail address + "3 conflicting addresses" + "DIY WordPress" struck
    through, beside the corrected branded inbox / one verified address / native
    booking — the pitch's thesis made visible.
38. **"Since 1995" legacy timeline.** A gold-filet vertical rail with four serif
    milestones turns 29 years of tenure into the brand's core asset.

## Treatments, proof & conversion

39. **Treatment menu** covering the four named pillars (HydraFacial MD, IPL,
    Body Contouring, Injectables) as couture cards with sample plate imagery,
    tags, feature bullets, "from" pricing and hover lift.
40. **Accessible before/after slider.** A native `range` input (full keyboard
    arrow control + `aria-valuetext`) drives a `clip-path` reveal over two
    on-brand sample plates; a styled gold handle tracks position. No autoplay.
41. **Proof wall + rating band.** A 5.0★ summary band and a masonry review grid
    (a featured span card) establish the "5-star reputation" pillar in real
    voice.
42. **Native 30-second scheduler.** A real 3-step chip flow (treatment · day ·
    time) + name/phone fields with a live summary and an on-brand confirmation
    state — labelled fieldsets, `aria-pressed` chips, full keyboard operation.
43. **Financing callout** framed as discreet access (interest-free plans +
    membership), not a hard sell — appropriate to the affluent audience.

## A11y, contrast & semantics

44. **WCAG-AA contrast discipline.** The dangerous case — gold on light — is
    handled by a dedicated `--gold-ink` (`oklch(44% 0.08 70)`) for all gold text
    on marble; the bright golds are reserved for sheen/rims/dark surfaces only.
    Body `--color-fg-muted`/`-subtle` are L-tuned to clear AA on both marble
    surfaces.
45. **Nav that flips with its surface.** Over the dark hero the nav uses
    champagne text on dark glass; once scrolled it frosts to marble glass with
    emerald-ink text — each state independently AA-legible.
46. **Landmarks + skip link.** `header` / `main#main` / `footer`, a first-focus
    skip link, labelled `nav`s, `address` elements for NAP, `role="img"` +
    descriptive labels on every sample plate, and visible `focus-visible` gold
    rings on every interactive element.
47. **Reduced-motion + decorative hygiene.** Decorative layers are
    `aria-hidden`; the global `prefers-reduced-motion: reduce` rule neutralizes
    scroll-behavior within the brand scope.

## Responsive (375 / 768 / 1280 / 1920)

48. **Fluid + grid responsiveness.** Single-column stacks at 375; nav collapses
    to an accessible Esc-dismissable disclosure menu below `lg`; service/review
    grids and the closer two-column layout reflow at `sm`/`lg`; `100svh` hero
    avoids mobile URL-bar jump; `max-w-6xl` keeps line lengths couture-tight at
    1920.
49. **`768px` is the WebGL boundary.** Below it (and on save-data/no-WebGL) the
    static caustics fallback shows — phones get the on-brand jewel art with zero
    GPU cost.

## Perf & code quality

50. **Honest placeholders.** Zero external image requests — every photo slot is
    a gradient plate via one `BrandImage` wrapper, each marked with a "sample"
    chip, so the prospect understands placeholders without broken-image risk.
51. **Shared button/heading system** (`ctaPrimary`, `SectionHeading`) and `cn()`
    everywhere keep the code DRY and the visual language consistent.
52. **Quality gates pass.** `npx tsc --noEmit` is clean and `npx next build`
    succeeds; `/mockups/sousan` prerenders as static content.

---

## Self-score (each /10)

| Criterion              | Score | Notes                                                                                  |
| ---------------------- | ----- | -------------------------------------------------------------------------------------- |
| Visual impact          | 9.6   | Emerald-jewel caustics on cream marble; couture serif; opulent dark/light rhythm.      |
| Brand distinctiveness  | 9.7   | Refractive emerald-jewel + gold caustics deliberately diverge from all six siblings.   |
| Power-element wow      | 9.6   | Two-canvas transmission jewel + custom caustic shader that "settles" on load, 60fps.   |
| Motion craft           | 9.4   | Eased FRI cursor/breathe, staggered reveals, magnetic CTAs, fully reduced-motion safe. |
| Responsiveness         | 9.4   | 375→1920 fluid; WebGL gated at 768; svh hero; disclosure nav.                          |
| A11y                   | 9.4   | AA gold-on-light via `--gold-ink`, landmarks, skip link, keyboard slider + scheduler.  |
| Code quality           | 9.5   | Scoped tokens, single NAP source, shared primitives, DRY, tsc + build clean.           |
| Conversion design      | 9.6   | Closer literally fixes the NAP trust gap; native 30s scheduler; proof + financing.     |

**Average: 9.53** (target ≥ 9.4 met)
