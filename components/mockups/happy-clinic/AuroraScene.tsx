"use client";

/**
 * AuroraScene — the WebGL power element: a volumetric aurora (violet→teal)
 * drifting over a faint Rockies ridge silhouette. "Northern-lights" altitude
 * optimism for Colorado's #1 clinic.
 *
 * Two layers:
 *  1. An orthographic full-bleed shader backdrop — night sky, domain-warped
 *     aurora curtains, and a noise-driven mountain ridge horizon. Parallaxes
 *     with hero scroll progress and sways toward the cursor.
 *  2. An additive field of drifting aurora "motes" (instanced soft points) that
 *     rise like cold sparks, adding volumetric depth above the ridge.
 *  Finished with subtle Bloom so the aurora blooms premium.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from AuroraHero (a client component) —
 * WebGL/R3F is not SSR-safe. A static CSS aurora gradient covers SSR, mobile,
 * reduced-motion and no-WebGL (AuroraHero).
 *
 * Perf: dpr={[1,2]}, instancing + additive (no per-mote draw calls), frameloop
 * pauses when the hero is offscreen or the tab is hidden.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { auroraFragmentShader, auroraVertexShader } from "./aurora-shaders";

const PALETTE = {
  night0: "#1a1530", // top of sky (deep indigo-violet)
  night1: "#241a3a", // horizon sky
  violet: "#9a6bff",
  magenta: "#d36bd0",
  teal: "#5fe0cf",
  cyan: "#7fe6ff",
  ridge: "#2a2342",
};

/* Shared reactive drive: pointer (-1..1) + hero scroll progress (0..1). */
type Drive = {
  pointer: { x: number; y: number };
  scroll: number;
};

/* ---- Orthographic full-bleed aurora backdrop ---- */
function AuroraBackdrop({ drive }: { drive: React.RefObject<Drive> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const smooth = useRef({ x: 0, y: 0, scroll: 0 });

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_pointer: { value: new THREE.Vector2(0, 0) },
      u_scroll: { value: 0 },
      u_intensity: { value: 0 },
      u_night0: { value: new THREE.Color(PALETTE.night0) },
      u_night1: { value: new THREE.Color(PALETTE.night1) },
      u_violet: { value: new THREE.Color(PALETTE.violet) },
      u_magenta: { value: new THREE.Color(PALETTE.magenta) },
      u_teal: { value: new THREE.Color(PALETTE.teal) },
      u_cyan: { value: new THREE.Color(PALETTE.cyan) },
      u_ridge: { value: new THREE.Color(PALETTE.ridge) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(({ clock }, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.u_time.value = clock.getElapsedTime();
    m.uniforms.u_resolution.value.set(size.width, size.height);

    const d = drive.current ?? { pointer: { x: 0, y: 0 }, scroll: 0 };
    const k = 1 - Math.pow(0.0016, delta);
    smooth.current.x += (d.pointer.x - smooth.current.x) * k;
    smooth.current.y += (d.pointer.y - smooth.current.y) * k;
    smooth.current.scroll += (d.scroll - smooth.current.scroll) * k;
    m.uniforms.u_pointer.value.set(smooth.current.x, smooth.current.y);
    m.uniforms.u_scroll.value = smooth.current.scroll;

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

/* ---- Instanced additive aurora motes (rising cold sparks) ---- */
const COUNT_FULL = 150;
const COUNT_LITE = 80;

function AuroraMotes({
  drive,
  count,
}: {
  drive: React.RefObject<Drive>;
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

  const color = useMemo(() => new THREE.Color(), []);
  const cViolet = useMemo(() => new THREE.Color(PALETTE.violet), []);
  const cCyan = useMemo(() => new THREE.Color(PALETTE.cyan), []);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const d = drive.current ?? { pointer: { x: 0, y: 0 }, scroll: 0 };
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
      // fade with scroll (recede as hero scrolls away)
      const fade = 1 - d.scroll * 0.6;

      dummy.position.set(sx, s.y, s.z);
      const sc = s.size * (0.8 + 0.2 * Math.sin(t + s.sway));
      dummy.scale.set(sc, sc, sc);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      color.copy(cViolet).lerp(cCyan, s.hue);
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

export interface AuroraSceneProps {
  /** Fewer motes + lighter bloom on smaller / high-DPI tiers. */
  lite?: boolean;
}

export default function AuroraScene({ lite = false }: AuroraSceneProps) {
  const drive = useRef<Drive>({ pointer: { x: 0, y: 0 }, scroll: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Hero scroll progress → drive.scroll (parallax). Tab/offscreen pause.
  useEffect(() => {
    const el = wrapRef.current;

    const onScroll = () => {
      // 0 at hero top, ~1 once the hero height has scrolled past.
      const h = Math.max(window.innerHeight, 1);
      drive.current.scroll = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
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
        <AuroraBackdrop drive={drive} />
        <AuroraMotes drive={drive} count={count} />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.7 : 1.05}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.32}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
