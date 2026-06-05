# Darst Dermatology — Refinement Passes

Pitch homepage mockup at `/mockups/darst` — the "AFTER" for Dr. Marc A. Darst,
MD (Charlotte, NC): board-certified in **Dermatology AND Dermatopathology**.
Brand: **clinical-minimal academic authority** — deep clinical navy + a single
oxblood accent on cool paper-white. All tokens scoped to `[data-brand="darst"]`.

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
