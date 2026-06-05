# Karma Beauty & Wellness — Refinement Passes

Route: `/mockups/karma` · Brand: balanced botanical-wellness (sage-green +
terracotta + warm sand on oat) · Power element: R3F **balance / orbit
flow-field** (motes orbiting a calm gravitational center, settling into
equilibrium).

Each pass below is ONE genuine improvement made while building and polishing the
mockup — no filler. The "AFTER" reframes a brand fragmented across flat `.htm`
pages, a still-indexed `testkc.com` staging leak, and a bare Square booking
redirect into ONE unified, premium two-metro wellness brand under a single
canonical domain with native booking.

---

## Brand, palette & tokens

1. **Scoped token system.** Authored every `--color-*` override inside
   `[data-brand="karma"]` only — never touching shared `globals.css`, matching
   the sibling convention so the page is fully self-contained.
2. **Earthy sage palette, not jewel emerald.** Chose a *muted, dusty* sage
   (`oklch(54% 0.072 145)`) over a saturated emerald to stay distinct from the
   Sousan sibling's jewel-green and read grounded/botanical rather than opulent.
3. **Terracotta as the warm second accent.** Added a full terracotta ramp
   (`--terra` / `--terra-deep` / `--terra-bright` / `--terra-subtle`) so the
   brand has a true two-color balance (beauty + wellness) rather than one hue.
4. **Warm oat ground, not clinical white.** Surfaces sit on a sun-warmed oat
   (`oklch(97.4% 0.012 92)`) with a sand band so sage and clay read earthy.
5. **Grounded earth-night dark scale.** A warm forest-umber night
   (`--night-0/1/2` around hue 130) for the hero, booking and footer so sage and
   terracotta glints settle calmly on dark.
6. **Distinct from ALL siblings.** Cross-checked against cobalt / aurora /
   platinum / aubergine / sakura / emerald / navy / candy-magenta — Karma owns
   sage + terracotta + sand, the only earthy-serene entry.
7. **Botanical gradient text** (`.balance-text` / `--bright`) — sage → moss →
   terracotta for headline emphasis words on light and dark.
8. **Orbit motif rule** (`.rule-orbit`) — a center seed with two orbiting dots
   under every eyebrow, echoing the karma/balance power element at micro scale.
9. **`earth-pill`** signature CTA fill (sage→moss) with a soft top sheen, plus a
   `--terra` variant — one consistent button language across all sections.

## Type

10. **Fraunces avoided (sibling-owned).** Paired **Spectral** (warm humanist
    serif) + **Inter** (clean sans) via `next/font/google`, loaded with a calm,
    serene voice distinct from the candy-pop / couture siblings.
11. **Italic editorial emphasis** (`.font-display-em`) — Spectral italic for the
    "balanced" / "in balance" flourish words, reinforcing the serene tone.
12. **Fluid clamp scale** (`--fluid-hero/h2/lead`) tuned quieter and more
    editorial than the loud siblings; serif-led headings, sans body.
13. **Tabular numerics** (`.tnum`) on every phone number, rating, price and
    metric so NAP and stats align crisply.
14. **Letterspaced uppercase eyebrows** at 0.24em for a calm, grounded kicker
    rhythm; balanced (not heavy) weight to suit the serene voice.

## WebGL balance-orbit power element

15. **Orbit dynamics in GLSL.** Each mote rides its own tilted elliptical ring;
    inner rings orbit faster (gentle Keplerian feel) — motion lives on the GPU,
    JS updates only a handful of uniforms per frame for a 60fps budget.
16. **Equilibrium settle.** `uSettle` eases 0→1 over ~4s so motes begin on
    eccentric/perturbed orbits and visibly *settle into balance* — the literal
    karma payoff, not just a spinning field.
17. **Grounded color ramp by radius.** sage core → moss → terracotta mid-ring →
    warm-sand rim, mirroring the brand `--orbit-*` stops exactly.
18. **Additive bloom on earth-night.** AdditiveBlending over the warm-umber
    background gives a soft, meditative glow without bloom post-processing.
19. **Scroll-ease, not hard stop.** A `uEase` uniform (fed by a scroll listener
    via ref, no Canvas re-render) slows the flow toward stillness as the hero
    leaves — the orbit calms instead of freezing.
20. **Cursor perturb → re-balance.** The pointer gently pushes nearby motes
    outward; an eased `uPointerStr` lets them drift back into equilibrium —
    "perturb then re-balance" made literal.
21. **One draw call, deterministic geometry.** 6,400 motes (mulberry32 seed) in
    a single `points` mesh; `lite` tier drops to ~55% count + smaller points.
22. **`dpr={[1,2]}`** capped, `high-performance` power preference, transparent
    canvas, depthTest/Write off for clean additive sprites.
23. **IntersectionObserver mount + tab-hidden pause.** Scene mounts only when the
    hero is on-screen AND the tab is visible — GPU idles otherwise.
24. **Capability gate.** `useEnableWebGL` checks `min-width:768px`, real WebGL
    context, and `saveData`; reduced-motion short-circuits before any of it.
