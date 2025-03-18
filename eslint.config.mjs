import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginReactConfig from "eslint-plugin-react";
import globals from "globals";

const INDENTATION = 2;

export default [
  { files: ["**/*.ts", "**/*.tsx"] },
  { plugins: { pluginReactConfig } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  {
    files: [
      "*.ts",
      "*.tsx",
      "**/*.js",
      "**/*.jsx",
      "**/*.mjs",
      "**/*.mjsx",
      "**/*.cjs",
      "**/*.cjsx",
      "*.json",
    ],
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-magic-numbers": ["error"],
      "no-console": ["error"],
      "no-trailing-spaces": ["error"],
      "import/order": ["error"],
      "import/no-duplicates": ["error"],
      "indent": ["error", INDENTATION],
    },
  },
];
