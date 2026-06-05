import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./brand.css";

/* Open Sans — the live brand's ACTUAL typeface. A friendly, highly legible
   humanist sans that reads warm and optimistic at every weight. Wired twice
   from one family: a LIGHT (300) axis drives the display wordmark + headings
   (--font-display) for the clean, airy feel of the real site, and the regular
   range (400/600/700) drives body, UI and fine print (--font-body). The whole
   identity is Open Sans — no serif, no script — exactly as the client's own
   site presents it. Deliberately distinct from the sibling builds' display
   faces (Darst → Newsreader; SimplySkin → Fraunces; Sousan → Playfair). */
const openSans = Open_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700"],
});

/* Same family for body — Open Sans regular range. Two CSS var handles
   (--font-display + --font-body) both point at Open Sans so brand.css can lean
   light for headings and regular for text without a second typeface. */
const openSansBody = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  /* The identity, true to the live brand's own warm, friendly voice — now
     dressed in the genuinely-good ORANGE palette the client already owns,
     and foregrounding the two real physicians + their actual Cincinnati NAP. */
  title:
    "Timeless Aesthetics MedSpa — Botox, Filler, Laser & Secret RF · Cincinnati, OH | Drs. Heuker & McCarren",
  description:
    "Cincinnati's friendly, physician-run medspa — led by Dr. Sonja Heuker, MD & Dr. Timothy McCarren, MD. Botox & Xeomin, filler, laser hair removal, Secret RF micro-needling and medical skin care at 3260 Westbourne Dr. Rejuvenate. Renew. Refresh. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function TimelessLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="timeless"
      className={`${openSans.variable} ${openSansBody.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
