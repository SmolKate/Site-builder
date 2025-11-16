import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginPrettier from "eslint-plugin-prettier";
import importPlugin from 'eslint-plugin-import';
import prettierConfig from "eslint-config-prettier";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { ignores: ["dist"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: pluginPrettier,
      import: importPlugin
    },
  },

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      indent: ["error", 4],
      semi: [2, "always"],
      "space-before-function-paren": ["error", "never"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      "max-len": ["error", { "code": 100 }],
      "no-console": "error",
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      ...importPlugin.configs.recommended.rules,
      "import/no-cycle": "error"
    },
  },
];
