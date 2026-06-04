"use client";

/**
 * Services — editorial treatments grid with real treatments + price anchors.
 * Cards lift + reveal a hairline gradient edge on hover; fully keyboard
 * focusable as links into booking.
 */

import Link from "next/link";
import { RevealGroup, RevealItem, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Service = {
  name: string;
  desc: string;
  price: string;
  tag?: string;
};

const SERVICES: Service[] = [
  {
    name: "Injectables",
    desc: "Botox & Dysport, dermal fillers — sculpted, never overdone.",
    price: "$600–1,200 / syringe",
    tag: "Most booked",
  },
  {
    name: "RF Microneedling",
    desc: "Radiofrequency + microneedling for firmness, tone & texture.",
    price: "from $650",
  },
  {
    name: "IPL & Laser",
    desc: "Photofacials and laser for pigment, redness & clarity.",
    price: "from $300",
  },
  {
    name: "Glo2Facial",
    desc: "Oxygenating signature facial — instant editorial glow.",
    price: "from $225",
  },
  {
    name: "Skin Tightening",
    desc: "Non-invasive lifting & contouring for jawline and neck.",
    price: "from $500",
  },
  {
    name: "Medical Weight Loss",
    desc: "Physician-supervised programs, personalized to you.",
    price: "consult",
    tag: "New suite",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 bg-[var(--color-bg-subtle)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="The Treatments"
            title={
              <>
                Results-driven, <span className="italic">artfully delivered.</span>
              </>
            }
            lead="Every treatment is performed by our dual board-certified team. Prices are starting anchors — your plan is built in consultation."
          />
          <Link
            href="#book"
            className="hidden shrink-0 rounded-full border border-[var(--color-fg)] px-5 py-2.5 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] md:inline-flex"
          >
            View all services →
          </Link>
        </div>

        <RevealGroup
          stagger={0.07}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((s) => (
            <RevealItem key={s.name}>
              <Link
                href="#book"
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7",
                  "transition-[transform,box-shadow,border-color] duration-300 ease-out",
                  "hover:-translate-y-1 hover:border-[var(--color-accent)]/40 hover:shadow-[0_24px_60px_-26px_oklch(40%_0.08_40_/_0.45)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                )}
              >
                {/* gradient edge wash on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[var(--glow-rose)] via-[var(--glow-bronze)] to-[var(--glow-gold)] transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                {s.tag && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full bg-[var(--color-accent-subtle)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)]">
                    {s.tag}
                  </span>
                )}
                <h3 className="font-display text-2xl text-[var(--color-fg)]">
                  {s.name}
                </h3>
                <p className="mt-3 flex-1 text-pretty text-[0.95rem] leading-relaxed text-[var(--color-fg-muted)]">
                  {s.desc}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-5">
                  <span className="text-sm font-semibold text-[var(--color-fg)]">
                    {s.price}
                  </span>
                  <span
                    aria-hidden
                    className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-fg)] transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-fg)]"
                  >
                    →
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
