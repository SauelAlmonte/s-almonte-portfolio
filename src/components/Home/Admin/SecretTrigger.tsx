"use client";

import { FiLock } from "react-icons/fi";
import React, { useState } from "react";

type SecretTriggerProps = {
    onOpen?: () => void;
};

const SecretTrigger = ({ onOpen }: SecretTriggerProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="relative ml-2 w-10 h-10">
            <div
                tabIndex={0}
                aria-label="Admin Login"
                className="absolute inset-0 cursor-pointer select-none outline-none"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={onOpen}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onOpen?.();
                    }
                }}
            >
                <span
                    className={`
                    absolute left-1/2 top-1/2
                    -translate-x-1/2 -translate-y-1/2
                    transition-opacity duration-200
                    ${hovered ? "opacity-100" : "opacity-0"}
                    text-cyan-400 text-xl pointer-events-none
                  `}
                >
                  <FiLock aria-hidden />
                </span>
            </div>
        </div>
    );
};

export default SecretTrigger;
