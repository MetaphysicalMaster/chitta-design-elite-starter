"use client";

/**
 * Services — "The Menu", served like a cocktail list. The injectables lead the
 * bar (the "Botox bar" concept); supporting glow + wellness services round it
 * out. Real, witty bar-pun naming over a clean, premium card grid; each card
 * lifts on hover. The MENU GRID leads (the product the visitor came for), then
 * the section closes on two real-artwork features: the "Happy Hour" panel (in
 * the brand's real LAVENDER secondary) and the black-bed "Peptide Bar"
 * needle-free feature (the brand's real peptides promo). Reduced-motion safe
 * via RevealGroup.
 */

import Image from "next/image";
import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./primitives";
import { LOCATIONS } from "./nap";
import { cn } from "@/lib/utils";

type Service = {
  name: string;
  tagline: string;
  detail: string;
  from: string;
  hero?: boolean;
  icon: "tox" | "filler" | "glow" | "lip" | "peptide" | "weight";
};

const SERVICES: Service[] = [
  {
    name: "The Classic Pour",
    tagline: "Botox / Dysport on tap",
    detail: "Smooth the 11s, soften crow's feet — natural, never frozen.",
    from: "$11 / unit",
    hero: true,
    icon: "tox",
  },
  {
    name: "Filler Flight",
    tagline: "Cheeks · jaw · under-eye",
    detail: "Restore volume and sculpt structure with a tailored filler plan.",
    from: "$650 / syringe",
    hero: true,
    icon: "filler",
  },
  {
    name: "Lip Service",
    tagline: "Soft, kissable, you",
    detail: "Subtle hydration to a fuller pout — your lips, leveled up.",
    from: "$575",
    icon: "lip",
  },
  {
    name: "The Glow Pour",
    tagline: "Medical-grade facial",
    detail: "Deep-clean, exfoliate and hydrate for an instant lit-from-within glow.",
    from: "$165",
    icon: "glow",
  },
  {
    name: "Peptide Bar",
    tagline: "Needle-free sublingual strips",
    detail:
      "BPC-157, GHK-Cu, NAD+, PT-141+, Glutathione & Thymosin Alpha-1 — wellness, zero needles.",
    from: "from $90",
    icon: "peptide",
  },
  {
    name: "Skinny Shot Club",
    tagline: "Weight & wellness",
    detail: "Provider-guided weight-management support, judgment-free.",
    from: "Consult",
    icon: "weight",
  },
];

