// components/Home/Hero/Hero.tsx
'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import HeroAvatar from '@/components/Home/Hero/HeroAvatar';
import HeroTitle from '@/components/Home/Hero/HeroTitle';
import HeroTagline from '@/components/Home/Hero/HeroTagline';
import SocialIcons from '@/components/Home/Hero/SocialIcons';

// Client-only particle background (no SSR)
const ParticlesHero = dynamic(
    () => import('@/components/Home/Hero/ParticleBackground'),
    { ssr: false }
);

const Hero = () => {
    // Respect user preference for reduced motion
    const prefersReduced = useReducedMotion() === true;

    return (
        // Landmark + label; ensure HeroTitle uses id="hero-heading"
        <section
            aria-labelledby="hero-heading"
            className="relative flex min-h-dvh flex-col items-center justify-center text-cyan-50
                 pt-24 sm:pt-28 lg:pt-32 2xl:pt-40"
        >
            {/* Decorative background; keep out of a11y and pointer, clip here (not on the whole section) */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
            >
                {!prefersReduced && (
                    <Suspense fallback={null}>
                        <ParticlesHero />
                    </Suspense>
                )}
            </div>

            <div className="relative flex flex-col items-center w-auto z-[1]">
                <HeroAvatar
                    src="/images/me.png"
                    alt="Portrait of Sauel Almonte"
                    size={150}
                    delay={0.5}
                />

                {/* Pass the id used by aria-labelledby */}
                <HeroTitle id="hero-heading" delay={1.2} stagger={0.5} />

                {/* Your tagline already stacks the typewriter on its own line */}
                <HeroTagline delay={2.2} />

                {/* Ensure any tooltips/hover cards can overflow now that the section isn't clipping */}
                <SocialIcons delay={4.75} stagger={0.25} />
            </div>
        </section>
    );
};

export default Hero;
