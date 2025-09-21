'use client';

// import Image from "next/image";
import "./globals.css";
import Home from "@/components/Home/Home";
// import BouncingBall from "@/components/BouncingBall";
// import UnderConstructionImage from "@/components/UnderConstructionImage";
// import CallToAction from "@/components/CallToAction";

const HomePage = ()=> {
    return (
        <main
            id="main-content"
            role="main"
            aria-labelledby="hero-heading" // ties to <h1 id="hero-heading"> in Hero
            tabIndex={-1}
            className="w-full overflow-hidden focus:outline-none"
        >
            <Home/>
        </main>

        // <>
        //     <main
        //         className="relative flex flex-col justify-center
        //                     items-center min-h-screen p-4 text-center bg-gray-400 "
        //     >
        //
        //         <UnderConstructionImage/>
        //
        //         <CallToAction/>
        //
        //         <BouncingBall/>
        //     </main>
        // </>
    );
}
export default HomePage;
