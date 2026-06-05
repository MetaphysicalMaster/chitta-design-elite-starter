import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./brand.css";

/* Cormorant Garamond — the elegant high-contrast serif behind the live site's
   signature italic tagline, "Subtle is The New WOW." A true italic optical axis
   carries the refined, understated-luxury voice of a 25-year cosmetic-injection
   practice. Set as --font-display; used for the hero tagline + rare serif
   accents. Deliberately distinct from the sibling builds' display faces. */
const cormorant = Cormorant_Garamond({
  // Exposed under a distinct *source* var so brand.css can compose a full font
  // stack on --font-display without a self-referential (cyclic) declaration.
  variable: "--font-display-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/* Montserrat — the live site's working sans for section headings (bold, in
   pine-teal) and all body/UI copy. Geometric, warm, legible at every size. */
const montserrat = Montserrat({
  variable: "--font-body-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "Happy Clinic Denver — Subtle is The New WOW® | Dr. Phil Hong Nguyen, MD · Botox, Filler & Dysport",
  description:
    "Subtle is The New WOW. Led by Dr. Phil Hong Nguyen, MD — 25 years of cosmetic injection experience for a naturally younger you. Botox, Juvéderm, Dysport & aesthetics in Denver, CO. 1241 S Parker Rd Ste 100. Call 720-747-9999.",
  robots: { index: false, follow: false },
};

export default function HappyClinicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="happy-clinic"
      className={`${cormorant.variable} ${montserrat.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
