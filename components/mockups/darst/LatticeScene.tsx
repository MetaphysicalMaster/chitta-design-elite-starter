"use client";

/**
 * LatticeScene — the WebGL power element ("dermal cross-section").
 *
 * A single GPU particle system (thousands of points, one draw call) that
 * begins as a dispersed cloud and RESOLVES into an ordered lattice arranged by
 * dermal DEPTH STRATA — stratum corneum → epidermis → dermis → hypodermis —
 * with a cheap depth-of-field that keeps a focal stratum sharp while the rest
 * softens to bokeh. One lone OXBLOOD capillary thread weaves through the dermis.
 * Standard alpha blending (NOT additive) + no bloom: medical and precise, never
 * flashy — matching the academic brand.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from LatticeHero (a client component)
 * — WebGL/R3F is not SSR-safe. A static on-brand SVG dermal-layer illustration
 * + CSS strata field is shown for SSR, mobile, no-WebGL, save-data and
 * prefers-reduced-motion (handled by LatticeHero).
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { latticeFragmentShader, latticeVertexShader } from "./lattice-shaders";

/* Brand strata palette as THREE colors (mirrors brand.css --strata-* stops).
   Rebranded to the practice's warm BROWN + TEAL identity: warm earth-tone
   strata resolving from a pale warm surface to a deep espresso hypodermis,
   threaded by one lone TEAL capillary (was navy + oxblood). */
const PALETTE = {
  corneum: "#ece2d4", // warm pale surface
  epidermis: "#c2a886",
  dermis: "#8a6a4c",
  deep: "#3a2c20", // deep espresso hypodermis
  vessel: "#2f9fa6", // the lone TEAL capillary
};

const COUNT = 7200; // particle budget — generous but one draw call

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
 * Build the resolved dermal lattice: particles laid out across a wide
 * cross-section panel, stacked top→down through depth strata. A subtle
 * jitter keeps it organic (cells, not a perfect grid). One oxblood capillary
 * thread is carved through the dermis band as a sine path.
 */
function buildLattice(n: number, rng: () => number) {
  const lattice = new Float32Array(n * 3);
  const cloud = new Float32Array(n * 3);
  const depth = new Float32Array(n);
  const vessel = new Float32Array(n);
  const seed = new Float32Array(n);
  const scale = new Float32Array(n);

  // Lattice panel extents (world units) — wide, shallow cross-section.
  const HALF_W = 1.85;
  const TOP_Y = 1.0; // surface (corneum)
  const BOT_Y = -1.0; // hypodermis floor

  // Capillary thread params (a vessel meandering through the dermis). A touch
  // denser (0.05 → 0.07) so the teal thread reads as a continuous capillary,
  // not a sparse dotted line — the page's single chroma signature.
  const vesselCount = Math.floor(n * 0.07);

  for (let i = 0; i < n; i++) {
    const isVessel = i < vesselCount;

    let x: number, y: number, z: number, d: number;

    if (isVessel) {
      // Oxblood capillary: a sine thread living in the dermis band (d ~0.5..0.8).
      const t = i / vesselCount; // 0..1 along the thread
      x = (t - 0.5) * 2 * HALF_W * 0.92;
      // Meander vertically within the dermis stratum.
      const base = 0.62 + Math.sin(t * Math.PI * 3.0) * 0.12;
      d = base + (rng() - 0.5) * 0.04;
      y = THREE.MathUtils.lerp(TOP_Y, BOT_Y, d) + (rng() - 0.5) * 0.04;
      z = Math.cos(t * Math.PI * 4.0) * 0.18 + (rng() - 0.5) * 0.04;
      vessel[i] = 1;
    } else {
      // Tissue particle: distribute across width; depth weighted so the
      // upper strata (epidermis) are slightly denser, like real tissue.
      x = (rng() * 2 - 1) * HALF_W;
      // Bias depth toward a fuller dermis with a soft surface skin.
      const r = rng();
      d = Math.pow(r, 0.85); // 0 surface .. 1 deep
      // Cellular jitter so bands read as tissue, not stripes.
      d = Math.min(1, Math.max(0, d + (rng() - 0.5) * 0.06));
      y = THREE.MathUtils.lerp(TOP_Y, BOT_Y, d);
      // Per-stratum thickness wobble + gentle z volume.
      y += (rng() - 0.5) * 0.05;
      z = (rng() - 0.5) * 0.42 * (0.5 + d * 0.5);
      vessel[i] = 0;
    }

    lattice[i * 3] = x;
    lattice[i * 3 + 1] = y;
    lattice[i * 3 + 2] = z;

    // Dispersed source cloud — a soft ellipsoid the lattice resolves FROM.
    const rr = Math.pow(rng(), 0.5) * 1.7;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    cloud[i * 3] = rr * Math.sin(phi) * Math.cos(theta) * 1.5;
    cloud[i * 3 + 1] = rr * Math.sin(phi) * Math.sin(theta) * 0.9;
    cloud[i * 3 + 2] = rr * Math.cos(phi) * 0.6;

    depth[i] = d;
    seed[i] = rng();
    scale[i] = 0.7 + rng() * 0.8;
  }

  return { lattice, cloud, depth, vessel, seed, scale };
}

