'use client';

import React, {useEffect, useState} from "react";
import {FaCode} from "react-icons/fa";
import {NavLinks} from "@/constant/constant";
import Link from "next/link";
import {BiDownload} from "react-icons/bi";
import {HiBars3BottomRight} from "react-icons/hi2";

type Props = {
    openNav: () => void;
}

const Nav = ({openNav}:Props) => {
    const [navBg, setNavBg] = useState(false);

    useEffect(() => {
        const handler = () => {
            if (window.scrollY >= 90)
                setNavBg(true);
            if (window.scrollY < 90)
                setNavBg(false);
        };
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);


    return (
        <header
            className={`py-7 transition-all duration-200 h-auto z-[1000] fixed w-full ${navBg ? "bg-[#0f142ed9] shadow-md backdrop-blur-sm" : "fixed"}`}
        >
            <div className="flex items-center h-full justify-between w-full px-6 mx-auto">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-center justify-center w-8 h-8 xl:w-10 xl:h-10 bg-cyan-50 rounded-full">
                        <FaCode className="h-6 w-6  text-[#0d0d1f]"/>
                    </div>
                    <h3
                        className="font-sansation text-cyan-50 font-bold text-xl hidden sm:block xl:text-3xl"
                    >
                        S. Almonte
                    </h3>
                </div>
                {/* Nav Links */}
                <nav
                    className="hidden lg:flex items-center space-x-4"
                >
                    {NavLinks.map((link) => {
                        return (
                            <Link
                                key={link.id} href={link.url}
                                className="text-sm xl:text-base hover:text-cyan-300 hover:font-semibold text-cyan-50 font-medium font-inter transition-all duration-200"
                            >
                                <p>{link.label}</p>
                            </Link>
                        )
                    })}
                </nav>
                {/* Buttons */}
                <div
                    className="flex items-center space-x-4"
                >
                    {/*  Resume Button  */}
                    <button
                        className="flex items-center space-x-2 text-sm xl:text-base rounded-full px-4 py-2 xl:px-6 xl:py-3
                                    cursor-pointer bg-cyan-600 hover:bg-cyan-700 transition-all
                                    duration-200 text-cyan-50 font-semibold"
                    >
                        <BiDownload
                            className="w-5 h-5"
                        />
                        <span>Resume</span>
                    </button>
                    {/* Burger Menu */}
                    <HiBars3BottomRight
                        onClick={openNav}
                        className="w-8 h-8 cursor-pointer text-cyan-50 lg:hidden"
                    />
                </div>
            </div>
        </header>
    )
}
export default Nav;