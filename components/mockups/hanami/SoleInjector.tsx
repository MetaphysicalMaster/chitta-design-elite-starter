"use client";

/**
 * SoleInjector — THE SECOND HALF OF THE CLOSER. "Every face, by Dr. Phuah."
 *
 * The single most important correction this page makes: the live healthcare-SEO
 * template, with its broken/duplicate title tags, completely hides the practice's
 * actual differentiator — that Dr. Elaine Phuah (DO, MBA) is the SOLE injector
 * and performs every injectable treatment herself. That is the entire personal
 * brand a template can never carry. Here we foreground it as an intimacy
 * section: one named physician, one set of hands, every single face.
 */

import { Reveal, BrandImage, btnPrimary, btnGhost } from "./primitives";
import Link from "next/link";

const CREDS = [
  "DO · Doctor of Osteopathic Medicine",
  "MBA · the practice she built and runs",
  "Sole injector — every syringe, by her",
  "Fort Worth's quiet word-of-mouth name",
];

export function SoleInjector() {
  return (
    <section
      id="injector"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg-warm)] py-24 sm:py-28"
    >
      {/* soft sakura aura echoing the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(50% 46% at 90% 6%, oklch(88% 0.07 352 / 0.55), transparent 70%), radial-gradient(46% 50% at 4% 98%, var(--color-accent-subtle), transparent 72%)",
        }}
      />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* Portrait */}
        <Reveal className="lg:col-span-5">
          <div className="relative">
            <BrandImage
              aspect="4 / 5"
              variant="sakura"
              radius="3xl"
              label="Dr. Elaine Phuah, DO MBA"
              className="shadow-[var(--glass-shadow)]"
            />
            {/* signature seal — "one set of hands" */}
            <div
              aria-hidden
              className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-4 shadow-[0_18px_50px_-24px_oklch(58%_0.12_354_/_0.4)] sm:block"
            >
              <p className="font-display text-2xl italic text-[var(--color-accent-deep)]">
                Elaine Phuah
              </p>
              <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                Sole injector · every face
              </p>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="rule-fine eyebrow inline-block text-accent-deep">
              The hands behind every result
            </p>
            <h2
              className="font-display mt-5 text-balance text-[var(--color-fg)]"
              style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.08 }}
            >
              Every face here is shaped by{" "}
              <span className="font-display-em italic">one person.</span>
            </h2>
            <p className="mt-6 max-w-[52ch] text-pretty font-light leading-relaxed text-[var(--color-fg-muted)]">
              Not a rotating roster. Not a nurse you&apos;ll meet once. Every
              injectable at Hanami is placed by{" "}
              <span className="font-medium text-[var(--color-fg)]">
                Dr. Elaine Phuah
              </span>{" "}
              herself — a physician (DO, MBA) who built this practice and remains
              its sole injector. The continuity of one trained eye, one steady
              hand, learning your face over time. That is what the old template
              never said out loud.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CREDS.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 px-4 py-3.5 text-sm text-[var(--color-fg-muted)] backdrop-blur-sm"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]"
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

          <Reveal delay={0.14}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#book" className={btnPrimary}>
                Book with Dr. Phuah
              </Link>
              <Link href="#services" className={btnGhost}>
                See her treatments
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.16}>
        <p className="mx-auto mt-20 max-w-[58ch] px-6 text-center font-display text-xl italic leading-relaxed text-[var(--color-fg)] sm:text-2xl">
          &ldquo;One injector. One philosophy. Your face, learned over seasons —
          never handed off.&rdquo;
        </p>
      </Reveal>
    </section>
  );
}
