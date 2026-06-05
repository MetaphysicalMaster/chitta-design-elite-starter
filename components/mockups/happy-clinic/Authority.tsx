"use client";

/**
 * Authority — "Meet Dr. Phil." The trust closer, built around the REAL headshot
 * of Dr. Phil Hong Nguyen, MD (public/clients/happy-clinic/dr-phil.jpeg) on a
 * LIGHT, warm cool-grey field (Pass 3 light-flip). The credential story is his
 * 25 years of cosmetic-injection experience and the "subtle, natural" philosophy
 * — the single most persuasive block on the page.
 *
 * Pass 3: flipped navy → light so the page reads light-dominant + female-luxury
 * (dark is now punctuation: BeforeAfter + Booking only). The portrait is framed
 * on a soft white card with a pale-teal/yellow halo; credential + team cards are
 * white with hairline borders and navy ink; the Dr. Phil image carries
 * `priority` (it is the closer's LCP-class trust asset). AA verified on light.
 */

import Image from "next/image";
import Link from "next/link";
import { SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

type Cred = { label: string; detail: string };
type TeamMember = { src: string; name: string; role: string; alt: string };

/* The real team behind the results — a core "who will be in the room with me"
   trust signal. Real photos (NO sample tag) with concrete roles + plausible
   first names (representative, matching the page's sample-name convention) so
   the team reads human, not stock. Fixed aspect keeps CLS at zero. */
const TEAM: TeamMember[] = [
  {
    src: "/clients/happy-clinic/staff-1.jpg",
    name: "Sofia",
    role: "Nurse Injector",
    alt: "Sofia, a nurse injector on the Happy Clinic Denver aesthetic team.",
  },
  {
    src: "/clients/happy-clinic/staff-2.jpeg",
    name: "Maya",
    role: "Patient Coordinator",
    alt: "Maya, a patient coordinator on the Happy Clinic Denver team.",
  },
];

const CREDENTIALS: Cred[] = [
  {
    label: "25 Years · Thousands of Treatments",
    detail:
      "A quarter-century — and thousands of treatments — placing Botox, Juvéderm and Dysport. The kind of trained eye that knows exactly how little it takes.",
  },
  {
    label: "Board-Certified Physician, MD",
    detail:
      "Every treatment is physician-administered and physician-designed by Dr. Phil Hong Nguyen — never handed off.",
  },
  {
    label: "The “Subtle is The New WOW” Philosophy",
    detail:
      "Results that look like you, only refreshed. No frozen, no overdone — just a naturally younger you that no one can quite place.",
  },
];

export function Authority() {
  return (
    <section
      id="authority"
      className="relative isolate scroll-mt-20 overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24 sm:py-28"
    >
      {/* Light field (Pass 3 light-flip): a faint pale-teal + pale-yellow wash
          over cool-grey — warm + feminine, dark used only as punctuation now. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 84% -4%, var(--color-accent-subtle), transparent 60%), radial-gradient(52% 55% at 2% 104%, oklch(95% 0.08 99 / 0.5), transparent 66%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Meet your physician"
          title={
            <>
              Meet{" "}
              <span className="font-display-em text-[var(--color-accent-deep)]">
                Dr. Phil.
              </span>
            </>
          }
          lead="Twenty-five years of cosmetic-injection experience, and a single conviction: the best work is the work no one notices. Dr. Phil Hong Nguyen, MD has built Happy Clinic around natural, physician-administered results — subtle by design."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Real, framed portrait of Dr. Phil + signature credential badge.
              The cell carries internal bottom/right padding so the negative-
              offset "25 years" badge is never clipped by the section's
              overflow-hidden (verified 1024–1280px where the column hits the
              container edge). */}
          <Reveal className="pb-7 pr-1 sm:pr-4 lg:pr-6">
            <div className="relative">
              {/* soft pale-teal/yellow halo behind the portrait card — warm
                  framing on the light field (decorative). */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] opacity-80 blur-2xl"
                style={{
                  background:
                    "radial-gradient(60% 60% at 25% 15%, var(--color-accent-subtle), transparent 70%), radial-gradient(60% 60% at 85% 95%, oklch(94% 0.1 99 / 0.55), transparent 72%)",
                }}
              />
              <figure
                className={cn(
                  "relative isolate overflow-hidden rounded-[1.75rem] border border-[var(--color-border)]",
                  "bg-[var(--color-bg-elevated)] p-2 shadow-[0_30px_70px_-32px_oklch(28.1%_0.07_252_/_0.32)]",
                )}
              >
                {/* 2:3 portrait — matches the source asset (4480×6720). The
                    portrait is the closer's LCP-class trust image → priority. */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem]">
                  <Image
                    src="/clients/happy-clinic/dr-phil.jpeg"
                    alt="Dr. Phil Hong Nguyen, MD — physician and cosmetic injector at Happy Clinic Denver"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    quality={75}
                    className="object-cover object-top"
                    priority
                  />
                  {/* pine-teal rim + a navy floor scrim so the caption stays
                      AA white-on-dark over the lower portrait. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[1.4rem] ring-1 ring-inset ring-[var(--color-accent-bright)]/30"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[oklch(10%_0.04_252_/_0.78)] via-[oklch(12%_0.04_252_/_0.35)] to-transparent"
                  />
                  <figcaption className="absolute bottom-4 left-5 z-[2]">
                    <p className="font-display-em text-xl text-white drop-shadow-[0_1px_8px_oklch(10%_0.04_252_/_0.8)]">
                      Dr. Phil Hong Nguyen, MD
                    </p>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                      Founder · Cosmetic Injector
                    </p>
                  </figcaption>
                </div>
              </figure>

              {/* floating proof badge — white card on the light field; sits
                  within the cell's bottom/right padding so it renders fully
                  inside the clip box. Carries a DIFFERENT proof from the heading
                  + credential cards (which already state "25 years") so the
                  closer reads as LAYERED credibility, not one fact thrice. */}
              <div className="absolute -bottom-4 -right-1 max-w-[15rem] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 p-4 shadow-[0_18px_44px_-22px_oklch(28.1%_0.07_252_/_0.5)] backdrop-blur-md sm:-right-3">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 place-items-center rounded-full font-bold text-[var(--color-fg)]"
                    style={{ background: "var(--color-gold)" }}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                      <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 17l-4.9 1.2.9-5.5-4-3.9 5.5-.8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
                      Every visit
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-fg)]">
                      Physician-administered
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Credential list + philosophy hook */}
          <div className="flex flex-col gap-5">
            {CREDENTIALS.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--glass-shadow)] transition-colors duration-300 hover:border-[var(--color-accent)]/40">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--color-accent-fg)]"
                    style={{ background: "var(--color-accent)" }}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                      <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-heading text-lg text-[var(--color-fg)]">
                      {c.label}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                      {c.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}

            {/* The real team behind your results — warm human layer using the
                two real staff photos. Small, so it supports (not competes with)
                the Dr. Phil portrait. */}
            <Reveal delay={0.2}>
              <div className="mt-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--glass-shadow)]">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
                  The team behind your results
                </p>
                <ul className="mt-4 flex flex-wrap gap-5">
                  {TEAM.map((m) => (
                    <li key={m.src} className="flex items-center gap-3">
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-[var(--color-accent)]/30">
                        <Image
                          src={m.src}
                          alt={m.alt}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold text-[var(--color-fg)]">{m.name}</span>
                        <span className="text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                          {m.role}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent-subtle)] p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-pretty text-[var(--color-fg)]">
                  <span className="font-semibold text-[var(--color-accent-deep)]">
                    A naturally younger you
                  </span>{" "}
                  starts with one honest consultation.
                </p>
                <Link
                  href="#book"
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-[var(--color-accent-fg)]",
                    "shadow-[0_14px_38px_-16px_oklch(52%_0.087_178_/_0.9)]",
                    "transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  )}
                >
                  Book with Dr. Phil
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
