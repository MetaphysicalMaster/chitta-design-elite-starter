import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "./brand.css";

/* Bricolage Grotesque — a contemporary display grotesque with quirky, generous
   curves and a playful-yet-confident personality. It is the "Botox without the
   boring" voice made type: rounded terminals and a wide, friendly aperture that
   feels approachable and fun, but the chunky bold weights still read premium and
   intentional. Deliberately distinct from the siblings' display faces (Sousan →
   Playfair; Timeless → Cormorant; Darst → Newsreader; SimplySkin → Fraunces;
   Hanami → Shippori Mincho; Avail → Space Grotesk). Variable axis loaded so the
   candy-pop headlines can run heavy without a second request. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* Outfit — a clean, geometric-humanist sans with even rhythm and friendly, open
   counters. It keeps body copy, NAP, fine print and UI calm and legible while the
   Bricolage display carries the candy-pop personality. Tabular figures for phone
   numbers / metrics / prices. */
const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  /* The pitch in a tag: a flat Weebly-era builder can't carry a 3-location brand.
     This reframes Beautox Bar as one scalable, fun, premium multi-location
     platform — timed to the White Bear Township opening. */
  title:
    "Beautox Bar — Botox Without the Boring · Botox Bar & Med Spa | Maple Grove · Champlin · White Bear Township, MN",
  description:
    "Minneapolis–St. Paul's fun, approachable Botox bar — injectables-led, nurse-founded, 7+ years strong. Now three locations: Maple Grove, Champlin & the new White Bear Township. Book your glow in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function BeautoxBarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="beautox-bar"
      className={`${bricolage.variable} ${outfit.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
