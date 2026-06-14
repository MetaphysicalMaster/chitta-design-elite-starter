"use client";

/**
 * PetalScene — the WebGL power element ("Hanami — petals on the breeze").
 *
 * A drifting cherry-blossom petal field: thousands of soft sakura petals
 * catching a gentle breeze. Built as a SINGLE instanced petal mesh (one draw
 * call) with a light custom vertex/fragment shader so each petal:
 *   · is a REAL sakura silhouette — a soft rounded OVAL with the signature
 *     NOTCH/cleft cut into its outer tip (carved in the fragment mask), on a
 *     gently CUPPED 3D surface (a spoon/boat curl, tessellated 6×6) so it tumbles
 *     as a 3D petal, not a flat 2D sliver,
 *   · drifts down-and-across on a wind field (sin/cos noise + per-petal phase),
 *     with a BIMODAL fall-speed spread (lazy drifters + a few quick tumblers),
 *   · FLUTTERS realistically — three independent slow pitch/yaw/roll waves at
 *     incommensurate rates over a slow base tumble, so it rocks broadside↔edge-on
 *     instead of spinning flat; the rotated surface normal drives a catch-the-
 *     light flash (brighter + more opaque broadside, translucent edge-on),
 *   · sits on one of several DEPTH LAYERS (near/mid/far) with depth-scaled
 *     size variation, parallax speed, opacity and a soft-focus blur fade for the
 *     far layer (bokeh), so the field reads with real depth, not a flat wall,
 *   · colours translucent SOFT PINK — a near-white pale rim → sakura body → a
 *     deeper rose only at the cupped base (the logo's blossom pink, never the
 *     coral-red that read as reddish blades before).
 *
 * Density/flow EASE as you scroll: a `flow` uniform (driven from the hero's
 * scroll progress) gently reduces drift speed and fades the densest near layer,
 * so the storm settles into stillness as the reader descends — mono no aware.
 *
 * WIND THROUGH THE BLOSSOMS (signature): the visitor's SCROLL VELOCITY is the
 * breeze. Lenis publishes its signed velocity to the shared `windBus`
 * (SmoothScroll.tsx); each frame the field eases it into
 *   · `uGust`  — 0..1 gust strength: widens the sway, deepens the flutter
 *                billow, and ACCELERATES the field's own clock (we accumulate a
 *                time-warped `windTime` on the CPU so the speed-up is perfectly
 *                continuous — no teleporting petals),
 *   · `uSweep` — a signed impulse that lifts and shears the whole field with
 *                the scroll direction (near petals travel furthest — parallax
 *                preserved under wind).
 * Attack is fast, release is slow, and the raw velocity decays every frame —
 * a gust always dies back to the gentle fall once the reader pauses.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from PetalHero (a client component) —
 * WebGL/R3F is not SSR-safe. A static CSS layered-petal field covers SSR,
 * mobile, reduced-motion and no-WebGL (see PetalHero + brand.css sakura-fallback).
 *
 * Perf: dpr={[1,2]}, frameloop pauses when the hero is offscreen or the tab is
 * hidden. `lite` tier drops the petal count + the far-layer bokeh blur.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { windBus } from "./wind";

/* The realism comes from a REAL photographed sakura-petal TEXTURE (a transparent
   PNG cutout at /clients/hanami/petal.png — white base → rose-pink notched edge,
   fine natural veins) mapped onto each instanced petal quad. The shader no longer
   FAKES the petal shape/colour procedurally (that read as flat shaded blobs);
   it samples the photo for colour + alpha and only adds the catch-the-light
   facing beat from the cupped geometry's normal. */
const PETALS_ATLAS = "/clients/hanami/petals-atlas.png";
const ATLAS_CELLS = 3; // three real petal variants packed left→right (soft pink / deep rose / pale blush)

const COUNT_FULL = 2400;
const COUNT_LITE = 1100;

