"use client";

/**
 * OrbitScene — the WebGL power element ("balance / orbit flow-field").
 *
 * A single GPU particle system (thousands of points, one draw call) of motes
 * orbiting a calm gravitational center. Each begins on a slightly eccentric,
 * perturbed orbit and SETTLES into equilibrium over the first few seconds — a
 * literal "karma / balance" visual. The flow eases (slows toward stillness) as
 * the hero scrolls away; the cursor gently perturbs nearby motes, which then
 * re-balance. Color is a grounded botanical ramp by orbital radius: sage core →
 * moss → terracotta → warm-sand rim. Additive blending over the earth-night
 * gives a soft, meditative bloom — serene, never flashy.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from OrbitHero (a client component) —
 * WebGL/R3F is not SSR-safe. A static on-brand concentric-balance CSS field +
 * SVG orbit diagram is shown for SSR, mobile, no-WebGL, save-data and
 * prefers-reduced-motion (handled by OrbitHero).
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { orbitFragmentShader, orbitVertexShader } from "./orbit-shaders";

/* Brand orbit palette as THREE colors (mirrors brand.css --orbit-* stops). */
const PALETTE = {
  core: "#8aa37e", // sage core
  moss: "#6f8a5f",
  terra: "#c08457", // terracotta mid-ring
  sand: "#d8c39a", // warm sand rim
  bloom: "#cfe0c2", // pale sage cursor bloom
};

const COUNT = 6400; // mote budget — generous but one draw call

/* Tiny deterministic PRNG so geometry is stable across renders. */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build the orbit field: motes distributed across concentric rings around the
 * center. Radius is biased so the mid rings (where terracotta lives) read full,
 * with a denser sage core and a softer sand rim — a balanced botanical orbit.
 */
function buildOrbit(n: number, rng: () => number) {
  const radius = new Float32Array(n);
  const angle = new Float32Array(n);
  const speed = new Float32Array(n);
  const tilt = new Float32Array(n);
  const z = new Float32Array(n);
  const seed = new Float32Array(n);
  const scale = new Float32Array(n);

  for (let i = 0; i < n; i++) {
    // Radius 0.18 .. 2.0, biased toward the middle rings.
    const r = rng();
    radius[i] = 0.18 + Math.pow(r, 0.78) * 1.82;
    angle[i] = rng() * Math.PI * 2;
    // Inner rings orbit a touch faster; some retrograde variety for life.
    speed[i] = (0.6 + rng() * 0.8) * (rng() > 0.12 ? 1 : -1);
    tilt[i] = 0.4 + rng() * 0.8;
    z[i] = (rng() - 0.5) * 0.5 * (0.4 + radius[i] * 0.3);
    seed[i] = rng();
    scale[i] = 0.7 + rng() * 0.85;
  }

  return { radius, angle, speed, tilt, z, seed, scale };
}

