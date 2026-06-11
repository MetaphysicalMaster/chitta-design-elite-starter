"use client";

/**
 * AuroraScene — the WebGL power element: a volumetric navy-night aurora
 * (pine-teal + soft pale-yellow ribbons over a navy sky) blooming above a soft
 * abstract horizon. "Luminous calm" — the brand's signature hero, refined and
 * feminine, matching "Subtle is The New WOW".
 *
 * SIGNATURE EXPERIENCE: the scene is now a PURE GPU layer driven by
 * AuroraConductor (the page-level fixed-canvas orchestrator). The conductor
 * owns scroll/pointer listeners, the GSAP night→dawn ScrollTrigger scrub and
 * sky-window visibility; this component just renders the drive state:
 *  - drive.scroll  → hero parallax (curtains push up as you leave the hero)
 *  - drive.pointer → cursor sway
 *  - drive.dawn    → the scroll-choreographed night→dawn resolve (stars fade,
 *    curtains dissolve + warm, dawn light pools at the horizon)
 *
 * Two layers:
 *  1. An orthographic full-bleed shader backdrop (night sky + aurora + dawn).
 *  2. An additive field of soft luminous particles drifting gently upward —
 *     they recede and warm as the dawn rises.
 *  Finished with subtle Bloom so the aurora blooms premium.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from AuroraConductor (a client
 * component) — WebGL/R3F is not SSR-safe. A static CSS aurora gradient covers
 * SSR, mobile, reduced-motion and no-WebGL (AuroraHero keeps its fallback).
 *
 * Perf: dpr={[1,2]}, instancing + additive (no per-mote draw calls), frameloop
 * pauses (via `paused`) when no transparent night section is on screen or the
 * tab is hidden.
 *
 * NOTE: the shader uniform NAMES are retained (u_violet / u_magenta) so the GLSL
 * is untouched; their VALUES now carry the navy/teal/gold palette. Read u_violet
 * as "the clinical-blue bloom" and u_magenta as "the pine-teal ribbon".
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { auroraFragmentShader, auroraVertexShader } from "./aurora-shaders";

/* Navy night sky + pine-teal + soft pale-yellow — the live brand, by night. */
const PALETTE = {
  night0: "#08172a", // top of sky (deepest navy)
  night1: "#0a2a4a", // horizon sky — the canonical brand navy
  violet: "#3f7fd6", // (reused name) clinical-blue bloom
  magenta: "#2f9c86", // (reused name) pine-teal ribbon
  teal: "#5fd8c4", // bright teal tip
  cyan: "#ffe9a0", // (reused name) soft pale-yellow highlight
  ridge: "#0c2138", // navy ridge silhouette
  dawnSky: "#33608f", // lifted pre-dawn twilight blue
  dawnWarm: "#ffe2a6", // warm pale-yellow first light (brand gold, warmed)
};

/* Shared reactive drive: pointer (-1..1) + hero scroll (0..1) + dawn (0..1).
   Owned by AuroraConductor; mutated outside React render. */
export type AuroraDrive = {
  pointer: { x: number; y: number };
  scroll: number;
  dawn: number;
};

