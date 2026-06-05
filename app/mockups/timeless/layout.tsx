import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./brand.css";

/* Cormorant Garamond — a high-contrast, editorial Garamond display with
   generous ascenders and an unhurried, heirloom-luxury voice. Set in the
   aubergine-ink + brass world it reads "trusted for a decade, ahead for the
   next." Deliberately distinct from the sibling builds (Avail → Space Grotesk,
   Happy Clinic → Sora, SimplySkin → Fraunces): older, warmer, more literary. */
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/* Inter — quiet, neutral clinical sans for body copy, UI and fine print. */
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  /* The identity correction in a single tag: the live site's Google title reads
     "Family Medicine Physicians" — this reads as the luxury aesthetics
     institution it actually is. */
  title:
    "Timeless Aesthetics MedSpa — Luxury Injectables, Laser & Skin · Cincinnati, OH | Drs. McCarren & Heuker",
  description:
    "Cincinnati's heirloom-luxury med spa — physician-led by Dr. Timothy McCarren & Dr. Sonja Heuker. 4.9★, 10+ years. Injectables, Secret RF & laser, and medical skin care at 3260 Westbourne Dr. Trusted for a decade, ahead for the next. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function TimelessLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="timeless"
      className={`${cormorant.variable} ${inter.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
