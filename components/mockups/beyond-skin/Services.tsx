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
    desc: "Botox, Dysport & dermal fillers — refreshed and natural, never overdone.",
    price: "Starting anchors apply",
    tag: "Most loved",
  },
  {
    name: "Laser & Devices",
    desc: "RF microneedling, IPL photofacials & laser for tone, texture & clarity.",
    price: "Consult to plan",
  },
  {
    name: "Body Contouring",
    desc: "Non-invasive sculpting, lifting & skin tightening, personalized to you.",
    price: "Consult to plan",
  },
  {
    name: "Esthetician Services",
    desc: "Signature facials & glow treatments — your reset, your ritual.",
    price: "Starting anchors apply",
  },
  {
    name: "Wellness",
    desc: "Physician-guided wellness & weight-management programs, built around you.",
    price: "Consult",
  },
  {
    name: "Specialty Treatments",
    desc: "Curated, results-driven options for your specific goals.",
    price: "Consult",
    tag: "Tailored",
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
                Results-driven,{" "}
                <span className="font-em">gently delivered.</span>
              </>
            }
            lead="Every treatment is performed by our expert team in a warm, judgment-free setting. Your plan is built around your goals in a complimentary consultation."
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
