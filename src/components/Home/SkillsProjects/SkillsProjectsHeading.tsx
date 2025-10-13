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
    /** If true (default) this heading inherits animation from parent container */
    controlledByParent?: boolean;
};

export default function SkillsProjectsHeading({
    id,
    className,
    delay = 0,
    stagger = 0.18,
    controlledByParent = true,
}: Props) {
    const prefersReduced = useReducedMotion() === true;
    const base =
        className ??
        'text-center text-2xl md:text-4xl xl:text-5xl font-bold text-cyan-50';

    if (prefersReduced) {
        return (
            <h2 id={id} className={base}>
                Tech Stack
                <br />
                <span className="text-cyan-300">Skills</span>{' '}
                <span className="text-3xl">&</span>{' '}
                <span className="text-cyan-300">Projects</span>
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
                Tech Stack
            </motion.span>
            <motion.span className="block" variants={line}>
                <span className="text-cyan-300">Skills</span>{' '}
                <span className="text-3xl">&</span>{' '}
                <span className="text-cyan-300">Projects</span>
            </motion.span>
        </motion.h2>
    );
}
