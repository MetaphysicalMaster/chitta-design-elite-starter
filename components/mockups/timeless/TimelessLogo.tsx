/**
 * TimelessLogo — the recreated Timeless Aesthetics MedSpa wordmark, the
 * practice's REAL brand identity rendered as an inline CSS/SVG mark (no raster
 * asset):
 *
 *   ·  ° ·         timeless          ← lowercase, light, charcoal
 *  ° · ° ·        aesthetics         ← lowercase, light, charcoal
 *   · °            medspa            ← smaller + ORANGE, letter-spaced
 *
 * The mark is a scattered cluster of small bokeh DOTS (orange + warm grey) —
 * out-of-focus light circles forming an abstract bubble cluster, echoing the
 * live site's bokeh hero. Beside it, the lowercase three-line wordmark, all
 * Open Sans: "timeless" + "aesthetics" set light in warm charcoal, "medspa"
 * smaller, semibold and in the brand orange. Typographic treatment + tones
 * live in brand.css (.tl-wordmark*).
 *
 * The dot cluster is decorative (aria-hidden); the wordmark text carries the
 * name. Two tones via `tone` — both keep charcoal/orange text because the whole
 * site (incl. the hero) is light; `tone="dark"` exists for symmetry with the
 * sibling builds' API and simply re-asserts the charcoal ink.
 */

import { cn } from "@/lib/utils";

/* A scattered bokeh dot-cluster — soft out-of-focus circles in orange + warm
   grey. Sizes/opacities vary to read as depth-of-field bubbles, not a grid. */
function DotCluster({ px }: { px: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      width={px}
      height={px}
      className="shrink-0 overflow-visible"
      role="presentation"
    >
      {/* large soft orange focal bubble */}
      <circle cx="14" cy="19" r="8.5" fill="var(--color-accent)" opacity="0.92" />
      {/* mid orange, lighter */}
      <circle cx="27" cy="13" r="5" fill="var(--brass)" opacity="0.7" />
      {/* warm-grey companion */}
      <circle cx="29" cy="26" r="4" fill="oklch(62% 0.004 60)" opacity="0.55" />
      {/* small pale-peach glints */}
      <circle cx="22" cy="24" r="2.4" fill="var(--brass-pale)" opacity="0.95" />
      <circle cx="33" cy="19" r="1.8" fill="var(--color-accent)" opacity="0.6" />
      <circle cx="9" cy="9" r="2" fill="oklch(62% 0.004 60)" opacity="0.5" />
      <circle cx="18" cy="9" r="1.5" fill="var(--brass)" opacity="0.8" />
      {/* tiny scattered specks for bokeh depth */}
      <circle cx="6" cy="27" r="1.3" fill="var(--brass-pale)" opacity="0.85" />
      <circle cx="35" cy="31" r="1.2" fill="oklch(62% 0.004 60)" opacity="0.45" />
    </svg>
  );
}

export function TimelessLogo({
  tone = "light",
  className,
  /** Visual size of the wordmark lines (the dot cluster scales with it). */
  size = "md",
}: {
  tone?: "light" | "dark";
  className?: string;
  size?: "sm" | "md";
}) {
  const l1 = size === "sm" ? "text-[0.95rem]" : "text-[1.18rem]";
  const l3 = size === "sm" ? "text-[0.58rem]" : "text-[0.68rem]";
  const dot = size === "sm" ? 30 : 38;

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <DotCluster px={dot} />
      <span
        className={cn(
          "tl-wordmark",
          tone === "dark" && "tl-wordmark--on-dark",
        )}
      >
        <span className={cn("tl-wordmark__l1", l1)}>timeless</span>
        <span className={cn("tl-wordmark__l2", l1)}>aesthetics</span>
        <span className={cn("tl-wordmark__l3 mt-0.5", l3)}>medspa</span>
      </span>
    </span>
  );
}
