import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.astro', '.wrangler', 'worker-configuration.d.ts', 'flyer', 'emdash-env.d.ts', '.emdash', '.agents']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      'no-console': 'error',
    },
  },
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs', 'astro.config.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.node,
    },
  },
])
