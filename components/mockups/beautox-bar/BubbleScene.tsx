"use client";

/**
 * BubbleScene — the WebGL power element ("Champagne Fizz Bar") + the page's
 * SIGNATURE INTERACTION layer: HAPPY-HOUR PHYSICS.
 *
 * A glossy champagne-fizz bar: a cluster of soft-body liquid spheres that bob,
 * jiggle and nudge each other in a shallow well of playful physics — the
 * effervescence of a cocktail on the brand's black bar surface. Each bubble is a
 * drei MeshTransmissionMaterial sphere tinted across the brand spectrum (hot
 * pink → blush → deep rose → champagne gold → pearl), with a clearcoat gloss
 * highlight. They float in a soft column, gently repelling one another so they
 * kiss and almost-merge without overlapping — a metaball-ish "liquid bar" feel
 * achieved with cheap sphere physics (no marching cubes, so it holds 60fps).
 *
 * HAPPY-HOUR PHYSICS (the signature):
 *  1. SCROLL = SHAKE THE BOTTLE. The live Lenis velocity (via fizz-bus) becomes
 *     buoyancy: scroll down and the whole cluster surges upward against its
 *     springs while a micro-fizz particle pool ramps its emission rate — the
 *     page literally effervesces under your thumb, then settles when you do.
 *  2. CURSOR = POP. Graze a bubble's heart and it bursts: a sparkle burst
 *     (pearl + gold + its own tint) where it died, then a fresh bubble rises
 *     from below the bar to retake its seat. Cooldown-gated so it stays a
 *     delight, not a machine gun. Works for touch-drag on capable tablets.
 *  3. The cursor is otherwise a soft repeller: bubbles squish away and spring
 *     back. The pointer is tracked window-level so the physics respond even
 *     when the cursor is over the hero copy.
 *
 * Loaded ONLY via dynamic({ ssr:false }) from BubbleHero (a "use client"
 * module) — WebGL/R3F is not SSR-safe. A static CSS fizz field is shown for
 * SSR, mobile, no-WebGL and prefers-reduced-motion (the hero fallback), so the
 * physics layer degrades to an elegant static scene, never a broken one.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { fizzBus } from "./fizz-bus";

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

/* Micro-fizz tint pool — blush/gold/pearl so the rising motes read as
   carbonation, with the occasional hot-pink fleck. */
const FIZZ_TINTS = ["#f7a6c8", "#f0c987", "#fff1f6", "#f06ba8"];

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
   bubbles can softly collide with one another (the near-merge / jiggle feel).
   `vis` is the visual scale (0..1): it collapses on a pop and eases back in as
   the respawned bubble rises from under the bar. */
type Body = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  squash: number; // current squash amount, eased toward target each frame
  vis: number; // visual scale — 1 alive, →0 during a pop
  popT: number; // >0 while the pop collapse is playing
  cooldown: number; // seconds until this bubble may pop again
};

