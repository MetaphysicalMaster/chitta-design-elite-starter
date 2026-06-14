import { SmoothScroll } from "@/components/mockups/the-luxe/SmoothScroll";
import { SiteNav } from "@/components/mockups/the-luxe/SiteNav";
import { LuxeHero } from "@/components/mockups/the-luxe/LuxeHero";
import { TrustBar } from "@/components/mockups/the-luxe/TrustBar";
import { BrandStory } from "@/components/mockups/the-luxe/BrandStory";
import { Services } from "@/components/mockups/the-luxe/Services";
import { BeforeAfter } from "@/components/mockups/the-luxe/BeforeAfter";
import { Team } from "@/components/mockups/the-luxe/Team";
import { Financing } from "@/components/mockups/the-luxe/Financing";
import { Booking } from "@/components/mockups/the-luxe/Booking";
import { ReviewsMarquee } from "@/components/mockups/the-luxe/ReviewsMarquee";
import { SiteFooter } from "@/components/mockups/the-luxe/SiteFooter";
import { Concierge } from "@/components/mockups/the-luxe/Concierge";

export default function TheLuxeMockupPage() {
  return (
    <SmoothScroll>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--color-accent)] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[var(--color-accent-fg)]"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <div id="top" />
        <LuxeHero />
        <TrustBar />
        <BrandStory />
        <Services />
        <BeforeAfter />
        <Team />
        <Financing />
        <Booking />
        <ReviewsMarquee />
      </main>
      <SiteFooter />
      <Concierge />
    </SmoothScroll>
  );
}
