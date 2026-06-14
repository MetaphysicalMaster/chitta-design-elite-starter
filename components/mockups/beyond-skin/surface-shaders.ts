/**
 * surface-shaders.ts — GLSL for the "Journey to Wellness" silk light-field.
 *
 * A single full-bleed plane whose surface flows like luminous mauve/plum silk:
 * layered value-noise (fbm) displaces a virtual height-field and lights it from
 * a soft key, so folds catch a rose/blush highlight and valleys sink into plum.
 * A faint guiding "current" sweeps left→right (the journey direction) and the
 * pointer lifts a gentle bloom of light where the guest looks. Brand-tinted,
 * additive-free (it's a lit surface, not particles), so it reads soft + premium.
 *
 * All motion lives in the fragment shader on one quad → trivially 60fps. JS only
 * updates a few uniforms per frame. Loaded ONLY via dynamic({ ssr:false }) from
 * SurfaceHero; a static CSS silk gradient covers SSR / mobile / reduced-motion.
 */

export const surfaceVertexShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const surfaceFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uPointer;     // 0..1, smoothed
  uniform float uPointerStr;  // 0..1
  uniform float uIntro;       // 0..1 reveal on mount
  uniform float uScroll;      // 0..1 page-progress (deepens the journey)
  uniform vec3  uPlumDeep;
  uniform vec3  uPlum;
  uniform vec3  uMauve;
  uniform vec3  uRose;
  uniform vec3  uBlush;

  varying vec2 vUv;

  // --- value noise + fbm -------------------------------------------------
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p = rot * p * 2.0 + 0.07;
      amp *= 0.55;
    }
    return v;
  }

  // Silk height-field: drifting folds with a left→right "current" (the journey).
  float silk(vec2 uv, float t) {
    vec2 q = uv * vec2(2.6, 2.0);
    // domain warp for that liquid-silk fold feel
    vec2 warp = vec2(
      fbm(q + vec2(t * 0.06, t * 0.03)),
      fbm(q + vec2(-t * 0.04, t * 0.05) + 5.2)
    );
    float h = fbm(q + warp * 1.6 + vec2(t * 0.10, 0.0)); // current flows +x
    h += 0.35 * fbm(q * 2.0 - vec2(t * 0.08, t * 0.02));
    return h;
  }

  void main() {
    vec2 uv = vUv;
    // correct for aspect so folds aren't stretched
    vec2 auv = uv;
    auv.x *= uRes.x / max(uRes.y, 1.0);

    float t = uTime * 0.5;

    // Sample the height-field + finite-difference normal for soft lighting.
    float e = 0.0016 * (uRes.y > 0.0 ? 1.0 : 1.0);
    float h  = silk(auv, t);
    float hx = silk(auv + vec2(e, 0.0), t);
    float hy = silk(auv + vec2(0.0, e), t);
    vec3 n = normalize(vec3((h - hx), (h - hy), e * 9.0));

    // Soft key light from upper-left; a fill from lower-right keeps shadows alive.
    vec3 key = normalize(vec3(-0.5, 0.7, 0.8));
    vec3 fill = normalize(vec3(0.6, -0.4, 0.7));
    float dKey = max(dot(n, key), 0.0);
    float dFill = max(dot(n, fill), 0.0) * 0.4;
    float lit = dKey + dFill;
    // specular sheen on the fold crests (the satin highlight)
    float spec = pow(dKey, 22.0) * 0.9;

    // Color ramp: valleys → deep plum, mid → plum/mauve, crests → rose/blush.
    float band = clamp(h * 1.15 + lit * 0.5, 0.0, 1.0);
    vec3 col = mix(uPlumDeep, uPlum, smoothstep(0.0, 0.45, band));
    col = mix(col, uMauve, smoothstep(0.35, 0.72, band));
    col = mix(col, uRose, smoothstep(0.68, 0.95, band));
    col += uBlush * spec;

    // The scroll deepens the field toward the plum core as the journey descends.
    col = mix(col, uPlumDeep, uScroll * 0.18);

    // A gentle left→right luminous "guide" gradient (toward revealed light).
    float guide = smoothstep(0.0, 1.0, uv.x);
    col += uMauve * guide * 0.06;

    // Pointer bloom — a soft halo of light where the guest looks.
    vec2 pa = uPointer;
    pa.x *= uRes.x / max(uRes.y, 1.0);
    float pd = distance(auv, pa);
    float halo = smoothstep(0.5, 0.0, pd) * uPointerStr;
    col += mix(uRose, uBlush, 0.5) * halo * 0.5;

    // Vignette so hero copy on the left stays legible.
    float vig = smoothstep(1.25, 0.25, distance(uv, vec2(0.62, 0.5)));
    col *= 0.72 + 0.28 * vig;

    // Intro reveal: rise out of the plum void.
    col = mix(uPlumDeep, col, smoothstep(0.0, 1.0, uIntro));

    // subtle filmic lift
    col = pow(col, vec3(0.92));
    gl_FragColor = vec4(col, 1.0);
  }
`;
