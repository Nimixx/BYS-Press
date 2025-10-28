import { defineConfig } from 'vite';
import { v4wp } from '@kucrut/vite-for-wp';
import vue from '@vitejs/plugin-vue';
import { globSync } from 'glob';

/**
 * Auto-discover component assets
 * Finds all .css and .ts files in components/, layouts/, and pages/ directories
 */
function discoverAssets() {
  const entries = {};

  // Discover component CSS files
  const componentStyles = globSync('components/**/*.css');
  componentStyles.forEach((path) => {
    const match = path.match(/components\/(.+)\/(.+)\.css/);
    if (match) {
      const componentName = match[1];
      entries[`components/${componentName.toLowerCase()}`] = path;
    }
  });

  // Discover component TypeScript files
  const componentScripts = globSync('components/**/*.ts');
  componentScripts.forEach((path) => {
    const match = path.match(/components\/(.+)\/(.+)\.ts/);
    if (match) {
      const componentName = match[1];
      // Only add if not already added by CSS
      if (!entries[`components/${componentName.toLowerCase()}`]) {
        entries[`components/${componentName.toLowerCase()}-script`] = path;
      }
    }
  });

  // Discover layout assets
  const layoutAssets = globSync('layouts/**/*.{css,ts}');
  layoutAssets.forEach((path) => {
    const match = path.match(/layouts\/(.+)\/(.+)\.(css|ts)/);
    if (match) {
      const layoutName = match[1];
      const ext = match[3];
      entries[`layouts/${layoutName.toLowerCase()}-${ext}`] = path;
    }
  });

  // Discover page assets
  const pageAssets = globSync('pages/**/*.{css,ts}');
  pageAssets.forEach((path) => {
    const match = path.match(/pages\/(.+)\/(.+)\.(css|ts)/);
    if (match) {
      const pageName = match[1];
      const ext = match[3];
      entries[`pages/${pageName.toLowerCase()}-${ext}`] = path;
    }
  });

  return entries;
}

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
