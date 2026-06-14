import type { Metadata } from "next";
import { Cormorant, Inter } from "next/font/google";
import "./brand.css";

/* Refined, established serif — the credible, slightly editorial character that
   echoes the practice's script "dermatology" wordmark. Italic enabled for the
   refined emphasis lockup. */
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

/* Clean clinical sans — clarity for body + UI. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Encore Dermatology — The Science of Dermatology, the Environment of a Spa · Columbus, OH",
  description:
    "Established medical & surgical dermatology and The Spa at Encore — luxury aesthetics under one roof in NW Columbus. Led by Dr. Gwyn Londeree, MD, Associate Professor of Dermatology at the Ohio State University College of Medicine. Skin-cancer care, Botox, Juvéderm, Sciton Halo, CoolSculpting, RF microneedling and more. Book directly — no detour.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Encore Dermatology — The Science of Dermatology, the Environment of a Spa",
    description:
      "Established dermatology meets The Spa at Encore. Led by Dr. Gwyn Londeree, MD — OSU Associate Professor of Dermatology. NW Columbus, 4900 Gettysburg Rd.",
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
      className={`${cormorant.variable} ${inter.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
