'use client';

// import Image from "next/image";
import "./globals.css";
// import Home from "@/components/Home/Home";
import BouncingBall from "@/components/BouncingBall";
import UnderConstructionImage from "@/components/UnderConstructionImage";
import CallToAction from "@/components/CallToAction";

const HomePage = ()=> {
    return (

        // <Home/>

        <>
            <main
                className="relative flex flex-col justify-center
                            items-center min-h-screen p-4 text-center bg-gray-400 "
            >

                <UnderConstructionImage/>

                <CallToAction/>

                <BouncingBall/>
            </main>
        </>
    );
}
export default HomePage;
