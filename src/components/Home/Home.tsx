import React from "react";
import Hero from "@/components/Home/Hero/Hero";

const Home = () => {
    return (
        // Use <main> as the primary landmark instead of a generic div
        <main
            id="main-content"
            role="main"
            aria-labelledby="hero-heading" // ties to the <h1 id="hero-heading"> in Hero
            tabIndex={-1}                  // allows skip link focus
            className="w-full overflow-hidden focus:outline-none"
        >
            <Hero />
        </main>
    );
};

export default Home;
