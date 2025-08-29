import React from "react";
import {NavLinks} from "@/constant/constant";
import Link from "next/link";
import {CgClose} from "react-icons/cg";

type Props = {
    showNav: boolean;
    closeNav:() => void;
}

const MobileNav = ({closeNav, showNav}:Props) => {

    const navOpen = showNav ? "translate-x-0" : "translate-x-[100%]";

    return (
        <div>
            {/*  Overlay  */}
            <div
                className={`fixed inset-0 transform transition-all
                    right-0 duration-500 z-[2500] bg-black opacity-70 w-full h-screen ${navOpen}`}
            >

            </div>
            {/*  Nav Links  */}
            <nav
                className={`text-cyan-50 fixed justify-center flex flex-col h-full
                    transform transition-all duration-500 delay-300 w-[80%] md:w-[60%]
                    space-y-6 z-[4000] right-0 bg-cyan-700 ${navOpen}`}
            >
                {NavLinks.map((link) => {
                    return (
                        <Link
                            key={link.id} href={link.url}
                            className="flex flex-col items-center"
                        >
                            <p
                                className="w-fit text-lg hover:transition-all
                                            hover:duration-200 hover:transform hover:border-b-2
                                            hover:border-cyan-50 hover:pb-1"
                            >
                                {link.label}
                            </p>
                        </Link>
                    )
                })}
                {/*  Close Button  */}
                <button
                    className="absolute flex items-center justify-center
                                top-6 right-5 w-6 h-6 md:w-8 md:h-8  border-2
                                rounded-full cursor-pointer"
                >
                    <CgClose
                        onClick={closeNav}
                        className="w-4 h-4 md:w-6 md:h-6 "
                    />
                </button>
            </nav>
        </div>
    )
}
export default MobileNav;