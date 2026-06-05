import { SmoothScroll } from "@/components/mockups/happy-clinic/SmoothScroll";
import { SiteNav } from "@/components/mockups/happy-clinic/SiteNav";
import { AuroraHero } from "@/components/mockups/happy-clinic/AuroraHero";
import { TrustBar } from "@/components/mockups/happy-clinic/TrustBar";
import { Authority } from "@/components/mockups/happy-clinic/Authority";
import { Services } from "@/components/mockups/happy-clinic/Services";
import { BeforeAfter } from "@/components/mockups/happy-clinic/BeforeAfter";
import { ProofWall } from "@/components/mockups/happy-clinic/ProofWall";
import { Financing } from "@/components/mockups/happy-clinic/Financing";
import { BookingCTA } from "@/components/mockups/happy-clinic/BookingCTA";
import { SiteFooter } from "@/components/mockups/happy-clinic/SiteFooter";

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

      <SiteNav />

      <main id="main">
        <AuroraHero />
        <TrustBar />
        {/* The closer — Allergan-national-trainer authority section */}
        <Authority />
        <Services />
        <BeforeAfter />
        <ProofWall />
        <Financing />
        <BookingCTA />
      </main>

      <SiteFooter />
    </SmoothScroll>
  );
}
