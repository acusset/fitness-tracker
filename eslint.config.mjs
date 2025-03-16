import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginReactConfig from 'eslint-plugin-react';
import globals from 'globals';

export default [
  { plugins: { pluginReactConfig } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginPrettier,
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-multiple-empty-lines': ['error'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-magic-numbers': ['error'],
      'no-console': ['error'],
      'no-trailing-spaces': ['error'],
      'import/order': ['error'],
      'import/no-duplicates': ['error'],
      'prettier/prettier': ['error'],
    },
  },
];
