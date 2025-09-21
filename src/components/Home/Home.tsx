import React from "react";
import Hero from "@/components/Home/Hero/Hero";
import Services from "@/components/Home/Services/Services"
import Resume from "@/components/Home/Resume/Resume";
import SkillsProjects from "@/components/Home/SkillsProjects/SkillsProjects";

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
            <Services />
            <Resume/>
            <SkillsProjects/>
        </main>
    );
};

export default Home;
