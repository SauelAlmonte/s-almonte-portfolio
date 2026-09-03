import { setConsoleFunction } from "three";

/*
 * three r183 deprecated `Clock`, but @react-three/fiber (≤9.7) still
 * constructs one per <Canvas> for its render loop, so every canvas mount
 * logs "THREE.Clock: This module has been deprecated. Please use
 * THREE.Timer instead." — twice on this site (hero globe + portrait halo).
 * Our code never instantiates Clock (we only read `state.clock`).
 *
 * Filter exactly that line through three's official console hook
 * (`setConsoleFunction`, added alongside the r183 deprecations) and forward
 * everything else to the native console unchanged. Delete this module once
 * fiber's loop moves to THREE.Timer.
 */
setConsoleFunction((type: string, message: unknown, ...params: unknown[]) => {
  if (
    type === "warn" &&
    typeof message === "string" &&
    message.startsWith("THREE.Clock: This module has been deprecated")
  ) {
    return;
  }
  const forward =
    type === "error" ? console.error : type === "warn" ? console.warn : console.log;
  forward(message, ...params);
});
