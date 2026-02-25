"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function useGsapRef<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  return ref;
}

export function useFadeInOnScroll(selector: string, options?: gsap.TweenVars) {
  useEffect(() => {
    const elements = gsap.utils.toArray<HTMLElement>(selector);
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          ...options,
        }
      );
    });
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [selector, options]);
}
