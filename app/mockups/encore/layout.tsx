import type { Metadata } from "next";
import { Newsreader, Inter_Tight } from "next/font/google";
import "./brand.css";

/* Editorial serif — academic authority + premium editorial character.
   Optical sizing on; italic enabled for refined emphasis. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

/* Precise grotesque sans — clinical clarity for body + UI. */
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Encore Dermatology — Academic-Level Skin Care in Columbus, OH",
  description:
    "Board-certified, academic-level dermatology and luxury med-spa care in Columbus, led by Dr. Gwyn Londeree, MD — Associate Professor of Dermatology at the Ohio State University College of Medicine. Medical & surgical dermatology, skin cancer care, Botox, fillers, Sciton Halo laser, CoolSculpting and more. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function EncoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="encore"
      className={`${newsreader.variable} ${interTight.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
