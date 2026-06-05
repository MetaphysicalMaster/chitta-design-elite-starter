"use client";

/**
 * CausticsScene — the WebGL power element ("Liquid-Gold Caustics").
 *
 * Two layered canvases compose a precious-gem light study:
 *  1. An orthographic full-bleed backdrop renders slow refractive champagne-gold
 *     caustics rippling over a deep emerald drawing-room void (custom shader) —
 *     light moving through a jewel, settling on marble. It "settles" (brightens)
 *     as the hero loads via a reveal uniform.
 *  2. A perspective layer holds a slowly rotating faceted EMERALD JEWEL — a
 *     drei MeshTransmissionMaterial dodecahedron tinted with an emerald
 *     attenuation + gold-leaning chromatic dispersion, lit by emissive
 *     Lightformers (champagne key, emerald fill, gold rim). The gem tilts toward
 *     the cursor and breathes. Postprocessing Bloom adds the opulent glow.
 *
 * Distinct from siblings: The Luxe is a molten liquid-GOLD membrane; Encore is
 * a clear white crystal in god-rays. Sousan is a refractive EMERALD jewel over
 * GOLD CAUSTICS — jewel light, not molten metal, not a clinical prism.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from CausticsHero (a "use client"
 * module) — WebGL/R3F is not SSR-safe. A static CSS caustics gradient is shown
 * for SSR, mobile, no-WebGL and prefers-reduced-motion (the hero).
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
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { causticFragmentShader, causticVertexShader } from "./caustics-shaders";

/* Brand palette as THREE colors (kept in JS to mirror brand.css). */
const PALETTE = {
  void0: "#0c2a22", // deep emerald shadow
  void1: "#14463a", // raised emerald
  gold: "#f0dca0", // champagne caustic
  jewel: "#3fae84", // emerald jewel highlight
  attenuation: "#2f8f6e", // emerald interior absorption of the gem
};

/* ---- Caustic-light backdrop (orthographic, full-bleed) ---- */
function CausticBackdrop({
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
      u_gold: { value: new THREE.Color(PALETTE.gold) },
      u_jewel: { value: new THREE.Color(PALETTE.jewel) },
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

    // Ease the reveal up once — the gem "settles" as the hero loads.
    const cur = m.uniforms.u_intensity.value as number;
    m.uniforms.u_intensity.value = cur + (1 - cur) * Math.min(1, delta * 0.9);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={causticVertexShader}
        fragmentShader={causticFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---- The refractive emerald jewel ---- */
function Jewel({
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

    // Slow continuous rotation — the gem turning in the light.
    g.rotation.y += delta * 0.16;

    // Cursor tilt — eased, subtle, frame-rate independent.
    const k = 1 - Math.pow(0.0026, delta);
    const tiltX = target.y * 0.3 + Math.sin(t * 0.4) * 0.05; // breathe
    const tiltZ = -target.x * 0.26;
    g.rotation.x += (tiltX - g.rotation.x) * k;
    g.rotation.z += (tiltZ - g.rotation.z) * k;

    // Breathing scale — barely perceptible, alive.
    const breathe = 1 + Math.sin(t * 0.5) * 0.016;
    g.scale.setScalar(breathe);
  });

  return (
    <Float speed={0.9} rotationIntensity={0.16} floatIntensity={0.45}>
      <group ref={group}>
        <mesh castShadow>
          {/* A dodecahedron reads as a many-faceted cut jewel. */}
          <dodecahedronGeometry args={[1.15, 0]} />
          <MeshTransmissionMaterial
            samples={lite ? 6 : 10}
            resolution={lite ? 256 : 512}
            thickness={1.7}
            roughness={0.02}
            ior={1.62}
            chromaticAberration={0.85}
            anisotropy={0.35}
            distortion={0.18}
            distortionScale={0.45}
            temporalDistortion={0.05}
            clearcoat={1}
            clearcoatRoughness={0.05}
            color="#eafff5"
            attenuationColor={PALETTE.attenuation}
            attenuationDistance={1.4}
            background={new THREE.Color(PALETTE.void0)}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* Emissive light shapes that feed Bloom + reflect/refract in the jewel. */
function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <Environment resolution={256} frames={1}>
        {/* Warm champagne key from upper-left */}
        <Lightformer
          form="rect"
          intensity={3.6}
          color="#f6e8c2"
          position={[-3.4, 3.4, 2]}
          rotation={[-Math.PI / 5, 0, 0]}
          scale={[5, 9, 1]}
        />
        {/* Emerald fill from the right — the brand's jewel undertone */}
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#2f9c76"
          position={[4, 1.2, 1]}
          rotation={[0, -Math.PI / 2.4, 0]}
          scale={[6, 6, 1]}
        />
        {/* Gold rim from behind to define the facets */}
        <Lightformer
          form="ring"
          intensity={2.4}
          color="#f0d79a"
          position={[1.5, 2.4, -3.5]}
          scale={[3.5, 3.5, 1]}
        />
        {/* Deep emerald under-glow */}
        <Lightformer
          form="circle"
          intensity={1.6}
          color="#1d6b53"
          position={[-1.5, -2.8, -3]}
          scale={[7, 7, 1]}
        />
      </Environment>
      {/* Directional key to throw caustic glints across the facets */}
      <directionalLight position={[-4, 5, 3]} intensity={1.1} color="#fff4d8" />
    </>
  );
}

export interface CausticsSceneProps {
  /** Drop samples/resolution + sparkles on smaller tiers. */
  lite?: boolean;
}

export default function CausticsScene({ lite = false }: CausticsSceneProps) {
  const pointer = useRef({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  // Pause BOTH render loops when the hero scrolls offscreen or the tab is
  // hidden (perf + battery). Driving frameloop="never" stops the RAF entirely.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    let onscreen = true;
    const sync = () =>
      setVisible(onscreen && document.visibilityState === "visible");

    let io: IntersectionObserver | undefined;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          onscreen = entry.isIntersecting;
          sync();
        },
        { rootMargin: "120px" },
      );
      io.observe(el);
    }
    document.addEventListener("visibilitychange", sync);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", sync);
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
      {/* Orthographic full-bleed gold caustics over emerald void */}
      <Canvas
        orthographic
        frameloop={frameloop}
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <CausticBackdrop pointer={pointer} />
      </Canvas>

      {/* Perspective jewel layer (transparent canvas over the caustics) */}
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 5], fov: 38 }}
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
        <Jewel pointer={pointer} lite={lite} />
        {!lite && (
          <Sparkles
            count={26}
            scale={[6, 5, 3]}
            size={2.2}
            speed={0.26}
            opacity={0.45}
            color="#f2e3b8"
          />
        )}
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.85 : 1.25}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.2}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
          <Vignette eskil={false} offset={0.3} darkness={0.78} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
