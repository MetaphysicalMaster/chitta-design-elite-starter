import { SmoothScroll } from "@/components/mockups/darst/SmoothScroll";
import { SiteNav } from "@/components/mockups/darst/SiteNav";
import { LatticeHero } from "@/components/mockups/darst/LatticeHero";
import { TrustBar } from "@/components/mockups/darst/TrustBar";
import { RealProof } from "@/components/mockups/darst/RealProof";
import { PeakCTA } from "@/components/mockups/darst/PeakCTA";
import { Credentials } from "@/components/mockups/darst/Credentials";
import { Services } from "@/components/mockups/darst/Services";
import { TreatmentMarquee } from "@/components/mockups/darst/TreatmentMarquee";
import { Aesthetics } from "@/components/mockups/darst/Aesthetics";
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
        {/* Real third-party credentials (asset-polish): Charlotte Magazine Top
            Doctor + Dr. Darst's portrait, and the board-cert / membership strip. */}
        <RealProof />
        {/* Mid-page conversion moment at PEAK TRUST — immediately after the real
            Top Doctor + board-cert proof, so a sold buyer can book without
            scrolling the entire clinical narrative. Warm (coral) register. */}
        <PeakCTA />
        {/* The closer — "Why a dermatopathologist sees what others miss":
            the credentials-forward trust module that reframes the slipping
            3.5★ narrative around rare senior expertise. */}
        <Credentials />
        <Services />
        {/* Dual-track interleave: the WARM aesthetics beat (equal weight to the
            medical closer) + the BEFORE/AFTER reveal land RIGHT AFTER Services —
            not eight sections down — so the female-luxury buyer reaches content
            that mirrors her before four dense medical sections, honoring the
            hero's "two paths, one physician" promise in the body flow. The
            wedge: the doctor who reads the slide is the one who treats her face. */}
        <Aesthetics />
        <BeforeAfter />
        {/* Treatment marquee — an iconographic ribbon of the practice's full
            range, medical + aesthetic (pause-on-hover, reduced-motion safe).
            Sits after both journeys are opened, as the full-range bridge into
            social proof. */}
        <TreatmentMarquee />
        {/* Split-flap "Solari" review board — six panels flip round-robin
            (one flip / ~2.4s → each panel rests ~14s; composed, not strobing). */}
        <SplitFlapBoard />
        <Financing />
        <Booking />
      </main>

      <SiteFooter />
    </SmoothScroll>
  );
}
