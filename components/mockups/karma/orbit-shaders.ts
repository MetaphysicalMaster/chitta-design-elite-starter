/**
 * orbit-shaders.ts — GLSL for the "balance / orbit flow-field" particle system.
 *
 * A single GPU particle system (one draw call, thousands of points) whose
 * vertices are driven entirely on the GPU. Each particle orbits a calm
 * gravitational center on its own elliptical ring and SETTLES into equilibrium:
 * it begins on a slightly perturbed, eccentric orbit and eases toward a steady,
 * balanced ring as `uSettle` rises. A literal "karma / balance" visual — gentle
 * botanical flow that eases on scroll; the cursor subtly perturbs nearby motes,
 * which then re-balance. Color is a grounded botanical ramp by radius (sage
 * core → moss → terracotta → warm sand rim). Serene, meditative, never flashy.
 *
 * Motion lives in the shader to hold a 60fps budget. JS updates only a handful
 * of uniforms per frame (time, settle, scroll-ease, eased pointer).
 */

export const orbitVertexShader = /* glsl */ `
  precision highp float;

  // Per-particle data
  attribute float aRadius;   // orbital radius (distance from center)
  attribute float aAngle;    // initial angular position (radians)
  attribute float aSpeed;    // angular velocity multiplier (Keplerian-ish)
  attribute float aTilt;     // ring tilt / eccentricity seed
  attribute float aZ;        // out-of-plane offset for soft volume
  attribute float aSeed;     // 0..1 random per particle
  attribute float aScale;    // base point-size multiplier

  uniform float uTime;
  uniform float uSettle;     // 0 perturbed/eccentric .. 1 settled equilibrium
  uniform float uIntro;      // 0..1 reveal on mount
  uniform float uEase;       // 0..1 scroll-ease: 1 = full flow, 0 = near-still
  uniform float uDpr;
  uniform float uSize;       // global point-size scale
  uniform vec2  uPointer;    // -1..1 cursor in clip-ish space
  uniform float uPointerStr; // 0..1 strength (eased on enter/leave)

  varying float vRadius;     // normalized radius -> color ramp
  varying float vGlow;       // cursor proximity glow
  varying float vBright;     // settle/seed brightness

  void main() {
    // Angular motion: inner motes orbit faster (gentle Keplerian feel). The
    // scroll-ease slows the whole flow toward stillness without stopping it.
    float omega = aSpeed * (0.18 + 0.12 / (aRadius + 0.35));
    float ang = aAngle + uTime * omega * (0.35 + 0.65 * uEase);

    // Equilibrium radius vs. an eccentric/perturbed radius. As uSettle rises,
    // the eccentric wobble eases out and each mote rests on its balanced ring.
    float wobble = sin(ang * 2.0 + aSeed * 6.2831) * 0.16 * aTilt;
    float ecc = mix(wobble + (aSeed - 0.5) * 0.22, 0.0, smoothstep(0.0, 1.0, uSettle));
    float radius = aRadius + ecc;

    // Position on a gently tilted ring (tilt gives soft 3D volume, not a flat
    // disc). aZ + a small breathing term keep it organic.
    float breathe = sin(uTime * 0.5 + aSeed * 6.2831) * 0.04;
    vec3 pos = vec3(
      cos(ang) * radius,
      sin(ang) * radius * (0.62 + aTilt * 0.18),
      aZ + sin(ang * 1.3 + aSeed * 4.0) * 0.18 + breathe
    );

    // --- Cursor perturbation: gently push nearby motes outward, then they
    //     re-balance as the influence fades (handled by eased uPointerStr). ---
    vec3 pointer3 = vec3(uPointer * 1.6, 0.0);
    vec3 toP = pos - pointer3;
    float d = length(toP.xy) + 0.0001;
    float influence = uPointerStr * smoothstep(1.0, 0.0, d);
    pos.xy += (toP.xy / d) * influence * 0.26;
    pos.z += influence * 0.12;

    // Intro reveal — motes ease in from a slightly contracted core.
    pos = mix(pos * 0.7, pos, smoothstep(0.0, 1.0, uIntro));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size: perspective attenuation + per-particle scale + dpr.
    float size = uSize * aScale * (0.7 + 0.5 * aSeed);
    gl_PointSize = size * uDpr * (300.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.0, 15.0 * uDpr);

    vRadius = clamp(aRadius / 2.0, 0.0, 1.0);
    vGlow = influence;
    vBright = 0.7 + 0.3 * aSeed;
  }
`;

export const orbitFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3  uCore;     // sage core
  uniform vec3  uMoss;
  uniform vec3  uTerra;    // terracotta mid-ring
  uniform vec3  uSand;     // warm sand rim
  uniform vec3  uBloom;    // pale sage cursor bloom

  varying float vRadius;
  varying float vGlow;
  varying float vBright;

  void main() {
    // Soft round sprite (no texture), feathered edge.
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float alpha = smoothstep(0.5, 0.16, r);
    if (alpha <= 0.001) discard;

    // Grounded botanical ramp by orbital radius:
    // sage core -> moss -> terracotta -> warm sand rim.
    vec3 col = mix(uCore, uMoss, smoothstep(0.0, 0.34, vRadius));
    col = mix(col, uTerra, smoothstep(0.32, 0.66, vRadius));
    col = mix(col, uSand, smoothstep(0.62, 1.0, vRadius));

    // Cursor proximity warms a faint pale-sage bloom (serene, restrained).
    col = mix(col, uBloom, vGlow * 0.55);

    col *= vBright;

    float a = alpha * (0.5 + 0.45 * vBright);
    a += vGlow * 0.2; // perturbed motes glint a touch brighter

    gl_FragColor = vec4(col, a);
  }
`;
