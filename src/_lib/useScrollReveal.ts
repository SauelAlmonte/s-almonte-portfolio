// src/_lib/useScrollReveal.ts
'use client';

import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export function useScrollReveal(options = { amount: 0.5, once: true }) {
    const ref = useRef<HTMLElement | null>(null);
    const prefersReduced = useReducedMotion() === true;
    const isInView = useInView(ref, options);
    // unified state string for motion containers
    const state: 'hidden' | 'show' = prefersReduced
        ? 'show'
        : isInView
          ? 'show'
          : 'hidden';
    return { ref, prefersReduced, isInView, state };
}
