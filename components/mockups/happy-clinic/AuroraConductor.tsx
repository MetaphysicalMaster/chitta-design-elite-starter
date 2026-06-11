"use client";

/**
 * AuroraConductor — the signature experience orchestrator.
 *
 * ONE CONTINUOUS COLORADO NIGHT SKY YOU DESCEND THROUGH: the Three.js aurora
 * is no longer trapped inside the hero. It renders on a page-level FIXED
 * canvas behind everything; the dark "sky window" sections (hero · Real
 * Results · Booking · footer) drop to translucent navy veils (brand.css,
 * gated by [data-aurora-live]) so the SAME living sky bleeds through each of
 * them — while a GSAP ScrollTrigger scrub resolves the sky from deep night at
 * the hero toward pre-dawn warmth by the booking section (drive.dawn → the
 * shader's u_dawn). Booking literally happens at first light.
 *
 * Responsibilities (the scene itself is a pure GPU layer):
 *  - gate WebGL (≥768px + real context + !saveData + !reduced-motion);
 *  - flag the brand wrapper with [data-aurora-live] so CSS opens the windows;
 *  - drive.scroll   ← window scroll (hero parallax, smoothed by Lenis);
 *  - drive.pointer  ← fine-pointer move (cursor sway; absent on touch);
 *  - drive.dawn     ← GSAP ScrollTrigger scrub (#main top → #book bottom);
 *  - pause the frameloop when NO [data-sky-window] section is on screen or
 *    the tab is hidden (the canvas is fully covered by the light sections).
 *
 * Reduced motion / mobile / no-WebGL: this component renders nothing, the
 * attribute is never set, and every section keeps its original opaque navy —
 * the page elegantly holds its static night. Zero CLS either way (the canvas
 * is position:fixed and behind everything).
 */

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AuroraDrive } from "./AuroraScene";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ssr:false REQUIRES being inside a "use client" module (Next 16 gotcha).
const AuroraScene = dynamic(() => import("./AuroraScene"), {
  ssr: false,
  loading: () => null,
});

function useEnableWebGL() {
  const prefersReduced = useReducedMotion();
  const [ok, setOk] = useState(false);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const mqLite = window.matchMedia("(min-width: 1280px)");
    const saveData =
      // @ts-expect-error — connection is non-standard but widely supported
      navigator.connection?.saveData === true;

    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      hasWebGL = false;
    }

    const update = () => {
      setOk(mq.matches && hasWebGL && !saveData);
      // Run the full mote field only on large viewports.
      setLite(!mqLite.matches);
    };
    update();
    mq.addEventListener("change", update);
    mqLite.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      mqLite.removeEventListener("change", update);
    };
  }, [prefersReduced]);

  return { enabled: ok, lite };
}

export function AuroraConductor() {
  const { enabled, lite } = useEnableWebGL();
  const drive = useRef<AuroraDrive>({ pointer: { x: 0, y: 0 }, scroll: 0, dawn: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  // True only once the scene has PRESENTED a frame (real aurora pixels).
  const [skyPainted, setSkyPainted] = useState(false);
  const onFirstFrame = useCallback(() => setSkyPainted(true), []);

  /* Open the sky windows: mark the brand wrapper live so brand.css swaps the
     night sections to translucent veils + hides the hero's static fallback.
     Gated on the FIRST RENDERED FRAME (not just the WebGL gate) so the static
     night never drops before real aurora pixels exist — no white flash while
     the chunk loads or the GPU warms up. */
  useEffect(() => {
    if (!enabled || !skyPainted) return;
    const brand = rootRef.current?.closest('[data-brand="happy-clinic"]');
    brand?.setAttribute("data-aurora-live", "true");
    return () => brand?.removeAttribute("data-aurora-live");
  }, [enabled, skyPainted]);

  /* Scroll (hero parallax) + pointer sway + sky-window visibility. */
  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => {
      // 0 at hero top, ~1 once a viewport height has scrolled past.
      const h = Math.max(window.innerHeight, 1);
      drive.current.scroll = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Cursor sway — fine pointers only (touch gets a calm, sway-less sky).
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      drive.current.pointer.x = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      drive.current.pointer.y = -((e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
    };
    if (finePointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    // GPU idles whenever every sky window is off screen (the canvas is fully
    // covered by the opaque light sections). NOTE: no visibilitychange gate —
    // browsers already freeze rAF in hidden tabs, so a hidden tab costs
    // nothing, and seeding state from document.visibilityState at mount can
    // wedge the canvas blank when the page is loaded unfocused.
    const windows = Array.from(document.querySelectorAll("[data-sky-window]"));
    const onScreen = new Set<Element>();
    const apply = () => setPaused(onScreen.size === 0);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined" && windows.length > 0) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) onScreen.add(entry.target);
            else onScreen.delete(entry.target);
          }
          apply();
        },
        { rootMargin: "160px" },
      );
      windows.forEach((w) => io!.observe(w));
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (finePointer) window.removeEventListener("pointermove", onPointer);
      io?.disconnect();
    };
  }, [enabled]);

  /* THE SCRUB — night at the hero, resolving to first light by booking. */
  useEffect(() => {
    if (!enabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const state = { v: 0 };
      gsap.to(state, {
        v: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#main",
          start: "top top",
          endTrigger: "#book",
          end: "bottom bottom",
          scrub: 0.8,
        },
        onUpdate: () => {
          drive.current.dawn = state.v;
        },
      });
    });
    return () => ctx.revert();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <AuroraScene
        drive={drive}
        lite={lite}
        paused={paused}
        onFirstFrame={onFirstFrame}
      />
    </div>
  );
}
