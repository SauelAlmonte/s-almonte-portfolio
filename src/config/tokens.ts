/**
 * TypeScript mirror of the hero-derived design tokens in
 * `src/app/globals.css` (`:root` block). WebGL shaders and JS color math
 * can't read CSS custom properties, so the values are duplicated here —
 * **change both files together.** Full palette docs + contrast audit live in
 * `DESIGN-TOKENS.md`.
 */

/** The hero stage + glow, consumed by the 3D scene and JS color helpers. */
export const BRAND = {
  /** Violet-black stage behind the globe (`--stage`). */
  stage: "#080711",
  /** THE accent — the hero glow cyan (`--primary` in dark / `.cta-dome`). */
  accent: "#A8DADC",
  /** Category/data tier (`--cat-*`): identity + scene atmosphere only. */
  fullstack: "#A8DADC",
  backend: "#B39CD0",
  cloud: "#FFC1CC",
  /** AA-darkened category steps (`--cat-*-deep`) for light surfaces. */
  fullstackDeep: "#226562",
  backendDeep: "#5A4A7A",
  cloudDeep: "#A23D51",
} as const;

export type BrandColor = (typeof BRAND)[keyof typeof BRAND];
