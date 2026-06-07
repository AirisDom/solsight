import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "SolSight - Solana Wallet Analyzer",
    template: "%s | SolSight",
  },
  description: "A minimalist, read-only Solana wallet analyzer that translates blockchain transaction history into a clean, human-readable timeline.",
  keywords: ["Solana", "wallet", "analyzer", "blockchain", "transactions", "crypto", "Web3"],
  authors: [{ name: "SolSight" }],
  creator: "SolSight",
  metadataBase: new URL("https://solsight.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SolSight",
    title: "SolSight - Solana Wallet Analyzer",
    description: "A minimalist, read-only Solana wallet analyzer that translates blockchain transaction history into a clean, human-readable timeline.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolSight - Solana Wallet Analyzer",
    description: "A minimalist, read-only Solana wallet analyzer that translates blockchain transaction history into a clean, human-readable timeline.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
