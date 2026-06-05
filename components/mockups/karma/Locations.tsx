"use client";

/**
 * Locations — THE CLOSER. A two-metro switcher (Lee's Summit / Overland Park)
 * paired with the "injectables meets wellness" service duality.
 *
 * This is the SEO-consolidation story made visual: ONE canonical home that
 * quietly retires the still-indexed `testkc.com` staging leak and the bare
 * Square booking redirect. The switcher tabs between the two metros — each with
 * semantic NAP and its own Book CTA — while the duality panel shows how
 * injectables and whole-body wellness balance under one brand. Fully keyboard
 * operable (real tablist + tabpanel semantics). Reduced-motion safe.
 */

import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionHeading, Reveal } from "./primitives";
import { BrandImage } from "./BrandImage";
import { METROS, BRAND, type Metro } from "./nap";
import { cn } from "@/lib/utils";

const DUALITY = [
  {
    side: "Beauty",
    tone: "sage" as const,
    title: "Injectables, refined",
    body: "Tox, dermal filler, lip enhancement and skin — placed by clinicians, dosed for balance. Natural, never overdone.",
    items: ["Neurotoxin (tox)", "Dermal filler", "Lip enhancement", "Medical-grade skin"],
  },
  {
    side: "Wellness",
    tone: "terra" as const,
    title: "Whole-body wellness",
    body: "Physician-guided medical weight-loss, hormone & vitality support, and IV wellness — care that treats the whole you, not just the mirror.",
    items: ["Medical weight-loss", "Hormone & vitality", "IV & injectables", "Wellness consults"],
  },
];

function MetroPanel({ metro }: { metro: Metro }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      key={metro.id}
      initial={prefersReduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-8 lg:grid-cols-2 lg:items-center"
    >
      <BrandImage
        alt={`The ${metro.city} ${BRAND.shortName} studio — calm, botanical treatment rooms`}
        aspect="16:11"
        tone={metro.flagship ? "sage" : "terra"}
        radius="2xl"
        scrim="soft"
        parallax
      >
        <div className="absolute inset-0 flex items-end p-6">
          <div>
            {metro.flagship && (
              <span className="mb-2 inline-block rounded-full bg-[oklch(98%_0.01_110_/_0.9)] px-2.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
                The original home
              </span>
            )}
            <p className="font-display text-2xl font-semibold text-white drop-shadow-[0_2px_12px_oklch(22%_0.03_130_/_0.8)]">
              {metro.city}
              <span className="ml-2 align-middle text-base font-normal text-[oklch(96%_0.02_110_/_0.9)]">
                {metro.state}
              </span>
            </p>
          </div>
        </div>
      </BrandImage>

      <div>
        <p className="text-sm font-medium text-[var(--color-accent-deep)]">
          {metro.region}
        </p>
        <p className="mt-2 text-pretty text-[var(--color-fg-muted)]">
          {metro.tagline}
        </p>

        {/* Semantic, per-metro NAP — all under ONE canonical domain */}
        <address className="mt-6 not-italic">
          <p className="text-base text-[var(--color-fg)]">
            {metro.street}, {metro.city}, {metro.state} {metro.zip}
          </p>
          <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">
            {metro.hours}
          </p>
          <p className="mt-1.5 text-sm text-[var(--color-fg-subtle)]">
            {metro.emphasis}
          </p>
          <a
            href={`tel:${metro.tel}`}
            className="mt-3 inline-block text-lg font-semibold tnum text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            {metro.phone}
          </a>
        </address>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="#book"
            className={cn(
              "group inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold",
              "earth-pill text-[var(--color-accent-fg)]",
              "shadow-[0_14px_36px_-16px_oklch(43%_0.066_147_/_0.6)]",
              "transition-transform duration-300 hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
            )}
          >
            Book {metro.city}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <a
            href={`https://maps.google.com/?q=${metro.mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-medium text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent-deep)] hover:text-[var(--color-accent-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Directions
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function Locations() {
  const tablistId = useId();
  const [active, setActive] = useState(METROS[0].id);
  const activeMetro = METROS.find((m) => m.id === active) ?? METROS[0];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = METROS.findIndex((m) => m.id === active);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive(METROS[(idx + 1) % METROS.length].id);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive(METROS[(idx - 1 + METROS.length) % METROS.length].id);
    }
  };

  return (
    <section
      id="locations"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="One brand · Two metros"
            title={
              <>
                Two cities.{" "}
                <span className="balance-text">One Karma.</span>
              </>
            }
            lead="Lee's Summit and Overland Park live under one design system, one domain and one booking flow — so your search footprint compounds instead of competing with itself. Pick your metro."
          />
          <Reveal className="max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
              The consolidation
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              One authoritative home at{" "}
              <span className="font-medium text-[var(--color-fg)]">
                {BRAND.domain}
              </span>{" "}
              — quietly retiring the still-indexed{" "}
              <span className="text-terra-deep">testkc.com</span> staging leak and
              the bare Square redirect that split the brand in two.
            </p>
          </Reveal>
        </div>

        {/* Metro switcher — real tablist semantics */}
        <div className="mt-12">
          <div
            role="tablist"
            aria-label="Choose a metro"
            onKeyDown={onKeyDown}
            className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-1"
          >
            {METROS.map((m) => {
              const selected = active === m.id;
              return (
                <button
                  key={m.id}
                  role="tab"
                  id={`${tablistId}-tab-${m.id}`}
                  aria-selected={selected}
                  aria-controls={`${tablistId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(m.id)}
                  className={cn(
                    "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                    selected
                      ? "text-[var(--color-accent-fg)]"
                      : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId={`${tablistId}-pill`}
                      className="absolute inset-0 -z-10 rounded-full earth-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {m.city}
                  <span className="ml-1.5 hidden text-[0.7rem] font-normal opacity-80 sm:inline">
                    {m.state}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${tablistId}-panel`}
            aria-labelledby={`${tablistId}-tab-${activeMetro.id}`}
            className="mt-9 rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--glass-shadow)] sm:p-8"
          >
            <AnimatePresence mode="wait">
              <MetroPanel metro={activeMetro} />
            </AnimatePresence>
          </div>
        </div>

        {/* The duality — injectables meets wellness */}
        <Reveal className="mt-16" delay={0.05}>
          <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 sm:p-9">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-deep)]">
              The balance
            </p>
            <h3 className="mt-3 text-center font-display text-2xl font-medium text-[var(--color-fg)] sm:text-3xl">
              Where injectables meet wellness.
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--color-fg-muted)]">
              Karma isn&rsquo;t only a med spa, and isn&rsquo;t only a wellness
              clinic — it&rsquo;s the equilibrium between them.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {DUALITY.map((d) => (
                <div
                  key={d.side}
                  className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full blur-2xl",
                      d.tone === "sage"
                        ? "bg-[var(--color-accent)]/25"
                        : "bg-[var(--terra)]/25",
                    )}
                  />
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.2em]",
                      d.tone === "sage" ? "text-[var(--color-accent-deep)]" : "text-terra-deep",
                    )}
                  >
                    {d.side}
                  </p>
                  <h4 className="mt-2 font-display text-xl font-medium text-[var(--color-fg)]">
                    {d.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {d.body}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {d.items.map((it) => (
                      <li
                        key={it}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium",
                          d.tone === "sage"
                            ? "border-[var(--color-accent)]/30 bg-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]"
                            : "border-[var(--terra)]/30 bg-[var(--terra-subtle)] text-terra-deep",
                        )}
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
