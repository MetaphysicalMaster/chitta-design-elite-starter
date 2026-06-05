import { SmoothScroll } from "@/components/mockups/avail/SmoothScroll";
import { SiteNav } from "@/components/mockups/avail/SiteNav";
import { SlipstreamHero } from "@/components/mockups/avail/SlipstreamHero";
import { TrustBar } from "@/components/mockups/avail/TrustBar";
import { Locations } from "@/components/mockups/avail/Locations";
import { Services } from "@/components/mockups/avail/Services";
import { BeforeAfter } from "@/components/mockups/avail/BeforeAfter";
import { ProofWall } from "@/components/mockups/avail/ProofWall";
import { Financing } from "@/components/mockups/avail/Financing";
import { BookingCTA } from "@/components/mockups/avail/BookingCTA";
import { SiteFooter } from "@/components/mockups/avail/SiteFooter";

export default function AvailPage() {
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
        <SlipstreamHero />
        <TrustBar />
        {/* The closer — multi-location brand-system grid (SEO consolidation) */}
        <Locations />
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
