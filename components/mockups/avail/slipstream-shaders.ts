/**
 * Slipstream shaders — the cobalt speed-line backdrop behind the instanced
 * light-trails. An orthographic full-bleed plane renders a graphite void with
 * diagonal, scroll-velocity-reactive cobalt streaks that drift toward the
 * cursor. Keeps the WebGL frame premium even before the instanced trails ramp.
 */

export const slipstreamVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const slipstreamFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;     // -1..1
  uniform float u_speed;       // scroll-velocity drive 0..1
  uniform float u_intensity;   // mount fade-in 0..1
  uniform vec3  u_graphite0;
  uniform vec3  u_graphite1;
  uniform vec3  u_streakCore;
  uniform vec3  u_streakCool;

  // Cheap hash + value noise
  float hash(float n){ return fract(sin(n) * 43758.5453123); }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    float n = i.x + i.y*57.0;
    return mix(mix(hash(n), hash(n+1.0), f.x),
               mix(hash(n+57.0), hash(n+58.0), f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);

    // Graphite base — diagonal gradient with a soft cursor-led brightening.
    vec2 pc = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 ptr = u_pointer * 0.5 * vec2(aspect, 1.0);
    float toCursor = 1.0 - smoothstep(0.0, 1.1, length(pc - ptr));
    vec3 base = mix(u_graphite0, u_graphite1, uv.x * 0.7 + uv.y * 0.3);
    base += u_streakCool * 0.10 * toCursor;

    // Slipstream coordinate: rotate uv ~24deg so streaks rake diagonally,
    // then scroll along that axis. Speed scales travel + sharpness.
    float a = -0.42;
    vec2 r = vec2(uv.x * cos(a) - uv.y * sin(a),
                  uv.x * sin(a) + uv.y * cos(a));
    float travel = u_time * (0.25 + u_speed * 1.9);
    // cursor nudges the streak lanes laterally (drift to cursor)
    float lane = r.y * 26.0 + u_pointer.x * 0.9;
    float along = r.x * 3.0 + travel;

    // Lane mask — thin bright cores with soft falloff, modulated by noise so
    // lanes feel organic (some hot, some faint).
    float laneId = floor(lane);
    float laneF = fract(lane);
    float core = smoothstep(0.5, 0.0, abs(laneF - 0.5)); // 1 at lane center
    core = pow(core, 5.0);
    float life = noise(vec2(laneId * 0.37, floor(along * 0.5)));
    float trail = fract(along * 0.5 + life);
    // comet head: bright leading edge fading back
    float comet = pow(1.0 - trail, 3.0) * (0.4 + life * 0.6);

    float streak = core * comet;
    // base velocity ambient streaks even at rest
    streak *= (0.35 + u_speed * 1.4);
    streak *= u_intensity;

    // Color the streak from cool edge to hot core toward the cursor.
    vec3 streakCol = mix(u_streakCool, u_streakCore, core * (0.5 + 0.5 * toCursor));
    vec3 col = base + streakCol * streak * 1.6;

    // faint grain to avoid banding on the gradient
    col += (noise(uv * u_resolution.xy * 0.5 + u_time) - 0.5) * 0.012;

    // subtle vignette to seat copy
    float vig = smoothstep(1.35, 0.25, length((uv - 0.5) * vec2(aspect, 1.0)));
    col *= mix(0.72, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;
