"use client";

/**
 * PetalScene — the WebGL power element ("Hanami — petals on the breeze").
 *
 * A drifting cherry-blossom petal field: thousands of soft sakura petals
 * catching a gentle breeze. Built as a SINGLE instanced petal mesh (one draw
 * call) with a light custom vertex/fragment shader so each petal:
 *   · drifts down-and-across on a wind field (sin/cos noise + per-petal phase),
 *   · flutters — pitches and rolls as if tumbling on air,
 *   · sits on one of several DEPTH LAYERS (near/mid/far) with depth-scaled
 *     size, parallax speed, opacity and a soft-focus blur fade for the far
 *     layer (bokeh), so the field reads with real depth, not a flat sprite wall,
 *   · colours along a sakura ramp (pale rim → sakura → deep → plum heart) with a
 *     soft length-wise gradient and a translucent edge for a petal silhouette.
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

/* TWO-TONE cherry-blossom palette as THREE colors — matched to the REAL logo,
   whose blossoms are a coral/cherry-RED (~#E8504D), not a soft pink. A pale rim
   at the petal tip eases to a sakura body and blooms to a coral-red heart at the
   base, so the falling field reads as THIS logo's flower (it sits beside it in
   the nav). Mirrors brand.css --petal-* stops (pale → sakura → deep → plum). */
const PALETTE = {
  pale: "#f7d2d4", // --petal-pale   (soft pale rim, the two-tone tip)
  sakura: "#f0a59f", // --petal-sakura (sakura body, warmed toward coral)
  deep: "#ec6f68", // --petal-deep   (deep coral-rose)
  plum: "#e44b48", // --petal-plum   (coral-RED heart, logo ~#E8504D)
};

const COUNT_FULL = 2600;
const COUNT_LITE = 1200;

/* A single petal silhouette — a soft almond/teardrop built once and instanced.
   A custom plane whose UVs we shade into a blossom-petal alpha. We keep the
   geometry a simple 2-tri plane and do the petal SHAPE in the fragment shader
   (cheap, crisp at any DPR). */
