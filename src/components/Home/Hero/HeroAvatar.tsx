// components/Home/Hero/HeroAvatar.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";

type Props = {
    /** Path or URL to the avatar image */
    src: string;
    /** Meaningful alternative text (WCAG 2 requirement) */
    alt: string;
    /** Intrinsic dimensions for Next.js Image optimization (does not control wrapper size) */
    size?: number;
    /** Optional extra classes to merge into wrapper */
    className?: string;
    /** Delay before entrance animation begins (in seconds) */
    delay?: number;
};

export default function HeroAvatar({
                                       src,
                                       alt,
                                       size = 150,
                                       className,
                                       delay = 0,
                                   }: Props) {
    const reduced = useReducedMotion();

    // Spring transition config for entrance animation
    const spring: Transition = { type: "spring", stiffness: 140, damping: 18, delay };

    return (
        // OUTER WRAPPER: controls avatar size and entrance animation
        <motion.div
            // Initial state (hidden, slightly rotated, scaled down, pushed down)
            initial={reduced ? false : { opacity: 0, scale: 0.94, rotate: 2, y: 8 }}
            // Animate to visible, upright, scaled normally
            animate={reduced ? {} : { opacity: 1, scale: 1, rotate: 0, y: 0 }}
            // Transition with spring physics (or none if reduced motion)
            transition={spring}
            // On hover: slight scale-up (disabled if reduced motion is on)
            whileHover={reduced ? {} : { scale: 1.02 }}
            // Responsive wrapper sizes (base = 125px, then scale up at breakpoints)
            className={`relative z-[1] 
                w-[125px] h-[125px]
                sm:w-36 sm:h-36
                md:w-40 md:h-40
                lg:w-44 lg:h-44
                xl:w-48 xl:h-48
                2xl:w-52 2xl:h-52
                [@media(min-width:2560px)]:w-56 [@media(min-width:2560px)]:h-56
                ${className ?? ""}`}
        >
            {/* INNER WRAPPER: subtle idle animation (bobbing effect) */}
            <motion.div
                animate={reduced ? {} : { y: [0, -2, 0] }} // Moves up/down slightly
                transition={
                    reduced
                        ? {} // No animation if reduced motion is on
                        : { duration: 5, repeat: Infinity, ease: "easeInOut", delay }
                }
                className="relative h-full w-full"
            >
                {/* CYAN HALO GLOW: purely decorative, hidden from AT */}
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-2xl"
                    style={{
                        background:
                            "radial-gradient(closest-side, rgba(34,211,238,0.7), rgba(34,211,238,0) 70%)",
                        transform: "scale(1.25)", // enlarge glow around avatar
                    }}
                    animate={reduced ? { opacity: 0.45 } : { opacity: [0.35, 0.65, 0.35] }}
                    transition={
                        reduced
                            ? {}
                            : {
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: delay + 0.05,
                            }
                    }
                />

                {/* AVATAR IMAGE (essential content, requires descriptive alt text) */}
                <Image
                    src={src}
                    alt={alt} // Required for WCAG compliance
                    width={size} // intrinsic size for Next/Image optimization
                    height={size}
                    priority // load eagerly for faster LCP
                    className="w-full h-full rounded-full border border-cyan-500
                        drop-shadow-[0_0_15px_rgb(6_182_212/0.6)] object-cover"
                />
            </motion.div>
        </motion.div>
    );
}
