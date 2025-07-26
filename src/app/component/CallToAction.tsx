'use client';

import { motion } from "framer-motion";
import React from "react";

const CallToAction: React.FC = () => {
    return (
        <div className="flex flex-col items-center z-10 mt-4">
            {/* Paragraph */}
            <motion.p
                className="mt-2 text-lg leading-relaxed text-gray-800 dark:text-gray-100 text-center max-w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 60,
                    duration: 10,
                    delay: 3,
                    ease: "easeInOut",
                }}
            >
                Currently updating portfolio using Next.js, TypeScript, TailwindCSS, and Framer Motion.
            </motion.p>

            {/* Button */}
            <motion.a
                href="https://www.linkedin.com/in/sauel-almonte/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-6 py-2 text-base text-white font-medium bg-blue-700 rounded-full shadow hover:bg-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 60,
                    duration: 0.5,
                    delay: 4.5,
                    ease: "easeOut",
                }}
            >
                Connect with me on LinkedIn
            </motion.a>
        </div>
    );
};

export default CallToAction;
