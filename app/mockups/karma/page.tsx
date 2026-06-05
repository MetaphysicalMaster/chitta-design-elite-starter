import { SmoothScroll } from "@/components/mockups/karma/SmoothScroll";
import { SiteNav } from "@/components/mockups/karma/SiteNav";
import { OrbitHero } from "@/components/mockups/karma/OrbitHero";
import { TrustBar } from "@/components/mockups/karma/TrustBar";
import { Locations } from "@/components/mockups/karma/Locations";
import { Services } from "@/components/mockups/karma/Services";
import { BeforeAfter } from "@/components/mockups/karma/BeforeAfter";
import { Reviews } from "@/components/mockups/karma/Reviews";
import { Financing } from "@/components/mockups/karma/Financing";
import { Booking } from "@/components/mockups/karma/Booking";
import { SiteFooter } from "@/components/mockups/karma/SiteFooter";

export default function KarmaPage() {
  return (
    <SmoothScroll>
      {/* Skip link — first focusable element for keyboard / AT users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-accent)] focus:px-5 focus:py-2.5 focus:font-semibold focus:text-[var(--color-accent-fg)] focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        <OrbitHero />
        <TrustBar />
        {/* THE CLOSER — the two-metro switcher + injectables-meets-wellness
            duality. Placed high so the unified two-metro brand story (and the
            quiet retirement of the testkc.com staging leak) lands before the
            menu. */}
        <Locations />
        <Services />
        <BeforeAfter />
        <Reviews />
        <Financing />
        <Booking />
      </main>

      <SiteFooter />
    </SmoothScroll>
  );
}
