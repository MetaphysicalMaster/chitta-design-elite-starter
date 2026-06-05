/**
 * ribbon-shaders — GLSL chunks for the "eternity ribbon" chrome material.
 *
 * The ribbon geometry is a tube swept along a lemniscate (figure-eight /
 * infinity) curve, given a Möbius-style half-twist so the strand reads as a
 * single endless surface with no beginning and no end. The surface is a
 * physically-based, near-mirror metal (env-mapped) — these chunks are injected
 * into MeshPhysicalMaterial via onBeforeCompile, so we only add:
 *   · a flowing chrome-sheen band that travels ALONG the ribbon (uFlow), so the
 *     highlight endlessly chases the loop — the "results that last" motion;
 *   · a cool fresnel rim that tints the grazing edge toward amethyst, so the
 *     silhouette glints jewel-cool against the midnight ground.
 *
 * `vU` (0..1 along the ribbon length) and `vObjNormal` are passed from the
 * vertex side; the tube's own UVs give us the along-length coordinate.
 */

/* Vertex head — declare the varyings + capture object normal & along-length U. */
export const vertexHead = /* glsl */ `
varying vec2  vEtUv;
varying vec3  vEtObjNormal;
`;

/* Injected into <begin_vertex>: capture the along-ribbon coordinate + normal. */
export const vertexBody = /* glsl */ `
  vEtUv = uv;
  vEtObjNormal = normalize(normal);
`;

/* Fragment head — uniforms + varyings for the chrome sheen + amethyst rim. */
export const fragmentHead = /* glsl */ `
uniform float uTime;
uniform float uFlow;        // 0..1 scroll-ease: 1 = full flow, low = near-still
uniform vec3  uCrest;       // mirror highlight silver
uniform vec3  uAmethyst;    // cool jewel rim glint
uniform vec3  uShadow;      // plum shadow trough
varying vec2  vEtUv;
varying vec3  vEtObjNormal;
`;

/* Injected near the end of the fragment shader: tint the env-mapped PBR result
   with (a) a travelling chrome-sheen band along the ribbon length and (b) a
   cool amethyst fresnel rim. Keeps real reflections, adds the endless glint. */
export const fragmentBody = /* glsl */ `
  // Along-ribbon coordinate (tube UV.x runs the length of the path).
  float along = vEtUv.x;

  // A soft sheen band travelling endlessly along the loop. Two offset bands so
  // the highlight feels continuous as it wraps the figure-eight.
  float t = uTime * (0.04 + 0.10 * uFlow);
  float band1 = pow(0.5 + 0.5 * sin((along - t) * 6.2831 * 3.0), 6.0);
  float band2 = pow(0.5 + 0.5 * sin((along - t * 0.6 + 0.33) * 6.2831 * 2.0), 8.0);
  float sheen = clamp(band1 * 0.7 + band2 * 0.5, 0.0, 1.0);

  // Cool fresnel rim → amethyst at grazing angles.
  vec3 V = normalize(vViewPosition);
  float fres = pow(1.0 - clamp(dot(normalize(vEtObjNormal), V), 0.0, 1.0), 2.6);

  // Compose: lift crests with the silver sheen, deepen troughs to plum, glint
  // the rim amethyst. Multiply-blend over the PBR env color to keep reflections.
  vec3 base = gl_FragColor.rgb;
  vec3 lifted = mix(base, base * 1.35 + uCrest * 0.5, sheen);
  lifted = mix(lifted, lifted * mix(uShadow, vec3(1.0), 0.65), (1.0 - sheen) * 0.18);
  lifted = mix(lifted, mix(lifted, uAmethyst, 0.7), fres * 0.55);
  lifted += uCrest * sheen * 0.12;        // subtle additive crest glow
  lifted += uAmethyst * fres * 0.1;       // subtle additive amethyst rim

  gl_FragColor.rgb = lifted;
`;
