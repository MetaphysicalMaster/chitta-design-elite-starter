/**
 * GLSL shaders for FluidColorMix effect.
 * Embedded as TS strings for tree-shaking + type checking.
 */

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform float u_time;
  uniform float u_progress;
  uniform vec3 u_colors[5];
  uniform float u_color_count;
  uniform float u_noise_scale;
  uniform float u_flow_speed;

  varying vec2 vUv;

  // Simplex noise (Ashima)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Get color from u_colors array via integer index
  vec3 getColorAt(int idx) {
    if (idx <= 0) return u_colors[0];
    if (idx == 1) return u_colors[1];
    if (idx == 2) return u_colors[2];
    if (idx == 3) return u_colors[3];
    return u_colors[4];
  }

  void main() {
    // Multi-layered simplex noise creates fluid/smoke distortion
    float noise1 = snoise(vUv * u_noise_scale + u_time * u_flow_speed);
    float noise2 = snoise(vUv * (u_noise_scale * 2.0) - u_time * (u_flow_speed * 1.5)) * 0.5;
    float noise3 = snoise(vUv * (u_noise_scale * 4.0) + u_time * (u_flow_speed * 0.7)) * 0.25;
    float displacement = (noise1 + noise2 + noise3) * 0.4;

    // u_progress drives the stage (0 = first color, 1 = last color)
    // displacement adds organic wisp to the boundary
    float scaled = clamp(u_progress * (u_color_count - 1.0) + displacement, 0.0, u_color_count - 1.001);
    int idx_a = int(floor(scaled));
    int idx_b = idx_a + 1;
    float t = fract(scaled);

    // Smooth easing on local mix factor for less linear feel
    t = smoothstep(0.0, 1.0, t);

    vec3 color = mix(getColorAt(idx_a), getColorAt(idx_b), t);

    gl_FragColor = vec4(color, 1.0);
  }
`;
