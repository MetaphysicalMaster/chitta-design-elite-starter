/**
 * lattice-shaders.ts — GLSL for the "dermal cross-section" particle lattice.
 *
 * A single GPU particle system (one draw call, thousands of points) whose
 * vertices are driven entirely on the GPU. Each particle begins dispersed in a
 * soft cloud and RESOLVES into an ordered lattice arranged by dermal DEPTH
 * STRATA: stratum corneum (surface) → epidermis → dermis → hypodermis. Color
 * is a brand-tinted depth ramp (pale corneum → clinical navy depths) with one
 * lone OXBLOOD capillary thread. A cheap depth-of-field term softens and dims
 * particles away from the focal plane — medical, precise, NOT flashy.
 *
 * Motion lives in the shader to hold a 60fps budget. JS updates only a handful
 * of uniforms per frame (time, resolve progress, focus, eased pointer).
 */

export const latticeVertexShader = /* glsl */ `
  precision highp float;

  // Per-particle data
  attribute vec3 aLattice;   // ordered resolved position (the dermal lattice)
  attribute vec3 aCloud;     // dispersed source position (intro / no-resolve)
  attribute float aDepth;    // 0 (surface corneum) .. 1 (deep hypodermis)
  attribute float aVessel;   // 0..1 — membership in the oxblood capillary thread
  attribute float aSeed;     // 0..1 random per particle
  attribute float aScale;    // base point-size multiplier

  uniform float uTime;
  uniform float uResolve;    // 0 dispersed .. 1 fully resolved lattice
  uniform float uIntro;      // 0..1 reveal on mount
  uniform float uDpr;
  uniform float uSize;       // global point-size scale
  uniform float uFocus;      // focal depth plane (0..1) — DoF center
  uniform vec2  uPointer;    // -1..1 cursor in clip-ish space
  uniform float uPointerStr; // 0..1 strength (eased on enter/leave)

  varying float vDepth;      // dermal depth -> color ramp
  varying float vVessel;     // oxblood membership -> color
  varying float vSharp;      // 0 blurred .. 1 sharp (depth-of-field)
  varying float vGlow;       // cursor proximity glow

  // Cheap hash noise (organic micro-drift, no textures).
  vec3 hash3(vec3 p) {
    p = vec3(
      dot(p, vec3(127.1, 311.7, 74.7)),
      dot(p, vec3(269.5, 183.3, 246.1)),
      dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  void main() {
    // Resolve: ease the dispersed cloud into the ordered dermal lattice.
    float res = smoothstep(0.0, 1.0, uResolve);
    vec3 pos = mix(aCloud, aLattice, res);

    // Tissue settle — a faint, slow vertical breathing per stratum once
    // resolved ("living dermis"); micro-drift while dispersed.
    vec3 n = hash3(aLattice * 0.6 + aSeed * 17.0 + uTime * 0.05);
    float settle = mix(0.09, 0.014, res); // larger drift when dispersed
    pos += n * settle;
    // Strata flow: each band drifts laterally a touch, scaled by depth.
    pos.x += sin(uTime * 0.22 + aDepth * 6.2831 + aSeed * 6.2831)
             * 0.02 * res;

    // --- Cursor lens: gentle local lift toward the viewer (a dermatoscope) ---
    vec3 pointer3 = vec3(uPointer * 1.4, 0.0);
    vec3 toP = pos - pointer3;
    float d = length(toP.xy) + 0.0001;
    float influence = uPointerStr * smoothstep(1.1, 0.0, d);
    pos.z += influence * 0.32;
    pos.xy += (toP.xy / d) * influence * 0.05;

    // Intro reveal — particles ease in from a slightly farther dispersed cloud.
    pos = mix(aCloud * 1.25, pos, smoothstep(0.0, 1.0, uIntro));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Depth-of-field: sharpest at the focal stratum, softening away from it.
    // Particles also have a little z, so combine dermal depth + view z.
    // NARROWED falloff (0.12→0.20 .. 0.6→0.74) so a wider band of the lattice
    // stays sharp — the signature resolve must be SEEN, not dissolved to haze.
    float focusDist = abs(aDepth - uFocus);
    float sharp = 1.0 - smoothstep(0.20, 0.74, focusDist);
    sharp = mix(0.5, 1.0, sharp); // raised floor: even out-of-focus reads
    vSharp = sharp;

    // The lone capillary always stays in focus — the page's single chroma
    // thread should never blur into the brown ground.
    vSharp = max(vSharp, aVessel);

    // Point size: perspective attenuation + per-particle scale + dpr.
    // Blurred (out-of-focus) particles render LARGER + softer (bokeh).
    float bokeh = mix(1.7, 1.0, sharp);
    float size = uSize * aScale * (0.62 + 0.6 * aSeed) * bokeh;
    // The teal capillary is drawn a touch larger so the thread reads as a
    // continuous vessel, not a dotted line, against the dark dermis.
    size *= mix(1.0, 1.5, aVessel);
    gl_PointSize = size * uDpr * (300.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.0, 18.0 * uDpr);

    vDepth = aDepth;
    vVessel = aVessel;
    vGlow = influence;
  }
`;

export const latticeFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3  uCorneum;   // pale surface
  uniform vec3  uEpidermis;
  uniform vec3  uDermis;
  uniform vec3  uDeep;      // deep navy hypodermis
  uniform vec3  uVessel;    // oxblood capillary

  varying float vDepth;
  varying float vVessel;
  varying float vSharp;
  varying float vGlow;

  void main() {
    // Soft round sprite (no texture). Out-of-focus particles get a softer,
    // wider falloff edge — bokeh.
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float edge = mix(0.5, 0.34, vSharp); // blurred -> feather starts sooner
    float alpha = smoothstep(0.5, edge, r);
    if (alpha <= 0.001) discard;

    // Dermal depth ramp: corneum -> epidermis -> dermis -> deep navy.
    vec3 col = mix(uCorneum, uEpidermis, smoothstep(0.0, 0.34, vDepth));
    col = mix(col, uDermis, smoothstep(0.3, 0.66, vDepth));
    col = mix(col, uDeep, smoothstep(0.62, 1.0, vDepth));

    // The lone TEAL capillary thread — lifted to a brighter, more saturated
    // teal so the single chroma thread meanders visibly through the dermis
    // (the named brand signature), not a muddy dot lost in the brown ground.
    vec3 vesselCol = uVessel * 1.18;
    col = mix(col, vesselCol, vVessel);

    // Cursor lens warms a faint highlight (clinical, restrained).
    col = mix(col, mix(col, uCorneum, 0.6), vGlow * 0.5);

    // Sharp particles read crisper + a touch brighter; blurred ones dim — but
    // the luminance floor is raised so the lattice survives over the dark ground.
    float lum = mix(0.74, 1.06, vSharp);
    col *= lum;

    // Alpha: in-focus particles are more opaque; bokeh stays present (raised
    // floor 0.32→0.5, ceiling 0.92→0.98) so the resolved lattice actually reads
    // against the espresso hero instead of washing out to a smooth gradient.
    float a = alpha * mix(0.5, 0.98, vSharp);
    a = mix(a, alpha * 0.99, vVessel); // vessel near-opaque — the thread reads

    gl_FragColor = vec4(col, a);
  }
`;
