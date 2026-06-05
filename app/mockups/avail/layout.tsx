import type { Metadata } from "next";
import { Space_Grotesk, Inter_Tight, Inter } from "next/font/google";
import "./brand.css";

/* Confident grotesque display — sporty precision, bold growth-driven voice.
   Space Grotesk's mono-derived character reads as engineered + premium. */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* Inter Tight — tightened grotesque for sub-display + UI numerics. */
const interTight = Inter_Tight({
  variable: "--font-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* Clean, neutral sans for body copy + fine print. */
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title:
    "Avail Aesthetics — Four Locations. One Standard. | Cary · Raleigh · Wake Forest · Asheville, NC",
  description:
    "North Carolina's growth-built medical aesthetics brand. Four locations — Cary, Raleigh, Wake Forest & Asheville — one consistent standard of care. Injectables, lasers, body contouring, skin & wellness, led by CEO Stephen Rhodes and Dr. Nathan Davis. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function AvailLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="avail"
      className={`${spaceGrotesk.variable} ${interTight.variable} ${inter.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
