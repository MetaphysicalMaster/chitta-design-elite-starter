"use client";

/**
 * SilkScene — the NEW hero power element (greyscale "Luminous Silk" drape).
 *
 * REPLACES the scrapped CausticsScene (a red/pink plasma caustics field + a
 * spinning glass gem) which read as chaotic and off-brand for a precision
 * aesthetics practice. This is the controlled, luxe answer: a single full-bleed
 * orthographic plane runs a custom shader (see silk-shaders.ts) that renders a
 * slow luminous GREYSCALE silk drape lit by a moving studio key, with ONE
 * precise razor-thin HOT-PINK specular light-edge travelling along a single
 * fold — the lone controlled magenta pop. A single Bloom pass blooms ONLY that
 * pink edge. No gem, no green/gold, nothing chaotic.
 *
 * Perf / craft:
 *  - One Canvas, one shader plane, one postprocess pass — far lighter than the
 *    old two-canvas + transmission-material + environment build.
 *  - frameloop flips to "never" when the hero scrolls offscreen or the tab is
 *    hidden (IntersectionObserver + visibilitychange) — zero idle GPU.
 *  - dpr clamped; `lite` tier drops Bloom resolution for weaker devices.
 *  - Loaded ONLY via dynamic({ ssr:false }) from the hero (a "use client"
 *    module). A static CSS silk gradient covers SSR / mobile / no-WebGL /
 *    reduced-motion, so there is never a blank frame and zero CLS.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { silkFragmentShader, silkVertexShader } from "./silk-shaders";

/* Brand palette as THREE colors — mirrors app/mockups/sousan/brand.css:
   a strict greyscale stack (ink -> charcoal -> silver) with ONE #E6007E pink. */
const PALETTE = {
  ink: "#0c0c0c", // deepest near-black (shadow troughs)
  charcoal: "#242424", // raised charcoal (mid drape body)
  silver: "#d7d7d7", // soft silver highlight (lit fold crests)
  pink: "#f0338f", // the single controlled magenta light-edge (the pop)
};

function SilkPlane({
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
      u_ink: { value: new THREE.Color(PALETTE.ink) },
      u_charcoal: { value: new THREE.Color(PALETTE.charcoal) },
      u_silver: { value: new THREE.Color(PALETTE.silver) },
      u_pink: { value: new THREE.Color(PALETTE.pink) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(({ clock }, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.u_time.value = clock.getElapsedTime();
    m.uniforms.u_resolution.value.set(size.width, size.height);

    // Eased pointer parallax of the key light — refined, frame-rate independent.
    const target = pointer.current ?? { x: 0, y: 0 };
    const k = 1 - Math.pow(0.0018, delta);
    smooth.current.x += (target.x - smooth.current.x) * k;
    smooth.current.y += (target.y - smooth.current.y) * k;
    m.uniforms.u_pointer.value.set(smooth.current.x, smooth.current.y);

    // Reveal eases up once — the drape settles as the hero loads (no hard pop).
    const cur = m.uniforms.u_intensity.value as number;
    m.uniforms.u_intensity.value = cur + (1 - cur) * Math.min(1, delta * 0.8);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={silkVertexShader}
        fragmentShader={silkFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export interface SilkSceneProps {
  /** Drop Bloom resolution on smaller / weaker tiers. */
  lite?: boolean;
}

export default function SilkScene({ lite = false }: SilkSceneProps) {
  const pointer = useRef({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  // Pause the render loop when the hero scrolls offscreen or the tab is hidden.
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
      <Canvas
        orthographic
        frameloop={frameloop}
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, lite ? 1.5 : 2]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SilkPlane pointer={pointer} />
        {/* A single, gentle Bloom pass — blooms ONLY the bright pink light-edge
            (and the brightest silver crests), so the one pop glows softly. */}
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={lite ? 0.55 : 0.85}
            luminanceThreshold={0.72}
            luminanceSmoothing={0.22}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
