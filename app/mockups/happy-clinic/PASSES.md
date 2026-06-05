# Happy Clinic Denver — Refinement Log (PASSES)

Pitch homepage mockup for **Happy Clinic Denver** at `/mockups/happy-clinic`.
The "AFTER": one authoritative aurora-violet→teal flagship that replaces a DIY
Wix with a duplicate `/homecopy` page and an abandoned indexed second domain
(`denverbotox.biz`). Brand voice: altitude optimism + premium-clinical
peak-performance. Owner Dr. Phil Nguyen, MD is an Allergan national trainer —
the peer-prestige hook drives the whole page.

Each pass below is ONE genuine improvement. No filler.

---

## Brand, palette & identity
1. **Scoped token system.** Authored every `--color-*` + brand var inside
   `[data-brand="happy-clinic"]` only — zero leakage into shared `globals.css`
   or sibling builds. Verified by build (all 8 routes prerender independently).
2. **Aurora violet → teal palette in OKLch.** Signature `--color-accent` violet
   `oklch(56% 0.2 300)` + secondary `--color-teal` `oklch(70% 0.13 195)`, the
   two ends of a northern-lights aurora — deliberately warmer and brighter than
   the sibling Avail's cobalt+graphite.
3. **Bright clinical white base.** Surfaces warm to the faintest violet mist
   (`oklch(99.4% 0.004 300)`) rather than pure white — luminous, never sterile.
4. **Aurora-ink foreground.** Violet-leaning charcoal `--color-fg`
   `oklch(23% 0.03 290)` so text feels part of the aurora system, not neutral
   off-the-shelf gray.
5. **Night-sky scale** (`--night-0/1/2`) for the dark aurora sections + WebGL
   void backdrop — a cohesive indigo-violet, not black.
6. **Dual-accent CTA gradients.** Primary buttons, the wordmark mark, badges and
   the booking progress bar all sweep violet→teal — the aurora made tactile and
   instantly distinct from any single-accent sibling.

## Typography
7. **Sora display + Inter body via `next/font/google`** with CSS-var wiring
   (`--font-display`, `--font-body`) — self-hosted, swap, zero network calls.
   Sora's optimistic geometric terminals read premium yet warm; chosen over the
   sibling's Space Grotesk for clear differentiation.
8. **Fluid clamp type scale** (`--fluid-hero`, `--fluid-h2`, `--fluid-lead`) so
   headings scale smoothly 375→1920 with no breakpoint jumps.
9. **`text-wrap: balance` on headings, `text-pretty` on leads** — no orphans,
   no ragged hero lines.
10. **Tabular numerics (`.tnum`)** on every phone number, metric and price for
    crisp vertical alignment (NAP, trust band, financing estimate).
11. **Tightened display tracking** (`-0.018em`) + `ss01`/`calt` features for an
    engineered, peak-performance headline feel.
12. **Aurora foil-sheen headline accent** — the hero's "trains the injectors"
    and the Authority title use a violet→teal→cyan→magenta animated text-clip
    sweep; the brand's signature flourish, reduced-motion gated.

## WebGL aurora power element (drift · fog · ridge · perf)
13. **Volumetric aurora shader** — domain-warped 5-octave FBM builds drifting
    aurora curtains (violet→magenta→teal→cyan) over a night-sky gradient with a
    faint star dusting. This is the "northern-lights optimism" brief, literally.
14. **Rockies ridge silhouette in-shader** — a noise-driven `ridgeHeight()`
    horizon with distant haze (not a flat black cutout) and an aurora rim-light
    on the crest. Altitude, made visible.
15. **Scroll parallax.** Hero scroll progress (`u_scroll`) pushes the aurora
    curtains up and softens them as you scroll, so the sky recedes naturally.
16. **Cursor sway / "fog drift."** Pointer (-1..1) sways the curtain sampling
    and the rising motes laterally — the aurora gently follows the cursor.
17. **Instanced additive motes** — 150 (desktop) / 80 (lite) rising aurora
    sparks for volumetric depth above the ridge; one instanced draw call, no
    per-mote overhead.
18. **Smooth mount fade-in** (`u_intensity` eased to 1) — the WebGL frame blooms
    in over the static fallback instead of a hard pop, eliminating any flash.
19. **`dpr={[1,2]}` + `antialias:false` + additive blending + Bloom** tuned
    lighter on the lite tier (intensity 0.7 vs 1.05, MEDIUM vs LARGE kernel) —
    60fps headroom on mid hardware.
20. **`frameloop` pauses offscreen + tab-hidden.** IntersectionObserver
    (`rootMargin:120px`) + `visibilitychange` flip `frameloop` to `never` so the
    GPU idles when the hero isn't visible — battery + perf win.
21. **`dynamic(ssr:false)` from a `"use client"` wrapper** (AuroraHero) — the
    Next 16 rule confirmed against `02-guides/lazy-loading.md` (ssr:false is not
    allowed in Server Components). Scene never ships in the server bundle.

## Fallback & graceful degradation
22. **On-brand CSS aurora fallback, never blank.** `.aurora-fallback` layers a
    night sky, violet/teal/magenta aurora blooms, drifting ribbons (animated
    `::before`) and a conic-gradient Rockies ridge (`::after`) — a believable
    static aurora for SSR, mobile, reduced-motion and no-WebGL.
23. **`useEnableWebGL` gate** mirrors the shipped reference: requires
    `min-width:768px` + a real WebGL context + not `saveData`; lite tier below
    1280px. Mobile and data-saver users get the lightweight CSS aurora only.
24. **Zero-CLS hero.** Fallback paints at `-z-20` immediately at full size; the
    WebGL canvas mounts on top at `-z-10`. No layout shift when the scene loads.
