import type { Metadata } from 'next';
import React from "react";
import './globals.css';                             // These styles apply to every route in the application
import {Inter, Sansation} from "next/font/google";
// import ResponsiveNav from "@/components/Home/NavBar/ResponsiveNav";

// Define main font
const inter  = Inter({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    variable: "--font-inter",
})

const sansation  = Sansation({
    weight: ["300", "400", "700"],
    subsets: ["latin"],
    fallback: ['system-ui', 'sans-serif'],
    variable: "--font-sansation",
})

export const metadata: Metadata = {
    title: 'S. Almonte Portfolio',
    description: "Sauel Almonte's Online Portfolio",
}

export default function RootLayout({children,}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${sansation.variable}`}>
        <body
            className="font-inter text-cyan-50 bg-[#0d0d1f] antialiased w-auto"
        >
            {/*<ResponsiveNav/>*/}
            {children}
        </body>
        </html>
    )
}
