import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
