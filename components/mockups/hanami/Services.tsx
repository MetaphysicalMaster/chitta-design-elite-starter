"use client";

/**
 * Services — the med-spa menu (injectables-led, then laser/IPL & skin),
 * presented as a serene editorial card grid rather than an SEO service list.
 * "From" pricing as a quiet, consult-driven signal — no SKUs, no form-dump.
 * Botanical calm: generous whitespace, fine sakura hairlines, the injectables
 * card featured as "most requested" (Dr. Phuah's signature work).
 */

import Link from "next/link";
import { Reveal, SectionHeading, btnGold } from "./primitives";
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
    name: "Neuromodulators",
    blurb: "Tox · Wrinkle softening",
    detail: "Physician-placed by Dr. Phuah for a softened, never-frozen result.",
    from: "from $12 / unit",
    featured: true,
  },
  {
    id: "filler",
    name: "Dermal Filler",
    blurb: "Lip · Cheek · Chin · Jawline",
    detail: "Hyaluronic restoration with a proportion-first, structural eye.",
    from: "from $650 / syringe",
  },
  {
    id: "laser",
    name: "Laser Resurfacing",
    blurb: "Texture · Tone · Clarity",
    detail: "Energy-based renewal for smoother, more even, luminous skin.",
    from: "by consultation",
  },
  {
    id: "ipl",
    name: "IPL Photofacial",
    blurb: "Sun damage · Redness · Pigment",
    detail: "Intense pulsed light to clear pigment and calm vascular tone.",
    from: "from $350 / session",
  },
  {
    id: "skin",
    name: "Medical Skin",
    blurb: "Medical facials · Peels",
    detail: "Medical-grade skin health between your injectable visits.",
    from: "from $165",
  },
  {
    id: "consult",
    name: "Consultation",
    blurb: "One-on-one with Dr. Phuah",
    detail: "Begin with a conversation, not a checkout — a plan for your season.",
    from: "complimentary",
  },
];

function ServiceCard({ s }: { s: Service }) {
  return (
    <article
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-[1.5rem] border p-6 transition-[transform,box-shadow,border-color] duration-300 sm:p-7",
        "hover:-translate-y-0.5",
        s.featured
          ? "border-[var(--gold-hairline)] bg-[var(--color-bg-elevated)] shadow-[0_24px_70px_-44px_oklch(72%_0.11_86_/_0.45)] hover:shadow-[0_30px_80px_-40px_oklch(72%_0.11_86_/_0.55)]"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--gold-hairline)] hover:shadow-[var(--glass-shadow)]",
      )}
    >
      {/* Quiet brand texture — a faint gold hairline top rule (full strength on
          the featured card, a whisper on the rest, brightening on hover) and a
          soft petal-mark watermark in the corner. Additive only; no layout shift. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity duration-300",
          "via-[var(--color-accent)]",
          s.featured ? "opacity-80" : "opacity-30 group-hover:opacity-70",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "petal-mark pointer-events-none absolute -right-3 -top-3 h-16 w-16 rotate-12 transition-opacity duration-300",
          s.featured ? "opacity-[0.1]" : "opacity-[0.05] group-hover:opacity-[0.09]",
        )}
      />
      {s.featured && (
        <span className="absolute right-5 top-5 z-[1] rounded-full border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
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
      <div className="mt-6 flex items-center justify-between border-t border-[var(--gold-hairline)]/55 pt-4">
        <span className="tnum text-sm text-[var(--color-fg)]">{s.from}</span>
        <Link
          href="#book"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-deep)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-deep)]"
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
                Injectables, laser &amp; IPL.{" "}
                <span className="font-display-em text-[var(--color-accent-deep)]">Consult-driven, always.</span>
              </>
            }
            lead="Every plan begins with a conversation with Dr. Phuah, not a form-dump. Pricing shown as a starting point — the right plan is the one designed for your face, in its season."
          />
          <Reveal delay={0.08} className="lg:pb-2">
            <Link href="#book" className={cn(btnGold, "whitespace-nowrap")}>
              Book a consultation
            </Link>
          </Reveal>
        </div>

        {/* Price-permission band — converts the sole-injector differentiator into
            permission to pay physician prices, confronting the "cheaper-is-fine"
            belief before the buyer reaches the "from $…" lines below. */}
        <Reveal delay={0.06}>
          <p className="mt-10 max-w-[64ch] border-l-2 border-[var(--color-accent)] pl-5 text-pretty font-light leading-relaxed text-[var(--color-fg-muted)]">
            Priced as{" "}
            <span className="font-medium text-[var(--color-fg)]">
              physician-placed work
            </span>
            , not volume injecting — you&apos;re paying for one trained eye that
            learns your face over seasons, never a rotating room.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
