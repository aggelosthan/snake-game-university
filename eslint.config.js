
import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline']
    }
  },
  { 
    files: ['**/*.js'], 
    languageOptions: { 
      sourceType: 'module',
      ecmaVersion: 2022,
    }
  },
  { 
    files: ['**/*.{js,mjs,cjs,jsx}'], 
    languageOptions: { 
      globals: globals.browser 
    }
  },
  pluginReact.configs.flat.recommended,
]);
