import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    ignores: ['dist', 'node_modules', '**/coverage/**'],
  },
  ...compat.extends('eslint:recommended'),
  {
    plugins: {},

    languageOptions: {
      globals: {
        ...globals.node,
        // ...globals.es5,
        ...globals.expect,
        document: true,
        window: true,
        chrome: true,
        alert: true,
        confirm: true,
        MutationObserver: true,
      },

      ecmaVersion: 2022,
      sourceType: 'module',
    },

    rules: {
      'no-console': 1,
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-bitwise': 0,
    },
  },
];