/* A single CHERRY-BLOSSOM petal — a real, cupped 3D surface (not a flat plane),
   built once and instanced. We tessellate a small grid so each petal can be
   gently CUPPED along both axes (a saddle-ish curl, like a real petal caught on
   the breeze) — this is what makes the tumble read as 3D fluttering instead of a
   2D spinning sliver: as it rotates, the curved surface catches and loses the
   light, flashing edge-on then broad. The petal SILHOUETTE (rounded oval + the
   signature sakura notch) is still carved in the fragment shader, crisp at any
   DPR. The plane is aspect ~1 : 1.18 — a soft rounded oval, NOT a thin blade. */
function makePetalGeometry() {
  const SEG = 6;
  // Square plane to match the square petal TEXTURE (undistorted UV mapping). The
  // real petal photo carries the silhouette + veins + colour; this geometry only
  // supplies the gentle 3D CUP (and its normals) so the textured petal catches
  // light and tumbles dimensionally instead of reading as a flat decal.
  const g = new THREE.PlaneGeometry(1, 1, SEG, SEG);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i); // -0.5 .. 0.5
    const y = pos.getY(i); // -0.5 .. 0.5
    // Normalize y to 0 (base) .. 1 (tip) for a length-wise curl.
    const v = y + 0.5;
    // Cup ACROSS the width: the long edges lift toward the viewer (a trough),
    // strongest near the wide upper body, easing to flat at the narrow base.
    const widthCurl = (x * x) * 0.62 * (0.35 + v * 0.65);
    // Cup ALONG the length: a gentle forward bow so the tip and base dip,
    // giving the petal a shallow boat/spoon shape (real petals are not flat).
    const lengthCurl = Math.sin(v * Math.PI) * 0.12;
    pos.setZ(i, widthCurl - lengthCurl);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

