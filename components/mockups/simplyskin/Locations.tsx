"use client";

/**
 * Locations — THE CLOSER. A two-location premium grid (Fishers + Carmel) that
 * foregrounds the Carmel-expansion launch moment, paired with a Top-1% Allergan
 * authority badge. This is the section the prospect's repurposed-Shopify site
 * could never express: a confident, editorial statement of a growing practice.
 *
 * Quiet luxury: large soft plates, fine hairline NAP, one teal accent. The
 * Carmel card carries a tasteful "Now Open" launch ribbon.
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
    street: "11529 Spring Mill Rd, Ste 200",
    cityLine: "Fishers, IN 46038",
    phoneDisplay: "(317) 597-8625",
    phoneTel: "+13175978625",
    note: "Our founding studio — twenty years of trusted, natural results.",
  },
  {
    id: "carmel",
    name: "Carmel",
    city: "Carmel, IN",
    street: "10485 N Pennsylvania St, Ste 100",
    cityLine: "Carmel · Zionsville, IN 46032",
    phoneDisplay: "(317) 597-8625",
    phoneTel: "+13175978625",
    note: "Our newest studio — the same elite hands, now closer to you.",
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
            "radial-gradient(120% 120% at 30% 25%, oklch(99% 0.006 80), oklch(95% 0.022 196))",
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
          Top 1% US Allergan Injector
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">
          BOTOX® &amp; JUVÉDERM® · Allē Partner · Top 10 in Indiana
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
        loc.launch
          ? "border-[var(--color-accent-subtle)] shadow-[0_30px_80px_-40px_oklch(48%_0.072_196_/_0.4)]"
          : "border-[var(--color-border)] shadow-[var(--glass-shadow)]",
      )}
    >
      <div className="relative">
        <BrandImage
          aspect="16 / 10"
          variant={loc.launch ? "default" : "nude"}
          radius="lg"
          sample
          label={`${loc.name} studio`}
          className="rounded-none border-0"
        />
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
            Call studio
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
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
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
                <span className="font-display-em">The same elite hands</span> — closer to you.
              </>
            }
            lead="After two decades building trust in Fishers, we're proud to open our Carmel studio. Same Top 1% Allergan artistry, same restrained aesthetic, now serving the north-side and Zionsville."
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