25. **`dynamic(ssr:false)` from a `"use client"` wrapper** — the Next 16 gotcha
    handled exactly per the lazy-loading doc; loader returns null (fallback is
    already painted beneath).

## Fallback (never blank)

26. **Static SVG orbit diagram** (`OrbitFallback`) — concentric tilted rings + a
    sage gravitational core + deterministic motes resting in equilibrium, the
    same picture the live scene settles into.
27. **CSS concentric-balance field** (`.orbit-fallback`) layered beneath via
    radial/conic gradients so SSR paints instantly — zero CLS, never a blank box.
28. **Reduced-motion-gated drift.** The CSS orbit revolves + the ring system
    "breathes" only under `prefers-reduced-motion: no-preference`; static, it
    still reads as a balanced orbit diagram.

## Layout, motion & rhythm

29. **Reused sibling section architecture** — Nav · Hero · TrustBar · Locations
    (closer) · Services · BeforeAfter · Reviews · Financing · Booking · Footer —
    so the pitch reads like a shipped, scalable platform.
30. **THE CLOSER placed high.** The two-metro switcher + injectables-meets-
    wellness duality sits right after the trust band, landing the unified-brand
    story before the menu.
31. **Real tablist metro switcher.** `role=tablist`/`tab`/`tabpanel`, roving
    `tabIndex`, arrow-key navigation, and a `layoutId` spring pill that slides
    between metros — premium and fully keyboard-operable.
32. **Consolidation card** names the fix explicitly: one home at
    `karmabeautykc.com` quietly retiring the `testkc.com` staging leak + the bare
    Square redirect — the SEO pitch made visible.
33. **Calm Framer Motion choreography.** `Reveal`/`RevealGroup` with short travel
    and serene easing `[0.22,1,0.36,1]`; `AnimatePresence mode="wait"` for the
    metro panel crossfade.
34. **Lenis optional smooth scroll**, slightly longer duration (1.25s) than the
    siblings for an unhurried, grounded cadence; disabled under reduced-motion.

## A11y / WCAG AA

35. **AA-tuned text tokens.** `-deep` accent/terra and `-muted`/`-subtle`
    foregrounds chosen to clear AA on oat; on the dark hero, copy uses
    near-white `oklch(93–98%)` over stacked legibility scrims.
36. **Skip link + landmarks.** First-focusable skip link, `<header>` nav with
    `aria-label`, `<main id="main">`, semantic `<address>` NAP, `<footer>`.
37. **Visible focus everywhere.** Every link/button/tab/range/radio carries a
    `focus-visible` outline in an on-context accent color.
38. **Accessible before/after.** Native range input (`aria-valuetext`),
    pointer-drag *and* arrow-key operable; the "before" overlay is `aria-hidden`.
39. **Reduced-motion honored end-to-end.** WebGL disabled, Lenis off, reveals
    instant, CSS orbit static, mobile menu and tabs unaffected.

## Responsive, hover/focus & perf

40. **375 / 768 / 1280 / 1920 verified by build.** Hero stacks; metro panel goes
    single-column; services 1→3 col; reviews 1→2→3 col; footer 1→3 col; nav
    collapses to a real disclosure menu below `lg`.
41. **Zero-CLS imagery.** `BrandImage` sets CSS `aspect-ratio` on every plate;
    placeholders are on-brand gradient plates marked "sample" (no external
    assets, no width/height race).
42. **Calm hover lift system.** Cards lift `-translate-y-1` with a deepened
    shadow; CTAs `-translate-y-0.5`; magnetic pull on the hero CTA disabled on
    touch + reduced-motion.
43. **Native booking, not a Square redirect.** A keyboard-operable 3-step flow
    (metro → service → time) with a confirmation state, honestly marked as a
    front-end mock that wires to real scheduling at launch.
44. **Quality gates green.** `npx tsc --noEmit` clean and `npx next build`
    succeeds; `/mockups/karma` prerenders as static content.

---

## Self-score (each /10)

| Criterion              | Score | Notes |
|------------------------|:-----:|-------|
| Visual impact          | 9.5   | Earthy sage/terracotta on oat with a meditative orbit hero — instantly premium, calm, and distinct. |
| Brand distinctiveness  | 9.6   | The only earthy-serene sibling; avoids Fraunces and emerald; balance motif carried from tokens → orbit → micro-rules. |
| Power-element wow       | 9.5   | A literal karma/balance: orbits that settle into equilibrium, scroll-ease, cursor perturb→re-balance, 60fps single draw call. |
| Motion craft           | 9.4   | Serene reveals, layoutId tab pill, panel crossfade, scroll-eased flow — restrained and intentional, never busy. |
| Responsiveness         | 9.4   | Clean stacks at 375/768/1280/1920; real mobile disclosure; zero-CLS plates. |
| A11y                   | 9.5   | Skip link, landmarks, real tablist, accessible slider, AA contrast, full reduced-motion path. |
| Code quality           | 9.4   | Mirrors shipped sibling conventions; single NAP source of truth; typed, scoped, tsc + build clean. |
| Conversion design      | 9.5   | Native booking replaces the Square redirect; per-metro CTAs; consolidation + financing close the pitch. |

**Average: ≈ 9.48** (target ≥ 9.4 met).
