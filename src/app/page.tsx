'use client';

import Image from "next/image";
import "./globals.css";
import BouncingBall from "@/app/component/BouncingBall";

export default function Home() {
    return (
        <main className="relative flex flex-col justify-center items-center min-h-screen p-4 text-center bg-gray-400 ">
            <div className="relative w-full max-w-4xl aspect-[16/10] mx-auto p-12">
                <Image
                    src="/under-construction.jpg"
                    alt="Under Construction"
                    fill
                    priority
                    className="rounded-xl shadow-lg object-cover"
                />
            </div>

            <p className="mt-4 z-10 text-lg leading-relaxed text-gray-800 dark:text-gray-100 text-center max-w-full">
                Currently updating portfolio using Next.js, TypeScript, TailwindCSS, and Framer Motion.
            </p>

            <a
                href="https://www.linkedin.com/in/sauel-almonte/"
                target="_blank"
                rel="noopener noreferrer"
                className="z-10 my-2 px-6 py-2 text-base text-white font-medium bg-blue-700 rounded-full shadow hover:bg-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
                Connect with me on LinkedIn
            </a>
            <BouncingBall />
        </main>
    );
}
