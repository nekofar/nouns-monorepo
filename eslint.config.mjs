import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';

// TypeScript plugins and parsers
import tseslint from 'typescript-eslint';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// React plugins
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

// Other plugins
import unicornPlugin from 'eslint-plugin-unicorn';
import turbo from 'eslint-plugin-turbo';
import importPlugin from 'eslint-plugin-import';
import linguiPlugin from 'eslint-plugin-lingui';
import vitestPlugin from 'eslint-plugin-vitest';
import sonarjsPlugin from 'eslint-plugin-sonarjs';

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
      '**/*.config.{js,mjs,ts,mts}',
      '**/*.setup.ts',
      '**/.netlify',
      'packages/nouns-subgraph/src/types/*',
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
      import: importPlugin,
      lingui: linguiPlugin,
      sonarjs: sonarjsPlugin,
    },
    extends: [
      ...tseslint.configs.recommended,
      ...compat.extends(
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:sonarjs/recommended',
        'prettier',
      ),
    ],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Import plugin rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/export': 'error',
      // Lingui plugin rules
      'lingui/no-unlocalized-strings': 'off',
      'lingui/t-call-in-function': 'error',
      'lingui/no-single-variables-to-translate': 'error',
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
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    extends: [...compat.extends('plugin:react/recommended')],
    rules: {
      // React hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // React rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'error',
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
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
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Import plugin rules for JS files
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/export': 'error',
    },
  },

  // Global ignores
  globalIgnores(['**/*.d.ts']),
]);
