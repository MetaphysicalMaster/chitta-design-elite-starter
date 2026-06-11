"use client";

/**
 * experience.tsx — EDITORIAL LIGHT-ON-SKIN, the SimplySkin signature layer.
 *
 * The Awwwards angle here is typographic restraint + immaculate reveal craft
 * (Aesop / The Row register). Four instruments, all whisper-quiet:
 *
 *   1. SplitLines — serif headlines reveal line-by-line through hand-rolled
 *      word masks (no club plugins). Words are wrapped in overflow-clipped
 *      spans, grouped into rendered lines at reveal time (font-swap safe),
 *      and rise on a long power4 ease.
 *   2. usePrintReveal / PrintReveal — images "develop like prints": a
 *      clip-path wipe opens the frame top-to-bottom while the photograph
 *      settles from an overexposed, under-fixed grade (bright, desaturated,
 *      faintly sepia) into its full warmth, with a slow counter-scale.
 *   3. LightSweep — a fixed, soft-light-blended luminance band that travels
 *      down the viewport tied to overall scroll progress: the page's light
 *      source follows the reader. Transform-only, scrubbed, one element.
 *   4. Magnetic — an ultra-restrained magnetic pull on primary CTAs
 *      (max ~6px, fine pointers only, eased return).
 *
 * Lenis integration lives in SmoothScroll.tsx (gsap.ticker drives lenis.raf,
 * lenis.on('scroll', ScrollTrigger.update)) — every trigger here assumes it.
 *
 * A11y + perf discipline:
 *   · every effect is created inside gsap.matchMedia gated on
 *     prefers-reduced-motion: no-preference — reduced motion gets the page
 *     fully static and perfectly legible (and SSR/no-JS renders plain).
 *   · split headlines carry an aria-label of their plain text so AT reads
 *     one continuous string, never word-soup.
 *   · hot paths are transform-only; the develop filter runs once on entrance.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/* ------------------------------------------------------------------ */
/* SplitLines — hand-rolled line-by-line mask reveal for serif heads.  */
/* ------------------------------------------------------------------ */

/**
 * Wrap every word of `root`'s text in mask/inner span pairs.
 * Elements marked data-split-atomic (e.g. the foil-sheen hero word, whose
 * background-clip:text must stay on its own box) are wrapped whole.
 * Returns the inner (translating) spans in document order.
 */
function splitIntoWords(root: HTMLElement): HTMLElement[] {
  const inners: HTMLElement[] = [];

  const wrap = (content: Node): HTMLElement => {
    const mask = document.createElement("span");
    mask.className = "ss-w";
    const inner = document.createElement("span");
    inner.className = "ss-wi";
    mask.appendChild(inner);
    inner.appendChild(content);
    inners.push(inner);
    return mask;
  };

  // Atomic elements first (kept whole inside one mask).
  root.querySelectorAll<HTMLElement>("[data-split-atomic]").forEach((node) => {
    const placeholder = document.createComment("ss-atomic");
    node.replaceWith(placeholder);
    const mask = wrap(node);
    placeholder.replaceWith(mask);
  });

  // Then every remaining text node, word by word.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement?.closest(".ss-wi")
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  const textNodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) {
    if (current.nodeValue && current.nodeValue.trim().length) {
      textNodes.push(current as Text);
    }
  }

  for (const node of textNodes) {
    const frag = document.createDocumentFragment();
    const parts = node.nodeValue!.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(" "));
      } else {
        frag.appendChild(wrap(document.createTextNode(part)));
      }
    }
    node.parentNode?.replaceChild(frag, node);
  }

  return inners;
}

