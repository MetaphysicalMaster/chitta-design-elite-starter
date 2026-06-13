import { SmoothScroll } from "@/components/mockups/beautox-bar/SmoothScroll";
import { SiteNav } from "@/components/mockups/beautox-bar/SiteNav";
import { BubbleHero } from "@/components/mockups/beautox-bar/BubbleHero";
import { TrustBar } from "@/components/mockups/beautox-bar/TrustBar";
import { Locations } from "@/components/mockups/beautox-bar/Locations";
import { Services } from "@/components/mockups/beautox-bar/Services";
import { BeforeAfter } from "@/components/mockups/beautox-bar/BeforeAfter";
import { Reviews } from "@/components/mockups/beautox-bar/Reviews";
import { Meet } from "@/components/mockups/beautox-bar/Meet";
import { Financing } from "@/components/mockups/beautox-bar/Financing";
import { Booking } from "@/components/mockups/beautox-bar/Booking";
import { SiteFooter } from "@/components/mockups/beautox-bar/SiteFooter";
import { MobileBookingBar } from "@/components/mockups/beautox-bar/MobileBookingBar";
import { Concierge } from "@/components/mockups/beautox-bar/Concierge";

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
        {/* THE MENU leads — for "a cocktail bar for injectables," what's on tap
            is the hook, so the visitor sees the treatments before being asked to
            pick a neighborhood. Desire → proof → people → logistics → book. */}
        <Services />
        <BeforeAfter />
        <Reviews />
        {/* "Behind the bar" — WHO holds the needle: the #1 trust lever for a
            high-ticket aesthetics buyer. Sits with the proof cluster. */}
        <Meet />
        {/* "Find your bar" — the two real locations, placed late so "pick your
            bar" flows straight into "grab your seat" at Booking. */}
        <Locations />
        <Financing />
        <Booking />
      </main>

      <SiteFooter />

      {/* Mobile-only sticky booking bar — appears after the hero, hides over the
          booking module. Thumb-reachable Book + Text for the mobile-first buyer. */}
      <MobileBookingBar />

      {/* AI Concierge — the visible face of the Growth-OS "missed-call / front
          desk" module and the centerpiece of the pitch demo. The single
          bottom-right floating element; on mobile it lifts above the booking bar
          (watches the same #top/#book anchors) so the two never stack. Fully
          canned, local-state — books / qualifies / routes only, no medical advice,
          static-export safe. */}
      <Concierge />
    </SmoothScroll>
  );
}
