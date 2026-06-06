/**
 * Cross-tree signal for the hero globe settling.
 *
 * The dotted globe lives inside `Hero` (home page only); the `Navbar` is a
 * separate global component. This tiny pub/sub lets the globe tell the header
 * "I've landed" without prop-drilling through the layout. Subscribing after the
 * globe already settled fires the callback immediately, so there's no race where
 * a late listener misses the signal.
 */
let settled = false;
const listeners = new Set<() => void>();

/** Called by the hero once the globe converges on its target. */
export function markHeroSettled(): void {
  if (settled) return;
  settled = true;
  for (const cb of listeners) cb();
  listeners.clear();
}

/**
 * Run `cb` when the hero globe has settled. Fires synchronously if it already
 * has. Returns an unsubscribe function.
 */
export function onHeroSettled(cb: () => void): () => void {
  if (settled) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}
