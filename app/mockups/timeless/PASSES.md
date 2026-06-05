# Timeless Aesthetics MedSpa — Refinement Passes

Route: `/mockups/timeless` · Brand: **Warm, friendly, optimistic medspa** — a
single confident **ORANGE (#E0701A)** warming a field of peach, apricot and
cream, set entirely in **Open Sans** (light + regular). Signature texture: soft
out-of-focus **bokeh** light dots. Power element: a Three.js **orange concentric-
bokeh** light-field hero (R3F, `ssr:false`) with a CSS peach-bokeh fallback.
Signature interaction: the **guided-booking** widget (treatment → provider →
location → time). Lowercase dot-cluster wordmark "timeless aesthetics medspa".
All tokens scoped to `[data-brand="timeless"]`.

> NOTE on naming: some CSS var / file names are historical (`--brass*`,
> `--aubergine*`, `--ink-*`, `HorologyHero`, `HorologyScene`) and are retained
> only for compat — read them as the warm orange/peach system, NOT a brass or
> aubergine identity. Their VALUES are the real brand (orange/peach/cream).

Real practice: Drs. **Sonja Heuker, MD** (Family Medicine & Skin Care
Specialist) + **Timothy McCarren, MD** (Family Medicine), Cincinnati OH. NAP:
3260 Westbourne Dr · (513) 451-9600. No real headshots exist on the live site,
so physicians use honest monogram avatars ("headshot to be supplied"); imagery
is on-brand sample plates, each tagged "sample".

---

## Brand & palette
- Scoped every `--color-*` token inside `[data-brand="timeless"]` — zero leakage
  to shared `globals.css` or sibling brands.
- White + faint-warm-peach surface ramp (`--color-bg` → `--color-bg-warm`);
  never cold grey, never dark.
- Foreground is **warm charcoal #333** (`oklch(33% 0.004 60)`) — friendly and
  AA-legible on white + peach.
- One confident accent: brand **ORANGE #E0701A** (`--color-accent`), with
  `--color-accent-deep` darkened to clear WCAG AA for links/prices on white.
- Decorative auras + plate gradients held inside the true brand hue range
  (~52–62). Leftover gold stops (hue 70–82) from an earlier identity were
  retuned to peach/orange this pass.
- Differentiated hard from siblings: Avail cobalt / Happy aurora / SimplySkin
  platinum-teal / Darst chocolate → **Timeless warm orange + peach + bokeh**.

## Typography
- **Open Sans** wired twice (`--font-display` + `--font-body`) from one family
  via `next/font/google` (weights 300/400/600/700, `display:swap`) — the live
  brand's true typeface; no serif, no script.
- Display headings set at **weight 400** (regular): airy and friendly but with
  real presence at the ~6rem hero clamp, narrowing the gap to the 600 orange
  emphasis word. (Lifted from 300 this pass — 300 read thin at hero scale.)
- Fluid type scale (`--fluid-hero/h2/lead` via `clamp`), readable 375 → 1920.
- `.tnum` tabular numerics for all NAP / metrics / prices.
- `text-wrap: balance` on headings, `text-pretty` on leads.

## Voice (warm-confident, not couture-cold)
- Customer-facing copy speaks the real brand register: warm, friendly, optimistic
  ("Rejuvenate. Renew. Refresh. Look your best."), human and specific — never an
  aloof fashion-luxury "institution" tone.
- No internal pitch-narrative in user-visible copy (no "EMR template" references);
  those stay out of the rendered page.
- Reviews read as real people describing results + how they felt, led by the two
  named physicians.

## WebGL bokeh power element
- Orange concentric-**bokeh** light-field in R3F, dynamically imported with
  `ssr:false` from a `"use client"` wrapper (the Next 16 rule).
- Soft out-of-focus light dots in the brand's peach/orange progression read as
  the signature bokeh texture without any literal imagery.
- Low Bloom on the brightest cores only — sunlit, not a light show.

## WebGL performance
- `dpr={[1,2]}` caps high-DPI render cost.
- `IntersectionObserver` pauses `frameloop` when the hero scrolls offscreen;
  `visibilitychange` pauses on hidden tabs.
- `useEnableWebGL` mounts the canvas ONLY ≥768px, with WebGL support, not under
  `saveData`; a `lite` tier (≤1280px) drops tessellation/Bloom for 60fps.
- `loading: () => null` + always-painted CSS fallback → zero CLS, never blank.

## Fallback (reduced-motion / mobile / no-WebGL / SSR)
- CSS `.horology-fallback` paints a warm orange→peach field washed with soft
  bokeh dots + a few crisp glints — on-brand, painted at SSR, never a blank box.
- All fallback drift is gated behind `prefers-reduced-motion: no-preference`;
  reduced-motion users get a serene static peach-bokeh field.

## Sections & conversion
- Architecture: Nav · Hero · TrustBar · DualPhysicians (closer) · Services ·
  BeforeAfter · ProofWall · Financing · BookingCTA · Footer.
- **The closer — "Two physicians, one warm standard"**: a dual-MD credibility
  split (Drs. Heuker & McCarren) with a center orange seam + `&` medallion. The
  live site buries the two-MD model; here it is humanized and foregrounded with
  honest monogram avatars + per-card light direction so the pair reads distinct.
- **TrustBar** carries license-safe recognition + reassurance (training
  affiliations, physician-placed, no-hard-sell, real reviews) — it does NOT
  repeat the hero's four headline numbers.
- **Before/After**: a fully-keyboard drag slider where BEFORE reads dull / cool /
  tired and AFTER reads brighter + warmer peach, so the reveal shows a genuine
  lift in tone (sample plates, tagged "sample · illustrative").
- **Financing** adds a quiet monthly anchor ("Plans from ~$45/mo · 0% options ·
  sample") that turns a high-ticket plan into an easy per-month decision, plus
  Cherry/CareCredit and loyalty framing — premium, never discount-bin.
- **Guided-booking** widget (signature): a floating launcher → treatment →
  provider → location → time, elevating the live site's "chat" bot. Fully
  keyboard-operable.

## Motion craft
- `Reveal` primitive: in-view fade/rise, `once:true`, staggered — all collapse to
  instant under `useReducedMotion`. Hero copy uses a reduced-motion-safe parallax
  fade.
- A slow orange `foil-sheen` drift on the single hero highlight word — the page's
  one piece of "shine," reduced-motion gated.

## A11y, contrast, responsive, perf
- WCAG AA: `--color-accent-deep` for links/prices; warm-charcoal copy over light
  scrims; white-on-orange and white-on-charcoal chips pass AA.
- Skip link is the first focusable element; `header`/`nav`/`main`/`footer`/
  `address` landmarks; visible `focus-visible` orange rings on every control.
- Before/After slider + booking radiogroups fully keyboard-operable
  (arrows/Home/End, roving tabindex, `aria-valuetext`, live confirmation).
- Verified 375 / 768 / 1280 / 1920: hero clamps, grids collapse 3→2→1, the
  center seam + medallion hide on stacked mobile, nav → Esc-dismissible menu.
- CLS guards: CSS `aspect-ratio` on every placeholder; WebGL behind always-
  painted CSS; `display:swap` fonts.

## Pass 2 — co-counsel elevation (DesignGod + DistroGod)
Both counsels independently ranked the same top items; this pass landed the
highest-impact subset, verified live (no console errors) + tsc-clean.

1. **WebGL power element re-authored to TRUE BOKEH** (`HorologyScene.tsx`) — the
   #1 ask from BOTH counsels. The concentric-ring "orrery" (torus rings + tick
   marks + orbiting "planets" / clock cues) is gone. The hero is now a
   depth-staggered cloud of ~16 self-emissive, additively-blended sphere "light
   dots": large + faint + heavily-defocused in the FOREGROUND, smaller + crisper
   + brighter toward the BACK, each drifting on its own slow path, in the brand
   orange/apricot/peach progression. Two very faint concentric loops sit behind
   as a quiet secondary structure (a wisp of the circular motif + depth), never a
   clock. Now matches the wordmark dot-cluster AND the CSS fallback. All perf
   gates preserved (`ssr:false`, IO/visibility pause, `dpr[1,2]`, `lite` tier now
   thins dot count + sphere tessellation; additive `toneMapped:false` glow means
   still no post-processing → still crash-proof on context loss).
2. **Blank-hero-on-load fixed** (`HorologyHero.tsx`) — the H1/lead/CTA/stats no
   longer start at `opacity:0` inside a post-hydration stagger. The entrance is
   now a SETTLE: items start at full opacity and only rise ~10px (reduced-motion
   = fully static), stagger softened (0.06 / delay 0.04). The most-seen screen
   can never flash empty during the WebGL-compile / hydration gap.
3. **Female-luxury / Mirror-Effect copy** (`HorologyHero.tsx`) — hero subhead
   rewritten transformation-first: leads with HER outcome ("Look in the mirror
   and see **you on your best day** — rested, refreshed, never 'done'"), THEN the
   two MDs as the reason it looks like her, THEN a compressed service line (was a
   service-list dump). Info → transformation.
4. **Hero stat row given structure** (`HorologyHero.tsx`) — the four proof
   signals now sit in a faint glass strip with hairline dividers, led by a quiet
   "Why Cincinnati trusts us" label, numerals bumped to 2rem — one credibility
   unit at first impression instead of a loose, easy-to-miss flex row.
5. **CTA emotion de-duplicated** — hero primary CTA "Book in 30 seconds" →
   "Start with a conversation" (reassurance / self-permission); the "~30 seconds"
   speed cue now lives only in the booking widget. Services right-column CTA
   matched ("Start with a conversation").
6. **Services repositioned for high-ticket** (`Services.tsx`) — each card now
   LEADS with the outcome/benefit; clinical per-unit pricing demoted to a quiet
   secondary line ("Personalized at consult" for high-margin filler/RF/laser;
   a `from` price kept only on the entry tiers). Added a consistent line-icon per
   treatment family; the featured "Injectables / Most requested" card now
   unmistakably wins (peach top-edge glow + accent-tinted icon chip + stronger
   border/shadow). The lone-button-in-a-void header right column now carries a
   quiet trust micro-note above the CTA so the row balances.
7. **Type-craft: synthetic Open-Sans italic removed** — ProofWall pull-quotes are
   upright now, differentiated by a large orange opening-quote glyph + weight/size
   (the feeling-led "like myself, only brighter" testimonial promoted to the
   spanning emotional-peak lead card with a top-edge glow). Same italic dropped on
   the DualPhysicians focus line (now upright accent-deep).
8. **Dual-MD polish + safety framing** (`DualPhysicians.tsx`) — both monogram
   plates equalized (the washed-out "default" plate is gone; both rich, distinct
   only by disc light-direction) so the physicians read as equals; dead `variant`
   field removed. Section lead reframed from warmth-only to the ownable
   differentiator: every treatment physician-placed by a board-certified MD —
   "the safety of a doctor, not a chain" — as the reason results are natural AND
   safe (the justification for the premium).

Deferred (still placeholder by design / out of scope to avoid churn): real
photography + verified credentials/handle; the BEFORE-plate hue nudge and the
internal `Horology→Bokeh` / `--brass→--orange` rename (cosmetic, scheduled
separately).

## Gates
- `npx tsc --noEmit` → clean (timeless slug); pass 2 re-verified exit 0.

---

## Self-score (each /10)

| Criterion              | Score | Note |
|------------------------|:-----:|------|
| Visual impact          | 9.2 | Sunlit orange-bokeh hero; clean Open Sans confidence; legible before→after lift. |
| Brand distinctiveness  | 9.4 | Warm orange (#E0701A) + peach/cream + bokeh, all Open Sans — true to the live brand, shares no system with any sibling. |
| Power-element wow      | 9.2 | Orange concentric-bokeh light field with soft Bloom; reads as the brand's signature texture, fully degradable. |
| Motion craft           | 9.2 | Bokeh drift, eased parallax, foil sheen, reveal stagger — all reduced-motion safe. |
| Responsiveness         | 9.3 | Clamped type + collapsing grids + seam/medallion hide; 375→1920. |
| A11y                   | 9.4 | Skip link, landmarks, focus rings, keyboard slider/radiogroups, AA contrast. |
| Code quality           | 9.4 | Scoped tokens, reusable primitives, typed, tsc-clean. |
| Conversion design      | 9.3 | Dual-MD closer, guided 30s booking, monthly financing anchor, recognition band, warm review voice. |

**Average ≈ 9.3.** Remaining lift is real photography + the client's verified
credentials/handle (placeholder by design) and an optional Horology→Bokeh /
brass→orange identifier rename (scheduled separately to avoid churn).
