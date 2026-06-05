"use client";

/**
 * HappyLogo — a faithful recreation of the live happyclinicdenver.com identity:
 * a rounded-square mark containing a white SWIRL/SPIRAL glyph, set beside a
 * two-line wordmark — "HAPPY CLINIC®" (bold) over "DENVER" (letter-spaced caps).
 *
 * Themeable: the default tone is pine-teal-on-light (mark filled pine-teal,
 * wordmark teal/navy). Pass `tone="dark"` for the white-on-navy hero/footer
 * state. CSS-only + an inline SVG spiral, so it stays crisp at any size and
 * recolors purely via the brand tokens (.hc-mark / .hc-wordmark in brand.css).
 */

import { cn } from "@/lib/utils";

/* A clean white spiral glyph — a single Archimedean swirl curling inward, the
   medspa "swirl" mark. Stroke uses currentColor so it inherits the mark fg. */
function Swirl({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 3.2c4.6 0 8.3 3.5 8.3 7.9 0 3.9-3.2 7-7.1 7-3.4 0-6.1-2.7-6.1-6 0-2.9 2.3-5.2 5.2-5.2 2.5 0 4.5 2 4.5 4.4 0 2.1-1.7 3.8-3.8 3.8-1.8 0-3.2-1.4-3.2-3.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HappyLogo({
  tone = "light",
  size = "md",
  className,
}: {
  tone?: "light" | "dark";
  /** sm = compact nav, md = default, lg = footer hero */
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const MARK = {
    sm: "h-9 w-9 [&_svg]:h-5 [&_svg]:w-5",
    md: "h-10 w-10 [&_svg]:h-[1.4rem] [&_svg]:w-[1.4rem]",
    lg: "h-12 w-12 [&_svg]:h-7 [&_svg]:w-7",
  }[size];
  const NAME = {
    sm: "text-[0.95rem]",
    md: "text-[1.05rem]",
    lg: "text-[1.2rem]",
  }[size];
  const CITY = {
    sm: "text-[0.5rem]",
    md: "text-[0.55rem]",
    lg: "text-[0.62rem]",
  }[size];

  return (
    <span
      className={cn(
        "hc-wordmark-wrap inline-flex items-center gap-2.5",
        tone === "dark" && "hc-logo--on-dark",
        className,
      )}
    >
      <span aria-hidden className={cn("hc-mark", MARK)}>
        <Swirl />
      </span>
      <span className="hc-wordmark">
        <span className={cn("hc-wordmark__name", NAME)}>
          HAPPY CLINIC<span className="hc-wordmark__reg">®</span>
        </span>
        <span className={cn("hc-wordmark__city mt-1", CITY)}>Denver</span>
      </span>
    </span>
  );
}
