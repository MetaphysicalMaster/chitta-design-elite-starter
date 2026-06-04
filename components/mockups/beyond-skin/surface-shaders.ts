/**
 * surface-shaders.ts — GLSL for the "Beyond the Surface" particle-morph hero.
 *
 * A single GPU particle system (drei <Points>) whose vertices are driven
 * entirely on the GPU: each particle interpolates between morph targets
 * (face profile → leaf/botanical → flowing ribbon → dispersed cloud), drifts
 * with curl-style noise, and bends around a cursor flow field. Color is a
 * brand-tinted gradient based on depth + life, output to additive blending +
 * Bloom for a luminous "skin/light" read.
 *
 * Motion lives in the shader (one draw call, thousands of points) to hold a
 * 60fps budget. JS only updates a handful of uniforms per frame.
 */

export const surfaceVertexShader = /* glsl */ `
  precision highp float;

  // Per-particle morph targets (positions for each named shape)
  attribute vec3 aFace;
  attribute vec3 aLeaf;
  attribute vec3 aRibbon;
  attribute vec3 aCloud;
  attribute float aSeed;     // 0..1 random per particle
  attribute float aScale;    // base point size multiplier

  uniform float uTime;
  uniform float uMorph;      // 0..3 continuous morph phase
  uniform float uDpr;
  uniform float uSize;       // global point-size scale
  uniform vec2  uPointer;    // -1..1 cursor in clip-ish space
  uniform float uPointerStr; // 0..1 strength (eased on enter/leave)
  uniform float uIntro;      // 0..1 reveal on mount

  varying float vLife;       // 0..1 used for color/alpha
  varying float vDepth;      // view-space depth term for color
  varying float vGlow;       // cursor proximity glow

  // Cheap hash-based 3D noise (curl-ish drift, no textures).
  vec3 hash3(vec3 p) {
    p = vec3(
      dot(p, vec3(127.1, 311.7, 74.7)),
      dot(p, vec3(269.5, 183.3, 246.1)),
      dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  // Smooth interpolation between the 4 morph targets along uMorph (0..3),
  // looping back to face. Uses smoothstep windows for organic dissolve.
  vec3 morphPosition(float phase) {
    // phase in [0,4); 3->4 returns to face
    vec3 a = aFace;
    vec3 b = aLeaf;
    vec3 c = aRibbon;
    vec3 d = aCloud;

    float f01 = smoothstep(0.0, 1.0, clamp(phase, 0.0, 1.0));
    float f12 = smoothstep(0.0, 1.0, clamp(phase - 1.0, 0.0, 1.0));
    float f23 = smoothstep(0.0, 1.0, clamp(phase - 2.0, 0.0, 1.0));
    float f34 = smoothstep(0.0, 1.0, clamp(phase - 3.0, 0.0, 1.0));

    vec3 p = mix(a, b, f01);
    p = mix(p, c, f12);
    p = mix(p, d, f23);
    p = mix(p, a, f34);
    return p;
  }

  void main() {
    // Continuous looping phase 0..4
    float phase = mod(uMorph, 4.0);
    vec3 pos = morphPosition(phase);

    // Organic drift — particles never sit perfectly still ("alive skin").
    float t = uTime * 0.18;
    vec3 n = hash3(pos * 0.7 + aSeed * 13.0 + t);
    float driftAmt = 0.06 + 0.04 * sin(uTime * 0.5 + aSeed * 6.2831);
    pos += n * driftAmt;

    // Dissolve burst near morph transitions (when fract(phase) ~ 0.5).
    float transition = abs(fract(phase) - 0.5); // 0 at mid-transition
    float burst = smoothstep(0.5, 0.0, transition); // 1 mid-transition
    pos += n * burst * (0.25 + 0.5 * aSeed);

    // --- Cursor flow field: gentle attraction + swirl around the pointer ---
    // Project a pointer position into the particle plane (z~0).
    vec3 pointer3 = vec3(uPointer * 1.6, 0.0);
    vec3 toP = pos - pointer3;
    float d = length(toP.xy) + 0.0001;
    float influence = uPointerStr * smoothstep(1.3, 0.0, d);
    // Swirl: rotate the in-plane offset, push slightly outward (repel).
    vec2 swirl = vec2(-toP.y, toP.x) / d;
    pos.xy += swirl * influence * 0.22;
    pos.xy += (toP.xy / d) * influence * 0.12;
    pos.z += influence * 0.25 * sin(uTime * 1.4 + aSeed * 6.2831);

    // Intro reveal — particles fly in from a dispersed cloud.
    pos = mix(aCloud * 1.4, pos, smoothstep(0.0, 1.0, uIntro));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size: perspective attenuation + per-particle scale + dpr.
    float size = uSize * aScale * (0.6 + 0.7 * aSeed);
    gl_PointSize = size * uDpr * (300.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.0, 14.0 * uDpr);

    // Varyings for the fragment shader.
    vLife = 0.35 + 0.65 * aSeed + burst * 0.4;
    vDepth = clamp((-mvPosition.z - 3.0) / 5.0, 0.0, 1.0);
    vGlow = influence;
  }
`;

export const surfaceFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3  uColorRose;
  uniform vec3  uColorBronze;
  uniform vec3  uColorGold;
  uniform vec3  uColorDeep;

  varying float vLife;
  varying float vDepth;
  varying float vGlow;

  void main() {
    // Soft round sprite (no texture): radial falloff -> feathered dot.
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float alpha = smoothstep(0.5, 0.06, r);
    if (alpha <= 0.001) discard;

    // Brand-tinted color: depth blends deep->bronze, life lifts toward gold,
    // cursor proximity flares rose. Reads as luminous skin/light.
    vec3 col = mix(uColorDeep, uColorBronze, smoothstep(0.0, 1.0, vDepth));
    col = mix(col, uColorRose, smoothstep(0.3, 1.0, vLife));
    col = mix(col, uColorGold, vGlow * 0.8);

    // Gentle core hotspot for additive bloom pickup.
    float core = smoothstep(0.32, 0.0, r);
    col += core * 0.35 * (0.6 + 0.6 * vLife);

    float a = alpha * (0.5 + 0.5 * vLife);
    gl_FragColor = vec4(col, a);
  }
`;
