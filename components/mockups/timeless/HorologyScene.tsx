"use client";

/**
 * HorologyScene — the WebGL power element ("Horology Orrery").
 *
 * A slow-rotating, minimalist concentric-ring orrery: a brass clock-field of
 * fine instanced torus rings that drift at differing rates and catch a warm
 * key light. It evokes *timeless* WITHOUT a literal clock — refined, hypnotic,
 * candlelit. Layers:
 *   1. A warm aubergine studio environment + a single brass key light, so the
 *      polished-metal rings read as aged brass (high metalness, low roughness).
 *   2. A set of concentric rings (instanced where identical) on a gently tilted
 *      plane, each rotating at its own slow rate — an orrery, not a clock.
 *   3. A few fine "tick" marks and a couple of drifting orbiting nodes (planets)
 *      to complete the orrery reading without literalism.
 *   4. A low Bloom so only the brightest brass rim-catches lift — never a light
 *      show. Restraint over spectacle (heirloom-luxury register).
 *
 * Loaded ONLY via dynamic({ ssr:false }) from HorologyHero (a client
 * component) — WebGL/R3F is not SSR-safe. A static CSS brass-aura + concentric
 * rings fallback covers SSR, mobile, reduced-motion and no-WebGL (HorologyHero).
 *
 * Perf: dpr={[1,2]}, frameloop pauses when the hero is offscreen or the tab is
 * hidden. `lite` tier drops the Bloom kernel + ring tessellation.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* Brass palette as THREE colors (kept in JS to match brand.css ring-* stops).
   Warm, candlelit, aged. */
const PALETTE = {
  field: "#241127", // aubergine field clear color
  brass: "#c79a52", // aged brass
  brassDeep: "#9c7536", // deep brass shadow
  brassPale: "#e7c98a", // pale brass highlight
  ember: "#b66a2e", // warm ember rim
};

/* One concentric ring — a thin torus that turns slowly about the orrery axis.
   `speed` and `phase` differ per ring so the field drifts rather than spins as
   a block. A subtle eccentric wobble keeps it organic (orrery, not gears). */
function Ring({
  radius,
  tube,
  speed,
  phase,
  tilt,
  color,
  segments,
}: {
  radius: number;
  tube: number;
  speed: number;
  phase: number;
  tilt: number;
  color: string;
  segments: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    m.rotation.z = phase + t * speed;
    // micro eccentric breathe — almost imperceptible, keeps it alive.
    m.rotation.x = tilt + Math.sin(t * 0.18 + phase) * 0.04;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, phase]}>
      <torusGeometry args={[radius, tube, 10, segments]} />
      <meshStandardMaterial
        color={color}
        metalness={1}
        roughness={0.26}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

/* A small orbiting node ("planet") — a brass bead that traces one ring slowly,
   reinforcing the orrery read without a clock hand. */
function OrbitNode({
  radius,
  speed,
  phase,
  tilt,
  size,
}: {
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  size: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const a = phase + clock.getElapsedTime() * speed;
    m.position.set(
      Math.cos(a) * radius,
      Math.sin(a) * radius * Math.cos(tilt),
      Math.sin(a) * radius * Math.sin(tilt),
    );
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 20, 20]} />
      <meshStandardMaterial
        color={PALETTE.brassPale}
        metalness={1}
        roughness={0.2}
        emissive={PALETTE.ember}
        emissiveIntensity={0.35}
        envMapIntensity={1.6}
      />
    </mesh>
  );
}

/* The full orrery group — gentle global tilt + a barely-there parallax toward
   the cursor, frame-rate independent. */
