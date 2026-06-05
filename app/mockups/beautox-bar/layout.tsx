import type { Metadata } from "next";
import { Albert_Sans, Playfair_Display } from "next/font/google";
import "./brand.css";

/* Albert Sans — the brand's typeface, used for EVERYTHING (display + body). A
   clean, friendly geometric-humanist sans with even rhythm and open counters: it
   reads modern, feminine and approachable, and the heavy weights still feel
   premium and intentional for the candy-pop headlines. One family, two roles —
   bold/tight for display, regular for body/NAP/UI. Tabular figures for phone
   numbers / prices / metrics. Variable axis loaded so headlines can run heavy
   without a second request. */
const albert = Albert_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* The same Albert Sans, wired to the body token so display + body share one
   family (per the real brand) while keeping the two CSS var names the components
   consume. */
const albertBody = Albert_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/* Playfair Display — a HIGH-CONTRAST engraved Roman with pronounced thick/thin
   stress, used ONLY for the "BEAUTOX BAR" wordmark. Fidelity fix (pass 3): the
   REAL mark in logo.png AND specials.jpg is unmistakably a high-contrast
   Didone/Trajan capital — heavy vertical stems, fine hairline serifs, classic
   Roman caps. A prior pass swapped to LOW-contrast Cormorant Garamond 600 and
   even documented the mark as "low-contrast … NOT a high-contrast Didone," which
   is exactly backwards from what the assets show — the airy 600 Cormorant read
   thinner/softer than the real lockup and weakened recognition at the nav (the
   most-seen brand surface). Playfair 700 restores the engraved thick/thin
   contrast. Set all-caps + letter-spaced in brand.css. The --font-serif var name
   is kept so every consumer is unchanged. Logotype voice only — never body. */
const wordmarkSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  /* The real brand: a playful cocktail-bar theme for injectables across two
     Twin Cities suburbs. "Where Shots And Beauty Mingle." */
  title:
    "Beautox Bar — Where Shots & Beauty Mingle · Botox Bar & Med Spa | Maple Grove & White Bear Lake, MN",
  description:
    "Maple Grove & White Bear Lake's playful Botox bar & med spa — tox, filler, lips, peptides & the glow. Pull up a stool: it's always Happy Hour. Book your pour in seconds.",
  robots: { index: false, follow: false },
  /* Give the REAL raster logo a job: favicon + social/OG card, so a pitched /
     shared link looks finished (the browser tab + link preview both carry the
     brand mark rather than the framework default). */
  icons: {
    icon: "/clients/beautox-bar/logo.png",
    apple: "/clients/beautox-bar/logo.png",
  },
  openGraph: {
    title: "Beautox Bar — Where Shots & Beauty Mingle",
    description:
      "The Twin Cities' playful Botox bar & med spa — Maple Grove & White Bear Lake. Tox, filler, lips, peptides & the glow. It's always Happy Hour.",
    type: "website",
    images: [{ url: "/clients/beautox-bar/specials.jpg" }],
  },
};

export default function BeautoxBarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="beautox-bar"
      className={`${albert.variable} ${albertBody.variable} ${wordmarkSerif.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
