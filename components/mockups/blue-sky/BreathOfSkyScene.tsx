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
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { skyFragmentShader, skyVertexShader } from "./sky-shaders";

/* Brand sky palette as THREE colors (kept in JS so it matches brand.css).
   Hex tuned to the refined OKLch stops: warm champagne dawn, clear daylight
   blue, luminous azure, soft horizon ink, faint warm rose. */
const PALETTE = {
  dawn: "#f6e0bd", // champagne-gold dawn
  mid: "#bfd8f1", // soft clear daylight blue
  high: "#84b3ea", // luminous azure
  deep: "#5076b4", // soft horizon ink-blue
  blush: "#f7d6d4", // faint warm rose
};

function SkyPlane({
  pointer,
  rise,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  rise: React.RefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  // Smoothed pointer so parallax glides rather than snaps.
  const smooth = useRef({ x: 0, y: 0 });
  // Smoothed sun-rise so the day-arc glides even when scroll jumps.
  const smoothRise = useRef(0);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_pointer: { value: new THREE.Vector2(0, 0) },
      u_intensity: { value: 0 },
      u_rise: { value: 0 },
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

    // Glide the sun-rise toward the scroll-scrubbed target.
    const rTarget = rise.current ?? 0;
    const rk = 1 - Math.pow(0.004, delta);
    smoothRise.current += (rTarget - smoothRise.current) * rk;
    m.uniforms.u_rise.value = smoothRise.current;

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

/* Luminous dewy "light-bead" accent on a transparent layer. A real refractive
   transmission orb needs a scene BEHIND it to sample — on an alpha canvas it
   samples nothing and renders as a dark disc, fighting the rising-sun signature.
   So this is an additive, soft-edged glow sphere (basic material + additive
   blend) that reads as a tasteful floating bead of light, never an eclipse. It
   drifts with the pointer and lifts gently with the day-arc. */
function LightBead({
  pointer,
  rise,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  rise: React.RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  // soft radial-falloff sprite texture (built once, GPU-cheap)
  const tex = useMemo(() => {
    const s = 128;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,253,247,0.95)");
    g.addColorStop(0.35, "rgba(238,245,255,0.55)");
    g.addColorStop(0.7, "rgba(210,228,248,0.16)");
    g.addColorStop(1, "rgba(210,228,248,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const t = new THREE.CanvasTexture(c);
    return t;
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const target = pointer.current ?? { x: 0, y: 0 };
    const r = rise.current ?? 0;
    const k = 1 - Math.pow(0.0015, delta);
    g.position.x += (target.x * 0.5 - g.position.x) * k;
    // a low-right luxe accent that lifts gently with the day-arc
    const baseY = -0.25 + r * 0.45;
    g.position.y += (baseY + target.y * 0.3 - g.position.y) * k;
  });

  return (
    <group ref={group} position={[1.25, -0.25, 1.0]}>
      <Float speed={1.0} rotationIntensity={0} floatIntensity={0.5}>
        <sprite scale={[1.1, 1.1, 1]}>
          <spriteMaterial
            map={tex}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.85}
          />
        </sprite>
      </Float>
    </group>
  );
}

export interface BreathOfSkySceneProps {
  /** When false, the light-bead accent is skipped (perf tier for small screens). */
  showOrb?: boolean;
  /** Scroll-scrubbed day-arc, 0 (dawn) → 1 (high clear day). Owned by SkyHero. */
  rise?: React.RefObject<number>;
}

export default function BreathOfSkyScene({ showOrb = true, rise }: BreathOfSkySceneProps) {
  // Shared pointer ref; updated by a DOM listener for low overhead.
  const pointer = useRef({ x: 0, y: 0 });
  // Local fallback if the parent doesn't supply a rise ref.
  const localRise = useRef(0);
  const riseRef = rise ?? localRise;
  const wrapRef = useRef<HTMLDivElement>(null);
  // Pause the render loop entirely when the hero scrolls offscreen (battery/GPU).
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
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
      {/* Orthographic full-bleed sky */}
      <Canvas
        orthographic
        frameloop={frameloop}
        camera={{ zoom: 1, position: [0, 0, 1] }}
        // Cap DPR at 1.5 (never 2): the perf-vs-sharpness sweet spot on retina.
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SkyPlane pointer={pointer} rise={riseRef} />
      </Canvas>

      {/* Luminous light-bead accent layer (transparent canvas over the sky) */}
      {showOrb && (
        <Canvas
          frameloop={frameloop}
          camera={{ position: [0, 0, 4], fov: 42 }}
          // Cap DPR at 1.5 (never 2): the perf-vs-sharpness sweet spot on retina.
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <LightBead pointer={pointer} rise={riseRef} />
        </Canvas>
      )}
    </div>
  );
}
