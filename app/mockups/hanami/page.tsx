import { SmoothScroll } from "@/components/mockups/hanami/SmoothScroll";
import { SiteNav } from "@/components/mockups/hanami/SiteNav";
import { PetalHero } from "@/components/mockups/hanami/PetalHero";
import { TrustBar } from "@/components/mockups/hanami/TrustBar";
import { Philosophy } from "@/components/mockups/hanami/Philosophy";
import { SoleInjector } from "@/components/mockups/hanami/SoleInjector";
import { Services } from "@/components/mockups/hanami/Services";
import { BeforeAfter } from "@/components/mockups/hanami/BeforeAfter";
import { ProofWall } from "@/components/mockups/hanami/ProofWall";
import { Financing } from "@/components/mockups/hanami/Financing";
import { BookingCTA } from "@/components/mockups/hanami/BookingCTA";
import { SiteFooter } from "@/components/mockups/hanami/SiteFooter";

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
        <Services />
        <BeforeAfter />
        <ProofWall />
        <Financing />
        <BookingCTA />
      </main>

      <SiteFooter />
    </SmoothScroll>
  );
}
