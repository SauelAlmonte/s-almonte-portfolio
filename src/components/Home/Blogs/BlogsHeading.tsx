'use client';

import React from 'react';
import {
    motion,
    useReducedMotion,
    stagger as fmStagger,
    type Variants,
} from 'framer-motion';

type Props = {
    id?: string;
    className?: string;
    delay?: number;
    stagger?: number;
    /** Inherit timing from parent section (default) */
    controlledByParent?: boolean;
};

export default function BlogsHeading({
    id,
    className,
    delay = 0,
    stagger = 0.18,
    controlledByParent = true,
}: Props) {
    const prefersReduced = useReducedMotion() === true;
    const base =
        className ??
        'text-center text-2xl md:text-3xl xl:text-4xl mt-4 pretty  font-bold text-zinc-50 mb-4';

    if (prefersReduced) {
        return (
            <h2 id={id} className={base}>
                My Recent
                <br />
                <span className="text-cyan-300">Blogs</span>
            </h2>
        );
    }

    const container: Variants = {
        hidden: { opacity: 1 },
        show: {
            opacity: 1,
            transition: {
                delayChildren: fmStagger(stagger, { startDelay: delay }),
            },
        },
    };

    const line: Variants = {
        hidden: { opacity: 0, y: 16 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.28, ease: 'easeOut' },
        },
    };

    const motionProps = controlledByParent
        ? {}
        : {
              initial: 'hidden' as const,
              whileInView: 'show' as const,
              viewport: { once: true, amount: 0.35 },
          };

    return (
        <motion.h2
            id={id}
            className={base}
            variants={container}
            {...motionProps}
        >
            <motion.span className="block" variants={line}>
                My Recent
            </motion.span>
            <motion.span className="block" variants={line}>
                <span className="text-cyan-300">Blogs</span>
            </motion.span>
        </motion.h2>
    );
}
