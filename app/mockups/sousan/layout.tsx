import type { Metadata } from "next";
import { Inter, Pinyon_Script } from "next/font/google";
import "./brand.css";

/* Inter — the live Sousan Med Spa site is set entirely in Inter. We honor that
   single-typeface reality: Inter does ALL the work here, used two ways. As the
   DISPLAY face it's pushed bold + tight (large weights, negative tracking) for
   the editorial, monochrome-fashion headline voice that matches the greyscale-
   with-hot-pink hero. As the BODY face it's the clean, highly legible workhorse
   Inter is known for. One family, two registers — exactly the live brand.
   (The historical var names --font-display / --font-body are retained so every
   consuming component keeps working; both now resolve to Inter.) */
const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

/* Same Inter instance exposed under the body var — a second next/font binding so
   --font-body also resolves to Inter without a second network face. */
const interBody = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/* The "Sousan" SCRIPT wordmark — the literal logo of this pitch. Previously it
   rode an OS-dependent cursive stack ("Snell Roundhand"/"Apple Chancery" on Mac,
   "Segoe Script" on Windows, italic Inter on Linux/mobile) so the brand's primary
   identity mark rendered as a different font on every device — and often as plain
   italic Inter, which is not a script logo at all. Both counsels flagged this.
   Pinyon Script is a refined, formal calligraphic face wired via next/font (no OS
   roulette, no CLS) so the wordmark — and the plate ghost-"S" — render IDENTICALLY
   on every platform, on-brand. The real vector logo can still drop in later. */
const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  /* The brand voice, straight from the live site: a bold, editorial beauty
     destination in Houston. Monochrome confidence with one hot-pink statement. */
  title:
    "Sousan Med Spa — IPL, HydraFacial MD & Deluxe Facial · Houston, TX | Your Beauty Evolution",
  description:
    "Embark on your beauty evolution. Sousan Med Spa, Houston TX — transformative medspa services including IPL, HydraFacial MD and the Deluxe Facial. Award-winning care. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function SousanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="sousan"
      className={`${inter.variable} ${interBody.variable} ${pinyon.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
