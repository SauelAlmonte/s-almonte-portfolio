import { domAnimation } from "motion/react";

/**
 * Motion's DOM animation feature bundle, isolated in its own module so
 * `MotionProvider` can code-split it via a dynamic import. This keeps the
 * features (~15KB) out of the initial bundle — they load as a separate chunk
 * the first time an `m.*` component animates.
 *
 * `domAnimation` covers: animate, variants, exit (AnimatePresence), and
 * hover / tap / focus gestures. Swap to `domMax` only if you later need
 * layout or drag animations (heavier).
 */
export default domAnimation;