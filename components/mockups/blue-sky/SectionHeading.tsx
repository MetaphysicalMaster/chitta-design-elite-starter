"use client";

import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

/** Shared section heading with eyebrow + serif title + lead. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  invert = false,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Reveal>
        <p
          className={cn(
            "rule-gold text-xs font-semibold uppercase tracking-[0.22em]",
            align === "center" && "[&::after]:mx-auto",
            invert ? "text-white/80" : "text-[var(--color-accent)]",
          )}
        >
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          className={cn(
            "font-display mt-4 text-balance",
            invert ? "text-white" : "text-[var(--color-fg)]",
          )}
          style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06, fontWeight: 400 }}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-5 text-pretty text-[1.0625rem] leading-relaxed",
              invert ? "text-white/80" : "text-[var(--color-fg-muted)]",
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