/** Signature for the sparkle-burst emitter shared between cluster + particles. */
type BurstFn = (pos: THREE.Vector3, color: string, strength?: number) => void;

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
    // bubble reads as a liquid droplet, not a rigid ball. `vis` multiplies the
    // whole transform for the pop-collapse / rise-back-in lifecycle.
    const s = body.squash;
    const v = body.vis;
    m.visible = v > 0.02;
    m.scale.set(
      spec.radius * (1 - s * 0.5) * v,
      spec.radius * (1 + s) * v,
      spec.radius * (1 - s * 0.5) * v,
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
  surge,
  burstRef,
}: {
  pointer: React.RefObject<{ x: number; y: number; active: boolean }>;
  lite: boolean;
  /** Smoothed scroll surge (shared with FizzParticles) — written here. */
  surge: React.MutableRefObject<number>;
  /** Sparkle-burst emitter installed by FizzParticles. */
  burstRef: React.MutableRefObject<BurstFn | null>;
}) {
  const group = useRef<THREE.Group>(null);
  const bubbles = useBubbles(lite ? 7 : 11);
  const { viewport } = useThree();

  // Shared mutable physics bodies — one per bubble. Integrated once per frame
  // here (bob + scroll buoyancy + cursor repel/pop + inter-bubble collision),
  // then each Bubble mesh just paints its body's transform.
  const bodies = useMemo<Body[]>(
    () =>
      bubbles.map((b) => ({
        pos: b.home.clone(),
        vel: new THREE.Vector3(),
        squash: 0,
        vis: 1,
        popT: 0,
        cooldown: 0,
      })),
    [bubbles],
  );

  // Settle the whole cluster up as it loads (a buoyant "rise" reveal).
  const reveal = useRef(0);
  // Scratch vector for world-space burst positions (no per-frame allocs).
  const burstPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 30); // clamp for stability on hitches
    const t = clock.getElapsedTime();

    // ---- HAPPY-HOUR PHYSICS 1: scroll velocity → buoyancy surge. ----
    // Lenis velocity (px/frame-ish, signed) → a smoothed -1..+1.6 surge factor.
    // Scroll down = fizz rises faster; scroll up = a gentle settle-down.
    const rawSurge = THREE.MathUtils.clamp(fizzBus.velocity / 28, -1, 1.6);
    surge.current += (rawSurge - surge.current) * Math.min(1, dt * 6);
    const up = surge.current;

    // Cursor world position on the bubble plane (NDC → world units), then into
    // the cluster's LOCAL space (the group is scaled + offset during reveal) so
    // repel + pop distances are exact, not approximate.
    const active = pointer.current?.active ?? false;
    const wx = (pointer.current?.x ?? 0) * (viewport.width / 2);
    const wy = (pointer.current?.y ?? 0) * (viewport.height / 2);
    const gs = Math.max(0.0001, g.scale.x);
    const px = (wx - g.position.x) / gs;
    const py = (wy - g.position.y) / gs;

    // 1) Per-body forces: bob target spring + scroll buoyancy + cursor.
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

      // scroll buoyancy — the whole pour rises against its springs while you
      // scroll, each bubble by its own jiggle so the surge reads organic.
      bd.vel.y += up * 2.6 * (0.7 + spec.jiggle * 0.5) * dt * 60 * 0.06;

      bd.cooldown = Math.max(0, bd.cooldown - dt);

      if (bd.popT > 0) {
        // ---- pop collapse: shrink out fast, then respawn under the bar ----
        bd.popT -= dt;
        bd.vis = Math.max(0, bd.vis - dt * 9);
        if (bd.popT <= 0) {
          bd.pos.set(
            spec.home.x + (Math.sin(t * 7.3 + i) - 0.1) * 0.9,
            spec.home.y - 5.5,
            spec.home.z,
          );
          bd.vel.set(0, 3.4, 0);
        }
      } else {
        // ease the (re)spawned bubble back to full size as it rises
        bd.vis = Math.min(1, bd.vis + dt * 1.6);

        if (active) {
          const dx = bd.pos.x - px;
          const dy = bd.pos.y - py;
          const d2 = dx * dx + dy * dy;

          // ---- HAPPY-HOUR PHYSICS 2: graze the heart → POP. ----
          const popR = spec.radius * 0.78;
          if (bd.cooldown <= 0 && bd.vis > 0.92 && d2 < popR * popR) {
            bd.popT = 0.16;
            bd.cooldown = 2.8;
            // world-space burst at the bubble's position (manual transform —
            // group only scales uniformly + offsets in y).
            burstPos.set(
              bd.pos.x * gs + g.position.x,
              bd.pos.y * gs + g.position.y,
              bd.pos.z * gs,
            );
            burstRef.current?.(burstPos, spec.color, spec.radius);
          } else {
            // soft repulsion — squish away, spring back
            const reach = 2.2;
            if (d2 < reach * reach) {
              const d = Math.max(0.0001, Math.sqrt(d2));
              const force = (1 - d / reach) * 9.0;
              bd.vel.x += (dx / d) * force * dt;
              bd.vel.y += (dy / d) * force * dt;
            }
          }
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

    // 3) Integrate + damp + ease the squash toward speed-driven target. A
    //    touch of extra squash under scroll surge so the pour reads "shaken".
    const damp = Math.pow(0.0009, dt);
    for (let i = 0; i < bodies.length; i++) {
      const bd = bodies[i];
      bd.vel.multiplyScalar(damp);
      bd.pos.addScaledVector(bd.vel, dt);
      const targetSquash = Math.min(
        0.16,
        bd.vel.length() * 0.05 + Math.abs(up) * 0.03,
      );
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

/* ============================================================
   FizzParticles — the micro-carbonation + sparkle-burst pool.
   One Points draw call over a recycled typed-array pool. Two particle kinds:
   - FIZZ: tiny motes rising from under the bar; baseline trickle, emission
     rate + speed ramp with the scroll surge (the "shaken bottle").
   - SPARK: the pop payload — a radial burst of pearl/gold/tint flecks where a
     bubble died. Additive blending over the black bar = champagne glitter.
   Custom point shader (per-particle size/alpha/color + a gloss kiss) so the
   whole system costs one draw call and zero React state.
   ============================================================ */
function FizzParticles({
  surge,
  burstRef,
  lite,
}: {
  surge: React.MutableRefObject<number>;
  burstRef: React.MutableRefObject<BurstFn | null>;
  lite: boolean;
}) {
  const N = lite ? 160 : 260;
  const { viewport } = useThree();
  const geomRef = useRef<THREE.BufferGeometry>(null);

  const pool = useMemo(
    () => ({
      positions: new Float32Array(N * 3),
      colors: new Float32Array(N * 3),
      sizes: new Float32Array(N),
      alphas: new Float32Array(N),
      vel: new Float32Array(N * 3),
      life: new Float32Array(N),
      maxLife: new Float32Array(N),
      wobble: new Float32Array(N),
      spark: new Uint8Array(N),
      cursor: 0,
      emitAcc: 0,
    }),
    [N],
  );

  const uniforms = useMemo(() => ({ uScale: { value: 300 } }), []);
  const tints = useMemo(
    () => FIZZ_TINTS.map((c) => new THREE.Color(c)),
    [],
  );
  const scratchColor = useMemo(() => new THREE.Color(), []);

  // Install the burst emitter for the cluster (pop → sparkles).
  useEffect(() => {
    const findSlot = () => {
      for (let k = 0; k < N; k++) {
        const i = (pool.cursor + k) % N;
        if (pool.life[i] <= 0) {
          pool.cursor = (i + 1) % N;
          return i;
        }
      }
      return -1;
    };

    burstRef.current = (pos, color, strength = 0.7) => {
      scratchColor.set(color);
      const n = lite ? 9 : 13;
      for (let s = 0; s < n; s++) {
        const i = findSlot();
        if (i < 0) return;
        const a = (s / n) * Math.PI * 2 + Math.random() * 0.7;
        const speed = 1.2 + Math.random() * 2.2 * (0.6 + strength);
        pool.positions[i * 3] = pos.x;
        pool.positions[i * 3 + 1] = pos.y;
        pool.positions[i * 3 + 2] = pos.z;
        pool.vel[i * 3] = Math.cos(a) * speed;
        pool.vel[i * 3 + 1] = Math.sin(a) * speed + 0.9; // champagne drifts UP
        pool.vel[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
        // pearl/gold/tint mix — every third fleck keeps the bubble's own color
        const mix = s % 3 === 0 ? scratchColor : tints[(s + i) % tints.length];
        pool.colors[i * 3] = Math.min(1, mix.r * 1.15);
        pool.colors[i * 3 + 1] = Math.min(1, mix.g * 1.15);
        pool.colors[i * 3 + 2] = Math.min(1, mix.b * 1.15);
        pool.sizes[i] = 0.07 + Math.random() * 0.11;
        pool.maxLife[i] = pool.life[i] = 0.45 + Math.random() * 0.4;
        pool.wobble[i] = Math.random() * Math.PI * 2;
        pool.spark[i] = 1;
        pool.alphas[i] = 1;
      }
    };
    return () => {
      burstRef.current = null;
    };
  }, [N, pool, lite, tints, scratchColor, burstRef]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const w = viewport.width;
    const h = viewport.height;
    const s = Math.max(0, surge.current);

    // keep point sizes correct for the current canvas height / dpr
    const cam = state.camera as THREE.PerspectiveCamera;
    uniforms.uScale.value =
      (state.size.height * state.gl.getPixelRatio()) /
      (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2));

    // ---- emission: a gentle trickle at rest, a geyser under scroll ----
    const rate = (lite ? 5 : 8) + s * (lite ? 55 : 90);
    pool.emitAcc += rate * dt;
    while (pool.emitAcc >= 1) {
      pool.emitAcc -= 1;
      // ring-search a dead slot
      let slot = -1;
      for (let k = 0; k < N; k++) {
        const i = (pool.cursor + k) % N;
        if (pool.life[i] <= 0) {
          pool.cursor = (i + 1) % N;
          slot = i;
          break;
        }
      }
      if (slot < 0) break;
      const i = slot;
      pool.positions[i * 3] = (Math.random() - 0.5) * w * 0.92;
      pool.positions[i * 3 + 1] = -h / 2 - 0.4;
      pool.positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      pool.vel[i * 3] = (Math.random() - 0.5) * 0.2;
      pool.vel[i * 3 + 1] = 0.65 + Math.random() * 1.0 + s * 2.4;
      pool.vel[i * 3 + 2] = 0;
      const tint = tints[(Math.random() * tints.length) | 0];
      pool.colors[i * 3] = tint.r;
      pool.colors[i * 3 + 1] = tint.g;
      pool.colors[i * 3 + 2] = tint.b;
      pool.sizes[i] = 0.035 + Math.random() * 0.075;
      pool.maxLife[i] = pool.life[i] = 3.2 + Math.random() * 2.2;
      pool.wobble[i] = Math.random() * Math.PI * 2;
      pool.spark[i] = 0;
      pool.alphas[i] = 0;
    }

    // ---- integrate ----
    for (let i = 0; i < N; i++) {
      if (pool.life[i] <= 0) {
        pool.alphas[i] = 0;
        continue;
      }
      pool.life[i] -= dt;
      const isSpark = pool.spark[i] === 1;

      if (isSpark) {
        // sparkles: flare, drag to a drift, fade fast
        pool.vel[i * 3] *= Math.pow(0.012, dt);
        pool.vel[i * 3 + 1] *= Math.pow(0.06, dt);
        pool.vel[i * 3 + 1] += 0.5 * dt; // buoyant after the flare
      } else {
        // fizz: buoyant rise + a lazy sine wobble (carbonation wander)
        pool.vel[i * 3 + 1] += 0.18 * dt;
        pool.positions[i * 3] +=
          Math.sin(t * 2.4 + pool.wobble[i]) * 0.16 * dt;
      }
      pool.positions[i * 3] += pool.vel[i * 3] * dt;
      pool.positions[i * 3 + 1] += pool.vel[i * 3 + 1] * dt;
      pool.positions[i * 3 + 2] += pool.vel[i * 3 + 2] * dt;

      // fade-in then fade-out envelopes; fizz is dimmer than sparkles
      const aged = pool.maxLife[i] - pool.life[i];
      const fadeIn = Math.min(1, aged / 0.25);
      const fadeOut = Math.min(1, pool.life[i] / (isSpark ? 0.3 : 0.6));
      pool.alphas[i] = fadeIn * fadeOut * (isSpark ? 0.95 : 0.5);

      // recycle once it clears the rim
      if (pool.positions[i * 3 + 1] > h / 2 + 0.6) {
        pool.life[i] = 0;
        pool.alphas[i] = 0;
      }
    }

    const geom = geomRef.current;
    if (geom) {
      geom.attributes.position.needsUpdate = true;
      (geom.attributes.aColor as THREE.BufferAttribute).needsUpdate = true;
      (geom.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
      (geom.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[pool.positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[pool.colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[pool.sizes, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[pool.alphas, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={
          /* glsl */ `
          attribute vec3 aColor;
          attribute float aSize;
          attribute float aAlpha;
          uniform float uScale;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = aColor;
            vAlpha = aAlpha;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * uScale / -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          precision mediump float;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            float core = smoothstep(0.5, 0.1, d);
            float gloss = smoothstep(0.22, 0.0, length(uv + vec2(0.13, -0.13))) * 0.5;
            float a = core * vAlpha;
            if (a < 0.004) discard;
            gl_FragColor = vec4(vColor + gloss, a);
          }
        `
        }
      />
    </points>
  );
}

export interface BubbleSceneProps {
  /** Drop sample count / resolution on smaller / weaker tiers. */
  lite?: boolean;
}

export default function BubbleScene({ lite = false }: BubbleSceneProps) {
  const pointer = useRef({ x: 0, y: 0, active: false });
  const wrapRef = useRef<HTMLDivElement>(null);
  // Shared between cluster (writes) + particles (reads): smoothed scroll surge.
  const surge = useRef(0);
  // The sparkle-burst emitter — installed by FizzParticles, fired by the cluster.
  const burstRef = useRef<BurstFn | null>(null);
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

  // Pointer tracked at WINDOW level (not the canvas wrapper) so the physics
  // respond even when the cursor is over the hero copy / CTAs that sit above
  // the canvas in the stacking order. Also covers touch-drag on tablets.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        pointer.current.active = false;
        return;
      }
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.current.active = true;
    };
    const onEnd = () => {
      pointer.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onEnd);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.documentElement.removeEventListener("pointerleave", onEnd);
    };
  }, []);

  const frameloop = visible ? "always" : "never";

  return (
    <div ref={wrapRef} className="absolute inset-0">
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
        <BubbleCluster
          pointer={pointer}
          lite={lite}
          surge={surge}
          burstRef={burstRef}
        />
        <FizzParticles surge={surge} burstRef={burstRef} lite={lite} />
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
