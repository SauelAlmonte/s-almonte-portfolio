'use client';

import React from 'react';
import {
    motion,
    useReducedMotion,
    stagger as fmStagger,
    type Variants,
} from 'framer-motion';

type Props = {
    /** e.g. 'Work', 'My' */
    prefix: string;
    /** e.g. 'Experience', 'Education' (renders in cyan) */
    accent: string;
    /** For aria-labelledby targets */
    id?: string;
    /** Tailwind overrides */
    className?: string;
    /** Start delay (s) for the first child when animating */
    delay?: number;
    /** Gap (s) between the two parts */
    stagger?: number;
    /** If you want the title on one line, set true */
    singleLine?: boolean;
    /**
     * If true (default), the heading inherits animation from its parent motion container
     * (e.g., Resume section). If false, it will self-trigger with whileInView.
     */
    controlledByParent?: boolean;
};

export default function ResumeHeading({
    prefix,
    accent,
    id,
    className,
    delay = 0,
    stagger = 0.18,
    singleLine = true,
    controlledByParent = true,
}: Props) {
    const prefersReduced = useReducedMotion() === true;

    const base =
        className ??
        'text-3xl sm:text-4xl font-bold text-cyan-50 tracking-tight';

    if (prefersReduced) {
        return (
            <h2 id={id} className={base}>
                {prefix} <span className="text-cyan-300">{accent}</span>
            </h2>
        );
    }

    // Parent controls the stagger (modern API)
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

    // Props for motion.h2 depending on control mode
    const motionProps = controlledByParent
        ? {} // inherit initial/animate from parent container (Resume section)
        : {
              initial: 'hidden' as const,
              whileInView: 'show' as const,
              viewport: { once: true, amount: 0.35 },
          };

    if (singleLine) {
        return (
            <motion.h2
                id={id}
                className={base}
                variants={container}
                {...motionProps}
            >
                <motion.span variants={line}>{prefix} </motion.span>
                <motion.span variants={line} className="text-cyan-300">
                    {accent}
                </motion.span>
            </motion.h2>
        );
    }

    return (
        <motion.h2
            id={id}
            className={base}
            variants={container}
            {...motionProps}
        >
            <motion.span className="block" variants={line}>
                {prefix}
            </motion.span>
            <motion.span className="block text-cyan-300" variants={line}>
                {accent}
            </motion.span>
        </motion.h2>
    );
}
