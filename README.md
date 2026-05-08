# chitta-design-elite-starter

> **Elite UI/UX Engineer starter.** Next.js 16 · Tailwind v4 · Framer Motion · shadcn/ui · Aceternity UI · Magic UI · Geist · Three.js · React Three Fiber · GSAP · Lenis · Lottie · Rive · 16-effect shader library. $10K-quality bar baked in.

Reusable foundation for every CHITTA DesignGod client website. Fork this repo, swap brand tokens, ship.

## Why this exists

State-of-the-art design isn't a model problem — it's a **process** problem. Same model + forced discipline (specs before markup, references in context, Lighthouse 100 gates, refine-loop until threshold) produces dramatically better output.

This repo is the **infrastructure half** of that discipline: a baseline that ships at $10K-quality before any client work begins. Combined with the [DesignGod skill](../../.claude/skills/designgod/) (process discipline + sub-skill orchestration), the floor is high enough that even iteration #1 reads as premium.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 App Router** | RSC by default, View Transitions, Turbopack dev, Vercel-optimized |
| Language | **TypeScript strict** | Catches drift early |
| Styling | **Tailwind v4** | CSS-first config (no `tailwind.config.js`), `@theme` blocks, OKLch tokens |
| Motion | **Framer Motion (`motion/react`)** | Mandatory on every interactive component per Elite UI/UX Engineer Charter |
| Components | **shadcn/ui + Aceternity UI + Magic UI** | Owned-by-you primitives + wow-factor patterns |
| Fonts | **Geist + Inter via `next/font`** | Premium typography, locked from `app/layout.tsx` |
| Theming | **next-themes** | Dark + light + system, hydration-safe |
| Utilities | **`clsx` + `tailwind-merge`** | Required for all conditional classes — `cn()` helper in `lib/utils.ts` |
| Hosting | **Vercel** | $0 Hobby tier covers v0.1 client work; `vercel.json` includes hardened security headers |

## Effect library

16 effects scaffolded under `components/effects/`. Each declares brand-archetype alignment + performance cost + voice-of-motion tags via `meta.ts`. Query via `effectRegistry`:

```tsx
import { filterByArchetype, filterByPerfBudget } from "@/components/effects";

const magicianEffects = filterByArchetype("Magician", "serves");
const cheapEffects = filterByPerfBudget(20); // KB gzip
```

**Complete (4):** `fluid-color-mix` · `particle-field` · `bloom-glow` · `aurora-gradient`
**Stub (12):** `smoke-volumetric` · `chromatic-aberration` · `liquid-cursor` · `holographic-foil` · `displacement-noise` · `refraction-glass` · `magnetic-cursor` · `dust-particles` · `god-rays` · `voronoi-pattern` · `glitch-effect` · `restraint-tier` — full implementations in v1.0

The flagship `fluid-color-mix` solves Tarak's specific need (smoky/wispy multi-color hero transitions) — see `components/effects/fluid-color-mix/README.md`.

Selection logic lives in the DesignGod skill at `.claude/skills/designgod/workflows/advanced-renderer-router.md`. Archetype × effect compatibility matrix: `.claude/skills/designgod/references/archetype-effect-matrix.md`.

## Advanced tooling stack

Beyond the base stack, the starter ships these cutting-edge tools (binding for $10K bar):

| Layer | Tools | Purpose |
|---|---|---|
| **3D / WebGL** | `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `ogl` | Custom shaders, hero scenes, post-FX |
| **Timeline animation** | `gsap`, `@theatre/core`, `@theatre/studio` | Designer-grade choreography, named beats, scroll-driven |
| **Smooth scroll** | `lenis` | Industry-standard smooth scroll (Linear / Vercel / Cursor parity) |
| **Pre-rendered animations** | `lottie-react`, `@rive-app/react-canvas` | After Effects + Rive runtime |
| **Particles** | `tsparticles`, `@tsparticles/slim`, `@tsparticles/react` | Atmospheric backgrounds |
| **Spring physics** | `react-spring`, `@formkit/auto-animate` | Physics-driven motion |
| **Premium primitives** | `vaul`, `embla-carousel-react`, `@floating-ui/react` | Drawers, carousels, anchor positioning |
| **2D canvas** | `paper`, `konva`, `react-konva` | Vector ops, custom 2D scenes |
| **Gradient backgrounds** | `@shadergradient/react` | Premium animated gradients |
| **Performance** | `@vercel/speed-insights`, `@vercel/analytics`, `@builder.io/partytown` | Real-user perf + worker offload |
| **Dev tools** | `leva`, `r3f-perf`, `@next/bundle-analyzer` | R3F debug GUI, perf overlay, bundle inspection |

## Quality gates ($10K bar)

Every artifact ships only when:

- Lighthouse 100/100/100/100 (perf / a11y / best / SEO)
- axe-core: 0 violations
- WCAG 2.2 AA min, AAA where feasible
- CLS = 0
- LCP < 1.0s
- TBT < 50ms
- Initial JS bundle < 100KB gzip
- Animation 60fps under 4× CPU throttle
- Framer Motion present on every interactive component
- Zero custom CSS files
- `cn()` for all conditional classes
- Geist or Inter only

Verify locally:
```bash
pnpm dev          # runs at http://localhost:3000
pnpm quality      # runs lighthouse + axe; outputs to .quality/
```

## Quick start

```bash
# Clone and install
git clone https://github.com/MetaphysicalMaster/chitta-design-elite-starter.git
cd chitta-design-elite-starter
pnpm install

