// components/Home/Hero/HeroTagline.tsx
'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Typewriter from 'typewriter-effect';

type Props = {
    /** Optional class overrides/extensions (Tailwind 4.1, class-first) */
    className?: string;
    /** The rotating titles to type (kept visible-only and hidden from AT) */
    typedStrings?: string[];
    /** Entrance delay for the whole tagline (seconds), controlled by parent */
    delay?: number;
};

export default function HeroTagline({
    className,
    typedStrings = [
        'Full-Stack Developer',
        'AI Engineer',
        'Cloud Solutions Architect',
    ],
    delay = 0,
}: Props) {
    // Respect user preference for reduced motion (WCAG 2: prefers-reduced-motion)
    // Note: useReducedMotion() can be true/false/null; we normalize to boolean.
    const prefersReduced = useReducedMotion() === true;

    // Only mount the Typewriter after its wrapper span finishes animating.
    // With reduced motion, we mount immediately (no waiting).
    const [startTyping, setStartTyping] = useState<boolean>(prefersReduced);

    return (
        // H2 is the visible tagline. We animate its entrance (fade/slide) unless reduced motion.
        <motion.h2
            initial={
                prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={
                prefersReduced
                    ? undefined
                    : { duration: 0.22, ease: 'easeOut', delay }
            }
            // Typography is responsive via Tailwind 4.1 utilities; no config file required.
            className={
                className ??
                'flex flex-col items-center text-pretty mt-2 px-2 text-lg md:text-xl  2xl:text-2xl font-medium z-[100]'
            }
        >
            {/*
                Screen-reader only stable sentence.
                WHY: The visible text below animates/changes (typewriter). We provide a single,
                static equivalent for assistive tech to avoid repeated announcements.
                This satisfies WCAG by preventing live, noisy updates in a heading.
            */}
            <span className="sr-only">
                Hello! I’m Sauel Almonte — a passionate: Full-Stack Developer,
                AI Engineer, and Cloud Solutions Architect.
            </span>

            {/*
                Visible prefix for sighted users.
                aria-hidden="true": Hide animated/duplicated content from AT to avoid double
                reading with the SR-only text above.
            */}
            <motion.span
                aria-hidden="true"
                initial={
                    prefersReduced
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={
                    prefersReduced
                        ? undefined
                        : { duration: 0.22, ease: 'easeOut', delay }
                }
            >
                Hello&#33; I&#39;m Sauel Almonte &#8208; A Passionate&#58;
            </motion.span>
            {/*
                Typewriter segment (visual only).
                - aria-hidden="true" to prevent constants announcements of changing text.
                - We delay its entrance slightly after the prefix so reading order is clear.
                - onAnimationComplete mounts the Typewriter so typing starts only after the
                  wrapper is visible (no flash of typing offscreen).
            */}
            <motion.span
                className="text-cyan-300 font-bold z-[100] text-pretty"
                aria-hidden="true"
                initial={
                    prefersReduced
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={
                    prefersReduced
                        ? undefined
                        : {
                              duration: 0.22,
                              ease: 'easeOut',
                              delay: delay + 0.25,
                          }
                }
                onAnimationComplete={() => {
                    if (!prefersReduced) setStartTyping(true);
                }}
            >
                {startTyping && (
                    <Typewriter
                        options={{
                            strings: typedStrings, // rotating values (visual only)
                            autoStart: true,
                            loop: true,
                            delay: 75,
                            deleteSpeed: 50,
                            wrapperClassName: 'pl-2', // spacing before typed word
                        }}
                    />
                )}
            </motion.span>
        </motion.h2>
    );
}
