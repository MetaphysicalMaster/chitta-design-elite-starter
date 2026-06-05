import type { Metadata } from "next";
import { Spectral, Inter } from "next/font/google";
import "./brand.css";

/* Spectral — a warm humanist serif with low contrast, gentle bracketed serifs
   and a calm, grounded reading rhythm. It carries the "balanced botanical
   wellness" voice: holistic and serene without tipping into couture fashion.
   Deliberately distinct from the siblings' display faces — Fraunces is already
   used by a sibling (SimplySkin), so we pair a quieter humanist serif here
   instead (Sousan → Playfair; Timeless → Cormorant; Darst → Newsreader;
   Beautox → Bricolage; Hanami → Shippori Mincho; Avail → Space Grotesk). Loaded
   at the weights the headlines + editorial leads need. */
const spectral = Spectral({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/* Inter — a clean, neutral humanist sans for body copy, NAP, fine print and UI.
   It keeps everything calm and legible while the Spectral serif carries the
   grounded-wellness personality. Tabular figures for phone numbers / metrics. */
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  /* The pitch in a tag: today the brand is fragmented across flat .htm pages, a
     still-indexed testkc.com staging leak, and a bare Square booking redirect.
     This reframes Karma as ONE unified, premium two-metro wellness brand under
     a single canonical domain with native-feeling booking. */
  title:
    "Karma Beauty & Wellness — Beauty, Balanced · Med Spa & Wellness | Lee's Summit & Overland Park, KC Metro",
  description:
    "Kansas City's RN+NP-owned med spa & wellness studio — injectables, medical weight-loss & holistic wellness across two metros: Lee's Summit and Overland Park. One brand, one home, book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function KarmaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="karma"
      className={`${spectral.variable} ${inter.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
