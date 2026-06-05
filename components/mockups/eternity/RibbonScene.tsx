"use client";

/**
 * RibbonScene — the WebGL power element ("eternity ribbon").
 *
 * A single metallic CHROME ribbon swept as a tube along a lemniscate
 * (figure-eight / infinity) curve, endlessly turning — a Möbius/infinity flow
 * with no beginning and no end. The surface is a physically-based near-mirror
 * MeshPhysicalMaterial (metalness 1, very low roughness, a touch of transmission
 * for liquid-glass depth) lit by emissive drei Lightformers inside an
 * Environment, so it MIRRORS cool silver key light and an amethyst fill — real
 * reflections, not a flat gradient. A custom onBeforeCompile injection adds a
 * chrome-sheen highlight that travels ALONG the ribbon (the "results that last"
 * endless glint) plus a cool amethyst fresnel rim. The cursor subtly rotates the
 * whole loop. Postprocessing Bloom adds the soft mirror halo.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from RibbonHero (a client component) —
 * WebGL/R3F is not SSR-safe. A static on-brand chrome infinity-loop SVG over a
 * CSS field is shown for SSR, mobile, no-WebGL, save-data and reduced-motion
 * (handled by RibbonHero).
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { vertexHead, vertexBody, fragmentHead, fragmentBody } from "./ribbon-shaders";

/* Brand ribbon stops as THREE colors (mirror brand.css --ribbon-* stops). */
const COLORS = {
  crest: new THREE.Color("#f3f1f6"), // mirror silver highlight
  amethyst: new THREE.Color("#9a7bd6"), // cool jewel rim
  shadow: new THREE.Color("#3a2f4d"), // plum shadow trough
};

interface Pointer {
  x: number;
  y: number;
  active: number;
}

/**
 * LemniscateCurve — a figure-eight (∞) space curve. The classic lemniscate of
 * Gerono lifted into 3D with a gentle out-of-plane lobe so the two loops cross
 * in depth, reading as one continuous endless ribbon rather than a flat 8.
 */
class LemniscateCurve extends THREE.Curve<THREE.Vector3> {
  scale: number;
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const a = t * Math.PI * 2;
    const x = Math.sin(a);
    const y = Math.sin(a) * Math.cos(a);
    // Depth lobe: push the two crossings apart in z so the loops braid.
    const z = Math.cos(a) * 0.55;
    return target.set(x * 1.35, y * 1.6, z).multiplyScalar(this.scale);
  }
}

function EternityRibbon({
  pointer,
  lite,
  flowRef,
}: {
  pointer: React.RefObject<Pointer>;
  lite: boolean;
  flowRef: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const uniforms = useRef({
    uTime: { value: 0 },
    uFlow: { value: 1 },
    uCrest: { value: COLORS.crest },
    uAmethyst: { value: COLORS.amethyst },
    uShadow: { value: COLORS.shadow },
  });
  const smooth = useRef({ x: 0, y: 0, s: 0 });
  const flowSmooth = useRef(1);

  // Build the tube once. Higher tubular + radial segments on capable tiers for
  // a smooth mirror; a half-twist is implied by the path braid + tube normals.
  const geometry = useMemo(() => {
    const path = new LemniscateCurve(1);
    const tubularSegments = lite ? 220 : 420;
    const radialSegments = lite ? 18 : 32;
    const radius = 0.14;
    return new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, true);
  }, [lite]);

  // Inject the chrome-sheen + amethyst-rim chunks into the PBR material so we
  // keep real environment reflections but gain the endless travelling glint.
  const onBeforeCompile = useMemo(() => {
    return (shader: THREE.WebGLProgramParametersWithUniforms) => {
      Object.assign(shader.uniforms, uniforms.current);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\n${vertexHead}`)
        .replace("#include <begin_vertex>", `#include <begin_vertex>\n${vertexBody}`);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>\n${fragmentHead}`)
        .replace(
          "#include <dithering_fragment>",
          `${fragmentBody}\n#include <dithering_fragment>`,
        );
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 1 / 30);
    uniforms.current.uTime.value = clock.getElapsedTime();

    // Scroll-ease: smooth the flow toward its target (calms as hero leaves).
    const flowTarget = flowRef.current ?? 1;
    flowSmooth.current += (flowTarget - flowSmooth.current) * Math.min(1, dt * 2);
    uniforms.current.uFlow.value = flowSmooth.current;

    // Smooth the cursor (frame-rate independent) for a gentle parallax rotate.
    const target = pointer.current ?? { x: 0, y: 0, active: 0 };
    const k = 1 - Math.pow(0.0022, dt);
    smooth.current.x += (target.x - smooth.current.x) * k;
    smooth.current.y += (target.y - smooth.current.y) * k;
    smooth.current.s += (target.active - smooth.current.s) * Math.min(1, dt * 2.6);

    // Slow endless turn of the whole loop + a subtle cursor-driven tilt.
    const m = meshRef.current;
    if (m) {
      const flow = flowSmooth.current;
      m.rotation.y += dt * 0.16 * (0.4 + 0.6 * flow);
      m.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.08;
      m.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.13) * 0.07 +
        smooth.current.y * 0.5 * smooth.current.s;
      m.rotation.y += smooth.current.x * 0.012 * smooth.current.s;
    }
  });

  return (
    <Float speed={0.7} rotationIntensity={0.1} floatIntensity={0.4}>
      <mesh ref={meshRef} geometry={geometry} scale={1.55}>
        <meshPhysicalMaterial
          ref={matRef}
          metalness={1}
          roughness={0.08}
          envMapIntensity={1.7}
          clearcoat={1}
          clearcoatRoughness={0.12}
          transmission={lite ? 0 : 0.12}
          thickness={0.6}
          ior={1.4}
          color="#cfcad8"
          onBeforeCompile={onBeforeCompile}
        />
      </mesh>
    </Float>
  );
}

