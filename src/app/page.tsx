'use client';

// import Image from "next/image";
import "./globals.css";
import BouncingBall from "@/app/component/BouncingBall";
import UnderConstructionImage from "@/app/component/UnderConstructionImage";
import CallToAction from "@/app/component/CallToAction";

export default function Home() {
    return (
        <>
            <main
                className="relative flex flex-col justify-center items-center min-h-screen p-4 text-center bg-gray-400 ">

                <UnderConstructionImage/>

                <CallToAction/>

                <BouncingBall/>
            </main>
        </>
    );
}
