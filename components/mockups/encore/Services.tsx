"use client";

/**
 * Services — two full treatment grids, one per care path. The Medical grid
 * leads with clinical authority; The Spa grid is given equally lavish treatment
 * (the under-marketed growth engine). Uniform, refined CSS cards in the brand's
 * teal/ink/white system — crisp, consistent, no photography to muddy the bright
 * theme. Real treatments only.
 */

import { motion, useReducedMotion } from "motion/react";
import { Section, SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

type Service = { name: string; desc: string };

const MEDICAL: Service[] = [
  { name: "Skin Cancer Care", desc: "Routine exams, biopsy and surgical removal of skin cancers — with academic rigor." },
  { name: "Atypical Moles & Lesions", desc: "Assessment and removal of atypical moles and precancerous lesions." },
  { name: "Acne", desc: "Personalized medical regimens for teens and adults — including resistant cases." },
  { name: "Eczema & Dermatitis", desc: "Targeted relief and long-term management of inflammatory skin disease." },
  { name: "Psoriasis", desc: "Advanced topical, light and biologic therapies tailored to severity." },
  { name: "Rosacea", desc: "Calming chronic redness and flares with evidence-based protocols." },
  { name: "Surgical Dermatology", desc: "In-office excision of cysts, lesions and suspicious growths." },
  { name: "Full-Body Skin Exams", desc: "Dermoscopic evaluation and mapping for early, confident detection." },
];

const SPA: Service[] = [
  { name: "Botox & Dysport", desc: "Softens forehead lines, crow's feet and frown lines for a refreshed, natural look." },
  { name: "Juvéderm Fillers", desc: "The #1 hyaluronic-acid filler collection — placed with conservative artistry." },
  { name: "Sciton Halo Laser", desc: "Hybrid fractional resurfacing for tone, texture and a luminous glow." },
  { name: "RF Microneedling", desc: "Radiofrequency collagen remodeling for fine lines, pores and texture." },
  { name: "Doctor-Directed CoolSculpting", desc: "Physician-supervised, non-surgical fat reduction of stubborn pockets." },
  { name: "Custom Facials & Peels", desc: "Clinical-grade facials and chemical peels, tailored to your skin." },
  { name: "Dermaplaning & Waxing", desc: "Smooth, polished skin with expert dermaplaning and waxing services." },
  { name: "Skincare & Memberships", desc: "Physician-curated regimens and members-only aesthetic pricing." },
];

function LeafBullet({ tone }: { tone: "clinical" | "spa" }) {
  const color = tone === "clinical" ? "var(--clinical)" : "var(--spa-deep)";
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill={color} aria-hidden>
      <path d="M5 19c0-7 5-12 14-13C18 13 13 19 6 19c0 0-1-3 2-7" opacity="0.95" />
    </svg>
  );
}

function ServiceCard({ s, tone, i }: { s: Service; tone: "clinical" | "spa"; i: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.li
      initial={{ opacity: 0, y: prefersReduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: prefersReduced ? 0 : (i % 4) * 0.06 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6",
        "shadow-[0_10px_30px_-26px_oklch(46%_0.06_205_/_0.5)] transition-[transform,box-shadow,border-color] duration-300",
        "hover:-translate-y-1 hover:border-[var(--clinical)] hover:shadow-[0_22px_50px_-30px_oklch(46%_0.06_205_/_0.7)]",
      )}
    >
      {/* hover wash */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60",
          tone === "clinical" ? "bg-[var(--color-accent-subtle)]" : "bg-[oklch(94%_0.04_158)]",
        )}
      />
      <div className="relative mb-4 flex items-center gap-3">
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full",
            tone === "clinical"
              ? "bg-[var(--color-accent-subtle)] text-[var(--clinical-deep)]"
              : "bg-[oklch(94%_0.04_158)] text-[var(--spa-deep)]",
          )}
        >
          <LeafBullet tone={tone} />
        </span>
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)] [font-variant-numeric:tabular-nums]">
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>
      <h4 className="relative font-display text-lg leading-tight text-[var(--color-fg)]">{s.name}</h4>
      <p className="relative mt-2 text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
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
  footnote,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  items: Service[];
  tone: "clinical" | "spa";
  footnote?: React.ReactNode;
}) {
  return (
    <Section id={id} labelledBy={`${id}-heading`}>
      <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} lede={lede} />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <ServiceCard key={s.name} s={s} tone={tone} i={i} />
        ))}
      </ul>
      {footnote && (
        <Reveal className="mt-8">
          <p className="text-sm text-[var(--color-fg-subtle)]">{footnote}</p>
        </Reveal>
      )}
    </Section>
  );
}

export function MedicalServices() {
  return (
    <ServiceBlock
      id="medical"
      eyebrow="Medical Dermatology"
      title={<>Clinical care, <span className="display-em">academically grounded.</span></>}
      lede="The full breadth of medical and surgical dermatology — delivered with the precision you'd expect from a teaching faculty."
      items={MEDICAL}
      tone="clinical"
    />
  );
}

export function SpaServices() {
  return (
    <div className="relative">
      {/* Subtle warm sage wash differentiates the spa world */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_0%,oklch(72%_0.07_158_/_0.1),transparent_60%)]"
      />
      <ServiceBlock
        id="spa"
        eyebrow="The Spa at Encore"
        title={<>Aesthetics, <span className="display-em">elevated.</span></>}
        lede="The Spa at Encore blends dermatologic science with spa luxury — in a relaxed, peaceful setting. The same expertise behind your medical care, now devoted to how you look and feel."
        items={SPA}
        tone="spa"
        footnote={
          <>
            Every aesthetic journey begins with a{" "}
            <span className="font-medium text-[var(--clinical-deep)]">
              complimentary consultation
            </span>{" "}
            — and ask about Spa membership for members-only pricing. Treatments
            are physician-supervised.
          </>
        }
      />
    </div>
  );
}
