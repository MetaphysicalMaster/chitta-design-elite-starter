"use client";

/**
 * Financing — a discreet callout on the emerald-night surface. River Oaks
 * doesn't lead with price, so this is framed as access/flexibility, not a sale.
 * Cherry / CareCredit-style monthly plans, presented with couture restraint.
 */

import Link from "next/link";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

export function Financing() {
  return (
    <section
      aria-label="Flexible payment"
      className="relative overflow-hidden bg-[var(--night-0)] py-20 sm:py-24"
    >
      {/* faint gold caustic wash so the dark block feels jewel-lit, never flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 90% at 82% 30%, oklch(80% 0.1 86 / 0.16), transparent 60%), radial-gradient(50% 80% at 12% 80%, oklch(52% 0.13 162 / 0.22), transparent 64%)",
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 sm:px-8 md:flex-row md:items-center md:justify-between">
        <Reveal className="max-w-xl">
          <p className="eyebrow rule-gold text-[var(--gold)]">
            Membership &amp; financing
          </p>
          <h2
            className="font-display mt-5 text-balance text-[var(--color-bg)]"
            style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.06 }}
          >
            The standard of River Oaks,{" "}
            <span className="gold-leaf--bright gold-leaf-anim font-display-em">
              on your terms.
            </span>
          </h2>
          <p className="mt-5 max-w-[48ch] text-pretty font-light text-[oklch(90%_0.02_120_/_0.86)]">
            Spread treatment over interest-free monthly plans through Cherry,
            or join the Sousan Circle for member pricing on HydraFacial,
            injectables and IPL. Quiet flexibility — never a hard sell.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-3">
            {[
              { v: "$0", k: "down on qualifying plans" },
              { v: "0% APR", k: "interest-free options" },
              { v: "Members", k: "save on every visit" },
            ].map((s) => (
              <div
                key={s.k}
                className="glass-dark flex items-baseline gap-3 rounded-2xl px-5 py-3.5"
              >
                <span className="font-display text-2xl text-[var(--gold-bright)] tnum">
                  {s.v}
                </span>
                <span className="text-sm text-[oklch(90%_0.02_120_/_0.86)]">
                  {s.k}
                </span>
              </div>
            ))}
            <Link
              href="#book"
              className={cn(
                "mt-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3",
                "bg-[var(--gold)] font-semibold text-[oklch(28%_0.06_70)]",
                "shadow-[0_16px_44px_-16px_oklch(80%_0.12_86_/_0.55)] transition-transform duration-300 hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
              )}
            >
              Check my options
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
