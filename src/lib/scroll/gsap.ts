import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single GSAP + ScrollTrigger registration point for the whole site.
 *
 * Import `gsap` / `ScrollTrigger` from here instead of "gsap" directly so the
 * plugin is registered exactly once (client-side only — registering during SSR
 * throws because ScrollTrigger touches `window`). The Lenis instance created in
 * `ScrollProvider` drives ScrollTrigger's updates; nothing else should call
 * `gsap.registerPlugin(ScrollTrigger)` or create a second scroll/RAF loop.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Shared `gsap.matchMedia` conditions so every section animates (or doesn't)
 * on the same breakpoints. Pinning and heavy scroll effects belong only in
 * `desktop`; `mobile` keeps things light; the two reduced clauses must show
 * content instantly with no motion.
 */
export const SCROLL_MEDIA = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  desktopReduced: "(min-width: 1024px) and (prefers-reduced-motion: reduce)",
  mobile: "(max-width: 1023px)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger };
