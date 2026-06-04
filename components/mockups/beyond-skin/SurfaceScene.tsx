"use client";

/**
 * SurfaceScene — the WebGL power element ("Beyond the Surface").
 *
 * A single GPU particle system (thousands of points, one draw call) that
 * forms a recognizable serene FACE PROFILE, then dissolves and re-forms into
 * a BOTANICAL LEAF and a flowing SILK RIBBON before returning — a visual
 * metaphor for revealing what lies beyond the surface. Particles drift with
 * organic noise and bend around a cursor flow field; additive blending + a
 * soft Bloom give a luminous, couture skin/light glow.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from SurfaceHero (a client
 * component) — WebGL/R3F is not SSR-safe. A static CSS gradient field is
 * shown for SSR, mobile, no-WebGL and prefers-reduced-motion (SurfaceHero).
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  surfaceFragmentShader,
  surfaceVertexShader,
} from "./surface-shaders";

/* Brand palette as THREE colors (kept in JS to mirror brand.css glow stops). */
const PALETTE = {
  rose: "#e58a73", // --glow-rose
  bronze: "#d6a878", // --glow-bronze
  gold: "#ecc98f", // --glow-gold
  deep: "#3a2a28", // warm espresso shadow
};

const COUNT = 9000; // particle budget — generous but one draw call

/* ---------- Morph-target generators (each returns COUNT * 3 floats) ---------- */

/** Serene face profile (silhouette facing left), sampled as a filled outline. */
function buildFace(rng: () => number): Float32Array {
  // Profile control points (x,y) tracing forehead→nose→lips→chin→neck→back.
  // Normalized roughly to [-1,1]; profile faces left (nose toward -x).
  const profile: [number, number][] = [
    [0.34, 1.18], // top of head
    [-0.02, 1.12], // forehead crown
    [-0.34, 0.86], // forehead
    [-0.46, 0.58], // brow
    [-0.4, 0.44], // eye socket
    [-0.56, 0.3], // nose bridge
    [-0.72, 0.12], // nose tip
    [-0.58, 0.0], // under nose
    [-0.62, -0.1], // top lip
    [-0.6, -0.2], // mouth
    [-0.6, -0.3], // bottom lip
    [-0.5, -0.46], // chin
    [-0.34, -0.62], // under chin
    [-0.1, -0.78], // jaw
    [0.18, -0.86], // neck front
    [0.34, -1.05], // neck base
    [0.5, -1.05], // shoulder hint
    [0.5, 0.2], // back of neck
    [0.46, 0.7], // back of head
    [0.34, 1.18], // close
  ];
  const arr = new Float32Array(COUNT * 3);
  // Edge particles get a tight band; interior gets a soft fill for volume.
  for (let i = 0; i < COUNT; i++) {
    const edge = rng() < 0.62;
    let x: number, y: number;
    if (edge) {
      // Sample along the polyline.
      const seg = Math.floor(rng() * (profile.length - 1));
      const f = rng();
      const a = profile[seg];
      const b = profile[seg + 1];
      x = a[0] + (b[0] - a[0]) * f;
      y = a[1] + (b[1] - a[1]) * f;
      // Slight inward jitter to thicken the contour.
      x += (rng() - 0.5) * 0.05;
      y += (rng() - 0.5) * 0.05;
    } else {
      // Interior fill — bias toward the face mass (cheek region).
      const cx = -0.1 + (rng() - 0.5) * 0.7;
      const cy = 0.25 + (rng() - 0.5) * 1.1;
      x = cx;
      y = cy;
    }
    const z = (rng() - 0.5) * 0.16;
    arr[i * 3] = x * 1.25;
    arr[i * 3 + 1] = y * 1.05;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

/** Botanical leaf contour with central vein. */
function buildLeaf(rng: () => number): Float32Array {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    // Parametric leaf: width tapers at both ends, slight curl.
    const t = rng(); // 0..1 along the leaf (tip..base)
    const yy = (t - 0.5) * 2.4; // length axis
    // Leaf half-width profile (pointed almond).
    const w = Math.sin(Math.PI * t) * 0.62 * (0.85 + 0.3 * t);
    const r = rng();
    const vein = r < 0.22; // particles sitting on the midrib/veins
    let x: number;
    if (vein) {
      x = (rng() - 0.5) * 0.04;
    } else {
      const side = rng() < 0.5 ? -1 : 1;
      // Bias toward the edge for a crisp contour, some fill.
      const edge = rng() < 0.55 ? 1 : Math.pow(rng(), 0.6);
      x = side * w * edge;
    }
    // Gentle curl + slight 3D arch.
    const curl = Math.sin(t * Math.PI) * 0.18;
    const z = curl * 0.9 + (rng() - 0.5) * 0.08;
    arr[i * 3] = x * 1.05 + yy * 0.12; // diagonal lean
    arr[i * 3 + 1] = yy;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

/** Flowing silk ribbon — a sine band sweeping across, with width + flutter. */
function buildRibbon(rng: () => number): Float32Array {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const u = rng(); // 0..1 along the ribbon length
    const x = (u - 0.5) * 2.8;
    // Centerline waves.
    const centerY = Math.sin(u * Math.PI * 2.2) * 0.55;
    const wobbleZ = Math.cos(u * Math.PI * 2.6) * 0.5;
    // Ribbon width (across), tapering at the ends.
    const halfW = 0.42 * Math.sin(Math.PI * u);
    const v = (rng() - 0.5) * 2.0; // -1..1 across width
    const y = centerY + v * halfW;
    // The ribbon twists, so width also displaces z.
    const z = wobbleZ + v * halfW * Math.sin(u * Math.PI * 3.0) * 0.8;
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z + (rng() - 0.5) * 0.04;
  }
  return arr;
}

/** Dispersed soft cloud — the "dissolved" state + intro source. */
function buildCloud(rng: () => number): Float32Array {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    // Gaussian-ish blob, slightly wider than tall.
    const r = Math.pow(rng(), 0.5) * 1.7;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.25;
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi) * 0.5;
  }
  return arr;
}

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

