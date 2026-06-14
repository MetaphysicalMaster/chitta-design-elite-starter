import { SmoothScroll } from "@/components/mockups/beyond-skin/SmoothScroll";
import { JourneyThread } from "@/components/mockups/beyond-skin/JourneyThread";
import { SiteNav } from "@/components/mockups/beyond-skin/SiteNav";
import { SurfaceHero } from "@/components/mockups/beyond-skin/SurfaceHero";
import { TrustBar } from "@/components/mockups/beyond-skin/TrustBar";
import { BrandStory } from "@/components/mockups/beyond-skin/BrandStory";
import { Services } from "@/components/mockups/beyond-skin/Services";
import { Unified } from "@/components/mockups/beyond-skin/Unified";
import { Membership } from "@/components/mockups/beyond-skin/Membership";
import { BeforeAfter } from "@/components/mockups/beyond-skin/BeforeAfter";
import { SocialGallery } from "@/components/mockups/beyond-skin/SocialGallery";
import { Booking } from "@/components/mockups/beyond-skin/Booking";
import { ReviewsMarquee } from "@/components/mockups/beyond-skin/ReviewsMarquee";
import { Concierge } from "@/components/mockups/beyond-skin/Concierge";
import { SiteFooter } from "@/components/mockups/beyond-skin/SiteFooter";

export default function BeyondSkinMockupPage() {
  return (
    <SmoothScroll>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--color-accent)] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[var(--color-accent-fg)]"
      >
        Skip to content
      </a>
      {/* The signature: a luminous thread tracing the journey to wellness down
          the page spine as you scroll (fixed overlay, desktop, motion-aware). */}
      <JourneyThread />
      <SiteNav />
      <main id="main">
        <div id="top" />
        <SurfaceHero />
        <TrustBar />
        <BrandStory />
        <Services />
        <Unified />
        <Membership />
        <BeforeAfter />
        <SocialGallery />
        <Booking />
        <ReviewsMarquee />
      </main>
      <SiteFooter />
      {/* AI front-desk concierge — fixed launcher, canned book/route-only flow. */}
      <Concierge />
    </SmoothScroll>
  );
}
