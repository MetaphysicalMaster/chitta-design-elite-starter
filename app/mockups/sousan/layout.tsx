import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./brand.css";

/* Playfair Display — a high-contrast transitional serif with sharp, modern
   couture proportions: thin hairlines, generous ball terminals, an editorial
   "Vogue/Harper's" voice that belongs in a River Oaks drawing room. It carries
   a 29-year institution the way the DIY WordPress template never could —
   established, discreet, expensive. Deliberately distinct from the siblings'
   display faces (Timeless → Cormorant Garamond; SimplySkin → Fraunces; Hanami
   → Shippori Mincho; The Luxe → its own serif). The brief names Cormorant as
   already-used; Playfair is the chosen couture serif here. */
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/* Jost — a refined geometric sans (a contemporary Futura) for body copy, UI and
   fine print. Its quiet circular geometry keeps the couture serif as the star
   while reading clean and modern — the polish a luxury destination needs. */
const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  /* The identity correction in a single tag: the live site is a dated DIY
     WordPress with a gmail business email and conflicting NAP data across
     directories. This reads as the credentialed luxury institution the name —
     and the zip code — deserve. */
  title:
    "Sousan Med Spa — HydraFacial MD, IPL & Injectables · River Oaks, Houston | Est. 1995",
  description:
    "River Oaks has trusted one name for 29 years. Sousan Med Spa — HydraFacial MD, IPL, body contouring & injectables in the heart of River Oaks, Houston. One address, one standard, since 1995. (713) 527-9878. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function SousanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="sousan"
      className={`${playfair.variable} ${jost.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
