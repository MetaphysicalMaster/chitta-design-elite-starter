"use client";

/**
 * Services — two full treatment grids, one per care path. The Medical grid
 * leads with clinical authority; The Spa grid is given equally lavish
 * treatment (it's the under-marketed growth engine). Real treatments only.
 */

import { motion, useReducedMotion } from "motion/react";
import { Section, SectionHeading, Reveal } from "./primitives";
import { BrandImage } from "./BrandImage";
import { encoreImages } from "@/app/mockups/encore/images.manifest";
import { cn } from "@/lib/utils";

type ServicePhoto = {
  src: string;
  alt: string;
  position?: string;
};
type Service = { name: string; desc: string; photo?: ServicePhoto };

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
  {
    name: "Botox",
    desc: "Softens forehead lines, crow's feet and frown lines for a refreshed look.",
    photo: {
      src: encoreImages.injectable.primary,
      alt: encoreImages.injectable.altText,
      position: "center 40%",
    },
  },
  { name: "Juvéderm Fillers", desc: "The #1 hyaluronic-acid filler collection — placed with conservative artistry." },
  {
    name: "Sciton Halo Laser",
    desc: "Hybrid fractional resurfacing for tone, texture and luminous glow.",
    photo: {
      src: encoreImages.laser.primary,
      alt: encoreImages.laser.altText,
      position: "center 45%",
    },
  },
  { name: "RF Microneedling", desc: "Radiofrequency collagen remodeling for fine lines, pores and texture." },
  { name: "Doctor-Directed CoolSculpting", desc: "Physician-supervised, non-surgical fat reduction of stubborn pockets." },
  { name: "Custom Facials & Peels", desc: "Clinical-grade facials and chemical peels, tailored to your skin." },
  { name: "Dermaplaning & Waxing", desc: "Smooth, polished skin with expert dermaplaning and waxing services." },
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
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]/55 transition-colors duration-300 hover:border-[var(--color-border)]",
        s.photo ? "p-0" : "p-6",
      )}
    >
      {s.photo && (
        <div className="relative overflow-hidden">
          <BrandImage
            src={s.photo.src}
            alt={s.photo.alt}
            aspect="16:9"
            light
            graded
            tone
            vignette
            scrim="soft"
            radius="none"
            position={s.photo.position ?? "center"}
            className="!border-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-0 bottom-0 h-px",
                tone === "clinical"
                  ? "bg-gradient-to-r from-transparent via-[var(--clinical)]/55 to-transparent"
                  : "bg-gradient-to-r from-transparent via-[var(--spa)]/55 to-transparent",
              )}
            />
          </BrandImage>
        </div>
      )}
      <div className={cn("relative flex flex-1 flex-col", s.photo ? "p-6" : "")}>
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-0 h-7 w-px transition-all duration-300 group-hover:h-10",
            s.photo && "hidden",
            tone === "clinical" ? "bg-[var(--clinical)]" : "bg-[var(--spa)]",
          )}
        />
        <h4 className="font-display text-lg text-[var(--color-fg)]">{s.name}</h4>
        <p className="mt-2 text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
          {s.desc}
        </p>
      </div>
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
        lede="The Spa at Encore blends medical treatments with spa luxury — in a relaxed, peaceful setting. The same expertise behind your medical care, now devoted to how you look and feel."
        items={SPA}
        tone="spa"
        footnote={
          <>
            Every aesthetic journey begins with a{" "}
            <span className="text-[var(--color-fg)]">
              complimentary consultation
            </span>{" "}
            — and ask about Spa membership for members-only pricing. Treatments
            are physician-supervised. Pricing shown elsewhere is illustrative.
          </>
        }
      />
    </div>
  );
}
