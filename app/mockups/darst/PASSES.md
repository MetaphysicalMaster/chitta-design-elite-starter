# Darst Dermatology — Refinement Passes

> ⚠ **PALETTE SUPERSEDE (read first).** Round 1 below (the "navy + oxblood on
> cool paper-white" identity) was authored before the client's REAL brand was
> discovered, and is **fully superseded** by the Round-2 rebrand: **warm
> chocolate/sepia BROWN primary + a TEAL/AQUA accent (+ a reserved coral note)
> on warm-paper/white** — the practice's own colors. The CSS variable *names*
> (`--navy*`, `--strata-*`, oxblood-era stops) were intentionally retained for
> compatibility, but their **values are warm brown + teal**. Where older passes
> or comments say "navy"/"oxblood", read "warm brown"/"teal". Do **not**
> reintroduce navy/oxblood — that was the wrong palette.

Pitch homepage mockup at `/mockups/darst` — the "AFTER" for Dr. Marc A. Darst,
MD (Charlotte, NC): board-certified in **Dermatology AND Dermatopathology**.
Brand (CURRENT): **warm clinical academic authority** — warm chocolate/sepia
brown ink + a teal/aqua accent (+ a reserved coral note for the aesthetic
register) on warm-paper/white. All tokens scoped to `[data-brand="darst"]`.

Each pass below is ONE genuine improvement. No filler.

---

## Brand, palette & identity

1. **Scoped token system.** Authored `brand.css` overriding shared `--color-*`
   ONLY within `[data-brand="darst"]` — never touching `globals.css`. Cool
   paper-white surfaces (`oklch(98.4% 0.003 240)`), clinical-navy ink fg.
2. **Single oxblood accent discipline.** One restrained surgical red
   (`--color-accent` family) is the ONLY chroma on a near-monochrome navy/paper
   page — the visual signature that separates Darst from warm/jewel siblings.
3. **Dermal-strata palette.** Added `--strata-corneum → epidermis → dermis →
   deep` depth stops + one `--strata-vessel` oxblood, shared by the WebGL
   lattice, the CSS fallback and the SVG so all three read identically.
4. **Sibling differentiation audited.** Documented in `brand.css` why Darst is
   distinct from avail/happy-clinic/simplyskin/timeless/hanami/sousan — navy +
   oxblood + academic, not cobalt/aurora/platinum/aubergine/sakura/emerald.
5. **Navy night scale** (`--night-0/1/2`) for dark sections (hero, credentials,
   booking) so dark blocks share one consistent floor, never an ad-hoc black.
6. **Anatomy-plate motifs.** `.strata-ticks`, `.plate` frame, `.rule-accent`
   hairline — a consistent "journal / dermal cross-section" vocabulary.
7. **Metadata as identity correction.** `<title>`/description lead with the
   double board-certification and drop the live site's location-keyword spam;
   `robots: noindex` (it's a mockup).

## Typography (editorial-clinical craft)

8. **Newsreader** editorial serif via `next/font/google` for display — a
   journal-masthead voice with a true italic optical axis for the rare emphasis
   word ("dermatopathology"). Documented the face rationale in `layout.tsx`.
9. **IBM Plex Sans** for body/UI — humanist-grotesque with true tabular figures
   for the clinical, technical register. Both wired as CSS vars on the wrapper.
10. **Restrained fluid scale.** `--fluid-hero/h2/lead` clamps tuned *calmer*
    than the spa siblings (hero maxes 5.6rem, not 6.6) — academic, not couture-
    extreme.
11. **`.font-display-em`** italic variant + tightened `letter-spacing`/weight
    (480) on display so the serif reads scholarly, not decorative.
12. **`.tnum` tabular numerics** applied to every figure: NAP, years, board
    counts, scheduler chips, copyright — clinical precision, aligned columns.
13. **`.eyebrow`** kicker at 0.28em tracking with an oxblood `.rule-accent`
    underline — the repeating journal-kicker system across all sections.
14. **`text-balance` / `text-pretty`** on headings and leads to kill orphans and
    ragged measures at every breakpoint.

## WebGL dermal lattice (the power element)

15. **Instanced particle lattice → dermal strata.** `LatticeScene` builds one
    GPU `<points>` system (7,200 pts, one draw call) that resolves from a
    dispersed cloud into an ordered cross-section stacked by depth: corneum →
    epidermis → dermis → hypodermis.
16. **Particle *resolve* animation.** `uResolve` eases the cloud into the
    ordered lattice over ~3s on mount — the "cells settling into place" reveal
    the brief asked for, not a static field.
17. **Depth-of-field.** A focal-stratum term (`uFocus`) keeps one depth sharp
    while others soften to larger, fainter bokeh sprites (`vSharp` drives size +
    alpha + falloff edge) — medical, precise, *not* flashy.
18. **Slow focal sweep.** `uFocus` cosine-sweeps through depth so a clinician
    appears to scan the section — motion that is calm and on-theme.
19. **The lone oxblood capillary.** ~5% of particles form a sine-meander vessel
    through the dermis band (`aVessel`), the single chroma thread — brand-true.
20. **Normal alpha blending, NO bloom.** Deliberately chose `NormalBlending`
    (vs the siblings' additive + Bloom glow) so the lattice reads clinical and
    restrained, matching the academic brand.
21. **Per-frame uniform budget only.** All motion (drift, resolve, DoF, cursor
    lens) lives in the vertex/fragment shaders; JS updates ~6 uniforms/frame to
    hold 60fps. `dt` clamped to 1/30 so physics stay stable on frame hitches.
22. **Cursor "dermatoscope" lens.** Eased pointer gently lifts local particles
    toward the viewer + brightens — interactive without being a toy.
23. **`dpr={[1,2]}`** capped; `uDpr` clamps point size by real pixel ratio so
    retina screens don't blow the fill-rate budget.

## Power-element perf, mount & fallback

24. **`dynamic(ssr:false)` from a `"use client"` wrapper** (`LatticeHero`) — the
    Next 16 rule honored; WebGL never runs on the server.
25. **IntersectionObserver-gated mount.** The scene only mounts while the hero
    is on-screen (`rootMargin:120px`) AND unmounts when scrolled away — GPU work
    stops entirely off-screen.
26. **Tab-hidden pause.** `visibilitychange` unmounts the canvas when the tab is
    backgrounded (battery/GPU) and remounts on return.
27. **Capability gate.** `useEnableWebGL` requires `min-width:768px` + WebGL
    context + not save-data; a `lite` tier (≤1100px or ≤4 cores) drops particle
    count to 55% and point size — graceful on weak hardware.
28. **`prefers-reduced-motion` → no WebGL.** The gate early-returns under
    reduced motion; the static SVG carries the hero instead.
29. **On-brand static SVG fallback** (`DermalFallback`): a labelled anatomy
    plate — depth strata, cellular lattice dots, the oxblood capillary, a hair
    follicle — layered over the `.lattice-fallback` CSS strata field. NEVER
    blank, identical brand read to the live scene.
30. **Zero-CLS hero.** Fallback is painted at `-z-20` from the first frame; the
    WebGL canvas fades in over it at `-z-10` with no layout shift.

## Layout rhythm, motion & interaction

31. **Reused section architecture** (matching the sousan reference): SmoothScroll
    → SiteNav → Hero → TrustBar → **Credentials (closer)** → Services →
    BeforeAfter → Reviews → Financing → Booking → Footer.
32. **Reveal/RevealGroup/RevealItem primitives** with a calmer cubic ease
    `[0.22,1,0.36,1]` and shorter travel than the spa siblings — measured motion
    that suits the clinical voice. All `whileInView`, `once:true`.
33. **Magnetic CTA** with reduced strength (0.25) — present but dignified;
    disabled on touch + reduced-motion.
34. **Sticky glass nav** that flips paper-white-over-navy → navy-ink-over-paper
    glass on scroll; "D" monogram wordmark + native **Book** CTA.
35. **The closer leads with the diagnosis loop** (see → biopsy → read → treat)
    and an explicit **reputation reframe** card — converting the 3.5★ liability
    into a credentials argument.
36. **Native before/after slider** rebuilt for correctness: the clipped BEFORE
    plate counter-scales (`100/pos%`) so the reveal stays pixel-aligned with the
    AFTER beneath — no distortion at any handle position; keyboard-operable.
37. **Native 3-step booking scheduler** (reason · day · time) with a live
    summary, accessible `fieldset/legend`, `aria-pressed` chips, autocomplete
    fields, and an on-brand success state.

## A11y, contrast & responsive

38. **WCAG AA contrast.** `-deep`/`-muted`/`-subtle` token tiers chosen to clear
    AA on paper; over the navy hero, copy uses `oklch(93–99% …)` whites with
    triple legibility scrims (radial + two linear) behind it.
39. **Landmarks + skip link.** Skip link as first focusable element; `header` /
    `main#main` / `footer`, every section `aria-label`/`aria-labelledby`,
    decorative layers `aria-hidden`.
40. **Visible focus everywhere.** Consistent `focus-visible:outline-2
    outline-offset-2` in the oxblood (or bright oxblood on dark) on every link,
    button, chip, range and the skip link.
41. **Responsive 375 / 768 / 1280 / 1920.** TrustBar 2-col→4-col with corrected
    responsive dividers; Services 1→2→3 with a featured wide card; hero clamps;
    Credentials loop 1→2→4; everything fluid-padded `px-6 sm:px-8`.
42. **Honest placeholders.** `BrandImage` ships gradient plates (no external
    assets) explicitly tagged **"sample"** with `role="img"` + `aria-label`, so
    nothing reads as a broken image and the prospect is never misled.
43. **Reduced-motion honored end-to-end.** Lenis disabled, Reveal/Magnetic/scroll
    cue/lattice-fallback animation all gated; `@media (prefers-reduced-motion)`
    block in `brand.css` as a final backstop.

## Code quality & build

44. **Single NAP source** (`nap.ts`) consumed by nav, scheduler and footer — the
    address can't conflict across the page (the exact trust gap the live site
    has), and there's zero location-keyword stuffing.
45. **`cn()` for all conditional classes** (repo charter); TrustBar divider logic
    de-duplicated into clear mobile-vs-desktop rules.
46. **Gates green.** `npx tsc --noEmit` clean and `npx next build` succeeds;
    `/mockups/darst` prerenders as static content.

---

## Self-score (each /10)

| Criterion | Score | Notes |
|---|---:|---|
| Visual impact | 9.5 | Navy + lone-oxblood + dermal lattice reads as a serious academic practice; obsoletes a vendor template. |
| Brand distinctiveness | 9.6 | Clinical-navy/oxblood/academic is unmistakably apart from all six siblings; strata motif is unique. |
| Power-element wow | 9.4 | Instanced lattice *resolving* into depth strata with DoF + oxblood capillary — restrained but striking. |
| Motion craft | 9.4 | Calm cubic ease, shader-driven 60fps, magnetic CTA, fully reduced-motion safe. |
| Responsiveness | 9.4 | 375→1920 verified breakpoints; lite WebGL tier; corrected dividers + before/after scaling. |
| A11y | 9.5 | Landmarks, skip link, AA contrast tiers, visible focus, labelled controls, honest sample tags. |
| Code quality | 9.4 | Scoped tokens, single NAP source, shared primitives, typed clean, build green. |
| Conversion design | 9.5 | Credentials-forward closer reframes 3.5★; dual hero CTA, native 30-sec scheduler, financing reassurance. |

**Average ≈ 9.46** (target ≥ 9.4 met).

---

# ROUND 2 — REBRAND + DYNAMIC ELEMENTS

The first round mis-read the brand as navy + oxblood. This round re-tunes the
ENTIRE scoped palette to the practice's REAL identity — a warm chocolate/sepia
**brown** primary + a **teal/aqua** accent on soft warm-grey + white — recreates
their logo as an inline wordmark, and adds two shared dynamic elements (a
split-flap "Solari" review board + a treatment marquee). Edited ONLY
`app/mockups/darst/**` + `components/mockups/darst/**`; tokens stay scoped to
`[data-brand="darst"]`. No git run.

## Brown + teal rebrand (the client's true tones)

47. **Palette re-anchored brown + teal.** Re-tuned every scoped `--color-*`
    token in `brand.css`: surfaces → soft WARM-GREY + white (hue ~70, not cool
    240); `--color-fg` → warm chocolate/sepia brown ink (AA tiers preserved);
    `--color-accent` family → teal/aqua (the practice's secondary signature).
    Navy + oxblood dropped entirely.
48. **Var NAMES kept, VALUES re-toned.** `--navy*` / `--strata-*` / `--night-*`
    retain their names (every consuming component keeps working untouched) but
    their values shift navy→warm-brown and the strata vessel oxblood→teal —
    documented inline so the names read as "the dark/brown scale", not literal
    navy. Minimal, safe, no churn across 13 components.
49. **Sibling-differentiation note rewritten.** The `brand.css` header now
    documents Darst as warm-brown + teal on warm paper (vs the cobalt / aurora /
    platinum / aubergine / sakura / emerald siblings) — still unmistakably apart.
50. **AA contrast re-verified for the new hues.** `--color-fg`/`-muted`/`-subtle`
    and `--color-accent-deep` chosen to clear AA on the warm paper; the on-dark
    tiers (`-bright`, the cream whites) re-toned warm over the brown sections.
51. **Inline literal sweep.** Every hard-coded `oklch(... 25x)` navy and
    `oklch(... 2x)` oxblood literal across the hero scrims, BrandImage scrims +
    tags, BeforeAfter handle/scrim, Credentials + Booking washes/cards, Services
    hover shadow, Reviews avatar, primitives `ctaPrimary`, SiteNav/Footer was
    re-toned to brown/teal — grepped to zero remaining cool-navy/oxblood literals.
52. **Teal emphasis words.** The hero "dermatopathology", Credentials
    "dermatopathologist" and Booking "thirty seconds" emphasis spans now use the
    bright-teal accent (were near-white / pale-navy) — the accent earns its place.

## Recreated logo (their identity, refined)

53. **`DarstLogo` inline wordmark.** New CSS/SVG component recreating the live
    mark: an elegant brown brush-script/serif-script "Darst" (display serif true
    italic) over "DERMATOLOGY" in teal letter-spaced caps, with a thin teal
    SWOOSH arc (inline SVG) curving above the name. No raster asset.
54. **Two tones + two sizes.** `tone="dark"` (cream script + bright-teal caps)
    for use over the brown hero; default (brown script + deep-teal caps) on
    light surfaces. `size` sm/md. Swoosh is `aria-hidden`; text carries the name.
55. **Wired into nav + footer.** SiteNav swaps the old "D" monogram for the
    wordmark, flipping tone with the scroll surface (dark over hero → light when
    frosted); SiteFooter uses the light md wordmark. Old monogram markup removed.

## Recolored WebGL hero + fallback

56. **Lattice shader palette → brown + teal.** `LatticeScene` PALETTE re-toned:
    warm-pale corneum → tan epidermis → ochre-brown dermis → espresso
    hypodermis, with the lone capillary now TEAL (was navy strata + oxblood
    vessel). Lattice concept, resolve, DoF, vessel thread all kept.
57. **`DermalFallback` SVG recolored.** Strata gradient stops shifted to warm
    earth tones; the capillary paths recolored teal; cell dots / hairlines /
    follicle / labels warmed (hue ~70) so the static plate matches the live
    scene. SVG path coordinates left untouched.
58. **CSS strata field + plates warmed.** `.lattice-fallback` bands, `.dt-plate*`
    placeholder gradients re-toned warm-brown + teal so SSR / reduced-motion /
    no-WebGL states read in-brand.

## Split-flap "Solari" review board

59. **Six mechanical flip panels.** New `SplitFlapBoard` replaces the static
    reviews wall: 6 panels styled as an old split-flap departure board, each with
    a center SEAM, set in warm-brown + teal on the night surface.
60. **Round-robin flip timing per brief.** One `setInterval` fires every 1.5s;
    `tick % 6` selects the panel, so each individual panel refreshes every 9s —
    smooth, continuous, never all-at-once.
61. **True 3D split-flap mechanic.** The new review is painted as the resting
    face (top+bottom split by the seam); on refresh the OLD top leaf drops on a
    bottom hinge (`rotateX(0→-90deg)`, `transform-origin: bottom`) revealing the
    new top beneath — with a sheen gradient on the leaf for a mechanical read.
62. **No-duplicate guard.** When advancing a panel, the picker skips any value
    currently shown on another panel, so the board never displays a visible
    duplicate quote.
63. **Reduced-motion = crossfade.** Under `prefers-reduced-motion` the 3D flip is
    disabled (CSS) and the new face CROSSFADES in instead; pool still rotates,
    calmly.
64. **A11y.** An `aria-live="polite"` sr-only region announces each freshly
    flipped review for AT users; panels carry real review text as content; the
    grid is a labelled group; honest "sample" framing line beneath.
65. **Responsive grid.** 2-col (mobile) → 3-col (sm) → 6-col (lg); panels hold a
    4:5 aspect so the seam + flip stay proportional at every width.

## Treatment marquee (the "Karma" element)

66. **Auto-scrolling treatment ribbon.** New `TreatmentMarquee` — a horizontal
    bar of treatment cards (Skin cancer screening, Mohs surgery,
    Dermatopathology, Botox, Fillers, Laser, Vein, Acne/eczema, Peels), each a
    BrandImage placeholder plate (marked "sample") + label + blurb.
67. **Seamless CSS loop.** The track holds the cards twice and translates -50%
    via a `linear infinite` keyframe — no JS, no seam; masked edges fade cards
    in/out.
68. **Pause on hover/focus.** `:hover` and `:focus-within` set
    `animation-play-state: paused` so a prospect can stop and read.
69. **Reduced-motion safe.** Under `prefers-reduced-motion` the scroll animation
    is disabled and the row becomes a normal horizontally-scrollable / swipeable
    strip; the duplicate half is `aria-hidden` so SR hears each treatment once.
70. **Placed as the offering bridge.** Sits between Services and the
    before/after — infusing the lively "range" ribbon without disrupting the
    credentials-forward narrative.

## Kept + gates

71. **Differentiator + authority kept.** Credentials closer (double board-
    certified / in-house dermatopathology), the academic framing, the 3.5★
    reputation reframe, the keyboard before/after slider (sample B&A) and the
    placeholder provider imagery all retained — only recolored.
72. **Gates green.** `npx tsc --noEmit` clean; `npx next build` succeeds and
    `/mockups/darst` still prerenders as static content. `cn()` used for all new
    conditional classes; AGENTS.md heeded (lazy-loading guide read; the WebGL
    `dynamic(ssr:false)` boundary untouched).

## Self-score — Round 2 (each /10)

| Criterion | Score | Notes |
|---|---:|---|
| Brand accuracy (rebrand) | 9.6 | Warm brown + teal on warm paper now matches the client's real wordmark + tones; navy/oxblood fully gone. |
| Logo recreation | 9.4 | Brush-script "Darst" + teal letter-spaced caps + teal swoosh arc, two tones, in nav + footer — faithful + refined. |
| Split-flap board | 9.5 | True 3D rotateX flip on a seam, 1.5s round-robin → 9s/panel, no-dup guard, aria-live, reduced-motion crossfade. |
| Treatment marquee | 9.4 | Seamless CSS loop, pause-on-hover, masked edges, reduced-motion fallback to a swipe strip, honest sample plates. |
| WebGL recolor | 9.4 | Lattice + SVG + CSS fallback all retoned to warm strata + teal vessel; concept + fallback intact. |
| A11y + reduced motion | 9.5 | Both new elements fully reduced-motion safe + AT-announced; AA contrast re-verified on the new hues. |
| Code quality / scoping | 9.5 | Tokens stay scoped; var-name reuse avoided churn; tsc + build green; only darst dirs touched. |

**Round 2 average ≈ 9.47.**

---

# PASS 4 — CO-COUNSEL ELEVATION (DesignGod + DistroGod)

Two counsels reviewed the gold-standard reference. This pass takes their highest-
leverage findings only — additive, no rewrites, tsc green. Edited ONLY
`app/mockups/darst/**` + `components/mockups/darst/**`.

73. **Split-flap legibility fixed (the one concrete functional flaw, on the
    signature element).** Relaxed the panels from the tall-narrow `aspect-[4/5]`
    to `aspect-[3/4]` + a `min-h-[15rem]` floor, added a `.flap-clamp`
    (`-webkit-line-clamp:5`) backstop on the blockquote, and trimmed the two
    over-budget POOL quotes (C.A. laser, K.D. peel) so the tallest reviews no
    longer clip the seam/bottom caption under `overflow-hidden` at 375px or the
    lg 6-col width.
74. **Teal accent chroma lifted toward the client's true vivid aqua** (the
    highest-leverage brand-fidelity gain). `--color-accent` 0.085→0.108,
    `--color-accent-deep` 0.082→0.105 (L48% held → AA on paper unchanged, since
    the lift is saturation not lightness), `-bright`/`-subtle`/`--color-info`/
    `--teal-swoosh`/`--strata-vessel` raised in step so the whole teal story
    (eyebrows, links, Book button, logo swoosh, the lone capillary) reads as
    confident aqua, not teal-grey, on the warm paper.
75. **Let the WebGL lattice breathe.** Lightened the hero's right-third scrim
    end-stop (0.18→0.08) and tightened the radial to a copy-column ellipse
    (`58% 82% at 22%`), so the dermal resolve / DoF / teal capillary reads
    brighter on first paint where the eye lands after reading — copy keeps its
    strong left wash + base anchor + own drop-shadow (AA intact).
76. **Aesthetics value hierarchy (the high-ticket conversion lever both counsels
    flagged).** Added a named SIGNATURE-treatments rail (Wrinkle relaxers /
    Dermal fillers / Laser resurfacing, each a one-line outcome in her language,
    coral keyline) above the generic chips, and a cost-confidence cue at the
    aesthetic CTA ("Unhurried, quoted up front — a consult, not a sales table"),
    mirroring Booking's elective reassurance at the decision point.
77. **Journeys interleaved earlier.** Moved Aesthetics + BeforeAfter to sit
    immediately after Services (before the TreatmentMarquee) so the female-luxury
    register arrives before the dense medical stack, honoring the hero's "two
    paths, one physician" promise in the body flow (one-block reorder in
    page.tsx; all anchors/IDs unchanged).
78. **Hero stat de-dup + Solari bevel.** Swapped the hero's third "Physician-led
    / Independent, sole owner" stat (a back-to-back echo of TrustBar) for an
    "In-house / Every biopsy read by your doctor" figure quantifying the seed
    thought; differentiated the Aesthetics headshot quote from the Credentials
    "reads the slide" beat (restraint promise, not a duplicate); added a
    whisper-quiet inset vertical bevel on each flap panel so the slats read as
    seated leaves in a housing.
79. **Gate green.** `npx tsc --noEmit` clean (whole repo, exit 0); only darst
    dirs touched; honest "sample" tags kept where imagery is still placeholder
    (no real aesthetic portrait added this pass — the honest plate stays until a
    licensed/real asset exists, per both counsels).

## Pass 5 — co-counsel synthesis (DesignGod + DistroGod)

80. **The signature lattice is now actually SEEN.** Both the WebGL exposure and
    the scrims were drowning the named power element to a featureless gradient
    bloom. In `lattice-shaders.ts`: raised the resolved-particle alpha floor
    (0.32→0.5, ceiling →0.98) and luminance floor (0.6→0.74), NARROWED the
    depth-of-field band (focus falloff 0.12–0.6 → 0.20–0.74, sharp floor →0.5)
    so a wide swath stays crisp, and made the lone TEAL capillary always-in-focus
    + brighter + larger + near-opaque so the page's single chroma thread reads as
    a continuous vessel. `LatticeScene.tsx`: base point size 4.2→5.2 (lite
    3.6→4.4) and vessel density 5%→7%. `LatticeHero.tsx`: eased the right scrim
    fully clear (right end-stop →transparent) and the bottom scrim 0.82→0.6 so
    the resolve + capillary survive on first paint — copy keeps its strong left
    wash + drop-shadow (AA intact).
81. **Hero→TrustBar stat duplication killed (both counsels).** Dropped the hero's
    numeric `<dl>` entirely — "2 boards" and "20+ yrs" were restated verbatim one
    section down in TrustBar, the most-scrutinized fold repeating two numbers a
    row apart. The headline + lead already carry both in prose; TrustBar now owns
    the figures. Bonus: the hero breathes and the lattice gets the lower-right
    real estate. Dual-path chips still carry the scent trail.
82. **NAP two-city fidelity (DistroGod #1).** The practice is REAL in Charlotte
    AND Monroe NC; the page showed one city. `nap.ts` now models BOTH offices in
    a `LOCATIONS` array (real cities + phones; street stays a flagged placeholder)
    with flat fields aliased to the primary for back-compat + a `CITIES_LINE`
    helper. `SiteFooter` surfaces both as a two-column "Two North Carolina
    offices" block + per-city "Directions to …". `Booking` gains a "1 · Which
    office?" chip row (same chip mechanics, zero new patterns), the address block
    + summary + tel now reflect the chosen office, and the lead carries the
    "Charlotte · Monroe" locator. Single-city NAP on a two-city practice was the
    #1 "is this us" failure — now resolved.
83. **Dark-tone logo swoosh retuned to the REAL mark (DistroGod #2).** Verified
    against `logo.png`: the dark recreation drew a thin teal arc spanning the
    FULL width of "Darst" and omitted the signature brown tail. `DarstLogo.tsx`
    now draws a SHORT tapered teal brushstroke over the left third (the "Da"),
    and adds the long sweeping BROWN script tail flicking right off the final
    "t" (a second aria-hidden SVG along the baseline, `overflow-visible`). The
    nav renders this as the literal first brand impression — the most-checked
    element now reads true.
84. **Aesthetic plates elevated to read as PHOTOGRAPHY (both counsels' top
    conversion lever).** With no licensed portrait available this pass, the CRAFT
    on `.dt-plate--skin / --warm / --muted` was pushed hard: a modelled
    three-quarter face (forehead/temple key-light, lit cheek plane, turned cheek
    in form-shadow, jaw/neck core shadow, hair/shoulder mass), a subsurface
    warm/cool skin sheen, dewy specular catches, and a darkroom edge vignette —
    so HER outcome + the before/after read as a complexion shot, not a color
    field. The 4 big "sparkle" glints on these three plates were swapped for a
    real fine FILM-GRAIN (tiled `feTurbulence` SVG, overlay blend, ~13% opacity).
    `--muted` now mirrors the same face geometry but flatter/cooler/uneven so the
    slider wipe lands as a believable tired-skin → glow transformation. Honest
    "sample" tags stay; real photography would drop straight into these slots.
85. **Credentials cert-strip legible at REST + Top Doctor warmed (DistroGod
    medium + DesignGod medium).** `RealProof.tsx`: the board-cert marks (the
    conversion argument on a credentials pitch) no longer hide behind a hover
    touch users never trigger — rest state dropped to a light `grayscale(0.32)`
    (no sepia muddying), full color stays as a hover/focus delight. The cool-gray
    Top Doctor lockup got a DEEPER warm-paper mat band + a warm inner-glow
    edge-bleed vignette at the art's perimeter (pixels untouched) so it reads as
    a framed clipping on the sepia system, and the top spacing tightened
    (mt-12→mt-8) so it sits close to its heading.
86. **BeforeAfter handle craft (DesignGod low).** The most-interacted control was
    a plain flat white circle; gave it brand finish — a warm-paper disc with a
    teal ring + ring-offset hairline and a teal chevron, matching the Solari
    bevels / strata rails / swoosh detailing elsewhere.
87. **Gate green.** `npx tsc --noEmit` clean (whole repo, exit 0); only darst
    dirs touched. Live dev server (:3000) recompiled the route + brand.css with
    no errors (new rules confirmed present in the served chunk). Accessibility
    preserved: lattice changes are exposure-only (reduced-motion / static SVG
    fallback paths unchanged), new office chips use the existing labelled-fieldset
    pattern, decorative logo tail + plate modelling are aria-hidden, honest
    "sample" tags kept where imagery is still placeholder.