/** Shared smoothing constant for the scroll-descent value (frame-rate safe). */
function smoothToward(current: number, target: number, dt: number) {
  return current + (target - current) * (1 - Math.pow(0.004, dt));
}

function DermalLattice({
  pointer,
  descent,
  lite,
}: {
  pointer: React.RefObject<{ x: number; y: number; active: number }>;
  descent: React.RefObject<{ p: number }>;
  lite: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const introRef = useRef(0);
  const resolveRef = useRef(0);
  const smoothPtr = useRef({ x: 0, y: 0, s: 0 });
  const focusRef = useRef(0.5);
  const descentRef = useRef(0);

  const { geometry, uniforms } = useMemo(() => {
    const n = lite ? Math.floor(COUNT * 0.55) : COUNT;
    const rng = mulberry32(40719);
    const data = buildLattice(n, rng);

    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(data.lattice.slice(), 3),
    );
    g.setAttribute("aLattice", new THREE.BufferAttribute(data.lattice, 3));
    g.setAttribute("aCloud", new THREE.BufferAttribute(data.cloud, 3));
    g.setAttribute("aDepth", new THREE.BufferAttribute(data.depth, 1));
    g.setAttribute("aVessel", new THREE.BufferAttribute(data.vessel, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(data.seed, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(data.scale, 1));

    const u = {
      uTime: { value: 0 },
      uResolve: { value: 0 },
      uIntro: { value: 0 },
      uDpr: { value: 1 },
      uSize: { value: lite ? 4.4 : 5.2 },
      uFocus: { value: 0.5 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStr: { value: 0 },
      uCorneum: { value: new THREE.Color(PALETTE.corneum) },
      uEpidermis: { value: new THREE.Color(PALETTE.epidermis) },
      uDermis: { value: new THREE.Color(PALETTE.dermis) },
      uDeep: { value: new THREE.Color(PALETTE.deep) },
      uVessel: { value: new THREE.Color(PALETTE.vessel) },
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

    // Resolve: the lattice assembles over the first ~3s, then holds.
    resolveRef.current += (1 - resolveRef.current) * Math.min(1, dt * 0.5);
    m.uniforms.uResolve.value = resolveRef.current;

    // Focal stratum. At rest it slowly sweeps through depth — a clinician
    // scanning the section. Once the scroll DESCENT engages, the focal plane
    // instead TRACKS the descent (corneum → epidermis → dermis): the literal
    // "he reads deeper" — what is sharp is the stratum you've scrolled to.
    const dTarget = descent.current?.p ?? 0;
    descentRef.current = smoothToward(descentRef.current, dTarget, dt);
    const dp = descentRef.current;
    const idleFocus = 0.5 + Math.sin(t * 0.16) * 0.32;
    const descentFocus = 0.06 + dp * 0.86; // surface → deep dermis
    const engaged = Math.min(1, dp * 7); // hand over as soon as descent starts
    focusRef.current = THREE.MathUtils.lerp(idleFocus, descentFocus, engaged);
    m.uniforms.uFocus.value = focusRef.current;

    // Smooth the cursor (frame-rate independent).
    const target = pointer.current ?? { x: 0, y: 0, active: 0 };
    const k = 1 - Math.pow(0.0022, dt);
    smoothPtr.current.x += (target.x - smoothPtr.current.x) * k;
    smoothPtr.current.y += (target.y - smoothPtr.current.y) * k;
    smoothPtr.current.s +=
      (target.active - smoothPtr.current.s) * Math.min(1, dt * 3);
    m.uniforms.uPointer.value.set(smoothPtr.current.x, smoothPtr.current.y);
    m.uniforms.uPointerStr.value = smoothPtr.current.s;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={latticeVertexShader}
        fragmentShader={latticeFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

/* Slow group sway so the whole section breathes — restrained, almost still.
   The sway eases out as the descent engages: a clinician steadies the stage
   before driving the objective down. */
function SwayRig({
  descent,
  children,
}: {
  descent: React.RefObject<{ p: number }>;
  children: React.ReactNode;
}) {
  const g = useRef<THREE.Group>(null);
  const dRef = useRef(0);
  useFrame(({ clock }, delta) => {
    const grp = g.current;
    if (!grp) return;
    const dt = Math.min(delta, 1 / 30);
    const t = clock.getElapsedTime();
    dRef.current = smoothToward(dRef.current, descent.current?.p ?? 0, dt);
    const steady = 1 - Math.min(1, dRef.current * 4) * 0.85;
    grp.rotation.y = Math.sin(t * 0.12) * 0.1 * steady;
    grp.rotation.x = Math.sin(t * 0.09) * 0.035 * steady;
  });
  return <group ref={g}>{children}</group>;
}

/**
 * DescentRig — THE SIGNATURE. GSAP ScrollTrigger (in LatticeHero) scrubs
 * `descent.p` 0→1 while the hero is pinned; this rig translates that into the
 * microscope move: the camera tracks DOWN through the strata (corneum →
 * epidermis → dermis) while dollying IN — descending magnification, the
 * literal "he reads deeper". Values are smoothed per-frame so the move stays
 * silky regardless of scroll-event cadence.
 */
function DescentRig({ descent }: { descent: React.RefObject<{ p: number }> }) {
  const dRef = useRef(0);
  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 1 / 30);
    dRef.current = smoothToward(dRef.current, descent.current?.p ?? 0, dt);
    // Ease the raw progress so the descent starts gently and lands softly.
    const p = dRef.current;
    const e = p * p * (3 - 2 * p); // smoothstep
    camera.position.y = THREE.MathUtils.lerp(0.52, -0.82, e);
    camera.position.z = THREE.MathUtils.lerp(4.2, 3.15, e);
    camera.lookAt(0, camera.position.y * 0.94, 0);
  });
  return null;
}

export interface LatticeSceneProps {
  /** Drop particle count + point size on smaller/slower tiers. */
  lite?: boolean;
  /**
   * Scroll-descent progress (0 surface .. 1 deep dermis), written by the GSAP
   * ScrollTrigger in LatticeHero. A mutable ref so scroll → GPU never touches
   * React state.
   */
  descent?: React.RefObject<{ p: number }>;
}

const DESCENT_ZERO = { current: { p: 0 } };

export default function LatticeScene({
  lite = false,
  descent,
}: LatticeSceneProps) {
  const pointer = useRef({ x: 0, y: 0, active: 0 });
  const descentRef = descent ?? DESCENT_ZERO;

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
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <DescentRig descent={descentRef} />
        <SwayRig descent={descentRef}>
          <DermalLattice pointer={pointer} descent={descentRef} lite={lite} />
        </SwayRig>
      </Canvas>
    </div>
  );
}
