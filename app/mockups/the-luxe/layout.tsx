import type { Metadata } from "next";
import { Italiana, Jost } from "next/font/google";
import "./brand.css";

/* High-fashion couture display — a single elegant weight, all glamour. */
const italiana = Italiana({
  variable: "--font-italiana",
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
    "The Luxe MedSpa — Physician-Led Aesthetics & Bodycare in Upper Arlington, Columbus",
  description:
    "Opulent, physician-led medical spa in Upper Arlington, Columbus. Botox, Dysport, Daxxify, dermal fillers, Morpheus8, BBL HERO, MOXI, body contouring, medical weight loss, IV therapy & BHRT — delivered with a 4.9★ white-glove standard. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function TheLuxeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="the-luxe"
      className={`${italiana.variable} ${jost.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
