import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./brand.css";

/* Editorial light serif — feminine high-fashion wellness character. The real
   Beyond Skin brand pairs a light serif display with a clean sans. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

/* Clean, neutral sans for body + UI */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "Beyond Skin Aesthetics — The Joy of Beauty & Wellness · Gahanna, Columbus OH",
  description:
    "Unveil your inner beauty as you discover joyful wellness. Beyond Skin Aesthetics in Gahanna, Ohio — injectables, lasers & devices, body contouring, esthetician services and wellness, in a warm, judgment-free home. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function BeyondSkinLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="beyond-skin"
      className={`${cormorant.variable} ${inter.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
