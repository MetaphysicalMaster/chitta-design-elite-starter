"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export interface ParticleFieldProps {
  /** CSS color for particles (default: --color-fg-subtle from theme) */
  color?: string;
  /** Number of particles (default 40 — keep low for atmospheric feel) */
  count?: number;
  /** Particle speed (default 0.4) */
  speed?: number;
  /** Container className */
  className?: string;
}

/**
 * Atmospheric particle field. Drifting subtle points of light.
 * Use as background layer behind hero content.
 *
 * Performance: ~14KB gzip. 60fps sustained.
 */
export function ParticleField({
  color = "currentColor",
  count = 40,
  speed = 0.4,
  className,
}: ParticleFieldProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  const options: ISourceOptions = {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      number: { value: count, density: { enable: true } },
      color: { value: color },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: { enable: true, speed: 0.6, sync: false },
      },
      size: {
        value: { min: 1, max: 2.5 },
      },
      move: {
        enable: true,
        speed,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "bubble" },
      },
      modes: {
        bubble: {
          distance: 100,
          size: 4,
          duration: 0.4,
          opacity: 0.6,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="particle-field"
      options={options}
      className={className}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}
