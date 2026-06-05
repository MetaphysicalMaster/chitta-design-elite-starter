"use client";

/**
 * Authority — THE CLOSER. The Allergan-national-trainer peer-prestige section.
 * "As seen by your injector's injector." Dr. Phil Nguyen, MD trains other
 * injectors nationally for Allergan — so the patient isn't choosing a clinic,
 * they're choosing the person the experts learn from. Dark aurora field so the
 * credential band glows; the single most persuasive block on the page.
 */

import Link from "next/link";
import { SectionHeading, Reveal, BrandImage } from "./primitives";
import { cn } from "@/lib/utils";

type Cred = { label: string; detail: string };

const CREDENTIALS: Cred[] = [
  {
    label: "Allergan National Trainer",
    detail:
      "Selected by Allergan — makers of BOTOX® & JUVÉDERM® — to train injectors across the country on advanced technique.",
  },
  {
    label: "Board-Certified Physician, MD",
    detail:
      "Dr. Phil Hong Nguyen leads a two-MD practice — every protocol is physician-designed and physician-supervised.",
  },
  {
    label: "Colorado's #1 Injectable Volume",
    detail:
      "More Botox & Juvéderm delivered than any clinic in the state — experience that compounds into precision.",
  },
];

export function Authority() {
  return (
    <section
      id="authority"
      className="relative isolate scroll-mt-20 overflow-hidden py-24 sm:py-28"
      style={{ background: "linear-gradient(160deg, var(--night-0), var(--night-1))" }}
    >
      {/* aurora aura echoing the hero on the dark field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(55% 50% at 82% 0%, var(--aurora-violet), transparent 66%), radial-gradient(50% 55% at 4% 100%, var(--aurora-teal), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          invert
          eyebrow="The credential that changes the decision"
          title={
            <>
              As seen by{" "}
              <span className="foil-sheen">your injector&rsquo;s injector.</span>
            </>
          }
          lead="Most clinics tell you they're good. Dr. Phil Nguyen is the doctor other injectors fly in to learn from — an Allergan national trainer. When you sit in his chair, you're not choosing a provider. You're choosing the source."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Portrait + signature credential plate */}
          <Reveal>
            <div className="relative">
              <BrandImage
                aspect="4 / 5"
                radius="3xl"
                night
                label="Dr. Phil Nguyen, MD"
                className="shadow-[0_30px_80px_-30px_oklch(56%_0.2_300_/_0.6)]"
              >
                {/* aurora rim glow on the portrait */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10"
                />
              </BrandImage>

              {/* floating Allergan-trainer badge */}
              <div className="absolute -bottom-5 -right-3 max-w-[15rem] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:-right-5">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 place-items-center rounded-full text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-accent), var(--color-teal))",
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                      <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21l-5.4 2.2.9-5.5-4-3.9 5.5-.8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/60">
                      Allergan
                    </p>
                    <p className="text-sm font-semibold text-white">
                      National Trainer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Credential list + peer-prestige hook */}
          <div className="flex flex-col gap-5">
            {CREDENTIALS.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-white/20">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-accent), var(--color-teal))",
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                      <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      {c.label}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                      {c.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.24}>
              <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-pretty text-white/90">
                  <span className="font-semibold text-white">
                    The injector your injector trusts
                  </span>{" "}
                  is now taking new Denver patients.
                </p>
                <Link
                  href="#book"
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[var(--color-fg)]",
                    "transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  )}
                >
                  Book with Dr. Nguyen
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
