import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./brand.css";

/* Elegant serif display — optical sizing, soft luxe character */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
});

/* Clean, humanist sans for body + UI */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blue Sky Med Spa — You Are Seen. Live Your Best Life. | German Village, Columbus",
  description:
    "Physician-led, family- and woman-owned medical spa in German Village, Columbus. 30 years of medical expertise meets a holistic approach to beauty and wellness — Botox, fillers, Sculptra, microneedling & PRP, PDO thread lifts, facials & peels, IV therapy, BHRT and medical weight loss, all with a 5.0★ standard of care. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function BlueSkyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="blue-sky"
      className={`${fraunces.variable} ${manrope.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
