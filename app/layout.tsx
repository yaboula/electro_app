import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://electro.ma"),
  title: {
    default: "ELECTRO.ma — Gaming & Tech au Maroc",
    template: "%s | ELECTRO.ma",
  },
  description:
    "Consoles, jeux et accessoires gaming neufs et d'occasion. Livraison partout au Maroc. Paiement à la livraison.",
  keywords: [
    "gaming maroc",
    "ps5 maroc",
    "xbox maroc",
    "console occasion maroc",
    "jeux vidéo maroc",
    "nintendo switch maroc",
  ],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "ELECTRO.ma",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={poppins.variable} suppressHydrationWarning>
      <body className="min-h-dvh antialiased bg-[#F5F5F7]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
