"use client";

/**
 * Services — the med-spa menu (injectables, laser/Secret RF, skin), presented
 * as an editorial card grid rather than an EMR service list. "From" pricing as
 * a quiet, consult-driven signal — no "request appointment" form-dump, no SKUs.
 * Heirloom luxury: generous whitespace, fine brass hairlines, the injectables
 * card featured as "most requested".
 */

import Link from "next/link";
import { Reveal, SectionHeading, btnGhost } from "./primitives";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  name: string;
  blurb: string;
  detail: string;
  from: string;
  featured?: boolean;
};

const SERVICES: Service[] = [
  {
    id: "tox",
    name: "Injectables",
    blurb: "Neuromodulators · Wrinkle relaxers",
    detail: "Physician-placed tox for a softened, never-frozen result.",
    from: "from $12 / unit",
    featured: true,
  },
  {
    id: "filler",
    name: "Dermal Filler",
    blurb: "Cheek · Lip · Chin · Jawline",
    detail: "Hyaluronic restoration with a proportion-first, structural eye.",
    from: "from $650 / syringe",
  },
  {
    id: "secretrf",
    name: "Secret RF Microneedling",
    blurb: "Radiofrequency resurfacing",
    detail: "Fractional RF to remodel collagen — tightening from within.",
    from: "from $750 / session",
  },
  {
    id: "laser",
    name: "Laser & Energy",
    blurb: "Resurfacing · Vascular · Pigment",
    detail: "Energy-based correction for tone, texture and clarity.",
    from: "by consultation",
  },
  {
    id: "skin",
    name: "Medical Skin",
    blurb: "Medical facials · Peels",
    detail: "Medical-grade skin health between injectable visits.",
    from: "from $185",
  },
  {
    id: "consult",
    name: "Physician Consultation",
    blurb: "McCarren · Heuker",
    detail: "Begin with a conversation, not a checkout — a tailored plan.",
    from: "complimentary",
  },
];

function ServiceCard({ s }: { s: Service }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-[1.5rem] border p-6 transition-[transform,box-shadow,border-color] duration-300 sm:p-7",
        "hover:-translate-y-0.5",
        s.featured
          ? "border-[var(--color-accent-subtle)] bg-[var(--color-bg-elevated)] shadow-[0_24px_70px_-44px_oklch(58%_0.094_76_/_0.42)] hover:shadow-[0_30px_80px_-40px_oklch(58%_0.094_76_/_0.5)]"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-hairline)] hover:shadow-[var(--glass-shadow)]",
      )}
    >
      {s.featured && (
        <span className="absolute right-5 top-5 rounded-full border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
          Most requested
        </span>
      )}
      <h3 className="font-display text-2xl text-[var(--color-fg)]">{s.name}</h3>
      <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-deep)]">
        {s.blurb}
      </p>
      <p className="mt-4 flex-1 text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
        {s.detail}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <span className="tnum text-sm text-[var(--color-fg)]">{s.from}</span>
        <Link
          href="#book"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-deep)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
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
            lead="Every plan begins with a physician conversation, not a form-dump. Pricing shown as a starting point — the right plan is the one designed for your face."
          />
          <Reveal delay={0.08} className="lg:pb-2">
            <Link href="#book" className={cn(btnGhost, "whitespace-nowrap")}>
              Book a consultation
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
