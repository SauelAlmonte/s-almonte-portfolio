'use client';

import "./globals.css";
import Home from "@/components/Home/Home";

const HomePage = () => {
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
    );
}
export default HomePage;