/* ---- Orthographic full-bleed aurora backdrop ---- */
function AuroraBackdrop({ drive }: { drive: React.RefObject<AuroraDrive> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const smooth = useRef({ x: 0, y: 0, scroll: 0, dawn: 0 });

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_pointer: { value: new THREE.Vector2(0, 0) },
      u_scroll: { value: 0 },
      u_intensity: { value: 0 },
      u_dawn: { value: 0 },
      u_night0: { value: new THREE.Color(PALETTE.night0) },
      u_night1: { value: new THREE.Color(PALETTE.night1) },
      u_violet: { value: new THREE.Color(PALETTE.violet) },
      u_magenta: { value: new THREE.Color(PALETTE.magenta) },
      u_teal: { value: new THREE.Color(PALETTE.teal) },
      u_cyan: { value: new THREE.Color(PALETTE.cyan) },
      u_ridge: { value: new THREE.Color(PALETTE.ridge) },
      u_dawnSky: { value: new THREE.Color(PALETTE.dawnSky) },
      u_dawnWarm: { value: new THREE.Color(PALETTE.dawnWarm) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(({ clock }, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.u_time.value = clock.getElapsedTime();
    m.uniforms.u_resolution.value.set(size.width, size.height);

    const d = drive.current ?? { pointer: { x: 0, y: 0 }, scroll: 0, dawn: 0 };
    const k = 1 - Math.pow(0.0016, delta);
    smooth.current.x += (d.pointer.x - smooth.current.x) * k;
    smooth.current.y += (d.pointer.y - smooth.current.y) * k;
    smooth.current.scroll += (d.scroll - smooth.current.scroll) * k;
    // dawn catches up a touch quicker so resumes after a paused stretch
    // (covered by light sections) settle fast, but still never pop.
    const kd = 1 - Math.pow(0.0005, delta);
    smooth.current.dawn += (d.dawn - smooth.current.dawn) * kd;
    m.uniforms.u_pointer.value.set(smooth.current.x, smooth.current.y);
    m.uniforms.u_scroll.value = smooth.current.scroll;
    m.uniforms.u_dawn.value = smooth.current.dawn;

    // smooth mount fade-in (no harsh pop)
    const cur = m.uniforms.u_intensity.value as number;
    m.uniforms.u_intensity.value = cur + (1 - cur) * Math.min(1, delta * 1.1);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* ---- Instanced additive aurora motes (soft luminous particles) ---- */
const COUNT_FULL = 150;
const COUNT_LITE = 80;

function AuroraMotes({
  drive,
  count,
}: {
  drive: React.RefObject<AuroraDrive>;
  count: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  const motes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 2,
        rise: 0.1 + Math.random() * 0.5,
        size: 0.015 + Math.random() * 0.05,
        sway: Math.random() * Math.PI * 2,
        // hue bias: 0 = violet, 1 = cyan
        hue: Math.random(),
        bright: 0.3 + Math.random() * 0.7,
      });
    }
    return arr;
  }, [count]);

  // Motes range pine-teal → soft pale-yellow (the two ribbon colors).
  const color = useMemo(() => new THREE.Color(), []);
  const cViolet = useMemo(() => new THREE.Color(PALETTE.teal), []);
  const cCyan = useMemo(() => new THREE.Color(PALETTE.cyan), []);
  const cDawn = useMemo(() => new THREE.Color(PALETTE.dawnWarm), []);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const d = drive.current ?? { pointer: { x: 0, y: 0 }, scroll: 0, dawn: 0 };
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const top = Math.max(viewport.height, 4) * 0.6;

    for (let i = 0; i < motes.length; i++) {
      const s = motes[i];
      // rise upward; recycle to the bottom when past the top
      s.y += dt * s.rise;
      if (s.y > top) s.y = -top;

      // gentle horizontal sway + slight pull toward cursor
      const sx = s.x + Math.sin(t * 0.3 + s.sway) * 0.25 + d.pointer.x * 0.3;
      // fade with hero scroll, and recede further as the dawn rises
      const fade = (1 - d.scroll * 0.6) * (1 - d.dawn * 0.45);

      dummy.position.set(sx, s.y, s.z);
      const sc = s.size * (0.8 + 0.2 * Math.sin(t + s.sway));
      dummy.scale.set(sc, sc, sc);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      color.copy(cViolet).lerp(cCyan, s.hue);
      // the surviving motes warm toward first light
      color.lerp(cDawn, d.dawn * 0.5);
      color.multiplyScalar(s.bright * fade);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <circleGeometry args={[1, 12]} />
      <meshBasicMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        opacity={0.85}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

/* Fires once after the scene has actually RENDERED a frame — the conductor
   uses it to flip [data-aurora-live] (fading the CSS fallback) only when real
   aurora pixels exist. Prevents any white flash while the chunk/GPU warms up. */
function FirstFrame({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      onFirstFrame?.();
    }
  });
  return null;
}

export interface AuroraSceneProps {
  /** Mutable drive state owned by AuroraConductor. */
  drive: React.RefObject<AuroraDrive>;
  /** Fewer motes + lighter bloom on smaller / high-DPI tiers. */
  lite?: boolean;
  /** True when no sky-window section is on screen / tab hidden → GPU idles. */
  paused?: boolean;
  /** Called once after the first rendered frame. */
  onFirstFrame?: () => void;
}

export default function AuroraScene({
  drive,
  lite = false,
  paused = false,
  onFirstFrame,
}: AuroraSceneProps) {
  const count = lite ? COUNT_LITE : COUNT_FULL;

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 2]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <FirstFrame onFirstFrame={onFirstFrame} />
      <AuroraBackdrop drive={drive} />
      <AuroraMotes drive={drive} count={count} />
      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={lite ? 0.5 : 0.75}
          luminanceThreshold={0.42}
          luminanceSmoothing={0.3}
          mipmapBlur
          kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
        />
      </EffectComposer>
    </Canvas>
  );
}
