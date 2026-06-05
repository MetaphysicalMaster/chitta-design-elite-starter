/**
 * Aurora shaders — the volumetric "northern-lights" backdrop for Happy Clinic.
 *
 * An orthographic full-bleed plane renders:
 *  1. A night-sky vertical gradient (deep aurora-violet → indigo) with a faint
 *     star dusting.
 *  2. Drifting volumetric aurora curtains (violet → magenta → teal → cyan)
 *     built from layered domain-warped FBM noise, parallaxing on scroll and
 *     swaying with time + a gentle pull toward the cursor.
 *  3. A faint Rockies ridge silhouette on the horizon, with the aurora glowing
 *     just above it (altitude + optimism).
 *
 * Loaded ONLY via dynamic({ ssr:false }) from AuroraHero (a client component) —
 * WebGL/R3F is not SSR-safe. A static CSS aurora gradient covers SSR, mobile,
 * reduced-motion and no-WebGL (AuroraHero).
 */

export const auroraVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const auroraFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;     // -1..1
  uniform float u_scroll;      // 0..1 hero scroll progress (parallax)
  uniform float u_intensity;   // mount fade-in 0..1
  uniform vec3  u_night0;       // top of sky
  uniform vec3  u_night1;       // horizon sky
  uniform vec3  u_violet;
  uniform vec3  u_magenta;
  uniform vec3  u_teal;
  uniform vec3  u_cyan;
  uniform vec3  u_ridge;

  // ---- noise toolkit ----
  float hash(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++){
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  // Rockies ridge silhouette height at horizontal coord x (0..1).
  float ridgeHeight(float x){
    // layered low-frequency noise → jagged but believable peak line.
    float h = 0.0;
    h += 0.06 * noise(vec2(x * 3.0, 7.0));
    h += 0.05 * noise(vec2(x * 6.0, 13.0));
    h += 0.03 * noise(vec2(x * 12.0, 21.0));
    h += 0.018 * noise(vec2(x * 24.0, 31.0));
    return h * 1.15 + 0.05;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);

    // ---- night sky base (vertical) ----
    vec3 col = mix(u_night1, u_night0, smoothstep(0.0, 1.0, uv.y));

    // faint star dusting in the upper sky
    float stars = step(0.9975, hash(floor(uv * vec2(420.0, 320.0))));
    col += stars * smoothstep(0.35, 1.0, uv.y) * 0.5;

    // ---- aurora curtains ----
    // parallax: scroll pushes the aurora up + softens it; cursor sways it.
    float par = u_scroll * 0.22;
    vec2 ap = vec2(uv.x * aspect, uv.y);
    ap.x += u_pointer.x * 0.06;

    // domain-warp the sampling coords so curtains ripple like real aurora.
    float t = u_time * 0.06;
    vec2 warp = vec2(
      fbm(ap * vec2(1.6, 2.2) + vec2(t, t * 0.5)),
      fbm(ap * vec2(2.0, 1.4) + vec2(-t * 0.7, t))
    );
    float bands = fbm(ap * vec2(2.4, 3.4) + warp * 1.4 + vec2(t * 1.5, 0.0));

    // vertical envelope: aurora lives in the mid-upper sky, fading at top/bottom
    float baseY = 0.40 + par + bands * 0.18;
    float curtain = smoothstep(0.34, 0.0, abs(uv.y - baseY - 0.12))
                  + 0.6 * smoothstep(0.5, 0.0, abs(uv.y - baseY + 0.06));
    curtain *= (0.55 + 0.45 * bands);

    // vertical streaking (the rays that hang down from a curtain)
    float rays = fbm(vec2(ap.x * 14.0 + warp.x * 2.0, uv.y * 2.0 - t));
    curtain *= mix(0.7, 1.25, rays);

    // ---- aurora color ramp: violet → magenta → teal → cyan across x + noise --
    float hueMix = clamp(uv.x * 0.8 + bands * 0.5 + u_pointer.x * 0.1, 0.0, 1.0);
    vec3 aur = mix(u_violet, u_magenta, smoothstep(0.0, 0.35, hueMix));
    aur = mix(aur, u_teal, smoothstep(0.35, 0.72, hueMix));
    aur = mix(aur, u_cyan, smoothstep(0.72, 1.0, hueMix));

    // brighten the lower edge of the curtain (classic aurora glow)
    float glow = smoothstep(0.0, 0.3, curtain);
    col += aur * curtain * 1.35 * glow;

    // soft cyan ground-glow just above the ridge
    float horizonGlow = smoothstep(0.32, 0.12, uv.y) * smoothstep(0.04, 0.18, uv.y);
    col += u_cyan * horizonGlow * 0.18;

    // ---- Rockies ridge silhouette ----
    float rh = ridgeHeight(uv.x + 0.02 * sin(u_time * 0.05));
    float ridgeMask = smoothstep(rh + 0.004, rh - 0.004, uv.y);
    // distant haze on the ridge so it doesn't read as a flat black cutout
    vec3 ridgeCol = mix(u_ridge, u_night0, 0.25);
    col = mix(col, ridgeCol, ridgeMask);
    // rim light on the ridge crest from the aurora
    float rim = smoothstep(0.012, 0.0, abs(uv.y - rh)) * 0.6;
    col += aur * rim * (0.4 + 0.6 * bands);

    // faint grain to avoid banding
    col += (noise(uv * u_resolution.xy * 0.5 + u_time) - 0.5) * 0.012;

    // gentle vignette to seat copy
    float vig = smoothstep(1.4, 0.3, length((uv - 0.5) * vec2(aspect, 1.0)));
    col *= mix(0.78, 1.0, vig);

    col *= u_intensity;

    gl_FragColor = vec4(col, 1.0);
  }
`;