function Icon({ name }: { name: Service["icon"] }) {
  const common = {
    className: "h-5 w-5",
    fill: "none" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  switch (name) {
    case "tox":
      return (
        <svg {...common}>
          <path d="M14 3l7 7-9 9-7 1 1-7 8-10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M12 6l6 6" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "filler":
      return (
        <svg {...common}>
          <path d="M19 5l-9 9-3 4 4-3 9-9-1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M5 19l2-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "glow":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "lip":
      return (
        <svg {...common}>
          <path d="M3 11c3-4 6 0 9 0s6-4 9 0c-2 4-6 6-9 6s-7-2-9-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "peptide":
      // a little capsule / strip — the needle-free wellness mark
      return (
        <svg {...common}>
          <rect x="3.5" y="9" width="17" height="6" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 9v6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "weight":
      return (
        <svg {...common}>
          <path d="M5 8h14l-1.4 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}

export function Services() {
  const mg = LOCATIONS.find((l) => l.id === "maple-grove");
  const wbl = LOCATIONS.find((l) => l.id === "white-bear-lake");

  return (
    <section id="services" className="scroll-mt-20 bg-[var(--color-bg-subtle)] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The menu"
          title={
            <>
              What&apos;s <span className="candy-text">on tap.</span>
            </>
          }
          lead="Injectables lead the bar — tox and filler are our house pour. Everything's delivered by licensed pros who keep it natural, fun and judgment-free. Sample pricing — client to confirm real rates."
        />

        {/* The MENU leads — the six-card grid is the product the visitor came
            for, so it comes first; the Happy Hour ritual + Peptide Bar feature
            close the section beneath it. */}
        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <RevealItem key={s.name} as="article">
              <article
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1",
                  s.hero
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-bg-elevated)] shadow-[0_20px_50px_-28px_oklch(60%_0.16_356_/_0.45)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)]",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-full transition-colors",
                      s.hero
                        ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent-deep)]"
                        : "bg-[var(--lilac-subtle)] text-[var(--lilac-deep)]",
                      "group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-fg)]",
                    )}
                  >
                    <Icon name={s.icon} />
                  </span>
                  {s.hero && (
                    <span className="rounded-full bg-[var(--color-accent-subtle)] px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-deep)]">
                      House pour
                    </span>
                  )}
                </div>

                <h3 className="font-display mt-5 text-xl text-[var(--color-fg)]">{s.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--color-accent-deep)]">{s.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{s.detail}</p>

                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="text-sm font-semibold tnum text-[var(--color-fg)]">
                    {/* Only prepend "from" for bare numeric prices — values that
                        already read "from $90" or "Consult" render bare so we
                        never print "from from $90" / "from Consult". */}
                    {/^[$\d]/.test(s.from) && (
                      <span className="text-[var(--color-fg-subtle)]">from </span>
                    )}
                    {s.from}
                  </span>
                  <a
                    href="#book"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-deep)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    Book
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </a>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Happy Hour feature — the brand's real signature artwork. Carries the
            real LAVENDER secondary (the artwork is hot-pink with lavender
            lettering) so the promo sits natively and the lighter, playful
            register is told alongside the gold one. */}
        <Reveal delay={0.05} className="mt-8">
          <div className="grid items-stretch gap-6 overflow-hidden rounded-[1.6rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--glass-shadow)] lg:grid-cols-[0.95fr_1.05fr]">
            {/* The real Happy Hour artwork is SQUARE (800×800), so it sits
                natively in a square-aware bed with object-cover — owning the
                whole column like the peptides slot, not letterboxed into a void.
                A thin pale-lilac frame (the art's real lavender lettering tone)
                rings it; object-center keeps the curved "HAPPY HOUR" lockup +
                smiley centered. */}
            <div className="relative aspect-square w-full overflow-hidden bg-[var(--bx-lavender-subtle)] p-2 sm:p-2.5 lg:aspect-auto">
              <div className="relative h-full w-full overflow-hidden rounded-[1.1rem]">
                <Image
                  src="/clients/beautox-bar/happy-hour.jpg"
                  alt="Beautox Bar Happy Hour — 2–4PM Mon–Thu in Maple Grove, 11AM–2PM Mon–Fri in White Bear Lake"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
              <p className="eyebrow text-[var(--bx-lavender-deep)]">It&apos;s always Happy Hour</p>
              <h3
                className="font-display text-balance text-[var(--color-fg)]"
                style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
              >
                Pull up a stool.
              </h3>
              <p className="text-pretty leading-relaxed text-[var(--color-fg-muted)]">
                Our signature Happy Hour windows are when the bar&apos;s buzzing —
                walk-ins welcome, regulars rewarded. These windows are when the
                pour&apos;s on; catch it at either bar:
              </p>
              <dl className="mt-1 grid gap-3 sm:grid-cols-2">
                {[mg, wbl].map(
                  (l) =>
                    l && (
                      <div
                        key={l.id}
                        className="rounded-2xl border border-[var(--bx-lavender)]/45 bg-[var(--bx-lavender-subtle)] p-4"
                      >
                        <dt className="font-display text-base text-[var(--color-fg)]">
                          {l.city}
                        </dt>
                        <dd className="mt-1 text-sm font-semibold tnum text-[var(--bx-lavender-deep)]">
                          {l.happyHour.replace("Happy Hour ", "")}
                        </dd>
                      </div>
                    ),
                )}
              </dl>
            </div>
          </div>
        </Reveal>

        {/* Peptide Bar feature — the brand's REAL peptides promo (black + gold +
            hot-pink, two models, the actual product strips). Wired natively via
            next/image on a brand-black bed so its gold script wordmark sits
            native; names the full real strip menu and leads with the needle-free
            differentiator. */}
        <Reveal delay={0.05} className="mt-6">
          <div className="grid items-stretch gap-6 overflow-hidden rounded-[1.6rem] border border-[var(--glass-border-dark)] bg-[var(--night-0)] shadow-[0_30px_80px_-44px_oklch(14%_0.02_350_/_0.85)] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
              <p className="eyebrow text-[var(--lilac-bright)]">
                <span aria-hidden className="mr-2">✦</span>The Peptide Bar
              </p>
              {/* The needle-free GAG made the headline device — echoes the real
                  peptides promo's struck-through-syringe punchline (a syringe with
                  a hot-pink X = "wellness, NO needles"), the single biggest hook
                  for the needle-averse buyer. The struck syringe sits inline with
                  the title rather than letterboxed in the photo below. */}
              <h3
                className="font-display flex flex-wrap items-center gap-x-3 gap-y-1 text-balance text-[var(--color-bg)]"
                style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
              >
                <span
                  aria-hidden
                  className="relative inline-grid shrink-0 place-items-center"
                  style={{ width: "1.2em", height: "1.2em" }}
                >
                  {/* clean diagonal syringe glyph (barrel + plunger + needle +
                      graduation ticks) — reads unmistakably as a syringe at small
                      size, then gets struck through. */}
                  <svg viewBox="0 0 24 24" className="h-[1.05em] w-[1.05em] text-[oklch(92%_0.008_350_/_0.92)]" fill="none">
                    {/* plunger rod + thumb-rest (top-right) */}
                    <path d="M16.5 7.5l3.5-3.5M18.5 3.5l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    {/* barrel */}
                    <path d="M9.5 14.5l5-5 .5.5 3 3 .5.5-5 5-2-1-2-2-1-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    {/* needle (lower-left tip) */}
                    <path d="M9.5 14.5l-4.5 4.5M5 19l-1.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    {/* two graduation ticks on the barrel */}
                    <path d="M13 11l1.2 1.2M11.4 12.6l1.2 1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {/* the hot-pink strike-through — the brand's own "no needles" mark */}
                  <span className="absolute left-1/2 top-1/2 h-[0.18em] w-[1.55em] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_oklch(70%_0.17_356_/_0.75)]" />
                </span>
                <span>
                  Wellness, <span className="candy-text--bright">no needles.</span>
                </span>
              </h3>
              <p className="text-pretty leading-relaxed text-[oklch(92%_0.008_350_/_0.86)]">
                Pharmacy-grade peptides as fast-dissolving sublingual strips — the
                research-backed wellness lineup, minus the injection. Recovery,
                glow, anti-aging, libido &amp; more, sipped not stuck.
              </p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {[
                  "BPC-157",
                  "GHK-Cu",
                  "NAD+",
                  "PT-141+",
                  "Glutathione",
                  "Thymosin Alpha-1",
                ].map((p) => (
                  <li
                    key={p}
                    className="rounded-full border border-[oklch(80%_0.1_88_/_0.35)] bg-[oklch(30%_0.05_86_/_0.32)] px-3 py-1 text-xs font-semibold tracking-tight text-[var(--lilac-bright)]"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-2">
                <a
                  href="#book"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-bright)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-bright)]"
                >
                  Add a strip to your pour
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </a>
              </div>
            </div>
            {/* Black bed + object-contain so the real promo (its own gold script
                wordmark + the product strips) is shown WHOLE on a native-black
                surface, not letterboxed in a flat pink box. */}
            <div className="relative order-first aspect-[3/2] w-full overflow-hidden bg-[var(--night-0)] lg:order-last lg:aspect-auto lg:min-h-[24rem]">
              <Image
                src="/clients/beautox-bar/peptides.jpg"
                alt="Beautox Bar Peptides — needle-free sublingual oral strips: BPC-157, GHK-Cu, NAD+, PT-141+, Glutathione & Thymosin Alpha-1"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-xs text-[var(--color-fg-subtle)]">
          Sample menu &amp; pricing for illustration —{" "}
          <span className="font-semibold text-[var(--color-accent-deep)]">client to confirm real pricing</span>{" "}
          on launch. Treatment plans are tailored in your consult.
        </p>
      </div>
    </section>
  );
}
