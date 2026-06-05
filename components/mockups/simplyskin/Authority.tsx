"use client";

/**
 * Authority — the practice's approach. SimplySkin is "Body & Skincare, Guided
 * By Medical Expertise": an understated, medical-grade med spa. Editorial
 * two-column — the real hero photograph beside a quiet, confident statement of
 * philosophy + recognition chips. Restraint over spectacle.
 */

import { Reveal, SectionHeading, BrandImage } from "./primitives";

const CREDS = [
  "Physician-led, medically supervised",
  "Allergan-trained injectors",
  "Conservative, proportion-first dosing",
  "Consultation before every plan",
  "Natural, restrained results",
  "Two Indianapolis-metro locations",
];

/* The practitioner IS the product for a medical-authority brand. A named,
   credentialed "Guided by" moment turns anonymous authority into trust. The
   headshot, name and details are a clearly-labelled SAMPLE provider until the
   client supplies the real clinician's photo and credentials. */
const PROVIDER = {
  name: "Dr. [Name] · [Surname], NP-C",
  credential: "Medical Director · Allergan-trained · 12+ years in aesthetics",
  signature:
    "I treat faces the way I'd want mine treated — conservatively, and only when it serves you. We start with a conversation, never a quota.",
};

export function Authority() {
  return (
    <section
      id="authority"
      className="relative scroll-mt-28 overflow-hidden py-24 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* Portrait — the real hero photograph */}
        <Reveal className="lg:col-span-5">
          <div className="relative">
            {/* A deliberately different frame from the wide hero — reframed to
                the upper face/eye so the single photo doesn't read as the literal
                same shot (a taller 4/5 crop high on the subject). */}
            <BrandImage
              aspect="4 / 5"
              radius="3xl"
              src="/clients/simplyskin/hero.jpg"
              alt="A close, soft-lit study of calm, healthy, natural skin — quiet ease, the SimplySkin result."
              position="58% 12%"
            />
            {/* floating editorial caption — inset on mobile so it never clips
                the viewport at 375px; floats off-edge from sm up. The Allergan &
                Galderma lockup is deliberately reserved for ONE hero-grade
                placement in Locations, so here the float speaks the philosophy,
                not the award (keeps the prestige signal scarce). */}
            <div className="absolute -bottom-6 right-3 max-w-[15rem] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--glass-shadow)] sm:-right-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-deep)]">
                The result
              </p>
              <p className="mt-1 font-display text-lg italic text-[var(--color-fg)]">
                Looks like you, only rested
              </p>
              <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">
                Conservative, medically-guided care — never overdone
              </p>
            </div>
          </div>
        </Reveal>

        {/* Statement */}
        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading
              eyebrow="Our approach"
              title={
                <>
                  The best work is the work{" "}
                  <span className="font-display-em">no one notices.</span>
                </>
              }
              lead="Considered, never rushed. We dose conservatively, lead with proportion over volume, and start every plan with a conversation — so the result is simply a better-rested version of you, not a face that looks &ldquo;done.&rdquo;"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {CREDS.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 text-sm text-[var(--color-fg-muted)]"
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
          </Reveal>

          {/* ONE provider moment — a named, credentialed, human face is the
              single most trust-building beat on a medical-authority page, so the
              page carries exactly one (the earlier duplicate pull-quote was
              collapsed; its line is now the section headline). The headshot,
              name and credentials are a clearly-labelled SAMPLE until the client
              supplies the real clinician. */}
          <Reveal delay={0.16}>
            <figure className="mt-10 flex items-center gap-5 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--glass-shadow)] sm:p-6">
              {/* Sample placeholder avatar — the in-circle "sample" pill is
                  suppressed (it crowds an 80px circle); the honesty is carried
                  instead by the role=img aria-label and the visible "Sample
                  provider · real photo & name at launch" note in the caption. */}
              <BrandImage
                aspect="1 / 1"
                variant="nude"
                radius="full"
                sample={false}
                className="h-20 w-20 shrink-0 sm:h-24 sm:w-24"
              />
              <figcaption className="min-w-0">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-deep)]">
                  Guided by
                </p>
                <p className="mt-1 font-display text-lg text-[var(--color-fg)]">
                  {PROVIDER.name}
                </p>
                <p className="text-xs text-[var(--color-fg-subtle)]">
                  {PROVIDER.credential}
                </p>
                <p className="mt-3 text-sm font-light italic leading-relaxed text-[var(--color-fg-muted)]">
                  &ldquo;{PROVIDER.signature}&rdquo;
                </p>
                <p className="mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                  Sample provider · real photo &amp; name at launch
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
