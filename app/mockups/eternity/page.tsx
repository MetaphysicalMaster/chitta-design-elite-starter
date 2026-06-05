import { SmoothScroll } from "@/components/mockups/eternity/SmoothScroll";
import { SiteNav } from "@/components/mockups/eternity/SiteNav";
import { RibbonHero } from "@/components/mockups/eternity/RibbonHero";
import { TrustBar } from "@/components/mockups/eternity/TrustBar";
import { TheCloser } from "@/components/mockups/eternity/TheCloser";
import { Services } from "@/components/mockups/eternity/Services";
import { BeforeAfter } from "@/components/mockups/eternity/BeforeAfter";
import { Reviews } from "@/components/mockups/eternity/Reviews";
import { Financing } from "@/components/mockups/eternity/Financing";
import { Booking } from "@/components/mockups/eternity/Booking";
import { SiteFooter } from "@/components/mockups/eternity/SiteFooter";

export default function EternityPage() {
  return (
    <SmoothScroll>
      {/* Skip link — first focusable element for keyboard / AT users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-accent-bright)] focus:px-5 focus:py-2.5 focus:font-semibold focus:text-[var(--color-accent-fg)] focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        <RibbonHero />
        <TrustBar />
        {/* THE CLOSER — the 221-review proof + real online-booking upgrade.
            Placed high so the "phone-only era is over" story lands before the
            menu, retiring the free wordpress.com subdomain in the same breath. */}
        <TheCloser />
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
