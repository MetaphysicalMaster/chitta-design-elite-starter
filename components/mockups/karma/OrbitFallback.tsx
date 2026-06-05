"use client";

/**
 * OrbitFallback — the on-brand STATIC balance / orbit diagram.
 *
 * Shown whenever the WebGL orbit field cannot or should not run: SSR, mobile,
 * no-WebGL, save-data, and prefers-reduced-motion. It is layered over the
 * `.orbit-fallback` CSS field (concentric rings + a gravitational center) so the
 * hero is NEVER blank and there is zero CLS. A serene concentric-balance plate:
 * nested orbital rings around a soft sage center, with a handful of grounded
 * motes (sage / terracotta / sand) resting on the rings in equilibrium — the
 * same diagram the live WebGL settles into.
 *
 * Decorative: aria-hidden. The hero copy carries the accessible meaning.
 */

/* Deterministic motes resting on the rings so the field reads as balanced
   equilibrium, not noise. */
function motes() {
  const out: { x: number; y: number; r: number; fill: string; o: number }[] = [];
  let s = 4242;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const rings = [70, 122, 176, 232];
  const fills = [
    "oklch(66% 0.09 146)", // sage
    "oklch(64% 0.12 46)", // terracotta
    "oklch(82% 0.06 82)", // sand
    "oklch(54% 0.07 150)", // moss
  ];
  rings.forEach((ring, ri) => {
    const count = 6 + ri * 3;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rnd() * 0.5;
      out.push({
        x: 300 + Math.cos(a) * ring,
        y: 300 + Math.sin(a) * ring * 0.66,
        r: 1.6 + rnd() * 2.2,
        fill: fills[(ri + i) % fills.length],
        o: 0.5 + rnd() * 0.4,
      });
    }
  });
  return out;
}

const MOTES = motes();
const RINGS = [70, 122, 176, 232];

export function OrbitFallback() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="km-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(88% 0.05 120 / 0.9)" />
          <stop offset="40%" stopColor="oklch(66% 0.09 146 / 0.5)" />
          <stop offset="100%" stopColor="oklch(66% 0.09 146 / 0)" />
        </radialGradient>
        <radialGradient id="km-glow" cx="50%" cy="46%" r="62%">
          <stop offset="0%" stopColor="oklch(100% 0 0 / 0.08)" />
          <stop offset="100%" stopColor="oklch(100% 0 0 / 0)" />
        </radialGradient>
      </defs>

      {/* soft gravitational glow */}
      <rect x="0" y="0" width="600" height="600" fill="url(#km-glow)" />

      {/* concentric balance rings (tilted ellipses for soft 3D volume) */}
      <g
        fill="none"
        stroke="oklch(72% 0.07 144 / 0.22)"
        strokeWidth="1"
        transform="translate(300 300)"
      >
        {RINGS.map((ring, i) => (
          <ellipse
            key={ring}
            cx="0"
            cy="0"
            rx={ring}
            ry={ring * 0.66}
            stroke={
              i % 2 === 0
                ? "oklch(72% 0.07 144 / 0.22)"
                : "oklch(66% 0.1 48 / 0.2)"
            }
          />
        ))}
      </g>

      {/* the gravitational center seed */}
      <circle cx="300" cy="300" r="120" fill="url(#km-core)" />
      <circle cx="300" cy="300" r="6" fill="oklch(88% 0.05 120)" />

      {/* orbiting motes resting in equilibrium on the rings */}
      <g>
        {MOTES.map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y} r={m.r} fill={m.fill} opacity={m.o} />
        ))}
      </g>
    </svg>
  );
}
