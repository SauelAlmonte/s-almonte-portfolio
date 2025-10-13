'use client';

import React from 'react';
import {
    motion,
    useReducedMotion,
    stagger as fmStagger, // modern stagger helper
    type Variants,
} from 'framer-motion';

type Props = {
    id?: string;
    className?: string;
    /** Start delay (s) once the heading enters view */
    delay?: number;
    /** Gap (s) between line 1 → 2 → 3 */
    stagger?: number;
};

export default function ServiceHeading({
    id = 'services-heading',
    className,
    delay = 0,
    stagger = 0.26,
}: Props) {
    const prefersReduced = useReducedMotion() === true;

    const base =
        className ??
        'text-balance font-inter text-center font-semibold tracking-wide leading-[1.2] ' +
            'text-2xl md:text-3xl xl:text-4xl mt-4 pretty';

    // Static render for reduced-motion users
    if (prefersReduced) {
        return (
            <h2 id={id} tabIndex={-1} className={base}>
                <span className="block">Partner to your product team</span>
                <span className="block">
                    <span className="text-cyan-300 font-bold">Full-stack</span>,{' '}
                    <span className="text-cyan-300 font-bold">AI</span>, &nbsp;
                    <span className="text-cyan-300 font-bold">Cloud</span>{' '}
                    designed, built
                </span>
                <span className="block">
                    then{' '}
                    <span className="text-cyan-300 font-bold">
                        &amp; shipped to production
                    </span>
                    .
                </span>
            </h2>
        );
    }

    // Parent controls the stagger via delayChildren: fmStagger(...)
    const container: Variants = {
        hidden: { opacity: 1 },
        show: {
            opacity: 1,
            transition: {
                delayChildren: fmStagger(stagger, { startDelay: delay + 0.25 }),
            },
        },
    };

    const line: Variants = {
        hidden: { opacity: 0, y: 18 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.32, ease: 'easeOut' },
        },
    };

    return (
        <motion.h2
            id={id}
            tabIndex={-1}
            className={base}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
        >
            {/* Line 1 */}
            <motion.span className="block" variants={line}>
                Partner to your product team
            </motion.span>

            {/* Line 2 */}
            <motion.span className="block" variants={line}>
                <span className="text-cyan-300 font-bold">Full-stack</span>&#44;{' '}
                <span className="text-cyan-300 font-bold">AI</span> &#38;{' '}
                <span className="text-cyan-300 font-bold">Cloud</span>.{' '}
            </motion.span>

            {/* Line 3 */}
            <motion.span className="block" variants={line}>
                Designed, built&#44; and{' '}
                <span className="text-cyan-300 font-bold">
                    shipped into production
                </span>
                .
            </motion.span>
        </motion.h2>
    );
}
