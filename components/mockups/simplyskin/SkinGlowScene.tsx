"use client";

/**
 * SkinGlowScene — the WebGL power element ("Skin-Glow Light Study").
 *
 * Quiet-luxury, clinical-minimal: a soft refractive light sweep over a smooth
 * surface implying luminous, healthy skin. Two layers:
 *   1. An orthographic full-bleed caustic backdrop (custom shader) — a soft
 *      platinum/nude light-sweep with a single teal whisper over a near-white
 *      surface. The light source eases toward the cursor and drifts.
 *   2. A smooth, gently-curved refractive lens (drei MeshTransmissionMaterial)
 *      that the caustic light passes through and is "perfected" by — barely
 *      rotating, breathing. A warm-nude attenuation reads as healthy skin tone.
 *   Finished with a very low Bloom so only the brightest caustic cores lift.
 *
 * Restraint over spectacle: low chromatic aberration, soft roughness, no
 * sparkles — matches the brand's airy quiet-luxury register (NOT a light show).
 *
 * Loaded ONLY via dynamic({ ssr:false }) from SkinGlowHero (a client
 * component) — WebGL/R3F is not SSR-safe. A static CSS caustic gradient covers
 * SSR, mobile, reduced-motion and no-WebGL (SkinGlowHero).
 *
 * Perf: dpr={[1,2]}, frameloop pauses when the hero is offscreen or the tab is
 * hidden. `lite` tier drops the transmission resolution + Bloom kernel.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { glowFragmentShader, glowVertexShader } from "./skin-glow-shaders";

/* Brand palette as THREE colors (kept in JS to match brand.css glow-* stops).
   Soft, luminous, low-chroma — quiet luxury. */
const PALETTE = {
  surface: "#f7f3ec", // luminous platinum near-white
  nude: "#ecdcc8", // warm nude
  rose: "#f0dcd0", // soft champagne/rose
  teal: "#bfe2e0", // single teal whisper
  attenuation: "#e7d3bd", // warm-nude interior absorption (reads as skin)
};

/* ---- Orthographic full-bleed caustic skin-glow backdrop ---- */
function GlowBackdrop({
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
      u_surface: { value: new THREE.Color(PALETTE.surface) },
      u_nude: { value: new THREE.Color(PALETTE.nude) },
      u_rose: { value: new THREE.Color(PALETTE.rose) },
      u_teal: { value: new THREE.Color(PALETTE.teal) },
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
    const k = 1 - Math.pow(0.0016, delta);
    smooth.current.x += (target.x - smooth.current.x) * k;
    smooth.current.y += (target.y - smooth.current.y) * k;
    m.uniforms.u_pointer.value.set(smooth.current.x, smooth.current.y);

    // Smooth mount fade-in (no harsh pop).
    const cur = m.uniforms.u_intensity.value as number;
    m.uniforms.u_intensity.value = cur + (1 - cur) * Math.min(1, delta * 1.1);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={glowVertexShader}
        fragmentShader={glowFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* ---- The smooth refractive "skin-glow" lens ----
   A soft rounded surface (icosahedron read as a smooth dome) of transmissive
   glass; light passes through and is perfected. Warm-nude attenuation makes
   the refraction read as luminous skin rather than cold glass. */
function GlowLens({
  pointer,
  lite,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  lite: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const target = pointer.current ?? { x: 0, y: 0 };

    // Barely-there continuous turn — quiet, not spinning.
    g.rotation.y += delta * 0.05;

    // Eased cursor tilt — subtle, frame-rate independent.
    const k = 1 - Math.pow(0.0025, delta);
    const tiltX = target.y * 0.18 + Math.sin(t * 0.3) * 0.03;
    const tiltZ = -target.x * 0.16;
    g.rotation.x += (tiltX - g.rotation.x) * k;
    g.rotation.z += (tiltZ - g.rotation.z) * k;

    // Slow breathe — alive, almost imperceptible.
    const breathe = 1 + Math.sin(t * 0.5) * 0.012;
    g.scale.setScalar(breathe);
  });

  return (
    <Float speed={0.8} rotationIntensity={0.12} floatIntensity={0.4}>
      <group ref={group}>
        <mesh>
          {/* High-subdivision icosahedron → a smooth glossy dome surface. */}
          <icosahedronGeometry args={[1.5, 6]} />
          <MeshTransmissionMaterial
            samples={lite ? 6 : 10}
            resolution={lite ? 256 : 512}
            thickness={1.1}
            roughness={0.16}
            ior={1.32}
            chromaticAberration={0.42}
            anisotropy={0.18}
            distortion={0.12}
            distortionScale={0.35}
            temporalDistortion={0.04}
            clearcoat={1}
            clearcoatRoughness={0.12}
            color="#ffffff"
            attenuationColor={PALETTE.attenuation}
            attenuationDistance={2.6}
            background={new THREE.Color(PALETTE.surface)}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* Soft emissive studio lights feeding Bloom + reflecting on the lens. */
function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <Environment resolution={256} frames={1}>
        {/* Warm nude key from upper-left (the "skin" light). */}
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#fbeedd"
          position={[-3.4, 3.2, 2]}
          rotation={[-Math.PI / 5, 0, 0]}
          scale={[6, 9, 1]}
        />
        {/* Cool platinum fill from the right. */}
        <Lightformer
          form="rect"
          intensity={1.8}
          color="#eef3f5"
          position={[4, 1.4, 1]}
          rotation={[0, -Math.PI / 2.4, 0]}
          scale={[6, 6, 1]}
        />
        {/* Single soft teal rim from behind — the brand's one note. */}
        <Lightformer
          form="circle"
          intensity={1.4}
          color="#cdeae8"
          position={[0, -2.4, -4]}
          scale={[7, 7, 1]}
        />
      </Environment>
      <directionalLight position={[-4, 5, 3]} intensity={0.7} color="#fff6ec" />
    </>
  );
}

export interface SkinGlowSceneProps {
  /** Lower transmission resolution + lighter Bloom on smaller / high-DPI tiers. */
  lite?: boolean;
}

export default function SkinGlowScene({ lite = false }: SkinGlowSceneProps) {
  const pointer = useRef({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  // Pause both render loops when the hero scrolls offscreen (perf + battery).
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px" },
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
  };

  const frameloop = visible ? "always" : "never";

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      {/* Orthographic full-bleed caustic skin-glow backdrop */}
      <Canvas
        orthographic
        frameloop={frameloop}
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <GlowBackdrop pointer={pointer} />
      </Canvas>

      {/* Perspective refractive lens layer (transparent canvas over the glow) */}
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 5.4], fov: 38 }}
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
        <GlowLens pointer={pointer} lite={lite} />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.45 : 0.7}
            luminanceThreshold={0.75}
            luminanceSmoothing={0.25}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
