import { SmoothScroll } from "@/components/mockups/sousan/SmoothScroll";
import { PinkThread } from "@/components/mockups/sousan/PinkThread";
import { SiteNav } from "@/components/mockups/sousan/SiteNav";
import { CausticsHero } from "@/components/mockups/sousan/CausticsHero";
import { Awards } from "@/components/mockups/sousan/Awards";
import { TrustBar } from "@/components/mockups/sousan/TrustBar";
import { Legacy } from "@/components/mockups/sousan/Legacy";
import { Services } from "@/components/mockups/sousan/Services";
import { BeforeAfter } from "@/components/mockups/sousan/BeforeAfter";
import { Reviews } from "@/components/mockups/sousan/Reviews";
import { Financing } from "@/components/mockups/sousan/Financing";
import { Booking } from "@/components/mockups/sousan/Booking";
import { SiteFooter } from "@/components/mockups/sousan/SiteFooter";
import { Concierge } from "@/components/mockups/sousan/Concierge";

export default function SousanPage() {
  return (
    <SmoothScroll>
      {/* Skip link — first focusable element for keyboard/AT users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-accent-deep)] focus:px-5 focus:py-2.5 focus:font-semibold focus:text-[var(--color-accent-fg)] focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        <CausticsHero />
        {/* Awards strip — directly under the hero, as on the live site. */}
        <Awards />
        <TrustBar />
        {/* The story + the single clean NAP / branded-contact block. */}
        <Legacy />
        <Services />
        <BeforeAfter />
        <Reviews />
        <Financing />
        <Booking />
      </main>

      <SiteFooter />

      {/* THE PINK THREAD — the signature experience. One continuous magenta
          line sewing the whole page together, drawn by scroll: signature →
          portrait → proof → timeline rail → results divider → booking knot. */}
      <PinkThread />

      {/* AI CONCIERGE — the Growth-OS "missed-call / front desk" demo surface.
          The slug's SOLE bottom-right floating affordance (SiteNav is a top bar;
          PinkThread is a pointer-events:none overlay), so there's no competing
          bubble. Fully scripted + local-state; static-export safe. */}
      <Concierge />
    </SmoothScroll>
  );
}
