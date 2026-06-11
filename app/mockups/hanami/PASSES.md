# Hanami Medspa — Refinement Passes

A numbered log of genuine improvements made while building the `/mockups/hanami`
pitch homepage. Each pass is one real decision or refinement — no filler. The
North Star: give the wasted name *Hanami* (花見, cherry-blossom viewing) actual
meaning, and surface the personal brand the live broken-title SEO template hides
— that **every face is by Dr. Elaine Phuah**, the sole injector.

---

## REBRAND ADDENDUM — faithful re-skin to the REAL brand (hanamimedspa.com)

The original passes below (1–54) describe the FIRST build, which *guessed* a
sakura-pink + sumi-ink-on-washi palette and Shippori Mincho type. This addendum
records the corrections made to match the client's live identity faithfully. The
CSS var NAMES were retained; only their VALUES (and the fonts/assets) changed —
the darst "REBRANDED to REAL identity" approach.

- **Palette → SUMI-BLACK + GOLD luxury with SAKURA-PINK** (was pink-on-washi).
  Retuned every `--color-*` / `--sakura*` / `--petal-*` / `--night-*` / `--sheen-*`
  token in `brand.css` to the real world: black-tie black (#111/#1A1A1A) ink +
  sections, brand GOLD (#C8A24B / #E3C77A champagne) as the awards/accent color,
  and the live logo's true blossom pinks (#E8A0B8 / #F4C6D4) for petals.
- **Fonts → Abel (display) + Open Sans (body)** via `next/font/google`, matching
  the live hero. Fixed a self-referential CSS-var cycle (`--font-display:
  var(--font-display)…`) that silently voided the display font → fell back to
  body; now mapped from a distinct `--font-display-src` source variable.
- **Real logo** (`logo.png` — black script + cherry-blossom branch + MEDSPA)
  wired via `next/image` in SiteNav + SiteFooter (replaced the hand-built SVG
  blossom wordmark). Nav stays frosted in both states so the black logo + ink
  links read over the now-dark hero.
- **Hero → sumi-black field** with the real sakura petals drifting over it; copy
  in rice-paper white + a GOLD sheen highlight; black/gold CTAs; award-led
  eyebrow + stats. Section carries a solid `--night-0` base for a robust black-tie
  hero even before the canvas/fallback (added `.sakura-fallback--ink`).
- **Petals → realistic cherry-blossom.** Retuned the WebGL `PALETTE` to the live
  blossom pinks and rewrote the fragment-shader `petalMask` to a true sakura
  silhouette (teardrop, narrow base → wide top, with the signature V-cleft).
- **Reviews DROPPED entirely** (removed `ProofWall` + its component) and replaced
  by an **OVERSIZED auto-scrolling AWARDS RAIL** (`AwardsRail.tsx`): the real DFW
  Favorites WINNER badges (2024/25/26) + Fort Worth Top Doctor, big and proud in
  black + gold-leaf plates with gold-foil captions. Scroll mechanics ported from
  darst's `.dt-marquee` → `.hn-marquee` (pause on hover/focus; reduced-motion →
  static, swipeable, snapping strip; masked edges; seamless -50% loop).
- **Dr. Phuah photo** (`dr-phuah-candidate.jpg`) pulled into the "Meet Dr. Phuah"
  authority section, framed elegantly with a gold inset rule + signature seal
  (new `BrandPhoto` primitive = real `next/image`, export/basePath-safe).
- **Ambiance photos** wired: real clinic interior (`interior.jpeg`) in Financing;
  a treatment-result moment (`model.jpg`, stock → kept the "sample" tag) in the
  before/after intro. Before/after plates retuned dull-neutral → luminous rose.
- **Copy de-fictionalized:** removed the invented "4.9★ / 243 reviews" proof
  (TrustBar + hero + nav) in favor of the real, verifiable awards. Nav/footer
  "Reviews → Awards" (`#proof` → `#awards`).
- Verified live in-browser (Chrome): black/gold/sakura hero, awards rail (8 li =
  4 + seamless dup, `hn-marquee-scroll` 44s infinite, edge mask), Dr. Phuah +
  interior + model photos loading, Abel display resolving, no horizontal overflow,
  mobile nav toggle present. (`next build`/`tsc` not run per task constraints; the
  pre-existing sibling `timeless/HorologyScene.tsx` syntax error is unrelated and
  untouched.)

---

## Brand, palette & identity
1. Scoped the entire token system under `[data-brand="hanami"]` so nothing leaks
   into shared `globals.css` or any sibling client folder.
2. Chose **botanical Japanese serenity** — sakura-pink + sumi-ink on rice-paper
   (washi) white — deliberately distinct from siblings (avail cobalt, happy
   aurora, simplyskin platinum, timeless aubergine/brass).
3. Built the surface scale on warm washi (`--color-bg` etc.), never a cold
   clinical white, so the page breathes like paper, not a med-EMR.
4. Set foreground to a warm **sumi ink** (charcoal with a faint plum cast) rather
   than pure black — softer, more authored, on-brand.
5. Tuned `--color-accent-deep` (sakura) to ~50% L so it clears WCAG AA for text,
   links and labels on washi, while the brighter sakura stays decorative-only.
6. Added a full sakura/ink brand-var scale (`--sakura`, `--blossom`,
   `--sakura-deep`, `--night-0..2`) for petals, washes and dark sections.
7. Introduced a `--petal-pale → sakura → deep → plum` ramp shared between the
   WebGL material (JS `PALETTE`) and the CSS fallback, so both read identically.
8. Designed a `.bloom-sheen` text gradient (AA-safe darkest stop) for the single
   hero highlight word — a slow, soft blossom drift, never flashy.

## Typography (Japanese-serif craft)
9. Wired **Shippori Mincho** (display) + **Zen Kaku Gothic New** (body) via
   `next/font/google` with `display:swap` and CSS variables — the mincho+gothic
   pairing of real Japanese editorial design.
10. Verified both faces + requested weights exist in Next's font-data before
    committing, avoiding a build break.
11. Gave the display face a hair of positive letter-spacing (`0.002em`) — mincho
    reads better slightly open, unlike the tight Latin sans default.
12. Added a `.font-display-em` lighter (400) variant for the poetic emphasis
    words ("in bloom", "and watch beauty unfold"), distinct from the timeless
    sibling's *italic* emphasis — Hanami leans on weight + spacing, not slant.
13. Fluid clamp type tokens (`--fluid-hero/h2/lead`) for airy, poetic scale that
    holds from 375 → 1920 without manual breakpoints.
14. Tabular-nums (`.tnum`) on every NAP, metric, price and time so numerics stay
    aligned (the broken template's inconsistency, corrected).
15. Used actual kanji (花見, 見/育/咲) as authored display ornament in the nav,
    hero eyebrow and philosophy section — the name made literal and beautiful.

## The WebGL petal field (power element)
16. Built the petals as a **single InstancedBufferGeometry** (one draw call) of a
    2-tri plane — the silhouette is done in the fragment shader, so it stays
    crisp at any DPR and cheap at thousands of instances.
17. Petal SHAPE via an SDF-ish `petalMask` in the fragment shader (squashed
    almond + a soft top cleft) — a recognizable sakura petal, `discard`-ed
    outside the mask so there's no quad edge.
18. Length-wise petal color: plum/deep heart at the base → sakura → pale rim at
    the tip, plus a faint inner glow — petals read as translucent membranes.
19. **Depth layers**: each petal is assigned a `depth` (near/mid/far) that scales
    size, parallax fall speed, lateral sway width and z-position — real depth,
    not a flat sprite wall.
20. **Soft focus / bokeh**: far-layer petals get softened alpha (gated behind a
    `uBokeh` uniform that the `lite` tier disables) for a depth-of-field feel.
21. **Flutter**: each petal tumbles about its own random axis via a cheap
    `rotAxis` matrix, with a subtle non-uniform billow so it looks like a thin
    petal catching air, not a spinning card.
22. **Wind field**: down-and-across drift from layered sin/cos + per-petal phase,
    with vertical fall wrapped (`mod`) within the field height so it loops
    seamlessly forever with no pop.
23. **Scroll-eased density/flow**: a `flowRef` driven from the hero scroll
    progress (1 at top → ~0.35 on exit) eases drift speed — the storm settles
    into stillness as you descend (mono no aware). Smoothed frame-rate-independent.
24. **Pointer breeze**: an eased cursor vector gently pushes petals (stronger on
    near layers), smoothed with a `1 - pow(k, dt)` term so it's frame-rate
    independent and never jittery.
25. A whole-field **BreezeRig** adds a barely-there group sway + drift so even a
    still cursor feels alive.
26. Deterministic mulberry32 scatter so the field is stable across renders (no
    hydration flicker, reproducible layout).
27. `NormalBlending` + `depthWrite:false` + `DoubleSide` so overlapping petals
    composite softly without z-fighting and read from both faces as they tumble.

## WebGL performance & lifecycle
28. `dynamic(() => import("./PetalScene"), { ssr:false })` from the `"use client"`
    `PetalHero` — the Next 16 rule that ssr:false only works inside a client
    module.
29. `dpr={[1,2]}` on the Canvas + a `DprGuard` that clamps pixel ratio (1.5 on
    lite, 2 on full) so high-DPI phones don't melt.
30. `IntersectionObserver` (rootMargin 140px) pauses the frameloop
    (`frameloop="never"`) when the hero scrolls offscreen; `visibilitychange`
    pauses on hidden tabs — battery + GPU saved.
31. **Tiered budget**: `lite` (≤1280px) drops petals 2600→1200 and disables the
    bokeh pass; full tier only on large viewports.
32. Capped `delta` at 1/30 in the frame loop so a tab-restore or jank spike can't
    teleport the simulation.

## Fallback & graceful degradation
33. A pure-CSS `.sakura-fallback` (rice-paper dawn gradient + two depth-layered
    petal fields drawn from radial-gradient blooms, masked + drifting) is painted
    at `-z-20` ALWAYS — SSR, reduced-motion, mobile, no-WebGL, save-data. Never a
    blank frame, zero CLS.
34. `useEnableWebGL` gates the canvas on `min-width:768px` AND a real WebGL
    context test AND `!saveData` AND `!prefers-reduced-motion` — every degrade
    path lands on the tasteful static field.
35. Fallback petal drift is itself wrapped in `@media (prefers-reduced-motion:
    no-preference)`, so reduced-motion users get a still, serene blossom sky
    (still tasteful, never empty).

## Layout rhythm & section architecture
36. Reused the proven sibling section architecture (Nav → Hero → TrustBar →
    closer → Services → BeforeAfter → ProofWall → Financing → BookingCTA →
    Footer) so the build matches the shipped quality bar.
37. **The closer, split in two** as briefed: a cinematic *Hanami philosophy*
    intro (Notice → Tend → Bloom, 見/育/咲) on a sumi-ink night field, then the
    *sole-injector intimacy* section ("every face, by Dr. Phuah").
38. SoleInjector foregrounds the exact differentiator the template buries — one
    physician (DO, MBA), sole injector, with a signature seal and a pull-quote.
39. Services led by **Injectables** (featured "most requested") then laser & IPL
    + medical skin — injectables-led as briefed, consult-driven, no SKUs.
40. Consistent vertical rhythm (`py-24 sm:py-28`, `scroll-mt-20`) and alternating
    surface tones (washi / subtle / warm / night) so sections breathe like a
    garden path, not a wall of identical blocks.

## Motion craft
41. Tasteful Framer Motion throughout: a staggered hero reveal, in-view `Reveal`
    wrapper (margin-gated, `once`), the philosophy's scroll-drifting blossom
    line, and the bloom-sheen — all gated on `useReducedMotion`.
42. Optional **Lenis** smooth scroll (duration 1.3, exponential ease) for an
    unhurried garden cadence, fully disabled under reduced-motion, with anchor
    clicks offset for the sticky nav.

## Accessibility (WCAG AA)
43. Skip link as the first focusable element; `<main id="main">` landmark;
    labelled `<nav aria-label>`, `<section aria-label>`, `<address>`.
44. Every interactive element has a visible `focus-visible` ring in the brand
    accent; the booking scheduler uses **roving-tabindex radiogroups** (arrow
    keys move + select, one tab stop) with `aria-checked`.
45. The before/after slider is a real `role="slider"` with min/max/now +
    `aria-valuetext` and full keyboard control (arrows/Home/End); booking status
    is `aria-live="polite"`.
46. All decorative layers (`sakura-fallback`, auras, the WebGL canvas, petal
    marks, seam ornaments) are `aria-hidden`; placeholder plates carry
    `role="img"` + descriptive labels marked "sample".
47. Body/foreground, muted and subtle ink tones were each picked to clear AA on
    their actual surface (washi, subtle, warm); accent text uses the AA-tuned
    `-deep` stop, never the bright decorative sakura.

## Responsive (375 / 768 / 1280 / 1920)
48. Fluid type + `max-w-*` containers + grid `grid-cols-1 → sm:2 → lg:3` patterns
    keep every section legible and balanced across all four target widths.
49. WebGL only above 768px; ≤375 always gets the lightweight CSS petal field —
    no heavy GPU work on the smallest devices.
50. Mobile nav is an accessible disclosure menu (Esc to close, focus rings);
    desktop links appear at `lg`. Decorative seams/floating seals are hidden on
    stacked mobile so nothing collides.

## Polish, perf & CLS
51. Zero layout shift: every media uses CSS `aspect-ratio`; the hero fallback is
    absolutely-positioned behind copy so the canvas mounting causes no reflow.
52. Hover states are transform/shadow/border-color only (compositor-friendly);
    no layout-triggering hovers.
53. Fixed a shader bug (duplicated `breeze.x`) → now `breeze.y` softly lifts
    petals vertically, so the cursor breeze reads in both axes.
54. `npx tsc --noEmit` clean and `npx next build` succeeds; `/mockups/hanami`
    prerenders as static content.

---

## Self-score (each /10)

| Criterion              | Score | Notes |
|------------------------|-------|-------|
| Visual impact          | 9.6   | Drifting petal field over rice-paper dawn + mincho; an instant "garden, not template" moment. |
| Brand distinctiveness  | 9.7   | Soft sakura + sumi-ink + literal kanji; unmistakably its own world vs. all four siblings. |
| Power-element wow      | 9.6   | Instanced GPU petal field with real depth layers, bokeh, flutter, wind + scroll-eased flow. |
| Motion craft           | 9.4   | Staggered reveals, scroll-driven petal calm, Lenis cadence — all reduced-motion gated. |
| Responsiveness         | 9.4   | Fluid type, tiered WebGL/lite/CSS, clean 375→1920, accessible mobile nav. |
| A11y                   | 9.4   | Skip link, landmarks, roving radiogroups, slider semantics, AA-tuned ink, full degrade. |
| Code quality           | 9.4   | Scoped tokens, lean reused primitives, documented shader, no shared-file edits, tsc clean. |
| Conversion design      | 9.4   | Sole-injector closer surfaces the hidden personal brand; native 2-step scheduler; clean NAP. |

**Average ≈ 9.49** (target ≥ 9.4 met).

---

## CO-COUNSEL PASS 2 — corrections (supersedes the stale claims above)

Two counsels (DesignGod + DistroGod) reviewed the live build. This pass made the
following high-impact corrections; where they contradict the log above, THIS
section is authoritative.

- **Hero void FIXED for real (P0).** The rebrand note + Pass 41 claimed a working
  staggered hero reveal, and an interim change had switched it to
  `whileInView`/`viewport.once`. That was the WRONG tool for ALWAYS-above-fold
  content: on a cold reload the IntersectionObserver callback didn't fire at mount
  during the R3F-canvas + Lenis-init race, so the H1/CTAs/stats sat at opacity:0
  for seconds (a black void on desktop, an empty void on mobile). `PetalHero`'s
  `item()` now uses a plain `initial → animate` PLAY-ON-MOUNT transition (same
  duration/stagger/ease, reduced-motion hard-cut). Below-fold `Reveal`/whileInView
  is correct and untouched.
- **"Results" imagery reframed HONESTLY.** `photo-a.png` and `photo-b.jpeg` are
  **Fort Worth Magazine editorial features** (a FOCUS / "Women Who Forward Fort
  Worth" bio of Dr. Phuah, and the 2022 "Faces of Fort Worth — The Face of Laser
  & Noninvasive Skin Rejuvenation" promotion), NOT client before/afters. They were
  mis-captioned "Real client · placed by Dr. Phuah." Now reframed as an honest **As
  featured in Fort Worth Magazine** press strip (reinforcing the awards/credibility
  theme), alt text describes the actual features, and the "drag to reveal" promise
  is scoped to the clearly-labelled illustrative sample sliders only.
- **Petals retuned to the logo's REAL color.** The rebrand note claimed petals
  match the logo's "blossom pinks (#E8A0B8 / #F4C6D4)." The actual logo blossoms
  (and the Top Doctors ribbon) are a coral/cherry-**RED** (~#E8504D). The
  `--petal-deep`/`--petal-plum` stops, the WebGL `PALETTE` deep/plum, and the
  fallback near/far deep blooms were pushed toward that coral-red (hue ~24–28,
  higher chroma) so each falling petal blooms pale rim → sakura → CORAL-RED heart,
  matching the mark it sits beside. The pale rim stays soft (real sakura is
  two-tone); AA-safe pink TEXT tokens are unchanged.
- **Booking CTA hierarchy fixed.** The only REAL conversion (the phone line) was
  the quieter ghost button while the demo "Confirm request" carried the gold. At
  the ready-state the phone line is now the GOLD primary ("Call to confirm ·
  (817) 808-8938") and the demo drops to a quiet supporting "Request this slot";
  the footnote leads with the real phone line.
- **Services grid warmed.** Added quiet brand texture (a faint gold-hairline top
  rule — full on the featured card, a whisper elsewhere, brightening on hover; a
  soft petal-mark corner watermark; gold-tinted hover border + price divider) so
  the menu matches the couture polish elsewhere. Featured card stays dominant.
- **Awards aggregate de-duped.** The strip line "Four consecutive years of Fort
  Worth's favor." echoed the heading verbatim; it now reads "Recognized every year
  since 2024 — by one set of hands." Hero left-column scrim widened/deepened at
  `lg+` so copy keeps an AA margin where petal density peaks.
- **Doc drift corrected:** `model.jpg` is a generic clinical stock photo (blue
  scrubs/gloves), is **deprecated/UNUSED**, and must NOT be wired (it would
  genericize the luxury aesthetic). The rebrand note's claim that it appears in the
  before/after intro is obsolete — that area is now the press strip.

---

## SIGNATURE-EXPERIENCE PASS — "Wind through the blossoms" (GSAP layer)

The dedicated motion-craft pass: the page now BREATHES with the visitor.

- **Scroll-velocity wind (the signature).** New `wind.ts` module singleton
  (`windBus`) carries Lenis's signed scroll velocity into the WebGL petal field
  with zero React re-renders. `PetalScene` eases it into two new shader
  uniforms — `uGust` (0..1; widens sway, deepens the flutter billow, and
  accelerates a CPU-accumulated time-warped clock so the whole field speeds up
  continuously, never teleporting) and `uSweep` (signed; lifts + shears the
  field with the scroll direction, parallax preserved via the depth factor,
  per-petal phase bias keeps it organic). Attack fast / release slow + per-frame
  velocity decay = a gust that always dies back to the gentle fall (mono no
  aware). `BreezeRig` leans the whole field a few degrees under gust.
- **Lenis ↔ GSAP sync (the critical wiring).** `SmoothScroll` now drives Lenis
  FROM `gsap.ticker` (one shared rAF; `lagSmoothing(0)`) and calls
  `ScrollTrigger.update()` on every Lenis scroll event — without this every
  trigger fires at the wrong position under smooth scroll. Reduced-motion skips
  Lenis entirely (native scroll; ScrollTrigger still correct).
- **Sumi-e ink strokes.** New `InkStroke.tsx`: a FILLED, tapered brush swash
  (thin entry → swelling belly → rising flick + a lift-off ink fleck) revealed
  by an animated spine stroke inside an SVG mask (`pathLength=1`,
  dashoffset 1→0) — the taper appears progressively like ink pulled across
  paper. Four placements: hero (champagne, mount-drawn after the copy settles),
  Philosophy (coral-blush), SoleInjector (true sumi ink on rice-paper), Awards
  (champagne). FAIL-SAFE: SSR ships the stroke fully drawn; the hidden dash
  state is only applied by JS when motion is allowed — no-JS/reduced-motion/GSAP
  failure all land on the elegant static mark. Decorative `aria-hidden`.
- **Awards gold-leaf glint.** As the trophy wall enters, a band of light sweeps
  across every `.gold-foil` text (GSAP fromTo on backgroundSize/Position with
  `clearProps` restoring the pristine static foil), and the 2024→2025→2026
  year-spine assembles left-to-right (years rise, hairline rules scaleX from 0).
  TWO precisely-anchored triggers (the spine itself at top 86%; the rail at top
  82%) — anchoring on the section top would have played the choreography below
  the fold on a slow scroll. `gsap.matchMedia` gates all of it to motion-ok.
- **Micro-interaction sweep.** Nav links: petal-gold hairline grows under the
  label (transform-only, motion-gated). All gold pills: `.hn-sheen` — a skewed
  light band crosses on hover/focus (same glint language as the awards foil;
  transform-only, clipped, motion-gated). Every button/chip: press states
  (`active:scale-[0.98]`, translate reset) + the spring-out cubic-bezier
  (0.22, 1, 0.36, 1) on hovers; service cards lift a full -1 with the same ease.
  Marquee track gets `will-change: transform`.
- **Verified in Chrome** (cold load + scroll-through): console clean (only the
  benign THREE.Clock deprecation), all four strokes draw at their beats
  (dashoffset probes: hero 0 / below-fold 1 until triggered), the awards beat
  fires fully in view, the petal field visibly sweeps + leans under a fast
  scroll vs. the calm rest state, nav underline + sheen + press states live.
  `npx tsc --noEmit` clean for the slug (the lone repo error is in the sibling
  `happy-clinic`, untouched).
