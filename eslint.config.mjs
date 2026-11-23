import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierRecomendado from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "reports/**", "node_modules/**"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierRecomendado,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "prettier/prettier": "error",
    },
  },
);
