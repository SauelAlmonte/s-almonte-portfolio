"use client";

import { LazyMotion, MotionConfig } from "motion/react";

/**
 * Lightweight Motion setup.
 *
 * - `LazyMotion` + the async `loadFeatures` import means only the tiny `m`
 *   component ships in the base bundle; the ~15KB animation features load as a
 *   separate chunk on first use.
 * - `strict` makes the full `motion.*` components throw — use `m.*` from
 *   "motion/react" everywhere so the bundle stays small.
 * - `MotionConfig reducedMotion="user"` auto-disables transform/layout
 *   animations when the visitor prefers reduced motion (mirrors the GSAP
 *   reduced-motion guards in the section components).
 */
const loadFeatures = () =>
  import("@/components/common/motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