function makePetalGeometry() {
  const g = new THREE.PlaneGeometry(1, 1.35, 1, 1);
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

  varying vec2  vUv;
  varying float vDepth;
  varying float vColorMix;
  varying float vFade;

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

  void main() {
    vUv = uv;
    vDepth = aDepth;
    vColorMix = aColorMix;

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

    // --- flutter: each petal tumbles about its own axis ---
    float spin = t * (0.8 + aSpeed) + aPhase * 9.0;
    mat3 rot = rotAxis(normalize(aAxis), spin);
    // petal billows: slight non-uniform scale so it reads as a thin membrane;
    // a gust deepens the billow — petals caught broadside by the wind.
    vec3 local = position;
    local.x *= 1.0 + (0.12 + 0.1 * uGust) * sin(spin * 1.3);
    vec3 vtx = rot * (local * aScale * mix(0.55, 1.25, aDepth));

    vec3 world = pos + vtx;

    // soft-focus fade for the far layer (bokeh) + edge fade near field bounds.
    float edge = smoothstep(8.0, 5.5, abs(fall));
    vFade = edge * mix(0.5, 1.0, aDepth);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform vec3  uPale;
  uniform vec3  uSakura;
  uniform vec3  uDeep;
  uniform vec3  uPlum;
  uniform float uFlow;
  uniform bool  uBokeh;

  varying vec2  vUv;
  varying float vDepth;
  varying float vColorMix;
  varying float vFade;

  // Cherry-blossom petal silhouette in UV space: a teardrop that is narrow at
  // the base (bottom, v=0) and wide at the top (v=1), with the signature sakura
  // V-CLEFT notched into the top edge. Built from a width profile + a notch carve.
  float petalMask(vec2 uv) {
    float x = uv.x - 0.5;          // -0.5..0.5 across
    float y = uv.y;                // 0 (base) .. 1 (tip)

    // Width profile: pinched at the base, swelling to its widest near the top,
    // then easing back so the top corners are rounded (egg-shaped petal).
    float w = sin(clamp(y, 0.0, 1.0) * 3.14159) * 0.34   // round body
            + y * 0.18;                                   // bias width toward top
    float body = smoothstep(w, w - 0.06, abs(x));         // inside the outline

    // base rounding so the bottom point isn't a hard spike
    float baseSoft = smoothstep(0.0, 0.1, y);

    // the sakura cleft: carve a small V-notch DOWN into the top edge at center.
    float cleftDepth = 0.2;                                // how deep the notch
    float cleftWidth = 0.16;                               // how wide
    float notchEdge = 1.0 - cleftDepth + (cleftWidth - abs(x)) * (cleftDepth / cleftWidth);
    float topCut = (abs(x) < cleftWidth)
      ? smoothstep(notchEdge + 0.03, notchEdge, y)         // cut the V out
      : 1.0;
    float topSoft = smoothstep(1.02, 0.96, y);             // soften the very top

    return clamp(body * baseSoft * topCut * topSoft, 0.0, 1.0);
  }

  void main() {
    float mask = petalMask(vUv);
    if (mask < 0.02) discard;

    // length-wise color: a SAKURA-dominant petal. Body sits in sakura, easing to
    // a pale rim at the tip; only the deepest base hints the blossom heart. This
    // keeps petals reading pink over the black field rather than maroon.
    vec3 base = mix(uDeep, uSakura, smoothstep(0.0, 0.32, vUv.y));
    base = mix(base, uPale, smoothstep(0.5, 1.0, vUv.y));
    // per-petal ramp shift toward the plum heart — applied to the MINORITY of
    // petals (colorMix is cubed at generation) and only near the very base.
    base = mix(base, uPlum, vColorMix * 0.3 * (1.0 - smoothstep(0.0, 0.45, vUv.y)));

    // additive sakura rim — lift the petal edges toward pale pink so the
    // silhouette glows softly over the sumi-black field instead of crushing to a
    // dark maroon edge under NormalBlending. Strongest at the outline, fades in.
    float rim = smoothstep(0.0, 0.12, mask) * (1.0 - smoothstep(0.12, 0.4, mask));
    base += uPale * rim * 0.22;

    // gentle inner glow toward the heart
    float glow = smoothstep(0.5, 0.0, length(vUv - vec2(0.5, 0.32)));
    base += uSakura * glow * 0.06;

    // depth dims the far layer slightly; flow fades the whole field as it calms.
    float depthDim = mix(0.82, 1.0, vDepth);
    float alpha = mask * vFade * depthDim;

    // far-layer soft focus (bokeh): lift alpha edge softness on far petals.
    if (uBokeh) {
      float soft = mix(0.45, 1.0, vDepth);
      alpha *= mix(0.7, 1.0, soft);
    }

    // near petals stay denser; very-near calm keeps a tasteful translucency.
    alpha *= mix(0.78, 0.95, vDepth);

    gl_FragColor = vec4(base, alpha);
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

    const offsets = new Float32Array(count * 3);
    const axes = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const scales = new Float32Array(count);
    const depths = new Float32Array(count);
    const colorMix = new Float32Array(count);

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
      speeds[i] = 0.45 + rand() * 0.9;
      scales[i] = 0.16 + rand() * 0.22;
      // Color ramp bias: cube the random so most petals land PALE→SAKURA and the
      // deep/plum heart is reserved for a small minority. Over the sumi-black
      // hero this keeps the field reading as true cherry-blossom pink instead of
      // the oxblood/maroon that a uniform distribution produced.
      colorMix[i] = Math.pow(rand(), 3);
    }

    geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute("aAxis", new THREE.InstancedBufferAttribute(axes, 3));
    geo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new THREE.InstancedBufferAttribute(speeds, 1));
    geo.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute("aDepth", new THREE.InstancedBufferAttribute(depths, 1));
    geo.setAttribute("aColorMix", new THREE.InstancedBufferAttribute(colorMix, 1));
    geo.instanceCount = count;

    const u = {
      uTime: { value: 0 },
      uFlow: { value: 1 },
      uGust: { value: 0 },
      uSweep: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStr: { value: 0 },
      uPale: { value: new THREE.Color(PALETTE.pale) },
      uSakura: { value: new THREE.Color(PALETTE.sakura) },
      uDeep: { value: new THREE.Color(PALETTE.deep) },
      uPlum: { value: new THREE.Color(PALETTE.plum) },
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
