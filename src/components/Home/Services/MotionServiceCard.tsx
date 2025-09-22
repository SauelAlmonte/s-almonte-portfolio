// components/Home/Services/MotionServiceCard.tsx
"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import ServiceCard from "./ServiceCard";

type Props = Readonly<{
    icon: React.ReactNode;
    name: string;
    description: string;
    className?: string;
    /** Base entrance delay (seconds) set from Services.tsx */
    delay?: number;
    /** Per-card extra delay (seconds) set from Services.tsx */
    stagger?: number;
    /** Position in the list, provided by Services.tsx map callback */
    index?: number;
}>;

// Use cubic-bezier array for TS-safe easing (avoids string "easeOut" error)
const cardVariants: Variants = {
    // hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: (d: number = 0) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: d, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function MotionServiceCard({
                                              icon,
                                              name,
                                              description,
                                              className,
                                              delay = 0,
                                              stagger = 0,
                                              index = 0,
                                          }: Props) {
    const prefersReduced = useReducedMotion() === true;
    const finalDelay = delay + index * stagger;

    if (prefersReduced) {
        return (
            <ServiceCard
                icon={icon}
                name={name}
                description={description}
                className={className}
            />
        );
    }

    return (
        <motion.div
            custom={finalDelay}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="h-full"
        >
            <ServiceCard
                icon={icon}
                name={name}
                description={description}
                className={className}
            />
        </motion.div>
    );
}