# Run dev
pnpm dev
# Open http://localhost:3000

# Run quality gates
pnpm quality
# View ./.quality/lighthouse-desktop.html in browser

# Build for production
pnpm build
pnpm start
```

## Adding components

shadcn components install via official CLI (config already at `components.json`):

```bash
npx shadcn@latest add button card dialog input form
```

Aceternity UI patterns: copy from [aceternity.com](https://ui.aceternity.com/) docs into `components/aceternity/`.

Magic UI: `npx shadcn@latest add "https://magicui.design/r/<component>"`.

## Token system

All visual tokens live in `app/globals.css` inside the `@theme` block (Tailwind v4 syntax).

- **Colors** are OKLch (perceptually uniform). Light mode at `:root`; dark mode at `[data-theme="dark"]`.
- **Spacing** uses 4px base scale.
- **Type scale** uses Major Third ratio (1.25×).
- **Motion durations + easings** named for use in Framer Motion `transition.ease` / `transition.duration`.
- **Reduced motion** killed by `@media (prefers-reduced-motion: reduce)`.

Override per-client by editing the `@theme` block. That's the entire branding surface.

## Project structure

```
chitta-design-elite-starter/
├── app/
│   ├── globals.css         ← Token system (Tailwind v4 @theme)
│   ├── layout.tsx          ← Root layout + ThemeProvider + fonts
│   ├── page.tsx            ← Demo landing showcasing stack
│   └── favicon.ico
├── components/
│   └── ui/
│       └── theme-toggle.tsx ← Motion-rich theme switcher
├── lib/
│   └── utils.ts            ← cn() helper (clsx + tailwind-merge)
├── public/
├── components.json         ← shadcn/ui config
├── vercel.json             ← Deploy config + security headers
├── postcss.config.mjs      ← Tailwind v4 PostCSS plugin
├── tsconfig.json
├── next.config.ts
└── package.json
```

## Per-client workflow

1. **Fork** this repo to `client-<slug>-website` under MetaphysicalMaster (or transfer to client at delivery).
2. **Run brand-absorb** via DesignGod skill against client's existing brand assets → `brand-spec.md`.
3. **Run token-system** → swap `@theme` block in `app/globals.css` with brand-derived OKLch tokens.
4. **Run artifact-spec** → `design-spec.md` (IA, hierarchy, motion plan, state map).
5. **Run reference-curator** → load 3-5 brand-category-matched exemplars into render context.
6. **Render pages** following design-spec + exemplars + Elite UI/UX Engineer Charter.
7. **Run gates-enforcer + critique-7d + visual-diff** → measure against $10K bar.
8. **Run refine-loop** until all gates pass + critique ≥8/10 on every dimension.
9. **Run copy-route + voice-fingerprint** → all strings through brand voice authority.
10. **Deploy to Vercel** → custom domain → SSL → hand off.

Full DesignGod recipe: `.claude/skills/designgod/recipes/client-website.json` (in CHITTA repo).

## Constraints (binding)

Per Elite UI/UX Engineer Charter (`.claude/skills/designgod/references/elite-uiux-charter@v1.md`):

- **Animation First.** Never `<div>` where `<motion.div>` should be.
- **Typography.** Geist or Inter only.
- **Consistency.** `cn()` for all conditional classes.
- **Component Fetching.** If shadcn/Aceternity/Magic UI ships it, use it.
- **Visual Audit.** Before any "done" — responsive padding, contrast, hover/active states checked.

If a brief implies a "bad" or "dated" design, suggest a modern alternative using a contemporary open-source component.

## Deferred (v1.0 — next week)

The following parts of DesignGod are scaffolded but not yet complete (deferred to limit-reset):
- `interaction-engineer.md` — 7 UI states sub-skill
- `platform-fluency.md` — 2026 web platform features sub-skill
- `evidence-cite.md` — decision audit trail sub-skill
- 4 remaining recipes (article-hero, social-carousel, email-campaign, dream-card, landing-page)
- 8 reference link-out files (refactoring-ui, material-3, hig, motion-craft, etc.)
- 7 exemplar pool files
- Telemetry spec
- Test eval cases

The 12 sub-skills + client-website recipe + this starter are sufficient to begin client work.

## License

UNLICENSED · Proprietary · MetaphysicalMaster (Tarak Uday) all rights reserved.

## Maintained by

[@MetaphysicalMaster](https://github.com/MetaphysicalMaster) · CHITTA · Awaken Within Publications
