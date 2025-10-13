// components/Home/Hero/HeroTitle.tsx
'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Props = {
    /** The id used by <section aria-labelledby "..."> for landmark naming */
    id?: string;
    /** Optional class overrides/extensions (Tailwind 4.1, class-first) */
    className?: string;
    /** Entrance delay (seconds) for the first line; controlled by parent */
    delay?: number;
    /** Additional delay (seconds) between line 1 and line 2 */
    stagger?: number;
};

export default function HeroTitle({
    id = 'hero-heading',
    className,
    delay = 0,
    stagger = 0.12,
}: Props) {
    // Respect user preference for reduced motion (WCAG 2: prefers-reduced-motion)
    const prefersReduced = useReducedMotion() === true;

    return (
        // Visible page-level heading for the hero; its id connects the <section aria-labelledby>
        // tabindex=-1 allows programmatic focus if you later implement "skip to content" behavior that moves focus here.
        <h1
            id={id}
            tabIndex={-1}
            className={
                className ??
                'font-inter text-pretty text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl mt-4 text-center font-bold tracking-wide leading-[1.2] z-[100]'
            }
        >
            {/* Line 1: fades/slides in unless user prefers reduced motion */}
            <motion.span
                className="block"
                initial={
                    prefersReduced
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 18 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={
                    prefersReduced
                        ? undefined
                        : { duration: 0.22, ease: 'easeOut', delay }
                }
            >
                {/* Use HTML entities you already chose to preserve punctuation/kerning */}
                Creating{' '}
                <span className="text-cyan-300 z-[100] text-pretty">Web</span>
                &#44;{' '}
                <span className="text-cyan-300 z-[100] text-pretty"> AI</span>
                &#44; &#38;
            </motion.span>

            {/* Line 2: the cyan accent line, slightly delayed after line 1 */}
            <motion.span
                className="block text-cyan-300 z-[100] text-pretty"
                initial={
                    prefersReduced
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 18 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={
                    prefersReduced
                        ? undefined
                        : {
                              duration: 0.22,
                              ease: 'easeOut',
                              delay: delay + stagger,
                          }
                }
            >
                Cloud Solutions.
            </motion.span>
        </h1>
    );
}
