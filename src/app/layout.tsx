import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  /* ── Core ── */
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.person.name, url: siteConfig.url }],
  creator: siteConfig.person.name,
  publisher: siteConfig.person.name,

  /* ── Canonical ── */
  alternates: {
    canonical: siteConfig.url,
  },

  /* ── Open Graph (Facebook, LinkedIn previews) ── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    // Image is supplied automatically by src/app/opengraph-image.tsx
  },

  /* ── Twitter / X Card ── */
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@SauelAlmonte",
    // Image is supplied automatically by src/app/opengraph-image.tsx
  },

  /* ── Robots ── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Verification (add keys from Google Search Console / Bing when ready) ── */
  // verification: {
  //   google: "your-google-verification-token",
  //   yandex: "your-yandex-token",
  // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