function OrbitField({
  pointer,
  lite,
  easeRef,
}: {
  pointer: React.RefObject<{ x: number; y: number; active: number }>;
  lite: boolean;
  easeRef: React.RefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const introRef = useRef(0);
  const settleRef = useRef(0);
  const smoothPtr = useRef({ x: 0, y: 0, s: 0 });
  const easeSmooth = useRef(1);

  const { geometry, uniforms } = useMemo(() => {
    const n = lite ? Math.floor(COUNT * 0.55) : COUNT;
    const rng = mulberry32(70428);
    const data = buildOrbit(n, rng);

    const g = new THREE.BufferGeometry();
    // A placeholder position attribute (positions are computed in the shader).
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("aRadius", new THREE.BufferAttribute(data.radius, 1));
    g.setAttribute("aAngle", new THREE.BufferAttribute(data.angle, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(data.speed, 1));
    g.setAttribute("aTilt", new THREE.BufferAttribute(data.tilt, 1));
    g.setAttribute("aZ", new THREE.BufferAttribute(data.z, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(data.seed, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(data.scale, 1));
    // Generous bounding sphere so the field is never frustum-culled early.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 4);

    const u = {
      uTime: { value: 0 },
      uSettle: { value: 0 },
      uIntro: { value: 0 },
      uEase: { value: 1 },
      uDpr: { value: 1 },
      uSize: { value: lite ? 3.4 : 3.9 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStr: { value: 0 },
      uCore: { value: new THREE.Color(PALETTE.core) },
      uMoss: { value: new THREE.Color(PALETTE.moss) },
      uTerra: { value: new THREE.Color(PALETTE.terra) },
      uSand: { value: new THREE.Color(PALETTE.sand) },
      uBloom: { value: new THREE.Color(PALETTE.bloom) },
    };
    return { geometry: g, uniforms: u };
  }, [lite]);

  const { gl } = useThree();

  useFrame(({ clock }, delta) => {
    const m = matRef.current;
    if (!m) return;
    const dt = Math.min(delta, 1 / 30);
    const t = clock.getElapsedTime();
    m.uniforms.uTime.value = t;
    m.uniforms.uDpr.value = Math.min(gl.getPixelRatio(), 2);

    // Intro reveal (ease toward 1 once).
    introRef.current += (1 - introRef.current) * Math.min(1, dt * 1.1);
    m.uniforms.uIntro.value = introRef.current;

    // Settle: the eccentric orbits ease into balanced equilibrium over ~4s.
    settleRef.current += (1 - settleRef.current) * Math.min(1, dt * 0.36);
    m.uniforms.uSettle.value = settleRef.current;

    // Scroll-ease: smooth toward the target ease (1 in view, lower as it leaves).
    const easeTarget = easeRef.current ?? 1;
    easeSmooth.current += (easeTarget - easeSmooth.current) * Math.min(1, dt * 2);
    m.uniforms.uEase.value = easeSmooth.current;

    // Smooth the cursor (frame-rate independent).
    const target = pointer.current ?? { x: 0, y: 0, active: 0 };
    const k = 1 - Math.pow(0.0025, dt);
    smoothPtr.current.x += (target.x - smoothPtr.current.x) * k;
    smoothPtr.current.y += (target.y - smoothPtr.current.y) * k;
    smoothPtr.current.s +=
      (target.active - smoothPtr.current.s) * Math.min(1, dt * 2.6);
    m.uniforms.uPointer.value.set(smoothPtr.current.x, smoothPtr.current.y);
    m.uniforms.uPointerStr.value = smoothPtr.current.s;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={orbitVertexShader}
        fragmentShader={orbitFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Slow group sway so the whole orbit breathes — restrained, almost still. */
function SwayRig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const grp = g.current;
    if (!grp) return;
    const t = clock.getElapsedTime();
    grp.rotation.z = Math.sin(t * 0.05) * 0.06;
    grp.rotation.x = Math.sin(t * 0.08) * 0.05;
  });
  return <group ref={g}>{children}</group>;
}

export interface OrbitSceneProps {
  /** Drop mote count + point size on smaller/slower tiers. */
  lite?: boolean;
  /**
   * Live scroll-ease 0..1 (1 = full flow in view, lower as the hero scrolls
   * away). Passed as a ref so updating it never re-renders the Canvas tree.
   */
  easeRef?: React.RefObject<number>;
}

export default function OrbitScene({ lite = false, easeRef: externalEase }: OrbitSceneProps) {
  const pointer = useRef({ x: 0, y: 0, active: 0 });
  const internalEase = useRef(1);
  const easeRef = externalEase ?? internalEase;

  const handlePointer = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    pointer.current.active = 1;
  };

  return (
    <div
      className="absolute inset-0"
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        pointer.current.active = 0;
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SwayRig>
          <OrbitField pointer={pointer} lite={lite} easeRef={easeRef} />
        </SwayRig>
      </Canvas>
    </div>
  );
}
