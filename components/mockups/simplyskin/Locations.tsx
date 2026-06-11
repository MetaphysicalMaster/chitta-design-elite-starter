"use client";

/**
 * Locations — THE CLOSER. A two-location grid (Fishers + Carmel · Zionsville)
 * paired with an Allergan & Galderma award-winner badge. An understated,
 * editorial statement of a trusted, growing practice.
 *
 * Restraint: large soft plates, fine hairline NAP, one quiet teal accent. The
 * Carmel · Zionsville card carries a tasteful "Now Open" ribbon.
 */

import Link from "next/link";
import { Reveal, SectionHeading, BrandImage, btnPrimary, btnGhost } from "./primitives";
import { cn } from "@/lib/utils";

type Location = {
  id: string;
  name: string;
  city: string;
  street: string;
  cityLine: string;
  phoneDisplay: string;
  phoneTel: string;
  note: string;
  launch?: boolean;
};

const LOCATIONS: Location[] = [
  {
    id: "fishers",
    name: "Fishers",
    city: "Fishers, IN",
    street: "9879 E 116th St",
    cityLine: "Fishers, IN 46037",
    phoneDisplay: "(317) 348-1313",
    phoneTel: "+13173481313",
    note: "Our Fishers home — quiet, medical-grade care for body and skin.",
  },
  {
    id: "carmel",
    name: "Carmel · Zionsville",
    city: "Carmel / Zionsville, IN",
    street: "3965 W 106th St",
    cityLine: "Carmel / Zionsville, IN 46032",
    phoneDisplay: "(317) 348-1313",
    phoneTel: "+13173481313",
    note: "Our newest location on the north side — the same expertise, closer to you.",
    launch: true,
  },
];

function AllerganBadge() {
  return (
    <div
      className={cn(
        "relative flex items-center gap-4 rounded-2xl border border-[var(--color-border)]",
        "bg-[var(--color-bg-elevated)] px-5 py-4 shadow-[var(--glass-shadow)]",
      )}
    >
      <span
        aria-hidden
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--color-accent-subtle)] text-[var(--color-accent)]"
        style={{
          background:
            "radial-gradient(120% 120% at 30% 25%, oklch(99% 0.006 80), oklch(94% 0.018 184))",
        }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path
            d="M12 2.5 14.7 8l6 .9-4.3 4.2 1 6L12 16.3 6.6 19.1l1-6L3.3 8.9l6-.9L12 2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div>
        <p className="font-display text-base text-[var(--color-fg)]">
          Allergan &amp; Galderma Award-Winner
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">
          Top-tier partner recognition · <span className="italic">[tier &amp; year at launch]</span>
        </p>
      </div>
    </div>
  );
}

function LocationCard({ loc }: { loc: Location }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.75rem] border bg-[var(--color-bg-elevated)]",
        "transition-transform duration-500 ease-out hover:-translate-y-0.5",
        loc.launch
          ? "border-[var(--color-accent-subtle)] shadow-[0_30px_80px_-40px_oklch(58%_0.04_184_/_0.38)]"
          : "border-[var(--color-border)] shadow-[var(--glass-shadow)]",
      )}
    >
      <div className="relative">
        <BrandImage
          aspect="16 / 10"
          variant={loc.launch ? "default" : "nude"}
          radius="lg"
          className="rounded-none border-0"
        >
          {/* Both location cards carry a matched, art-directed editorial plate
              (a place-name flourish) so they read as a considered pair rather
              than "real photo + placeholder" — and the single real hero
              photograph is reserved for its strongest moments (hero, Authority
              portrait, and the results lead) instead of being reused here. */}
          <div className="absolute inset-0 z-[1] grid place-items-center text-center">
            <div>
              <p className="font-display text-[2.6rem] leading-none text-[var(--color-fg)]/85">
                {loc.name === "Carmel · Zionsville" ? "Carmel" : loc.name}
              </p>
              <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-deep)]">
                {loc.launch ? "Now Welcoming · Zionsville" : "Our Fishers home"}
              </p>
            </div>
          </div>
        </BrandImage>
        {loc.launch && (
          <span className="absolute right-4 top-4 z-[3] inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-fg)] shadow-lg">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white/90" />
            Now Open
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl text-[var(--color-fg)]">
            SimplySkin {loc.name}
          </h3>
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
            {loc.city}
          </span>
        </div>

        <p className="mt-3 max-w-[40ch] text-sm font-light leading-relaxed text-[var(--color-fg-muted)]">
          {loc.note}
        </p>

        <address className="mt-5 not-italic">
          <p className="tnum text-sm text-[var(--color-fg)]">{loc.street}</p>
          <p className="tnum text-sm text-[var(--color-fg-muted)]">{loc.cityLine}</p>
          <a
            href={`tel:${loc.phoneTel}`}
            className="mt-2 inline-block tnum text-sm font-semibold text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            {loc.phoneDisplay}
          </a>
        </address>

        <div className="mt-6 flex flex-wrap gap-3 pt-1">
          <Link href="#book" className={cn(btnPrimary, "px-5 py-3 text-sm")}>
            Book {loc.name}
          </Link>
          <a
            href={`tel:${loc.phoneTel}`}
            className={cn(btnGhost, "px-5 py-3 text-sm")}
          >
            Call {loc.name}
          </a>
        </div>
      </div>
    </article>
  );
}

export function Locations() {
  return (
    <section
      id="locations"
      className="relative scroll-mt-28 overflow-hidden py-24 sm:py-28"
    >
      {/* faint nude wash so the closer feels like its own considered chapter */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 88% 0%, var(--color-accent-subtle), transparent 70%), radial-gradient(50% 45% at 0% 100%, oklch(95% 0.03 56), transparent 72%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Two locations · One standard"
            title={
              <>
                Now in Carmel.{" "}
                <span className="font-display-em">The same medical expertise</span> — closer to you.
              </>
            }
            lead="From our Fishers home, we're glad to welcome the north side and Zionsville at our Carmel location — the same understated, medical-grade care for body and skin, now closer to you."
          />
          <Reveal delay={0.08} className="lg:max-w-sm lg:pb-2">
            <AllerganBadge />
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {LOCATIONS.map((loc, i) => (
            <Reveal key={loc.id} delay={i * 0.1}>
              <LocationCard loc={loc} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
