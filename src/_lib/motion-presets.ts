// src/_lib/motion-presets.ts
import { stagger, type Variants } from 'framer-motion';

export const buildContainer = (
    gap = 0.18,
    startDelay = 0.28,
    duration = 0.5
): Variants => ({
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration,
            ease: 'easeOut',
            delayChildren: stagger(gap, { startDelay }),
        },
    },
});

export const buildItem = (dy = 16, duration = 0.28): Variants => ({
    hidden: { opacity: 0, y: dy },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration, ease: 'easeOut' },
    },
});

export const inViewTrigger = { amount: 0.5, once: true } as const;
