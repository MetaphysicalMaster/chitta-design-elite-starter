import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans } from "next/font/google";
import "./brand.css";

/* Newsreader — Google's contemporary text-figure serif with a true editorial,
   "journal of investigative dermatology" voice: open apertures, low-contrast
   strokes that hold at body sizes, a calm scholarly authority. It carries a
   double board-certified academic practice the way the cookie-cutter medical-
   vendor template never could — credentialed, measured, expensive in its
   restraint. Deliberately distinct from the siblings' display faces
   (Sousan → Playfair; Timeless → Cormorant; SimplySkin → Fraunces; Hanami →
   Shippori Mincho). The brief names Newsreader or Spectral; Newsreader is the
   chosen editorial-clinical serif here, with an italic optical axis for the
   rare emphasis word ("dermatopathology"). */
const newsreader = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

/* IBM Plex Sans — a humanist-grotesque engineered for technical clarity. Its
   even rhythm and true tabular figures suit clinical UI, fine print, NAP and
   the dermal-depth scale labels — the precision a board-certified practice
   reads as, keeping the Newsreader serif as the scholarly star. */
const plex = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  /* The identity correction in a single tag: the live site is a cookie-cutter
     medical-vendor template with SEO-spam, location-suffixed URL slugs and a
     slipping 3.5★ reputation. This reads as the credentialed academic
     institution the doctor's rare double board-certification deserves — and
     reframes the reputation around senior expertise, not star count. */
  title:
    "Darst Dermatology — Dr. Marc A. Darst, MD · Board-Certified in Dermatology & Dermatopathology | Charlotte, NC",
  description:
    "Few dermatologists are board-certified in both dermatology AND dermatopathology. Dr. Marc A. Darst, MD is — with 20+ years caring for Charlotte. Medical, surgical & cosmetic dermatology, laser, injectables & vein. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function DarstLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="darst"
      className={`${newsreader.variable} ${plex.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
