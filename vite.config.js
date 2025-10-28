import { defineConfig } from 'vite';
import { v4wp } from '@kucrut/vite-for-wp';
import vue from '@vitejs/plugin-vue';

/**
 * Vite Configuration
 *
 * Single entry point architecture:
 * - lib/main.ts handles all auto-discovery via import.meta.glob
 * - CSS files are eagerly imported
 * - Vue components are lazy-loaded
 * - TypeScript behaviors are eagerly imported
 */
export default defineConfig({
  plugins: [
    vue(),
    v4wp({
      input: 'lib/main.ts',
      outDir: 'dist',
    }),
  ],
  server: {
    cors: true,
    strictPort: false,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          // Convert to lowercase for consistent naming
          return `js/${chunkInfo.name.toLowerCase()}.js`;
        },
        chunkFileNames: (chunkInfo) => {
          // Convert to lowercase for consistent naming
          return `js/${chunkInfo.name.toLowerCase()}.js`;
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name.toLowerCase();
          if (name.endsWith('.css')) {
            return `css/${name}`;
          }
          return `assets/${name}`;
        },
      },
    },
  },
});
