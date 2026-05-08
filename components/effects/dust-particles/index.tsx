"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export interface DustParticlesProps {
  /** CSS color for dust motes (default: --color-fg-subtle) */
  color?: string;
  /** Number of motes (default 25 — keep low for ambient feel) */
  count?: number;
  /** Drift speed (default 0.15 — slower than particle-field for atmospheric quality) */
  speed?: number;
  /** Container className */
  className?: string;
}

/**
 * Dust Particles — subtle ambient floating motes.
 *
 * Variant of particle-field tuned for atmospheric, slow, subtle drift.
 * Use as background layer for transformation-tier surfaces (CHITTA article heroes,
 * dream-symbol detail pages, meditation onboarding).
 *
 * Performance: ~14KB gzip (shared with particle-field). 60fps.
 * Mobile: disabled (battery + GPU constraints).
 */
export function DustParticles({
  color = "currentColor",
  count = 25,
  speed = 0.15,
  className,
}: DustParticlesProps) {
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
        value: { min: 0.05, max: 0.25 },
        animation: { enable: true, speed: 0.3, sync: false },
      },
      size: { value: { min: 0.5, max: 1.5 } },
      move: {
        enable: true,
        speed,
        direction: "top",
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="dust-particles"
      options={options}
      className={className}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}
