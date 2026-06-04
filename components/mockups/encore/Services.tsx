"use client";

/**
 * Services — two full treatment grids, one per care path. The Medical grid
 * leads with clinical authority; The Spa grid is given equally lavish
 * treatment (it's the under-marketed growth engine). Real treatments only.
 */

import { motion, useReducedMotion } from "motion/react";
import { Section, SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

type Service = { name: string; desc: string };

const MEDICAL: Service[] = [
  { name: "Skin Cancer Care", desc: "Full-body screening, biopsy and surgical excision with academic rigor." },
  { name: "Acne", desc: "Personalized medical regimens for teens and adults — including resistant cases." },
  { name: "Eczema & Dermatitis", desc: "Targeted relief and long-term management of inflammatory skin disease." },
  { name: "Psoriasis", desc: "Advanced topical, light and biologic therapies tailored to severity." },
  { name: "Rosacea", desc: "Calming chronic redness and flares with evidence-based protocols." },
  { name: "Surgical Dermatology", desc: "In-office removal of cysts, lesions and suspicious growths." },
  { name: "Mole & Lesion Checks", desc: "Dermoscopic evaluation and mapping for early detection." },
  { name: "Pediatric Dermatology", desc: "Gentle, specialized care for the youngest patients." },
];

const SPA: Service[] = [
  { name: "Botox & Dysport", desc: "Expert neuromodulator artistry for a natural, refreshed look." },
  { name: "Dermal Fillers", desc: "Restore volume and contour with precise, conservative technique." },
  { name: "Sciton Halo Laser", desc: "Hybrid fractional resurfacing for tone, texture and glow." },
  { name: "IPL Photofacial", desc: "Erase sun damage, redness and brown spots with intense pulsed light." },
  { name: "CoolSculpting", desc: "Non-surgical fat reduction that freezes away stubborn pockets." },
  { name: "RF Microneedling", desc: "Radiofrequency collagen remodeling for firmer, smoother skin." },
  { name: "Medical Facials & Peels", desc: "Clinical-grade facials, chemical peels and dermaplaning." },
  { name: "Skincare & Memberships", desc: "Physician-curated regimens and members-only aesthetic pricing." },
];

function ServiceCard({ s, tone, i }: { s: Service; tone: "clinical" | "spa"; i: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.li
      initial={{ opacity: 0, y: prefersReduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: prefersReduced ? 0 : (i % 4) * 0.06 }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]/55 p-6 transition-colors duration-300 hover:border-[var(--color-border)]"
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-6 h-7 w-px transition-all duration-300 group-hover:h-10",
          tone === "clinical" ? "bg-[var(--clinical)]" : "bg-[var(--spa)]",
        )}
      />
      <h4 className="font-display text-lg text-[var(--color-fg)]">{s.name}</h4>
      <p className="mt-2 text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
        {s.desc}
      </p>
    </motion.li>
  );
}

function ServiceBlock({
  id,
  eyebrow,
  title,
  lede,
  items,
  tone,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  items: Service[];
  tone: "clinical" | "spa";
}) {
  return (
    <Section id={id} labelledBy={`${id}-heading`}>
      <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} lede={lede} />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <ServiceCard key={s.name} s={s} tone={tone} i={i} />
        ))}
      </ul>
    </Section>
  );
}

export function MedicalServices() {
  return (
    <ServiceBlock
      id="medical"
      eyebrow="Medical Dermatology"
      title={<>Clinical care, <span className="italic">academically grounded.</span></>}
      lede="The full breadth of medical and surgical dermatology — delivered with the precision you'd expect from a teaching faculty."
      items={MEDICAL}
      tone="clinical"
    />
  );
}

export function SpaServices() {
  return (
    <div className="relative">
      {/* Subtle warm wash differentiates the spa world */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_0%,oklch(60%_0.1_22_/_0.14),transparent_60%)]"
      />
      <ServiceBlock
        id="spa"
        eyebrow="The Spa at Encore"
        title={<>Aesthetics, <span className="italic">elevated.</span></>}
        lede="A physician-supervised med-spa where dermatologic science meets luxury. The same expertise behind your medical care, now devoted to how you look and feel."
        items={SPA}
        tone="spa"
      />
    </div>
  );
}
