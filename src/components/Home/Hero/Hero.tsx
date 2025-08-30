// components/Home/Hero/index.tsx
"use client";

import React from "react";
import Image from "next/image";
import Typewriter from "typewriter-effect";
import SocialIcons from "@/components/Home/Hero/SocialIcons";
import ParticlesHero from "@/components/Home/Hero/ParticleBackground";

const Hero = () => {
    return (
        // Landmark + name so screen readers can jump here
        <section
            aria-labelledby="hero-heading"
            className="relative flex h-screen flex-col items-center justify-center text-cyan-50 overflow-hidden"
        >
            {/* Decorative background: hide from AT and pointer */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
                <ParticlesHero />
            </div>

            <div className="relative flex flex-col items-center w-auto z-[1]">
                {/* Give the image a meaningful alt (not just 'hero-image') */}
                <Image
                    src="/images/me.png"
                    alt="Portrait of Sauel Almonte"
                    width={150}
                    height={150}
                    className="rounded-full border border-cyan-500 drop-shadow-[0_0_15px_rgb(6_182_212/0.6)]"
                    priority
                />

                {/* Main heading must be easily referenced by aria-labelledby */}
                <h1
                    id="hero-heading"
                    className="font-inter text-2xl sm:text-3xl md:text-4xl lg:text-6xl mt-4 text-center font-bold tracking-wide leading-[1.2] z-[100]"
                >
                    Creating Web&#44; AI&#44;
                    <br />
                    <span className="text-cyan-300 z-[100]">and Cloud Solutions.</span>
                </h1>

                {/* Subheading: prevent the typewriter from spamming AT.
                    - Provide a static, screen-reader-only sentence.
                    - Hide the animated part from AT (aria-hidden).
                */}
                <h2
                    className="flex items-center mt-2 px-2 text-[clamp(10px,3vw,16px)] sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium z-[100]"
                >
                  <span className="sr-only">
                    Hello! I’m Sauel Almonte — a passionate Full-Stack Developer, AI Engineer, and Cloud
                    Architect.
                  </span>

                            {/* Visible text for sighted users */}
                            <span aria-hidden="true">
                    Hello&#33; I&#39;m Sauel Almonte &#8208; A Passionate
                  </span>

                    {/* Animated roles: hidden from AT, still visible.
                        Users with reduced motion will still *see* it,
                        but it won’t be announced repeatedly.
                    */}
                    <span className="text-cyan-300 font-bold z-[100]" aria-hidden="true">
                        <Typewriter
                            options={{
                                strings: ["Full-Stack Developer", "AI Engineer", "Cloud Architect"],
                                autoStart: true,
                                loop: true,
                                delay: 75,
                                deleteSpeed: 50,
                                wrapperClassName: "pl-2",
                            }}
                        />
                      </span>
                </h2>

                {/* Social links component already handles a11y
                    (labels, focus, tooltip). Ensure it stays keyboard reachable.
                */}
                <SocialIcons delay={1} stagger={0.2} />
            </div>
        </section>
    );
};

export default Hero;
