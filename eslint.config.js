
import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginSonarjs from 'eslint-plugin-sonarjs';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginComments from 'eslint-plugin-eslint-comments';
import configPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { 
      js,
      sonarjs: pluginSonarjs,
      unicorn: pluginUnicorn,
      'eslint-comments': pluginComments,
    },
    extends: [
      'js/recommended',
      'plugin:sonarjs/recommended',
      'plugin:unicorn/recommended',
      'plugin:eslint-comments/recommended',
      'prettier',
    ],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'unicorn/prevent-abbreviations': 'off',
      'sonarjs/cognitive-complexity': ['error', 15],
    },
  },
  { 
    files: ['**/*.js'], 
    languageOptions: { 
      sourceType: 'module',
      ecmaVersion: 2022,
    },
  },
  { 
    files: ['**/*.{js,mjs,cjs,jsx}'], 
    languageOptions: { 
      globals: globals.browser,
    },
  },
  pluginReact.configs.flat.recommended,
  configPrettier,
]);
