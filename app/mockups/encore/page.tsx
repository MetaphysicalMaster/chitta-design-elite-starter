import { SmoothScroll } from "@/components/mockups/encore/SmoothScroll";
import { SiteNav } from "@/components/mockups/encore/SiteNav";
import { RenewalHero } from "@/components/mockups/encore/RenewalHero";
import { TrustBar } from "@/components/mockups/encore/TrustBar";
import { CarePaths } from "@/components/mockups/encore/CarePaths";
import { WhyEncore } from "@/components/mockups/encore/WhyEncore";
import { MedicalServices, SpaServices } from "@/components/mockups/encore/Services";
import { BeforeAfter } from "@/components/mockups/encore/BeforeAfter";
import { Doctor } from "@/components/mockups/encore/Doctor";
import { Financing } from "@/components/mockups/encore/Financing";
import { Testimonials } from "@/components/mockups/encore/Testimonials";
import { BookingCTA } from "@/components/mockups/encore/BookingCTA";
import { SiteFooter } from "@/components/mockups/encore/SiteFooter";
import { RenewalSeam } from "@/components/mockups/encore/LightShaftDivider";

export default function EncoreMockupPage() {
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
        <RenewalHero />
        <TrustBar />
        <CarePaths />
        {/* Renewal-light seam: melt the care-path split into the Why-Encore spine */}
        <RenewalSeam from="var(--color-bg)" to="var(--color-bg)" />
        <WhyEncore />
        <MedicalServices />
        {/* Cool clinical → warm spa: the seam shifts the underglow toward rose */}
        <RenewalSeam underglow="oklch(70% 0.09 22 / 0.08)" />
        <SpaServices />
        <BeforeAfter />
        <RenewalSeam />
        <Doctor />
        <Financing />
        <Testimonials />
        <BookingCTA />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
