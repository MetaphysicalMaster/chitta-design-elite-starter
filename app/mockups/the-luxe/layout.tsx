import type { Metadata } from "next";
import { Cormorant_Garamond, Pinyon_Script, Jost } from "next/font/google";
import "./brand.css";

/* Editorial luxe serif — warm, elegant display (echoes the live gold script). */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

/* The gold SCRIPT face — recreates "The Luxe" signature wordmark. */
const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

/* Refined geometric sans for body + UI — clean, modern, luxe-neutral. */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title:
    "The Luxe MedSpa — Turn Back Time | Top-Rated Medical Spa in Upper Arlington, Columbus",
  description:
    "The Luxe MedSpa blends advanced aesthetic treatments with thoughtful, individualized care in Upper Arlington, Columbus. Botox, Dysport, Daxxify, dermal fillers, Morpheus8, BBL HERO, MOXI, EvolveX body contouring, medical weight loss & IV therapy — delivered with a 4.9★ standard. CareCredit & Cherry financing.",
  robots: { index: false, follow: false },
};

export default function TheLuxeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="the-luxe"
      className={`${cormorant.variable} ${pinyon.variable} ${jost.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
