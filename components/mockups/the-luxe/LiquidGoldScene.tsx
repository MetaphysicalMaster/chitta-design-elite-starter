"use client";

/**
 * LiquidGoldScene — the WebGL power element ("Liquid Gold").
 *
 * A single flowing molten-metal membrane: a high-poly icosphere displaced by
 * layered simplex noise so it ripples and breathes like a pool of liquid gold.
 * The surface is a physically-based METALLIC material (metalness 1, low
 * roughness) lit by emissive drei Lightformers inside an Environment, so it
 * mirrors warm champagne key light and a deep emerald fill — real reflections,
 * not a flat gradient. A custom onBeforeCompile injection tints peaks/valleys
 * with a molten gold ramp + champagne fresnel rim, and the membrane swells
 * toward the cursor. Postprocessing Bloom adds the luxe glow.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from LiquidGoldHero (a client
 * component) — WebGL/R3F is not SSR-safe. A static CSS liquid-gold gradient is
 * shown for SSR, mobile, no-WebGL and prefers-reduced-motion (the hero).
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  simplexNoise3D,
  vertexHead,
  normalBody,
  positionBody,
  fragmentHead,
  fragmentBody,
} from "./liquid-gold-shaders";

/* Brand gold stops as THREE colors (mirror brand.css molten ramp). */
const GOLD = {
  deep: new THREE.Color("#7a5a1e"), // burnished bronze-gold
  mid: new THREE.Color("#d9a84e"), // molten core
  bright: new THREE.Color("#f6e4b0"), // champagne highlight
};

interface Pointer {
  x: number;
  y: number;
  active: number;
}

function GoldMembrane({
  pointer,
  lite,
}: {
  pointer: React.RefObject<Pointer>;
  lite: boolean;
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useRef({
    uTime: { value: 0 },
    uAmp: { value: 0 },
    uPointer: { value: new THREE.Vector3(0, 0, 1) },
    uPointerStr: { value: 0 },
    uGoldDeep: { value: GOLD.deep },
    uGoldMid: { value: GOLD.mid },
    uGoldBright: { value: GOLD.bright },
  });
  const smooth = useRef({ x: 0, y: 0, s: 0 });

  // Inject the displacement + molten tint into a PBR metallic material so we
  // keep real environment reflections but gain organic flow.
  const onBeforeCompile = useMemo(() => {
    return (shader: THREE.WebGLProgramParametersWithUniforms) => {
      Object.assign(shader.uniforms, uniforms.current);

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>\n${simplexNoise3D}\n${vertexHead}`,
        )
        .replace(
          "#include <beginnormal_vertex>",
          `#include <beginnormal_vertex>\n${normalBody}`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>\n${positionBody}`,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>\n${fragmentHead}`,
        )
        .replace(
          "#include <dithering_fragment>",
          `${fragmentBody}\n#include <dithering_fragment>`,
        );
    };
  }, []);

  const geomDetail = lite ? 24 : 48;

  useFrame(({ clock }, delta) => {
    const u = uniforms.current;
    const dt = Math.min(delta, 1 / 30);
    u.uTime.value = clock.getElapsedTime();

    // Ease amplitude up once (no first-frame pop).
    u.uAmp.value += (0.4 - u.uAmp.value) * Math.min(1, dt * 0.9);

    // Smooth the cursor (frame-rate independent).
    const target = pointer.current ?? { x: 0, y: 0, active: 0 };
    const k = 1 - Math.pow(0.0018, dt);
    smooth.current.x += (target.x - smooth.current.x) * k;
    smooth.current.y += (target.y - smooth.current.y) * k;
    smooth.current.s += (target.active - smooth.current.s) * Math.min(1, dt * 2.6);

    // Map screen pointer to a point on the unit sphere facing the camera.
    const px = smooth.current.x;
    const py = smooth.current.y;
    const pz = Math.sqrt(Math.max(0.02, 1 - px * px - py * py));
    u.uPointer.value.set(px, py, pz);
    u.uPointerStr.value = smooth.current.s;

    // Slow auto-rotation so the molten surface always turns in the light.
    const m = meshRef.current;
    if (m) {
      m.rotation.y += dt * 0.12;
      m.rotation.x = Math.sin(clock.getElapsedTime() * 0.18) * 0.12;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.12} floatIntensity={0.4}>
      <mesh ref={meshRef} scale={1.55}>
        <icosahedronGeometry args={[1, geomDetail]} />
        <meshStandardMaterial
          ref={matRef}
          metalness={1}
          roughness={0.16}
          envMapIntensity={1.5}
          color="#caa45a"
          onBeforeCompile={onBeforeCompile}
        />
      </mesh>
    </Float>
  );
}

/* Reflective studio environment — what the gold actually mirrors. */
function GoldEnvironment({ lite }: { lite: boolean }) {
  return (
    <Environment resolution={lite ? 128 : 256} frames={1}>
      {/* Warm champagne key from upper-left */}
      <Lightformer
        form="rect"
        intensity={4}
        color="#fff0cf"
        position={[-3.5, 3.6, 2.2]}
        rotation={[-Math.PI / 5, 0, 0]}
        scale={[6, 10, 1]}
      />
      {/* Molten gold sweep from the right */}
      <Lightformer
        form="rect"
        intensity={3}
        color="#f2c46a"
        position={[4, 0.5, 1.5]}
        rotation={[0, -Math.PI / 2.3, 0]}
        scale={[7, 7, 1]}
      />
      {/* Deep emerald fill from below-left for jewel undertone */}
      <Lightformer
        form="circle"
        intensity={1.4}
        color="#1f6b54"
        position={[-2.5, -3, -3]}
        scale={[8, 8, 1]}
      />
      {/* Soft white rim from behind to define the silhouette */}
      <Lightformer
        form="ring"
        intensity={2.2}
        color="#ffffff"
        position={[1.5, 2.2, -4]}
        scale={[4, 4, 1]}
      />
      {/* Bronze under-glow */}
      <Lightformer
        form="circle"
        intensity={1.8}
        color="#caa45a"
        position={[0, -2.4, 2.5]}
        scale={[5, 5, 1]}
      />
    </Environment>
  );
}

export interface LiquidGoldSceneProps {
  /** Drop geometry detail + env resolution + one composer pass on small tiers. */
  lite?: boolean;
}

export default function LiquidGoldScene({ lite = false }: LiquidGoldSceneProps) {
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: 0 });

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
        camera={{ position: [0, 0, 4.6], fov: 40 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[-4, 5, 3]} intensity={1.1} color="#fff4d8" />
        <GoldEnvironment lite={lite} />
        <GoldMembrane pointer={pointer} lite={lite} />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.7 : 1.05}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.2}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
          <Vignette eskil={false} offset={0.3} darkness={0.72} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
