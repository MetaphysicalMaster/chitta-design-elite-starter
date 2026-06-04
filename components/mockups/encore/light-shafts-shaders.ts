/**
 * Volumetric light-shaft shaders for the Renewal Light hero.
 *
 * A full-bleed orthographic backdrop plane that renders soft, raking
 * god-ray shafts over a dark ink-navy void. Kept additive-feeling via
 * luminance so Bloom in the composer blooms the brightest cores.
 *
 * Palette matches app/mockups/encore/brand.css (warm beam + cool beam).
 */

export const shaftVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const shaftFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;     // -1..1
  uniform float u_intensity;   // 0..1 reveal
  uniform vec3  u_void0;       // deep void
  uniform vec3  u_void1;       // raised void
  uniform vec3  u_beam;        // warm shaft
  uniform vec3  u_beamCool;    // cool shaft

  // Hash + value noise for soft volumetric variation
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
      p *= 2.03;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    // Aspect-correct coords centered at the light source above-center.
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = (uv - 0.5);
    p.x *= aspect;

    // Light source drifts subtly + follows cursor a touch (the rake angle).
    vec2 src = vec2(0.04 + u_pointer.x * 0.12, 0.62 + u_pointer.y * 0.06);
    vec2 dir = p - src;
    float dist = length(dir);
    float ang = atan(dir.y, dir.x);

    // Radial shafts: modulate by angle with layered noise scrolling outward.
    float t = u_time * 0.045;
    float shaftField = 0.0;
    // Two beam systems: a tight warm core + a wider cool spread.
    float warp = ang * 3.0 + dist * 2.2;
    shaftField += fbm(vec2(warp, dist * 3.2 - t * 5.0)) * 0.7;
    shaftField += fbm(vec2(warp * 0.5 - 1.7, dist * 1.6 - t * 2.6)) * 0.5;

    // Sharpen into beams and fade with distance (volumetric falloff).
    float beams = pow(clamp(shaftField, 0.0, 1.0), 2.1);
    float falloff = exp(-dist * 1.55);
    float core = exp(-dist * 3.4) * 0.9; // bright source bloom seed

    // Vertical bias so light reads as descending from upper area.
    float vertical = smoothstep(1.05, -0.15, uv.y);

    float warmAmt = (beams * falloff * 0.85 + core) * vertical;
    float coolAmt = (fbm(vec2(warp * 0.7 + 4.0, dist * 2.0 - t * 3.4)) *
                     falloff * 0.5) * vertical;
    coolAmt = pow(clamp(coolAmt, 0.0, 1.0), 1.6);

    // Base void gradient (dark, raised toward the source).
    float vgrad = smoothstep(1.0, -0.1, uv.y);
    vec3 base = mix(u_void0, u_void1, vgrad * 0.85);
    // Gentle radial lift around the source.
    base += u_void1 * core * 0.6;

    vec3 col = base;
    col += u_beam * warmAmt * 1.15;
    col += u_beamCool * coolAmt * 0.9;

    // Subtle vignette to frame.
    float vig = smoothstep(1.25, 0.25, length(p));
    col *= mix(0.78, 1.0, vig);

    // Fine grain to avoid banding on the dark gradient.
    float grain = (hash(uv * u_resolution + u_time) - 0.5) * 0.012;
    col += grain;

    col *= mix(0.0, 1.0, u_intensity);

    gl_FragColor = vec4(col, 1.0);
  }
`;
