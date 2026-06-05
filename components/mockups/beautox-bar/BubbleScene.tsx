"use client";

/**
 * BubbleScene — the WebGL power element ("Champagne Fizz Bar").
 *
 * A glossy champagne-fizz bar: a cluster of soft-body liquid spheres that bob,
 * jiggle and nudge each other in a shallow well of playful physics — the
 * effervescence of a cocktail on the brand's black bar surface. Each bubble is a
 * drei MeshTransmissionMaterial sphere tinted across the brand spectrum (hot
 * pink → blush → deep rose → champagne gold → pearl), with a clearcoat gloss
 * highlight. They float in a soft column, gently repelling one another so they
 * kiss and almost-merge without overlapping — a metaball-ish "liquid bar" feel
 * achieved with cheap sphere physics (no marching cubes, so it holds 60fps). The
 * cursor is a repeller: bubbles squish away from the pointer and spring back.
 * Postprocessing Bloom adds the bar-light glow. It fits the "Where Shots &
 * Beauty Mingle" cocktail concept — fizz rising in pink + gold on black.
 *
 * Distinct from siblings: Sousan is a faceted emerald jewel over gold caustics;
 * Darst is a clinical dermal lattice. Beautox is a playful CHAMPAGNE-FIZZ BAR —
 * soft glossy liquid spheres with bouncy physics, not a gem and not a lattice.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from BubbleHero (a "use client"
 * module) — WebGL/R3F is not SSR-safe. A static CSS fizz field is shown for
 * SSR, mobile, no-WebGL and prefers-reduced-motion (the hero fallback).
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* Brand champagne-fizz palette as THREE colors (mirrors brand.css):
   hot pink, soft blush, deep rose, champagne gold, pearl — a cocktail in a
   glass, not a candy bowl. */
const CANDY = [
  "#f06ba8", // hot pink — the signature
  "#f7a6c8", // soft blush
  "#e0568f", // deep rose
  "#f0c987", // champagne gold (the martini olive note)
  "#fff1f6", // pearl fizz (rare highlight)
];

type BubbleSpec = {
  radius: number;
  color: string;
  /* home position in the soft well */
  home: THREE.Vector3;
  /* per-bubble animation phase + speed for organic, non-synced bobbing */
  phase: number;
  speed: number;
  jiggle: number;
};

/** Deterministic-ish bubble layout: a loose vertical cluster, varied sizes. */
function useBubbles(count: number): BubbleSpec[] {
  return useMemo(() => {
    const specs: BubbleSpec[] = [];
    for (let i = 0; i < count; i++) {
      // Spread bubbles in a gentle column with horizontal scatter.
      const t = i / Math.max(1, count - 1);
      const x = (Math.sin(i * 2.4) * 1.7 + (i % 2 === 0 ? 0.4 : -0.4)) * 1.0;
      const y = (t - 0.5) * 4.6 + Math.sin(i * 1.7) * 0.5;
      const z = Math.cos(i * 1.3) * 0.7;
      const radius = 0.42 + (Math.abs(Math.sin(i * 3.1)) * 0.55);
      const color = CANDY[i % CANDY.length];
      specs.push({
        radius,
        color,
        home: new THREE.Vector3(x, y, z),
        phase: i * 1.37,
        speed: 0.5 + (i % 5) * 0.12,
        jiggle: 0.6 + (i % 3) * 0.25,
      });
    }
    return specs;
  }, [count]);
}

/* A mutable physics body — owned by the cluster, shared across the frame so
   bubbles can softly collide with one another (the near-merge / jiggle feel). */
type Body = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  squash: number; // current squash amount, eased toward target each frame
};

/* A single glossy candy bubble — transmission + clearcoat gloss. It reads its
   pre-integrated body from the cluster each frame and only paints the transform,
   so all collision math runs once per cluster (O(n²) over a tiny n). */
