"use client";

/**
 * Services — elegant card grid of the real treatment menu, with motion hover.
 * Fixes the real site's generic repetitive titles by giving each service a
 * clear name, plain-language description, and a "from" price anchor.
 */

import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "./Reveal";
import { cn } from "@/lib/utils";

type Service = {
  name: string;
  blurb: string;
  from: string;
  tag: string;
  d: string;
};

const SERVICES: Service[] = [
  {
    name: "Botox & Neurotoxins",
    blurb: "Soften frown lines, forehead and crow's feet with a natural, never-frozen finish.",
    from: "from $12 / unit",
    tag: "Injectables",
    d: "M12 2v6m0 8v6m10-10h-6M8 12H2m13.5-5.5L17 5M7 17l-1.5 1.5m11-1.5L17 19M7 7 5.5 5.5",
  },
  {
    name: "Dermal Fillers",
    blurb: "Restore volume to lips, cheeks and jawline with precise, balanced sculpting.",
    from: "from $650",
    tag: "Injectables",
    d: "M12 3c3.5 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2.5-6 6-10Z",
  },
  {
    name: "Sculptra",
    blurb: "Collagen-stimulating treatment for gradual, long-lasting facial restoration.",
    from: "from $850",
    tag: "Bio-stimulator",
    d: "M12 2 4 7v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V7l-8-5Z",
  },
  {
    name: "Microneedling & PRP",
    blurb: "Collagen induction with your own platelet-rich plasma for radiant texture.",
    from: "from $350",
    tag: "Skin",
    d: "M4 20 20 4M9 4h11v11M14 20H4V10",
  },
  {
    name: "PDO Thread Lifts",
    blurb: "Subtle, surgery-free lift and definition for cheeks, jaw and neck.",
    from: "from $900",
    tag: "Lifting",
    d: "M4 6c5 0 9 4 16 0M4 12c5 0 9 4 16 0M4 18c5 0 9 4 16 0",
  },
  {
    name: "Facials & Chemical Peels",
    blurb: "Medical-grade resurfacing and bespoke facials tuned to your skin goals.",
    from: "from $120",
    tag: "Skin",
    d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-3 8h.01M15 11h.01M8.5 15c1.5 1.5 5.5 1.5 7 0",
  },
  {
    name: "IV Therapy",
    blurb: "Hydration, immunity and recovery drips formulated and run by clinicians.",
    from: "from $99",
    tag: "Wellness",
    d: "M9 2h6M12 2v5m-3 0h6l1 4a4 4 0 0 1-8 0l1-4Zm3 9v7m0 0h-2m2 0h2",
  },
  {
    name: "BHRT & Weight Loss",
    blurb: "Bio-identical hormone therapy and physician-supervised medical weight loss.",
    from: "consult $75",
    tag: "Medical",
    d: "M3 12h4l2-7 4 14 2-7h6",
  },
];

export function Services() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="services" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The Menu"
          title={
            <>
              A complete aesthetic &amp; wellness menu,
              <span className="italic"> under one roof.</span>
            </>
          }
          lead="Every treatment is delivered or overseen by a physician — so you get the artistry of a spa with the safety of a medical practice."
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {SERVICES.map((s) => (
            <RevealItem key={s.name}>
              <motion.article
                whileHover={prefersReduced ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6",
                  "shadow-[0_1px_2px_oklch(46%_0.12_255_/_0.04)] transition-shadow duration-300 hover:shadow-[var(--glass-shadow)]",
                )}
              >
                {/* hover sky wash */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-24 h-32 bg-gradient-to-b from-[var(--color-accent-subtle)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-accent-subtle)]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                      <path d={s.d} stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="rounded-full bg-[var(--color-bg-subtle)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-xl leading-snug text-[var(--color-fg)]">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">{s.blurb}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-4">
                  <span className="text-sm font-semibold text-[var(--color-fg)]">{s.from}</span>
                  <span className="text-sm font-medium text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-0.5">
                    Book →
                  </span>
                </div>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-6 text-center text-xs text-[var(--color-fg-subtle)]">
          Sample pricing shown for mockup purposes. A personalized plan is built at your complimentary consult.
        </p>
      </div>
    </section>
  );
}
