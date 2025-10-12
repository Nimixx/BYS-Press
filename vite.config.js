import { defineConfig } from 'vite';
import { v4wp } from '@kucrut/vite-for-wp';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte(),
    v4wp({
      input: 'src/js/main.ts',
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
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
