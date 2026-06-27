"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // One observer, one visibility map. threshold: 0 fires on ANY overlap with
    // the band, so it's independent of section height — a tall section (About is
    // pinned ~1.65 viewports, Experience's card stack is long) can't satisfy a
    // fractional threshold, since its visible area never reaches 30% of its own
    // height, and so it would never light up.
    const visibility = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting);
        }
        // Active = first section in document order currently in the band.
        // Deterministic (no "last callback wins" flicker) and biased to the
        // section occupying the top of the viewport. Keep the previous value
        // when nothing is in the band (avoids the indicator blinking off).
        const active = sectionIds.find((id) => visibility.get(id));
        if (active) setActiveSection(active);
      },
      // Band: just below the fixed nav (80px) down to 60% of the viewport.
      // Same geometry as before — only the height-relative threshold changes.
      { threshold: 0, rootMargin: "-80px 0px -40% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
