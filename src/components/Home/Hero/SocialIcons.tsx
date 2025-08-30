// components/Hero/SocialIcons.tsx
"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import type { IconType } from "react-icons";
import { useId, useMemo } from "react";

type SocialIconsProps = {
    className?: string;
    delay?: number;
    stagger?: number;
    reverse?: boolean;
};

type LinkDef = { href: string; label: string; Icon: IconType };

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    },
};

// 44×44px target, visible focus, your glow/border intact
const linkBase =
    "h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center text-base sm:text-lg md:text-xl inline-flex items-center justify-center " +
    "rounded-full border border-cyan-500 text-cyan-50 " +
    "transition-colors drop-shadow-[0_0_15px_rgb(6_182_212/0.6)] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70";


export default function SocialIcons({
                                        className = "",
                                        delay = 0,
                                        stagger = 0.18,
                                        reverse = false,
                                    }: SocialIconsProps) {
    const shouldReduceMotion = useReducedMotion();
    const idPrefix = useId(); // ✅ hook at top level

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
        <motion.ul
            role="list"
            aria-label="Social links"
            className={`flex items-center gap-3 pt-4 ${className}`}
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delayChildren: delay, staggerChildren: stagger }}
        >
            {links.map(({ href, label, Icon }, i) => {
                const tooltipId = `${idPrefix}-${i}`; // ✅ stable, unique per item

                return (
                    <li key={`${label}-${href}`} role="listitem">
                        <motion.a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${label} (opens in new tab)`}
                            aria-describedby={tooltipId}
                            className={`${linkBase} group relative`}
                            variants={itemVariants}
                            whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                            title={label} // native tooltip as fallback
                        >
                            <Icon aria-hidden />

                            {/* Accessible tooltip (hover + keyboard focus) */}
                            <span
                                id={tooltipId}
                                role="tooltip"
                                className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2
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
