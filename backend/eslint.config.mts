import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,ts}"],
    // plugins: { js },
    // extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json",
        // projectService: true,
      },
    },
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/*.d.ts",
      "**/.env",
      "**/.env.*",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.stylistic,
  tseslint.configs.recommended,
]);
