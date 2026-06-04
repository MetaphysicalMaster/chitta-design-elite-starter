/**
 * GLSL for the "Breath of Sky" volumetric hero.
 * Custom fbm (fractional Brownian motion) on simplex noise produces slow,
 * drifting volumetric cloud/aurora bands over a dawn -> day vertical gradient.
 * Palette + parallax + breathing are driven by uniforms from R3F.
 *
 * Authored for serene luxury (soft, low-contrast wisps) — not a tech demo.
 */

export const skyVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const skyFragmentShader = /* glsl */ `
  precision highp float;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;     // -1..1 parallax target (smoothed on CPU)
  uniform float u_intensity;   // 0..1 master fade-in
  uniform vec3  u_dawn;        // warm low band
  uniform vec3  u_mid;         // daylight blue
  uniform vec3  u_high;        // azure
  uniform vec3  u_deep;        // horizon ink
  uniform vec3  u_blush;       // faint rose accent

  varying vec2 vUv;

  // --- Ashima simplex noise ---
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // fractional Brownian motion — layered noise for volumetric softness
  float fbm(vec2 p){
    float total = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++){
      total += amp * snoise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return total;
  }

  void main(){
    // Aspect-correct UV, centered
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = (uv - 0.5);
    p.x *= aspect;

    // Gentle parallax: clouds drift toward the cursor (eased on CPU)
    vec2 par = u_pointer * 0.055;

    // Slightly slower base drift for a calmer, more luxe cadence
    float t = u_time * 0.017;

    // Domain-warped fbm for organic cloud structure
    vec2 q = vec2(
      fbm(p * 1.25 + par + vec2(0.0, t)),
      fbm(p * 1.25 + par + vec2(5.2, 1.3 - t))
    );
    vec2 r = vec2(
      fbm(p * 1.25 + 1.55 * q + vec2(1.7, 9.2) + t * 0.8),
      fbm(p * 1.25 + 1.55 * q + vec2(8.3, 2.8) - t * 0.6)
    );
    float clouds = fbm(p * 1.25 + 1.7 * r);
    clouds = clouds * 0.5 + 0.5; // 0..1

    // Vertical clear-sky gradient (luminous crown, soft horizon).
    float v = uv.y;
    vec3 grad = mix(u_deep, u_high, smoothstep(0.0, 0.55, v));
    grad = mix(grad, u_mid, smoothstep(0.4, 0.92, v));

    // Soft sun/dawn bloom low-left — the warm "first light" that defines their
    // clear-sky brand. Two-radius falloff: a tight warm core + a wide glow.
    vec2 sun = vec2(0.16, 0.14);
    float sunDist = distance(uv * vec2(aspect, 1.0), sun * vec2(aspect, 1.0));
    float sunCore = smoothstep(0.32, 0.0, sunDist);
    float sunGlow = smoothstep(0.7, 0.05, sunDist);
    float palShift = 0.5 + 0.5 * sin(u_time * 0.045);
    grad = mix(grad, u_dawn, sunGlow * (0.40 + 0.16 * palShift));
    grad = mix(grad, mix(u_dawn, vec3(1.0), 0.5), sunCore * 0.55);

    // Faint warm rose blush upper-right for atmospheric depth
    float blush = smoothstep(0.62, 0.0, distance(uv, vec2(0.86, 0.9)));
    grad = mix(grad, u_blush, blush * 0.2);

    // Layer soft volumetric clouds — luminous, low-contrast; warmed near the sun
    float cloudBand = smoothstep(0.44, 0.96, clouds);
    vec3 cloudColor = mix(u_high, vec3(1.0), 0.68);
    cloudColor = mix(cloudColor, mix(cloudColor, u_dawn, 0.6), sunGlow * 0.5);
    vec3 col = mix(grad, cloudColor, cloudBand * 0.5);

    // A second, higher wisp layer for depth
    float wisp = smoothstep(0.6, 1.0, fbm(p * 2.35 + par * 1.4 + vec2(t * 1.35, -t)));
    col = mix(col, vec3(1.0), wisp * 0.11);

    // "Breath": gentle global luminance pulse — the living, serene signature
    float breath = 0.975 + 0.025 * sin(u_time * 0.11);
    col *= breath;

    // Subtle vignette to seat the headline
    float vig = smoothstep(1.25, 0.35, length(p));
    col *= mix(0.88, 1.0, vig);

    // Very light atmospheric grain to kill banding on the smooth gradient
    float grain = fract(sin(dot(uv * u_resolution, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.012;

    // Master fade-in
    col = mix(u_deep * 0.62, col, clamp(u_intensity, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);
  }
`;
