import { SmoothScroll } from "@/components/mockups/beautox-bar/SmoothScroll";
import { SiteNav } from "@/components/mockups/beautox-bar/SiteNav";
import { BubbleHero } from "@/components/mockups/beautox-bar/BubbleHero";
import { TrustBar } from "@/components/mockups/beautox-bar/TrustBar";
import { Locations } from "@/components/mockups/beautox-bar/Locations";
import { Services } from "@/components/mockups/beautox-bar/Services";
import { BeforeAfter } from "@/components/mockups/beautox-bar/BeforeAfter";
import { Reviews } from "@/components/mockups/beautox-bar/Reviews";
import { Financing } from "@/components/mockups/beautox-bar/Financing";
import { Booking } from "@/components/mockups/beautox-bar/Booking";
import { SiteFooter } from "@/components/mockups/beautox-bar/SiteFooter";

export default function BeautoxBarPage() {
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
        <BubbleHero />
        <TrustBar />
        {/* THE CLOSER — the "Find your Bar" growth-ready multi-location grid,
            timed to the White Bear Township opening. Placed high so the
            multi-location / scalability story lands before the menu. */}
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
