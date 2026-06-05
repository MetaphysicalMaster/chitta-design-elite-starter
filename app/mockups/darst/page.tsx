import { SmoothScroll } from "@/components/mockups/darst/SmoothScroll";
import { SiteNav } from "@/components/mockups/darst/SiteNav";
import { LatticeHero } from "@/components/mockups/darst/LatticeHero";
import { TrustBar } from "@/components/mockups/darst/TrustBar";
import { Credentials } from "@/components/mockups/darst/Credentials";
import { Services } from "@/components/mockups/darst/Services";
import { TreatmentMarquee } from "@/components/mockups/darst/TreatmentMarquee";
import { BeforeAfter } from "@/components/mockups/darst/BeforeAfter";
import { SplitFlapBoard } from "@/components/mockups/darst/SplitFlapBoard";
import { Financing } from "@/components/mockups/darst/Financing";
import { Booking } from "@/components/mockups/darst/Booking";
import { SiteFooter } from "@/components/mockups/darst/SiteFooter";

export default function DarstPage() {
  return (
    <SmoothScroll>
      {/* Skip link — first focusable element for keyboard / AT users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-accent-deep)] focus:px-5 focus:py-2.5 focus:font-semibold focus:text-[var(--color-accent-fg)] focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        <LatticeHero />
        <TrustBar />
        {/* The closer — "Why a dermatopathologist sees what others miss":
            the credentials-forward trust module that reframes the slipping
            3.5★ narrative around rare senior expertise. */}
        <Credentials />
        <Services />
        {/* Treatment marquee — the auto-scrolling "Karma" ribbon of the
            practice's full range (pause-on-hover, reduced-motion safe). */}
        <TreatmentMarquee />
        <BeforeAfter />
        {/* Split-flap "Solari" review board — six panels flip round-robin
            (one flip / 1.5s → each panel refreshes every 9s). */}
        <SplitFlapBoard />
        <Financing />
        <Booking />
      </main>

      <SiteFooter />
    </SmoothScroll>
  );
}
