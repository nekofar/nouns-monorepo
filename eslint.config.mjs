import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';

// TypeScript plugins and parsers
import tseslint from 'typescript-eslint';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// React plugins (only for webapp)
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

// Other plugins
import unicornPlugin from 'eslint-plugin-unicorn';
import turbo from 'eslint-plugin-turbo';

// Compatibility layer for traditional configs
const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  // Common ignores
  {
    ignores: [
      '**/node_modules/*',
      '**/dist',
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.setup.ts',
      '**/.netlify',
      'packages/nouns-subgraph/src/types/*'
    ],
  },

  // Base TypeScript configuration for all TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      turbo,
      unicorn: unicornPlugin,
    },
    extends: [
      ...tseslint.configs.recommended,
      ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier'),
    ],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // Additional React-specific rules only for the webapp package
  {
    files: ['**/packages/nouns-webapp/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Base JS configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
    },
  },

  // Global ignores
  globalIgnores(['**/*.d.ts']),
]);
