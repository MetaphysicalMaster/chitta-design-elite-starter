/**
 * BeautoxLogo — the recreated Beautox Bar identity, the brand's REAL mark: a
 * thin-line MARTINI GLASS with a SYRINGE dipped into it (olive on the plunger
 * top) inside a double-ring circle, beside the "BEAUTOX BAR" serif wordmark.
 * This martini-meets-syringe roundel IS the whole "Where Shots & Beauty Mingle"
 * pun — the brand's entire identity — so we render it as a crisp inline SVG
 * (scales razor-sharp, recolors with the surface) rather than a raster.
 *
 * `variant`:
 *   - "lockup" (default): roundel mark + the BEAUTOX BAR wordmark (for the nav).
 *   - "mark": just the roundel (for tight spaces / the footer bug).
 * `tone`:
 *   - "ink"  : charcoal mark + ink wordmark (on light surfaces).
 *   - "light": white mark + white wordmark (over the black hero).
 * The wordmark is intentionally MONOCHROME (currentColor) to match the real
 * logo.png exactly — the playful hot-pink lives in the page's candy-text, never
 * in the identity lockup itself.
 *
 * The SVG is aria-hidden; an adjacent visually-hidden text (or the wordmark
 * itself) carries the accessible name via the wrapping link's aria-label.
 */

import { cn } from "@/lib/utils";

/** The martini-glass-with-a-syringe roundel — thin-line, single stroke color. */
function MartiniSyringeMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* double-ring circle frame */}
      <circle cx="50" cy="50" r="44" strokeWidth={2} />
      <circle cx="50" cy="50" r="40.5" strokeWidth={3} />

      {/* martini glass — V bowl (rim line + the two diagonals), stem, foot */}
      <path d="M28 40 H72" />
      <path d="M28 40 L50 64" />
      <path d="M72 40 L50 64" />
      <path d="M50 64 V80" />
      <path d="M39 82 H61" />

      {/* syringe — barrel dipped diagonally into the glass, lower-left to
          upper-right, with finger flange, plunger rod and the olive on top */}
      {/* barrel */}
      <path d="M44 58 L62 40" strokeWidth={3} />
      {/* finger flange across the barrel base */}
      <path d="M41.5 52.5 L47.5 58.5" />
      {/* plunger rod continuing past the barrel toward the olive */}
      <path d="M62 40 L70 32" strokeWidth={2.2} />
      {/* a couple of barrel graduation ticks */}
      <path d="M50 52 L53 55" strokeWidth={1.6} />
      <path d="M54 48 L57 51" strokeWidth={1.6} />

      {/* the olive — filled dot on the plunger top (the garnish / shot) */}
      <circle cx="73.5" cy="28.5" r="4.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BeautoxLogo({
  variant = "lockup",
  tone = "ink",
  className,
  /** Visual height of the roundel mark; the wordmark scales beside it. */
  size = "md",
  /** Show the letter-spaced "MEDSPA" descriptor under the name (from the real
   *  specials lockup) — used on the footer / larger lockups. */
  descriptor = false,
}: {
  variant?: "lockup" | "mark";
  tone?: "ink" | "light";
  className?: string;
  size?: "sm" | "md" | "lg";
  descriptor?: boolean;
}) {
  const markSize =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const wordSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  const markColor = tone === "light" ? "text-[var(--color-bg)]" : "text-[var(--color-fg)]";

  if (variant === "mark") {
    return <MartiniSyringeMark className={cn(markSize, markColor, className)} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <MartiniSyringeMark className={cn(markSize, markColor, "shrink-0")} />
      {/* The recreated BEAUTOX BAR lockup: ALL-CAPS engraved-Garamond name, the
          signature center-dot divider rule beneath it, and (optionally) the
          MEDSPA descriptor — matching the real logo.png / specials lockup. */}
      <span
        className={cn(
          "bx-wordmark",
          tone === "light" && "bx-wordmark--on-dark",
          wordSize,
        )}
      >
        {/* The real logo.png is a fully MONOCHROME, high-contrast ALL-CAPS
            Didone "BEAUTOX BAR" — no pink in the mark. Render it as a single
            currentColor run so the identity lockup (nav + footer, the two
            highest-frequency surfaces) matches the real mark exactly; the
            playful hot-pink lives in the headline candy-text, not the logotype. */}
        <span className="bx-wordmark__name whitespace-nowrap">Beautox Bar</span>
        <span aria-hidden className="bx-wordmark__rule" />
        {descriptor && (
          <span aria-hidden className="bx-wordmark__descriptor">
            Medspa
          </span>
        )}
      </span>
    </span>
  );
}
