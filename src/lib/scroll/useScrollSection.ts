"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "./gsap";

/**
 * Register a section's scroll-driven animations (Phase 2 plug-in point).
 *
 * Wraps `gsap.matchMedia` scoped to the section element: selector strings in
 * tweens resolve inside the section, and everything created in `setup` is
 * reverted automatically on unmount / Fast Refresh — no leaked ScrollTriggers,
 * no duplicate tweens.
 *
 * Usage:
 * ```tsx
 * const sectionRef = useRef<HTMLElement>(null);
 * useScrollSection(sectionRef, (mm) => {
 *   mm.add(SCROLL_MEDIA.desktop, () => {
 *     gsap.to("[data-reveal]", { opacity: 1, scrollTrigger: { ... } });
 *   });
 *   mm.add(SCROLL_MEDIA.reduced, () => {
 *     gsap.set("[data-reveal]", { opacity: 1 });
 *   });
 * });
 * ```
 *
 * `setup` runs once on mount by design — it must not close over reactive
 * state. Read live values inside ScrollTrigger callbacks instead.
 */
export function useScrollSection(
  scope: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia) => void,
): void {
  useEffect(() => {
    const mm = gsap.matchMedia(scope);
    setup(mm);
    return () => mm.revert();
    // Intentionally mount-only: re-running would tear down and rebuild every
    // trigger whenever the parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
