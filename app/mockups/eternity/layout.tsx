import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./brand.css";

/* Bodoni Moda — an extreme high-contrast DIDONE serif: hairline-to-stem
   modulation, sharp unbracketed serifs, a couture editorial air. It carries the
   "timeless noir-luxe" voice — eighteen years of refined mastery, results that
   last — without tipping into the warm-gold register of The Luxe or the light
   ivory of Timeless. Deliberately a face NOT used by any sibling (Sousan →
   Playfair; Timeless → Cormorant; SimplySkin → Fraunces; Hanami → Shippori;
   Darst → Newsreader; Karma → Spectral; Beautox → Bricolage). Loaded with
   italics for the devotional flourish word. */
const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/* Jost — a clean geometric sans for body, NAP, UI and fine print. Its calm
   circular forms keep everything quiet and legible while the Bodoni didone
   carries all the personality. Tabular figures for phone numbers / metrics. */
const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  /* The pitch in a tag: today the brand lives on a blog-themed WordPress site on
     a leftover free `eternitymedspa.wordpress.com` subdomain with phone-only
     booking. This reframes Eternity as a polished St. Louis flagship under ONE
     branded domain with real online booking that ends the phone-tag era. */
  title:
    "Eternity Med Spa — Results That Last · Injectables, Skin & Body | Creve Coeur, St. Louis",
  description:
    "St. Louis' enduring med spa on Olive Blvd in Creve Coeur — injectables, skin & body, led by Michelle for 18 years. 221 five-star-leaning reviews. Book online in 30 seconds — no more phone tag.",
  robots: { index: false, follow: false },
};

export default function EternityLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="eternity"
      className={`${bodoni.variable} ${jost.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