function Bubble({
  spec,
  body,
  lite,
}: {
  spec: BubbleSpec;
  body: Body;
  lite: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const m = ref.current;
    if (!m) return;
    m.position.copy(body.pos);

    // Soft-body jiggle — squash/stretch in the direction of motion so the
    // bubble reads as a liquid droplet, not a rigid ball.
    const s = body.squash;
    m.scale.set(
      spec.radius * (1 - s * 0.5),
      spec.radius * (1 + s),
      spec.radius * (1 - s * 0.5),
    );
    // gentle spin so the gloss highlight travels
    m.rotation.y += delta * 0.3;
    m.rotation.z = body.vel.x * 0.18;
  });

  return (
    <mesh ref={ref} position={spec.home}>
      <sphereGeometry args={[1, lite ? 24 : 40, lite ? 24 : 40]} />
      <MeshTransmissionMaterial
        samples={lite ? 4 : 8}
        resolution={lite ? 128 : 256}
        thickness={0.9}
        roughness={0.05}
        ior={1.32}
        chromaticAberration={0.5}
        anisotropy={0.2}
        distortion={0.2}
        distortionScale={0.4}
        temporalDistortion={0.08}
        clearcoat={1}
        clearcoatRoughness={0.04}
        color={spec.color}
        attenuationColor={spec.color}
        /* Shorter attenuation + lower transmission so the hot-pink / deep-rose /
           champagne-gold tints SATURATE through the glass — the spheres read as
           colored cocktail fizz, not pale clear bubbles, against the black bar. */
        attenuationDistance={0.7}
        transmission={0.62}
      />
    </mesh>
  );
}

/* Soft candle-lit bar lighting feeding the Bloom + gloss highlights. */
function CandyLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment resolution={256} frames={1}>
        {/* bright cream key from upper-left → the top gloss highlight */}
        <Lightformer
          form="rect"
          intensity={4}
          color="#fff4ec"
          position={[-3.4, 3.6, 2]}
          rotation={[-Math.PI / 5, 0, 0]}
          scale={[6, 9, 1]}
        />
        {/* hot-pink fill from the right (the bar's pink glow) */}
        <Lightformer
          form="rect"
          intensity={2.7}
          color="#f06ba8"
          position={[4, 0.8, 1]}
          rotation={[0, -Math.PI / 2.4, 0]}
          scale={[6, 7, 1]}
        />
        {/* champagne-gold rim from behind to define the spheres */}
        <Lightformer
          form="ring"
          intensity={2.4}
          color="#f0c987"
          position={[1.4, 2.2, -3.6]}
          scale={[4, 4, 1]}
        />
        {/* warm gold under-glow (candlelight) */}
        <Lightformer
          form="circle"
          intensity={1.5}
          color="#e8b86a"
          position={[-1.6, -2.6, -3]}
          scale={[7, 7, 1]}
        />
      </Environment>
      <directionalLight position={[-4, 5, 3]} intensity={1.0} color="#fff0f6" />
    </>
  );
}

