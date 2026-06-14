"use client";

/**
 * Unified — the strategic centerpiece. Their real pain is a FRAGMENTED brand:
 * a marketing site + a separate Shopify shop + a WellnessLiving booking
 * redirect. This section visually FUSES Treat · Shop · Belong into ONE brand
 * surface on a single dark editorial field — one place, one identity.
 */

import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "./primitives";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    key: "treat",
    label: "Treat",
    title: "Book any treatment",
    desc: "Injectables, lasers, facials & wellness — scheduled in seconds, in a calm, judgment-free studio built around you.",
    cta: "Book a visit",
    href: "#book",
  },
  {
    key: "shop",
    label: "Shop",
    title: "Shop your routine",
    desc: "Medical-grade skincare in the same place you book — your cart, your records, one gentle login.",
    cta: "Browse the shelf",
    href: "#book",
  },
  {
    key: "belong",
    label: "Belong",
    title: "Become a member",
    desc: "$149/mo of banked credit toward anything above — the loyalty layer that ties it all together.",
    cta: "See membership",
    href: "#membership",
  },
];

export function Unified() {
  return (
    <section
      aria-label="One brand for treatments, shop and membership"
      className="grain relative overflow-hidden bg-[var(--ink-deep)] py-24 text-[var(--color-bg)] sm:py-32"
    >
      {/* molten aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(46% 40% at 12% 4%, var(--glow-rose), transparent 60%), radial-gradient(50% 44% at 92% 100%, var(--glow-bronze), transparent 62%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <p className="rule-bronze inline-block text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              One Brand · One Place
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="font-display mt-5 text-balance text-[var(--color-bg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.04 }}
            >
              Treatments, shop and membership —{" "}
              <span className="text-molten font-em">all in one warm place.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className="mt-5 text-pretty font-light text-[var(--color-bg)]/75"
              style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.55 }}
            >
              Book a treatment, shop your routine, and grow your membership credit
              — all under one beautiful, seamless brand. One login, one cart, one
              relationship built around your wellness journey.
            </p>
          </Reveal>
        </div>

        <RevealGroup
          stagger={0.1}
          className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[var(--glass-dark-border)] md:grid-cols-3"
        >
          {PILLARS.map((p, i) => (
            <RevealItem
              key={p.key}
              className={cn(
                "group relative flex flex-col bg-[oklch(24%_0.02_38_/_0.5)] p-8 backdrop-blur-sm transition-colors duration-300 hover:bg-[oklch(28%_0.03_36_/_0.6)]",
              )}
            >
              <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--glow-gold)]">
                0{i + 1} · {p.label}
              </span>
              <h3 className="font-display mt-4 text-2xl text-[var(--color-bg)]">
                {p.title}
              </h3>
              <p className="mt-3 flex-1 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-bg)]/70">
                {p.desc}
              </p>
              <Link
                href={p.href}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-bg)] underline-offset-4 transition-colors hover:text-[var(--glow-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glow-gold)]"
              >
                {p.cta}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-[var(--color-bg)]/55">
            One login · one cart · one set of records · one beautiful brand.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
