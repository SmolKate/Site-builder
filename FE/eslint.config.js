import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginPrettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
// import pluginJest from "eslint-plugin-jest";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx,spec.ts,test.ts}"] },
  { ignores: ["dist"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // ...pluginJest.environments.globals.globals,
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
      jest: pluginJest,
    },
  },

  {
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
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
];