function BubbleCluster({
  pointer,
  lite,
}: {
  pointer: React.RefObject<{ x: number; y: number; active: boolean }>;
  lite: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const bubbles = useBubbles(lite ? 7 : 11);
  const { viewport } = useThree();

  // Shared mutable physics bodies — one per bubble. Integrated once per frame
  // here (bob + cursor repel + inter-bubble soft collision), then each Bubble
  // mesh just paints its body's transform. Lets bubbles nudge / near-merge.
  const bodies = useMemo<Body[]>(
    () =>
      bubbles.map((b) => ({
        pos: b.home.clone(),
        vel: new THREE.Vector3(),
        squash: 0,
      })),
    [bubbles],
  );

  // Settle the whole cluster up as it loads (a buoyant "rise" reveal).
  const reveal = useRef(0);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 30); // clamp for stability on hitches
    const t = clock.getElapsedTime();

    // Cursor world position on the bubble plane (NDC → world units).
    const active = pointer.current?.active ?? false;
    const px = (pointer.current?.x ?? 0) * (viewport.width / 2);
    const py = (pointer.current?.y ?? 0) * (viewport.height / 2);

    // 1) Per-body forces: bob target spring + cursor repulsion.
    for (let i = 0; i < bodies.length; i++) {
      const spec = bubbles[i];
      const bd = bodies[i];

      const driftX = Math.sin(t * spec.speed + spec.phase) * 0.28 * spec.jiggle;
      const driftY =
        Math.cos(t * spec.speed * 0.8 + spec.phase) * 0.34 * spec.jiggle;
      const tx = spec.home.x + driftX;
      const ty = spec.home.y + driftY;
      const tz = spec.home.z;

      // spring toward bobbing target (the soft well)
      const k = 7.5;
      bd.vel.x += (tx - bd.pos.x) * k * dt;
      bd.vel.y += (ty - bd.pos.y) * k * dt;
      bd.vel.z += (tz - bd.pos.z) * k * dt;

      // cursor repulsion — squish away, spring back
      if (active) {
        const dx = bd.pos.x - px;
        const dy = bd.pos.y - py;
        const d2 = dx * dx + dy * dy;
        const reach = 2.2;
        if (d2 < reach * reach) {
          const d = Math.max(0.0001, Math.sqrt(d2));
          const force = (1 - d / reach) * 9.0;
          bd.vel.x += (dx / d) * force * dt;
          bd.vel.y += (dy / d) * force * dt;
        }
      }
    }

    // 2) Inter-bubble soft collision — bodies push apart when they overlap, so
    //    they kiss and almost-merge without interpenetrating (n is tiny).
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;
        const dz = b.pos.z - a.pos.z;
        const dist = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy + dz * dz));
        // allow a slight overlap (0.82) so they look fused, not rigid.
        const minD = (bubbles[i].radius + bubbles[j].radius) * 0.82;
        if (dist < minD) {
          const overlap = (minD - dist) / minD;
          const fx = (dx / dist) * overlap * 6.0 * dt;
          const fy = (dy / dist) * overlap * 6.0 * dt;
          const fz = (dz / dist) * overlap * 6.0 * dt;
          a.vel.x -= fx;
          a.vel.y -= fy;
          a.vel.z -= fz;
          b.vel.x += fx;
          b.vel.y += fy;
          b.vel.z += fz;
        }
      }
    }

    // 3) Integrate + damp + ease the squash toward speed-driven target.
    const damp = Math.pow(0.0009, dt);
    for (let i = 0; i < bodies.length; i++) {
      const bd = bodies[i];
      bd.vel.multiplyScalar(damp);
      bd.pos.addScaledVector(bd.vel, dt);
      const targetSquash = Math.min(0.16, bd.vel.length() * 0.05);
      bd.squash += (targetSquash - bd.squash) * Math.min(1, dt * 10);
    }

    // Buoyant rise reveal + responsive fit-to-width.
    reveal.current = Math.min(1, reveal.current + delta * 0.7);
    const e = 1 - Math.pow(1 - reveal.current, 3); // easeOutCubic
    g.position.y = (1 - e) * -1.4;
    const fit = THREE.MathUtils.clamp(viewport.width / 9, 0.62, 1.15);
    g.scale.setScalar((0.6 + e * 0.4) * fit);
  });

  return (
    <group ref={group}>
      {bubbles.map((spec, i) => (
        <Bubble key={i} spec={spec} body={bodies[i]} lite={lite} />
      ))}
    </group>
  );
}

export interface BubbleSceneProps {
  /** Drop sample count / resolution on smaller / weaker tiers. */
  lite?: boolean;
}

export default function BubbleScene({ lite = false }: BubbleSceneProps) {
  const pointer = useRef({ x: 0, y: 0, active: false });
  const wrapRef = useRef<HTMLDivElement>(null);
  // Pause the render loop when the hero scrolls offscreen or the tab is hidden
  // (perf + battery). frameloop="never" stops the RAF entirely.
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
    pointer.current.active = true;
  };

  const frameloop = visible ? "always" : "never";

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        pointer.current.active = false;
      }}
    >
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 8], fov: 40 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <CandyLights />
        <BubbleCluster pointer={pointer} lite={lite} />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            /* Higher threshold + slightly lower intensity: bar-light glow on the
               brightest gloss highlights only, so the pink/gold tints don't get
               washed to near-white on the right edge (kept the fizz, killed the blow-out). */
            intensity={lite ? 0.62 : 0.9}
            luminanceThreshold={0.64}
            luminanceSmoothing={0.22}
            mipmapBlur
            kernelSize={lite ? KernelSize.MEDIUM : KernelSize.LARGE}
          />
          <Vignette eskil={false} offset={0.32} darkness={0.62} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
