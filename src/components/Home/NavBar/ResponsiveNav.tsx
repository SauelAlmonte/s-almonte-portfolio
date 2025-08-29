"use client";
import React, {useState} from "react";
import Nav from "@/components/Home/NavBar/Nav";
import MobileNav from "@/components/Home/NavBar/MobileNav";

const ResponsiveNav = () => {
    const [showNav, setShowNav] = useState(false);
    const openNavHandler = () => setShowNav(true);
    const closeNavHandler = () => setShowNav(false);
    return (
        <>
            <Nav openNav={openNavHandler}/>
            <MobileNav showNav={showNav} closeNav={closeNavHandler} />
        </>
    )
}
export default ResponsiveNav;