import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-multiple-empty-lines': ['error'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-magic-numbers': ['error'],
    },
  },
];
