"use client";

/**
 * Meet — "Behind the bar". The single biggest conversion lever for a high-ticket
 * aesthetics buyer is WHO holds the needle, and the build had no provider/about
 * section at all. This introduces the (sample) team with credentials, each
 * injector's "house pour" specialty and a years-experience stat, plus an honest
 * partner/affiliation trust strip carrying the brand's GOLD note onto a light
 * surface (deepening the female-LUXURY register, not just the playful one).
 *
 * Portraits use the same BrandImage SAMPLE-plate honesty pattern as the B&A
 * slider — clearly marked "Client to supply real team headshots", so it slots a
 * real photo straight in. No invented people are presented as real: names read
 * as placeholder roles and the section is captioned as a sample.
 */

import { RevealGroup, RevealItem, SectionHeading, Reveal } from "./primitives";
import { BrandImage } from "./BrandImage";

type Provider = {
  /** placeholder name — clearly a sample, replaced with the real team on launch */
  name: string;
  credential: string;
  /** "her pour" — the injector's signature specialty, in bar voice */
  pour: string;
  years: string;
};

const TEAM: Provider[] = [
  {
    name: "Your Lead Injector",
    credential: "RN · Master Injector",
    pour: "Natural-result tox & full-face balancing",
    years: "10+ yrs",
  },
  {
    name: "Your Nurse Injector",
    credential: "RN, BSN · Aesthetics",
    pour: "Lip artistry & soft, kissable filler",
    years: "6+ yrs",
  },
  {
    name: "Your Aesthetician",
    credential: "Licensed Master Esthetician",
    pour: "Medical-grade glow facials & skin",
    years: "8+ yrs",
  },
];

/* Honest partner strip — real injector buyers look for the brands behind the
   needle. Shown as wordmarks the client confirms on launch (no false claims). */
const PARTNERS = ["Botox", "Dysport", "Allergan", "Galderma"];

export function Meet() {
  return (
    <section
      id="team"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Behind the bar"
          title={
            <>
              Meet the ones <span className="candy-text">pouring.</span>
            </>
          }
          lead="Every pour is placed by a licensed medical pro — woman-owned, nurse-led, and obsessed with results that look like you on your best day. This is who you're trusting near your face."
        />

        {/* Verifiable trust FIRST — for a $650 needle decision the buyer needs
            "is this safe / who's accountable" answered before the (sample) faces.
            Leads with the medical-supervision answer (the #1 unspoken objection),
            with an honest placeholder for the real medical director. */}
        <RevealGroup className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { v: "Medically supervised", k: "RN-led · medical director on record" },
            { v: "Licensed", k: "Medical providers only" },
            { v: "Free", k: "No-pressure consult, always" },
          ].map((t) => (
            <RevealItem key={t.k}>
              <div className="flex h-full items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3.5 shadow-[var(--glass-shadow)]">
                <span aria-hidden className="text-[var(--lilac-deep)]">✦</span>
                <span>
                  <span className="font-display block text-base leading-tight text-[var(--color-fg)]">
                    {t.v}
                  </span>
                  <span className="text-xs text-[var(--color-fg-muted)]">{t.k}</span>
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* "Your first pour, start to finish" — a 3-step walkthrough that converts
            first-injectable fear into confidence at the exact moment of hesitation.
            Honest, on-brand, no invented claims. */}
        <Reveal delay={0.05} className="mt-4">
          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--glass-shadow)] sm:p-8">
            <p className="eyebrow mb-5 text-[var(--lilac-deep)]">Your first pour, start to finish</p>
            <ol className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                {
                  t: "Free consult",
                  d: "Sit down with a licensed injector — no pressure, no commitment. We listen first.",
                },
                {
                  t: "Personalized plan",
                  d: "A medically-supervised plan tuned to your face, your goals and your budget.",
                },
                {
                  t: "Natural result",
                  d: "A subtle, refreshed you — placed by a pro, with aftercare and a check-in.",
                },
              ].map((s, i) => (
                <li key={s.t} className="relative flex flex-col gap-1.5">
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-accent-subtle)] text-sm font-bold text-[var(--color-accent-deep)] tnum"
                    >
                      {i + 1}
                    </span>
                    <span className="font-display text-base text-[var(--color-fg)]">{s.t}</span>
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{s.d}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs text-[var(--color-fg-subtle)]">
              <span className="font-semibold text-[var(--color-accent-deep)]">Client to confirm medical director</span>{" "}
              &amp; supervising physician on launch.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((p) => (
            <RevealItem key={p.name} as="article">
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5">
                <BrandImage
                  alt={`Beautox Bar provider portrait — ${p.credential}`}
                  aspect="4:5"
                  tone="magenta"
                  radius="lg"
                  scrim="soft"
                  className="rounded-none border-0 border-b border-[var(--color-border)]"
                >
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 p-4">
                    <span className="rounded-full bg-[oklch(16%_0.01_350_/_0.55)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[oklch(98%_0.01_350)] backdrop-blur-sm">
                      {p.credential}
                    </span>
                  </span>
                </BrandImage>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl text-[var(--color-fg)]">
                    {p.name}
                  </h3>
                  {/* gold "house pour" garnish — the luxe note on a light card */}
                  <p className="mt-1 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lilac-deep)]">
                    <span aria-hidden>✦</span> Her pour
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {p.pour}
                  </p>
                  <p className="mt-auto pt-5 text-sm font-semibold tnum text-[var(--color-fg)]">
                    {p.years}{" "}
                    <span className="font-normal text-[var(--color-fg-subtle)]">
                      placing injectables
                    </span>
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Honest sample note — same pattern as the B&A slider. */}
        <p className="mt-7 text-center text-xs text-[var(--color-fg-subtle)]">
          <span className="font-semibold text-[var(--color-accent-deep)]">
            Client to supply real team headshots, names &amp; credentials
          </span>{" "}
          — cards are ready. Sample roles shown for illustration.
        </p>

        {/* Partner / affiliation trust strip — brand-black band with the gold
            rule, real product wordmarks the client confirms on launch. */}
        <Reveal delay={0.05} className="mt-10">
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--glass-border-dark)] bg-[var(--night-0)] px-6 py-7 sm:px-10">
            <div className="flex flex-col items-center gap-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--lilac-bright)]">
                <span aria-hidden className="mr-2">
                  ✦
                </span>
                The products we pour
              </p>
              <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {PARTNERS.map((p) => (
                  <li
                    key={p}
                    className="font-display text-lg tracking-tight text-[oklch(94%_0.008_350_/_0.82)] sm:text-xl"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-[0.7rem] text-[oklch(78%_0.008_350_/_0.6)]">
                Brand wordmarks shown for illustration — partner/affiliation tiers
                confirmed with the client on launch.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
