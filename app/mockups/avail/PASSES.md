# Avail Aesthetics — Refinement Passes

A numbered log of concrete, genuine refinements applied to the `/mockups/avail`
pitch homepage. One improvement per pass. Brand: signal-cobalt + graphite +
crisp white, sporty-precise, "built to scale."

## Brand system & palette
1. Scoped ALL tokens within `[data-brand="avail"]` so nothing leaks into shared `globals.css` or sibling mockups.
2. Defined signal-cobalt accent in OKLch (`52% 0.205 264`) with a deepened `--color-accent-deep` (`44% 0.19 266`) specifically for AA-passing text/links on light surfaces.
3. Added a graphite scale (`--graphite-0/1/2`) so the dark hero, results and booking sections share one engineered void, not three different darks.
4. Tuned `--color-bg` to a near-white with a faint cool tint (255 hue) so white reads "engineered," distinct from blue-sky's warm airy white and encore's dark theme.
5. Added `--streak-core/cool/white` stops shared by the WebGL hero and the CSS fallback so both layers read as the same slipstream.
6. Wired Space Grotesk (display) + Inter Tight (sub-display/UI) + Inter (body) via `next/font/google` as CSS variables on the brand wrapper — no external font requests, no CLS.

## Type hierarchy
7. Display headings use a tightened tracking (`-0.022em`) + `ss01` stylistic set for a confident, mono-derived grotesque voice.
8. Added fluid `clamp()` tokens (`--fluid-hero/h2/lead`) for smooth type scaling from 375 → 1920 without breakpoints fighting each other.
9. Added a `.tnum` tabular-numerics utility and applied it to every metric, phone number and price so digits align crisply (engineering signal).
10. Hero headline set in three hard-broken lines ("Four locations. / One standard. / Built to scale.") so the rhythm reads as a manifesto, not a sentence.
11. `.foil-sheen` animated cobalt gradient clipped to the "Built to scale." line — a restrained premium glint, reduced-motion gated.

## WebGL slipstream (the power element)
12. Built an instanced additive light-trail field (220 streaks full / 120 lite) — one draw call, no per-streak overhead.
13. Streaks read SCROLL VELOCITY: a passive scroll listener computes px/ms, saturates at ~1, and eases down 8%/frame for a smooth slipstream tail.
14. Streaks elongate with velocity (scale.x grows with speed) so a fast scroll produces real motion-blur speed-lines — the NASCAR-CEO energy.
15. Streaks drift toward the cursor (lateral Z + vertical Y pull) for an interactive, alive feel.
16. Added a GLSL backdrop plane (graphite void + diagonal cobalt comet lanes) so the frame is premium even before the instanced field ramps up.
17. Backdrop cursor-brightening (`toCursor`) plus velocity-driven lane sharpness ties the shader and instanced layers to the same drive.
18. Subtle Bloom (intensity 1.25 full / 0.85 lite, low luminance threshold) gives the additive streaks a premium glow without washing out.
19. `dpr={[1,2]}` caps retina cost; `antialias:false` on the additive scene (bloom hides edges) for throughput.
20. `frameloop` flips to `"never"` when the hero scrolls offscreen (IntersectionObserver, 120px margin) and when the tab is hidden — battery + perf.
21. Mount fade-in via `u_intensity` easing so the scene never pops in harshly.

## Fallback & graceful degradation
22. `useEnableWebGL` gates the scene behind: not reduced-motion, ≥768px, WebGL probe, and `navigator.connection.saveData` respect.
23. Lite tier (<1280px) drops the streak count and bloom kernel so mid-size laptops stay at 60fps.
24. Static `.slipstream-fallback` CSS gradient (graphite + diagonal cobalt speed-lines + cursor-side glint) is ALWAYS painted at `-z-20` — SSR, mobile, reduced-motion and no-WebGL never see a blank box.
25. The fallback's drift animation is wrapped in `@media (prefers-reduced-motion: no-preference)` so reduced-motion users get a static but still on-brand streak field.
26. Scene is `dynamic(ssr:false)` from a `"use client"` hero (the Next 16 requirement) — verified it builds and prerenders the page statically.

## Layout rhythm & sections
27. Alternating section surfaces (white → subtle → white → graphite → white → subtle → graphite) create a deliberate light/dark cadence down the page.
28. Consistent `py-24 sm:py-28` section rhythm and `max-w-7xl` content frame keep vertical spacing predictable.
29. Authority TrustBar sits immediately under the hero with a `.ruler-ticks` engineered hairline echoing the "Hero-Ruler" voice.
30. Hero metrics, TrustBar and footer all reuse the same metric pattern so the numbers feel like one measurement system.

