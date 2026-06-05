import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./brand.css";

/* Fraunces — an editorial, high-contrast "old-style" serif with optical
   sizing. Set light (340) it reads quiet-luxury and effortless-expert: the
   "simple by design, elite by results" voice. Deliberately distinct from the
   sibling builds' geometric sans (Avail → Space Grotesk, Happy Clinic → Sora). */
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

/* Inter — clean, neutral clinical sans for body copy, UI and fine print. */
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "SimplySkin MedSpa — Top 1% Allergan Injectables · Fishers & Carmel, Indiana | Holly Sheldon-Paquin",
  description:
    "Indianapolis-metro's quiet-luxury med spa, led by Holly Sheldon-Paquin — a Top 1% US Allergan / Top 10 Indiana injector with 20 years of artistry. Injectables-led premium care in Fishers, now expanding to Carmel. Simple by design, elite by results. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function SimplySkinLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="simplyskin"
      className={`${fraunces.variable} ${inter.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
