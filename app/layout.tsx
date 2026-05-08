import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chitta Design Elite Starter",
  description:
    "Elite UI/UX Engineer baseline — Next.js 16 + Tailwind v4 + Framer Motion + shadcn/ui + Aceternity UI + Magic UI. $10K-quality bar enforced via DesignGod skill.",
  metadataBase: new URL("https://chitta-design-elite-starter.vercel.app"),
  openGraph: {
    title: "Chitta Design Elite Starter",
    description: "Elite UI/UX Engineer baseline for $10K-quality client websites.",
    type: "website",
  },
  robots: {
    index: false, // starter template — not indexed
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