export function SplitLines({
  as = "h2",
  children,
  className,
  style,
  mode = "scroll",
  delay = 0,
}: {
  as?: keyof React.JSX.IntrinsicElements;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** "scroll" reveals on viewport entry; "mount" plays immediately (hero). */
  mode?: "scroll" | "mount";
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const original = el.innerHTML;
    // innerText (not textContent) so <br> becomes a space in the AT label.
    const plain = (el.innerText ?? el.textContent ?? "")
      .replace(/\s+/g, " ")
      .trim();
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const inners = splitIntoWords(el);
      if (!inners.length) return;

      // AT reads one continuous string, never word-soup.
      el.setAttribute("aria-label", plain);

      // Hide pre-paint (useLayoutEffect) — no flash of unmasked text.
      gsap.set(inners, { yPercent: 120 });

      let tween: gsap.core.Tween | null = null;
      let st: ScrollTrigger | null = null;

      // Lines are measured at reveal time, not split time — font swap and
      // layout settling can rewrap lines between hydration and reveal.
      const play = () => {
        const fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;
        const tolerance = fontSize * 0.6;
        const tops: number[] = [];
        const lineFor = inners.map((inner) => {
          const top = (inner.parentElement as HTMLElement).getBoundingClientRect().top;
          const hit = tops.findIndex((t) => Math.abs(t - top) < tolerance);
          if (hit !== -1) return hit;
          tops.push(top);
          return tops.length - 1;
        });

        tween = gsap.to(inners, {
          yPercent: 0,
          duration: 1.15,
          ease: "power4.out",
          delay,
          stagger: (i: number) => lineFor[i] * 0.095,
          onComplete: () => {
            gsap.set(inners, { clearProps: "transform" });
          },
        });
      };

      if (mode === "mount") {
        play();
      } else {
        st = ScrollTrigger.create({
          trigger: el,
          start: "top 86%",
          once: true,
          onEnter: play,
        });
      }

      return () => {
        st?.kill();
        tween?.kill();
        gsap.killTweensOf(inners);
        el.removeAttribute("aria-label");
        el.innerHTML = original;
      };
    });

    return () => mm.revert();
    // Split once per mount — heading content is static.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createElement(
    as,
    { ref: ref as RefObject<HTMLElement | null>, className, style },
    children,
  );
}

/* ------------------------------------------------------------------ */
/* usePrintReveal — images develop like prints.                        */
/* ------------------------------------------------------------------ */

export function usePrintReveal(
  ref: RefObject<HTMLElement | null>,
  opts: { enabled?: boolean; develop?: boolean; scale?: boolean } = {},
) {
  const { enabled = true, develop = true, scale = true } = opts;

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const media = el.querySelector<HTMLElement>("[data-reveal-media]");
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      // Initial state set pre-paint: the frame is sealed, the print unexposed.
      gsap.set(el, { clipPath: "inset(0% 0% 100% 0%)" });
      if (media && scale) {
        gsap.set(media, { scale: 1.12, transformOrigin: "50% 20%" });
      }
      if (media && develop) {
        gsap.set(media, { filter: "brightness(1.26) saturate(0.74) sepia(0.07)" });
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      // The wipe — the developer-bath edge travelling down the frame.
      tl.to(
        el,
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power4.inOut" },
        0,
      );
      if (media && scale) {
        tl.to(media, { scale: 1, duration: 1.7, ease: "power3.out" }, 0.05);
      }
      if (media && develop) {
        // The print settles into its full warmth (one-shot, not a hot path).
        tl.to(
          media,
          { filter: "brightness(1) saturate(1) sepia(0)", duration: 1.3, ease: "power2.inOut" },
          0.12,
        );
      }
      tl.set(el, { clearProps: "clipPath" });
      if (media) tl.set(media, { clearProps: "all" });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(el, { clearProps: "clipPath" });
        if (media) gsap.set(media, { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, [ref, enabled, develop, scale]);
}

/** Standalone wrapper form of the print reveal (wipe only by default). */
export function PrintReveal({
  children,
  className,
  develop = false,
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  develop?: boolean;
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  usePrintReveal(ref, { develop, scale });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LightSweep — the light follows the reader down the page.            */
/* ------------------------------------------------------------------ */

export function LightSweep() {
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const tween = gsap.fromTo(
        band,
        { yPercent: -55 },
        {
          yPercent: 55,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
          },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div aria-hidden="true" className="ss-lightsweep">
      <div ref={bandRef} className="ss-lightsweep__band" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — ultra-restrained magnetic pull on primary CTAs.          */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  strength = 0.16,
  className,
}: {
  children: ReactNode;
  /** Pull factor — capped at ±6px regardless. Keep it a whisper. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
      const CAP = 6;

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(Math.max(-CAP, Math.min(CAP, dx * strength)));
        yTo(Math.max(-CAP, Math.min(CAP, dy * strength)));
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        gsap.set(el, { x: 0, y: 0 });
      };
    });

    return () => mm.revert();
  }, [strength]);

  return (
    <div ref={ref} className={cn("inline-flex", className)}>
      {children}
    </div>
  );
}
