// components/Home/NavBar/ResponsiveNav.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Nav from "@/components/Home/NavBar/Nav";
import MobileNav from "@/components/Home/NavBar/MobileNav";

const MOBILE_MENU_ID = "mobile-menu";

const ResponsiveNav = () => {
    const [showNav, setShowNav] = useState(false);
    const [srMessage, setSrMessage] = useState("");
    const clearMsgTimer = useRef<number | null>(null);
    const pathname = usePathname();

    const openNavHandler = () => setShowNav(true);
    const closeNavHandler = () => setShowNav(false);

    // Announce menu state to screen readers
    useEffect(() => {
        setSrMessage(showNav ? "Navigation menu opened." : "Navigation menu closed.");

        if (clearMsgTimer.current !== null) {
            window.clearTimeout(clearMsgTimer.current);
        }
        clearMsgTimer.current = window.setTimeout(() => setSrMessage(""), 800);

        return () => {
            if (clearMsgTimer.current !== null) {
                window.clearTimeout(clearMsgTimer.current);
            }
        };
    }, [showNav]);

    // Close drawer on route change
    useEffect(() => {
        if (showNav) setShowNav(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Inert main content while dialog is open
    useEffect(() => {
        const main = document.getElementById("main-content");
        if (!main) return;

        if (showNav) {
            // TS lib DOM doesn't include 'inert' on HTMLElement; keep behavior, silence TS.
            main.inert = true;
            main.setAttribute("aria-hidden", "true");
        } else {
            if ("inert" in main) main.inert = false;
            main.removeAttribute("aria-hidden");
        }
        return () => {
            if ("inert" in main) main.inert = false;
            main.removeAttribute("aria-hidden");
        };
    }, [showNav]);

    return (
        <>
            {/* SR-only live region for open/close announcements */}
            <div aria-live="polite" aria-atomic="true" role="status" className="sr-only">
                {srMessage}
            </div>

            <Nav
                openNav={openNavHandler}
                mobileMenuId={MOBILE_MENU_ID}
                isMobileMenuOpen={showNav}
            />
            <MobileNav id={MOBILE_MENU_ID} showNav={showNav} closeNav={closeNavHandler} />
        </>
    );
};

export default ResponsiveNav;
