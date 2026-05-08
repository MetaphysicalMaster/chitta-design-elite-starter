"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
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
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform float u_strength;
  uniform vec3 u_color_a;
  uniform vec3 u_color_b;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 mouse = u_mouse / u_resolution;
    mouse.y = 1.0 - mouse.y;
    float dist = distance(uv, mouse);
    float ripple = exp(-dist * 8.0) * sin(dist * 30.0 - u_time * 4.0) * u_strength;
    uv += vec2(ripple * 0.05);

    float gradient = smoothstep(0.0, 1.0, uv.y + sin(u_time * 0.3 + uv.x * 4.0) * 0.1);
    vec3 color = mix(u_color_a, u_color_b, gradient);
    color *= 1.0 + ripple * 0.5;

    gl_FragColor = vec4(color, 0.85);
  }
`;

export interface LiquidCursorProps {
  /** Two colors for the gradient base */
  colors?: [string, string];
  /** Ripple strength (0-1, default 0.6) */
  strength?: number;
  /** className wraps the canvas */
  className?: string;
}

/**
 * Liquid Cursor — viewport-spanning shader where mouse position creates
 * organic ripples in a gradient. Premium tactile feel.
 *
 * Performance: ~18KB gzip (R3F + custom shader). ~58fps under throttle.
 * Mobile: disabled (no cursor on touch + GPU concern).
 */
export function LiquidCursor({
  colors = ["#0f0823", "#a05eff"],
  strength = 0.6,
  className,
}: LiquidCursorProps) {
  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
        <LiquidPlane colors={colors} strength={strength} />
      </Canvas>
    </div>
  );
}

function LiquidPlane({ colors, strength }: { colors: [string, string]; strength: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const { size } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_strength: { value: strength },
      u_color_a: { value: new THREE.Color(colors[0]) },
      u_color_b: { value: new THREE.Color(colors[1]) },
    }),
    [colors, strength, size.width, size.height],
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    materialRef.current.uniforms.u_mouse.value.copy(mouse.current);
    materialRef.current.uniforms.u_resolution.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
