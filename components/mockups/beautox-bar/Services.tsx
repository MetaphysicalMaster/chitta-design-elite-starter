"use client";

/**
 * Services — the injectables-led menu, "on tap" like a bar. Fun, witty naming
 * (the Jester-Everyman voice) over a clean, premium card grid. Tox + filler lead
 * (the "Botox bar" concept); supporting glow services round it out. Each card is
 * a glossy candy chip on hover. Reduced-motion safe via RevealGroup.
 */

import { RevealGroup, RevealItem, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Service = {
  name: string;
  tagline: string;
  detail: string;
  from: string;
  hero?: boolean;
  icon: "tox" | "filler" | "glow" | "lip" | "facial" | "weight";
};

const SERVICES: Service[] = [
  {
    name: "The Classic Tox",
    tagline: "Botox / Dysport on tap",
    detail: "Smooth the 11s, soften crow's feet — natural, never frozen.",
    from: "$11 / unit",
    hero: true,
    icon: "tox",
  },
  {
    name: "Filler Flight",
    tagline: "Cheeks · jaw · under-eye",
    detail: "Restore volume and sculpt structure with a tailored filler plan.",
    from: "$650 / syringe",
    hero: true,
    icon: "filler",
  },
  {
    name: "Lip Service",
    tagline: "Soft, kissable, you",
    detail: "Subtle hydration to full pout — your lips, leveled up.",
    from: "$575",
    icon: "lip",
  },
  {
    name: "The Glow Pour",
    tagline: "Medical-grade facial",
    detail: "Deep-clean, exfoliate and hydrate for an instant lit-from-within glow.",
    from: "$165",
    icon: "glow",
  },
  {
    name: "Tox + Glow Happy Hour",
    tagline: "Our signature combo",
    detail: "Pair a tox touch-up with a glow facial — the regular's order.",
    from: "$285",
    icon: "facial",
  },
  {
    name: "Skinny Shot Club",
    tagline: "Weight & wellness",
    detail: "Provider-guided weight-management support, judgment-free.",
    from: "Consult",
    icon: "weight",
  },
];

function Icon({ name }: { name: Service["icon"] }) {
  const common = {
    className: "h-5 w-5",
    fill: "none" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  switch (name) {
    case "tox":
      return (
        <svg {...common}>
          <path d="M14 3l7 7-9 9-7 1 1-7 8-10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M12 6l6 6" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "filler":
      return (
        <svg {...common}>
          <path d="M19 5l-9 9-3 4 4-3 9-9-1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M5 19l2-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "glow":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "lip":
      return (
        <svg {...common}>
          <path d="M3 11c3-4 6 0 9 0s6-4 9 0c-2 4-6 6-9 6s-7-2-9-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "facial":
      return (
        <svg {...common}>
          <path d="M12 21c-4 0-7-3-7-8 0-4 3-7 7-7s7 3 7 7c0 5-3 8-7 8Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 11h.01M15 11h.01M9.5 15c1.5 1 3.5 1 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "weight":
      return (
        <svg {...common}>
          <path d="M5 8h14l-1.4 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-[var(--color-bg-subtle)] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The menu"
          title={
            <>
              What&apos;s <span className="candy-text">on tap.</span>
            </>
          }
          lead="Injectables lead the bar — tox and filler are our pour. Everything's delivered by licensed pros who keep it natural, fun and judgment-free. Sample pricing shown."
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <RevealItem key={s.name} as="article">
              <article
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1",
                  s.hero
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-bg-elevated)] shadow-[0_20px_50px_-28px_oklch(58%_0.24_352_/_0.45)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)]",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-full transition-colors",
                      s.hero
                        ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]"
                        : "bg-[var(--lilac-subtle)] text-[var(--lilac-deep)]",
                      "group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-fg)]",
                    )}
                  >
                    <Icon name={s.icon} />
                  </span>
                  {s.hero && (
                    <span className="rounded-full bg-[var(--color-accent-subtle)] px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-deep)]">
                      House pour
                    </span>
                  )}
                </div>

                <h3 className="font-display mt-5 text-xl text-[var(--color-fg)]">{s.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--color-accent-deep)]">{s.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{s.detail}</p>

                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="text-sm font-semibold tnum text-[var(--color-fg)]">
                    <span className="text-[var(--color-fg-subtle)]">from </span>
                    {s.from}
                  </span>
                  <a
                    href="#book"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    Book
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </a>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 text-center text-xs text-[var(--color-fg-subtle)]">
          Sample menu &amp; pricing for illustration. Treatment plans are tailored in your consult.
        </p>
      </div>
    </section>
  );
}
