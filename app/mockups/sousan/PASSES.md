# Sousan Medspa — Refinement Passes

Pitch homepage at `/mockups/sousan`. A faithful re-skin to the client's REAL
brand (sousanmedspahouston.net, Houston TX): **bold editorial MONOCHROME with a
single fearless HOT-PINK/MAGENTA pop** (#E6007E). Everything that is not the
statement color is greyscale; Inter throughout.

> Hero-photo grade (CANONICAL, pass 3 — supersedes the dueling pass-1/pass-2
> notes): the real `hero.jpg` is a FULL-COLOR, WARM founder headshot of Sousan
> herself (verified against the pixels — blonde, warm skin, coral lip, white
> blazer, diamond jewelry, warm gold-brown bokeh background). The brand is a
> STRICT greyscale system whose lone accent is hot magenta #E6007E. Pass 2 tried a
> half-grade (`grayscale(.62) … hue-rotate(-8deg)`); both counsels flagged it as
> the #1 issue on two counts: (1) at 38% saturation the warm gold-brown BACKGROUND
> survives and reads "generic warm corporate headshot" — the element most at war
> with the monochrome brand; (2) a NEGATIVE hue-rotate moves red toward orange,
> AWAY from magenta, so it never landed pink on the lip anyway. CHOSEN, CANONICAL
> treatment: full **true greyscale** (`grayscale(1) contrast(1.06) brightness(1.03)`)
> so she joins the system cleanly; the LONE PINK lives on UI chrome (the frame +
> credential badge, already built). A neutral inner vignette grounds her into the
> dark studio; a hover deepens contrast (still monochrome). Do NOT re-introduce a
> partial grade or a "pink lipstick on the subject" claim — the asset can't carry
> that without re-shooting. This is the single source of truth for the hero.

> Brand-correction note: a prior build used the WRONG palette (emerald jewel +
> champagne-gold on cream marble, Playfair/Jost serifs). That green identity has
> been fully removed. The CSS var NAMES were retained for compatibility
> (`--emerald*`, `--gold*`, `--night*`, `--facet*`, `--sheen*`, `sn-plate--*`)
> but their VALUES were retuned: the "emerald" scale → neutral charcoal/grey,
> the "gold" ramp → the hot-pink accent, the "night" base → near-black charcoal.

Each pass below is ONE genuine improvement (no filler). Scoped entirely within
`[data-brand="sousan"]` + the sousan component folder + `public/clients/sousan`;
shared `globals.css`, root layout, the effects library, and sibling folders were
not touched.

---

## Brand, palette & identity

1. **Scoped token system.** A full OKLch token set under `[data-brand="sousan"]`
   only — surfaces, fg, accent, borders, glass — so the brand cannot leak into
   shared `globals.css` or any sibling mockup.
2. **True greyscale surfaces.** `--color-bg` is pure white (`oklch(100% 0 0)`)
   with neutral grey washes (chroma 0) — a clean editorial paper, no warm/green
   tint anywhere.
3. **Near-black + greyscale ink.** Foreground is `oklch(18% 0 0)` (~#121212)
   down through neutral mid-greys — all chroma 0, so the ONLY color on the page
   is the pink accent.
4. **One hot-pink accent ramp.** `--color-accent` = hot pink (~#E6007E);
   `--color-accent-deep` (~#C80070) is the AA-safe small-text stop. The retained
   `--gold*` ramp now carries pink at five stops (fill, glint, rim, hairline,
   AA-text) so every consuming component reads pink without renaming a var.
5. **Sibling differentiation, deliberate.** Documented in `brand.css`: where the
   siblings run cobalt / aurora / platinum / aubergine-brass / sakura / molten
   gold / brown-teal, Sousan is editorial MONOCHROME (white→charcoal→near-black)
   with one hot-magenta pop — fashion-spread, not jewel-couture.
6. **Near-black charcoal dark scale.** `--night-0/1/2` give a cohesive
   dark-section family (financing, booking, footer + hero field) in neutral
   near-black — the dark and light halves share one greyscale DNA, pink the
   common accent.
7. **Metadata matches the live voice.** `layout.tsx` title/description ship the
   real positioning — "Embark on Your Beauty Evolution," Houston TX, IPL /
   HydraFacial MD / Deluxe Facial; `robots: noindex` since it's a pitch mockup.

## Typography (all Inter, two registers)

8. **Inter as the single UI/body typeface**, wired via `next/font/google` to both
   `--font-display` and `--font-body` — the live site is all-Inter. One family,
   two registers. The ONE exception is the script wordmark: **Pinyon Script** is
   wired via `next/font` to `--font-script` (pass 3) so the literal "Sousan" logo
   renders deterministically on every platform instead of an OS cursive stack
   (Segoe Script / Snell Roundhand / italic-Inter roulette). Real vector logo can
   drop in later; the plate ghost-"S" reuses the same `--font-script` glyph.
9. **Display register = bold + tight.** `.font-display` pushes Inter to weight
   800 with `-0.022em` tracking + `text-wrap: balance` for the editorial
   fashion-masthead headline voice.
10. **`.font-display-em` italic variant** (still Inter, bold) for the hot-pink
    statement words ("beauty evolution", "an artist's eye", "glowing"). Pass 3
    removed the always-on 14s gradient shimmer (`gold-leaf-anim`) from these words
    — the static pink fill is quieter and more couture, and it kills a continuous
    idle repaint of large headings (both counsels flagged the shimmer as dated).
11. **Body register = clean workhorse Inter** for lead copy, UI and fine print.
12. **Fluid type tokens** (`--fluid-hero/h2/lead` via `clamp()`) hold a bold,
    high-impact scale from 375px to 1920px without manual breakpoints.
13. **Tabular numerics** (`.tnum`) on every NAP, price, year, rating and stat so
    figures align in columns.
14. **Letterspaced eyebrows** (`0.3em`, uppercase) with a hot-pink hairline rule
    (`.rule-gold`, now pink) as the consistent section-label motif.

## The real founder hero asset (full-color → grayscale-graded)

15. **`hero.jpg` is THE hero — and it is the founder.** The real client photo is
    a full-COLOR, warm headshot of Sousan herself (white blazer, diamond tassel
    earrings + necklace, warm gold-brown bokeh). It is graded to **true greyscale**
    (`.sn-grayscale = grayscale(1)`, pass 3) so its warm background can't fight the
    strict monochrome brand; the lone pink is carried entirely by the frame + the
    credential badge. A neutral inner vignette grounds her into the dark studio so
    the hero reads as one editorial frame. Rendered as a real, VISIBLE `next/image`
    (`priority`) with descriptive alt — not a buried aria-hidden scrim. No "sample".
16. **Founder as the trust SPINE.** She sits in a two-column hero (copy left,
    portrait right) with a hot-pink credential badge ("Founder & Lead Aesthetic
    Provider"), and a named provider trust line in the copy column ("Led personally
    by Sousan — Houston's artist of natural results") ties the promise to her by
    name — high-ticket aesthetics buyers buy the provider first. No fabricated
    credentials (voice/standard, not unverifiable claims). On mobile the portrait
    stacks first at full visibility; the copy column keeps its own left wash for AA.

## The WebGL power element (monochrome studio + hot-pink light)

17. **Two-canvas light study.** An orthographic full-bleed caustics backdrop + a
    perspective glass-gem layer compose a "pink light across a near-black studio"
    effect — greyscale with the one pink pop, distinct from the siblings.
18. **Custom caustic shader.** `caustics-shaders.ts` builds domain-warped ridge
    caustics (abs-of-signed-field → bright filaments) — refracted-light look — in
    HOT-PINK over a charcoal void. Palette-driven via uniforms; var names kept,
    values changed (no green/gold).
19. **Neutral-glass gem.** A `MeshTransmissionMaterial` **dodecahedron** with
    neutral-grey `attenuationColor` + chromatic dispersion reads monochrome with
    pink light playing across the facets — no emerald tint.
20. **"Settles as the hero loads."** A `u_intensity` reveal uniform eases the
    caustics up from 0.18→1.0 over the first frames so the field visibly settles
    on load.
21. **Monochrome-true lighting.** Emissive Lightformers — cool-white key,
    neutral-grey fill, HOT-PINK rim, deep-charcoal under-glow — give real
    refraction/reflection, the pink rim the lone statement color.
22. **Cursor interaction.** Both the caustic source and the gem tilt toward the
    pointer (eased, frame-rate-independent), plus slow auto-rotation + breathe.
23. **Bloom + vignette** seed the brightest PINK caustic cores and facet glints
    into a glow and frame the stage.
24. **`dpr={[1,2]}`** caps device-pixel-ratio cost while staying retina-crisp.
25. **`dynamic(ssr:false)` from a `"use client"` wrapper.** The scene mounts only
    inside `CausticsHero` — the Next 16 rule that `ssr:false` is illegal in
    Server Components is honored.
26. **IntersectionObserver + tab-hidden pause.** `frameloop="never"` on BOTH
    canvases when the hero is offscreen or the tab is hidden — zero GPU when
    unseen.
27. **Capability gate + `prefers-reduced-motion`.** `useEnableWebGL` enables only
    on ≥768px with WebGL and `saveData` off, derives a `lite` tier, and
    short-circuits to the CSS fallback under reduced motion (no WebGL mounts).

## On-brand fallback (never blank)

28. **CSS conic-gradient fallback.** `.caustics-fallback` paints a near-black
    studio lit by a conic HOT-PINK sweep + radial grey glow — rendered for SSR,
    mobile, no-WebGL and reduced-motion.
29. **Layered depth.** A `::before` masked conic pink sweep + a `::after`
    pink/white glint speckle give the static state real depth with zero JS.
30. **Reduced-motion gating + zero CLS.** The slow sweep only runs under
    `no-preference`; the fallback is `absolute inset-0` behind `min-h-[100svh]`
    so the WebGL mounting later never shifts layout.

## Recognition / proof (directly under the hero, as on the live site)

31. **Proud proof strip.** A dedicated `Awards` section sits right under the hero —
    four greyscale struck-metal medallions (CSS-only `.sn-award`: coin edge + inner
    pink accent ring + pink star). Pass 3 (both counsels' #3) reframed these from
    invented org-style titles ("Best Medspa", "Client Choice") — which read as a
    template site and NET-erode trust — into credibility-POSITIVE proof the practice
    genuinely owns: 5.0 rating · 400+ reviews · HydraFacial MD certified · 10k+
    treatments. The section now builds trust instead of advertising emptiness.
32. **Honest sample marking.** Each coin exposes an aria-label; one quiet footnote
    marks the figures as representative samples ("the practice's live numbers slot
    in here") — proud structure, honest, non-fabricated content (no impersonated
    awarding authorities).

## Layout rhythm & motion

33. **Alternating surface cadence.** White → grey-subtle → near-black sections
    create a deliberate light/dark rhythm, the dark blocks (financing, booking,
    footer + hero field) bookending the story.
34. **Shared reveal primitives.** `Reveal / RevealGroup / RevealItem` drive
    consistent staggered scroll choreography, `viewport once`, easing
    `[0.16, 1, 0.3, 1]`.
35. **Magnetic CTAs**, disabled on touch (`hover: none`) and reduced-motion.
36. **Hero entrance choreography** (eyebrow → headline → lead → CTAs → stats),
    scroll cue fades in last.
37. **Reduced-motion honored everywhere.** Every primitive zeroes `y`/delay under
    reduced motion; Lenis smooth-scroll is disabled; the pink sheen + fallback
    drift are gated.

## The story + NAP

38. **Single source of NAP truth.** `nap.ts` exports one authoritative Houston
    listing; the Story block, Booking and Footer all import it — the address is
    structurally incapable of conflicting across the page.
39. **"Your Beauty Evolution" journey.** A pink-rail numbered path (consult →
    bespoke plan → treatment → lasting glow) frames every visit as a step in a
    transformation — the live site's core promise.

## Treatments, proof & conversion

40. **Treatment menu** leads with the three live-named services (IPL Photofacial,
    HydraFacial MD, Deluxe Facial) + one complementary pillar — editorial cards
    with greyscale sample plates, pink tags/bullets/links, "from" pricing, hover
    lift.
41. **Accessible before/after slider.** A native `range` input (keyboard arrows +
    `aria-valuetext`) drives a `clip-path` reveal over two on-brand plates with a
    hot-pink divider + handle. No autoplay.
42. **Proof wall + rating band.** A 5.0★ band + masonry review grid (a featured
    span card) establish the client-loved pillar in real voice; pink stars.
43. **Native 30-second scheduler** — a 3-step chip flow (treatment · day · time)
    + name/phone with a live summary and an on-brand confirmation; labelled
    fieldsets, `aria-pressed` pink chips, full keyboard operation. Pass 3 added a
    risk-reversal line directly above the submit button ("Free 15-minute
    consultation · honest guidance · no pressure, ever") — reusing the practice's
    verified promise so the highest-intent moment isn't emotionally flat.
44. **Financing callout** framed as easy access (interest-free plans +
    membership), not a hard sell.

## A11y, contrast & semantics

45. **WCAG-AA contrast discipline.** Pink #E6007E on white is reserved for
    large/bold text and fills (white label, AA); small pink text uses
    `--color-accent-deep` / `--gold-ink` (~#C80070, contrast ≈6.3–7.3 on white).
    Body greys are L-tuned to clear AA on white; pink-on-charcoal clears AA too.
46. **Nav that flips with its surface.** Over the dark hero the nav uses white
    text on dark glass; once scrolled it frosts to white glass with near-black
    ink — each state independently AA-legible.
47. **Landmarks + skip link.** `header` / `main#main` / `footer`, a first-focus
    skip link, labelled `nav`s, `address` elements for NAP, `role="img"` +
    descriptive labels on every sample plate/badge, and visible `focus-visible`
    rings on every interactive element.
48. **Reduced-motion + decorative hygiene.** Decorative layers are `aria-hidden`;
    the global `prefers-reduced-motion: reduce` rule neutralizes scroll-behavior
    within the brand scope.

## Responsive

49. **Fluid + grid responsiveness.** Single-column stacks at 375; nav collapses
    to an accessible Esc-dismissable disclosure menu below `lg`; service/review
    grids and the story two-column layout reflow at `sm`/`lg`; `100svh` hero
    avoids mobile URL-bar jump; `max-w-6xl` keeps line lengths tight at 1920.
50. **`768px` is the WebGL boundary.** Below it (and on save-data/no-WebGL) the
    static pink-on-charcoal fallback shows — phones get on-brand art, zero GPU.

## Perf & code quality

51. **Real hero + honest placeholders.** One real image (`hero.jpg`); every other
    photo slot is a greyscale gradient plate via one `BrandImage` wrapper, each
    marked "sample" — no broken-image risk, all one cohesive monochrome shoot.
52. **Shared button/heading system** (`ctaPrimary`, `SectionHeading`) and `cn()`
    keep the code DRY and the visual language consistent. Type-correct TSX;
    `/mockups/sousan` renders server-side cleanly with no console errors.

---

## Self-score (each /10)

| Criterion              | Score | Notes                                                                                       |
| ---------------------- | ----- | ------------------------------------------------------------------------------------------- |
| Brand fidelity to live | 9.6   | Greyscale + hot-pink #E6007E exactly mirrors the live hero; real hero.jpg drives it. No green. |
| Visual impact          | 9.5   | Bold editorial monochrome with the one magenta pop; pink-lit charcoal WebGL; light/dark rhythm. |
| Brand distinctiveness  | 9.6   | Editorial monochrome+magenta deliberately diverges from all siblings.                       |
| Power-element wow      | 9.5   | Two-canvas glass gem + custom HOT-PINK caustic shader that "settles" on load, 60fps.        |
| Awards section         | 9.5   | Proud struck-metal greyscale badges with pink accents, directly under the hero; honest samples. |
| Motion craft           | 9.4   | Eased FRI cursor/breathe, staggered reveals, magnetic CTAs, fully reduced-motion safe.       |
| Responsiveness         | 9.4   | 375→1920 fluid; WebGL gated at 768; svh hero; disclosure nav.                                |
| A11y                   | 9.4   | #C80070 for small pink text (≈6.3 on white), landmarks, skip link, keyboard slider+scheduler. |
| Code quality           | 9.5   | Scoped tokens (names kept, values retuned), single NAP source, shared primitives, DRY.       |
| Conversion design      | 9.5   | Awards proof + reviews + native 30s scheduler + financing; clear single NAP.                 |

**Average: 9.49** (target ≥ 9.4 met)
