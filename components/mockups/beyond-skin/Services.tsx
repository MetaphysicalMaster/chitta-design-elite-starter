"use client";

/**
 * Services — editorial treatments grid with real treatments + price anchors.
 * Each card carries a brand photo INFUSED into the top: the image is flush to
 * the card edges (p-0), wears a soft mauve duotone, and fades seamlessly into
 * the card's own elevated background so there is no pasted-thumbnail seam. The
 * card lifts + the photo scales on hover; fully keyboard focusable into booking.
 */

import Link from "next/link";
import { RevealGroup, RevealItem, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Service = {
  name: string;
  desc: string;
  price: string;
  tag?: string;
  /** infused brand photo header (root-absolute; deploy prefixes basePath) */
  photo: string;
  alt: string;
};

const SERVICES: Service[] = [
  {
    name: "Injectables",
    desc: "Botox, Dysport & dermal fillers — refreshed and natural, never overdone.",
    price: "Starting anchors apply",
    tag: "Most loved",
    photo: "/clients/beyond-skin/gen/tox.webp",
    alt: "Gentle injectable treatment at Beyond Skin Aesthetics",
  },
  {
    name: "Laser & Devices",
    desc: "RF microneedling, IPL photofacials & laser for tone, texture & clarity.",
    price: "Consult to plan",
    photo: "/clients/beyond-skin/gen/laser.webp",
    alt: "Laser and energy-device skin treatment",
  },
  {
    name: "Body Contouring",
    desc: "Non-invasive sculpting, lifting & skin tightening, personalized to you.",
    price: "Consult to plan",
    photo: "/clients/beyond-skin/real/asset28.webp",
    alt: "EMSCULPT non-invasive body-contouring treatment",
  },
  {
    name: "Esthetician Services",
    desc: "Signature facials & glow treatments — your reset, your ritual.",
    price: "Starting anchors apply",
    photo: "/clients/beyond-skin/gen/facial.webp",
    alt: "Signature facial glow treatment",
  },
  {
    name: "Wellness",
    desc: "Physician-guided wellness & weight-management programs, built around you.",
    price: "Consult",
    photo: "/clients/beyond-skin/gen/iv.webp",
    alt: "Wellness and IV therapy at Beyond Skin Aesthetics",
  },
  {
    name: "Specialty Treatments",
    desc: "Curated, results-driven options for your specific goals.",
    price: "Consult",
    tag: "Tailored",
    photo: "/clients/beyond-skin/gen/filler.webp",
    alt: "Curated specialty aesthetic treatment",
  },
];

/* Soft 150deg brand duotone (two accent tokens) laid over each photo in
   soft-light so the image always reads on-brand mauve, never raw stock. */
const BRAND_TINT =
  "linear-gradient(150deg, var(--glow-mauve), var(--glow-rose))";
/* The card's own elevated background — the photo's bottom fade dissolves into
   THIS exact color so there is zero seam between image and card body. */
const CARD_BG = "var(--color-bg-elevated)";

export function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 bg-[var(--color-bg-subtle)] py-24 sm:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
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
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-0",
                  "transition-[transform,box-shadow,border-color] duration-300 ease-out",
                  "hover:-translate-y-1 hover:border-[var(--color-accent)]/40 hover:shadow-[0_24px_60px_-26px_oklch(40%_0.08_40_/_0.45)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                )}
              >
                {/* Infused photo header — image flush to the top edges, brand
                    duotone, and a fade into the card body so there is no seam. */}
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  <img
                    src={s.photo}
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  {/* subtle brand duotone so the photo reads on-brand mauve */}
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: BRAND_TINT,
                      mixBlendMode: "soft-light",
                      opacity: 0.4,
                    }}
                  />
                  {/* fade the image INTO the card body color (no hard seam) */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/3"
                    style={{
                      background: `linear-gradient(to bottom, transparent, ${CARD_BG})`,
                    }}
                  />
                  {s.tag && (
                    <span className="absolute left-4 top-4 inline-flex w-fit items-center rounded-full bg-[var(--glass-bg-strong)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)] backdrop-blur-sm">
                      {s.tag}
                    </span>
                  )}
                </div>

                {/* Card body — title, description, price anchor below the photo */}
                <div className="relative -mt-2 flex flex-1 flex-col px-7 pb-7">
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
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
