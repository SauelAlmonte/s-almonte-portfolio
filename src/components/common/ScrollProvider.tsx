"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/scroll/gsap";

/**
 * Site-wide smooth scroll. ONE Lenis instance drives GSAP ScrollTrigger:
 *
 * - `autoRaf: false` + `gsap.ticker.add` → Lenis rides GSAP's ticker, so the
 *   whole site runs a single RAF loop (never add another).
 * - `lenis.on("scroll", ScrollTrigger.update)` keeps scrubbed/pinned tweens in
 *   lockstep with the smoothed scroll position.
 * - `lagSmoothing(0)` stops GSAP from time-shifting after dropped frames,
 *   which would visibly desync scroll-driven animations.
 * - `anchors: true` makes plain `<a href="#section">` links scroll through
 *   Lenis instead of jumping natively.
 *
 * Under `prefers-reduced-motion` no Lenis instance is created at all — the
 * page scrolls natively and `useScrollTo` falls back to instant jumps.
 * ScrollTrigger works fine over native scroll, so section animations (already
 * guarded by their own reduced-motion clauses) are unaffected.
 */
const LenisContext = createContext<Lenis | null>(null);

/** The live Lenis instance, or null under reduced motion / before hydration. */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Scroll to an in-page anchor (e.g. "#about") through Lenis. Use this from
 * any click handler instead of `scrollIntoView`, which would fight Lenis's
 * smoothing. Falls back to a native jump when Lenis is absent.
 */
export function useScrollTo(): (hash: string) => void {
  const lenis = useContext(LenisContext);
  return useCallback(
    (hash: string) => {
      if (lenis) {
        lenis.scrollTo(hash);
        return;
      }
      const el = document.getElementById(hash.replace("#", ""));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    },
    [lenis],
  );
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const create = () => {
      if (instance) return;
      instance = new Lenis({ autoRaf: false, anchors: true });
      instance.on("scroll", ScrollTrigger.update);
      tick = (time: number) => instance?.raf(time * 1000); // ticker is seconds, Lenis wants ms
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
    };

    const destroy = () => {
      if (!instance) return;
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP's default
      instance.destroy();
      instance = null;
      tick = null;
      setLenis(null);
    };

    // React live to the OS-level reduced-motion toggle.
    const sync = () => (mq.matches ? destroy() : create());
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
