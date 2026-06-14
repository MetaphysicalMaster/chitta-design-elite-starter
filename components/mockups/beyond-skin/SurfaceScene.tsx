"use client";

/**
 * SurfaceScene — the WebGL signature: the "Journey to Wellness" silk light-field.
 *
 * A single full-bleed plane runs a lit silk shader (mauve/plum folds catching a
 * rose/blush sheen) with a left→right "current" reading as the guided journey.
 * The pointer lifts a soft bloom of light; page scroll deepens the field toward
 * the plum core. One quad, all motion in the fragment shader → 60fps.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from SurfaceHero (a client component) —
 * WebGL/R3F is not SSR-safe. The static CSS silk gradient covers SSR / mobile /
 * no-WebGL / prefers-reduced-motion. Pauses when scrolled out of view + on tab
 * hide so it never burns the GPU off-screen.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { surfaceFragmentShader, surfaceVertexShader } from "./surface-shaders";

/* Brand palette as THREE colors (mirrors brand.css journey stops). */
const PALETTE = {
  plumDeep: "#2a1430", // --plum-deep-ish near-violet void
  plum: "#5a3158", // deep plum core
  mauve: "#a06b94", // dusty mauve
  rose: "#c99aa0", // warm petal-rose
  blush: "#e8c9cf", // pale blush sheen
};

function SilkPlane({
  pointer,
  scroll,
  active,
}: {
  pointer: React.RefObject<{ x: number; y: number; s: number }>;
  scroll: React.RefObject<number>;
  active: React.RefObject<boolean>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const introRef = useRef(0);
  const smooth = useRef({ x: 0.5, y: 0.5, s: 0 });
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerStr: { value: 0 },
      uIntro: { value: 0 },
      uScroll: { value: 0 },
      uPlumDeep: { value: new THREE.Color(PALETTE.plumDeep) },
      uPlum: { value: new THREE.Color(PALETTE.plum) },
      uMauve: { value: new THREE.Color(PALETTE.mauve) },
      uRose: { value: new THREE.Color(PALETTE.rose) },
      uBlush: { value: new THREE.Color(PALETTE.blush) },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const m = matRef.current;
    if (!m) return;
    // Pause the animation clock when off-screen / tab hidden — hold the frame.
    if (active.current === false) return;
    const dt = Math.min(delta, 1 / 30);

    m.uniforms.uTime.value = clock.getElapsedTime();
    m.uniforms.uRes.value.set(size.width, size.height);

    introRef.current += (1 - introRef.current) * Math.min(1, dt * 0.7);
    m.uniforms.uIntro.value = introRef.current;

    // Smooth pointer + scroll (frame-rate independent).
    const target = pointer.current ?? { x: 0.5, y: 0.5, s: 0 };
    const k = 1 - Math.pow(0.0025, dt);
    smooth.current.x += (target.x - smooth.current.x) * k;
    smooth.current.y += (target.y - smooth.current.y) * k;
    smooth.current.s += (target.s - smooth.current.s) * Math.min(1, dt * 3);
    m.uniforms.uPointer.value.set(smooth.current.x, smooth.current.y);
    m.uniforms.uPointerStr.value = smooth.current.s;

    const sc = scroll.current ?? 0;
    m.uniforms.uScroll.value += (sc - m.uniforms.uScroll.value) * Math.min(1, dt * 4);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={surfaceVertexShader}
        fragmentShader={surfaceFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export interface SurfaceSceneProps {
  /** Lighter pixel ratio cap on smaller/slower tiers. */
  lite?: boolean;
}

export default function SurfaceScene({ lite = false }: SurfaceSceneProps) {
  const pointer = useRef({ x: 0.5, y: 0.5, s: 0 });
  const scroll = useRef(0);
  const active = useRef(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Tear down the observers/listeners when the scene unmounts.
  useEffect(() => () => cleanupRef.current?.(), []);

  const handlePointer = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    pointer.current.x = (e.clientX - r.left) / r.width;
    pointer.current.y = 1 - (e.clientY - r.top) / r.height;
    pointer.current.s = 1;
  };

  // Pause off-screen + on tab hide; track page scroll progress for uScroll.
  // Cleanup is registered on the GL renderer's dispose via the R3F lifecycle.
  const onCanvasCreated = () => {
    const el = wrapRef.current;
    if (!el) return;
    let onScreen = true;
    const recompute = () => {
      active.current = onScreen && !document.hidden;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        recompute();
      },
      { threshold: 0.01 },
    );
    io.observe(el);
    const onVis = () => recompute();
    const onScroll = () => {
      const max = Math.max(1, window.innerHeight);
      scroll.current = Math.min(1, Math.max(0, window.scrollY / (max * 1.2)));
    };
    onScroll();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanupRef.current = () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
    };
  };

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        pointer.current.s = 0;
      }}
    >
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={lite ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
        onCreated={onCanvasCreated}
      >
        <SilkPlane pointer={pointer} scroll={scroll} active={active} />
      </Canvas>
    </div>
  );
}
