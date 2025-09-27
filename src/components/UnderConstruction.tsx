"use client";

import React from "react";

const UnderConstruction = () => (
  <div
	  className="isolate absolute inset-0 z-50 flex items-center justify-center bg-white/10 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-cyan-400 max-w-7xl mx-auto"
  >
    <div
		className="px-8 py-4 rounded-2xl bg-cyan-50 shadow-2xl border-2 border-cyan-300 z-30 drop-shadow-2xl"
	>
      <span
		  className="text-2xl sm:text-3xl font-bold text-zinc-700 z-50"
	  >
        Under Construction
      </span>
    </div>
  </div>
);

export default UnderConstruction;
