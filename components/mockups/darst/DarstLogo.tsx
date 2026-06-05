/**
 * DarstLogo — the Darst Dermatology wordmark, the practice's REAL brand identity.
 *
 * The real mark (public/clients/darst/logo.png) is a warm-brown BRUSH-SCRIPT
 * "Darst" — a long sweeping tail off the script with a small teal swoosh hooked
 * through the cap — over "DERMATOLOGY" in teal letter-spaced caps. It is
 * dark-on-transparent, so it reads beautifully on the light/frosted surfaces
 * (nav once scrolled, footer) but would vanish over the espresso hero.
 *
 * Strategy (brand-fidelity first):
 *   - tone="light"  → render the REAL logo.png (canonical mark). This is the
 *     element a client checks first for "is this us".
 *   - tone="dark"   → render the CSS/SVG recreation recolored to cream + bright
 *     teal, since logo.png is dark-on-transparent and won't read over the brown
 *     hero. A faithful stand-in for the one surface the raster can't serve.
 *
 * Decorative swoosh (dark variant) is aria-hidden; the alt / wordmark text
 * carries the name either way.
 */

import { cn } from "@/lib/utils";

/* Real mark intrinsic size — 267 × 75 (≈3.56:1). Heights below derive widths
   from that ratio so the <img> reserves exact space (zero CLS). */
const LOGO_RATIO = 267 / 75;
const LOGO_H = { sm: 26, md: 30 } as const;

export function DarstLogo({
  tone = "light",
  className,
  /** Visual size of the mark. */
  size = "md",
}: {
  tone?: "light" | "dark";
  className?: string;
  size?: "sm" | "md";
}) {
  // On light/frosted surfaces, use the real logo asset — the canonical mark.
  if (tone === "light") {
    const h = LOGO_H[size];
    return (
      <img
        src="/clients/darst/logo.png"
        alt="Darst Dermatology"
        width={Math.round(h * LOGO_RATIO)}
        height={h}
        decoding="async"
        className={cn("block w-auto", className)}
        style={{ height: h }}
      />
    );
  }

  // On the dark espresso hero, the dark-on-transparent PNG won't read — render
  // the faithful CSS/SVG recreation recolored to cream + bright teal. Tuned to
  // the REAL mark's proportions (verified against logo.png): a SHORT teal
  // brushstroke hooked over the left third (the "Da"), NOT a full-width arc, and
  // the signature long sweeping SCRIPT TAIL flicking right off the final "t".
  // Both strokes scale WITH the script line (em-based) so they stay registered
  // to the wordmark at any size.
  const script = size === "sm" ? "text-[1.35rem]" : "text-[1.7rem]";
  const caps = size === "sm" ? "text-[0.5rem]" : "text-[0.58rem]";

  return (
    <span className={cn("dt-wordmark dt-wordmark--on-dark", className)}>
      {/* SHORT teal brushstroke over the LEFT third (the "Da") — a tapered
          brush hook, not a thin arc spanning the whole word. Matches the real
          mark where the teal stroke caps only the first letters. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 14"
        className="dt-wordmark__swoosh mb-0.5 h-2.5 overflow-visible"
        fill="none"
      >
        <path
          d="M6 10.5 C 16 3.5, 34 2.5, 46 6.5"
          stroke="var(--teal-swoosh)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <span className="dt-wordmark__line relative inline-flex">
        <span className={cn("dt-wordmark__script leading-none", script)}>
          Darst
        </span>
        {/* The long BROWN script tail — the wordmark's signature flourish,
            sweeping right off the final "t" and well past the word, exactly as
            the real logo's brush tail does. Absolutely positioned along the
            script baseline so it reads as one continuous gesture; aria-hidden
            (the wordmark text carries the name). */}
        <svg
          aria-hidden="true"
          viewBox="0 0 160 24"
          preserveAspectRatio="none"
          className="dt-wordmark__tail pointer-events-none absolute left-[80%] top-[64%] h-[0.85em] w-[1.55em] overflow-visible"
          fill="none"
        >
          <path
            d="M2 16 C 36 22, 96 16, 158 9"
            stroke="var(--wm-script)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className={cn("dt-wordmark__caps mt-1 leading-none", caps)}>
        Dermatology
      </span>
    </span>
  );
}