/* ---------------- Shaders ---------------- */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uFlow;     // 1 = full storm, eases toward calm as you scroll
  uniform vec2  uPointer;  // -1..1, gentle breeze deflection
  uniform float uPointerStr;
  uniform float uGust;     // 0..1 scroll-wind strength (fast scroll = gust)
  uniform float uSweep;    // signed scroll-wind impulse (direction of travel)

  attribute vec3 aOffset;   // base position in the field
  attribute vec3 aAxis;     // tumble axis (normalized)
  attribute float aPhase;   // per-petal time offset
  attribute float aSpeed;   // per-petal fall speed
  attribute float aScale;   // per-petal size
  attribute float aDepth;   // 0 = far, 1 = near (depth layer)
  attribute float aColorMix;// 0..1 along the sakura ramp
  attribute float aFlutter; // 0..1 per-petal flutter amplitude/character
  attribute float aTexIndex;// which of the 3 atlas petal variants this instance uses

  varying vec2  vUv;
  varying float vDepth;
  varying float vColorMix;
  varying float vFade;
  varying float vFacing;    // |n·view| — how broadside the petal faces us (light)
  varying float vTexIndex;  // -> fragment: select the atlas cell

  // cheap rotation matrix about an arbitrary axis
  mat3 rotAxis(vec3 a, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat3(
      oc*a.x*a.x + c,      oc*a.x*a.y - a.z*s, oc*a.z*a.x + a.y*s,
      oc*a.x*a.y + a.z*s,  oc*a.y*a.y + c,     oc*a.y*a.z - a.x*s,
      oc*a.z*a.x - a.y*s,  oc*a.y*a.z + a.x*s, oc*a.z*a.z + c
    );
  }

  // Euler rotation (pitch X, yaw Y, roll Z) — composed for a true 3D tumble.
  mat3 rotXYZ(vec3 e) {
    float cx = cos(e.x), sx = sin(e.x);
    float cy = cos(e.y), sy = sin(e.y);
    float cz = cos(e.z), sz = sin(e.z);
    mat3 rx = mat3(1.0,0.0,0.0, 0.0,cx,-sx, 0.0,sx,cx);
    mat3 ry = mat3(cy,0.0,sy, 0.0,1.0,0.0, -sy,0.0,cy);
    mat3 rz = mat3(cz,-sz,0.0, sz,cz,0.0, 0.0,0.0,1.0);
    return rz * ry * rx;
  }

  void main() {
    vUv = uv;
    vDepth = aDepth;
    vColorMix = aColorMix;
    vTexIndex = aTexIndex;

    // --- wind field: down-and-across drift, eased by uFlow ---
    float t = uTime * (0.35 + aSpeed * 0.55) * mix(0.45, 1.0, uFlow) + aPhase * 6.2831;

    // parallax: near petals fall faster + travel further across
    float par = mix(0.55, 1.4, aDepth);

    // vertical fall wraps within the field height (~ 16 units), so it loops.
    float fallH = 16.0;
    float fall = mod(aOffset.y - t * aSpeed * par, fallH) - fallH * 0.5;

    // lateral sway — a breeze that gusts; near petals sway wider, and the
    // scroll-gust widens everyone's arc (the wind leaning into the field).
    float sway = (sin(t * 0.6 + aPhase * 10.0) * (0.6 * par)
               + cos(t * 0.27 + aOffset.x) * 0.35 * par)
               * (1.0 + uGust * 1.4);

    // pointer breeze — a soft, eased push in the cursor direction.
    vec2 breeze = uPointer * uPointerStr * (0.9 * par);

    vec3 pos = aOffset;
    pos.y = fall;
    pos.x += sway + breeze.x;
    pos.y += breeze.y * 0.5;
    pos.z += sin(t * 0.4 + aPhase * 4.0) * 0.4 * par; // depth wobble

    // scroll-wind sweep — the visitor's own motion is the wind. Scrolling down
    // lifts the field past the eye and shears it across (a diagonal gust);
    // scrolling up reverses it. Near petals travel furthest, so the parallax
    // depth holds even mid-gust. Per-petal phase keeps the sweep organic.
    float swayBias = 0.85 + 0.3 * sin(aPhase * 12.566);
    pos.y += uSweep * (1.5 * par) * swayBias;
    pos.x -= uSweep * (0.7 * par) * swayBias;

    // --- FLUTTER: a real cherry-blossom tumble, NOT a 2D sliver spin ---
    // A falling sakura petal does not spin flat on one axis — it flutters: it
    // PITCHES (rocks forward/back over its width), ROLLS (rocks side to side),
    // and YAWS (turns to face you, then away) on three INDEPENDENT slow waves at
    // incommensurate rates, with a slow continuous base tumble underneath. The
    // gust deepens the rocking. This is what makes it read as a 3D petal on air.
    float fl = 0.6 + aFlutter * 0.9;                 // per-petal flutter character
    float gustFl = 1.0 + uGust * 1.1;                // wind deepens the rocking
    // base slow tumble about the petal's own axis — keeps motion non-repeating
    float baseSpin = t * (0.28 + aSpeed * 0.42) + aPhase * 9.0;
    vec3 euler = vec3(
      // pitch: the dominant rocking, broadside ↔ edge-on (the "flutter")
      sin(t * (0.9 * fl) + aPhase * 6.0) * (1.15 * gustFl),
      // yaw: turns the face toward / away from the eye
      baseSpin + sin(t * (0.55 * fl) + aPhase * 3.7) * 0.7,
      // roll: gentle side-to-side rock
      sin(t * (0.7 * fl) + aPhase * 11.0) * (0.85 * gustFl)
    );
    mat3 rot = rotXYZ(euler);

    // petal billows: a faint membrane flex as it rocks; a gust deepens it.
    vec3 local = position;
    local.x *= 1.0 + (0.08 + 0.08 * uGust) * sin(t * 1.3 + aPhase * 7.0);

    vec3 vtx = rot * (local * aScale * mix(0.62, 1.22, aDepth));
    vec3 world = pos + vtx;

    // Light-catching: how broadside the petal faces the camera (+z view dir).
    // The cupped, tessellated surface gives a real normal; we read its facing so
    // the fragment can flash the petal brighter when it turns flat to the eye and
    // dim it toward translucency when it tips edge-on — that catch-the-light beat.
    vec3 n = normalize(rot * normalize(normal));
    vFacing = abs(n.z);

    // soft-focus fade for the far layer (bokeh) + edge fade near field bounds.
    float edge = smoothstep(8.0, 5.5, abs(fall));
    vFade = edge * mix(0.5, 1.0, aDepth);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uPetalTex; // 3-petal ATLAS (real photographed sakura cutouts)
  uniform float uFlow;
  uniform bool  uBokeh;

  varying vec2  vUv;
  varying float vDepth;
  varying float vFade;
  varying float vFacing;       // |n·view| — broadside (1) vs edge-on (0)
  varying float vTexIndex;     // 0..2 — which atlas petal this instance carries

  void main() {
    // ── COLOUR + SILHOUETTE come straight from the photographed petal ──
    // Three real petal variants are packed left→right in one atlas; pick this
    // instance's cell and inset the UV so linear filtering never bleeds across
    // the cell seam. The photo carries the shape + white→rose gradient + veins.
    float cell = floor(vTexIndex + 0.5);
    vec2 auv = vec2((clamp(vUv.x, 0.04, 0.96) + cell) / 3.0, clamp(vUv.y, 0.02, 0.98));
    vec4 tex = texture2D(uPetalTex, auv);
    if (tex.a < 0.04) discard;

    vec3 col = tex.rgb;

    // Catch-the-light from the cupped geometry's rotated normal: the petal reads
    // a touch brighter when it turns broadside to the eye and dims slightly as it
    // tips edge-on — the dimensional shimmer that sells a real petal on the wind.
    col *= mix(0.80, 1.14, vFacing);
    // a faint broadside sheen so a flat-facing petal glints over the sumi-black.
    col += vec3(0.05, 0.035, 0.04) * smoothstep(0.74, 1.0, vFacing);

    // ── ALPHA: the photo's own cutout, modulated by depth + facing + fade ──
    float alpha = tex.a * vFade * mix(0.86, 1.0, vDepth);

    // edge-on petals go MORE translucent (light through a thin membrane);
    // broadside petals stay more opaque — realistic flutter translucency.
    alpha *= mix(0.62, 1.0, smoothstep(0.06, 0.85, vFacing));

    // far-layer soft focus (bokeh): soften far-petal alpha for depth.
    if (uBokeh) {
      alpha *= mix(0.78, 1.0, vDepth);
    }

    gl_FragColor = vec4(col, alpha);
  }
`;

function PetalField({
  pointer,
  flowRef,
  lite,
}: {
  pointer: React.RefObject<{ x: number; y: number; active: number }>;
  flowRef: React.RefObject<number>;
  lite: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const smoothPtr = useRef({ x: 0, y: 0, s: 0 });
  const flowSmooth = useRef(1);
  // Scroll-wind state: a time-warped clock (gusts accelerate the whole field
  // continuously — never a jump), the eased gust strength, the signed sweep.
  const windTime = useRef(0);
  const gust = useRef(0);
  const sweep = useRef(0);

  const count = lite ? COUNT_LITE : COUNT_FULL;

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.InstancedBufferGeometry();
    const petal = makePetalGeometry();
    geo.index = petal.index;
    geo.attributes.position = petal.attributes.position;
    geo.attributes.uv = petal.attributes.uv;
    // the cupped petal's per-vertex normals — the shader reads these (rotated)
    // to flash the petal as it turns broadside / edge-on (catch-the-light).
    geo.attributes.normal = petal.attributes.normal;

    const offsets = new Float32Array(count * 3);
    const axes = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const scales = new Float32Array(count);
    const depths = new Float32Array(count);
    const colorMix = new Float32Array(count);
    const flutter = new Float32Array(count);
    const texIndex = new Float32Array(count);

    // deterministic-ish scatter across a wide, tall field with depth layers.
    let seed = 1337;
    const rand = () => {
      // mulberry32
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      // depth layer: bias toward mid so near/far frame it.
      const dRand = rand();
      const depth = dRand < 0.34 ? rand() * 0.33 : dRand < 0.7 ? 0.33 + rand() * 0.34 : 0.67 + rand() * 0.33;
      depths[i] = depth;

      // field width scales with depth (near covers more screen).
      const w = 9 + depth * 7;
      offsets[i * 3] = (rand() - 0.5) * w;
      offsets[i * 3 + 1] = (rand() - 0.5) * 16;
      offsets[i * 3 + 2] = -4 + depth * 7 + (rand() - 0.5) * 1.5;

      // random tumble axis
      const ax = rand() - 0.5;
      const ay = rand() - 0.5;
      const az = rand() - 0.5;
      const len = Math.hypot(ax, ay, az) || 1;
      axes[i * 3] = ax / len;
      axes[i * 3 + 1] = ay / len;
      axes[i * 3 + 2] = az / len;

      phases[i] = rand();
      // Fall speed: a BIMODAL spread so the field has both lazy drifters and a
      // few quicker tumblers (real blossom fall is never uniform). ~70% drift
      // slowly, ~30% fall noticeably faster.
      const sR = rand();
      speeds[i] = sR < 0.7 ? 0.32 + rand() * 0.4 : 0.9 + rand() * 0.7;
      // Size: wider variation (small distant petals → a few large near ones),
      // biased small via a squared random so big petals stay a tasteful minority.
      scales[i] = 0.14 + Math.pow(rand(), 1.7) * 0.34;
      // Per-petal flutter character — how vigorously this petal rocks/tumbles.
      flutter[i] = rand();
      // Color ramp bias: cube the random so most petals land PALE→SAKURA and the
      // deep/rose heart is reserved for a small minority. Over the sumi-black
      // hero this keeps the field reading as true soft cherry-blossom pink.
      colorMix[i] = Math.pow(rand(), 3);
      // which of the 3 real petal variants this instance wears (even split).
      texIndex[i] = Math.floor(rand() * ATLAS_CELLS);
    }

    geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute("aAxis", new THREE.InstancedBufferAttribute(axes, 3));
    geo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new THREE.InstancedBufferAttribute(speeds, 1));
    geo.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute("aDepth", new THREE.InstancedBufferAttribute(depths, 1));
    geo.setAttribute("aColorMix", new THREE.InstancedBufferAttribute(colorMix, 1));
    geo.setAttribute("aFlutter", new THREE.InstancedBufferAttribute(flutter, 1));
    geo.setAttribute("aTexIndex", new THREE.InstancedBufferAttribute(texIndex, 1));
    geo.instanceCount = count;

    // Load the real photographed sakura-petal cutout as the petal texture.
    // (Path is root-absolute for dev; the Pages build rewrites /clients/ to the
    // per-repo basePath, so it resolves on the static export too.)
    const tex = new THREE.TextureLoader().load(PETALS_ATLAS);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    // No mipmaps + clamp: a packed atlas bleeds across cell seams under mip
    // minification; the fragment UV-insets per cell and we filter linear only.
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    const u = {
      uTime: { value: 0 },
      uFlow: { value: 1 },
      uGust: { value: 0 },
      uSweep: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStr: { value: 0 },
      uPetalTex: { value: tex },
      uBokeh: { value: !lite },
    };

    return { geometry: geo, uniforms: u };
  }, [count, lite]);

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const dt = Math.min(delta, 1 / 30);

    // --- WIND THROUGH THE BLOSSOMS: scroll velocity → gust + sweep ---
    const v = windBus.velocity; // signed Lenis velocity (down = positive)
    const gustTarget = Math.min(1, Math.abs(v) / 55);
    // attack fast (the gust HITS), release slow (it dies down like real wind)
    const gk = gustTarget > gust.current ? Math.min(1, dt * 7) : Math.min(1, dt * 1.15);
    gust.current += (gustTarget - gust.current) * gk;
    // signed sweep — the direction of the visitor's travel becomes the wind's
    const sweepTarget = Math.max(-1, Math.min(1, v / 70));
    sweep.current += (sweepTarget - sweep.current) * Math.min(1, dt * 4.5);
    // a gust accelerates the field's own clock — faster fall, faster tumble —
    // accumulated on the CPU so the speed change is perfectly continuous.
    windTime.current += dt * (1 + gust.current * 2.4);
    // raw velocity decays toward stillness once scroll events stop arriving
    windBus.velocity *= Math.exp(-dt * 3.2);
    windBus.gust = gust.current;

    m.uniforms.uTime.value = windTime.current;
    m.uniforms.uGust.value = gust.current;
    m.uniforms.uSweep.value = sweep.current;

    // ease the pointer breeze (frame-rate independent)
    const target = pointer.current ?? { x: 0, y: 0, active: 0 };
    const k = 1 - Math.pow(0.0022, dt);
    smoothPtr.current.x += (target.x - smoothPtr.current.x) * k;
    smoothPtr.current.y += (target.y - smoothPtr.current.y) * k;
    smoothPtr.current.s += (target.active - smoothPtr.current.s) * Math.min(1, dt * 2.5);
    m.uniforms.uPointer.value.set(smoothPtr.current.x, smoothPtr.current.y);
    m.uniforms.uPointerStr.value = smoothPtr.current.s;

    // ease density/flow toward the scroll-driven target (storm → stillness)
    const flowTarget = flowRef.current ?? 1;
    flowSmooth.current += (flowTarget - flowSmooth.current) * Math.min(1, dt * 1.6);
    m.uniforms.uFlow.value = flowSmooth.current;
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest
        side={THREE.DoubleSide}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

/* A barely-there group sway so the whole field breathes on the breeze; the
   scroll-gust leans the whole field a few degrees, like trees in wind. */
function BreezeRig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const lean = useRef(0);
  useFrame(({ clock }, delta) => {
    const grp = g.current;
    if (!grp) return;
    const t = clock.getElapsedTime();
    const dt = Math.min(delta, 1 / 30);
    lean.current += (windBus.gust - lean.current) * Math.min(1, dt * 2.5);
    grp.rotation.z = Math.sin(t * 0.08) * 0.03 - lean.current * 0.055;
    grp.position.x = Math.sin(t * 0.05) * 0.3;
  });
  return <group ref={g}>{children}</group>;
}

/* Keep the far-layer DPR in check on high-density displays. */
function DprGuard({ lite }: { lite: boolean }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.5 : 2));
  }, [gl, lite]);
  return null;
}

export interface PetalSceneProps {
  /** Lower petal count + drop far-layer bokeh on smaller / high-DPI tiers. */
  lite?: boolean;
  /** Scroll-driven flow (1 = full storm, → calm). Shared ref from the hero. */
  flowRef: React.RefObject<number>;
}

export default function PetalScene({ lite = false, flowRef }: PetalSceneProps) {
  const pointer = useRef({ x: 0, y: 0, active: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause the render loop when the hero scrolls offscreen or the tab is hidden.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "140px" },
    );
    io.observe(el);
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const handlePointer = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    pointer.current.active = 1;
  };

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        pointer.current.active = 0;
      }}
    >
      <Canvas
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 9], fov: 46 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <DprGuard lite={lite} />
        <BreezeRig>
          <PetalField pointer={pointer} flowRef={flowRef} lite={lite} />
        </BreezeRig>
      </Canvas>
    </div>
  );
}
