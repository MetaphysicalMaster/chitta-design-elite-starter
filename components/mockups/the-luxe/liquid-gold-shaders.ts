/**
 * liquid-gold-shaders — vertex displacement for the "Liquid Gold" membrane.
 *
 * A high-poly icosphere is displaced by layered 3D simplex noise so the
 * surface ripples and breathes like a pool of molten metal. A cursor impulse
 * (uPointer in object space + uPointerStr) pushes a soft swell toward the
 * pointer so the gold reacts when chased. The fragment side is handled by a
 * physically-based metallic material (env-mapped) in the scene — these chunks
 * are injected into MeshStandardMaterial via onBeforeCompile, so we only
 * provide the displacement math and the varyings it needs.
 *
 * Returned strings are GLSL chunks (not full programs); see LiquidGoldScene.
 */

/* Classic Ashima 3D simplex noise (public domain) — compact, GPU-friendly. */
export const simplexNoise3D = /* glsl */ `
vec4 luxe_permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 luxe_taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float luxeSnoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = luxe_permute(luxe_permute(luxe_permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = luxe_taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

/* Layered fbm for richer, molten-looking flow. */
float luxeFbm(vec3 p){
  float f = 0.0;
  f += 0.55 * luxeSnoise(p);
  f += 0.30 * luxeSnoise(p * 2.03 + 11.7);
  f += 0.15 * luxeSnoise(p * 4.11 + 3.1);
  return f;
}
`;

/* Uniforms + varyings + the shared displacement helper. Declared at the top
   of the vertex shader so BOTH the normal chunk and the position chunk can
   call luxeDisplace() — that's what makes lighting actually follow the
   ripples (recomputed perturbed normal), not just the silhouette. */
export const vertexHead = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uPointerStr;
uniform vec3  uPointer;     // object-space target on the unit sphere
varying float vDisp;        // displacement amount → fragment tint
varying vec3  vObjNormal;   // object normal → fresnel rim

float luxeDisplace(vec3 p){
  float t = uTime * 0.28;
  float n = luxeFbm(normalize(p) * 1.65 + vec3(0.0, 0.0, t));
  float swell = luxeSnoise(normalize(p) * 0.9 - vec3(t * 0.6));
  float pd = distance(normalize(p), normalize(uPointer));
  float impulse = exp(-pd * pd * 3.4) * uPointerStr;
  return (n * 0.62 + swell * 0.30) * uAmp + impulse * 0.42;
}
`;

/* Injected into <beginnormal_vertex>: rebuild objectNormal from a cheap
   finite-difference of the displacement field along two tangents, so the PBR
   lighting + env reflections ripple with the molten surface. Runs BEFORE the
   normal is transformed to view space. */
export const normalBody = /* glsl */ `
  float luxeE = 0.12;
  vec3 luxeT1 = normalize(cross(objectNormal, vec3(0.0, 1.0, 0.0) + 1e-4));
  vec3 luxeT2 = normalize(cross(objectNormal, luxeT1));
  float d0 = luxeDisplace(position);
  float dA = luxeDisplace(position + luxeT1 * luxeE);
  float dB = luxeDisplace(position + luxeT2 * luxeE);
  vec3 luxePert = normalize(
    objectNormal - luxeT1 * (dA - d0) / luxeE - luxeT2 * (dB - d0) / luxeE
  );
  objectNormal = normalize(mix(objectNormal, luxePert, 0.85));
  vObjNormal = objectNormal;
`;

/* Injected into <begin_vertex>: push the position out along the normal by the
   displacement amount, and pass the amount to the fragment for the gold ramp. */
export const positionBody = /* glsl */ `
  float luxeDisp = luxeDisplace(position);
  vDisp = luxeDisp;
  transformed += normal * luxeDisp;
`;

/* Fragment head — varyings + a champagne/bronze gold ramp uniform set. */
export const fragmentHead = /* glsl */ `
uniform vec3 uGoldDeep;
uniform vec3 uGoldMid;
uniform vec3 uGoldBright;
varying float vDisp;
varying vec3  vObjNormal;
`;

/* Injected near the end of the fragment shader to tint the PBR result with a
   displacement-driven molten ramp + a fresnel champagne rim, so peaks read
   brighter (catching light) and valleys deepen to bronze. */
export const fragmentBody = /* glsl */ `
  float ramp = smoothstep(-0.35, 0.45, vDisp);
  vec3 molten = mix(uGoldDeep, uGoldMid, ramp);
  molten = mix(molten, uGoldBright, smoothstep(0.25, 0.6, vDisp));

  // fresnel rim toward champagne for that liquid-metal edge glow
  vec3 V = normalize(vViewPosition);
  float fres = pow(1.0 - clamp(dot(normalize(vObjNormal), V), 0.0, 1.0), 2.4);
  molten = mix(molten, uGoldBright, fres * 0.55);

  // blend the molten tint over the env-mapped PBR color (keep reflections)
  gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * molten * 1.18, 0.62);
  gl_FragColor.rgb += uGoldBright * fres * 0.12; // subtle additive rim
`;
