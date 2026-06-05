/**
 * Skin-glow caustic shaders for the SimplySkin hero power element.
 *
 * A full-bleed orthographic backdrop plane that renders an ultra-soft,
 * refractive "caustic light-sweep" over a warm near-white surface — a quiet,
 * understated sheen behind the hero photograph. Deliberately restrained, NOT a
 * saturated light show: gentle warm-greige caustics with a single whisper of
 * desaturated teal, low contrast, no grain harshness. It must never fight the
 * photo. Bloom in the composer lifts only the brightest caustic cores.
 *
 * Palette matches app/mockups/simplyskin/brand.css (glow-* + accent): the real
 * muted greige/taupe identity, not the previous platinum guess.
 */

export const glowVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;     // -1..1
  uniform float u_intensity;   // 0..1 reveal
  uniform vec3  u_surface;     // luminous platinum base
  uniform vec3  u_nude;        // warm nude
  uniform vec3  u_rose;        // soft rose/champagne
  uniform vec3  u_teal;        // single teal whisper

  // Hash + value noise for soft caustic variation.
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

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = (uv - 0.5);
    p.x *= aspect;

    float t = u_time * 0.05;

    // Soft light source upper-left, drifting + a touch of cursor pull.
    vec2 src = vec2(-0.42 + u_pointer.x * 0.1, 0.34 + u_pointer.y * 0.05);
    vec2 d = p - src;
    float dist = length(d);

    // Domain-warped caustic field: two slow scrolling fbm layers refracting.
    vec2 q = p * 1.6;
    vec2 warp = vec2(
      fbm(q + vec2(t * 0.6, t * 0.3)),
      fbm(q + vec2(-t * 0.4 + 3.1, t * 0.5 + 1.7))
    );
    float caustic = fbm(q + warp * 1.8 + vec2(t * 0.5, 0.0));
    // Sharpen into thin caustic filaments, but keep them soft (low power).
    float filaments = pow(smoothstep(0.42, 0.92, caustic), 2.2);

    // A broad luminous sweep band that travels diagonally (the "light sweep").
    float band = sin((p.x * 0.9 + p.y * 0.55) * 2.4 - t * 2.2);
    band = smoothstep(0.2, 1.0, band) * 0.5;

    // Radial falloff so the glow concentrates near the light source.
    float falloff = exp(-dist * 1.15);
    float core = exp(-dist * 2.6) * 0.6;

    float light = (filaments * 0.55 + band * 0.5 + core) * falloff;

    // Base luminous surface, gently graded toward the source.
    float vgrad = smoothstep(1.1, -0.2, uv.y);
    vec3 base = mix(u_surface, u_nude, vgrad * 0.35 + 0.12);
    base = mix(base, u_rose, smoothstep(0.0, 1.0, uv.y) * 0.14);

    vec3 col = base;
    // Warm nude + platinum caustic light (the bulk of the glow).
    col = mix(col, u_surface, light * 0.7);
    col += u_nude * filaments * falloff * 0.18;
    // Single teal whisper in the caustic cores only — restraint.
    col += u_teal * pow(filaments, 1.6) * falloff * 0.10;
    // Soft rose lift in the lower glow.
    col += u_rose * band * 0.06;

    // Very gentle vignette to frame without darkening the airy look.
    float vig = smoothstep(1.5, 0.4, length(p));
    col *= mix(0.94, 1.0, vig);

    // Fine dither to avoid banding on the near-white gradient (subtle).
    float grain = (hash(uv * u_resolution + u_time) - 0.5) * 0.006;
    col += grain;

    col = mix(u_surface, col, u_intensity);

    gl_FragColor = vec4(col, 1.0);
  }
`;
