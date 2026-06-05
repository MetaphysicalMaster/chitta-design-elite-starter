import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./brand.css";

/* Sora — a geometric, high-altitude display with optimistic, rounded-modern
   terminals. Reads premium-clinical yet warm — the "peak performance" voice.
   Deliberately distinct from the sibling Avail build's Space Grotesk. */
const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
    "Happy Clinic Denver — Colorado's #1 Botox & Juvéderm | Dr. Phil Nguyen, Allergan National Trainer",
  description:
    "Colorado's #1 Botox & Juvéderm volume clinic, led by Dr. Phil Nguyen, MD — an Allergan national trainer who teaches other injectors. Botox, Juvéderm, lasers & aesthetics in Denver. Two MDs, multiple expert injectors. Book in 30 seconds. 1241 S Parker Rd Ste 100, Denver, CO 80231.",
  robots: { index: false, follow: false },
};

export default function HappyClinicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="happy-clinic"
      className={`${sora.variable} ${inter.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
