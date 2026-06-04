import { SmoothScroll } from "@/components/mockups/blue-sky/SmoothScroll";
import { SiteNav } from "@/components/mockups/blue-sky/SiteNav";
import { SkyHero } from "@/components/mockups/blue-sky/SkyHero";
import { TrustBar } from "@/components/mockups/blue-sky/TrustBar";
import { Services } from "@/components/mockups/blue-sky/Services";
import { BeforeAfter } from "@/components/mockups/blue-sky/BeforeAfter";
import { Membership } from "@/components/mockups/blue-sky/Membership";
import { Testimonials } from "@/components/mockups/blue-sky/Testimonials";
import { BookingCTA } from "@/components/mockups/blue-sky/BookingCTA";
import { SiteFooter } from "@/components/mockups/blue-sky/SiteFooter";

export default function BlueSkyMockupPage() {
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
        <SkyHero />
        <TrustBar />
        <Services />
        <BeforeAfter />
        <Membership />
        <Testimonials />
        <BookingCTA />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
