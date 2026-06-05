"use client";

/**
 * Services — the menu, grouped into the three pillars: injectables, medical
 * weight-loss, and wellness. Each card is an on-brand plate with a calm hover
 * lift. Grounded, balanced, never salesy. Reduced-motion safe.
 */

import Link from "next/link";
import { SectionHeading, RevealGroup, RevealItem } from "./primitives";
import { BrandImage } from "./BrandImage";
import { cn } from "@/lib/utils";

type Service = {
  group: string;
  tone: "sage" | "terra" | "sand";
  title: string;
  blurb: string;
  items: string[];
};

const SERVICES: Service[] = [
  {
    group: "Injectables",
    tone: "sage",
    title: "Beauty, dosed for balance",
    blurb:
      "Tox, dermal filler and lip enhancement placed by clinicians for a refreshed, natural result — never overdone.",
    items: ["Neurotoxin (tox)", "Dermal filler", "Lip enhancement", "Medical-grade skin"],
  },
  {
    group: "Medical weight-loss",
    tone: "terra",
    title: "Physician-guided weight-loss",
    blurb:
      "Modern, medically supervised weight-loss programs — built around your body, your labs and your goals.",
    items: ["GLP-1 programs", "Nutrition coaching", "Lab-guided plans", "Ongoing follow-up"],
  },
  {
    group: "Wellness",
    tone: "sand",
    title: "Whole-body vitality",
    blurb:
      "Hormone & vitality support, IV wellness and injectables that treat the whole you — energy, recovery, balance.",
    items: ["Hormone & vitality", "IV wellness drips", "B12 & vitamin shots", "Wellness consults"],
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-20 bg-[var(--color-bg-subtle)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The menu"
          title={
            <>
              Three pillars,{" "}
              <span className="font-display-em balance-text">one balance.</span>
            </>
          }
          lead="Injectables, medical weight-loss and holistic wellness — under one roof in both metros, led by RN and NP clinicians."
        />

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.09}>
          {SERVICES.map((s) => (
            <RevealItem as="article" key={s.group}>
              <div className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_-30px_oklch(40%_0.06_130_/_0.45)]">
                <BrandImage
                  alt={`${s.group} at Karma — ${s.title.toLowerCase()}`}
                  aspect="16:10"
                  tone={s.tone}
                  radius="lg"
                  className="rounded-none border-0 border-b border-[var(--color-border)]"
                >
                  <span className="absolute bottom-3 left-3.5 z-10 rounded-full bg-[oklch(24%_0.03_130_/_0.5)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[oklch(96%_0.02_110)] backdrop-blur-sm">
                    {s.group}
                  </span>
                </BrandImage>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-medium text-[var(--color-fg)]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {s.blurb}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1 text-xs font-medium text-[var(--color-fg-muted)]"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#book"
                    className={cn(
                      "mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold",
                      "text-[var(--color-accent-deep)] hover:underline",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                    )}
                  >
                    Book {s.group.toLowerCase()}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