/* Reflective studio environment — what the chrome ribbon actually mirrors:
   cool silver key, amethyst fill, white rim, deep plum under-glow. */
function RibbonEnvironment({ lite }: { lite: boolean }) {
  return (
    <Environment resolution={lite ? 128 : 256} frames={1}>
      {/* Cool silver key from upper-left */}
      <Lightformer
        form="rect"
        intensity={4}
        color="#eef0f6"
        position={[-3.5, 3.6, 2.2]}
        rotation={[-Math.PI / 5, 0, 0]}
        scale={[7, 10, 1]}
      />
      {/* Amethyst sweep from the right for the jewel undertone */}
      <Lightformer
        form="rect"
        intensity={2.6}
        color="#9a7bd6"
        position={[4, 0.5, 1.5]}
        rotation={[0, -Math.PI / 2.3, 0]}
        scale={[7, 7, 1]}
      />
      {/* Deep violet fill from below-left */}
      <Lightformer
        form="circle"
        intensity={1.3}
        color="#5b3f8a"
        position={[-2.5, -3, -3]}
        scale={[8, 8, 1]}
      />
      {/* Crisp white rim from behind to define the chrome silhouette */}
      <Lightformer
        form="ring"
        intensity={2.6}
        color="#ffffff"
        position={[1.5, 2.4, -4]}
        scale={[4, 4, 1]}
      />
      {/* Cool platinum under-glow */}
      <Lightformer
        form="circle"
        intensity={1.6}
        color="#b9bcc8"
        position={[0, -2.4, 2.5]}
        scale={[5, 5, 1]}
      />
    </Environment>
  );
}

export interface RibbonSceneProps {
  /** Drop geometry detail + env resolution + one composer pass on small tiers. */
  lite?: boolean;
  /**
   * Live scroll-ease 0..1 (1 = full flow in view, lower as the hero scrolls
   * away). Passed as a ref so updating it never re-renders the Canvas tree.
   */
  flowRef?: React.RefObject<number>;
}

export default function RibbonScene({ lite = false, flowRef: external }: RibbonSceneProps) {
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: 0 });
  const internalFlow = useRef(1);
  const flowRef = external ?? internalFlow;

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
        camera={{ position: [0, 0, 4.8], fov: 40 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[-4, 5, 3]} intensity={1.1} color="#eef0f8" />
        <RibbonEnvironment lite={lite} />
        <EternityRibbon pointer={pointer} lite={lite} flowRef={flowRef} />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.7 : 1.0}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.2}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
          <Vignette eskil={false} offset={0.3} darkness={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
