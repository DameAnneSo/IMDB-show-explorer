import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Base JS recommended
  js.configs.recommended,

  // Browser files (your app)
  {
    files: ['src/**/*.{js,svelte}'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },

  // Node scripts
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

  ...svelte.configs['flat/recommended'],

  prettier
];
