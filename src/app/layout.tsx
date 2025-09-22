import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, Sansation } from "next/font/google";
import ResponsiveNav from "@/components/Home/NavBar/ResponsiveNav";
import React from "react";
import Footer from "@/components/Home/Footer/Footer";

const inter = Inter({
    weight: ["100","200","300","400","500","600","700","800","900"],
    subsets: ["latin"],
    variable: "--font-inter",
});

const sansation = Sansation({
    weight: ["300","400","700"],
    subsets: ["latin"],
    fallback: ["system-ui","sans-serif"],
    variable: "--font-sansation",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://s-almonte.vercel.app"),
    title: {
        default: "S. Almonte Portfolio",
        template: "%s | S. Almonte",
    },
    description: "Sauel Almonte's Online Portfolio",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        url: "/",
        title: "S. Almonte Portfolio",
        description: "Sauel Almonte's Online Portfolio",
        siteName: "S. Almonte",
        images: [{ url: "/og/default-og.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        creator: "@TheCodinCoder",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({children,}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${sansation.variable}`}>
            <body
                className="font-inter text-cyan-50 bg-[#0d0d1f] antialiased w-auto"
            >
                <ResponsiveNav/>
                {children}
            <Footer/>
            </body>
        </html>
    )
}
