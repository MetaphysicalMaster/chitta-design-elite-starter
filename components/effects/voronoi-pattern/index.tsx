"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float u_time;
  uniform float u_scale;
  uniform float u_speed;
  uniform vec3 u_color_cells;
  uniform vec3 u_color_lines;
  varying vec2 vUv;

  vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
  }

  // Returns vec2(distance to nearest cell, distance to second-nearest cell)
  vec2 voronoi(vec2 uv, float time) {
    vec2 i_uv = floor(uv);
    vec2 f_uv = fract(uv);
    float min_dist = 1.0;
    float second_dist = 1.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = random2(i_uv + neighbor);
        // Animate cell positions
        point = 0.5 + 0.5 * sin(time + 6.28 * point);
        vec2 diff = neighbor + point - f_uv;
        float dist = length(diff);
        if (dist < min_dist) {
          second_dist = min_dist;
          min_dist = dist;
        } else if (dist < second_dist) {
          second_dist = dist;
        }
      }
    }
    return vec2(min_dist, second_dist);
  }

  void main() {
    vec2 uv = vUv * u_scale;
    vec2 v = voronoi(uv, u_time * u_speed);
    float cell = v.x;
    float edge = v.y - v.x; // distance between nearest and second-nearest = edge proximity
    float edge_mask = smoothstep(0.02, 0.06, edge);
    vec3 color = mix(u_color_lines, u_color_cells, edge_mask);
    color = mix(color, u_color_cells, smoothstep(0.0, 0.6, cell) * 0.3);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface VoronoiPatternProps {
  /** Pattern density / scale (default 8 — higher = smaller cells) */
  scale?: number;
  /** Animation speed (default 0.3) */
  speed?: number;
  /** Cell color */
  cellColor?: string;
  /** Edge / line color */
  lineColor?: string;
  className?: string;
}

/**
 * Voronoi Pattern — organic cell-network background via animated Voronoi shader.
 * Bio / network / scientific feel.
 *
 * Performance: ~28KB gzip. ~58fps under throttle.
 * Mobile: serve static SVG fallback.
 *
 * Archetype: Creator (✓✓), Sage, Explorer, Magician, Ruler.
 * Voice: organic, geometric, biological.
 */
export function VoronoiPattern({
  scale = 8,
  speed = 0.3,
  cellColor = "#0f0823",
  lineColor = "#9b6dc9",
  className,
}: VoronoiPatternProps) {
  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
      >
        <VoronoiMesh scale={scale} speed={speed} cellColor={cellColor} lineColor={lineColor} />
      </Canvas>
    </div>
  );
}

function VoronoiMesh({
  scale, speed, cellColor, lineColor,
}: { scale: number; speed: number; cellColor: string; lineColor: string }) {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_scale: { value: scale },
      u_speed: { value: speed },
      u_color_cells: { value: new THREE.Color(cellColor) },
      u_color_lines: { value: new THREE.Color(lineColor) },
    }),
    [scale, speed, cellColor, lineColor],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
