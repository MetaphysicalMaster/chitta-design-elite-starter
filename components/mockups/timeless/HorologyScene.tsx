"use client";

/**
 * HorologyScene — the WebGL power element ("Bokeh Light Field").
 *
 * A slow-drifting, three-dimensional field of soft, out-of-focus ORANGE / peach
 * / cream BOKEH light dots over a bright peach environment — the brand's
 * signature texture, made dimensional. Friendly, sunlit, optimistic (the live
 * identity), now matching the wordmark dot-cluster and the CSS fallback rather
 * than a clock/orrery. Layers:
 *   1. A warm peach studio environment + a bright orange key light, so every
 *      element reads as glowing warm light (low metalness + self-emission).
 *   2. THE BOKEH: ~16 self-emissive, additively-blended sphere "light dots" at
 *      varied depths — large soft blurred dots in the foreground (low opacity,
 *      strong scale) and smaller crisper dots toward the back — each drifting
 *      slowly on its own path. This is the primary read.
 *   3. A couple of very faint concentric light loops sit BEHIND the bokeh as a
 *      quiet secondary structure (depth + a wisp of the brand's circular motif),
 *      never a clock — no tick marks, no orbiting "planets".
 *   4. Everything self-emits warm orange so the field reads as soft bokeh
 *      WITHOUT post-processing — friendly restraint, and crash-proof (the
 *      react-postprocessing Bloom was removed; it dereferenced a null WebGL
 *      context on context-loss and hard-crashed the page).
 *
 * Loaded ONLY via dynamic({ ssr:false }) from HorologyHero (a client
 * component) — WebGL/R3F is not SSR-safe. A static CSS bokeh field fallback
 * covers SSR, mobile, reduced-motion and no-WebGL (HorologyHero).
 *
 * Perf: dpr={[1,2]}, frameloop pauses when the hero is offscreen or the tab is
 * hidden. `lite` tier lowers bokeh count + sphere tessellation on smaller tiers.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* Warm-orange bokeh palette as THREE colors (kept in JS to match brand.css
   ring stops). Sunlit, friendly, optimistic — orange + peach + cream over a
   bright peach field, NOT the old aubergine-brass. The brass and ember keys
   below are kept purely for downstream compatibility; the values are now orange. */
const PALETTE = {
  field: "#fbe9d9", // peach-cream field clear color (light hero)
  brass: "#e0701a", // brand ORANGE (#E0701A)
  brassDeep: "#c25e14", // deep orange
  brassPale: "#f6c9a0", // soft apricot highlight
  ember: "#f0915a", // warm peach-orange rim
};

/* A single soft BOKEH light dot — a self-emissive sphere, additively blended so
   it reads as an out-of-focus point of warm light rather than a solid ball. Each
   dot drifts slowly on a gentle Lissajous path around its anchor; foreground dots
   are large + faint (heavily "defocused"), background dots smaller + a touch
   crisper, so the field has real depth. transparent + depthWrite:false keeps the
   additive glow clean as dots overlap (no z-fighting halos). */
function BokehDot({
  anchor,
  size,
  color,
  opacity,
  drift,
  speed,
  phase,
  segments,
}: {
  anchor: [number, number, number];
  size: number;
  color: string;
  opacity: number;
  drift: number;
  speed: number;
  phase: number;
  segments: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.getElapsedTime() * speed + phase;
    // gentle, non-repeating-looking drift around the anchor.
    m.position.x = anchor[0] + Math.sin(t) * drift;
    m.position.y = anchor[1] + Math.cos(t * 0.82 + phase) * drift * 0.8;
    m.position.z = anchor[2] + Math.sin(t * 0.6 + phase * 1.3) * drift * 0.5;
    // a slow breathe so the dot subtly pulses like a defocused highlight.
    const s = 1 + Math.sin(t * 0.7) * 0.06;
    m.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={anchor}>
      <sphereGeometry args={[size, segments, segments]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* One faint concentric light loop — a thin torus drifting slowly, sitting BEHIND
   the bokeh as a quiet secondary structure (a wisp of the brand's circular
   motif + depth), never a clock. Low emission so it never competes with the
   dots. */
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
    m.rotation.x = tilt + Math.sin(t * 0.18 + phase) * 0.04;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, phase]} position={[0, 0, -1.6]}>
      <torusGeometry args={[radius, tube, 8, segments]} />
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.5}
        emissive={color}
        emissiveIntensity={0.28}
        transparent
        opacity={0.5}
        envMapIntensity={1.1}
      />
    </mesh>
  );
}

