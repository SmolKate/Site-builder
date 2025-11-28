import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginPrettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    ignores: ["dist", "node_modules", "coverage"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    settings: {
      "import/resolver": {
        typescript: true,
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".svg"],
        },
      },
    },
  },

  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: pluginPrettier,
      import: importPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      indent: ["error", 2],
      semi: [2, "always"],
      "space-before-function-paren": ["error", "never"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      "max-len": ["error", { code: 120 }],
      "no-console": "error",
      "linebreak-style": ["error", "unix"],
      ...importPlugin.configs.recommended.rules,
      "import/no-cycle": "error",
    },
  },
];
