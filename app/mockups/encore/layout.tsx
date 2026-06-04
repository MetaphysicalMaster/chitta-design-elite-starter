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
  title: "Encore Dermatology — The Finest in Skin Care · Columbus, OH",
  description:
    "Academic-level medical & surgical dermatology and The Spa at Encore — luxury aesthetics under one roof in Columbus. Led by Dr. Gwyn Londeree, MD, Associate Professor of Dermatology at the Ohio State University College of Medicine and board-certified since 2001. Skin-cancer care, Botox, Juvéderm, Sciton Halo, CoolSculpting and more. Book in 30 seconds — no Zocdoc detour.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Encore Dermatology — The Finest in Skin Care · Columbus, OH",
    description:
      "Academic-level dermatology meets luxury aesthetics. Led by Dr. Gwyn Londeree, MD — OSU Associate Professor of Dermatology. Serving Columbus since 2010.",
    type: "website",
    locale: "en_US",
  },
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
