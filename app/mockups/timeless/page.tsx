import { SmoothScroll } from "@/components/mockups/timeless/SmoothScroll";
import { SiteNav } from "@/components/mockups/timeless/SiteNav";
import { HorologyHero } from "@/components/mockups/timeless/HorologyHero";
import { TrustBar } from "@/components/mockups/timeless/TrustBar";
import { DualPhysicians } from "@/components/mockups/timeless/DualPhysicians";
import { Services } from "@/components/mockups/timeless/Services";
import { VisitJourney } from "@/components/mockups/timeless/VisitJourney";
import { BeforeAfter } from "@/components/mockups/timeless/BeforeAfter";
import { ProofWall } from "@/components/mockups/timeless/ProofWall";
import { Financing } from "@/components/mockups/timeless/Financing";
import { BookingCTA } from "@/components/mockups/timeless/BookingCTA";
import { SiteFooter } from "@/components/mockups/timeless/SiteFooter";
import { Concierge } from "@/components/mockups/timeless/Concierge";

export default function TimelessPage() {
  return (
    <SmoothScroll>
      {/* Skip link — first focusable element for keyboard/AT users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-accent)] focus:px-5 focus:py-2.5 focus:font-semibold focus:text-[var(--color-accent-fg)] focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        <HorologyHero />
        <TrustBar />
        {/* The closer — "Two physicians, one standard" dual-MD credibility split */}
        <DualPhysicians />
        <Services />
        {/* The scroll-told signature: a pinned journey where one orange light-dot
            walks consult → plan → treat → glow along a drawn path. */}
        <VisitJourney />
        <BeforeAfter />
        <ProofWall />
        <Financing />
        <BookingCTA />
      </main>

      <SiteFooter />

      {/* GROWTH-OS DEMO · the single floating element: the AI CONCIERGE — the
          visible face of the missed-call / front-desk module. It opens with a
          canned missed-call → book chat in the clinic's voice, then hands off to
          the SAME guided-booking flow the nav "Book" buttons + #book section use.
          (This replaces the old standalone launcher, so there is exactly one
          floating bubble — no collision.) */}
      <Concierge />
    </SmoothScroll>
  );
}
