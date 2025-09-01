// components/Home/Hero/Hero.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import HeroAvatar from "@/components/Home/Hero/HeroAvatar";
import HeroTitle from "@/components/Home/Hero/HeroTitle";
import HeroTagline from "@/components/Home/Hero/HeroTagline";
import SocialIcons from "@/components/Home/Hero/SocialIcons";

// Dynamically import the Particles background client-only to avoid SSR/hydration issues
const ParticlesHero = dynamic(() => import("@/components/Home/Hero/ParticleBackground"), {
    ssr: false,
});

const Hero = () => {
    return (
        // Landmark + name so screen readers can jump here
        <section
            aria-labelledby="hero-heading"
            className="relative flex min-h-dvh flex-col items-center justify-center text-cyan-50 overflow-hidden
               pt-24 sm:pt-28 lg:pt-32 2xl:pt-40"
        >
            {/* Decorative background: hide from AT and pointer */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
                <ParticlesHero />
            </div>

            <div className="relative flex flex-col items-center w-auto z-[1]">
                {/* Give the image a meaningful alt (not just 'hero-image') */}
                <HeroAvatar
                    src="/images/me.png"
                    alt="Portrait of Sauel Almonte"
                    size={150}
                    delay={0.5}
                />

                {/* Main heading must be easily referenced by aria-labelledby */}
                <HeroTitle delay={1.2} stagger={0.50} />
                <HeroTagline delay={2.2} />

                {/* Social links component already handles a11y
            (labels, focus, tooltip). Ensure it stays keyboard reachable.
        */}
                <SocialIcons delay={4.75} stagger={0.25} />
            </div>
        </section>
    );
};

export default Hero;
