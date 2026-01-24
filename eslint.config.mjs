// Node.js Core Modules
import { resolve } from 'node:path';

// ESLint
import {
  defineConfig,
  globalIgnores,
} from 'eslint/config';

// JavaScript
import eslint from '@eslint/js';

// TypeScript
import tseslint from 'typescript-eslint';

// React
import react from 'eslint-plugin-react';

// React Hooks
import reactHooks from 'eslint-plugin-react-hooks';

// Tailwind CSS
import tailwind from 'eslint-plugin-tailwindcss';

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      react: {
        version: 'detect',
      },
      tailwindcss: {
        config: resolve('src/styles/globals.css'),
      },
    },
  },
  globalIgnores([
    '.amplify/',
    '.amplify-hosting/',
    'src/components/ui/',
    'src/hooks/use-mobile.ts',
    'src/lib/utils.ts',
  ]),
]);
