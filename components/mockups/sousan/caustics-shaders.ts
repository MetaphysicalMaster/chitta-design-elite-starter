/**
 * Caustic-light shaders for the Sousan monochrome + hot-pink hero.
 *
 * A full-bleed orthographic backdrop plane that renders slow, refractive
 * HOT-PINK caustics rippling over a deep CHARCOAL void — one pink statement
 * light moving across a near-black studio (mirroring the pink-on-greyscale hero
 * portrait). Kept luminance-additive so Bloom in the composer blooms the
 * brightest pink caustic cores. The faceted neutral-glass gem mesh
 * (MeshTransmissionMaterial) renders on a second transparent canvas above.
 *
 * The shader is palette-driven: u_void0/u_void1 (charcoal), u_gold (hot pink),
 * u_jewel (neutral grey lift) are supplied from CausticsScene's PALETTE, which
 * matches app/mockups/sousan/brand.css (greyscale base + the one pink pop).
 * Variable names (u_gold/u_jewel) are retained; only their VALUES changed.
 */

export const causticVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const causticFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;     // -1..1
  uniform float u_intensity;   // 0..1 reveal (gem "settles" as hero loads)
  uniform vec3  u_void0;       // deep charcoal void
  uniform vec3  u_void1;       // raised charcoal
  uniform vec3  u_gold;        // hot-pink caustic light (the pop)
  uniform vec3  u_jewel;       // neutral-grey highlight lift

  // Hash + value noise (cheap, smooth) for the caustic field.
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
    float amp = 0.55;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  // Caustic web: domain-warped ridges (abs of a signed field) tightened into
  // bright filaments — the signature look of light refracted through water/gem.
  float caustic(vec2 p, float t) {
    // Two warped layers drifting at different rates for organic shimmer.
    vec2 w = vec2(fbm(p + vec2(0.0, t * 0.18)), fbm(p + vec2(5.2, -t * 0.13)));
    float n = fbm(p * 1.6 + w * 2.4 - vec2(t * 0.06, t * 0.04));
    // Ridge: distance from a moving level set → bright thin lines.
    float ridge = 1.0 - abs(n - 0.5) * 2.0;
    ridge = pow(clamp(ridge, 0.0, 1.0), 3.4);
    return ridge;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = (uv - 0.5);
    p.x *= aspect;

    float t = u_time;

    // Caustic light source drifts subtly + leans toward the cursor (the gem's
    // refraction point). Upper-left key, soft studio light.
    vec2 src = vec2(-0.32 + u_pointer.x * 0.12, 0.30 + u_pointer.y * 0.07);
    float srcDist = length(p - src);

    // Layered caustics in two scales for depth.
    float c1 = caustic(p * 3.0, t);
    float c2 = caustic(p * 5.6 + vec2(1.7, -0.6), t * 1.22);
    float web = c1 * 0.75 + c2 * 0.55;

    // Falloff from the key so caustics pool near the light, fade to shadow.
    float pool = exp(-srcDist * 1.15);
    float bed = smoothstep(1.3, 0.0, srcDist); // soft floor wash

    // Base charcoal void gradient (darker toward the lower-right shadow).
    float vgrad = smoothstep(1.05, -0.2, uv.y + (p.x - src.x) * 0.18);
    vec3 base = mix(u_void0, u_void1, vgrad * 0.9);
    // Gentle neutral-grey lift around the source (the light's soft halo).
    base += u_jewel * pool * 0.22;

    vec3 col = base;
    // Hot-pink caustic filaments (the one statement light).
    float goldAmt = (web * (0.35 + pool * 1.25)) ;
    col += u_gold * goldAmt * 1.35;
    // Neutral-grey inner lift where caustics overlap densely.
    col += u_jewel * pow(web, 1.6) * bed * 0.4;

    // Bright caustic cores (Bloom seeds) where the web peaks near the key.
    float cores = pow(web, 2.2) * pool;
    col += u_gold * cores * 1.6;

    // Faint drifting motes catching the refracted light.
    vec2 mp = p * 6.0 + vec2(0.0, t * 0.9);
    float motes = pow(noise(mp + noise(mp * 1.6)), 9.0);
    col += u_gold * motes * (0.4 + pool) * 1.6;

    // Vignette to frame the drawing room.
    float vig = smoothstep(1.35, 0.25, length(p));
    col *= mix(0.74, 1.0, vig);

    // Fine grain to avoid banding on the dark charcoal gradient.
    float grain = (hash(uv * u_resolution + t) - 0.5) * 0.012;
    col += grain;

    // Reveal: the gem settles/brightens as the hero loads.
    col *= mix(0.18, 1.0, u_intensity);

    gl_FragColor = vec4(col, 1.0);
  }
`;