function Orrery({
  pointer,
  lite,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  lite: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  // Ring set — fine, concentric, differing slow drift rates. Tube scales down
  // with radius so the field reads as delicate brass wire, not pipes.
  const rings = useMemo(() => {
    const base = [
      { radius: 0.9, speed: 0.06, phase: 0.0, color: PALETTE.brassPale },
      { radius: 1.35, speed: -0.045, phase: 1.1, color: PALETTE.brass },
      { radius: 1.85, speed: 0.034, phase: 2.3, color: PALETTE.brass },
      { radius: 2.4, speed: -0.026, phase: 0.6, color: PALETTE.brassDeep },
      { radius: 3.0, speed: 0.02, phase: 3.0, color: PALETTE.brass },
      { radius: 3.65, speed: -0.015, phase: 1.7, color: PALETTE.brassDeep },
    ];
    return base.map((r, i) => ({
      ...r,
      tube: 0.015 + (5 - i) * 0.004,
      tilt: 0.16 + i * 0.012,
      segments: lite ? 96 : 168,
    }));
  }, [lite]);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const target = pointer.current ?? { x: 0, y: 0 };

    // Eased cursor parallax — subtle tilt of the whole field.
    const k = 1 - Math.pow(0.002, delta);
    const tiltX = -0.22 + target.y * 0.12 + Math.sin(t * 0.12) * 0.02;
    const tiltY = target.x * 0.16 + Math.cos(t * 0.1) * 0.02;
    g.rotation.x += (tiltX - g.rotation.x) * k;
    g.rotation.y += (tiltY - g.rotation.y) * k;
  });

  return (
    <group ref={group} rotation={[-0.22, 0, 0]}>
      {rings.map((r, i) => (
        <Ring key={i} {...r} />
      ))}
      {/* Fine tick marks around the second ring — horology cue, not a clock. */}
      {Array.from({ length: lite ? 24 : 48 }).map((_, i) => {
        const a = (i / (lite ? 24 : 48)) * Math.PI * 2;
        const r = 1.35;
        return (
          <mesh
            key={`tick-${i}`}
            position={[Math.cos(a) * r, Math.sin(a) * r * Math.cos(0.17), Math.sin(a) * r * Math.sin(0.17)]}
            rotation={[0.17, 0, a]}
          >
            <boxGeometry args={[0.006, i % 4 === 0 ? 0.09 : 0.05, 0.006]} />
            <meshStandardMaterial color={PALETTE.brassPale} metalness={1} roughness={0.3} envMapIntensity={1.4} />
          </mesh>
        );
      })}
      {/* Orbiting nodes — the orrery's drifting bodies. */}
      <OrbitNode radius={1.85} speed={0.18} phase={0.4} tilt={0.18} size={0.05} />
      <OrbitNode radius={2.4} speed={-0.13} phase={2.1} tilt={0.2} size={0.062} />
      <OrbitNode radius={3.0} speed={0.1} phase={4.0} tilt={0.21} size={0.045} />
    </group>
  );
}

/* Warm studio: an aubergine environment with a single brass key + cool fill so
   the rings catch a moving highlight as they drift. */
function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#caa4b0" />
      <Environment resolution={256} frames={1}>
        {/* Brass key from upper-right — the candlelit catch. */}
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#f3d49a"
          position={[3.4, 3, 3]}
          rotation={[-Math.PI / 4, 0, 0]}
          scale={[7, 9, 1]}
        />
        {/* Deep aubergine fill from the left — keeps shadows warm-purpled. */}
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#5a2f55"
          position={[-4, 0.5, 2]}
          rotation={[0, Math.PI / 2.4, 0]}
          scale={[7, 7, 1]}
        />
        {/* Ember rim from behind — the brand's warm note. */}
        <Lightformer
          form="circle"
          intensity={1.4}
          color="#d98a45"
          position={[0, -2.6, -4]}
          scale={[8, 8, 1]}
        />
      </Environment>
      <directionalLight position={[4, 5, 3]} intensity={0.8} color="#ffe7bd" />
    </>
  );
}

export interface HorologySceneProps {
  /** Lower ring tessellation + lighter Bloom on smaller / high-DPI tiers. */
  lite?: boolean;
}

export default function HorologyScene({ lite = false }: HorologySceneProps) {
  const pointer = useRef({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  // Pause the render loop when the hero scrolls offscreen (perf + battery).
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
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0.3, 0.6, 7.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <StudioLights />
        <Orrery pointer={pointer} lite={lite} />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.5 : 0.78}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.3}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
