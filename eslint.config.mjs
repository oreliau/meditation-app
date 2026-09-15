import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";
import typegpu from "eslint-plugin-typegpu";
import globals from "globals";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

export default defineConfig([
  globalIgnores([
    ".expo/**",
    "android/**",
    "coverage/**",
    "dist/**",
    "docs/**",
    "ios/**",
    "sandbox/**",
  ]),
  ...compat.extends("expo"),
  typegpu.configs.recommended,
  {
    files: ["eslint.config.mjs"],
    rules: { "import/namespace": "off" },
  },
  {
    files: ["jest.setup.js", "**/__tests__/**/*.{js,ts,tsx}"],
    languageOptions: { globals: globals.jest },
  },
]);
