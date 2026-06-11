"use client";

/**
 * Services — the med-spa menu (injectables, laser/Secret RF, skin), presented
 * as a clean card grid rather than a clinical service list. "From" pricing as a
 * quiet, consult-driven signal — no form-dump, no SKUs. Warm and generous:
 * roomy whitespace, fine peach hairlines, the injectables card featured as
 * "most requested".
 */

import Link from "next/link";
import { type ReactNode } from "react";
import { Reveal, SectionHeading, btnGhost } from "./primitives";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  name: string;
  blurb: string;
  detail: string;
  /** The OUTCOME the patient is buying — the primary line (sells benefit). */
  outcome: string;
  /** Quiet, consult-first investment note — secondary, never the headline. */
  invest: string;
  icon: ReactNode;
  featured?: boolean;
};

/* Soft, consistent line-icons per treatment family — 1.5px strokes in the
   accent, matching the page's hairline language. Purely decorative. */
const ICON = {
  // a softened droplet — neuromodulator / wrinkle relaxer
  tox: (
    <path d="M12 4c3 3.6 5 6.3 5 8.8a5 5 0 0 1-10 0C7 10.3 9 7.6 12 4Z" />
  ),
  // overlapping arcs — filler / restoration of volume
  filler: (
    <>
      <circle cx="9.5" cy="12" r="4.5" />
      <circle cx="14.5" cy="12" r="4.5" />
    </>
  ),
  // radiating lines — RF energy / collagen remodeling
  secretrf: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </>
  ),
  // sun/burst — laser & energy
  laser: (
    <>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" />
    </>
  ),
  // leaf — medical skin health
  skin: (
    <path d="M5 19c0-7 5-12 14-13-1 9-6 14-13 14a6 6 0 0 1-1-1Zm3-1c4-4 6-7 7-9" />
  ),
  // chat bubble — physician consultation
  consult: (
    <path d="M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3.5V6Z" />
  ),
} as const;

const SERVICES: Service[] = [
  {
    id: "tox",
    name: "Injectables",
    blurb: "Neuromodulators · Wrinkle relaxers",
    detail: "Physician-placed tox for a softened, never-frozen result.",
    outcome: "Smooth the lines that age you — and keep every expression.",
    invest: "From $180 / area · personalized at consult",
    icon: ICON.tox,
    featured: true,
  },
  {
    id: "filler",
    name: "Dermal Filler",
    blurb: "Cheek · Lip · Chin · Jawline",
    detail: "Hyaluronic restoration with a proportion-first, structural eye.",
    outcome: "Restore the soft, lifted contours you remember.",
    invest: "Personalized at consult",
    icon: ICON.filler,
  },
  {
    id: "secretrf",
    name: "Secret RF Microneedling",
    blurb: "Radiofrequency resurfacing",
    detail: "Fractional RF to remodel collagen — tightening from within.",
    outcome: "Firmer, smoother skin that tightens from within.",
    invest: "Personalized at consult",
    icon: ICON.secretrf,
  },
  {
    id: "laser",
    name: "Laser & Energy",
    blurb: "Resurfacing · Vascular · Pigment",
    detail: "Energy-based correction for tone, texture and clarity.",
    outcome: "Even out tone, texture and clarity for lit-from-within skin.",
    invest: "Personalized at consult",
    icon: ICON.laser,
  },
  {
    id: "skin",
    name: "Medical Skin",
    blurb: "Medical facials · Peels",
    detail: "Medical-grade skin health between injectable visits.",
    outcome: "Keep that glow going between visits.",
    invest: "From $185",
    icon: ICON.skin,
  },
  {
    id: "consult",
    name: "Physician Consultation",
    blurb: "McCarren · Heuker",
    detail: "Begin with a conversation, not a checkout — a tailored plan.",
    outcome: "Start with a real conversation about your face — no pressure.",
    invest: "Complimentary",
    icon: ICON.consult,
  },
];

function ServiceCard({ s }: { s: Service }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.5rem] border p-6 transition-[transform,box-shadow,border-color] duration-300 sm:p-7",
        "hover:-translate-y-0.5",
        s.featured
          ? "border-[var(--color-accent)]/35 bg-[var(--color-bg-elevated)] shadow-[0_26px_74px_-40px_oklch(60%_0.15_52_/_0.5)] hover:shadow-[0_32px_84px_-36px_oklch(60%_0.15_52_/_0.58)]"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-hairline)] hover:shadow-[var(--glass-shadow)]",
      )}
    >
      {/* Featured: a faint peach top-edge glow so the hero card unmistakably wins. */}
      {s.featured && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
        />
      )}
      {s.featured && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 h-32 w-2/3 -translate-x-1/2 rounded-full opacity-60 blur-2xl"
          style={{ background: "radial-gradient(closest-side, oklch(86% 0.08 58 / 0.7), transparent)" }}
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border text-[var(--color-accent)]",
            "transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            "group-hover:-rotate-3 group-hover:scale-105 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100",
            s.featured
              ? "border-[var(--color-accent)]/30 bg-[var(--color-accent-subtle)]"
              : "border-[var(--color-accent-subtle)] bg-[var(--color-bg-subtle)] group-hover:border-[var(--color-accent)]/30",
          )}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {s.icon}
          </svg>
        </span>
        {s.featured && (
          <span className="rounded-full border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
            Most requested
          </span>
        )}
      </div>
      <h3 className="font-display mt-5 text-2xl text-[var(--color-fg)]">{s.name}</h3>
      <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-deep)]">
        {s.blurb}
      </p>
      {/* OUTCOME leads — the benefit the patient is buying, not a price. */}
      <p className="mt-4 flex-1 text-[0.95rem] font-light leading-relaxed text-[var(--color-fg)]">
        {s.outcome}
      </p>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
        <span className="tnum text-xs text-[var(--color-fg-subtle)]">{s.invest}</span>
        <Link
          href="#book"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--color-accent-deep)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          Consult
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </article>
  );
}

export function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-20 bg-[var(--color-bg-subtle)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The menu"
            title={
              <>
                Injectables, laser &amp; skin.{" "}
                <span className="font-display-em">Consult-driven, always.</span>
              </>
            }
            lead="Every plan begins with a physician conversation, not a checkout. We design around your face and your goals first — the investment is set together, at your consult."
          />
          {/* Anchor the right side with a quiet trust note above the CTA so the
              header row balances — no lone control floating in empty space. */}
          <Reveal delay={0.08} className="lg:pb-2 lg:text-right">
            <p className="mb-3 text-sm font-light leading-relaxed text-[var(--color-fg-muted)] lg:max-w-[24ch]">
              Six physician-led treatment families.{" "}
              <span className="font-medium text-[var(--color-fg)]">Consult-first, always.</span>
            </p>
            <Link href="#book" className={cn(btnGhost, "whitespace-nowrap")}>
              Start with a conversation
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.07}>
              <ServiceCard s={s} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[var(--color-fg-subtle)]">
          Sample menu &amp; pricing for layout demonstration · not a quote.
        </p>
      </div>
    </section>
  );
}
