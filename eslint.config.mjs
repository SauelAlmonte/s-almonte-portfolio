import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local AI-assistant artifacts (gitignored, not project code).
    ".remember/**",
  ]),
  {
    // React-Compiler-era rules added by eslint-plugin-react-hooks v7
    // (via eslint-config-next 16.2.10). They flag patterns that are
    // idiomatic in react-three-fiber (imperative Three.js mutation in
    // GlobeScene) and the existing admin fetch-then-setState effects.
    // Kept visible as warnings; promote to errors as code is migrated.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
    },
  },
]);

export default eslintConfig;
