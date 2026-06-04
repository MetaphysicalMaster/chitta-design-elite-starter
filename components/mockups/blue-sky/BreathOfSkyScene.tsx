"use client";

/**
 * BreathOfSkyScene — the WebGL power element.
 *
 * Full-bleed orthographic shader plane rendering a living dawn->day sky with
 * drifting volumetric fbm clouds, cursor parallax and a slow palette breath.
 * A floating refractive glass orb (drei MeshTransmissionMaterial) adds a
 * tactile luxe accent on a separate perspective layer.
 *
 * This module is loaded ONLY via dynamic({ ssr: false }) from SkyHero (a
 * client component), because WebGL/R3F is not SSR-safe. A static CSS gradient
 * is shown for SSR, mobile and prefers-reduced-motion (handled by SkyHero).
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { skyFragmentShader, skyVertexShader } from "./sky-shaders";

/* Brand sky palette as linear THREE colors (kept in JS so it matches brand.css) */
const PALETTE = {
  dawn: "#f2dcb8",
  mid: "#bcd4ec",
  high: "#7fb0e6",
  deep: "#4f74b3",
  blush: "#f3d2d6",
};

function SkyPlane({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  // Smoothed pointer so parallax glides rather than snaps.
  const smooth = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_pointer: { value: new THREE.Vector2(0, 0) },
      u_intensity: { value: 0 },
      u_dawn: { value: new THREE.Color(PALETTE.dawn) },
      u_mid: { value: new THREE.Color(PALETTE.mid) },
      u_high: { value: new THREE.Color(PALETTE.high) },
      u_deep: { value: new THREE.Color(PALETTE.deep) },
      u_blush: { value: new THREE.Color(PALETTE.blush) },
    }),
    // size handled in useFrame; only construct once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(({ clock }, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.u_time.value = clock.getElapsedTime();
    m.uniforms.u_resolution.value.set(size.width, size.height);

    const target = pointer.current ?? { x: 0, y: 0 };
    // Critically-damped-ish lerp, framerate independent
    const k = 1 - Math.pow(0.001, delta);
    smooth.current.x += (target.x - smooth.current.x) * k;
    smooth.current.y += (target.y - smooth.current.y) * k;
    m.uniforms.u_pointer.value.set(smooth.current.x, smooth.current.y);

    // Ease intensity up to 1 for a graceful reveal
    const cur = m.uniforms.u_intensity.value as number;
    m.uniforms.u_intensity.value = cur + (1 - cur) * Math.min(1, delta * 1.6);
  });

  // Fill the orthographic frustum exactly (viewport is in world units).
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* Refractive glass orb on a perspective layer — drifts with light parallax. */
function GlassOrb({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const target = pointer.current ?? { x: 0, y: 0 };
    const k = 1 - Math.pow(0.0015, delta);
    g.position.x += (target.x * 0.6 - g.position.x) * k;
    g.position.y += (0.15 + target.y * 0.35 - g.position.y) * k;
  });

  return (
    <group ref={group} position={[0.9, 0.2, 1.5]}>
      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.9}>
        <mesh>
          <sphereGeometry args={[0.62, 64, 64]} />
          <MeshTransmissionMaterial
            samples={6}
            resolution={256}
            thickness={0.55}
            roughness={0.08}
            chromaticAberration={0.18}
            anisotropy={0.2}
            distortion={0.25}
            distortionScale={0.3}
            temporalDistortion={0.1}
            ior={1.18}
            color="#eaf3ff"
            attenuationColor="#cfe2f7"
            attenuationDistance={1.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

function PerspectiveLights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#fff4e0" />
      <directionalLight position={[-4, -2, 2]} intensity={0.4} color="#bcd4ec" />
    </>
  );
}

export interface BreathOfSkySceneProps {
  /** When false, the orb is skipped (perf tier for smaller screens). */
  showOrb?: boolean;
}

export default function BreathOfSkyScene({ showOrb = true }: BreathOfSkySceneProps) {
  // Shared pointer ref; updated by a DOM listener for low overhead.
  const pointer = useRef({ x: 0, y: 0 });

  const handlePointer = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <div
      className="absolute inset-0"
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      {/* Orthographic full-bleed sky */}
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SkyPlane pointer={pointer} />
      </Canvas>

      {/* Perspective orb layer (transparent canvas over the sky) */}
      {showOrb && (
        <Canvas
          camera={{ position: [0, 0, 4], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <PerspectiveLights />
          <GlassOrb pointer={pointer} />
        </Canvas>
      )}
    </div>
  );
}
