"use client";

/**
 * SlipstreamScene — the WebGL power element ("kinetic motion-streak slipstream").
 *
 * Two layers, both reactive to SCROLL VELOCITY and drifting toward the CURSOR:
 *  1. An orthographic full-bleed shader backdrop (graphite void + diagonal
 *     cobalt speed-lines that elongate + brighten with scroll velocity).
 *  2. An instanced field of additive cobalt light-trail streaks (speed-lines)
 *     that stretch along travel and rush past — a nod to the NASCAR-CEO energy.
 *  Finished with subtle Bloom for a premium glow.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from SlipstreamHero (a client
 * component) — WebGL/R3F is not SSR-safe. A static CSS slipstream gradient is
 * shown for SSR, mobile, reduced-motion and no-WebGL (SlipstreamHero).
 *
 * Perf: dpr={[1,2]}, instancing + additive (no per-streak draw calls),
 * frameloop pauses when the hero is offscreen or the tab is hidden.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  slipstreamFragmentShader,
  slipstreamVertexShader,
} from "./slipstream-shaders";

const PALETTE = {
  graphite0: "#1a2233",
  graphite1: "#222d42",
  streakCore: "#7aa2ff", // hot cobalt core
  streakCool: "#3552d6", // deep signal edge
};

/* Shared reactive drive: pointer (-1..1) + scroll velocity (0..1, eased). */
type Drive = {
  pointer: { x: number; y: number };
  speed: number;
};

/* ---- Orthographic full-bleed speed-line backdrop ---- */
function StreakBackdrop({ drive }: { drive: React.RefObject<Drive> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const smooth = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_pointer: { value: new THREE.Vector2(0, 0) },
      u_speed: { value: 0 },
      u_intensity: { value: 0 },
      u_graphite0: { value: new THREE.Color(PALETTE.graphite0) },
      u_graphite1: { value: new THREE.Color(PALETTE.graphite1) },
      u_streakCore: { value: new THREE.Color(PALETTE.streakCore) },
      u_streakCool: { value: new THREE.Color(PALETTE.streakCool) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(({ clock }, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.u_time.value = clock.getElapsedTime();
    m.uniforms.u_resolution.value.set(size.width, size.height);

    const d = drive.current ?? { pointer: { x: 0, y: 0 }, speed: 0 };
    const k = 1 - Math.pow(0.0016, delta);
    smooth.current.x += (d.pointer.x - smooth.current.x) * k;
    smooth.current.y += (d.pointer.y - smooth.current.y) * k;
    m.uniforms.u_pointer.value.set(smooth.current.x, smooth.current.y);
    m.uniforms.u_speed.value = d.speed;

    const cur = m.uniforms.u_intensity.value as number;
    m.uniforms.u_intensity.value = cur + (1 - cur) * Math.min(1, delta * 1.2);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={slipstreamVertexShader}
        fragmentShader={slipstreamFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* ---- Instanced additive light-trail streaks (the slipstream proper) ---- */
const COUNT_FULL = 220;
const COUNT_LITE = 120;

function StreakField({
  drive,
  count,
}: {
  drive: React.RefObject<Drive>;
  count: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  // Per-streak static attributes (lane Y, depth Z, base speed, length, hue mix).
  const streaks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        y: (Math.random() - 0.5) * 2.4,
        z: (Math.random() - 0.5) * 2.2,
        x: (Math.random() - 0.5) * 7,
        baseSpeed: 0.5 + Math.random() * 1.4,
        len: 0.35 + Math.random() * 1.35,
        thin: 0.012 + Math.random() * 0.02,
        bright: 0.4 + Math.random() * 0.6,
      });
    }
    return arr;
  }, [count]);

  // Additive cobalt material — color set per-instance, glow via bloom.
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const d = drive.current ?? { pointer: { x: 0, y: 0 }, speed: 0 };
    const dt = Math.min(delta, 0.05);
    const spread = Math.max(viewport.width, 6) * 0.62;

    for (let i = 0; i < streaks.length; i++) {
      const s = streaks[i];
      // travel rightward; speed driven by scroll velocity (rush on scroll).
      s.x += dt * s.baseSpeed * (0.6 + d.speed * 6.5);
      if (s.x > spread) s.x = -spread;

      // drift toward cursor lane (lateral + vertical pull, eased).
      const targetY = s.y + d.pointer.y * 0.5;
      const targetZ = s.z + d.pointer.x * 0.4;

      // streak elongates with velocity (motion blur read).
      const stretch = s.len * (0.6 + d.speed * 5.0);
      dummy.position.set(s.x, targetY, targetZ);
      dummy.scale.set(stretch, s.thin, 1);
      dummy.rotation.z = -0.36 + d.pointer.y * 0.05; // rake angle
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // brighter toward the leading edge + with velocity.
      const intensity = s.bright * (0.35 + d.speed * 1.6);
      color.setRGB(
        0.42 * intensity + 0.1,
        0.55 * intensity + 0.12,
        1.0 * intensity + 0.18,
      );
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
      {/* a unit plane stretched into a streak; additive + soft edge */}
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        opacity={0.9}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export interface SlipstreamSceneProps {
  /** Fewer instances + lighter bloom on smaller/high-DPI tiers. */
  lite?: boolean;
}

export default function SlipstreamScene({
  lite = false,
}: SlipstreamSceneProps) {
  const drive = useRef<Drive>({ pointer: { x: 0, y: 0 }, speed: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Scroll velocity → drive.speed (eased decay). Tab/offscreen pause.
  useEffect(() => {
    const el = wrapRef.current;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;

    const decay = () => {
      // ease the speed down each frame for a smooth slipstream tail.
      drive.current.speed *= 0.92;
      if (drive.current.speed < 0.001) drive.current.speed = 0;
      raf = requestAnimationFrame(decay);
    };
    raf = requestAnimationFrame(decay);

    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY);
      const dt = Math.max(now - lastT, 16);
      // px/ms normalized; clamp so a fast flick saturates at ~1.
      const v = Math.min(1, (dy / dt) * 0.5);
      drive.current.speed = Math.max(drive.current.speed, v);
      lastY = window.scrollY;
      lastT = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let io: IntersectionObserver | undefined;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting),
        { rootMargin: "120px" },
      );
      io.observe(el);
    }
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const handlePointer = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    drive.current.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    drive.current.pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const count = lite ? COUNT_LITE : COUNT_FULL;
  const frameloop = visible ? "always" : "never";

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        drive.current.pointer.x = 0;
        drive.current.pointer.y = 0;
      }}
    >
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <StreakBackdrop drive={drive} />
        <StreakField drive={drive} count={count} />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.85 : 1.25}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.3}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
