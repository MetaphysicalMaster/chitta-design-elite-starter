import { SmoothScroll } from "@/components/mockups/hanami/SmoothScroll";
import { SiteNav } from "@/components/mockups/hanami/SiteNav";
import { PetalHero } from "@/components/mockups/hanami/PetalHero";
import { TrustBar } from "@/components/mockups/hanami/TrustBar";
import { Philosophy } from "@/components/mockups/hanami/Philosophy";
import { SoleInjector } from "@/components/mockups/hanami/SoleInjector";
import { Services } from "@/components/mockups/hanami/Services";
import { BeforeAfter } from "@/components/mockups/hanami/BeforeAfter";
import { AwardsRail } from "@/components/mockups/hanami/AwardsRail";
import { ReviewsWall } from "@/components/mockups/hanami/ReviewsWall";
import { Financing } from "@/components/mockups/hanami/Financing";
import { BookingCTA } from "@/components/mockups/hanami/BookingCTA";
import { SiteFooter } from "@/components/mockups/hanami/SiteFooter";
import { ConciergeWidget } from "@/components/mockups/hanami/ConciergeWidget";

export default function HanamiPage() {
  return (
    <SmoothScroll>
      {/* Skip link — first focusable element for keyboard/AT users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-accent-deep)] focus:px-5 focus:py-2.5 focus:font-semibold focus:text-[var(--color-accent-fg)] focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        <PetalHero />
        <TrustBar />
        {/* The closer — the Hanami philosophy cinematic intro, then the
            sole-injector intimacy section ("every face, by Dr. Phuah"). */}
        <Philosophy />
        <SoleInjector />
        {/* Reviews/testimonials DROPPED — replaced by the awards rail, the
            brand's proudest (and previously buried) proof. It lands HERE, right
            after the sole-injector beat, so the recognition theme is a single
            crescendo: "every face by one set of hands" → "and here is the
            hardware those hands earned" → then the menu. (BeforeAfter's Fort
            Worth Magazine press strip then reads as a lighter follow-on, not a
            second recognition beat competing with the trophy wall.) */}
        <AwardsRail />
        <Services />
        {/* The reputation module — a tasteful, SMALL live-reviews wall on the
            light surface. Deliberately the quiet sibling to the loud sumi-black
            AwardsRail above (which it must NOT compete with): an aggregate
            ★ 4.9 · Google lockup + a compact row of representative cards. */}
        <ReviewsWall />
        <BeforeAfter />
        <Financing />
        <BookingCTA />
      </main>

      <SiteFooter />

      {/* The front-desk / missed-call module — the page's single floating
          affordance (the nav Book is sticky-TOP; there is no other bottom-right
          bubble to collide with). A scripted, fully-canned concierge that demos
          the missed-call → book flow; books & routes only, never advises. */}
      <ConciergeWidget />
    </SmoothScroll>
  );
}