function ParticleMorph({
  pointer,
  lite,
}: {
  pointer: React.RefObject<{ x: number; y: number; active: number }>;
  lite: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const introRef = useRef(0);
  const morphRef = useRef(0);
  const smoothPtr = useRef({ x: 0, y: 0, s: 0 });

  const { geometry, uniforms } = useMemo(() => {
    const n = lite ? Math.floor(COUNT * 0.55) : COUNT;
    const rng = mulberry32(20231);
    // Build at full COUNT then slice to n for lite (keeps generators simple).
    const face = buildFace(mulberry32(11));
    const leaf = buildLeaf(mulberry32(22));
    const ribbon = buildRibbon(mulberry32(33));
    const cloud = buildCloud(mulberry32(44));

    const seeds = new Float32Array(n);
    const scales = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      seeds[i] = rng();
      scales[i] = 0.7 + rng() * 0.9;
    }

    const slice = (src: Float32Array) => src.subarray(0, n * 3);

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(slice(face), 3));
    g.setAttribute("aFace", new THREE.BufferAttribute(slice(face), 3));
    g.setAttribute("aLeaf", new THREE.BufferAttribute(slice(leaf), 3));
    g.setAttribute("aRibbon", new THREE.BufferAttribute(slice(ribbon), 3));
    g.setAttribute("aCloud", new THREE.BufferAttribute(slice(cloud), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const u = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uDpr: { value: 1 },
      uSize: { value: lite ? 4.0 : 4.6 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStr: { value: 0 },
      uIntro: { value: 0 },
      uColorRose: { value: new THREE.Color(PALETTE.rose) },
      uColorBronze: { value: new THREE.Color(PALETTE.bronze) },
      uColorGold: { value: new THREE.Color(PALETTE.gold) },
      uColorDeep: { value: new THREE.Color(PALETTE.deep) },
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
    introRef.current += (1 - introRef.current) * Math.min(1, dt * 0.9);
    m.uniforms.uIntro.value = introRef.current;

    // Continuous morph progression — slow, cinematic dwell on each shape.
    morphRef.current += dt * 0.14;
    m.uniforms.uMorph.value = morphRef.current;

    // Smooth the cursor (frame-rate independent) toward the latest pointer.
    const target = pointer.current ?? { x: 0, y: 0, active: 0 };
    const k = 1 - Math.pow(0.0019, dt);
    smoothPtr.current.x += (target.x - smoothPtr.current.x) * k;
    smoothPtr.current.y += (target.y - smoothPtr.current.y) * k;
    smoothPtr.current.s += (target.active - smoothPtr.current.s) * Math.min(1, dt * 3);
    m.uniforms.uPointer.value.set(smoothPtr.current.x, smoothPtr.current.y);
    m.uniforms.uPointerStr.value = smoothPtr.current.s;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={surfaceVertexShader}
        fragmentShader={surfaceFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Slow group sway so the whole portrait breathes. */
function SwayRig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const grp = g.current;
    if (!grp) return;
    const t = clock.getElapsedTime();
    grp.rotation.y = Math.sin(t * 0.16) * 0.18;
    grp.rotation.x = Math.sin(t * 0.12) * 0.06;
  });
  return <group ref={g}>{children}</group>;
}

export interface SurfaceSceneProps {
  /** Drop particle count + sparkle on smaller/slower tiers. */
  lite?: boolean;
}

export default function SurfaceScene({ lite = false }: SurfaceSceneProps) {
  const pointer = useRef({ x: 0, y: 0, active: 0 });

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
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SwayRig>
          <ParticleMorph pointer={pointer} lite={lite} />
        </SwayRig>
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.85 : 1.25}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.22}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
