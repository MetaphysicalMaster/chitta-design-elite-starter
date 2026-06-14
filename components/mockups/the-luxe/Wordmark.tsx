/**
 * Wordmark — the recreated The Luxe MedSpa lockup: an elegant GOLD SCRIPT
 * "The Luxe" over a small spaced uppercase "MEDSPA" rule, matching the live
 * brand mark. Rendered with the brand fonts (Pinyon Script + Jost) + the
 * `.gold-leaf` foil gradient, so it scales crisply and inherits the brand gold.
 *
 * Pure presentational, no client hooks — safe inside server or client trees.
 * `tone="light"` (default) is for light grounds; `tone="onDark"` brightens the
 * script for dark footers/CTAs.
 */

import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "onDark";
}) {
  return (
    <span
      className={cn("inline-flex select-none flex-col items-center leading-none", className)}
      style={{ width: "fit-content" }}
    >
      <span
        aria-hidden
        className="font-script gold-leaf"
        style={{ fontSize: "1.9em", lineHeight: 0.86 }}
      >
        The&nbsp;Luxe
      </span>
      <span
        aria-hidden
        className={cn(
          "font-sans mt-0.5 flex w-full items-center justify-center gap-1.5",
          tone === "onDark" ? "text-[var(--gold-pale)]" : "text-[var(--color-fg-muted)]",
        )}
        style={{
          fontSize: "0.42em",
          letterSpacing: "0.42em",
          fontWeight: 500,
          textTransform: "uppercase",
        }}
      >
        <span aria-hidden className="block h-px w-3 bg-current opacity-50" />
        MedSpa
        <span aria-hidden className="block h-px w-3 bg-current opacity-50" />
      </span>
    </span>
  );
}
