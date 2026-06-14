"use client";

/**
 * Team — "Meet our team" — physician-led credibility + provider roster.
 * Establishes care authority with a warm marble + soft-peach portrait panel
 * (CSS placeholder, marked sample) and the care team. Light editorial brand.
 */

import { Reveal, RevealGroup, RevealItem } from "./primitives";

const PROVIDERS = [
  { name: "Anne", role: "Provider · Aesthetic Injector", photo: "/clients/the-luxe/real/team-anne.webp" },
  { name: "Sarah", role: "Advanced Practice · Injectables", photo: "/clients/the-luxe/real/team-sarah.webp" },
  { name: "Julie", role: "Facials · Laser · Skin Health", photo: "/clients/the-luxe/real/team-julie.webp" },
  { name: "Patient Concierge", role: "Booking · Membership · Care", photo: null },
];

export function Team() {
  return (
    <section
      id="team"
      className="grain relative scroll-mt-24 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1200px" }}
    >
      <div className="hairline-gold absolute inset-x-0 top-0" aria-hidden />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Portrait panel — the real studio portrait of Dr. Carlos Sanchez */}
        <Reveal>
          <figure className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--marble)] shadow-[0_40px_100px_-54px_oklch(50%_0.04_70_/_0.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/clients/the-luxe/real/dr-sanchez.webp"
              alt="Dr. Carlos Sanchez, Owner and Medical Director of The Luxe MedSpa"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
            {/* warm scrim so the caption reads cleanly over the photo */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/5"
              style={{
                background:
                  "linear-gradient(to top, oklch(26% 0.03 62 / 0.62), transparent)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-5 rounded-[1.5rem] border border-[oklch(92%_0.06_86_/_0.32)]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <span className="block font-display text-xl text-[var(--cream)]">
                  Dr. Carlos Sanchez
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-bright)]">
                  Owner · Medical Director
                </span>
              </div>
            </figcaption>
          </figure>
        </Reveal>

        {/* Copy */}
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow rule-gold inline-block text-[0.7rem] text-[var(--gold-deep)]">
              Meet our team
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="font-display mt-5 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.04 }}
            >
              Expert hands,{" "}
              <span className="gold-leaf italic">a genuine welcome.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className="mt-6 text-pretty font-light text-[var(--color-fg-muted)]"
              style={{ fontSize: "var(--fluid-lead)", lineHeight: 1.6 }}
            >
              The Luxe MedSpa is physician-led, with experienced providers who
              bring real clinical rigor to every treatment. Founded on the belief
              that aesthetic medicine should feel both safe and luxurious, our
              team takes the time to understand your goals — and earns the trust
              behind our 4.9-star reputation, one warm visit at a time.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-9 text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-fg-subtle)]">
              The Care Team
            </p>
          </Reveal>
          <RevealGroup
            as="ul"
            stagger={0.08}
            className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] sm:grid-cols-2"
          >
            {PROVIDERS.map((p) => (
              <RevealItem
                key={p.name}
                as="li"
                className="flex items-center gap-4 bg-[var(--color-bg-elevated)] p-5 transition-colors duration-300 hover:bg-[var(--color-accent-subtle)]"
              >
                {p.photo ? (
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[oklch(72%_0.1_80_/_0.4)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.photo}
                      alt={`${p.name}, The Luxe MedSpa care team`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] font-display text-base text-[var(--gold-deep)]"
                  >
                    {p.name.charAt(0)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block font-display text-lg text-[var(--color-fg)]">
                    {p.name}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--color-fg-muted)]">
                    {p.role}
                  </span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.2}>
            <p className="mt-4 text-xs text-[var(--color-fg-subtle)]">
              Provider names &amp; roles shown are representative for this concept.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
