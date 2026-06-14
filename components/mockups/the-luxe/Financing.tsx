"use client";

/**
 * Financing — CareCredit + Cherry callout. Positions premium care as accessible
 * without cheapening the brand: a single elegant gold-framed band on a warm
 * marble ground.
 */

import Link from "next/link";
import { Reveal } from "./primitives";
import { cn } from "@/lib/utils";

export function Financing() {
  return (
    <section
      aria-label="Financing with CareCredit and Cherry"
      className="relative overflow-hidden bg-[var(--color-bg)] py-20 sm:py-24"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--marble)] p-8 shadow-[0_30px_80px_-50px_oklch(50%_0.04_70_/_0.5)] sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(54% 120% at 92% 50%, var(--peach), transparent 66%), radial-gradient(40% 90% at 4% 20%, var(--gold-pale), transparent 60%)",
              }}
            />
            <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow rule-gold inline-block text-[0.7rem] text-[var(--gold-deep)]">
                  Financing
                </p>
                <h2
                  className="font-display mt-4 text-balance text-[var(--color-fg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
                >
                  Luxury, <span className="gold-leaf italic">on your terms.</span>
                </h2>
                <p className="mt-4 text-pretty font-light text-[var(--color-fg-muted)]">
                  We proudly offer{" "}
                  <span className="font-normal text-[var(--color-fg)]">CareCredit</span>{" "}
                  and{" "}
                  <span className="font-normal text-[var(--color-fg)]">Cherry</span>{" "}
                  payment plans — flexible monthly options, including
                  interest-free terms, so you can begin your treatment plan now
                  and pay over time. Ask your concierge to apply in minutes.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="#book"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--color-accent-fg)]",
                    "shadow-[0_16px_44px_-16px_oklch(70%_0.12_78_/_0.6)] transition-transform duration-300 hover:-translate-y-0.5",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-deep)]",
                  )}
                >
                  Apply for financing
                  <span aria-hidden>→</span>
                </Link>
                <span className="text-center text-xs text-[var(--color-fg-subtle)] lg:text-left">
                  Subject to credit approval.
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
