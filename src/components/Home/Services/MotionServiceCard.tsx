// components/Home/Services/MotionServiceCard.tsx
'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import ServiceCard from './ServiceCard';

type Props = Readonly<{
    icon: React.ReactNode;
    name: string;
    description: string;
    className?: string;
    delay?: number;
    stagger?: number;
    index?: number;
}>;

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: (d: number = 0) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: d, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function MotionServiceCard({
    icon,
    name,
    description,
    className = '',
    delay = 0,
    stagger = 0,
    index = 0,
}: Props) {
    const prefersReduced = useReducedMotion() === true;
    const finalDelay = delay + index * stagger;

    const baseCard =
        'h-full rounded-2xl border border-cyan-500/10 bg-white/5 backdrop-blur-sm ' +
        'shadow-[0_0_0_1px_rgba(0,0,0,0.06)] outline-none ' +
        'focus-visible:ring-2 focus-visible:ring-cyan-300/60 will-change-transform';

    if (prefersReduced) {
        return (
            <article className={`${baseCard} ${className}`}>
                <ServiceCard
                    icon={icon}
                    name={name}
                    description={description}
                    className="h-full"
                />
            </article>
        );
    }

    return (
        <motion.article
            custom={finalDelay}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{
                y: -4,
                transition: { type: 'spring', stiffness: 400, damping: 30 },
            }}
            whileFocus={{
                y: -4,
                transition: { type: 'spring', stiffness: 400, damping: 30 },
            }}
            className={`${baseCard} ${className}`}
        >
            <ServiceCard
                icon={icon}
                name={name}
                description={description}
                className="h-full"
            />
        </motion.article>
    );
}
