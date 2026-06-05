import type { Metadata } from "next";
import { Abel, Open_Sans } from "next/font/google";
import "./brand.css";

/* Abel — the tall, refined condensed sans the LIVE Hanami hero uses for its
   headings. It carries the brand's feminine-luxury voice: clean, elegant, a
   little couture, and reads beautifully large. Wired to --font-display so every
   consuming component keeps working unchanged.
   Deliberately distinct from the siblings' display faces (Timeless → Cormorant
   Garamond; SimplySkin → Fraunces; Happy Clinic → Sora; Darst → Newsreader). */
const abel = Abel({
  /* NOTE: a distinct source-variable name (not --font-display) so brand.css can
     map --font-display → this without a self-referential CSS cycle (which would
     silently void the variable and fall back to the body font). */
  variable: "--font-display-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

/* Open Sans — the live site's body face: a clean, friendly humanist sans for
   copy, UI and fine print. Pairs with Abel the way the real brand does. */
const openSans = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  /* The identity correction in a single tag: the live site ships a generic
     healthcare-SEO template with broken/duplicate title tags that waste the
     name. This reads as the branded, award-winning world the name promises. */
  title:
    "Hanami Medspa — Injectables, Laser & IPL by Dr. Elaine Phuah, DO · Fort Worth, TX | 花見",
  description:
    "Fort Worth's award-winning med spa — DFW Favorites WINNER & Fort Worth Top Doctor. Every face by Dr. Elaine Phuah, DO MBA FACOI, the sole injector. Injectables, laser & IPL at 800 8th Ave, Suite 508. Hanami means cherry-blossom viewing — the art of becoming, in bloom. Book your consultation.",
  robots: { index: false, follow: false },
};

export default function HanamiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="hanami"
      className={`${abel.variable} ${openSans.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
