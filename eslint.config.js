import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist'],
  },
  {
    // Files to lint
    files: ['**/*.{ts,tsx,js,jsx}'],

    // Define parser options to support ECMAScript modules and JSX
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },

    // Specify environments for browser, Node, and ES2020 globals
    env: {
      browser: true,
      node: true,
      es2020: true,
    },

    // Extend recommended configurations for JS, React, and TypeScript
    extends: [
      js.configs.recommended,
      'plugin:react/recommended',
      ...tseslint.configs.recommended,
    ],

    // Automatically detect the React version
    settings: {
      react: {
        version: 'detect',
      },
    },

    // Register additional plugins
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    // Combine recommended rules from react-hooks and react-refresh,
    // and add any custom rules here
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // "no-console": "warn",
      // "semi": ["error", "always"],
    },
  }
);
