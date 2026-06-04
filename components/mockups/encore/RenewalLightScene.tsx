"use client";

/**
 * RenewalLightScene — the WebGL power element ("Renewal Light").
 *
 * A dark, cinematic scene: volumetric god-ray light shafts (orthographic
 * shader backdrop) rake across a slowly rotating refractive crystal/prism
 * (drei MeshTransmissionMaterial with chromatic dispersion) lit by emissive
 * Lightformers, finished with postprocessing Bloom. The crystal tilts toward
 * the cursor and breathes slowly — light passing through and being perfected.
 *
 * Loaded ONLY via dynamic({ ssr: false }) from RenewalHero (a client
 * component), because WebGL/R3F is not SSR-safe. A static CSS crystal/void
 * gradient is shown for SSR, mobile and prefers-reduced-motion (RenewalHero).
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { shaftFragmentShader, shaftVertexShader } from "./light-shafts-shaders";

/* Brand palette as linear-ish THREE colors (kept in JS to match brand.css). */
const PALETTE = {
  void0: "#1b2230",
  void1: "#262f42",
  beam: "#f3e6c8",
  beamCool: "#cfe4f1",
  crystal: "#eef3fb",
  attenuation: "#bcd2e6",
};

/* ---- Volumetric light-shaft backdrop (orthographic, full-bleed) ---- */
function ShaftBackdrop({
  pointer,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const smooth = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_pointer: { value: new THREE.Vector2(0, 0) },
      u_intensity: { value: 0 },
      u_void0: { value: new THREE.Color(PALETTE.void0) },
      u_void1: { value: new THREE.Color(PALETTE.void1) },
      u_beam: { value: new THREE.Color(PALETTE.beam) },
      u_beamCool: { value: new THREE.Color(PALETTE.beamCool) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(({ clock }, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.u_time.value = clock.getElapsedTime();
    m.uniforms.u_resolution.value.set(size.width, size.height);

    const target = pointer.current ?? { x: 0, y: 0 };
    const k = 1 - Math.pow(0.0015, delta);
    smooth.current.x += (target.x - smooth.current.x) * k;
    smooth.current.y += (target.y - smooth.current.y) * k;
    m.uniforms.u_pointer.value.set(smooth.current.x, smooth.current.y);

    const cur = m.uniforms.u_intensity.value as number;
    m.uniforms.u_intensity.value = cur + (1 - cur) * Math.min(1, delta * 1.1);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={shaftVertexShader}
        fragmentShader={shaftFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---- The refractive crystal/prism ---- */
function Crystal({
  pointer,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const target = pointer.current ?? { x: 0, y: 0 };

    // Slow continuous rotation (the crystal turning in the light).
    g.rotation.y += delta * 0.18;

    // Cursor tilt — eased, subtle, frame-rate independent.
    const k = 1 - Math.pow(0.0025, delta);
    const tiltX = target.y * 0.32 + Math.sin(t * 0.4) * 0.05; // breathe
    const tiltZ = -target.x * 0.28;
    g.rotation.x += (tiltX - g.rotation.x) * k;
    g.rotation.z += (tiltZ - g.rotation.z) * k;

    // Breathing scale — barely perceptible, alive.
    const breathe = 1 + Math.sin(t * 0.55) * 0.018;
    g.scale.setScalar(breathe);
  });

  return (
    <Float speed={1.0} rotationIntensity={0.18} floatIntensity={0.5}>
      <group ref={group}>
        <mesh ref={mesh} castShadow>
          {/* An octahedron reads as a faceted gem/prism. */}
          <octahedronGeometry args={[1.18, 0]} />
          <MeshTransmissionMaterial
            samples={8}
            resolution={512}
            thickness={1.4}
            roughness={0.02}
            ior={1.42}
            chromaticAberration={0.9}
            anisotropy={0.35}
            distortion={0.18}
            distortionScale={0.45}
            temporalDistortion={0.08}
            clearcoat={1}
            clearcoatRoughness={0.05}
            color="#ffffff"
            attenuationColor={PALETTE.attenuation}
            attenuationDistance={2.4}
            background={new THREE.Color(PALETTE.void0)}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* Emissive light shapes that feed Bloom + reflect in the crystal. */
function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <Environment resolution={256} frames={1}>
        {/* Warm key shaft from upper-left */}
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#fbeccb"
          position={[-3.2, 3.4, 2]}
          rotation={[-Math.PI / 5, 0, 0]}
          scale={[5, 9, 1]}
        />
        {/* Cool clinical fill from the right */}
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#cfe4f1"
          position={[4, 1.5, 1]}
          rotation={[0, -Math.PI / 2.4, 0]}
          scale={[6, 6, 1]}
        />
        {/* Soft rim from behind */}
        <Lightformer
          form="circle"
          intensity={2.6}
          color="#ffffff"
          position={[0, -2.6, -4]}
          scale={[7, 7, 1]}
        />
        <Lightformer
          form="ring"
          intensity={1.4}
          color="#f3e6c8"
          position={[1.5, 2.5, -2]}
          scale={[3, 3, 1]}
        />
      </Environment>
      {/* Directional sparkle key to throw caustic glints */}
      <directionalLight position={[-4, 5, 3]} intensity={1.1} color="#fff4e0" />
    </>
  );
}

export interface RenewalLightSceneProps {
  /** Disable sparkles + drop one composer effect on smaller tiers. */
  lite?: boolean;
}

export default function RenewalLightScene({
  lite = false,
}: RenewalLightSceneProps) {
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
      {/* Orthographic full-bleed volumetric light shafts */}
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ShaftBackdrop pointer={pointer} />
      </Canvas>

      {/* Perspective crystal layer (transparent canvas over the shafts) */}
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <StudioLights />
        <Crystal pointer={pointer} />
        {!lite && (
          <Sparkles
            count={28}
            scale={[6, 5, 3]}
            size={2.4}
            speed={0.28}
            opacity={0.5}
            color="#f3e6c8"
          />
        )}
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.9 : 1.35}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.18}
            mipmapBlur
            kernelSize={KernelSize.LARGE}
          />
          <Vignette eskil={false} offset={0.32} darkness={0.78} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
