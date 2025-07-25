'use client';

import { motion } from "framer-motion";
import React from 'react';

const BouncingBall: React.FC = () => {
    return (
        <motion.div
            className="z-10 w-6 h-6 mt-4 rounded-full bg-orange-500 "
            animate={{
                x: [-100, 100, -100]
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
};

export default BouncingBall;
