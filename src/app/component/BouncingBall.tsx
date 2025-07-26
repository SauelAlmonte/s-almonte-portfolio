'use client';

import { motion } from "framer-motion";
import React from 'react';

const BouncingBall: React.FC = () => {
    return (
        <motion.div
            className="z-10 w-6 h-6 mt-6 rounded-full bg-orange-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                x: [-100, 100, -100],
            }}
            transition={{
                // Entrance
                opacity: {
                    duration: 0.6,
                    ease: "easeInOut",
                    delay: 6.5, // appears after button
                },
                y: {
                    type: "spring",
                    stiffness: 200,
                    damping: 8,
                    duration: 0.6,
                    delay: 1,
                },
                // Bounce loop
                x: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                },
            }}
        />
    );
};

export default BouncingBall;
