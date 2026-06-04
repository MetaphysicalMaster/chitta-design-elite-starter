"use client";

/**
 * Services — the real treatment menu grouped into three couture categories,
 * each with PRICE ANCHORS (their real site hides pricing entirely). An
 * accessible tab/segmented control switches groups; cards reveal on view.
 */

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

type Service = { name: string; note: string; from: string };
type Group = {
  id: string;
  label: string;
  blurb: string;
  services: Service[];
};

const GROUPS: Group[] = [
  {
    id: "injectables",
    label: "Injectables",
    blurb: "Neuromodulators, filler & biostimulators — artfully dosed.",
    services: [
      { name: "Botox / Dysport", note: "Per unit · expert injector", from: "$12/unit" },
      { name: "Daxxify", note: "Longer-lasting tox", from: "$16/unit" },
      { name: "Dermal Fillers", note: "Lips · cheeks · jawline", from: "$650/syringe" },
      { name: "Sculptra", note: "Collagen biostimulator", from: "$850/vial" },
      { name: "PRF / EZ Gel", note: "Natural under-eye & glow", from: "$550" },
    ],
  },
  {
    id: "laser",
    label: "Laser & Skin",
    blurb: "Resurfacing, tightening & tone — clinical-grade platforms.",
    services: [
      { name: "Morpheus8", note: "RF microneedling · firm + tighten", from: "$900/session" },
      { name: "BBL HERO", note: "Broadband light · tone & redness", from: "$450" },
      { name: "MOXI", note: "Gentle laser resurfacing", from: "$500" },
      { name: "IPL Photofacial", note: "Sun damage & vascular", from: "$350" },
      { name: "Microneedling", note: "Texture & pores", from: "$300" },
      { name: "Laser Resurfacing", note: "Deep renewal", from: "$750" },
    ],
  },
  {
    id: "wellness",
    label: "Body & Wellness",
    blurb: "Contouring, weight, hormones & IV — head-to-toe vitality.",
    services: [
      { name: "Body Contouring", note: "Non-invasive sculpting", from: "$600/area" },
      { name: "Medical Weight Loss", note: "Semaglutide program", from: "$299/mo" },
      { name: "IV Therapy", note: "Hydration & recovery drips", from: "$150" },
      { name: "BHRT", note: "Bioidentical hormone therapy", from: "Consult" },
      { name: "Peptide Therapy", note: "Performance & longevity", from: "Consult" },
      { name: "Signature Facials", note: "Medical-grade glow", from: "$175" },
    ],
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Services() {
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState(GROUPS[0].id);
  const group = GROUPS.find((g) => g.id === active) ?? GROUPS[0];

  return (
    <section
      id="services"
      className="grain relative scroll-mt-24 overflow-hidden bg-[var(--emerald-abyss)] py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(50% 40% at 88% 0%, var(--emerald-mid), transparent 66%), radial-gradient(46% 42% at 6% 100%, oklch(40% 0.07 90 / 0.5), transparent 68%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The Menu"
          title={
            <>
              Every treatment, <span className="gold-leaf italic">priced in the open.</span>
            </>
          }
          lead="No more guessing. We list real starting prices for every service — transparency is part of the luxury. Final plans are tailored at your consult."
        />

        {/* Segmented control */}
        <div
          role="tablist"
          aria-label="Treatment categories"
          className="mt-12 inline-flex flex-wrap gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--glass-bg)] p-1.5 backdrop-blur-md"
        >
          {GROUPS.map((g) => {
            const selected = g.id === active;
            return (
              <button
                key={g.id}
                role="tab"
                id={`tab-${g.id}`}
                aria-selected={selected}
                aria-controls={`panel-${g.id}`}
                onClick={() => setActive(g.id)}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]",
                  selected
                    ? "text-[var(--color-accent-fg)]"
                    : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="luxe-service-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--color-accent)]"
                    transition={{ duration: prefersReduced ? 0 : 0.4, ease }}
                  />
                )}
                {g.label}
              </button>
            );
          })}
        </div>

        <p className="mt-5 max-w-xl text-sm text-[var(--color-fg-subtle)]">
          {group.blurb}
        </p>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.ul
            key={group.id}
            id={`panel-${group.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${group.id}`}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : -10 }}
            transition={{ duration: prefersReduced ? 0 : 0.4, ease }}
            className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3"
          >
            {group.services.map((s) => (
              <li
                key={s.name}
                className="group flex flex-col justify-between gap-6 bg-[oklch(20%_0.03_166_/_0.55)] p-7 backdrop-blur-sm transition-colors duration-300 hover:bg-[oklch(25%_0.04_162_/_0.65)]"
              >
                <div>
                  <h3 className="font-display text-2xl text-[var(--color-fg)]">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {s.note}
                  </p>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                    From
                  </span>
                  <span className="font-display text-xl text-[var(--gold)]">
                    {s.from}
                  </span>
                </div>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#book"
              className={cn(
                "inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-fg)]",
                "shadow-[0_14px_40px_-16px_oklch(80%_0.13_86_/_0.6)] transition-transform duration-300 hover:-translate-y-0.5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-bright)]",
              )}
            >
              Reserve a consult
              <span aria-hidden>→</span>
            </Link>
            <p className="text-sm text-[var(--color-fg-subtle)]">
              Prices shown are starting points · CareCredit financing available.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
