"use client";

/**
 * Financing — a black callout band: this month's specials + "glow now, pay
 * monthly". Leads with the brand's REAL June-specials artwork (black + gold +
 * hot-pink, on-brand), then a friendly, low-pressure financing + membership
 * pitch that removes the price objection without feeling salesy. Sits on the
 * brand black so the gold + pink pop between the proof wall and booking module.
 * Reduced-motion safe.
 */

import Image from "next/image";
import Link from "next/link";
import { Reveal, ctaPrimary } from "./primitives";
import { cn } from "@/lib/utils";

const PERKS = [
  { v: "0%", k: "intro plans available" },
  { v: "60 sec", k: "soft-check, no impact" },
  { v: "Members", k: "save on every pour" },
];

export function Financing() {
  return (
    <section id="financing" className="scroll-mt-20 bg-[var(--color-bg)] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--glass-border-dark)] bg-[var(--night-0)] px-7 py-10 sm:px-12 sm:py-12">
            {/* fizz accents */}
            <span aria-hidden className="css-bubble absolute -right-6 -top-6 h-28 w-28 opacity-70" />
            <span aria-hidden className="css-bubble--lilac css-bubble absolute -bottom-8 left-10 h-20 w-20 opacity-60" />

            {/* Two real columns (pass 3 rebalance): the prior band crammed copy +
                artwork + perks into the left ~50% and left a lone CTA floating in
                a dead right/lower-right quadrant. Now the LEFT holds the pitch +
                the real June-specials artwork, and the RIGHT carries a designed
                "membership card" — the perks stat-stack with the CTA anchored
                beneath it — so the page's biggest promo surface is balanced and
                the button sits on content, not in a void. */}
            <div className="relative grid gap-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="eyebrow text-[var(--color-accent-bright)]">This month at the bar</p>
                <h2
                  className="font-display mt-4 text-balance text-[var(--color-bg)]"
                  style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}
                >
                  Specials on tap. <span className="candy-text--bright">Pay monthly.</span>
                </h2>
                <p className="mt-4 max-w-lg text-pretty leading-relaxed text-[oklch(92%_0.008_350_/_0.86)]">
                  Fresh specials drop monthly, plus flexible financing &amp; a
                  membership that rewards regulars — so treating yourself never
                  means stressing the tab. Quick soft check, no impact to your credit.
                </p>

                {/* real specials artwork — anchors the left column on black */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--glass-border-dark)]">
                  <Image
                    src="/clients/beautox-bar/specials.jpg"
                    alt="Beautox Bar Med Spa — June Specials: plump, hydrate, protect"
                    width={1238}
                    height={372}
                    sizes="(min-width: 1024px) 40rem, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              </div>

              {/* The membership card — fills the formerly-dead right quadrant and
                  gives the CTA a content anchor. Gold-edged on black, on-brand. */}
              <div className="relative overflow-hidden rounded-[1.4rem] border border-[oklch(80%_0.1_88_/_0.32)] bg-[oklch(22%_0.02_350_/_0.6)] p-6 sm:p-7">
                <span aria-hidden className="css-bubble--lilac css-bubble absolute -right-5 -top-5 h-16 w-16 opacity-50" />
                <p className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--lilac-bright)]">
                  <span aria-hidden>✦</span> The house tab
                </p>
                <dl className="relative mt-5 flex flex-col gap-4">
                  {PERKS.map((p) => (
                    <div key={p.k} className="flex items-baseline gap-3 border-b border-[var(--glass-border-dark)] pb-4 last:border-0 last:pb-0">
                      <dt className="font-display shrink-0 text-2xl leading-none text-[var(--color-bg)] tnum">
                        {p.v}
                      </dt>
                      <dd className="text-xs uppercase tracking-[0.14em] text-[oklch(86%_0.008_350_/_0.78)]">
                        {p.k}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Link href="#book" className={cn(ctaPrimary, "relative mt-6 w-full")}>
                  See my options
                </Link>
                <p className="relative mt-3 text-center text-xs text-[oklch(84%_0.008_350_/_0.7)]">
                  Sample offer — real terms shown at checkout.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
