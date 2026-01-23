// Vite
import { defineConfig } from 'vite';

// Tailwind CSS
import tailwindcss from '@tailwindcss/vite';

// vite-tsconfig-paths
import tsconfigPaths from 'vite-tsconfig-paths';

// TanStack Start
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

// React
import react from '@vitejs/plugin-react';

// Nitro
import { nitro } from 'nitro/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart(),
    react(),
    nitro(),
  ],
  nitro: {
    preset: 'aws_amplify',
    awsAmplify: {
      runtime: 'nodejs22.x',
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames({ source }) {
          if (typeof source === 'string') {
            return '[ext]/[hash][extname]';
          }

          // WOFF/WOFF2
          if (
            source[0] === 0x77 && source[1] === 0x4F && source[2] === 0x46 && source[3] === 0x46 ||
            source[0] === 0x77 && source[1] === 0x4F && source[2] === 0x46 && source[3] === 0x32
          ) {
            return 'fonts/[hash][extname]';
          }

          // GIF/JPEG/PNG
          if (
            source[0] === 0x47 && source[1] === 0x49 && source[2] === 0x46 && source[3] === 0x38 ||
            source[0] === 0xFF && source[1] === 0xD8 ||
            source[0] === 0x89 && source[1] === 0x50 && source[2] === 0x4E && source[3] === 0x47
          ) {
            return 'img/[hash][extname]';
          }

          return '[ext]/[hash][extname]';
        },
        chunkFileNames: 'js/[hash].js',
        entryFileNames: 'js/[hash].js',
      },
    },
  },
});
