import { SmoothScroll } from "@/components/mockups/simplyskin/SmoothScroll";
import { SiteNav } from "@/components/mockups/simplyskin/SiteNav";
import { SkinGlowHero } from "@/components/mockups/simplyskin/SkinGlowHero";
import { TrustBar } from "@/components/mockups/simplyskin/TrustBar";
import { Locations } from "@/components/mockups/simplyskin/Locations";
import { Authority } from "@/components/mockups/simplyskin/Authority";
import { Services } from "@/components/mockups/simplyskin/Services";
import { BeforeAfter } from "@/components/mockups/simplyskin/BeforeAfter";
import { ProofWall } from "@/components/mockups/simplyskin/ProofWall";
import { Financing } from "@/components/mockups/simplyskin/Financing";
import { BookingCTA } from "@/components/mockups/simplyskin/BookingCTA";
import { SiteFooter } from "@/components/mockups/simplyskin/SiteFooter";

export default function SimplySkinPage() {
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
        <SkinGlowHero />
        <TrustBar />
        {/* The closer — two-location grid foregrounding the Carmel launch */}
        <Locations />
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
