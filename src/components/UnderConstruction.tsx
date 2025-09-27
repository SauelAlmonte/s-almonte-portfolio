'use client';

import React from "react";

const UnderConstruction = () => (
    <div
        className="absolute inset-0 z-50 flex items-center justify-center bg-white/10 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-500 max-w-7xl mx-auto"
    >
        <div className="px-8 py-4 rounded-xl bg-white/70 shadow-lg border border-cyan-300/60">
            <span className="text-2xl sm:text-3xl font-bold text-cyan-700 drop-shadow">
                Under Construction
            </span>
        </div>
    </div>
);

export default UnderConstruction;
