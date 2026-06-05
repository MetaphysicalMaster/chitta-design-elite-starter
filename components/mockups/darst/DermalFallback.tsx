"use client";

/**
 * DermalFallback — the on-brand STATIC dermal cross-section illustration.
 *
 * Shown whenever the WebGL lattice cannot or should not run: SSR, mobile,
 * no-WebGL, save-data, and prefers-reduced-motion. It is layered over the
 * `.lattice-fallback` CSS strata field so the hero is NEVER blank and there is
 * zero CLS. An anatomy-plate SVG: labelled depth strata (corneum → epidermis →
 * dermis → hypodermis), a fine cellular particle lattice, one oxblood capillary,
 * and a hair follicle — the same diagram the live WebGL resolves into.
 *
 * Decorative: aria-hidden. The hero copy carries the accessible meaning.
 */

const STRATA = [
  { label: "Stratum corneum", y: 38 },
  { label: "Epidermis", y: 96 },
  { label: "Dermis", y: 196 },
  { label: "Hypodermis", y: 320 },
];

/* Deterministic cell dots so the lattice reads as ordered tissue, not noise. */
function cells() {
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  let s = 1337;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let row = 0; row < 18; row++) {
    const y = 30 + row * 21;
    const depth = row / 17;
    const count = 26;
    for (let i = 0; i < count; i++) {
      const x = 16 + i * 30.5 + (rnd() - 0.5) * 16;
      dots.push({
        x,
        y: y + (rnd() - 0.5) * 10,
        r: 1 + rnd() * 1.4,
        // fade with depth — surface cells paler/denser, deep cells sparser
        o: 0.5 - depth * 0.28 + rnd() * 0.12,
      });
    }
  }
  return dots;
}

const CELLS = cells();

export function DermalFallback() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="dt-strata" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(92% 0.018 72)" />
          <stop offset="14%" stopColor="oklch(80% 0.04 68)" />
          <stop offset="34%" stopColor="oklch(60% 0.055 63)" />
          <stop offset="64%" stopColor="oklch(40% 0.05 60)" />
          <stop offset="100%" stopColor="oklch(20% 0.035 56)" />
        </linearGradient>
        <radialGradient id="dt-focus" cx="38%" cy="46%" r="62%">
          <stop offset="0%" stopColor="oklch(100% 0 0 / 0.14)" />
          <stop offset="100%" stopColor="oklch(100% 0 0 / 0)" />
        </radialGradient>
      </defs>

      {/* strata base */}
      <rect x="0" y="0" width="800" height="400" fill="url(#dt-strata)" />

      {/* stratum dividing hairlines */}
      {STRATA.slice(1).map((s) => (
        <line
          key={s.label}
          x1="0"
          x2="800"
          y1={s.y}
          y2={s.y}
          stroke="oklch(96% 0.012 72 / 0.16)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      ))}

      {/* cellular particle lattice */}
      <g>
        {CELLS.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={c.r}
            fill="oklch(95% 0.012 72)"
            opacity={Math.max(0.06, c.o)}
          />
        ))}
      </g>

      {/* the lone TEAL capillary — a meandering vessel through the dermis */}
      <path
        d="M -10 230 C 120 200, 200 268, 330 236 S 560 200, 690 250 S 820 232, 820 232"
        fill="none"
        stroke="oklch(62% 0.1 195)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M -10 250 C 140 228, 240 288, 360 258 S 600 232, 810 272"
        fill="none"
        stroke="oklch(56% 0.09 196 / 0.6)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* a single hair follicle descending from the surface (anatomy plate) */}
      <path
        d="M 600 8 C 600 90, 588 180, 596 268 C 600 300, 618 312, 612 340"
        fill="none"
        stroke="oklch(88% 0.022 70 / 0.5)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="612" cy="344" r="9" fill="none" stroke="oklch(80% 0.03 66 / 0.5)" strokeWidth="2" />

      {/* depth labels — the journal annotation */}
      <g
        fontFamily="var(--font-sans)"
        fontSize="11"
        letterSpacing="0.16em"
        fill="oklch(96% 0.012 72 / 0.62)"
      >
        {STRATA.map((s) => (
          <g key={s.label}>
            <line
              x1="700"
              x2="724"
              y1={s.y + 14}
              y2={s.y + 14}
              stroke="oklch(96% 0.012 72 / 0.4)"
              strokeWidth="1"
            />
            <text x="730" y={s.y + 18}>{s.label.toUpperCase()}</text>
          </g>
        ))}
      </g>

      {/* soft focal lens highlight */}
      <rect x="0" y="0" width="800" height="400" fill="url(#dt-focus)" />
    </svg>
  );
}
