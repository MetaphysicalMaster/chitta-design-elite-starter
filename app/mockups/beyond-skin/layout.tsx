import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./brand.css";

/* Editorial display — modern high-fashion character, optical sizing */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* Clean, neutral sans for body + UI */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "Beyond Skin Aesthetics — Editorial Luxury Med Spa in Gahanna · Columbus, OH",
  description:
    "Beyond the surface. Dual board-certified, results-driven aesthetics in Gahanna, Ohio — injectables, RF microneedling, IPL/laser, Glo2Facial, skin tightening and medical weight loss. One brand for treatments, shop and membership. Book in 30 seconds.",
  robots: { index: false, follow: false },
};

export default function BeyondSkinLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-brand="beyond-skin"
      className={`${bricolage.variable} ${inter.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
