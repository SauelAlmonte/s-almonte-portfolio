"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query subscription. Returns `false` on the server and for
 * the hydration pass, then snaps to the real value and tracks changes —
 * `useSyncExternalStore` is React's sanctioned way to read browser state
 * without a hydration mismatch (no set-state-in-effect, no mount gate).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
