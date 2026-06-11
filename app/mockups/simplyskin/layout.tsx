import type { Metadata } from "next";
import { Libre_Baskerville, Inter } from "next/font/google";
import "./brand.css";

/* Libre Baskerville — the live site's elegant, high-contrast old-style serif.
   Set at 400 it reads understated and refined: the "Body & Skincare, Guided By
   Medical Expertise" voice — quiet restraint, not couture flourish. Distinct
   from the sibling builds' geometric sans (Avail → Space Grotesk, Happy Clinic
   → Sora). */
/* NOTE: the variable is --font-display-src (not --font-display) — brand.css
   composes the public --font-display token FROM this source plus fallbacks.
   Naming both the same creates a cyclic var() → guaranteed-invalid → the
   serif silently falls back to the body sans (caught live; same fix pattern
   as the hanami / happy-clinic slugs). */
const libreBaskerville = Libre_Baskerville({
  variable: "--font-display-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

/* Inter — clean, neutral sans for body copy, UI and fine print, matching the
   live site's clean sans pairing under the Baskerville headings. */
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "SimplySkin MedSpa — Body & Skincare, Guided By Medical Expertise · Fishers & Carmel, Indiana",
  description:
    "An understated, medical-grade med spa for body & skincare in the Indianapolis metro — Fishers and Carmel West / Zionsville. Allergan & Galderma award-winning injectable and skincare artistry, guided by medical expertise. Book your consultation.",
  robots: { index: false, follow: false },
};

export default function SimplySkinLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="simplyskin"
      className={`${libreBaskerville.variable} ${inter.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
