"use client";

/**
 * Awards — the proud recognition strip that sits directly under the hero, just
 * as it does on the live sousanmedspahouston.net. Greyscale struck-metal
 * medallions (CSS-only, via the .sn-award treatment) each ringed with the lone
 * HOT-PINK accent — monochrome with the one statement color, exactly the brand.
 *
 * HONESTY (pass 3, both counsels' #3): the client's verified third-party honors
 * weren't captured, and inventing org-style titles ("Best Medspa", "Client
 * Choice") reads as a template site to a discerning aesthetics buyer — NET-
 * eroding trust. So the medallions carry credibility-POSITIVE proof the PRACTICE
 * itself owns (5.0 rating, review volume, HydraFacial MD certification, treatments
 * performed) rather than impersonating awarding authorities. Each coin shows a
 * stat + label; the section reads as earned proof, not advertised emptiness. One
 * quiet footnote marks the figures as representative samples. Fully accessible:
 * each badge exposes an aria-label; the sample status is announced. RM-safe.
 */

import { RevealGroup, RevealItem, SectionHeading } from "./primitives";

type Proof = {
  /** the headline figure on the coin — the credibility-positive number/mark */
  stat: string;
  /** short coin label beneath the stat */
  tag: string;
  /** the proof statement under the medallion */
  title: string;
};

/* Credibility-positive proof tiles — signals the practice genuinely owns, not
   invented third-party awards. Representative sample figures for the mockup; the
   client's real numbers (and any verified honors) drop straight in here. */
const PROOF: Proof[] = [
  { stat: "5.0", tag: "Rated", title: "5.0 on Google, client-loved" },
  { stat: "400+", tag: "Reviews", title: "Hundreds of 5-star reviews" },
  { stat: "MD", tag: "Certified", title: "HydraFacial MD certified" },
  { stat: "10k+", tag: "Treatments", title: "Treatments performed" },
];

/** A single greyscale struck-metal medallion with the pink accent ring + star.
    The coin carries the credibility-positive stat so each reads as earned proof. */
function Medallion({ stat, tag }: { stat: string; tag: string }) {
  return (
    <span
      aria-hidden
      className="sn-award h-24 w-24 shrink-0 sm:h-28 sm:w-28"
    >
      <span className="relative z-10 flex flex-col items-center leading-none">
        <span className="text-[var(--gold-mid)] text-base" aria-hidden>
          ★
        </span>
        <span className="font-display mt-1 text-[1.3rem] text-[var(--color-fg)] tnum">
          {stat}
        </span>
        <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[var(--gold-ink)]">
          {tag}
        </span>
      </span>
    </span>
  );
}

export function Awards() {
  return (
    <section
      id="awards"
      aria-label="Recognition and proof"
      className="relative border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Recognition"
          title={
            <>
              Proof Houston{" "}
              <span className="gold-leaf font-display-em">trusts</span>, not
              just claims.
            </>
          }
          lead="The signals that matter to a discerning client: a 5.0 rating, hundreds of reviews, certified expertise, and thousands of treatments delivered with an artist's eye."
        />

        {/* The wall of recognition — framed top + bottom by a thin pink rule so
            the strip registers as a confident, deliberate band, not loose stamps. */}
        <div className="relative mt-14">
          <span
            aria-hidden
            className="block h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold-deep), var(--gold), var(--gold-deep), transparent)",
            }}
          />
          <RevealGroup
            as="ul"
            className="grid grid-cols-2 gap-x-6 gap-y-12 py-12 sm:grid-cols-4"
            stagger={0.08}
          >
            {PROOF.map((p) => (
              <RevealItem
                as="li"
                key={p.title}
                className="flex flex-col items-center text-center"
              >
                <div role="img" aria-label={p.title} className="relative">
                  <Medallion stat={p.stat} tag={p.tag} />
                </div>
                <p className="font-display mt-5 max-w-[16ch] text-[1.02rem] leading-tight text-[var(--color-fg)]">
                  {p.title}
                </p>
                <p className="mt-1.5 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  Houston, TX
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
          <span
            aria-hidden
            className="block h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold-deep), var(--gold), var(--gold-deep), transparent)",
            }}
          />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[0.78rem] text-[var(--color-fg-subtle)]">
          Representative figures for this mockup — the practice&rsquo;s live
          numbers slot in here.
        </p>
      </div>
    </section>
  );
}
