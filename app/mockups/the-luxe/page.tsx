import { SmoothScroll } from "@/components/mockups/the-luxe/SmoothScroll";
import { SiteNav } from "@/components/mockups/the-luxe/SiteNav";
import { LiquidGoldHero } from "@/components/mockups/the-luxe/LiquidGoldHero";
import { TrustBar } from "@/components/mockups/the-luxe/TrustBar";
import { BrandStory } from "@/components/mockups/the-luxe/BrandStory";
import { Services } from "@/components/mockups/the-luxe/Services";
import { BeforeAfter } from "@/components/mockups/the-luxe/BeforeAfter";
import { Team } from "@/components/mockups/the-luxe/Team";
import { Financing } from "@/components/mockups/the-luxe/Financing";
import { Booking } from "@/components/mockups/the-luxe/Booking";
import { Testimonials } from "@/components/mockups/the-luxe/Testimonials";
import { SiteFooter } from "@/components/mockups/the-luxe/SiteFooter";

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
        <LiquidGoldHero />
        <TrustBar />
        <BrandStory />
        <Services />
        <BeforeAfter />
        <Team />
        <Financing />
        <Booking />
        <Testimonials />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
