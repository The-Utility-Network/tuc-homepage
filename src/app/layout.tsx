import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Rajdhani } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Utility Company | Industrial Automation as a Service",
  description: "Where ancient wisdom meets autonomous machinery. The Utility Company weaves blockchain technology, sustainable agriculture, and creative innovation into a tapestry of human flourishing. We transform industries through decentralized automation—empowering communities to own the means of production while technology handles the complexity.",
  keywords: ["I3AS", "Industrial Automation as a Service", "Web3", "NFT", "Blockchain", "Decentralized Automation", "The Graine Ledger", "DigiBazaar", "Osiris Protocol", "Sustainable Technology", "Tokenized Infrastructure", "Smart Contracts", "ERC-2535", "Diamond Standard"],
  authors: [{ name: "The Utility Company" }],
  creator: "The Utility Company",
  publisher: "The Utility Company",
  metadataBase: new URL('https://theutilitycompany.co'),
  openGraph: {
    title: "The Utility Company | Simple Choices. Complex Outcomes.",
    description: "Industrial Automation as a Service. We weave blockchain, sustainable agriculture, and creative innovation into a tapestry of human flourishing—transforming industries through decentralized automation.",
    type: "website",
    locale: "en_US",
    siteName: "The Utility Company",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Utility Company | I3AS",
    description: "Where ancient wisdom meets autonomous machinery. Empowering communities to own the means of production through decentralized automation.",
    creator: "@theutilityco",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} antialiased bg-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
