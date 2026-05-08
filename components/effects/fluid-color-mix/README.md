# Fluid Color Mix

Wispy, smoky color transitions between 2-5 stages. Solves the "choppy linear color shift" problem.

## Why this exists

Tarak's specific need: hero background transitioning white → cream → brown → cream → red on scroll. Standard CSS gradient transitions look choppy because:
1. Linear RGB interpolation is perceptually uneven
2. No noise displacement = mathematically clean = visually flat
3. Single layer = no atmospheric depth

This effect uses:
- Multi-octave simplex noise for organic wispy distortion
- Smoothstep easing on stage transitions (less linear feel)
- OKLCh-aware color order (stages should be palette-friendly transitions)
- React Three Fiber for GPU-accelerated rendering

## Usage

```tsx
import dynamic from "next/dynamic";

// Lazy-load (R3F is client-only)
const FluidColorMix = dynamic(
  () => import("@/components/effects/fluid-color-mix").then(m => m.FluidColorMix),
  { ssr: false, loading: () => <FluidColorMixFallback colors={["#fff", "#f5e8d3"]} /> }
);
import { FluidColorMixFallback } from "@/components/effects/fluid-color-mix/fallback";

export function Hero() {
  return (
    <section className="relative min-h-screen">
      <FluidColorMix
        colors={["#ffffff", "#f5e8d3", "#8b5a2b", "#f5e8d3", "#c14a4a"]}
        scrollDriven
        noiseScale={3}
        flowSpeed={0.08}
        className="absolute inset-0 -z-10"
      />
      <div className="relative z-10">
        {/* hero content */}
      </div>
    </section>
  );
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | required | 2-5 colors for transition stages (hex or any CSS color) |
| `progress` | `number` | `0` | Manual progress 0-1; ignored if `scrollDriven` |
| `scrollDriven` | `boolean` | `false` | Drive progress from page scroll |
| `noiseScale` | `number` | `3` | Noise frequency (higher = denser wisps) |
| `flowSpeed` | `number` | `0.08` | Animation speed multiplier |
| `className` | `string` | — | Class on outer wrapper |
| `style` | `CSSProperties` | — | Style on outer wrapper |

## Mobile / reduced-motion fallback

Use `FluidColorMixFallback` from `./fallback`. Pure CSS conic-gradient + blur.

```tsx
import { FluidColorMixFallback } from "@/components/effects/fluid-color-mix/fallback";

// In your component:
const isReducedMotion = useReducedMotion();
const isMobile = /* device check */;

return isReducedMotion || isMobile ? (
  <FluidColorMixFallback colors={colors} className="absolute inset-0 -z-10" />
) : (
  <FluidColorMix colors={colors} scrollDriven className="absolute inset-0 -z-10" />
);
```

## Performance

| Metric | Value |
|---|---|
| Bundle size | ~24KB gzip (R3F core required) |
| FPS under 4× CPU throttle | ~58 |
| GPU intensity | Medium |
| SSR-safe | No (must wrap in `dynamic({ ssr: false })`) |
| WebGL requirement | WebGL2 |

## Archetype alignment

| Archetype | Alignment |
|---|---|
| Magician | Serves strongly |
| Lover | Serves strongly |
| Caregiver | Serves |
| Creator | Serves |
| Innocent | Serves |
| Sage | Neutral |
| Explorer | Neutral |
| Hero | Neutral |
| Outlaw | Neutral |
| Jester | Neutral |
| Everyman | Neutral |
| Ruler | **Violates** (Ruler archetype favors structured, controlled, geometric — not organic flow) |

## Voice-of-motion tags

flowing, organic, atmospheric, dreamy, ethereal

## CHITTA-specific guidance

CHITTA is Magician archetype with 5D bridge-target. This effect is highly recommended for CHITTA artifacts (article heroes, dream symbol cards, landing pages, onboarding).

Suggested color palettes for CHITTA:
- Earth-stage progression: `["#fff", "#f5e8d3", "#8b5a2b", "#f5e8d3", "#c14a4a"]`
- Consciousness deepening: `["#fafaf7", "#dee9e8", "#7c91a3", "#3a4f5e", "#1a2530"]`
- Dream-state: `["#0f0823", "#3d2459", "#9b6dc9", "#e8c4ff", "#fff5e0"]`
- Chakra-rainbow: `["#ff5e5e", "#ffa05e", "#ffe05e", "#5eff8a", "#5e9eff", "#a05eff", "#ff5ee2"]` (limited to 5 — pick your 5)
