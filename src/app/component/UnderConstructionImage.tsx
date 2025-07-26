'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

const UnderConstructionImage: React.FC = () => {
    return (
        <motion.div
            className="relative w-full max-w-4xl aspect-[16/10] mx-auto p-12"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 100,
                duration: 1,
                ease: "easeInOut",
            }}
        >
            <Image
                src="/under-construction.jpg"
                alt="Under Construction"
                fill
                priority
                className="rounded-xl shadow-lg object-cover"
            />
        </motion.div>
    );
};

export default UnderConstructionImage;