## The multi-location grid (the closer)
31. Built the "One brand. Four homes. Zero confusion." closer as a 4-up card grid, each card individually book-able with its own NAP.
32. Cary card flagged "Flagship" with a cobalt border + cooler plate so the hierarchy of locations is instantly legible.
33. Added a side "The consolidation" note that states the SEO story explicitly: one authoritative domain replacing the indexed staging site cannibalizing rankings.
34. Each location card carries semantic `<address>` NAP + a `tel:` link + a maps directions link with an `aria-label`.
35. Footer repeats all four NAPs in structured `<address>` blocks under "availaesthetics.com" — reinforcing one-domain consolidation in markup.

## Services
36. Five real categories (Injectables, Lasers & Energy, Body Contouring, Skin & Facials, Wellness) with real treatment names, each book-able.
37. Injectables card spans wider on `sm` and tall on `xl` for a magazine-grid focal point; a cobalt edge-tick grows on hover.

## Motion choreography
38. `Reveal` primitive (in-view fade/rise, `once:true`, reduced-motion → no transform) used across every section for consistent entrance choreography with staggered delays.
39. Hero copy parallaxes up and fades on scroll-out via `useScroll`/`useTransform`, fully disabled under reduced-motion.
40. Lenis smooth-scroll (reduced-motion gated) feeds smoothed momentum into the slipstream's scroll-velocity read so the speed-lines glide rather than jitter.

## A11y / WCAG AA
41. Skip link as the first focusable element, jumping to `#main`; `main`/`header`/`footer` landmarks + `aria-label`led `nav` and sections.
42. Hero scrims (left wash 0.9 + vertical 0.72/0.78) guarantee white copy holds AA over any slipstream frame.
43. Every interactive element has a visible `focus-visible` ring (cobalt on light, white on dark) — nav, chips, slider handle, CTAs, location links.
44. Before/after slider handle is a real `role="slider"` with `aria-valuemin/max/now/valuetext` and full keyboard control (arrows/Home/End).
45. Booking scheduler uses `fieldset`/`legend`, `aria-pressed` chips, a disabled submit until complete, and a `role="status"` confirmation.
46. Mobile nav uses `aria-expanded`/`aria-controls`, Esc-to-close, and closes on link select.
47. Decorative WebGL/gradient layers are `aria-hidden`; placeholder plates expose `role="img"` with a sample-labeled accessible name.

## Responsive 375 / 768 / 1280 / 1920
48. Location grid flows 1 → 2 (sm) → 4 (xl); services 1 → 2 (sm) → 3 (xl); reviews 1 → 2 → 3 — verified column math at all four widths.
49. Nav collapses to an accessible disclosure menu below `lg`; phone number hides below `sm` but stays reachable in the mobile menu.
50. `min-h-[100svh]` hero uses small-viewport-height units so mobile browser chrome never crops the CTA.

## Perf / CLS
51. All placeholder plates set an explicit `aspect-ratio` → zero layout shift as sections reveal.
52. `next/font` with `display:swap` self-hosts fonts; no third-party font network requests.
53. Verified `npx tsc --noEmit` is clean (0 errors) and `npx next build` succeeds with `/mockups/avail` prerendered as static content.

## Self-score (each /10)
- Visual impact: **9.5** — the cobalt slipstream over graphite plus the foil-sheen headline lands an enterprise, distinctly-sporty first impression.
- Brand distinctiveness: **9.6** — signal-cobalt + graphite + ruler/streak motifs are unmistakably different from the warm blue-sky and dark-aqua encore siblings.
- Power-element wow: **9.5** — instanced velocity-reactive speed-lines that elongate on scroll and chase the cursor, with bloom; a genuine "blow them away" hero.
- Motion craft: **9.4** — eased scroll-velocity decay, Lenis-fed momentum, staggered reveals, all reduced-motion honored.
- Responsiveness: **9.4** — verified column flows + svh hero + disclosure nav across 375/768/1280/1920.
- A11y: **9.4** — skip link, landmarks, slider/scheduler semantics, focus-visible everywhere, AA scrims.
- Code quality: **9.4** — shared primitives, scoped tokens, typed props, lean section files, clean tsc + build.
- Conversion design: **9.5** — native 30-second 3-step scheduler, per-location booking, financing objection-handler, prominent persistent Book CTA.

**Average: 9.46** (target ≥ 9.4 met)
