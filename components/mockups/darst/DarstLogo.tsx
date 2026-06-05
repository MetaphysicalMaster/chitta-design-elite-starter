/**
 * DarstLogo — the recreated Darst Dermatology wordmark, the practice's REAL
 * brand identity rendered as an inline CSS/SVG mark (no raster asset):
 *
 *   ╭─── thin teal swoosh arc ───╮
 *        Darst            ← warm-brown brush-script / serif-script wordmark
 *     D E R M A T O L O G Y   ← teal, letter-spaced caps
 *
 * The script "Darst" is set in the display serif's true italic (Newsreader)
 * for an elegant brush-script feel; "DERMATOLOGY" is the teal letter-spaced
 * caps line; a thin teal swoosh arc curves above the name. Typographic
 * treatment + tones live in brand.css (.dt-wordmark*). Two tones:
 *   - default: brown script + teal caps (on light surfaces)
 *   - tone="dark": warm-cream script + bright-teal caps (over the brown hero)
 *
 * Decorative swoosh is aria-hidden; the wordmark text carries the name.
 */

import { cn } from "@/lib/utils";

export function DarstLogo({
  tone = "light",
  className,
  /** Visual size of the script line (the caps line scales beneath it). */
  size = "md",
}: {
  tone?: "light" | "dark";
  className?: string;
  size?: "sm" | "md";
}) {
  const script = size === "sm" ? "text-[1.35rem]" : "text-[1.7rem]";
  const caps = size === "sm" ? "text-[0.5rem]" : "text-[0.58rem]";

  return (
    <span
      className={cn(
        "dt-wordmark",
        tone === "dark" && "dt-wordmark--on-dark",
        className,
      )}
    >
      {/* thin teal swoosh arc above the name */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 14"
        className="mb-0.5 h-2 w-[5.6rem] overflow-visible"
        fill="none"
      >
        <path
          d="M2 11 C 26 2, 78 1, 118 7"
          stroke="var(--teal-swoosh)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="118" cy="7" r="1.7" fill="var(--teal-swoosh)" />
      </svg>

      <span className={cn("dt-wordmark__script leading-none", script)}>
        Darst
      </span>
      <span className={cn("dt-wordmark__caps mt-1 leading-none", caps)}>
        Dermatology
      </span>
    </span>
  );
}
