// Vite
import { defineConfig } from 'vite';

// Tailwind CSS
import tailwindcss from '@tailwindcss/vite';

// vite-tsconfig-paths
import tsconfigPaths from 'vite-tsconfig-paths';

// TanStack Start
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

// Unfonts
import Unfonts from 'unplugin-fonts/vite';

// React
import react from '@vitejs/plugin-react';

// Nitro
import { nitro } from 'nitro/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart(),
    Unfonts({
      google: {
        families: [
          {
            name: 'Noto Sans JP',
          },
        ],
      },
    }),
    react(),
    nitro(),
  ],
  nitro: {
    preset: 'aws_amplify',
    awsAmplify: {
      runtime: 'nodejs22.x',
    },
  },
});
