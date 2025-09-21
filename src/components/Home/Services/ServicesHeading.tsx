"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
    /** The id used by <section aria-labelledby "..."> */
    id?: string;
    /** Tailwind overrides/extensions */
    className?: string;
    /** Entrance delay (seconds) for line 1 */
    delay?: number;
    /** Extra delay (seconds) added per line (line2 = delay+stagger, line3 = delay+2*stagger) */
    stagger?: number;
};

export default function ServiceHeading({
                                           id = "services-heading",
                                           className,
                                           delay = 0,
                                           stagger = 0.18,
                                       }: Props) {
    const prefersReduced = useReducedMotion() === true;

    const base =
        className ??
        "text-balance font-inter text-center font-semibold tracking-wide leading-[1.2] " +
        "text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mt-4";

    return (
        <h2 id={id} tabIndex={-1} className={base}>
            {/* Line 1 */}
            <motion.span
                className="block"
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                    prefersReduced ? undefined : { duration: 0.22, ease: "easeOut", delay }
                }
            >
                Collaborate with brands
            </motion.span>

            {/* Line 2 (cyan accent inside) */}
            <motion.span
                className="block"
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                    prefersReduced
                        ? undefined
                        : { duration: 0.22, ease: "easeOut", delay: delay + 1 * stagger }
                }
            >
                and agencies to deliver{" "}
                <span className="text-cyan-300 font-bold">bold</span>,
            </motion.span>

            {/* Line 3 (cyan accents inside) */}
            <motion.span
                className="block"
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                    prefersReduced
                        ? undefined
                        : { duration: 0.22, ease: "easeOut", delay: delay + 2 * stagger }
                }
            >
                <span className="text-cyan-300 font-bold">unforgettable results</span>{" "}
                that <span className="text-cyan-300 font-bold">inspire</span>.
            </motion.span>
        </h2>
    );
}
