import { SmoothScroll } from "@/components/mockups/happy-clinic/SmoothScroll";
import { AuroraConductor } from "@/components/mockups/happy-clinic/AuroraConductor";
import { SiteNav } from "@/components/mockups/happy-clinic/SiteNav";
import { AuroraHero } from "@/components/mockups/happy-clinic/AuroraHero";
import { TrustBar } from "@/components/mockups/happy-clinic/TrustBar";
import { Authority } from "@/components/mockups/happy-clinic/Authority";
import { Services } from "@/components/mockups/happy-clinic/Services";
import { BeforeAfter } from "@/components/mockups/happy-clinic/BeforeAfter";
import { SplitFlapBoard } from "@/components/mockups/happy-clinic/SplitFlapBoard";
import { Financing } from "@/components/mockups/happy-clinic/Financing";
import { BookingCTA } from "@/components/mockups/happy-clinic/BookingCTA";
import { SiteFooter } from "@/components/mockups/happy-clinic/SiteFooter";
import { MobileActionBar } from "@/components/mockups/happy-clinic/MobileActionBar";
import { ConciergeWidget } from "@/components/mockups/happy-clinic/ConciergeWidget";

export default function HappyClinicPage() {
  return (
    <SmoothScroll>
      {/* Skip link — first focusable element for keyboard/AT users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-accent)] focus:px-5 focus:py-2.5 focus:font-semibold focus:text-[var(--color-accent-fg)] focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        Skip to content
      </a>

      {/* THE SIGNATURE EXPERIENCE — one continuous Colorado night sky behind
          the whole page (fixed WebGL canvas). GSAP ScrollTrigger scrubs it
          from deep night at the hero to pre-dawn warmth by the booking
          section, and the dark sections become translucent "sky windows"
          ([data-sky-window]) the same living aurora bleeds through. Renders
          nothing on mobile / reduced-motion / no-WebGL (static night holds). */}
      <AuroraConductor />

      <SiteNav />

      <main id="main">
        <AuroraHero />
        <TrustBar />
        {/* The closer — "Meet Dr. Phil" authority section (real headshot) */}
        <Authority />
        <Services />
        {/* Real before/after results gallery (real client photos) */}
        <BeforeAfter />
        {/* Split-flap "Solari" review board — six panels flip round-robin
            (one flip / 1.5s → each panel refreshes every 9s). Now led by ONE
            static, named, fully-legible hero pull-quote (the board is the
            spectacle; the anchored quote is the substance).
            NOTE: components/.../ProofWall.tsx is the intentionally-RETIRED
            alternate review layout — kept on disk (operator's call) but NOT
            mounted; SplitFlapBoard is the canonical reviews surface. */}
        <SplitFlapBoard />
        <Financing />
        <BookingCTA />
      </main>

      <SiteFooter />

      {/* Mobile-only sticky Book + Call — the conversion path never scrolls away
          on the device where med-spa traffic actually is. Hidden on lg+. */}
      <MobileActionBar />

      {/* AI Concierge — the visible face of the Growth-OS missed-call / front-desk
          module and the centerpiece of the pitch demo. A fixed bottom-right
          launcher that opens a scripted, fully-canned booking chat in the
          clinic's voice. The ONLY bottom-right floater: on mobile it's lifted
          above the MobileActionBar (which owns bottom:0) so the two never
          collide; on lg+ the action bar is hidden and the launcher owns the
          corner. Books & routes only — never medical advice. */}
      <ConciergeWidget />
    </SmoothScroll>
  );
}