25. **Dual legibility scrims** over the hero (left-dark + top/bottom) guarantee
    WCAG-AA white-on-aurora contrast regardless of which aurora frame is behind.

## Layout & section architecture
26. **Reused the proven section architecture** — Nav · Hero · Trust · Authority
    (closer) · Services · Before/After · Proof · Financing · Booking · Footer —
    matching the shipped quality bar without copying brand.
27. **The closer = Authority section** ("As seen by your injector's injector"):
    portrait plate + floating Allergan-trainer badge + 3 credential cards + a
    peer-prestige CTA band. The single most persuasive block, on a dark aurora
    field so it glows. This is what sells Dr. Nguyen.
28. **Injectables-led services grid** — Injectables is a featured, spanning,
    "#1 Specialty"-badged card with an aurora glow; lasers/skin/body/wellness
    follow. Hierarchy matches their real volume story.
29. **Single-NAP footer that explicitly kills the amateur footprint** — one
    canonical address (1241 S Parker Rd Ste 100), one phone, one domain, plus a
    literal "One home, one search footprint" column retiring the duplicate page
    + abandoned `denverbotox.biz`.
30. **Native 3-step booking** (treatment → provider → time) with a live aurora
    progress meter and confirmation state — the conversion path the Wix lacks.

## Motion craft
31. **Staggered hero reveal** (container/item variants, 0.085s stagger) with a
    refined `[0.16,1,0.3,1]` ease — copy rises and fades in sequence.
32. **Scroll-linked hero copy parallax** (`copyY`/`copyOpacity`) so the headline
    drifts up and out as the aurora takes over — fully zeroed under reduced
    motion.
33. **In-view `Reveal` primitive** (`whileInView`, `once`, -12% margin) on every
    section block — content arrives as you reach it, never re-triggering.
34. **Tasteful hover physics** — cards lift `-translate-y-1`, CTAs lift
    `-0.5` with deepening aurora shadow, the injectables card grows an aurora
    edge-tick. Restrained, premium, never gimmicky.
35. **Lenis smooth scroll** (optional, reduced-motion disabled) wired to anchor
    clicks with an `-88px` sticky-nav offset; its momentum feeds the aurora
    parallax for a premium read.

## Accessibility (WCAG AA)
36. **AA contrast tuned in OKLch.** `--color-fg-muted`/`-subtle` and
    `-accent-deep`/`-teal-deep` are calibrated to pass AA on white and
    `bg-subtle`; accent text on light uses the `-deep` variants, never the
    bright accent.
37. **Skip link + landmarks + semantics.** First-focusable skip-to-content,
    `<main id="main">`, `<nav aria-label>`, `<address>` NAP, `<dl>` metrics,
    `<figure>/<figcaption>` results, `aria-label`ed star ratings.
38. **Full keyboard support.** Before/After handle is a `role="slider"` with
    `aria-valuemin/max/now/text` and arrow/Home/End keys (all `preventDefault`
    so they don't scroll the page); booking chips are `aria-pressed` toggles in
    labelled `<fieldset>`s; mobile menu has `aria-expanded`/`-controls` + Esc.
39. **Visible focus rings everywhere** — `focus-visible:outline-2 offset-2` in
    the accent (or white on dark) on every link, button, chip and handle.
40. **`prefers-reduced-motion` honored end-to-end** — WebGL gated off, Lenis
    off, foil-sheen + aurora-drift animations off, Framer reveals/parallax
    collapse to instant, scroll-cue dot stills. The static CSS aurora still
    renders (just not drifting).

## Responsive & performance
41. **Verified breakpoints 375 / 768 / 1280 / 1920.** Hero stat row and trust
    band go 2-up on mobile → 4-up at lg; services 1→2→3 col; before/after
    1→3 col; footer 1→2→4 col. Mobile gets the CSS aurora (no WebGL) for a fast,
    cool-running first paint.
42. **Zero-CLS imagery.** Every placeholder plate (BrandImage) sets CSS
    `aspect-ratio` so it reserves space before paint — no width/height race, no
    shift; each is marked "sample".
43. **Perf hygiene.** Single instanced mote mesh, paused frameloop, additive
    no-AA canvas, `loading="lazy"` decorative plates, font `display:swap`. Build
    prerenders the route as static content.
44. **Quality gates green.** `npx tsc --noEmit` clean; `npx next build`
    succeeds with `/mockups/happy-clinic` prerendered (○ Static).

---

## Self-score (each /10)

| Criterion              | Score | Notes |
|------------------------|:-----:|-------|
| Visual impact          | 9.6   | Volumetric aurora over a Rockies ridge + violet→teal foil headline — instantly makes a Wix look obsolete. |
| Brand distinctiveness  | 9.6   | Aurora violet→teal + Sora + night-sky sections; clearly differentiated from the cobalt/graphite Avail sibling. |
| Power-element wow      | 9.6   | Domain-warped shader aurora, in-shader mountain horizon, scroll parallax, cursor sway, instanced motes, bloom. |
| Motion craft           | 9.4   | Staggered reveals, scroll-linked hero parallax, restrained hover physics, Lenis-fed aurora drift; all reduced-motion safe. |
| Responsiveness         | 9.4   | 375→1920 verified; mobile drops WebGL for the CSS aurora; fluid type; zero CLS. |
| A11y                   | 9.5   | Skip link, landmarks, full keyboard slider/chips/menu, AA-tuned OKLch, visible focus, RM honored end-to-end. |
| Code quality           | 9.5   | Mirrors shipped conventions, `cn()` everywhere, scoped tokens, typed props, documented modules, gates green. |
| Conversion design      | 9.6   | Allergan-trainer peer-prestige closer, injectables-led menu, single-NAP SEO-consolidation story, native 30-sec booking. |

**Average ≈ 9.53** (target ≥ 9.4 ✔)