/* The full BOKEH light-field group — a depth-staggered cloud of soft warm light
   dots (the primary read) with two faint concentric loops behind for depth.
   Gentle global tilt + a barely-there parallax toward the cursor, frame-rate
   independent. */
function BokehField({
  pointer,
  lite,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  lite: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  // The bokeh cloud. Foreground dots (positive z, nearer the camera) are LARGE
  // and FAINT — heavily out-of-focus; background dots (negative z) are smaller,
  // slightly more opaque, "sharper". Colors run the brand progression cream →
  // peach → apricot → orange. Anchors are scattered, weighted to the right where
  // the live brand's light source sits, but kept clear of the lower-left where
  // the hero copy lives. Counts respect the lite tier for 60fps on smaller GPUs.
  const dots = useMemo(() => {
    type Dot = {
      anchor: [number, number, number];
      size: number;
      color: string;
      opacity: number;
      drift: number;
      speed: number;
      phase: number;
    };
    // Foreground (big, soft, faint) — the signature out-of-focus blobs.
    const fg: Dot[] = [
      { anchor: [2.7, 1.5, 2.6], size: 1.15, color: PALETTE.brass, opacity: 0.18, drift: 0.32, speed: 0.1, phase: 0.0 },
      { anchor: [-2.4, -1.7, 2.2], size: 1.35, color: PALETTE.brassPale, opacity: 0.14, drift: 0.36, speed: 0.08, phase: 1.7 },
      { anchor: [1.4, -2.0, 2.9], size: 0.95, color: PALETTE.ember, opacity: 0.16, drift: 0.3, speed: 0.12, phase: 3.1 },
      { anchor: [3.4, -0.6, 1.9], size: 1.05, color: PALETTE.brassPale, opacity: 0.15, drift: 0.28, speed: 0.09, phase: 4.4 },
    ];
    // Mid field — the body of the bokeh, medium dots, medium glow.
    const mid: Dot[] = [
      { anchor: [1.9, 1.0, 0.4], size: 0.5, color: PALETTE.brass, opacity: 0.45, drift: 0.24, speed: 0.16, phase: 0.6 },
      { anchor: [-1.5, 1.6, 0.0], size: 0.42, color: PALETTE.ember, opacity: 0.42, drift: 0.26, speed: 0.14, phase: 2.2 },
      { anchor: [2.9, 2.0, -0.2], size: 0.36, color: PALETTE.brassPale, opacity: 0.5, drift: 0.22, speed: 0.18, phase: 3.7 },
      { anchor: [0.4, 2.3, 0.3], size: 0.3, color: PALETTE.brass, opacity: 0.46, drift: 0.2, speed: 0.2, phase: 5.0 },
      { anchor: [3.6, 0.9, -0.4], size: 0.34, color: PALETTE.ember, opacity: 0.44, drift: 0.24, speed: 0.15, phase: 1.2 },
      { anchor: [-2.7, 0.3, -0.3], size: 0.28, color: PALETTE.brassPale, opacity: 0.4, drift: 0.22, speed: 0.17, phase: 4.0 },
    ];
    // Background — small, crisper, brighter points (the "in-focus" sparkle).
    const bg: Dot[] = [
      { anchor: [2.2, 2.5, -1.4], size: 0.12, color: PALETTE.brassPale, opacity: 0.85, drift: 0.16, speed: 0.24, phase: 0.3 },
      { anchor: [3.1, 1.6, -1.2], size: 0.1, color: PALETTE.brass, opacity: 0.8, drift: 0.18, speed: 0.22, phase: 2.6 },
      { anchor: [0.9, 1.9, -1.6], size: 0.09, color: PALETTE.ember, opacity: 0.78, drift: 0.14, speed: 0.26, phase: 3.9 },
      { anchor: [-1.9, 2.1, -1.3], size: 0.11, color: PALETTE.brassPale, opacity: 0.82, drift: 0.16, speed: 0.2, phase: 5.2 },
      { anchor: [4.0, 2.2, -1.5], size: 0.08, color: PALETTE.brass, opacity: 0.75, drift: 0.18, speed: 0.28, phase: 1.0 },
      { anchor: [1.6, 3.0, -1.7], size: 0.1, color: PALETTE.ember, opacity: 0.8, drift: 0.14, speed: 0.23, phase: 4.6 },
    ];
    // On the lite tier, thin the mid + background to keep the fill rate sane.
    const chosen = lite ? [...fg, ...mid.slice(0, 4), ...bg.slice(0, 3)] : [...fg, ...mid, ...bg];
    return chosen;
  }, [lite]);

  // Two faint loops far behind the dots — a whisper of the brand's circular
  // motif + depth, never a clock.
  const rings = useMemo(
    () => [
      { radius: 2.2, tube: 0.02, speed: 0.03, phase: 0.4, tilt: 0.18, color: PALETTE.brass, segments: lite ? 80 : 140 },
      { radius: 3.3, tube: 0.016, speed: -0.022, phase: 2.0, tilt: 0.2, color: PALETTE.brassDeep, segments: lite ? 80 : 140 },
    ],
    [lite],
  );

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const target = pointer.current ?? { x: 0, y: 0 };

    // Eased cursor parallax — subtle tilt of the whole field (depth response).
    const k = 1 - Math.pow(0.002, delta);
    const tiltX = -0.04 + target.y * 0.1 + Math.sin(t * 0.12) * 0.015;
    const tiltY = target.x * 0.14 + Math.cos(t * 0.1) * 0.015;
    g.rotation.x += (tiltX - g.rotation.x) * k;
    g.rotation.y += (tiltY - g.rotation.y) * k;
  });

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <Ring key={`ring-${i}`} {...r} />
      ))}
      {dots.map((d, i) => (
        <BokehDot key={`dot-${i}`} {...d} segments={lite ? 16 : 24} />
      ))}
    </group>
  );
}

