// components/Hero/SocialIcons.tsx
"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import type { IconType } from "react-icons";
import { useId, useMemo } from "react";

type SocialIconsProps = {
    /** Optional class overrides/extensions (Tailwind 4.1) */
    className?: string;
    /** Delay (seconds) before the first icon animates in */
    delay?: number;
    /** Time (seconds) between each icon’s entrance */
    stagger?: number;
    /** Reverse the visual order (e.g., for end-aligned layouts) */
    reverse?: boolean;
};

type LinkDef = { href: string; label: string; Icon: IconType };

/** Parent UL animation states */
const containerVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
};

/** Individual icon animation states */
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    },
};

// 44×44px minimum hit target, visible focus, border/glow preserved
const linkBase =
    "h-9 w-9 sm:h-11 sm:w-11  mt-1 " +
    "flex items-center justify-center text-base sm:text-lg md:text-xl" +
    "inline-flex items-center justify-center " +
    "rounded-full border border-cyan-500 text-cyan-50 " +
    "transition-colors drop-shadow-[0_0_15px_rgb(6_182_212/0.6)] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70";

export default function SocialIcons({
                                        className = "",
                                        delay = 0,
                                        stagger = 0.18,
                                        reverse = false,
                                    }: SocialIconsProps) {
    // Normalize to a strict boolean (useReducedMotion can be boolean | null)
    const prefersReduced = useReducedMotion() === true;

    // Stable id seed for tooltips
    const idPrefix = useId();

    // Define links once; labels are used for aria-label & tooltip text
    const baseLinks: LinkDef[] = useMemo(
        () => [
            { href: "https://www.linkedin.com/in/sauel-almonte/", label: "LinkedIn", Icon: FaLinkedin },
            { href: "https://github.com/SauelAlmonte", label: "GitHub", Icon: FaGithub },
            { href: "https://youtube.com/", label: "YouTube", Icon: FaYoutube },
            { href: "/resume/sauel_almonte_resume.pdf", label: "Resume", Icon: IoDocumentTextSharp },
        ],
        []
    );

    const links = reverse ? [...baseLinks].reverse() : baseLinks;

    return (
        // UL with ARIA labeling for SR users; individual items are LIs
        <motion.ul
            role="list"
            aria-label="Social links"
            className={`flex items-center gap-3 pt-4 ${className}`}
            variants={containerVariants}
            // When reduced motion is requested, skip animation init entirely
            initial={prefersReduced ? false : "hidden"}
            whileInView={prefersReduced ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            // Stagger children (not deprecated; safe in modern Framer Motion)
            transition={{ delayChildren: delay, staggerChildren: stagger }}
        >
            {links.map(({ href, label, Icon }, i) => {
                const tooltipId = `${idPrefix}-${i}`; // unique, stable per item

                return (
                    <li key={`${label}-${href}`} role="listitem">
                        <motion.a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            // Explicit name and that it opens a new tab
                            aria-label={`${label} (opens in new tab)`}
                            // Tie trigger to the tooltip content (WCAG-friendly tooltip pattern)
                            aria-describedby={tooltipId}
                            className={`${linkBase} group relative`}
                            variants={itemVariants}
                            // Motion interactions disabled when reduced motion is requested
                            whileHover={prefersReduced ? undefined : { scale: 1.08 }}
                            whileTap={prefersReduced ? undefined : { scale: 0.96 }}
                            title={label} // native tooltip fallback
                        >
                            {/* Icon itself is decorative once the link has a clear label */}
                            <Icon aria-hidden={true} focusable="false" />

                            {/* Accessible tooltip: shown on hover and keyboard focus */}
                            <span
                                id={tooltipId}
                                role="tooltip"
                                className="
                                          pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2
                                          whitespace-nowrap rounded-md bg-cyan-700 px-2 py-1
                                          text-xs font-semibold text-cyan-50
                                          opacity-0 transition
                                          group-hover:opacity-100 group-focus-visible:opacity-100"
                            >
                                {label}
                            </span>
                        </motion.a>
                    </li>
                );
            })}
        </motion.ul>
    );
}
