"use client";

/**
 * DualPhysicians — THE CLOSER. "Two physicians, one warm standard."
 *
 * The single most important correction this page makes: the live site buries
 * the two-MD model behind a generic "Family Medicine Physicians" framing. Here
 * we humanize and foreground it — a dual-MD credibility split led by the real,
 * named physicians: Dr. Sonja Heuker, MD & Dr. Timothy McCarren, MD. A center
 * orange seam binds the two into a single, friendly practice.
 *
 * IMPORTANT: no real headshots exist on the client's site, so we do NOT
 * fabricate faces. Each physician gets a tasteful MONOGRAM avatar (their
 * initials in an on-brand orange circle) plus a small "Headshot to be supplied"
 * note — honest, elegant, and trivially swapped for a real photo later.
 */

import { Reveal, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

type Doc = {
  name: string;
  initials: string;
  role: string;
  focus: string;
  blurb: string;
  creds: string[];
};

const DOCS: Doc[] = [
  {
    name: "Dr. Sonja Heuker, MD",
    initials: "SH",
    role: "Family Medicine & Skin Care Specialist",
    focus: "Laser, Secret RF & medical skin",
    blurb:
      "Energy-based resurfacing and medical-grade skin health, led with a warm, unhurried touch — results that read as your skin, only rested and renewed.",
    creds: [
      "Secret RF & laser micro-needling",
      "Medical-grade skin protocols",
      "Family-medicine foundation",
    ],
  },
  {
    name: "Dr. Timothy McCarren, MD",
    initials: "TM",
    role: "Family Medicine",
    focus: "Injectables & facial balance",
    blurb:
      "A decade of the proportion-first approach Cincinnati trusts — soft, natural, never overfilled. The friendly judgment behind every plan.",
    creds: [
      "10+ years in aesthetic medicine",
      "Botox, Xeomin & filler artistry",
      "Natural facial-balancing eye",
    ],
  },
];

function MonogramAvatar({ d }: { d: Doc }) {
  // A tasteful placeholder portrait: a soft peach-bokeh panel holding a large
  // on-brand orange monogram circle with the physician's initials, plus an
  // honest "Headshot to be supplied" note. No fabricated faces.
  return (
    <div
      role="img"
      aria-label={`${d.name} — monogram placeholder; headshot to be supplied`}
      className={cn(
        // Both physicians get the same rich peach-orange plate so the pair reads
        // as equals (no washed-out card); per-disc light direction keeps them
        // distinct.
        "relative isolate flex flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] px-6 py-12 shadow-[var(--glass-shadow)]",
        "tl-plate tl-plate--brass",
      )}
      style={{ aspectRatio: "5 / 6" }}
    >
      {/* the monogram disc — equal richness for both physicians (they read as
          equals); only the light DIRECTION differs per card so the pair still
          feels distinct, not a stamped template. */}
      <span
        aria-hidden
        className="relative grid h-32 w-32 place-items-center rounded-full text-[2.6rem] font-semibold text-[var(--color-accent-fg)] shadow-[0_18px_44px_-16px_oklch(60%_0.15_52_/_0.7)] sm:h-40 sm:w-40 sm:text-[3.2rem]"
        style={{
          background:
            d.initials === "SH"
              ? "radial-gradient(130% 130% at 28% 20%, oklch(73% 0.15 58), oklch(56% 0.145 47))"
              : "radial-gradient(130% 130% at 72% 24%, oklch(73% 0.15 54), oklch(56% 0.145 45))",
        }}
      >
        <span className="font-display tracking-wide">{d.initials}</span>
        {/* a faint inner ring for polish */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-1.5 rounded-full border border-white/30"
        />
      </span>

      <p className="mt-7 text-center font-display text-xl text-[var(--color-fg)]">
        {d.name}
      </p>
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg-elevated)]/80 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)] backdrop-blur-sm">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Headshot to be supplied
      </p>
    </div>
  );
}

function DocCard({ d, side }: { d: Doc; side: "left" | "right" }) {
  return (
    <article className="relative flex flex-col">
      <MonogramAvatar d={d} />
      <div className="mt-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-deep)]">
          {d.role}
        </p>
        <h3 className="font-display mt-2 text-[1.9rem] leading-tight text-[var(--color-fg)]">
          {d.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-[var(--color-accent-deep)]">
          {d.focus}
        </p>
        <p className="mt-4 max-w-[42ch] text-pretty font-light leading-relaxed text-[var(--color-fg-muted)]">
          {d.blurb}
        </p>
        <ul className={cn("mt-5 space-y-2.5", side === "right" && "lg:text-right")}>
          {d.creds.map((c) => (
            <li
              key={c}
              className={cn(
                "flex items-start gap-3 text-sm text-[var(--color-fg-muted)]",
                side === "right" && "lg:flex-row-reverse lg:text-right",
              )}
            >
              <span
                aria-hidden
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[var(--color-accent-subtle)] text-[var(--color-accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
                  <path d="M5 12.5 10 17 19 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function DualPhysicians() {
  return (
    <section
      id="physicians"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg-warm)] py-24 sm:py-28"
    >
      {/* warm peach aura echoing the hero (on-brand hue ~58, not brassy gold) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(55% 50% at 88% 4%, oklch(90% 0.06 58 / 0.5), transparent 70%), radial-gradient(50% 50% at 4% 100%, var(--color-accent-subtle), transparent 72%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Meet your physicians"
          title={
            <>
              Two physicians.{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">One warm standard.</span>
            </>
          }
          lead="Every treatment is placed in person by a board-certified MD — Dr. Sonja Heuker or Dr. Timothy McCarren — never handed off. The safety and judgment of a doctor, not a chain: it's why results look natural, and why they're safe."
        />

        <div className="relative mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Center brass seam — "one standard" binding the two physicians.
              Decorative; hidden on stacked mobile. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-6 left-1/2 hidden w-px -translate-x-1/2 lg:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--brass) 18%, var(--brass-deep) 50%, var(--brass) 82%, transparent)",
            }}
          />
          {/* center medallion on the seam */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <span
              className="grid h-14 w-14 place-items-center rounded-full border border-[var(--brass)]/60 text-[var(--color-accent-deep)] shadow-[0_10px_30px_-12px_oklch(60%_0.15_52_/_0.5)]"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 25%, oklch(94% 0.05 60), oklch(86% 0.08 56))",
              }}
            >
              <span className="font-display text-sm font-semibold">&amp;</span>
            </span>
          </div>

          <Reveal>
            <DocCard d={DOCS[0]} side="left" />
          </Reveal>
          <Reveal delay={0.1}>
            <DocCard d={DOCS[1]} side="right" />
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-16 max-w-[58ch] text-center font-display text-xl leading-relaxed text-[var(--color-fg)] sm:text-2xl">
            &ldquo;We&rsquo;ll never push you toward more. Just the care that helps you
            look rested, refreshed, and entirely like yourself.&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}