/* Sunlit studio: a warm peach environment with a bright orange key + cream fill
   so the faint loops + any lit geometry catch a moving highlight — friendly and
   optimistic, not aged-metal. The bokeh dots self-emit, so this mainly warms the
   secondary structure and the overall ambience. */
function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.65} color="#fbe9d9" />
      <Environment resolution={256} frames={1}>
        {/* Bright orange key from upper-right — the sunlit catch. */}
        <Lightformer
          form="rect"
          intensity={3.4}
          color="#f6b27a"
          position={[3.4, 3, 3]}
          rotation={[-Math.PI / 4, 0, 0]}
          scale={[7, 9, 1]}
        />
        {/* Soft peach fill from the left — keeps shadows warm + open. */}
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#fad7b8"
          position={[-4, 0.5, 2]}
          rotation={[0, Math.PI / 2.4, 0]}
          scale={[7, 7, 1]}
        />
        {/* Warm orange rim from behind — the brand's signature note. */}
        <Lightformer
          form="circle"
          intensity={1.6}
          color="#e0701a"
          position={[0, -2.6, -4]}
          scale={[8, 8, 1]}
        />
      </Environment>
      <directionalLight position={[4, 5, 3]} intensity={0.9} color="#fff1e2" />
    </>
  );
}

export interface HorologySceneProps {
  /** Lower bokeh count + sphere tessellation on smaller / high-DPI tiers. */
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
        camera={{ position: [0.6, 0.4, 6.4], fov: 46 }}
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
        <BokehField pointer={pointer} lite={lite} />
        {/* NOTE: the post-processing Bloom (react-postprocessing) was removed —
            its EffectComposer reads gl.alpha and hard-crashes ("Cannot read
            properties of null") whenever the WebGL context is lost/recreated
            (e.g. when an overlay locks scroll). The bokeh dots are additive,
            self-emissive + toneMapped:false, so they already glow as soft
            out-of-focus light without post — and the page can never crash from a
            lost context. */}
      </Canvas>
    </div>
  );
}
