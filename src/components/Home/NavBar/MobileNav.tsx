// components/Home/NavBar/MobileNav.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CgClose } from "react-icons/cg";
import { NavLinks } from "@/constants/nav.constant";

type Props = {
    showNav: boolean;
    closeNav: () => void;
    id?: string;
};

const MobileNav = ({ closeNav, showNav, id = "mobile-menu" }: Props) => {
    const pathname = usePathname();
    const panelRef = useRef<HTMLDivElement | null>(null);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    // Slide-in transform for the panel only
    const panelTransform = showNav ? "translate-x-0" : "translate-x-[100%]";

    // Trap focus + return focus to opener, lock scroll
    useEffect(() => {
        if (!showNav) return;

        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // Move focus to close button on open
        requestAnimationFrame(() => closeBtnRef.current?.focus());

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                closeNav();
                return;
            }
            if (e.key === "Tab" && panelRef.current) {
                const focusable = panelRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement as HTMLElement;

                if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus();
                } else if (e.shiftKey && active === first) {
                    e.preventDefault();
                    last.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = prevOverflow;
            previouslyFocusedRef.current?.focus?.();
        };
    }, [showNav, closeNav]);

    return (
        <div
            aria-hidden={!showNav}
            className={showNav ? "pointer-events-auto" : "pointer-events-none"}
        >
            {/* Overlay (fade only; do NOT translate) */}
            <div
                className={`fixed inset-0 z-[2500] h-screen w-full bg-black/70 transition-opacity duration-300 motion-reduce:transition-none ${
                    showNav ? "opacity-100" : "opacity-0"
                }`}
                onClick={closeNav}
                aria-hidden="true"
            />

            {/* Slide-in panel */}
            <div
                id={id}
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
                className={`pointer-events-auto fixed right-0 top-0 z-[4000] h-screen w-[80%] md:w-[60%] bg-cyan-700 text-cyan-50 transform transition-transform duration-500 delay-100 motion-reduce:transition-none ${panelTransform}`}
            >
                {/* Visually hidden title for AT */}
                <h2 id="mobile-menu-title" className="sr-only">
                    Navigation menu
                </h2>

                {/* Close Button */}
                <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={closeNav}
                    className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                    aria-label="Close menu"
                >
                    <CgClose className="w-6 h-6 cursor-pointer" aria-hidden focusable="false" />
                </button>

                {/* Links */}
                <nav aria-label="Mobile" className="flex h-full flex-col justify-center space-y-6 px-6">
                    {NavLinks.map((link) => {
                        const isCurrent =
                            pathname === link.url || (link.url !== "/" && pathname?.startsWith(link.url));

                        return (
                            <Link
                                key={link.id}
                                href={link.url}
                                onClick={closeNav}
                                className="flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 rounded"
                                aria-current={isCurrent ? "page" : undefined}
                            >
                <span className="w-fit text-lg hover:border-b-2 hover:border-cyan-50 hover:pb-1 transition-all duration-200 motion-reduce:transition-none">
                  {link.label}
                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default MobileNav;
