import type { Metadata } from "next";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import "./brand.css";

/* Shippori Mincho — a warm, literary Japanese-rooted Mincho (serif) with
   brush-cut terminals and quiet high contrast. It carries the name "Hanami"
   (花見 — cherry-blossom viewing) the way the live SEO template never could:
   poetic, calm, intentional (mono no aware). Latin glyphs share the family's
   measured, hand-cut rhythm, so the display voice feels authored, not generic.
   Deliberately distinct from the siblings' display faces (Timeless → Cormorant
   Garamond; SimplySkin → Fraunces; Happy Clinic → Sora; Avail → Space Grotesk). */
const shippori = Shippori_Mincho({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* Zen Kaku Gothic New — a soft, humanist Japanese gothic (sans) for body copy,
   UI and fine print. Gentle terminals keep the rice-paper calm; pairs with the
   Mincho the way Japanese editorial design pairs mincho + gothic. */
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  /* The identity correction in a single tag: the live site ships a generic
     healthcare-SEO template with broken/duplicate title tags that waste the
     name. This reads as the branded sensory world the name promises. */
  title:
    "Hanami Medspa — Injectables, Laser & IPL by Dr. Elaine Phuah · Fort Worth, TX | 花見",
  description:
    "Fort Worth's botanical med spa — every face by Dr. Elaine Phuah, DO MBA, the sole injector. 4.9★ across 243 reviews. Injectables, laser & IPL at 800 8th Ave, Suite 508. Hanami means cherry-blossom viewing — the art of becoming, in bloom. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function HanamiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="hanami"
      className={`${shippori.variable} ${zenKaku.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
