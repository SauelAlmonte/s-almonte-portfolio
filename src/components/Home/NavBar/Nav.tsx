'use client';

import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { NavLinks } from "@/constant/constant";
import Link from "next/link";
import { BiDownload } from "react-icons/bi";
import { HiBars3BottomRight } from "react-icons/hi2";
import { usePathname } from "next/navigation";

type Props = {
    openNav: () => void;
    mobileMenuId?: string;
    isMobileMenuOpen?: boolean; // ← NEW
};

const Nav = ({ openNav, mobileMenuId = "mobile-menu", isMobileMenuOpen = false }: Props) => {
    const [navBg, setNavBg] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handler = () => {
            setNavBg(window.scrollY >= 90);
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <>
            {/* Skip link for keyboard users */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[2000] focus:bg-cyan-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
            >
                Skip to main content
            </a>

            <header
                role="banner"
                className={`py-7 transition-all duration-200 h-auto z-[1000] fixed w-full motion-reduce:transition-none ${navBg ? "bg-[#0f142ed9] shadow-md backdrop-blur-sm" : ""}`}
            >
                <div className="flex items-center h-full justify-between w-full px-6 mx-auto">
                    {/* Logo / Home */}
                    <div className="flex items-center space-x-3">
                        <Link href="/" aria-label="Go to homepage">
                            <div className="flex flex-col items-center justify-center w-8 h-8 xl:w-10 xl:h-10 bg-cyan-50 rounded-full">
                                <FaCode className="h-6 w-6 text-[#0d0d1f]" aria-hidden="true" focusable="false" />
                            </div>
                        </Link>
                        <h1 className="font-sansation text-cyan-50 font-bold text-xl hidden sm:block md:text-2xl xl:text-3xl">
                            S. Almonte
                        </h1>
                    </div>

                    {/* Primary Navigation */}
                    <nav
                        className="hidden lg:flex items-center space-x-4"
                        aria-label="Primary"
                    >
                        {NavLinks.map((link) => {
                            const isCurrent =
                                pathname === link.url ||
                                (link.url !== "/" && pathname?.startsWith(link.url));
                            return (
                                <Link
                                    key={link.id}
                                    href={link.url}
                                    className="text-sm xl:text-base hover:text-cyan-300 hover:font-semibold text-cyan-50 font-medium font-inter transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded motion-reduce:transition-none"
                                    aria-current={isCurrent ? "page" : undefined}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Resume: use anchor for native download + accessible name */}
                        <a
                            href="/resume/sauel_almonte_resume.pdf"
                            download
                            className="flex items-center space-x-2 text-sm xl:text-base rounded-full px-4 py-2 xl:px-6 xl:py-3 cursor-pointer bg-cyan-600 hover:bg-cyan-700 transition-all duration-200 text-cyan-50 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-[#0f142e] motion-reduce:transition-none"
                            aria-label="Download resume (PDF)"
                        >
                            <BiDownload className="w-5 h-5" aria-hidden="true" focusable="false" />
                            <span>Resume</span>
                        </a>

                        {/* Mobile menu button (keyboard/AT friendly) */}
                        <button
                            type="button"
                            onClick={openNav}
                            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-cyan-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                            aria-label="Open navigation menu"
                            aria-controls={mobileMenuId}
                            aria-expanded={isMobileMenuOpen ? "true" : "false"} // ← reflect state
                        >
                            <HiBars3BottomRight className="w-8 h-8 cursor-pointer" aria-hidden="true" focusable="false" />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Nav;
